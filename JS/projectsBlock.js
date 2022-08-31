let _projectsData;



/*ПАРСИМ ИНФОРМАЦИЮ О ПРОЕКТОВ ИЗ БЛОКА "СЕТКА ОБЪЕКТОВ"*/

function parseProjectsBlock(blockClass) {
    const projectsBlock = document.querySelector(blockClass); // ссылка на блок "проекты"
    const projectsData = document.querySelectorAll(blockClass + ' .t404__tag'); // массив с ссылками на все элементы содержащие строки, которые необходимо привести к JSON и добавить в projects
    let projects = []; // Массив для хранения найденной информации парсером

    projectsData.forEach((data) => {
        //В этом цикле проводится проверка каждой возвращаемой сервером строки с data для каждого объект.
        //Если при компиляции вылавливается ошибка, то возвращаетмя сообщение в консоль.
        //Если формат данных корректен, то парсер приводит их в JSON объект, который далее добавляется в массив projects.

        try {
            let projectData = JSON.parse(data.innerText); // парсим данные по данному проекту
            projectData.projectElm = data.closest('.t404__col'); // каждому объекту необходимо дать ссылку на связанный с ним DOM Node (projectNode)
            projects.push(projectData); // добавляем JSON объект в массив
        } catch (err) {
            console.error("Парсинг данных объекта не удался." + data.closest('.t404__col').querySelector('.t404__titel').innerText());
            console.error("Проверь корректность возвращаемых данных из параметра 'Подзаголовок' в настройках страницы на которую ссылается данная карточка:\n" + data.closest('.t404__col').querySelector('.t404__tag').innerText());
            console.error(err.name);
            console.error(err.message);
        }
    });
    return projects;
}



/* ИТЕРФЕЙС ДЛЯ РАБОТЫ С JSON-ОМ "ВСЕ ПРОЕКТЫ" */

// Интерфейс для получения и обновления JSON объекта с информацией о проектах
function setProjectsData() {
    if (!document.querySelector(".uc-l-projects-block").matches(".uc-l-projects-block")) throw new Error("На странице отсутсвует блок 'Последние проекты', либо ему не задан CSS-класс .uc-l-projects-block");
    _projectsData = parseProjectsBlock(".uc-l-projects-block");
}

// Интерфейс возвращающий данные JSON "Все проекты"
function getProjectsData() {
    return _projectsData;
}



/*ДОБАВЛЕНИЕ ДАТЫ ПРОЕКТА ПОДЗАГОЛОВОК КАЖДОЙ КАРТОЧКИ ПРОЕКТА*/

function setProjectDate(data) {
    // Заменяем информацию передаваемую в подзаголовок на "год" реализации этого проекта
    data.forEach((project) => {
        project.projectElm.querySelector('.t404__tag').innerText = project.year;
        project.projectElm.setAttribute('data-filter-by-type', project.type);
    });
}





/*ДЕЙСТВИЯ С Last-projects-block*/


// Переопределяем сетку в зависимости от ширинны блока Last projects block для добавления вертикального заголовка блока
function projectsBlockChangeGrid() {

    var projects = document.querySelectorAll(".uc-l-projects-block .t-col_6");

    function isOdd(num) { return num % 2; }; // функция для проверки четности или нечетности i-го элемента в блоке последние проекты

    function changeGrid() {
        if (window.innerWidth > 980) {
            for (var i = 0; i < projects.length; i++) {
                var selfLink = projects[i];

                selfLink.classList.remove("t-col_6");
                selfLink.classList.add("t-col_5");

                if (isOdd(i) == 0) {
                    selfLink.classList.add("t-prefix_2");
                }
            };
        };
    };

    changeGrid();
    window.onresize = changeGrid; //Подписываем вызов функции changeGrid на изменение размеров окна браузера
};


// Оборачиваем изображения блока Last-projects-block
function projectsBlockImgWrap() {
    // Выбираем все картинки

    var itemsImages = document.querySelectorAll(".uc-l-projects-block a .t-bgimg");

    for (var i = 0; i < itemsImages.length; i++) {

        var selfLink = itemsImages[i];
        var org_html = selfLink.outerHTML;
        var new_html = "<div class='projectItem-Image'>" + org_html + "</div>";

        selfLink.outerHTML = new_html;

    };
};

// Добавляю на карточку проектов ленточики премий
function placeAwardRibon() {

    // Ищем по тексту заголовка элемент в который будем вставлять ленточку
    let targetElm;
    for (targetElm of document.querySelectorAll(".uc-l-projects-block a.t404__link")) {
        if (targetElm.textContent.includes("Melon")) {
            // Если TRUE, то обрываем цикл. А в targetElm остается ссылка на ссылку на необходимый элемент
            break;
        }
    }

    // Создаем элемент обертка ленточки премии
    let ribbonWrapper = document.createElement("div");
    ribbonWrapper.setAttribute('class', 'ribbonImg_award_best-office');

    // Создаем элемент изображение с лого премии
    let ribbonImg = document.createElement('img');
    ribbonImg.setAttribute('src', 'https://gist.githubusercontent.com/murai32/24b54e76db904cc20e0f9f5d8f57c783/raw/8cf84daeb350986066aa3790fd03bf8aa22c2f2a/logo_boa_LAUREAT_2020_f-02-B.svg');

    function setHeight() {
        // Задаем высоту элементу обертка ленточки премии (ribbonWrapper) равную изображению .projectItem-Image > div 
        ribbonWrapper.style.height = document.querySelector('.t404__imgbox').offsetHeight + "px";
    };

    setHeight();
    ribbonWrapper.appendChild(ribbonImg);
    targetElm.appendChild(ribbonWrapper);

    window.onresize = setHeight;



}



/* ИНИЦИИРУЕМ ВСЕ НЕОБХОДИМЫЕ СКРИПТЫ. Инициация должна находиться в самом низу*/
document.addEventListener("DOMContentLoaded", function(event) {

    projectsBlockChangeGrid(); // Заужаем сетку блока Last-projects-block для вертикального заголовка блока    
    setProjectsData(); //Парсим JSON
    setProjectDate(getProjectsData()); //Ставим даты на карточки проектов

    // projectsBlockImgWrap();// Оборачиваем изображения блока Last-projects-block
    placeAwardRibon(); // Помещаем ленточку awward на карточку Melon office



})