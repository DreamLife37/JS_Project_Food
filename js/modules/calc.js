function calc() {
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

module.exports = calc;