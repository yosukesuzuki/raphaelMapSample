window.addEventListener('load', function() {

	var raphael,
		prefectures,
		fill = '#38b48b',
		fillHover = '#e597b2',
		fillLight = '#c1d8ac',
		stroke = '#98d98e',
		strokeHover = '#f6bfbc',
		strokeLight = '#d6e9ca',
		selectedElement,
		overlay;


	init();


	function init() {
		raphael = Raphael('raphael-map', 900, 900);

		/**
		 * Overlay be placed in order to disable the click event while the element of choice exists.
		 */
		overlay = raphael.rect(0, 0, 900, 900).attr({
			fill: '#ffffff',
			opacity: 0,
			stroke: 0
		});

		prefectures = raphael.set((function(array) {
			for (var key in jpMapPath) if (jpMapPath.hasOwnProperty(key)) (function() {
				array.push(raphael.path(jpMapPath[key].land ? jpMapPath[key].land : jpMapPath[key]).data(
					'name', jpMapPath[key].name ? raphael.path(jpMapPath[key].name).attr({
						fill: '#2d2d2d',
						stroke: 0
					}).hide(): null
				).attr({
					stroke: stroke,
					fill: fill
				}))
			})();
			return array;
		})([]));

		/**
		 * Calculate the statement of the transform.
		 */
		for (var i = 0, l = prefectures.length; i < l; i++) {
			var prefecture = prefectures[i],
				frame = prefecture.getBBox(),
				cx = frame.x + ((frame.x2 - frame.x) / 2),
				cy = frame.y + ((frame.y2 - frame.y) / 2),
				tx = Math.floor(450 - cx),
				ty = Math.floor(450 - cy),
				s = 450 / Math.max(frame.width, frame.height),
				transformString = 't' + tx + ',' + ty + ',s' + s;

			prefecture.data('transformStringForSelected', transformString);
		};

		eventify(prefectures);
	}

	function eventify(prefectures) {

		prefectures.attr({
			cursor: 'pointer'
		}).hover(function() {
			if (selectedElement) return;
			enter(this);
		}, function() {
			if (selectedElement) return;
			leave(this);
		}).click(function() {
			if (selectedElement) {
				deactive(selectedElement);
				selectedElement = null;
				return;
			}
			selectedElement = this;
			active(this);
		});

		overlay.click(function() {
			deactive(selectedElement);
			selectedElement = null;
		});


		function enter(element) {
                    console.log(element.id);
			element.animate({
				fill: fillHover,
				stroke: strokeHover
			}, 200, '>');
		}

		function leave(element) {
                        console.log(element.id);
			element.animate({
				fill: fill,
				stroke: stroke
			}, 200, '>');
		}

		function deactive(element) {
                        console.log(element.id);

			element.data('name').hide();
			element.animate({
				transform: '',
				'stroke-width': 1
			}, 400, '>', function() {
				prefectures.animate({
					fill: fill,
					stroke: stroke
				}, 200, '>', function() {
					overlay.toBack();
				});
			});
		}

		function active(element) {
                        console.log('active');
                        console.log(element.id);
			overlay.toFront();

			prefectures.animate({
				fill: fillLight,
				stroke: strokeLight
			}, 200, '>', function() {
				element.toFront().animate({
					transform: element.data('transformStringForSelected'),
					fill: fill,
					stroke: stroke,
					'stroke-width': 2
				}, 200, '>', function() {
					element.data('name').show();
				});
			});
		}
	}
});
