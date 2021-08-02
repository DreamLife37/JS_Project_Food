import {closeModal, openModal} from './modal';
import {postData} from '../services/services';
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

            postData('http://localhost:3000/requests', json)
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
        openModal('.modal', modalTimerId); //открытие модального окна

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
            closeModal('.modal');
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

export default forms;