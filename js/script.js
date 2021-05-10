window.addEventListener('DOMContentLoaded', () => {

    //Tabs
    /*  3 задачи:
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


    // Timer (Таймер, осталось до конца акции, обратный отсчет) 041
    //1) должна быть какая то функция которая будет устанавливать наш таймер (те получать элементы и что то с ними делать)
    //2) должна быть функция, определяющая разницу между временем конечным и текущим у пользователя.
    //3) функция которая занимается обновлением нашего таймера
    const deadline = '2021-05-29'; //дата обратного отсчета
    function getTimeRemainning(endtime) { //функция определяющая разницу между датами
      const t = Date.parse(endtime) - Date.parse(new Date()), //преобразуем даты в число (количество миллисекунд). 
            //делим количество миллисекунд на кол-во млсек в 1 дне
           days = Math.floor(t / (1000 * 60 * 60 * 24)), //определить количество дней отображаемых в обратном таймере Math.floor округление до ближайшего целого
           // 1000*60*60*24 - столько в сутках миллисекунд
           hours = Math.floor((t / (1000 * 60 * 60) % 24)), //определяем количество целых часов до конца.
           //1000*60*60 столько миллисекунд в часе (1000 милли секунд в секунде). t / (1000 * 60 * 60) - общее количество часов которое осталось, те там может быть и  150 и 300, нам это не нужно.
           // % 24 - деление на 24 и возвращение остатка от деления. 
           minutes = Math.floor((t / 1000 /60) % 60),
           seconds = Math.floor((t / 1000) % 60);
           //Для того чтобы вышеперечисленные переменные были видны и снаружи, необходимо использовать return
           return { //возвращаем из функции объект
               'total': t,
               'days': days,
               'hours': hours,
               'minutes': minutes,
               'seconds': seconds
           };
    }
    
    function getZero(num) { //функция которая добавляет ноль впереди числу, если оно меньше 10
        if (num >= 0 && num < 10) { //число должно быть больше или равно 0 и меньше чем двухзначное 10
            return `0${num}`; //если условие произошло, то из функции возвращаем модифицированное значение
        } else { //если число двухзначное, то возвращаем число без изменений
            return num;
        }
    }

    function setClock(selector, endtime) { //установка часов
        const timer = document.querySelector(selector), //вместо selector можно указать и .timer, но мы дклаем общую функцию
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000); //обновление таймера кажду секунду

        updateClock(); //вызвать функцию вручную, чтобы цифры счетчика встали сразу корректные, а если этого не сделать сначала появятся цифры по умолчанию, и только через 1 сек счетчик.

        function updateClock() { //создаем функцию которая будет обновлять наш таймер
            const t = getTimeRemainning(endtime); //расчет времени которое осталось, здесь getTimeRemainning возвратит объект со всеми данными
            //вставка расчетных значений на страницу
            days.innerHTML = getZero(t.days); //getZero служит для того чтобы дописать ноль впереди цифры
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
  
            if (t.total <= 0) { //если время вышло и оно идет в отрицательную сторону, то таймер не обновляем
                clearInterval(timeInterval);
            }

        }
         
    }
    setClock('.timer', deadline); //первая переменная это selector
});