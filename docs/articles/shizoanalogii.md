title: Шизоаналогии

![](/blog/static/img/q3yPcmdASlY.jpg){align=right width=200}

Ничего нового здесь не будет.
Все что здесь будет - больной мозг админа, видящий одно и то же в разных вещах.

Вспоминаем пость про фальсифицируемость: https://vk.com/wall-187839235_773
Основная конструкция оттуда: результат эксперимента либо опровергает нашу теорию, либо ни опровергает, ни подтверждает. На языке типов Haskell-а:

```haskell
ExperimentResult = FirstCase Success | SecondCase (Either Success | Or Failure)
```

Несколько других областей, имеющих похожую структуру.

Первая: задача читателей и писателей в базе данных. Читатели только читают, писатели могут и писать и читать. Следствием этого, что (в общем случае) одновременно может быть сколько угодно читателей или только один писатель.
Обобщая этот пример, можно вспомнить про разделение подпрограмм в SQL на функции и процедуры. Функции могут читать данные и что-то посчитать из них, не записывая ничего в базу, процедуры же могут и писать, и читать и творить что угодно с базой. Следствия два:
1. Как и с читателями-писателями, одновременно можно запустить сколько угодно функций, но только одну процедуру.
2. Функция может вызывать только функции, процедура может вызывать как процедуры, так и функции.

В более общем виде такая штука, как разделение функций и процедур в SQL называется CQRS
https://en.wikipedia.org/wiki/Command–query_separation
Отдаленно это напоминает функции и процедуры в языке Паскаль, в котором однако же функция может менять состояние программы. Ограничив функции, можно получить программу, следующую принципу CQRS.

Другим известным проявлением CQRS принципа являются GET и POST запросы в архитектурном стиле REST с соответствующими следствиями касательно параллелизма.

Последний пример, с которого я начал про все это думать, это наследование в обьектно-ориентированных языках. Если быть более точным, различают наследование (наследование от класса) и имплементацию интерфейса (то что я не побоюсь назвать наследованием от интерфейса). Иногда эти вещи даже обозначаются по разному: в Java используются ключевые слова extends или implements, и в UML диаграммах пустая стрелка либо сплошная, либо пунктирная. Лично я не вижу смысла добавлять отличия между этими видами наследования, так как и так видно, имплементация это интерфейса или же наследование от класса.

Про то, как это относится к тому, что было описано выше. Родителями класса (в общем смысле) может быть любое количество интерфейсов, но только один класс. Видна очевидная похожесть на задачу писателей-читателей и попытка оправдать разделение наследование от имплементации. Если более подробно: наследование от интерфейса наследует его интерфейс (контракт)(pun intended), наследование от класса наследует его интерфейс (набор методов) и реализацию этих методов, а так же внутреннее содержимое. В связи с этим и конфликт, из-за которого хоть интерфейсов можно имплементировать сколько угодно, отнаследоваться можно же только от одного класса: наследование реализации метода. Если два класса реализуют один метод (два писателя пишут в одно место), то потомок обоих этих классов не знал бы, чьей реализацией пользоваться. Название этой проблемы DDD - deadly diamond of death в честь формы наследования образующейся в этом случае.
