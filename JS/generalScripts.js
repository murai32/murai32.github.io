/*СЕРВИСНЫЕ ФУНКЦИИ*/

/*Тест на тип устройства*/
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};


/*Тест на корневую страницу*/
function isRootPage() {
    if (location.pathname == "/") {
        return true;
    }
};


/*Тест на наличие узла на странице*/
function isInPage(node) {
    return (node === document.body) ? false : document.body.contains(node);
};



/*ФУНКЦИИ*/

/*Логика работы инверсионноо курсора*/

function initCustomCursor() {

    /*Требует подключения библиотеки!
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.1/TweenMax.min.js">*/
    if (!isMobile) {
        let cursor = document.createElement('div');
        cursor.classList.add("custom-cursor");
        cursor.style.cssText = 'left: 1392px; top: 102px; opacity: 0;';
        document.body.appendChild(cursor);


        /*Вешаем слушателей событий на каждую ссылочку*/
        let links = document.querySelectorAll("a");
        for (let i = 0; i < links.length; i++) {
            let selfLink = links[i];

            selfLink.addEventListener("mouseover", function() {
                cursor.classList.add("custom-cursor--link");
            });
            selfLink.addEventListener("mouseout", function() {
                cursor.classList.remove("custom-cursor--link");
            });
        }

        /*Вешаем слушателей событий на каждую ссылочку*/
        window.setTimeout(function() {
            /*Вызова функции setTimout  в данном случае костыль. 
            
            Проблема: "На странице подключен Тильдовский Lazy Load, 
            который подгружает изображения на которые необходимо повесить 
            обработчики событий после события DOMContentLoaded.
            Корректным решением будет обрабатываеть событие тильдовского 
            скрипта Lazy Load, если данные скрипт генерирует события.
            
            Тикет: https://www.notion.so/pavel-bogatyi/onMouseIn-onMouseOut-2157fecc3b8c42219932664d02000ec6
            " */

            let zoomControls = document.querySelectorAll('.t-zoomable, .t-zoomer__show .t-carousel__zoomer__inner, .t-zoomer__show .t-zoomable');
            console.log(zoomControls.length);

            for (let i = 0; i < zoomControls.length; i++) {
                let selfLink = zoomControls[i];
                let pic = '<div class="custom-cursor__Background"></div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11H13V2H11V11H2V13H11V22H13V13H22V11Z"/></svg>';

                selfLink.style.cursor = 'none'; // убираем курсор на ховер изображения
                selfLink.addEventListener("mouseover", function() {
                    cursor.classList.add("custom-cursor--zoom");
                    cursor.innerHTML = pic;
                });
                selfLink.addEventListener("mouseout", function() {
                    cursor.classList.remove("custom-cursor--zoom");
                    cursor.innerHTML = '';
                });
            }
        }, 250);




        /*Логика передвижения курсора*/
        let initCursor = false;
        window.onmousemove = function(e) {
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            if (!initCursor) {
                TweenLite.to(cursor, 0.3, {
                    opacity: 1
                });
                initCursor = true;
            }

            TweenLite.to(cursor, 0, {
                top: mouseY + "px",
                left: mouseX + "px"
            });
        };


        window.onmouseout = function(e) {
            TweenLite.to(cursor, 0.3, {
                opacity: 0
            });
            initCursor = false;
        };
    }
}


/*Модифицируем хедер на главной странице*/
function ModifyRootHeader() {
    let pattern = document.querySelector(".uc-header_Pattern");
    let logo = document.querySelector(".uc-header_Logo");

    logo.classList.add("uc-header_Logo_hidden");
    pattern.classList.add("uc-header_Pattern_visible");

}


/*Логика прячущегося Header*/
function initHidebleHeader() {
    let hidebleHeader = document.querySelector(".uc-hidebleHeader"); /// уточнить селектор
    let hideByBlock = document.querySelector('.uc-mainSliderBlock'); // блок у нижней границы которого хедер скрываетс
    let curTopPosition = 0;
    let hideAt = 0;

    if (hidebleHeader === null || hideByBlock === null) {
        console.error('"hidebleHeader" or "hideByBlock" elements doesn`t exist!');
    }

    // Задаем когда прятать хедер в зависимости от страницы
    if (isRootPage()) {
        hideAt = hideByBlock.scrollHeight;
    } else {
        hideAt = 200;
    }

    window.addEventListener('scroll', function() {

        // в зависимости от того куда прокуручиваем страницу добавляем или убираем CSS класс "срятать"
        if (curTopPosition < window.scrollY) {
            hidebleHeader.classList.remove("uc-hidebleHeader_visible");
        } else {
            if (window.scrollY <= hideAt) {
                // Если докрутили вверх до перетяжки со слайдером, то хедер не показываем
                hidebleHeader.classList.remove("uc-hidebleHeader_visible");
            } else {
                hidebleHeader.classList.add("uc-hidebleHeader_visible");
            }
        }

        // обновление текущей позиции
        curTopPosition = window.scrollY;
    });
};



/*Логика прячущегося Bottom navgation*/
function initHidebleBottomNav() {
    let hidebleBottomNav = document.querySelector(".uc-bottom-nav-panel");
    let curTopPosition = window.scrollY;
    let showAt = 650; // Значение параметра scrollY при котором показываем блок

    hidebleBottomNav.classList.add("uc-bottom-nav-panel_hidden");

    if (window.scrollY >= showAt) {
            // Если при загрузке страницы scrollY больше showAt, то показываем блок
            hidebleBottomNav.classList.remove("uc-bottom-nav-panel_hidden");
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY >= showAt) {
            // Если докрутили до showAt, то показываем блок
            hidebleBottomNav.classList.remove("uc-bottom-nav-panel_hidden");
        } else {
            hidebleBottomNav.classList.add("uc-bottom-nav-panel_hidden");
        }
        // обновление текущей позиции
        curTopPosition = window.scrollY;
    });
};




/* УБИРАЕМ ТИЛЬДОВСКИЙ ЛЕЙБАК В ФУТЕРЕ*/
function removeNastyFooter() {
    // let nastyFooter = document.querySelector('img[fetchpriority*="low"]');
    let nastyFooter = document.querySelector('#tildacopy');
    if (nastyFooter != undefined) {
        window.setTimeout(function() {
            // let parentlevel = 4; //указываем сколько уровней до целевого родителя. Через ж!, но пока так.

            // for (let i = 1; i < 5; i++) {
            //     nastyFooter = nastyFooter.parentNode;
            // };
            // nastyFooter.remove();
            nastyFooter.style.position = 'absolute'; // убираем элемент с потока
            nastyFooter.style.top = '-1000vh !impotant'; // убираем элемент с потока
            nastyFooter.style.left = '-1000px impotant'; // убираем элемент с потока

        }, 450);
    } else {
        console.error('Тильдовский лейбак не убирается. Смотри на элемента тильдовского футера к которому можно привязать ссылку на элемент');
    }
}



function setCustomHamburgerBtn() {

    let btns = document.querySelectorAll(".Header-MainMenuBtn"); // Элементы кастомного контрола
    // let defaultControl = document.querySelector('.t280__burger');  
    let defaultControl = document.querySelector('.t-menuburger');
    let customControls = []; // массив кнопокок меню    


    function newBtnWrapper(container) {
        // создаем контейнер для кнопок и описываем все его желаемые параметры
        let elm = document.createElement("a");
        elm.setAttribute('class', 'Header-MainMenuWrapper');
        elm.setAttribute('href', 'javascript:void(0);');
        container.appendChild(elm);
        return elm;
    }



    if (btns !== null) {
        let menuBlock = document.querySelector('.t280');
        let elmParentBlockID; // Ссылка на верхнеуровневый блок
        let curWrapper; // Ссылка на текущую обертку элементов кнопки меню

        [].forEach.call(btns, function(elm) {
            if (elmParentBlockID === "undefined" || elmParentBlockID != elm.closest('[id*="rec"]')) {
                // условие для работы с новым блоком
                elmParentBlockID = elm.closest('[id*="rec"]'); //Задаем ссылку на верхнейровневый блок
                curWrapper = newBtnWrapper(elm.closest('[class*="t396__artboard"]')); //создаем новую обертку 
                curWrapper.appendChild(elm); // помещаем в обертку элемент
            } else {
                //если элемент из уже знакомого блока
                curWrapper.appendChild(elm);
            }

            elm.onclick = function() {
                //Вешаем обрабочик для раскрытия меню на бургеры
                defaultControl.click(); // вызываем событие для стандартного тильдовского элемента
            };

            // !!!проверить работу этого скрипта, нафига он нужен??
            defaultControl.onclick = function() {
                console.log('вызов события КЛИК на .... ?? клик по стандартному контролу??');
                // Ссылка на верхнеуровневый блок
                // тут можно скопировать элмент меню перед закрытием. Так сказать сделать фейковую подложку
                // мы использовали в самом начале стандартный контрол вызова меню.
                menuBlock.classList.toggle('t280_hidden'); // скрываем элменты вызова меню по умолчанию
            };
        });

        /*Это костыль, который позволяет переходить по ссылке из меню 
        минуя закрытие полноэкранного модального окна, т.е. таким образом 
        предотвращается мерцание. Эта проблема возникает из-за тильдовского скрипта.*/
        document.querySelector('.t280__menu').classList.add("t978__tm-link");
        menuBlock.classList.toggle('t280_hidden');
    } else {
        console.error('Элементы класса .Header-MainMenuBtn в DOM не определены');
    }
}


/* Оборачиваем крестик "закрыть" в тег <a>  */
function wrapMainMenuCloseBtn() {
    // let btnContainer = document.querySelector('.t280__burger');
    let btnContainer = document.querySelector('.t-menuburger');
    if (btnContainer != undefined) {
        // let burgerBars = document.querySelectorAll('.t280__burger span'); // выделяем составные части бургера
        let burgerBars = document.querySelectorAll('.t-menuburger span'); // выделяем составные части бургера
        let newElmItem = document.createElement("a"); // создаем элемент ссылка-обертка и добавляем атрибуты
        let closePic = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.707 4.70697L19.293 3.29297L12 10.586L4.707 3.29297L3.293 4.70697L10.586 12L3.293 19.293L4.707 20.707L12 13.414L19.293 20.707L20.707 19.293L13.414 12L20.707 4.70697Z" fill="black"/></svg>'


        newElmItem.setAttribute('href', 'javascript:void(0);');
        newElmItem.innerHTML = closePic;
        btnContainer.appendChild(newElmItem);

        btnContainer.appendChild(newElmItem);
        [].forEach.call(burgerBars, function(elm) {
            // Удаляем из DOM все элементы из которых складывался контрол "крестик"
            elm.remove();
        });
    } else {
        // console.error('Элементы класса .t280__burger в DOM не определены');
        console.error('Элементы класса .t-menuburger в DOM не определены');
    }
}



/* ИНИЦИИРУЕМ ВСЕ НЕОБХОДИМЫЕ СКРИПТЫ. Инициация должна находиться в самом низу*/
document.addEventListener("DOMContentLoaded", function(event) {

    //projectsBlockChangeGrid();// Заужаем сетку блока Last-projects-block для вертикального заголовка блока    
    //projectsBlockImgWrap();// Оборачиваем изображения блока Last-projects-block
    //placeAwardRibon();// Помещаем ленточку awward на карточку Melon office


    //restructCompetenceBlock();//Оборачиваем элементы компетенцимй в <a>




    /*Тут хочется вызов этих функций упаковать во что-то общее для главного меню*/
    initHidebleHeader(); //Подключаем хедер который прячется на scrolldown

    if (isInPage(document.querySelector(".uc-bottom-nav-panel"))) {
        initHidebleBottomNav(); //Подключаем прячущуюся нижнюю навигационную панель
    }


    wrapMainMenuCloseBtn(); //Оборачиваем элементы кнопки закрыть главного меню (в модальном окне) в <a>
    setCustomHamburgerBtn(); //Подключаем кастомный элементы вызова меню 



    //removeNastyFooter();//Отключаем тильдовский маркетинг
    initCustomCursor(); // Всегда инициируй последним!
});