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

export {postData};

export {getResourse};