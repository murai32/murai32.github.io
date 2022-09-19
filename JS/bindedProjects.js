/*ДЕЙСТВИЯ С БЛОКОМ "СВЯЗАННЫЕ ПРОЕКТЫ"*/

let _bindedProjectsData; // сюда будем записывать JSON
function getBindedProjectsData(){
	return _bindedProjectsData
}



/*ПАРСИМ ИНФОРМАЦИЮ О ПРОЕКТАХ ИЗ БЛОКА "СВЯЗАННЫЕ ПРОЕКТЫ"*/

function parseBindedProjectsBlock(blockClass){
	let projectsBlock = document.querySelector(blockClass); // ссылка на блок "связанные проекты"
	let projectsData = document.querySelectorAll(blockClass + ' .t-uptitle'); // массив с ссылками на все элементы содержащие строки, которые необходимо привести к JSON и добавить в projects
    let projects = []; // Массив для хранения найденной информации парсером


    projectsData.forEach((data) => {
        //В этом цикле проводится проверка каждой возвращаемой сервером строки с data для каждого объект.
        //Если при компиляции вылавливается ошибка, то возвращаетмя сообщение в консоль.
        //Если формат данных корректен, то парсер приводит их в JSON объект, который далее добавляется в массив projects.

        try {
        	data.style.textTransform = "none"; // Добавляем свойство, что бы избежать ошибок при парсинге
            let projectData = JSON.parse(data.innerText); // парсим данные по данному проекту
            projectData.projectElm = data.closest('.t-carousel__item '); // каждому объекту необходимо дать ссылку на связанный с ним DOM Node (слайд)
            projects.push(projectData); // добавляем JSON объект в массив
        } catch (err) {
            console.error("Парсинг данных объекта не удался." + data.closest('.t-carousel__item').querySelector('.t-uptitle').innerText());
            console.error("Проверь корректность возвращаемых данных из параметра 'Подзаголовок' в настройках страницы на которую ссылается данная карточка:\n" + data.querySelector('.t-title').innerText());
            console.error(err.name);
            console.error(err.message);
        }
    });

    return _bindedProjectsData = projects;
}



/*ДОБАВЛЕНИЕ ДАТЫ ПРОЕКТА В ПОДЗАГОЛОВОК КАЖДОГО СЛАЙДА*/

function setProjectDate(data) {
    // Заменяем информацию передаваемую в подзаголовок на "год" реализации этого проекта
    data.forEach((project) => {
        project.projectElm.querySelector('.t-uptitle').innerText = project.year;
    });
}



/*ПРЯЧЕМ КОНТРОЛЫ СЛАЙДЕРА*/
function hideCarouselControls (){
	if (getBindedProjectsData().length > 1){
		querySelector(".uc-binded-project .t-carousel__indicators").style.display = "none";
		querySelectorAll(".uc-binded-project .t-carousel__control").style.display = "none";
	}
};

/*ИНИЦИАЛИЗАЦИЯ*/

document.addEventListener("DOMContentLoaded", function(event) {
	parseBindedProjectsBlock(".uc-binded-project"); // парсим информацию о проекте
	setProjectDate(getBindedProjectsData()); // устанавливаем дату взамен возвражаемой информации в подзаголовок
	hideCarouselControls(); // Прячем контролллы по условию
})