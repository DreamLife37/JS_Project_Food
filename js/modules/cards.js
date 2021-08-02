import {getResourse} from '../services/services';

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
    getResourse('http://localhost:3000/menu')
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

export default cards;