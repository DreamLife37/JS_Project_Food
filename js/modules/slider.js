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

export default slider;