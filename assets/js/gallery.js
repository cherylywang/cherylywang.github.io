/*
	Cheryl Wang's site — image gallery lightbox.
	Click a .gallery-item thumbnail to open #gallery-lightbox showing the
	full image (or video, if the item has a data-video attribute) plus its
	title/date/description (read from data-* attrs). Once open, use the
	arrow buttons or arrow keys to browse to the previous/next item without
	closing the lightbox.
*/

(function($) {

	$(function() {

		var $lightbox = $('#gallery-lightbox');

		if ($lightbox.length == 0)
			return;

		var $items = $('.gallery-item'),
			$image = $lightbox.find('.gallery-lightbox-image'),
			$video = $lightbox.find('.gallery-lightbox-video'),
			$videoPlay = $lightbox.find('.gallery-lightbox-video-play'),
			$title = $lightbox.find('.gallery-lightbox-title'),
			$date = $lightbox.find('.gallery-lightbox-date'),
			$desc = $lightbox.find('.gallery-lightbox-desc'),
			currentIndex = -1;

		function show(index) {

			// Wrap around in both directions.
				if (index < 0)
					index = $items.length - 1;
				else if (index >= $items.length)
					index = 0;

			currentIndex = index;

			var $item = $items.eq(currentIndex),
				videoSrc = $item.data('video');

			// Stop any currently-playing video before switching items.
				if ($video.length) {
					$video.trigger('pause');
					$video.attr('src', '');
				}

			if (videoSrc) {

				$image.hide();
				$video.show().attr('src', videoSrc);
				$video[0].load();
				$videoPlay.show();

			}
			else {

				$video.hide();
				$videoPlay.hide();
				$image.show().attr('src', $item.find('img').attr('src'));

			}

			$title.text($item.data('title'));
			$date.text($item.data('date'));
			$desc.text($item.data('desc'));

			$lightbox.addClass('active');
			$('body').addClass('lightbox-open');

		}

		function hide() {

			if ($video.length) {
				$video.trigger('pause');
				$video.attr('src', '');
			}

			$lightbox.removeClass('active');
			$('body').removeClass('lightbox-open');

		}

		// Open lightbox on thumbnail click.
			$items.on('click', function(e) {

				e.preventDefault();
				show($items.index(this));

			});

		// Custom play button: a reliable, always-clickable overlay so
		// playback isn't dependent on precisely hitting the browser's own
		// (small, inconsistently-placed) native play control. Hides
		// itself once the video is playing, and reappears if paused.
		// The native <video controls> bar is intentionally not used —
		// on mobile Safari it renders a persistent dark overlay + its
		// own pause icon on top of this custom one and doesn't reliably
		// auto-hide, blocking the video. Clicking the video itself
		// toggles play/pause instead.
			if ($video.length) {

				$videoPlay.on('click', function(e) {

					e.stopPropagation();
					$video[0].play();

				});

				$video.on('click', function(e) {

					e.stopPropagation();

					if ($video[0].paused)
						$video[0].play();
					else
						$video[0].pause();

				});

				$video.on('play', function() {
					$videoPlay.hide();
				});

				$video.on('pause', function() {
					$videoPlay.show();
				});

				$video.on('ended', function() {
					$videoPlay.show();
				});

			}

		// Prev / next arrows.
			$lightbox.find('.gallery-lightbox-prev').on('click', function(e) {

				e.stopPropagation();
				show(currentIndex - 1);

			});

			$lightbox.find('.gallery-lightbox-next').on('click', function(e) {

				e.stopPropagation();
				show(currentIndex + 1);

			});

		// Close on "Back to gallery" click, or clicking the backdrop
		// (outside the image itself).
			$lightbox.find('.gallery-lightbox-close').on('click', function(e) {

				e.preventDefault();
				e.stopPropagation();
				hide();

			});

			$lightbox.on('click', function(e) {

				if (e.target === this || $(e.target).hasClass('gallery-lightbox-inner'))
					hide();

			});

		// Keyboard: Escape closes, Left/Right arrows browse.
			$(document).on('keyup', function(e) {

				if (!$lightbox.hasClass('active'))
					return;

				if (e.key === 'Escape')
					hide();
				else if (e.key === 'ArrowLeft')
					show(currentIndex - 1);
				else if (e.key === 'ArrowRight')
					show(currentIndex + 1);

			});

	});

})(jQuery);
