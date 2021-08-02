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

export default modal;
export {closeModal};
export {openModal};