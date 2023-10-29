title: Обзор на Typescript

Вы хотели писать на `javascript` но динамическая типизация путала вам карты и кидала ошибки в рантайме? `Typescript` идет на помощь! В нем любое `javascript` значение может быть типом, единственным элементом которого это значение и будет... Причем получить это значение имея только тип невозможно... Ну и ладно, нам это не нужно, верно, у нас типы будут иметь более одного значения!

Пусть наш тип это что-нибудь типо
```{.ts .annotate}
let x: string /*(1)!*/ | 'string' /*(2)!*/ | HTMLElement /*(3)!*/ | string[] /*(4)!*/ | HTMLElement[] /*(5)!*/ | undefined
```

1. текстовый узел
2. фиксированная строка, которую хочется отображать зеленым
3. единственный элемент
4. массив строк, которые хочется отображать как простой список
5. массив элементов

Обычный такой тип, казалось бы, что в нем такого. Попробуем написать простенькую программу, чтобы вывести тип элемента `x`: если это строка, то вывести `"string"`, если `'string'`, то `"'string'"`, и тд.

В нормальных языках это легко реализуется с помощью конструкции type switch или pattern matching-а. Но у нас `typescript`, поэтому код будет выглядеть примерно так:

```{.ts .annotate}
if (x === "string") /*(1)!*/ {
  return "'string'"
} else if (typeof x === "string") /*(2)!*/ {
  return "string"
} else if (x instanceof HTMLElement) /*(3)!*/ {
  return "HTMLElement"
} else if (Array.isArray(x)) /*(4)!*/ {
  if (x.length>0) /*(5)!*/ {
    return (typeof x[0] === "string") ? "string[]" : "HTMLElement[]"
  } else {
    return "either string[] or HTMLElement[], can't guess til it's empty"
  }
} else if (x === undefined) {
  return "undefined"
}
```

1. если `x` - `"string"`, тип с единственный элементом, поэтому просто проверка на равенство
2. если `x` - `string`, элементарный тип, поэтому `typeof`
3. проверка на тип-класс, поэтому `instanceof`
4. проверка, если массив (чего-то)
5. если есть хотя бы один элемент, мы можем взять первый элемент, чтобы проверить тип, ибо без значения типа невозможно узнать тип.

Вы можете спросить: а зачем я написал ` | undefined` в обьявлении типа, если все типы и так содержат `undefined`? Просто, чтобы это было более явно, в реальном коде конечно же не стоит так писать, а просто нужно проверять ВСЕ параметры на `undefined`.

На этом обзор заканчивается, как видите `typescript` это хорошее продолжение `javascript`, в котором не смогли ни нормально реализовать типизацию, ни сделать то, для чего бы он мог пригодиться - давать автокомплит, так как типы енфорсятся транспайлером. Проверки типов консистентные и простые.

> Моя оценка языку `typescript` 0/10

![](/blog/static/img/DCZH9_-84Yg.jpg){align=left width=100}

UPD: поступила критика в защиту языка `typescript`. В общем и целом, она сводится к следующим пунктам:

- Автор глупый, удали, не позорься.
- Сам дурак, что делаешь union из 6 типов. Так никто не делает.

```ts
function f(x: number | string) {
    if (typeof x !== "string") {
        throw typeof x;
    }

    return x + 1; // string + int, compiles and prints "c1"
}

console.log(f("c"))
```