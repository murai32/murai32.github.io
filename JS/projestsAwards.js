/*ДОБАВЛЕНИЕ ЛЕНТОЧЕК НАГРАД*/

// Тикет задачи: https://www.notion.so/pavel-bogatyi/JSON-f59d15dec9694c5ba38978dde0791c09


// Добавляю на карточку проектов ленточики премий
function placeAwardRibon() {

    // Ищем по тексту заголовка элемент в который будем вставлять ленточку
    let targetElm;
    for (targetElm of document.querySelectorAll(".uc-projects-block a.t404__link")) {
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

        for (let wrappers of document.querySelectorAll('.t404__imgbox')) {
            //Обходим массив целевых элементов у которых можно взять искомую высоту, с целью найти те которые показываются на экране
            if (wrappers.clientHeight != 0){
                // Задаем высоту элементу обертка ленточки премии (ribbonWrapper) равную изображению .projectItem-Image > div 
                ribbonWrapper.style.height = wrappers.clientHeight + "px";                
                console.log('Задаем высоту блока обертки ленточки ' + wrappers.clientHeight + "px");
        
                break;
            }
            console.log(wrappers.clientHeight);
        }
    };

    setHeight();
    ribbonWrapper.appendChild(ribbonImg);
    targetElm.appendChild(ribbonWrapper);

    window.onresize = setHeight;

}



document.addEventListener("DOMContentLoaded", function(event) {
    placeAwardRibon();
});