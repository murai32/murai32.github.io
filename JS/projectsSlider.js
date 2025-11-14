const container = document.querySelector(".notable-projects");
const slider = document.querySelector(".notable-projects .slider");
const leftBtn = document.querySelector(".notable-projects .nav-btn.left");
const rightBtn = document.querySelector(".notable-projects .nav-btn.right");
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

function RunProjestsSlider() {
  //Логика работы слайдера

  let isDragging = false;
  let cursorStartX = 0;
  let translateX = 0;
  let prevXShift = 0;
  let minXShift = 0;
  let maxXShift = 0;
  let shiftAmount = 0;

  // Константы для множителей
  const dragMultiplier = 2.25;
  const wheelMultiplier = 0.75;

  // Функция для получения текущего translateX из стиля
  function getCurrentTranslateX() {
    const match = slider.style.transform.match(
      /translateX\((-?\d+(\.\d+)?)px\)/
    );
    return match ? parseFloat(match[1]) : 0;
  }

  // Функция для ограничения translateX в пределах границ
  function clampTranslateX() {
    if (translateX > minXShift) translateX = minXShift;
    else if (translateX < maxXShift) translateX = maxXShift;
  }

  // Функция для обновления позиции слайдера и проверки кнопок
  function updatePosition() {
    slider.style.transform = `translateX(${translateX}px)`;
    checkButtons();
  }

  // Функция для проверки и отключения кнопок на краях
  function checkButtons() {
    rightBtn.classList.toggle("disabled", translateX >= minXShift);
    leftBtn.classList.toggle("disabled", translateX <= maxXShift);
  }

  // Функция для обновления размеров (для ресайза и инициализации)
  function updateDimensions() {
    const firstCard = document.querySelector(".notable-projects .project-snippet");
    if (!firstCard) return;

    const cardWidth = firstCard.clientWidth;
    const margin = parseInt(getComputedStyle(firstCard).marginRight, 10) || 20;
    shiftAmount = cardWidth + margin;
    maxXShift = -(slider.scrollWidth - container.clientWidth);

    // Ограничить текущий translateX после ресайза
    clampTranslateX();
    updatePosition();
  }

  // Инициализация размеров
  updateDimensions();

  // Обработчик ресайза
  window.addEventListener("resize", updateDimensions);

  // Обработчики драга мышью
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    cursorStartX = e.pageX;
    prevXShift = getCurrentTranslateX();
    slider.classList.add("grabbing");
    e.preventDefault();
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const shiftX = e.pageX - cursorStartX;
    translateX = prevXShift + shiftX * dragMultiplier;
    clampTranslateX();
    updatePosition();
  });

  slider.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove("grabbing");
  });

  // Обработчики драга тач
  slider.addEventListener("touchstart", (e) => {
    isDragging = true;
    cursorStartX = e.touches[0].pageX;
    prevXShift = getCurrentTranslateX();
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const shiftX = e.touches[0].pageX - cursorStartX;
    translateX = prevXShift + shiftX;
    clampTranslateX();
    updatePosition();
    e.preventDefault(); // Предотвращаем скролл страницы во время тач-драга
  });

  slider.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
  });

  // Обработчик колеса
  slider.addEventListener("wheel", (e) => {
    leftBtn.classList.toggle("disabled", translateX <= maxXShift);

    const shiftX = e.deltaY;
    prevXShift = getCurrentTranslateX();
    translateX = prevXShift - shiftX * wheelMultiplier;

    if ((translateX <= minXShift) & (translateX >= maxXShift))
      e.preventDefault(); // Блокируем вертикальную прокрутку

    clampTranslateX();
    updatePosition();
  });

  // Обработчики кнопок (исправлено: left сдвигает вправо (предыдущее), right сдвигает влево (следующее))
  rightBtn.addEventListener("click", () => {
    translateX += shiftAmount; // Сдвиг для показа предыдущего (увеличение translateX)
    clampTranslateX();
    updatePosition();
  });

  leftBtn.addEventListener("click", () => {
    translateX -= shiftAmount; // Сдвиг для показа следующего (уменьшение translateX)
    clampTranslateX();
    updatePosition();
  });

  // Скрыть кнопки на мобильных
  if (isMobile) {
    leftBtn.style.display = "none";
    rightBtn.style.display = "none";
  }
}

function composeSlider() {
  document.querySelector(".uc-projects-block").style.display = "none"; // На всякий случай прячем блок-донор (лучше прописать на уровне стилей)

  let snippets = document.querySelectorAll(".uc-projects-block div.t404__col");
  // 1.  Нужно добавить каждому сниппету класс "project_snippet"
  // 2. Вставить сниппеты в slider

  snippets.forEach((snippet) => {
    // Перемещаем снипеты в слайдер
    snippet.classList.add("project-snippet");
    slider.prepend(snippet);
  });

  document.querySelector(".uc-projects-block").remove; // Удаляем блок-донор, что б не было проблем с версткой

  // Тут нужно описать проверку на успешность рекомпозиции
  // 1. Нужно проверить есть ли блок из которого будем брать элементы
  // 2. Нужно проверить есть ли хотя б 1 сниппет карточки проекта
  // 3. Нужно вернуть в верхнеуровневый контейнер структуру слайдера
  // 4. Нужно переместить все сниппеты в слайдер
  // 5. Сниппетам нужно добавить необхдимые классы
  // 5. Провереить, что родительский блок из которого брал и сниппеты, скрыт
  // 6. Возможно сделать скелетон, если загрузка сниппетов (и изображений) медленная

  // if () return false;
  return true;
}

function projestsSliderInit() {
  if (composeSlider()) RunProjestsSlider();
}

projestsSliderInit();
