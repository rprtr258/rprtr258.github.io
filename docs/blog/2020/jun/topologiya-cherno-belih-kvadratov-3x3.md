title: Топология черно-белых квадратов 3x3

Не знаю зачем, но кто-то собрал датасет из черно-белых квадратов 3x3 из фотографий
https://dash.harvard.edu/bitstream/handle/1/3637108/Mumford_NonlinStatPatches.pdf?sequence=1
Не буду говорить зачем(я не знаю), скажу лишь, что эти квадраты лежат в 9-мерном кубе. После нормализации, они будут лежать на 9-мерной сфере, после чего их можно спроецировать на 8-мерную сферу. Затем(как-то) оставив только очень контрастные квадраты, это проецируют на 7-мерную сферу.
Разобравшись в том, что сделали, а главное зачем, пойдем дальше. Нас интересует вопрос: как устроен полученный датасет? Есть ли там какие-то интересные структуры?
На самом деле, после подобных двух проекций, 7-мерная сфера будет плотно заполнена нашими квадратами, и при каком-либо проецировании на плоскость будет сложно что-то увидеть. Поэтому что? Поэтому построим симплициальный комплекс, чтобы посмотреть на первые числа Бетти. По другому, есть некий алгоритм, позволяющий искать в метрических данных циклы, в которых соседние точки похожи, но не все в совокупности. Это построение я (наверное) опишу в еще каких-нибудь постах, может будет понятнее. Здесь же просто полюбуемся картинками и выводом. На картинке 1 показаны описанные выше циклы с увеличением порога похожести соседних точек эпсилон. Видно, что устойчиво выделяются 5 циклов, среди которых почему то показали только 3, ну и ладно. Посмотрим на один из этих циклов(2 картинка). Видим цикл из квадратиков, в которых соседние отличаются поворотом на небольшой угол. Уже неплохо.
На 3 картинке показаны еще два цикла из нашего датасета. Один цикл отвечает вертикальным контрастным закраскам, второй горизонтальным. Соседние элементы отличаются небольшим изменением закрасок в соответствующем направлении. Как показано сверху, эти циклы пересекаются с первым, но не пересекаются между собой, что интересно в силу того, что они вложены в 7-мерную сферу.
Далее, взяв за основу эти три цикла, можно изобразить их все в виде двумерного графика, как на рисунке 4. Что интересно в этом графике, так это то, что противоположные стороны совпадают вдоль направлений стрелок, то есть эти точки(квадраты 3x3) лежат на бутылке Кляйна.

source: https://www2.math.upenn.edu/~ghrist/preprints/barcodes.pdf

![](/blog/static/img/2qv1fC0GkRU.jpg)
![](/blog/static/img/MXQACyee95w.jpg)
![](/blog/static/img/AkWhLfX-uwk.jpg)
![](/blog/static/img/KJgBscI8TfU.jpg)
