$(document).ready(function () {
	const slickElement = $('.video-reviews__container');

	const prev = document.querySelector('.arrow-prev-js');
	const next = document.querySelector('.arrow-next-js');
	// Ширина при которой меняется отображение стрелок
	const widthLimiter = 620;
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
// Отрисовка стрелок
	(function () {
		var throttle = function (type, name, obj) {
			obj = obj || window;
			var running = false;
			var func = function () {
				if (running) {
					return;
				}
				running = true;
				requestAnimationFrame(function () {
					obj.dispatchEvent(new CustomEvent(name));
					running = false;
				});
			};
			obj.addEventListener(type, func);
		};
		throttle("resize", "optimizedResize");
	})();
	// handle event
	window.addEventListener("optimizedResize", function (e) {
		if (e.currentTarget.innerWidth < widthLimiter) {
			prev.classList.add('disabled-button')
		} else {
			next.classList.remove('disabled-button')
			prev.classList.remove('disabled-button')
		}
	});

	slickElement.on('init reInit edge', function (event, slick, direction) {
		if (slick.listWidth < widthLimiter) {
			if (direction === 'left') {
				next.classList.add('disabled-button')
				prev.classList.remove('disabled-button')
			} else {
				next.classList.remove('disabled-button')
				prev.classList.add('disabled-button')
			}
		}
	});

	$('.video-reviews__container').slick({
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 4,
		// draggable: false,
		adaptiveHeight: true,
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
				breakpoint: 627,
				settings: {
					infinite: true,
					adaptiveHeight: false,
					slidesToShow: 2,
					slidesToScroll: 2,
				}
			},
			{
				breakpoint: 480,
				settings: {
					infinite: true,
					adaptiveHeight: false,
					variableWidth: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
		]
	});
	// Video play

	const videoBlock = document.querySelectorAll('.video-reviews__item');

	videoBlock.forEach(el => {
		const video = el.querySelector('.video-reviews__video');
		const button = el.querySelector('.video-reviews__button-play');
		const play = el.querySelector('.video-reviews__play');
		const stop = el.querySelector('.video-reviews__stop');
		// константы для ProgressBar
		const progress = el.querySelector('.video-reviews__progress');
		const progressBar = el.querySelector('.video-reviews__progress-bar');
		const sliderItem = el.querySelector('.video-reviews__block');

		sliderItem.setAttribute('data-id', '_' + Math.random().toString(36).substr(2, 9));
		
		function classSettings() {
			if (video.paused) {
				video.play()
				play.classList.remove('active')
				stop.classList.add('active')
				button.classList.add('active')
				progressBar.classList.add('active')
			} else {
				video.pause()
				play.classList.add('active')
				stop.classList.remove('active')
				button.classList.remove('active')
				// progressBar.classList.remove('active')
			}
		}
		
		if(video.played) {
			stop.classList.add('active')
		} else {
			play.classList.add('active')
		}
		if (video && stop) {
			video.muted= true;
			button.classList.add('active')
			video.addEventListener('click', function () {
				if (video.classList.contains('played')) {
					classSettings()
				} else {
					video.currentTime = 0
				}
				// Класс стоит после проверки чтобы при первом клике на сбрасывать таймер на 0
				video.classList.add('played')
				playedControll(sliderItem)
			}, false);
		}
		// Переделать колхоз с повтором классов
		function playedControll(selected) {
			const allItem = document.querySelectorAll('.video-reviews__block');
			allItem.forEach(sliderEl => {
				const sliderVideo = sliderEl.querySelector('.video-reviews__video');
				const sliderStop = sliderEl.querySelector('.video-reviews__stop');
				const sliderPlay = sliderEl.querySelector('.video-reviews__play');
				const sliderProgressBar = sliderEl.querySelector('.video-reviews__progress-bar');
				if (sliderEl.getAttribute('data-id') === selected.getAttribute('data-id')) {
					sliderEl.classList.add('active')
					sliderProgressBar.classList.add('active')
					sliderVideo.muted= false;
				} else  {
					sliderEl.classList.remove('active')
					sliderVideo.play()
					sliderVideo.muted= true;
					sliderVideo.classList.remove('played')
					sliderStop.classList.add('active')
					sliderProgressBar.classList.remove('active')
					sliderPlay.classList.remove('active')
				}
			});
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
			video.addEventListener('timeupdate', updateProgressBar, false);
			progressBar.addEventListener("click", seek)
		}
		// End ProgressBar
	});
});