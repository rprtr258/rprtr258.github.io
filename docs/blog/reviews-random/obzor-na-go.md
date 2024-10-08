# Рофлообзор на Go

Go не который [ходить или гулять](https://en.wiktionary.org/wiki/go), и не который [настольная игра](https://en.wikipedia.org/wiki/Go_(game)), а [язык программирования](https://go.dev/).

## if err != nil 🤙
Про это не писал только ленивый. Авторы решили отказаться от исключений и от монады `Result` так же. В итоге все функции должны возвращать либо результат, либо ошибку, но при этом, если ошибки нет, то надо вместо нее возвращать `nil`, а если нет значения, то `err != nil` и в значении неважно что. При этом иногда встречаются функции, которые возвращают и значение и ошибку, и просят обработать значение, прежде чем смотреть на ошибку. Как пример, попробуйте разобраться, что возвращает [`io.Reader.Read`](https://pkg.go.dev/io#Reader) и как это правильно обрабатывать и реализовывать.

В итоге вместо нормальной семантики `либо значение, либо ошибка` имеем кучу бойлерплейта и лишних возможных значений.

## Суммы типов
Их нет. Авторы языка в принципе решили, что они умнее кого-то, и забыли, что такое теория типов. В итоге в языке нет ни енамов, ни типов-сумм, ни явных реализацией интерфейсов, зато есть неявная реализация интерфейсов и целых два типа нулевого размера(зачем?) `struct{}` и `[0]T`.

Но, что если мы очень-очень хотим сумму типов, хотя бы енамы. Для этого с версии 1.18 есть целых два варианта, с разным набором недостатков.

### Кастомный тип
Для енама создается кастомный тип и несколько значений этого типа, например:
```go
type Color int

const (
    Red   Color = 0
    Green Color = 1
    Blue  Color = 2
)
```

Но это слишком вербозно, поэтому behold, авторы языка придумали как уменьшить количество бойлерплейта в коде выше:
```go
type Color int

const (
    Red Color = iota
    Green
    Blue
)
```

Получилось на 20 символов меньше. На самом деле проблема с этими енамами вообще в другом, например никто не мешает нам сделать `Color(42)`. Но даже против такого есть противоядие:
```go
type Color struct {
	value int
}

var (
	Red   = Color{0}
	Green = Color{1}
	Blue  = Color{2}
)
```

Да, теперь это не константы, поэтому `iota` нельзя использовать. Это более-менее жизнеспособное решение, если мы не хотим, чтобы красный цвет отдельно имел несколько оттенков. Тогда придется делать как-то так.
```go
type Color struct {
	value int
    // if not red - unused
    intensity int
}

func Red(intensity int) Color{
    return Color{0, intensity}
}

var (
	Green = Color{1, 0}
	Blue  = Color{2, 0}
)
```
Получаем то же, что с `value, err` - лишнее поле для всех енамов, хотя оно не используется. Как этим в итоге пользоваться и доставать оттенок только из красного цвета имаджинируйте сами.

### Через constraint
Второй способ я узнал сегодня утром, и не зря я узнал его так поздно - он еще хуже. Идея в следующем:
```go
type Red struct {
    intensity int
}

type Green struct{}

type Blue struct{}

type Color interface {
    Red | Green | Blue
}
```
И все вроде бы прекрасно и почти даже без бойлерплейта. Как же этим пользоваться, чтобы например узнать название цвета?
```go
func colorName[C Color](color C) string {
    switch c := any(color).(type) {
    case Red:
        return "red"
    case Green:
        return "green"
    case Blue:
        return "blue"
    default:
        panic(c)
    }
}
```

Да, вам нужно кастить `color` к `any`, потому что лол, тип же известен: это `C`:
```
cannot use type switch on type parameter value color (variable of type C constrained by Color)
```

Ну допустим мы готовы на эту странную синтаксическую жертву, в остальном все прекрасно же? Во-первых этот `switch` никто кроме вас не будет проверять на полноту, если вы хоть в одном месте пропустите хоть одно значение енама, вы попадете в `default`, а там зависит от того, что вы там написали. Компилятор же не сможет посмотреть на определение констреинта `Color` и сам проверить, исчерпывающий `switch-case` или нет.

Вторая проблема встала, когда мне понадобилось создать енам. Как же его создать? Простой вариант:
```go
color := Green{}
```

Ничего сложного. Пусть теперь я хочу вернуть его из функции:
```go
func parseColor(s string) (Color, error) {
    switch s {
    case "red":
        return Red{0}, nil
    case "green":
        return Green{}, nil
    case "blue":
        return Blue{}, nil
    default:
        return nil, fmt.Errorf("unknown color %q", s)
    }
}
```
С этим кодом есть одна маленькая проблема - он не компилируется:
```
cannot use type Color outside a type constraint: interface contains type constraints
```

Исправить это на генерик не получится, ибо возвращаемые значения разных типов. Единственный вариант заставить это работать - возвращать `any`. Да-да, не удивляйтесь, придется возвращать `any` и до самого метода разбора свичкейсами обратно везде писать, что это на самом деле не `any`, а `Color`.

### Через интерфейсы
Раз заговорили не только про енамы, а еще и про типы-суммы, посмотрим еще один способ, как их сделать:
```go
type Color interface {
    isColor()
}

type Red int
func (Red) isColor() {}

type Green struct{}
func (Green) isColor() {}

type Blue struct{}
func (Blue) isColor() {}
```

Именно так и реализованы `oneOf` поля в сгенерированном для `grpc` коде, разве что там интерфейс называется `isColor` и соответственно приватный и его нельзя перекинуть между функциями без использования `any`. С этим способом тоже есть недостатки:
- много кода
- `switch-case` никто за вас все еще не проверит

В итоге способ представления енамов зависит от того, минусы какого представления навредят вам меньше всего в каждом конкретном случае.

## Про линтеры
Да, Go не компилируется, если есть неиспользуемые локальные переменные и/или импорты. Да, Go компилируется если есть неиспользуемые константы, структуры, интерфейсы, функции, методы, аргументы функции, возвращаемые значения и глобальные переменные. Да, непоследовательно. Да и вообще, для того, чтобы писать адекватный код, вам нужно следить глазами за многими моментами. Ну или не нужно, ведь мы программисты и заставим компьютер смотреть все это за нас. Это изобретение назвали линтерами. В итоге имеем, что чтобы программировать на го, надо использовать локальные переменные и обмазаться кучей линтеров, которые проверяют все остальное, что не проверяет компилятор.

## Кодген
Также программисты на Go не любят писать код на Go, типо енамов с кучей бойлерплейтов или что-то подобное. Поэтому придумали еще одну автоматизацию - кодген. Делается через стороннее приложение которое генерит файлы с кодом исходя из флагов, которые вы передали, существующих файлов, и бог весть чего еще, все равно никто не смотрит, что там нагенерено. Получается этакий препроцессор, который специализирован под конкретный случай кодгена и который надо запускать руками отдельно от компилятора.

## Генерик методы
Их нет. Увы. Авторы языка 20 лет добавляли хотя бы генерики, которые есть сейчас, такими темпами, если генерик методы и добавят, то лет через 100.

## Pointer vs Value receivers
Да, если нужно менять значение в методе, нужно использовать поинтер ресивер. Почему нельзя везде использовать поинтер ресивер и зачем нужен value ресивер никто не знает.

## Обьявление переменных
Вернемся к базе, к обьявлению переменных. Есть целых три способа обьявить переменную:
```go
var x int // без инициализации
var x int = 4 // с инициализацией
x := 4 // с инициализацией
```
Зачем нужны два способа обьявления с инициализацией никто не знает. На самом деле, скажу больше, по задумке достаточно лишь одного синтаксиса:
```go
x : (type, if no - derived) (= init, if no - zero)
```
с ограничением, что либо тип, либо начальное значение (хотя бы одно из двух) было указано:
```go
x : int
x : int = 0
x := 0
```
Но что-то пошло не так и авторы языка решили добавить ключевое слово `var` и второй способ сделать `x := init`.

Это становится еще страннее, если вспомнить, что для глобальных переменных можно использовать только формы обьявления с `var`, нельзя обьявить глобальную переменную так:
```go
cacheSize := 100
```

Почему, никто не знает.

## For range loop
Мне нравится, как разные виды циклов помещаются в одном ключевом слове:
```go
for { // infinite loop
    // work
}

for !closed { // while loop
    // work
}

for i := 0; i < n; i++ { // for (int i = 0; i < n; ++i) loop
    // work
}
```

Но кто ударил авторов языка по башке и заставил добавить еще слово range для range-loop?
```go
for index, element := range []string{"string", "slice"} { // for over slice
    // ...
}

for key, value := range map[string]any{"key": 3} { // for over map
    // ...
}

ch := make(chan int)
for value := range ch { // for over chan
    // ...
}
```

Поправьте меня, если я ошибаюсь, но ни один из синтаксисов для лупа по коллекции не пересекается с предыдущими циклами, если убрать ключевое слово `range`. На всякий случай уточню, что в `for i := 0; i < n; i++` все три стейтмента обязательны, то есть в лучшем случае можно сделать
```go
i := 0
for ; i < n; { // go fmt исправляет это на for i < n
    print(i)
    i++
}
// или
for ; i < n; i++ { // а здесь не исправляет
    print(i)
}
```

Зачем тогда нужно ключевое слово `range` - никто не знает.

## New
Последнее бесполезное ключевое слово - `new`, единственный юзкейс которого - создать указатель на примитивный тип, инициализированный нулем. Для того же плюс минус пять секунд пишется [функция](https://github.com/samber/lo#empty):
```go
func Zero[T any]() T {
    var zero T
    return zero
}
```

Есть [пост](https://dave.cheney.net/2014/08/17/go-has-both-make-and-new-functions-what-gives) от одного из авторов языка, обьясняющий, почему нужно ключевое слово `make` и нельзя все делать с помощью `new` - потому что `make` создает слайсы, мапы и каналы (да, как и написано в документации). Зачем же нужно слово `new` - никто не знает.

## context.Context
В Go есть концепция, что все фичи языка должны быть ортогональны. То есть делать разные вещи и работать вместе. Тогда кому пришло в голову добавить `context.Context` который ответственен И за остановку горутин И за хранение `map[any]any`? Можно возразить, что это не часть языка, но лично я вижу линтеры, которые говорят как пользоваться контекстами (первый аргумент, не хранить в структуре), правила, рядом с другими правилами языка, как писать идиоматичный код и пользоваться контекстами, код разных проектов, который использует контексты, а не самописный механизм отмены горутин (хотя что там писать, всего один канал). Поэтому лично я вполне считаю проебы стандартной библиотеки, и в частности `context.Context`, проебом языка.

## std
К слову о стандартной библиотеке, ей кто-то пользуется. Ну всмысле прям в хотя бы насколько то большом проекте? Обычно я вижу примерно следующее:

- `net/http` => `gin`/`echo`/`fiber`/etc, ибо стандартная функциональность не позволяет даже сделать нормальный роутинг
- `log` => `logrus`/`zap`/`zerolog`/etc, ибо стандартный логгер неструктурированный и некрасивый, есть [пропозалы](https://go.googlesource.com/proposal/+/master/design/56345-structured-logging.md), но авторы языка лучше добавят множественные ошибки чем нормальный логгер
- `time` => [jinzhu/now](https://github.com/jinzhu/now) или самописные утилитарные функции для работы со временем
- `testing` => [stretchr/testify](https://github.com/stretchr/testify), ибо никто не хочет писать одни и те же проверки, чтобы в конце концов вызвать `t.Failf("actual: %+v, expected: %+v", actual, expected)` по сто раз в каждом проекте
- `sql` => пакет содержит только интерфейсы, да и для тех есть более юзабельные обертки [https://github.com/jmoiron/sqlx](jmoiron/sqlx). Плюс вам еще понадобятся [драйвера](https://github.com/golang/go/wiki/SQLDrivers), плюс еще понадобятся query builder типо [Masterminds/squirrel](https://github.com/Masterminds/squirrel) или orm типо [sqlboiler](https://github.com/volatiletech/sqlboiler)/[gorm](https://github.com/go-gorm/gorm)/[bun](https://github.com/uptrace/bun)/[ent](https://github.com/ent/ent)/etc, чтобы не писать SQL запросы на миллиард буков.

## comparable
Еще хотел написать про обновление `comparable` в `go1.20`, но я в нем нихуя не понял, как и думаю все люди в мире.

## Рофлооценка рофлоязыку - 7/10
