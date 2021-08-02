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

export default timer;