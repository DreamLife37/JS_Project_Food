/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function calc() {
    //калькулятор переписывать не стали, тк здесь много различных селекторов, параметров, и они редко похожи друг на друга и врятли будет ситуация в переиспользовании его.
    
     // Calculator. Создание калькулятора часть 1. 066

    //в html добавляем уникальный идентификатор female и male, также пропишем каждому уровню активности data атрибут (data-ratio) с определенным значением.

    const result = document.querySelector('.calculating__result span'); //находим класс и внутри него получаем span (текстовое поле)

    let sex, height, weight, age, ratio

    //067 Если в localStorage есть значения взять их оттуда, иначе установить дефолтные
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = '1.375';
        localStorage.setItem('ratio', '1.375');
    }

    //067 Функция по установке класса активности из localStorage
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            //добавляем условия, чтобы не писать 2 функции
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            } 
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        })
    }
    //Функция сначала перебирает пол, далее вызываем и перебираем активность
    //Тк мы обращаемся к блокам, то указываем div 
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    //В 1-ом и 3-ем блоке будет одна функция, которая будет брать значение из div. А вторая функция будет работать с input во втором блоке.
    function calcTotal() {
        //если нет пола или роста или веса или возраста или коэфициента, то расчет производить не будем
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return; //return прерывает дальнейшие действия
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio); //формула для женщин
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio); //формула для мужщин
        }
    }

    calcTotal();

    //Функция по получению статических данных: пол и физическая активность
    //С такой записью функции будет баг при клике мимо кнопки, на подложку
    /*    function getStaticInformation(parentSelector, activeClass) {
           const elements = document.querySelectorAll(`${parentSelector} div`);
           //делигирование событий, на родителя вешаем обработчик события:
           document.querySelector(parentSelector).addEventListener('click', (e) => { //если у блока по поторому мы кликнули есть атрибут data-ratio, то изменяем переменную ratio
               if (e.target.getAttribute('data-ratio')) {
                   ratio = +e.target.getAttribute('data-ratio');
               } else {
                   sex = e.target.getAttribute('id');
               }
               console.log(ratio, sex)
               //перебираем все элементы и удаляем класс активности, а объекту события, по которому кликнули назначаем класс активности
               elements.forEach(elem => {
                   elem.classList.remove(activeClass)
               })
               e.target.classList.add(activeClass);
               calcTotal();
           });
       } */

    //исправление бага при клике на подложку кнопок,это происходит из-за того, что мы используем дилигирование событий (запись выше), лучше вместо этого использовать простое навешивание событий.Для этого мы перебираем все элементы внутри и на каждый из них вешаем обработчик события
    function getStaticInformation(selector, activeClass) {
        //const elements = document.querySelectorAll(`${parentSelector} div`); //получение внутри родителя всех div
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                //если у блока по поторому мы кликнули есть атрибут data-ratio, то изменяем переменную ratio
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    //067 Сохранение выбранных пользователем параметров в LocalStorage
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id')); //067
                }
                console.log(ratio, sex)
                //перебираем все элементы и удаляем класс активности, а объекту события, по которому кликнули назначаем класс активности
                elements.forEach(elem => {
                    elem.classList.remove(activeClass)
                })
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }


    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {
            //067 Проверка на ввод не числа
            if (input.value.match(/\D/g)) {
                input.style.border = '2px solid red'; //обвести поле красным
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) { //если id равно росту, то записываем значение в рост и тд.
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal(); //фунция конечного расчета должна вызываться каждый раз когда происходит какое то изменение на странице
        });

    }
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function cards() {
    //Задание 048. Используем классы для карточек

    //реализации карточек с классом (059 вер 1), для второго варианта не нужно
    //Создаем шаблон (класс), чтобы от него отпачковывать карточки
    class MenuCard { //название класса всегда с большой буквы
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
        render() {
            /*//создаем метод для вестки
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

            //реализации карточек с классом (059 вер 1), для второго варианта не нужно
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

    //Функцию getResourse вынесли в отдельный файл services тк она работает с сервером и может также пригодится в других местах

    /* //060.Создание карточек с помощью готовых библиотек
        axios.get('http://localhost:3000/menu')
            .then(data => {
                data.data.forEach(({
                    img,
                    altimg,
                    title,
                    descr,
                    price
                }) => { // {img, altimg, title, descr, price} деструктуризировали объект
                    new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                });
            }); */

    //Реализация создания карточек с помощью конструктора классов (059 вер 1)
    (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResourse)('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => { // {img, altimg, title, descr, price} деструктуризировали объект
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


    //Реализация создания карточек без использования классов (059 вер 2)
    //getResourse('http://localhost:3000/menu')
    //   .then(data => createCard(data));

    function createCard(data) { //функция createCard получает данные (массив), далее перебираем их и деструктуризируем объекты на отдельные свойства, далее создаем новый div, добавляем ему новый класс, формируем верстку и внутрь помещаем свойства которые пришли с сервера и вставляем (аппендим) карточку на страницу.
        data.forEach(({
            img,
            altimg,
            title,
            descr,
            price
        }) => {
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
            <img src=${img} alt=${altimg}>
            <h3 class="menu__item-subtitle">${title}</h3>
            <div class="menu__item-descr">${descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${price}</span> грн/день</div> 
            </div>
            `;
            document.querySelector('.menu .container').append(element);
        });
    }

    /* //Не нужно для 059, тк данные получаем с сервера.  
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

        ).render(); */


    //после создания карточек через JS, удаляем их из файла html
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function forms(formSelector, modalTimerId) {
    
    //053 Forms. Реализация скрипта отправки данных на сервер с использование объекта XMLHttpRequest
    // Сначала создаем файл backEnd - server.php
    const forms = document.querySelectorAll(formSelector); //получение всех форм по тегу "form"
    const message = { //создаем объект с различными свойствами - сообщениями
        //loading: 'Загрузка',
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что то пошло не так...'
    };

    forms.forEach(item => { //под каждую форму подвязываем функцию bindPostData
        bindPostData(item);
    });

    //059 Получение данных с сервера. Async_await

    //Async_await превращает асинхронный код в синхронный
    //При запуске функции postData начинает идти запрос и тк указано ключевое слово await браузеру необходимо дождаться результата этого запроса
    //Если не прописать Async/await выйдет ошибка на шаге res.json(), тк из fetch ничего не вернулось, а мы будет пытаться обработать результат методом json
    //async ставится перед функцией

    //073.Функцию postData вынесли в отдельный файл services, тк она работает с сервером и может также пригодится в других местах

    function bindPostData(form) { //привязать постинг данных
        form.addEventListener('submit', (e) => { //событие submit срабатывает каждый раз когда мы пытаемся отправить форму
            //по умолчанию браузер всегда перезагружает страницу при нажатии на клавишу с тегом btn 
            e.preventDefault(); //отмена перезагрузки страницы при нажатии на кнопки Перезвонить мне

            let statusMessage = document.createElement('img'); //создаем элемент с сообщением
            statusMessage.src = message.loading;
            //statusMessage.textContent = message.loading; //После нажатия на кнопку выйдет сообщение Загрузка
            statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
        `;
            //form.append(statusMessage); //добавить к форме текстовое поле
            form.insertAdjacentElement('afterend', statusMessage);

            /* Не неужно для Fetch (056)
            const request = new XMLHttpRequest(); //создание объекта XMLHttpRequest
            request.open('POST', 'server.php'); //вызываем метод open для настройки запроса */


            //Отправка данных с форм в двух разных форматах:
            //1) formData
            //2) JSON
            //Заголовок в случае (formData+XMLHttpRequest), при отправке форм устанавливать не нужно!!!
            //request.setRequestHeader('Content-type', 'multipart/form-data');
            //2) Для JSON нужен заголовок request.setRequestHeader('Content-type', 'application/json');

            //request.setRequestHeader('Content-type', 'application/json'); 056 Fetch
            //request.setRequestHeader(); //для Fetch заголовок перенесли 

            const formData = new FormData(form); //formData
            //Для сбора информации с форм с помощью formData, 
            //необходимо чтобы у форм в верстке был всегда атбрибут name

            //Превращение объекта formData в формат JSON Не нужно для 059, заменили другим.
            //formData специфический объект и просто так мы не можем его прогнать в другой формат
            /*  const object = {};
             formData.forEach(function (value, key) { //перебор formData и помещение данных в object
                 object[key] = value;
             }); */
            //На данном этапе получили обычный объект (object), а не formData
            //const json = JSON.stringify(object); //превращение объекта в JSON 

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            //formData собрала все данные с формы, мы ее превращаем в массив массивов, после этого превращаем в классический объект, а после этого классический объект превращаем в json.
            //entries берет каждое свойство из объекта и формирует из него маленький массив


            //request.send(formData); //метод для отправки 1)formData
            // Не нужно для Fetch 056: 
            //request.send(json); //2) для JSON

            (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
                //.then(data => data.text()) //модификация ответа от сервера в обычный текст. Не нужно для 059
                .then(data => {
                    console.log(data); //вывод в консоль того, что вернул сервер
                    showThanksModal(message.success); //Сообщение об упехе
                    statusMessage.remove();
                }).catch(() => { //этот блок лучше всегда прописывать, чтобы обрабатывать ошибки
                    showThanksModal(message.failure);
                }).finally(() => { // вносится действие которое выполняется всегда
                    form.reset(); //Очистка формы
                });

            /*     Не нужно для Fetch 056
            request.addEventListener('load', () => {  //load - конечная загрузка запроса
                    if (request.status === 200) {
                        console.log(request.response);
                        showThanksModal(message.success); //Сообщение об упехе
                         //setTimeout(() => { //удалить блок с сообщение через 2 сек. 
                        statusMessage.remove();
                        form.reset(); //Очистка формы
                        //}, 2000); 
                    } else {
                        showThanksModal(message.failure); //сообщение об ошибке
                    }
                });  */
        });
    }

    //054.Красивое оповещение пользователя.
    //После отправки формы с обратной связью пользователю будет выходить окно с благодарностью
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog'); //находим модальное окно

        prevModalDialog.classList.add('hide'); //скрытие модального окна с контентом
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)('.modal', modalTimerId); //открытие модального окна

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog'); //добавление класса новому окну, чтобы он нормально выглядел
        //формирование верстки модального окна
        thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;
        //Убираем переменную modalCloseBtn и назначение обработчика события modalCloseBtn.addEventListener('click', closeModal);
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove(); //удалить окно с благодарностью
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
        }, 1000);

    }

    /*   //056. Fetch API (application programming interface) интерфейс програмного обеспечения
      Fetch это замена XMLHttpRequest
      По - простому это набор данных и возможностей которые предоставляет нам какое то готовое решение.
      Самый банальный API это DOM API, по факту это различные методы(к примеру querySelector), которые позволяют нам работать с элементами на странице
      Перепишем наш функционал проекта с использование Fetch.
      //Fetch технология позволяющая общаться с сервером, построенная на Промисах
      https://jsonplaceholder.typicode.com/ база данных для тестов

          //Обычный GET запрос
          fetch('https://jsonplaceholder.typicode.com/todos/1') //возвращается промис
          .then(response => response.json()) //response - ответ.
          //response.json() превращает json данные в самый обычный JS объект. Эта команда возвращает нам промис, тк мы не знаем как быстро наш json объект превратится в обычный объект, не знаем точного количества времени. Если все успешно прошло, то выполняется следующий then.
          .then(json => console.log(json));

      //   2 способа запросов на сервер:
      //   - XMLHttpRequest(XHR)
      //   - Fetch

      //POST запрос
      fetch('https://jsonplaceholder.typicode.com/posts', { //Из этой конструкции возвращается именно Промис. Настройки Fetch идут после url в формате объекта. Если эти настройки не указывать, то это будет обычный GET запрос.
              method: 'POST',
              body: JSON.stringify({
                  name: 'Alex'
              }), //объект который будем отправлять, JSON.stringify преобразует строку или объект в JSON данные
              headers: { //заголовки
                  'Content-type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(json => console.log(json));


      PUT полное изменение ресурса
      PATCH частичное изменение ресурса*/

    //058. npm. JSON server
    fetch('http://localhost:3000/menu') //прописали в терминале команду json-server db.json и после этого получили ссылку
        .then(data => data.json())
        .then(res => console.log(res));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "openModal": () => (/* binding */ openModal)
/* harmony export */ });
//closeModal и openModal вынесли из modal, тк эти функции используются еще и в других модулях (forms.js).
function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    console.log(modalTimerId);
    if (modalTimerId) { //запускать clearInterval только если был передан modalTimerId
        clearInterval(modalTimerId);
    }
    
}

function modal(triggerSelector, modalSelector, modalTimerId) {
        //Modal
    /*     Первым делом необходимо в HTML найти кнопки/триггеры которые будут вызывать модальное окно,
        они могут иметь разные классы, теги и чтобы их как то объединить, пометить им назначают data атрибуты
        <button data-modal class="btn btn_white">Связаться с нами</button>
        Также вешаем data атрибут на закрытие модального окна
         <div data-close class="modal__close">&times;</div> */

    //Триггер для модального окна это будет кнопка "Связаться с Нами"
    const modalTrigger = document.querySelectorAll(triggerSelector), //атрибут прописывается в квадратных скобках. Находим кнопки.
        modal = document.querySelector(modalSelector); //переменная отвечающая за само модальное окно
    //После создания мод. модального окна в 054, обработчик события работать с таким элементами не будет,
    //тк элемент создан динамически с помощью JS. Удаляем переменную modalCloseBtn
    //  modalCloseBtn = document.querySelector('[data-close]'); //кнопка отвечающая за закрытие окна



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


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    }); //если не добавить стрелочную функцию, то openModal(modalSelector) вызовется сразу, а так делать нельзя. 

  

    /* 
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
     */
    //тк в 054 создаем элемент динамически, на нем не будет работать обработчик события
    //modalCloseBtn.addEventListener('click', closeModal); //обратная операция, при нажатии на крестить в модальном окне, оно закрывается

    modal.addEventListener('click', (e) => { //e.target это то, куда кликнул пользователь
        //в 054 создаем динамически элемент, для его закрытия добавляем:
        //e.target.getAttribute('data-close')
        if (e.target === modal || e.target.getAttribute('data-close') == '') { //при клике в подложку (modal) окно также закрывается
            //e.target === modal - клик на подложку
            //e.target.getAttribute('data-close') - клик на крести в окне
            closeModal(modalSelector); // в данном случае пишем со скобками, те условие выполнилось, функция выполняется
        }
    });

    document.addEventListener('keydown', (e) => { //при нажатии на кнопку ESC окно также закрывается
        //кода кнопок можно посмотреть на сайте https://keycode.info/
        if (e.code === "Escape" && modal.classList.contains('show')) { //чтобы каждый раз при нажатии на ESC не вызывалась функция прописываем условие, что вызвать только когда модальное окно показано
            closeModal(modalSelector);
        }
    });

    //044 Модификации модального окна. 
    //Всплытие окна при долистывании страницы до конца и при прошестви некоторого времени

    

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            //если условие выполняется, то означает, что пользователь долистал до конца.
            //свойство pageYOffset отслеживает сколько px отлистал поль-ль по оси Y (прокрученная часть)
            //свойство scrollHeight получение полной высоты элемента с учетом прокрутки которая была сверху
            //clientHeight высота клиента, те видимой части окна
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll); //как только пол-ль долистал один раз старцницу до конца, всплывет модальное окно и все, больше всплывать не будет.
        }
    }
    window.addEventListener('scroll', showModalByScroll); //при долистывании страницы до конца появляется модальное окно
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);



/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) { //073.используем деструктуризацию

        //061-062.Создание слайдера на сайте. 
        const slides = document.querySelectorAll(slide),
        slider = document.querySelector(container), //для 063
        prev = document.querySelector(prevArrow),
        next = document.querySelector(nextArrow),
        total = document.querySelector(totalCounter),
        current = document.querySelector(currentCounter),
        slidesWrapper = document.querySelector(wrapper), //для 2 вар, главная обертка.
        width = window.getComputedStyle(slidesWrapper).width, //для 2 вар, ширина отверстия/окошко через которое мы будем видеть наш слайд.
        slidesField = document.querySelector(field); //для 2 вар, поле с нашими слайдами.
       
    let slideIndex = 1;

    //062.Создание слайдера на сайте. 2 вариант.
    //В файле html обернули слайды еще в один блок <div class="offer__slider-inner">, делается это для того, чтобы главная обертка была как окошко, через которое мы можем видеть текущий слайд
    let offset = 0; //для смещения слайдов, необходимо установить отступ.
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }
    slidesField.style.width = 100 * slides.length + '%'; //ширина блока со слайдами
    slidesField.style.display = 'flex'; //изменяем свойство display, применяем flex чтобы все слайды выстроились в одну полоску
    slidesField.style.transition = '0.5s all'; //добавляем свойство transition для плавного передвижения слайдов
    slidesWrapper.style.overflow = 'hidden'; //скрываем все элементы которые не попадают в область видимости
    slides.forEach(slide => { //берем все слайды, перебираем и каждому слайду установим одинаковую ширину 
        slide.style.width = width;
    })

    //063.Создание навигации по слайдам
    slider.style.position = 'relative';
    const indicators = document.createElement('ol'), //создали элемент с тегом ol (ordered list - упорядоченный список), а внутри каждый элемент li
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
        `;
    slider.append(indicators);
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li'); //создаем элемент точки с тегом li
        dot.setAttribute('data-slide-to', i + 1); //установить каждой точке атрибут и нумерацию начиная с единицы
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
            `;

        if (i == 0) {
            dot.style.opacity = 1; //подсветка текущего индикатора слайдов
        }

        indicators.append(dot);
        dots.push(dot); //поместили точку в массив
    }
    next.addEventListener('click', () => {
        if (offset == deleteNoDigits(width) * (slides.length - 1)) {
            //тк в width лежит строка с px (к примеру 500px), то необходимо отрезать два последних символа. Если наш отступ будет равен ширине одного слайда * на количество слайдов -1, то установить offset в ноль, это означает, что мы долистали до самого конца и нам необходимо вернуться в самое начало
            offset = 0;
        } else {
            offset += deleteNoDigits(width); //добавляем к отступу ширину еще одного сладйа
        }
        slidesField.style.transform = `translateX(-${offset}px`; //трансформация элемента по оси Х, минус означает смещение влево.

        if (slideIndex == slides.length) { //если дошли до конца слайдера, необходимо переместиться в первую позицию
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        /*  if (slides.length < 10) { 
             current.textContent = `0${slideIndex}`
         } else {
             current.textContent = slideIndex;
         }
         dots.forEach(dot => dot.style.opacity = '.5'); //для 063
         dots[slideIndex - 1].style.opacity = 1; //для 063 */
        setOpacity();
        addZero();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) { //здесь мы уже проверяем не последний слайд, как в next, а первый.
            offset = deleteNoDigits(width) * (slides.length - 1) //перемещаемся в самый конец. В offset записываем последний слайд.
        } else {
            offset -= deleteNoDigits(width); //отнимаем ширину слайда
        }
        slidesField.style.transform = `translateX(-${offset}px`

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        /* if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        }

        //063
    
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1; */
        setOpacity();
        addZero();
    })
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNoDigits(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px`;

              /*  if (slides.length < 10) {
                  current.textContent = `0${slideIndex}`;
              } else {
                  current.textContent = slideIndex;
              }
              
              dots.forEach(dot => dot.style.opacity = '.5');
              dots[slideIndex - 1].style.opacity = 1;  */
            setOpacity();
            addZero();
        });
    });

    function setOpacity() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1; //подсветка точки активного слайда
    }

    function addZero() { //если слайдов меньше 10, добавляем к индексу ноль 
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function deleteNoDigits(str) {
        return +str.replace(/\D/g, '')
    }

    /*   //061.Создание слайдера на сайте. 1 вариант.

      showSlides(slideIndex);
      if (slides.length < 10) {
          total.textContent = `0${slides.length}`;
      } else {
          total.textContent = slides.length;
      }

      function showSlides(n) {
          if (n > slides.length) {
              slideIndex = 1;
          }
          if (n < 1) { //если при прокрутке слайдов уходим в отрицательную сторону, то просто перемещаемся в конец
              slideIndex = slides.length;
          }

          slides.forEach(item => item.style.display = 'none');

          slides[slideIndex - 1].style.display = 'block';

          //   showSlides(slideIndex);
          if (slides.length < 10) {
              current.textContent = `0${slideIndex}`;
          } else {
              current.textContent = slideIndex;
          }
      }

      function plusSlides(n) {
          showSlides(slideIndex += n);
      }

      prev.addEventListener('click', () => {
          plusSlides(-1)
      });

      next.addEventListener('click', () => {
          plusSlides(1)
      }); */

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    //Tabs
    /*  3 задачи:
     1)Функция которая будет скрывать ненужные нам табы
     2)Функция показа нужного Таба
     3)Назначить обработчик события на меню */
    const tabs = document.querySelectorAll(tabsSelector), //получение всех вкладок на которые будем кликать, тк класс ставим точку
        tabsContent = document.querySelectorAll(tabsContentSelector), //получение класса отвечающего за контент
        tabsParent = document.querySelector(tabsParentSelector); //родитель который будет содержать все табы/вкладки

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
            item.classList.remove(activeClass); //удалить у каждого элемента Таба класс активности, тк мы работаем с классами, команда classList, то точку не ставим.
        });
    }

    function showTabContent(i = 0) { //если функция вызыватся без аргумента, то по умолчанию 0, те показ первого слайда.
        //tabsContent[i].style.display = 'block'; используем inline стили, эту строку заменили на две нижестоящие.
        tabsContent[i].classList.add('show', 'fade'); //вместо inline стилей используем классы. Добавляем класс show с анимацией
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    //Используем делигирование событий
    tabsParent.addEventListener('click', (event) => {
        const target = event.target; //необязательное, но желательное действие, можно было обращаться к event.target
        //073.тк в classList используется значение без точки, те ее необходимо убрать
        if (target && target.classList.contains(tabsSelector.slice(1))) { 
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

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function timer(id, deadline) {
    
    // Timer (Таймер, осталось до конца акции, обратный отсчет) 041
    //1) должна быть какая то функция которая будет устанавливать наш таймер (те получать элементы и что то с ними делать)
    //2) должна быть функция, определяющая разницу между временем конечным и текущим у пользователя.
    //3) функция которая занимается обновлением нашего таймера
    //const deadline = '2021-06-13'; //дата обратного отсчета
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
    setClock(id, deadline); //первая переменная это selector
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);

/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "postData": () => (/* binding */ postData),
/* harmony export */   "getResourse": () => (/* binding */ getResourse)
/* harmony export */ });
//Тк функции postDate и getResourse работают с сервером и могут пригодится в разных местах, то их обычно выносят в отдельную папку и файлы и называют сервисами.

//Async_await превращает асинхронный код в синхронный
//При запуске функции postDate начинает идти запрос и тк указано ключевое слово await браузеру необходимо дождаться результата этого запроса
//Если не прописать Async/await выйдет ошибка на шаге res.json(), тк из fetch ничего не вернулось, а мы будет пытаться обработать результат методом json
//async ставится перед функцией
const postData = async (url, data) => { //функция Function expression. data это то, что мы отправляем на сервер.
    const res = await fetch(url, { //это асинхронный код, тк мы не знаем через сколько ответит сервер, но тк прописан await JS будет ждать результата зпроса.
        method: 'POST', //настройка каким образом
        headers: { //для отправки  formData, headers не нужно
            'Content-type': 'application/json' //ставим не запятую, а двоеточие
        },
        body: data //настройка что именно отправлять
    });

    return await res.json(); //функция возвращает ответ-промис, который трансформируется в формат json, но тк мы не знаем насколько большой объект и сколько времени займет трансформация следовательно указываем слово await

};


const getResourse = async (url) => { //функция Function expression
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); //для того чтобы ошибка выпала из нашей функции используем оператор throw
    }
    return await res.json(); //функция возвращает промис, который трансформируется в формат json
};





/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");








//импорты выносим в самое начало кода

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__.openModal)('.modal', modalTimerId), 60000); //через 6 сек откроется модальное окно, если он ранее его не открывал
    (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_0__.default)('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__.default)('[data-modal]', '.modal', modalTimerId);
    (0,_modules_timer__WEBPACK_IMPORTED_MODULE_2__.default)('.timer', '2021-09-13');
    (0,_modules_cards__WEBPACK_IMPORTED_MODULE_3__.default)();
    (0,_modules_calc__WEBPACK_IMPORTED_MODULE_4__.default)();
    (0,_modules_forms__WEBPACK_IMPORTED_MODULE_5__.default)('form', modalTimerId);
    (0,_modules_slider__WEBPACK_IMPORTED_MODULE_6__.default)({ //передаем объект с настройками, благодаря деструктуризации, порядок свойств не имеет значения
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        slide: '.offer__slide',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });

});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map