title: Some notes and saved things
hide: [navigation, toc]

Одна из самых трудных мыслительных операций, на которую всерьёз способны очень немногие, это поверить, что другой человек

- не дурак
- не придуривается
- не пьян
- не под веществами
- не устал
- не напуган
- не жертва детской травмы
- не обманщик
- не продался
- не следует каким-то групповым интересам
- не манипулирует
- не встаёт в позу
- не выпендривается
- не ляпнул не подумав
- не жертва ПТСР, "стокгольмского синдрома", сексуальной неудовлетворённости, советского опыта, эмиграции, магнитных бурь, covid-19, облучения с Нибиру
- не испорчен долгим страданием
- не страдает от нехватки жизненного опыта
- не недостаточно образован
а просто в здравом уме, трезвой памяти, с полным самосознанием и ответственностью, ознакомившись с источниками и критикой - думает иначе, чем я.

<a href="https://vk.com/wall3898228_957">source</a>

## Bookmarklets
[Solve board on https://minesweeper.online/](javascript:(function()%7Bfunction%20triggerMouseEvent(node%2C%20eventType)%20%7Bvar%20clickEvent%20%3D%20document.createEvent(%22MouseEvents%22)%3BclickEvent.initEvent(eventType%2C%20true%2C%20true)%3Bnode.dispatchEvent(clickEvent)%3B%7Dfunction%20click(elem)%20%7Be%20%3D%20document.getElementById(elem)%3BtriggerMouseEvent(e%2C%20%22mouseover%22)%3BtriggerMouseEvent(e%2C%20%22mousedown%22)%3BtriggerMouseEvent(e%2C%20%22mouseup%22)%3BtriggerMouseEvent(e%2C%20%22click%22)%3B%7Dfunction%20getCell(cell)%20%7Bif%20(cell.classList)%20%7BclassList%20%3D%20Array.from(cell.classList)%3Bif%20(classList.includes(%22clear%22))return%20-1%3Bif%20(classList.includes(%22hd_closed%22))return%20%22x%22%3Bfor%20(let%20i%20%3D%200%3B%20i%20%3C%204%3B%20i%2B%2B)%20%7Bif%20(classList%5Bi%5D.startsWith(%22hd_type%22))%20%7Bif%20(classList%5Bi%5D.length%20%3D%3D%209)return%20%22X%22%3Breturn%20classList%5Bi%5D.charAt(7)%3B%7D%7D%7Dreturn%20%22%22%7Dfunction%20getBoard()%20%7Blet%20res%20%3D%20%5B%5D%3Blet%20row%20%3D%20%5B%5D%3Bfor%20(let%20el%20of%20document.getElementById(%22A43%22).children)%20%7Blet%20x%20%3D%20getCell(el)%3Bif%20(x%20!%3D%20-1)row.push(x)%3Belse%20%7Bres.push(row)%3Brow%20%3D%20%5B%5D%3B%7D%7Dreturn%20res%3B%7D(async()%20%3D%3E%20%7Blet%20pos%20%3D%20await%20fetch(%22http%3A%2F%2Flocalhost%3A5000%2Fset%2Fmines_count%3F%22%20%2B%20new%20URLSearchParams(%7Bmines_count%3A%20W9.m20%7D)%2C%20%7Bmethod%3A%20%22GET%22%7D).then(r%20%3D%3E%20r.text())%3Bfor%20(let%20i%20%3D%200%3B%20i%20%3C%20100%3Bi%2B%2B)%20%7Bwhile%20(true)%20%7Blet%20pos%20%3D%20await%20fetch(%22http%3A%2F%2Flocalhost%3A5000%2Fsolve%3F%22%20%2B%20new%20URLSearchParams(%7Bboard%3A%20JSON.stringify(getBoard())%7D)%2C%20%7Bmethod%3A%20%22GET%22%7D).then(r%20%3D%3E%20r.text())%3Bif%20(pos%20%3D%3D%20%22solved%22)break%3Bclick(%60cell_%24%7Bpos%7D%60)%3B%7D%7D%7D)()%7D)())
