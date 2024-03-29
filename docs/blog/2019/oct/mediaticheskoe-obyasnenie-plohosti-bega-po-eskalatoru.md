title: Медиатическое обьяснение плохости бега по эскалатору

![](/blog/static/img/boxMjq1SM6A.jpg){align=right width=200}

Допущения / упрощения, нужные для введения математической модели:

1. Поезд приходит периодически с одинаковым периодом, который мы обозначим, как T.
1. Прибытие на платформу происходит в момент времени t и момент прибытия(как и начало движения по эскалатору) случайно равномерно распределено.
1. Бег по эскалатору заключается в том, чтобы придти на платформу на Δt времени раньше, чем без бега.
1. Считать мы будем матожидание времени ожидания до приезда поезда в обоих случаях.
1. Поезд приходит мгновенно, забирает всех кого нужно и уходит.

Так как мы считаем, что начало равномерно распределено по отрезку $[0, T)$, то матожидание времени ожидания считается так:

$$
\int\limits^T_0\frac{t dt}{T}=\frac{T^2}{2T}=\frac{T}{2}
$$

Затем посчитаем матожидание времени ожидания, если придти в момент времени t-Δt:

![](/blog/static/img/wwI4uXu4y0Q.jpg)

Вычтем из этого первое выражение, чтобы посчитать матожидание выигрыша от второй стратегии:

$$
\varphi(\Delta t)=\Delta t\frac{\Delta t-T}{T}
$$

Из очевидных ограничений $\Delta t\in[0,t)$. Далее можно построить график, чтобы увидеть поведение этой функции при различных $t$. Например, примем
T=5 min = 300 sec

![](/blog/static/img/u-pGNyNsTuY.jpg)

Очевидно, что выигрыш будет только при $\Delta t > T$. Таким образом имеем, что нужно экономить времени на эскалаторе больше, чем период между поездами. Однако проезд на эскалаторе занимает обычно порядка 1 min, в то время как поезда ездят с периодом 1-3 min, откуда получаем, что

```
НЕВОЗМОЖНО ВЫИГРАТЬ ПО МАТОЖИДАНИЮ, ЕСЛИ БЕГАТЬ ПО ЭСКАЛАТОРУ
```
