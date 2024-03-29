title: Краткое введение в кложуровские редьюсеры

Семантика лиспа:
- `(f a b c) === f(a, b, c)`
- `[x y z] === [x, y, z]` - список

Reduce: `(reduce f x0 [x1 x2 x3 ...]) = f(f(f(...f(x0, x1), x2), x3), ...)`, формально:
`(reduce f x0 xs) = (if (nil? xs) x0 (reduce f (f x0 (first xs)) (rest xs))`, где
```clojure
(if p a b) = p ? a : b
(nil? x) = (x == [])
(first [x0 x1 x2 ...]) = x0
(rest [x0 x1 x2 ...]) = [x1 x2 x3 ...]
```

В частности:
`(map f xs) = (reduce (fn [acc x] (cons (f x) acc)) [] xs)`, где
```clojure
(cons x0 [x1 x2 x3 ...]) = [x0 x1 x2 ...]
(fn [x y] ...) ; лямбда-функция двух переменных
(filter p xs) = (reduce (fn [acc x] (if (p x) (cons x acc) acc)) [] xs)
````

Следовательно `map` и `filter` не нужны, как только есть `reduce`.
Далее - содержательная часть поста:
```clojure
(reduce g g0 (reduce f f0 xs)) = (first (rest
(reduce (fn [­[facc gacc] x] [(f facc x) (g gacc (f facc x))]) [f0 g0] xs)))
```
Ну или как-то так, суть в том, что два reduce можно обьединить в один.
Выражение `[(f facc x) (g gacc (f facc x))]` содержит `(f facc x` два раза и, чтобы не вычислять его дважды, можно применить следующий трюк:
```clojure
((fn [tmp] [tmp (g gacc tmp)]) (f acc x))
```
Или то же в виде макроса let:
```clojure
(let [tmp (f acc x)] [tmp (g gacc tmp)])
```

Аналогично можно обьединить сколько угодно reduce-ов.

Можно провести аналогию с императивными вычислениями:
`reduce` - обьединить элементы списка в аккумулятор
`map` - применить функцию ко всем элементам списка, чтобы получить новый список
`filter` - отфильтровать элементы списка, чтобы получить новый список
Это просто и элементарно делается циклом for:
reduce:
```clojure
acc = f0;
for (x in xs) acc = f(f0, acc);
```

map:
```clojure
acc = [];
for (x in xs) acc.append(f(x), acc)
```

filter:
```clojure
acc = [];
for (x in xs) if p(x) acc.append(x);
```

Соответственно:
`reduce` - обьединение элементов
`map` - применение функции к элементу
`filter` - if statement

То есть, `(reduce + 0 (map (fn [x] (* x x)) (filter odd? (range 100))))`
можно посчитать в один цикл for:
```python
acc = 0
for (x in xs) if odd?(x) acc += x * x;
```

Так вот: обьединение редьюсеров, описанное выше, даст ровно такой же цикл при пересчете итогового `reduce` циклом for!

