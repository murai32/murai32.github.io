document.addEventListener("DOMContentLoaded", function(event) {


class Filter {
	
	static filterBlock = document.querySelector(".uc-projects-filter"); // ссылка на блок с контролами фильтра (ссылку на блок оставим напрозапас)
	static _projectsData;



	/*ПАРСИМ ИНФОРМАЦИЮ О ПРОЕКТОВ ИЗ БЛОКА "СЕТКА ОБЪЕКТОВ"*/

	static parseProjectsBlock (blockClass){
			const projectsBlock = document.querySelector(blockClass); // ссылка на блок "проекты"
			const projectsData = document.querySelectorAll(blockClass +' .t404__tag'); // массив с ссылками на все элементы содержащие строки, которые необходимо привести к JSON и добавить в projects
			let projects = []; // Массив для хранения найденной информации парсером

			projectsData.forEach((data) => {
				//В этом цикле проводится проверка каждой возвращаемой сервером строки с data для каждого объект.
				//Если при компиляции вылавливается ошибка, то возвращаетмя сообщение в консоль.
				//Если формат данных корректен, то парсер приводит их в JSON объект, который далее добавляется в массив projects.

				try {
					let projectData = JSON.parse(data.innerText); // парсим данные по данному проекту
					projectData.projectElm = data.closest('.t404__col');// каждому объекту необходимо дать ссылку на связанный с ним DOM Node (projectNode)
					projects.push(projectData); // добавляем JSON объект в массив
				} catch(err) {
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
  static setProjectsData() {
    if (!document.querySelector(".uc-projects-block").matches(".uc-projects-block")) throw new Error("На странице отсутсвует блок 'Все проекты', либо ему не задан CSS-класс '.uc-projects-block'");
    this._projectsData = this.parseProjectsBlock(".uc-projects-block");
  }

  // Интерфейс возвращающий данные JSON "Все проекты"
  static getProjectsData() {
    return this._projectsData;
  }



  /*ДОБАВЛЕНИЕ ДАТЫ ПРОЕКТА ПОДЗАГОЛОВОК КАЖДОЙ КАРТОЧКИ ПРОЕКТА*/

static setProjectDate (data){
 // Заменяем информацию передаваемую в подзаголовок на "год" реализации этого проекта
  data.forEach((project) => {
    project.projectElm.querySelector('.t404__tag').innerText = project.year;
    project.projectElm.setAttribute('data-filter-by-type', project.type);
  });	
}



/*СОБИРАЕМ ВСЕ КАРТОЧКИ ПРОЕКТОВ В ОДНОМ БЛОКЕ*/

static gatherAllProjectIntoOneBlock (data){

	/*!!! функция не реализованна */
	let container;

  data.forEach((project) => {
    project.projectElm // ссылка на элемент
  });	
}
 


	constructor(){

		/*СОБИРАЕМ ИНФОРМАЦИЮ*/
		Filter.setProjectsData(); // Получаем JSON с информацией о проектах. Парсим блок с карточками проектов. 
		

		/*МАНИПУЛЯЦИИ С БЛОКОМ ПРОЕКТЫ*/
		Filter.setProjectDate(Filter.getProjectsData()); // Убираем передваемою в подзаголовок информацию, вставляя туда дату проекта

		console.warn("productsFilters.js подключен через github pages (https://murai32.github.io)");
	}
}



class FilterByType extends Filter {

	/*СОЗДАЕМ СПИСОК С УНИКАЛЬНЫМИ ПАРМЕТРАМИ ФИЛЬТРАЦИИ (ПО ТИПУ ОБЪЕКТА)*/

	createFilterTypesList () {	
		// Формируем список уникальных параметров ("типов") по которым будет проходить фильтрация
		let typesList = new Set();
		console.log(this.getProjectsData);
		this.getProjectsData.forEach((data) => { // добавляем список "типов проектов для фильтрации
			typesList.add(data.type);
		});  
		return typesList; // Возвращем список уникальных параметров
	}



	/*СОБИРАЕМ БЛОК "ФИЛЬТР ПО ТИПУ ОБЪЕКТА"*/

	createFilterStructure (typesList){
			const filterBaseStructure = "<div class='FilterByType'><label class='FilterByType-Label'>Вид проекта</label><ul class='FilterByType-ChipsBlock'><li class='FilterByType-ChoiceChip FilterByType-ChoiceChip_active'><a href='javascript:void(0);' data-filter-option='Все'>Все</a></li></ul></div>";
			let parser = new DOMParser();
			let filterControl = parser.parseFromString(filterBaseStructure, "text/html").querySelector('.FilterByType'); // трансформируем строку с нужным HTML в DOM элементы

			for (let type of typesList) {
	      // Добавляем в контрол filterControl "параметры фильтрации по типу объекта"
			  let listOption = "<li class='FilterByType-ChoiceChip'><a href='javascript:void(0);' data-filter-option='"+type+"'>"+type+"</a></li>"; // Структура контрола
			  let listElement = parser.parseFromString(listOption, "text/html").querySelector('.FilterByType-ChoiceChip'); // Трансформируем структуру контрла в DOM элемент
			  filterControl.querySelector('.FilterByType-ChipsBlock').appendChild(listElement); // Добавляем элемент в список фильтрующих параметров
			}
			return filterControl; // Возварщаем блок готовый к инсталяции в нужное место
	}



	/*ОБРАБОТКА СОБЫТИЯ "КЛИК ПО ПАРАМЕТРУ ФИЛЬТРАЦИИ ПО ТИПУ ОБЪЕКТА"*/

	filterProjectsBlockByType (filterProp){

		// Производим выборку карточек проекта по значению атрибута "data-filter-by-type"
	  for (let elem of document.querySelector(".uc-projects-block").querySelectorAll('[data-filter-by-type]')) {
		  // Если приходит значение аргумента функции "Все", то произвожу выборку по классу "ProjectCard_hidden" и удаляю его
		  if (filterProp == "Все"){
		  	if(elem.classList.contains('ProjectCard_hidden')){
		  		elem.classList.remove('ProjectCard_hidden');
		  	} 
		  } else {
			  // Если приходит значение со специфическим параметром, 
			  if (elem.matches('[data-filter-by-type="'+filterProp+'"]')) {
			  	// То необходимо показать все искомые карточки cо значением атрибута "data-filter-by-type".
	      	elem.classList.remove("ProjectCard_hidden");
	    	} else {
	    		// А не удовлетворяющие парметрам фильтрации скрыть
	    		elem.classList.add("ProjectCard_hidden");
	    	}
		  }
	  }
	}



	/*ДОБАВЛЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ ЭЛЕМЕНТАМ ФИЛЬТРА ПО ТИПУ ОБЪЕКТА*/

	setEventListeners (container){

		container.querySelector('.FilterByType-ChipsBlock').addEventListener("click", function(event){

			let elem = event.target;
			if (!event.target.matches(".FilterByType-ChoiceChip a")){ 
				// Производим проверку на то является ли элемент на который кликнули ".FilterByType-ChoiceChip a"
				// Нет, тогда находим ближайшего потомка и фиксируем его как целевой эдемент
				elem = event.currentTarget.querySelector(".FilterByType-ChoiceChip a")
			}

			// Отправляем данные в функцию которая будет манипулировать с блоком карточек объектов
			filterProjectsBlockByType(elem.getAttribute("data-filter-option")); 

			// Тут надо дать команду на установку класса-модификатара - active для элмента на который кликнули 
			// и удаления этого класса модификатора с того элемента где он стоял
			filterBlock.querySelector('.FilterByType-ChoiceChip_active').classList.remove('FilterByType-ChoiceChip_active');
			elem.closest("li").classList.add('FilterByType-ChoiceChip_active');

		});
	}

	constructor(){
		super(); //Вызываем родительский конструктор

		this.filterControls = this.createFilterStructure (this.createFilterTypesList ()); // 1.) Создаем список уникальных параметров фильтрации 2.) Создаем контрол, который далее вставим в нужный узел

		this.filterBlock.querySelector(".FiltersContainer").appendChild(this.filterControls); // Добавляем варианты филльтрации в фильтра по (виду проекта)

		this.setEventListeners(this.filterControls); // Инициализируем обработчик событий для фильтров по типу объекта


	}
}


let filterByType = new FilterByType();

})