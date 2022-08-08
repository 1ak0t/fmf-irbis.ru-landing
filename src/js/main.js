const counts = document.querySelectorAll('.counts__item');
const topSliderBlock = document.querySelector('.slider__slides');
const topSliderWrapper = document.querySelector('.slider__wrapper');
const topSlider = document.querySelector('.slider');


////Resize top slider by window width
const setTopSliderHeight = () => {
    const windowInnerWidth = document.documentElement.clientWidth;
    topSlider.style.height = `${windowInnerWidth*0.25}px`;
    topSliderWrapper.style.height = `${windowInnerWidth*0.25}px`;
    topSliderBlock.style.height = `${windowInnerWidth*0.25}px`;
}

setTopSliderHeight();
window.addEventListener('resize', setTopSliderHeight);



////Animate counts
let intevalTime = 300;

counts.forEach((count) => {


    const interval = setTimeout(() => {
        count.style.bottom = '0';
    }, intevalTime);

    intevalTime = intevalTime + 300;

});


////Sliders

//Top slider
const swiperMain = new Swiper('.slider__slides', {
    watchOverflow: true,
    speed: 2000,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    simulateTouch: false,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },

    effect: 'fade',
    fadeEffect: {
        crossFade: true,
    }
});


//Millings slider
const swiperMillings = new Swiper('.slider-millings', {
    navigation: {
        nextEl: '.millings__next',
        prevEl: '.millings__prev',
    },
    slidesPerView: 4,
    spaceBetween: 25,
    watchOverflow: true,
    speed: 200,
    keyboard: {
        enable: true,
        onlyInViewport: true,
    },
    mousewheel: {
        sensitivity: 1,
    },
});


//Textures slider
const swiperTextures = new Swiper('.slider-textures', {
    navigation: {
        nextEl: '.textures__next',
        prevEl: '.textures__prev',
    },
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 25,
    watchOverflow: true,
    speed: 2000,
    keyboard: {
        enable: true,
        onlyInViewport: true,
    },
    mousewheel: {
        sensitivity: 5,
    }
});


////Slide to milling category
const millingCatagories = document.querySelectorAll(".millings__category");
const millingCards = document.querySelectorAll('.slider-millings__card');
const millingCardsArray = Array.from(millingCards);

const changeCategoryHandler = (evt) => {
    const cardIndex = millingCardsArray.findIndex((card) => card.dataset.hash === evt.target.id);
    millingCatagories.forEach((button) => button.classList.remove('millings__category--active'));
    evt.target.classList.add('millings__category--active');
    swiperMillings.slideTo(cardIndex, 2500);
    window.location.hash = `#!${evt.target.id}`;
};

millingCatagories.forEach((button, index) => {
    button.addEventListener('click', changeCategoryHandler);
});

millingCards.forEach((card) => {
    if(card.dataset.hash) {
        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.target.classList.value.includes('active')) {
                    millingCatagories.forEach((button) => {
                        button.classList.remove('millings__category--active');

                        if(button.id === mutation.target.dataset.hash) {
                            button.classList.add('millings__category--active');
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(card, {attributes: true});
    }
});
