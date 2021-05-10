window.addEventListener('DOMContentLoaded', () => {

    /* 038 3 задачи:
     1)Функция которая будет скрывать ненужные нам табы
     2)Функция показа нужного Таба
     3)Назначить обработчик события на меню */
    const tabs = document.querySelectorAll('.tabheader__item'), //получение всех вкладок на которые будем кликать, тк класс ставим точку
        tabsContent = document.querySelectorAll('.tabcontent'), //получение класса отвечающего за контент
        tabsParent = document.querySelector('.tabheader__items'); //родитель который будет содержать все табы/вкладки

    /* В реальных проектах чаще всего используют классы вместо inline стилей, исправим программу под это. В CSS добавили следующий код, для анимации и скрытия и показа вкладок, те используем класс вместо inline стилей
    .show{display:block}.hide{display:none}.fade{animation-name: fade;animation-duration: 1.5s;}@keyframes fade{from{opacity: 0.1;}to{opacity: 1;}}
    класс show для показа элемента, hide для скрытия, fade для анимании вкладок (табов), длится 1,5 сек, от прозрачности 10% до 100% */

    function hideTabContent() { //функция скрывающая все ненужные табы
        tabsContent.forEach(item => { //перебираем массив
            // item.style.display = 'none'; используем inline стили
            item.classList.add('hide'); //вместо inline стилей используем классы. Добавляем класс hide
            item.classList.remove('show', 'fade'); //удалить класс show с анимацией
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active'); //удалить у каждого элемента Таба класс активности, тк мы работаем с классами, команда classList, то точку не ставим.
        });
    }

    function showTabContent(i = 0) { //если функция вызыватся без аргумента, то по умолчанию 0, те показ первого слайда.
        //tabsContent[i].style.display = 'block'; используем inline стили, эту строку заменили на две нижестоящие.
        tabsContent[i].classList.add('show', 'fade'); //вместо inline стилей используем классы. Добавляем класс show с анимацией
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    //Используем делигирование событий
    tabsParent.addEventListener('click', (event) => {
        const target = event.target; //необязательное, но желательное действие, можно было обращаться к event.target
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                /*  мы переберем все табы которые лежат в переменной tabs и будем сравнивать
                           если элемент который находится в этом псевдомассиве совпадает с элементом который кликнул пользователь, тогда мы берем его номер и показываем на странице 
                           item - каждый таб, i - номер по порядку который мы перебираем.
                           target это тот элемент по которому мы только что кликнули */
                if (target == item) { //если кликнутый элемент будет совпадать с элементом который мы перебираем то вызываем две функции
                    hideTabContent(); //все табы скрываем
                    showTabContent(i); //показываем нужный таб
                }
            });
        }
    });


});