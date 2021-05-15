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
    const deadline = '2021-06-13'; //дата обратного отсчета
    function getTimeRemainning(endtime) { //функция определяющая разницу между датами
        const t = Date.parse(endtime) - Date.parse(new Date()), //преобразуем даты в число (количество миллисекунд). 
            //делим количество миллисекунд на кол-во млсек в 1 дне
            days = Math.floor(t / (1000 * 60 * 60 * 24)), //определить количество дней отображаемых в обратном таймере Math.floor округление до ближайшего целого
            // 1000*60*60*24 - столько в сутках миллисекунд
            hours = Math.floor((t / (1000 * 60 * 60) % 24)), //определяем количество целых часов до конца.
            //1000*60*60 столько миллисекунд в часе (1000 милли секунд в секунде). t / (1000 * 60 * 60) - общее количество часов которое осталось, те там может быть и  150 и 300, нам это не нужно.
            // % 24 - деление на 24 и возвращение остатка от деления. 
            minutes = Math.floor((t / 1000 / 60) % 60),
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

    //Modal
    /*     Первым делом необходимо в HTML найти кнопки/триггеры которые будут вызывать модальное окно,
        они могут иметь разные классы, теги и чтобы их как то объединить, пометить им назначают data атрибуты
        <button data-modal class="btn btn_white">Связаться с нами</button>
        Также вешаем data атрибут на закрытие модального окна
         <div data-close class="modal__close">&times;</div> */

    //Триггер для модального окна это будет кнопка "Связаться с Нами"
    const modalTrigger = document.querySelectorAll('[data-modal]'), //атрибут прописывается в квадратных скобках. Находим кнопки.
        modal = document.querySelector('.modal'), //переменная отвечающая за само модальное окно
        modalCloseBtn = document.querySelector('[data-close]'); //кнопка отвечающая за закрытие окна



    /*    modalTrigger.addEventListener('click', () => { //при клике на кнопку "Связаться с нами" выходит модальное окно
           modal.classList.add('show');
           modal.classList.remove('hide');
           document.body.style.overflow = 'hidden'; //запрет прокрутки страницы при открытом модальном окне
          });

       modalCloseBtn.addEventListener('click', () => { //обратная операция, при нажатии на крестить в модальном окне, оно закрывается
           modal.classList.add('hide'); //добавить класс скрытия
           modal.classList.remove('show'); //удалить класс показа
           document.body.style.overflow = ''; //при закрытии модального окна, восстановить скрол страницы
       });   */


    // второй способ вызова модального окна, с помощью переключения класса:
    modalTrigger.forEach(btn => { //необходимо кнопки перебрать тк мы не можем на псевдомассив повесить обработчик события
        //перебор также нужен и для первого способа, чтобы повесить обработчик события на все кнопки
        btn.addEventListener('click', openModal); //при клике на кнопку "Связаться с нами" выходит модальное окно
    });

    //если какой то участок кода повтораяется два и более раз, то его необходимо вынести в отдельную функцию
    function openModal() {
        modal.classList.toggle('show'); //переключить класс show (тк класса еще нет, то он его автоматически допишет)
        document.body.style.overflow = 'hidden'; //запрет прокрутки страницы при открытом модальном окне
        clearInterval(modalTimerId); //очищаем и останавливаем таймер, если пользователь сам уже открывал модальное окно.
    }

    function closeModal() { //функция закрытия модального окна
        modal.classList.toggle('show'); // класс уже есть у окна, те при нажатии на кнопку класс удалится.
        document.body.style.overflow = ''; //при закрытии модального окна, восстановить скрол страницы
    }

    modalCloseBtn.addEventListener('click', closeModal); //обратная операция, при нажатии на крестить в модальном окне, оно закрывается

    modal.addEventListener('click', (e) => { //e.target это то, куда кликнул пользователь
        if (e.target === modal) { //при клике в подложку (modal) окно также закрывается
            closeModal(); // в данном случае пишем со скобками, те условие выполнилось, функция выполняется
        }
    });

    document.addEventListener('keydown', (e) => { //при нажатии на кнопку ESC окно также закрывается
        //кода кнопок можно посмотреть на сайте https://keycode.info/
        if (e.code === "Escape" && modal.classList.contains('show')) { //чтобы каждый раз при нажатии на ESC не вызывалась функция прописываем условие, что вызвать только когда модальное окно показано
            closeModal();
        }
    });

    //044 Модификации модального окна. 
    //Всплытие окна при долистывании страницы до конца и при прошестви некоторого времени

    const modalTimerId = setTimeout(openModal, 60000); //через 6 сек откроется модальное окно, если он ранее его не открывал

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            //если условие выполняется, то означает, что пользователь долистал до конца.
            //свойство pageYOffset отслеживает сколько px отлистал поль-ль по оси Y (прокрученная часть)
            //свойство scrollHeight получение полной высоты элемента с учетом прокрутки которая была сверху
            //clientHeight высота клиента, те видимой части окна
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //как только пол-ль долистал один раз старцницу до конца, всплывет модальное окно и все, больше всплывать не будет.
        }
    }
    window.addEventListener('scroll', showModalByScroll); //при долистывании страницы до конца появляется модальное окно

    //Задание 048. Используем классы для карточек

    //Создаем шаблон (класс), чтобы от него отпачковывать карточки
    class MenuCard {  //название класса всегда с большой буквы
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            //прописываем свойства
            this.src = src; //источник картинки
            this.alt = alt; //альтернативный текст картинки
            this.title = title; //заголовок
            this.descr = descr; //описание
            this.price = price; //цена
            this.classes = classes; //это будет массив, а не обычные строки
            //parentSelector-родитель для карточек, те место куда мы их помещаем
            this.parent = document.querySelector(parentSelector); //в свойстве this.parent лежит DOM элемент
            //Нам нужно получить один элемент, внутрь вставляем parentSelector который мы будем передавать в настройку нашего класса
            this.transfer = 27; //курс конвертации валюты
            this.changeToUAH();
        }

        //Создаем методы:

        changeToUAH() { //создаем метод конвертации валюты в гривну из USD
            this.price = this.price * this.transfer; // (цена придет на как аргумент*на курс конвертации)
        }

        render() { /*//создаем метод для вестки
            1) создание элемента
            2) в созданный элемент помещаем вестку (копируем из html файла)
            3) верстку дополнить данными которые приходят как аргументы
            4) поместить элемент на страницу */
            const element = document.createElement('div');
            //classes (rest) всегда будет сформировывать массив, даже если мы не передадим аргумент, то массив будет пустой
            if (this.classes.length === 0) { //если кол-во элементов в массиве =0,то присваиваем стандартное значение
            this.element = 'menu__item';
            element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
                //мы обращаемся к element, к его classList и добавляем каждый класс который будет находится в массиве classes
            }

            
            //из верстки убрали  <div class="menu__item"> после применения оператора rest
            element.innerHTML = `
               
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div> 
                    </div>
                
            `; // в this.price придет уже модифицир. значение, после конвертации
            this.parent.append(element); //новосозданный элемент помещаем внутрь этого же элемента тк this.parent это дом элемент, то у него есть метод append
        }
    }

    //Создание экземпляров класса:
   /*  const div = new MenuCard();
    div.render(); */

    //альтернативная запись (сокращенная)
    //new MenuCard().render(); объект и метод используются на месте, те он нам что то сделает и исчезнет, тк на него нет ссылок
    //Настройка каждого отдельного элемента, который создадим
    new MenuCard( //прописываем все в кавычках
        //если забудем передать 'menu__item' то все равно сайт будет работать, тк мы создали условие в которое установили стандратное значение.
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
       

    ).render();

    new MenuCard( //прописываем все в кавычках
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container',
        'menu__item'

    ).render();

    new MenuCard( //прописываем все в кавычках
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        '.menu .container',
        'menu__item'

    ).render();

 
    //после создания карточек через JS, удаляем их из файла html

});