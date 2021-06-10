$(document).ready(function () {

	const slickElement = $('.video-reviews__container');
	// Slider counter
	slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
		const currentEl = $('.video-reviews__pagination_current');
		const totalEl = $('.video-reviews__pagination_total');
		const initialValue = slick.options.slidesToShow;
		let totalSlides = Math.ceil(slick.slideCount / initialValue);
		let current = 0;

		// Отображаем кол-во блоков (1 блок(4слайда) из 2) когда slidesToShow = slidesToScroll
		// Или
		// Выводим число элементов слайдера (4 слайда из 8)
		if (initialValue !== slick.options.slidesToScroll) {
			const slidesToScroll = slick.options.slidesToScroll;
			current = (currentSlide ? initialValue + currentSlide - slidesToScroll : initialValue - slidesToScroll) + slidesToScroll;
			current < Math.ceil(slick.slideCount) ? currentEl.text(Math.round(current)) : currentEl.text(Math.ceil(slick.slideCount));
			totalEl.text('/' + slick.slideCount)
		} else {
			current = (currentSlide ? Math.ceil(currentSlide / initialValue) : 0) + 1;
			current < totalSlides ? currentEl.text(current) : currentEl.text(totalSlides);
			totalEl.text('/' + totalSlides)
		}
	});


	$('.video-reviews__container').slick({
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 4,
		// draggable: false,
		speed: 800,
		prevArrow: $('.video-reviews__button-previous'),
		nextArrow: $('.video-reviews__button-next'),
		responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				}
			},
			{
				breakpoint: 626,
				settings: {
					infinite: true,
					slidesToShow: 2,
					slidesToScroll: 2,
				}
			},
			{
				breakpoint: 480,
				settings: {
					infinite: true,
					speed: 500,
					slidesToShow: 1.2,
					slidesToScroll: 1
				}
			}
		]
	});
	// Video play

	const videoBlock = document.querySelectorAll('.video-reviews__block');

	videoBlock.forEach(el => {
		const video = el.querySelector('.video-reviews__video')
		const button = el.querySelector('.video-reviews__button-play')
		const play = el.querySelector('.video-reviews__play');
		const stop = el.querySelector('.video-reviews__stop');
		// константы для ProgressBar
		const progress = el.querySelector('.video-reviews__progress')
		const progressBar = el.querySelector('.video-reviews__progress-bar')

		if (video && button) {
			play.classList.add('active')

			button.addEventListener('click', function () {
				if (video.paused) {
					video.play();
					button.classList.add('active')
					play.classList.remove('active')
					stop.classList.add('active')
				} else {
					video.pause();
					play.classList.add('active')
					stop.classList.remove('active')
				}
			}, false);
		}

		// Start ProgressBar
		if (progress) {
			// Обновляем полузнок
			const updateProgressBar = () => {
				let percentage = Math.floor((100 / video.duration) * video.currentTime);
				progress.style.cssText = `width: ${percentage}%`;
			}
			// Начинаем воспроизведения с того момента по которому кликнули
			function seek(event) {
				let percent = event.offsetX / this.offsetWidth;
				video.currentTime = percent * video.duration;
				event.target.value = Math.floor(percent / 100);
			}
			// Слушатели
			video.addEventListener('play', () => {
				progressBar.classList.add('active')
			}, false);
			video.addEventListener('ended', () => {
				progressBar.classList.remove('active')
				play.classList.add('active')
				stop.classList.remove('active')
				button.classList.remove('active')
			}, false);
			video.addEventListener('timeupdate', updateProgressBar, false);
			progressBar.addEventListener("click", seek)
		}
		// End ProgressBar
	});
});