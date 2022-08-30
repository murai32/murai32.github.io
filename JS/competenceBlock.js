	/*ДЕЙСТВИЯ С БЛОКОМ КОМПЕТЕНЦИЙ*/


//ОБЕРТЫВАЕМ КОМПЕТЕНЦИИ В ТЕГ <a>, ДЛЯ КОРРЕКТНОГО ВЗАИМОДЕЙСТВИЯ
function restructCompetenceBlock(){
	let className = '.competence-bl__link-';  // Группирующий класс "competence-bl__link-N"
	
	
	/*!!!!!!!!!!!!*/
	//Определение количества комптенций (competenceNumber) необходимо автоматизировать!!
    //Можно обрезать названия групп через RegExp и выделять номер группы который уже присваивать competenceNumber 	
	let competenceNumber = 8; // Указываем количество групп которые будем в обертывать ссылкой
	/*!!!!!!!!!!!!*/
	//Определение количества комптенций (competenceNumber) необходимо автоматизировать!!
	
	
	
	let competenceBlock = document.querySelector(className+'1').parentNode; // указываем ссылку на родительский блок для дальнейшего инжекта


    /*  РАБОТАЕМ С КАЖДОЙ ГРУППОЙ В ОТДЕЛЬНОСТИ    */
	for (let i = 1; i <= competenceNumber; i++){

		let competenceElms = document.querySelectorAll(className+String(i));   // Создаем ссылки на все элементы группы
		try {
			let thisLinkAtts = document.querySelector(className+String(i)+' > a').attributes; // Элемент <a> от которого будем брать все атрибуты для создания ссылки-обертки
		} catch (err){
			console.error('В блоке "Компетенции" для компетенции .${competenceElms} отсутсвует целевой URL');
			console.error(err);
		}

		let newElmItem = document.createElement("a"); // создаем элемент ссылка-обертка
		let ElmItemClasses = "competence-bl__linkWrapper"; // обязательные классы элемента ссылка-обертка
		
		/*  РАБОТАЕМ С АТРИБУТАМИ ССЫЛКИ-ОБЕРТКИ    */
		for (let b = 0; b < thisLinkAtts.length; b++) {
		  //  добавляем эменту ссылка-обертка все обязательные атрибуты и атрибуты прородителя 
		    if (thisLinkAtts[b].name === "class") {
                //  записываем все атрибуты class в одну строку
		        ElmItemClasses = ElmItemClasses + " " + thisLinkAtts[b].value;
		            newElmItem.setAttribute( "class", ElmItemClasses);
		    } else {
	             // добавляем все остальные атрибуты прородителя
                newElmItem.setAttribute(thisLinkAtts[b].name, thisLinkAtts[b].value);
		    };
		}
		
		/*    РАБОТАЕМ С КАЖДЫМ ЭЛЕМЕНТОМ ГРУППЫ  "competence-bl__link-N" */
     	for (var a = 0; a < competenceElms.length; a++) {
            newElmItem.appendChild(competenceElms[a]); // добавляем все элементы группы в элменты ссылка-обертка
		}
		competenceBlock.appendChild(newElmItem); // Добавляем элемент ссылка обертка в узел competenceBlock
	}
}

/* ИНИЦИИРУЕМ ВСЕ НЕОБХОДИМЫЕ СКРИПТЫ. Инициация должна находиться в самом низу*/
document.addEventListener("DOMContentLoaded", function(event) {    
    
    restructCompetenceBlock();//Оборачиваем элементы компетенцимй в <a>

});