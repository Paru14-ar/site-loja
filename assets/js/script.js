const imgs = document.querySelectorAll('.img-select a');

const imgBtns = [...imgs];

let imgid = 1;

// Adicionar imagens
const images = [
  { 'id': '1', 'url': './assets/img/banner/banner1.png' },
  { 'id': '2', 'url': './assets/img/banner/banner6.webp' },
  { 'id': '3', 'url': './assets/img/banner/banner5.webp' },
  { 'id': '4', 'url': './assets/img/banner/banner4.png' },
  { 'id': '5', 'url': './assets/img/banner/banner7.webp' },
];

const containerItems = document.querySelector("#container-items");

// Função para carregar as imagens no container
const loadImages = (images) => {
  images.forEach(image => {
    containerItems.innerHTML += `
      <div class='item'>
        <img src='${image.url}' alt='Image ${image.id}'>
      </div>
    `;
  });
};

loadImages(images);

let items = document.querySelectorAll(".item");

// Função para mover as imagens para a esquerda (anterior)
const previous = () => {
  const lastItem = items[items.length - 1];
  containerItems.insertBefore(lastItem, items[0]);
  items = document.querySelectorAll(".item");
};

// Função para mover as imagens para a direita (próximo)
const next = () => {
  containerItems.appendChild(items[0]);
  items = document.querySelectorAll(".item");
};

// Eventos de clique para anterior e próximo
document.querySelector("#previous").addEventListener("click", previous);
document.querySelector("#next").addEventListener("click", next);

let autoPlayInterval;

// Função para iniciar o autoplay
const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    next(); // Avança automaticamente para a próxima imagem
  }, 4000);
};

// Função para parar o autoplay
const stopAutoPlay = () => {
  clearInterval(autoPlayInterval);
};

// Iniciar o autoplay
startAutoPlay();

const interactiveElements = [containerItems, ... document.querySelectorAll('.container-shadow, .item, .item img')];

interactiveElements.forEach(element => {

element.addEventListener("mouseenter", stopAutoPlay);

element.addEventListener("mouseleave", startAutoPlay);

});

// Parar o autoplay quando o mouse entrar no container
containerItems.addEventListener("mouseover", stopAutoPlay);

// Reiniciar o autoplay quando o mouse sair do container
containerItems.addEventListener("mouseout", startAutoPlay);

//final
const wrapper = document.querySelector(".wrapper");

const carousel = document.querySelector(".carousel");  

const firstCardWidth = carousel.querySelector(".card").offsetWidth;  

const arrowBtns = document.querySelectorAll(".wrapper i");

const carouselChildren = [...carousel.children];  

let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

let cardPreView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildren.slice(-cardPreView).reverse().forEach(card => {
  carousel.insertAdjacentHTML("afterbegin", card.outerHTML);  
});

carouselChildren.slice(0, cardPreView).forEach(card => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);   
});

carousel.classList.add("no-transition");

carousel.scrollLeft = carousel.offsetWidth;

carousel.classList.remove("no-transition");

arrowBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;  
  });
});

// Função quando o usuário começa a arrastar
const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
}

// Função quando o usuário está arrastando
const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

// Função quando o usuário para de arrastar
const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {  
  // Se o carrossel estiver no início, rola para o final
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
    carousel.classList.remove("no-transition");
  }
  // Se o carrossel estiver no final, rola para o início
  else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {  
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) isAutoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 900 || !isAutoPlay) return;
  timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 1000);
};

autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);

wrapper.addEventListener("mouseleave", autoPlay);
