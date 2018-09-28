$( window ).on("load", function () {
	Common.Init();
	Components.Init();
});

var Common = {
	countLines: function ($target) {
		// var style = $target.css(); // window.getComputedStyle(target, null);
		var height = parseInt( $target.css("height") );  // parseInt(style.getPropertyValue("height"));
		var font_size = parseInt( $target.css("font-size") );  // parseInt(style.getPropertyValue("font-size"));
		var line_height = parseInt( $target.css("line-height") );  // parseInt(style.getPropertyValue("line-height"));
		var box_sizing = $target.css("box-sizing");  // style.getPropertyValue("box-sizing");

		if(isNaN(line_height)) line_height = font_size * 1.2;

		if (box_sizing=='border-box') {
			var padding_top = parseInt($target.css("padding-top"));
			var padding_bottom = parseInt($target.css("padding-bottom"));
			var border_top = parseInt($target.css("border-top-width"));
			var border_bottom = parseInt($target.css("border-bottom-width"));
			height = height - padding_top - padding_bottom - border_top - border_bottom
		}
		var lines = Math.ceil(height / line_height);
		return lines;
	},
	coolText: function () {
		var $span = $(".span-wrap span").first().clone(true);
		$(".span-wrap span").remove();

		$.each($(".cool-text"), function (index, $coolText) {

			var $text = $(this).find(".text");
			var $spanWrap = $(this).find(".span-wrap");
			var linesNumber = Common.countLines($text);
			var elementDelay = parseFloat( $(this).attr("data-delay") );

			if ( Common.hasAttr($(this), "data-bgc") ) {
				var color = $(this).attr("data-bgc");
			} else {
				var color = "white";
			}

			var fontSize = parseFloat($text.css("font-size"));
			var textHeight = parseFloat($text.css("height"));
			var lineHeght = parseFloat( $text.css("line-height") );
			if ( isNaN(lineHeght) ) lineHeght = fontSize * 1.2;

			var add = (lineHeght - fontSize) / 2;

			$(this).css("height", textHeight);
			$spanWrap.css("height", textHeight);

			// var style =

			for ( var i = 0; i < linesNumber; i++ ) {

				var $spanClone = $span.clone(true);
				var delay = elementDelay + i/8;
				delay += "s";
				$spanClone.css({
					"background"  : color,
					"height"            : fontSize + add,
					"transition-delay"  : delay
				});
				$spanWrap.append($spanClone);
			}
		});
	},
	menuTrigger: function (  ) {
		$(".menu-toggle").on("click", function (  ) {
			$(".mobile-menu").toggleClass("active");
		});
	},
	isScrolledIntoView: function (elem) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		return (elemTop <= docViewBottom-100);
	},
	triggerAnimation: function () {

		function handleTriggering() {
			$('[data-animate]').each(function () {
				if (Common.isScrolledIntoView(this) === true) {
					$(this).addClass('animated');
				}
			});
		}

		$(window).scroll(function () {
			handleTriggering();
		});
		handleTriggering();

	},
	hasAttr: function ($element, attrName) {
		var attr = $element.attr(attrName);
		if (typeof attr !== typeof undefined && attr !== false) {
			return true;
		}
	},
	footerMargin: function () {
		var mainHeight		= $('#website-main-wrap').outerHeight(),
		    screenHeight	= $( "body" ).height(),
		    marTop			= screenHeight- (mainHeight + $('.site-footer').outerHeight());
		console.log(mainHeight, screenHeight);
		if(mainHeight < screenHeight){
			console.log('Margin top: ' +marTop);
			$('.site-footer').css("margin-top", marTop);
		}
	},
	Init: function (  ) {
		this.coolText();
		this.menuTrigger();
		this.triggerAnimation();
		this.footerMargin();
	}
};

var Components = {
	geometricElements: function (  ) {
		var $randomShapes = $(".random-shape");
		var randomNumbers = [];

		if ( $(window).width() > 768 ) {

			$.each( $randomShapes, function ( index, $shape ) {
				randomNumbers.push( Math.floor(Math.random() * 500) + 50 );
			});


			$(window).on("scroll", function (  ) {
				var scrollTop = $(this).scrollTop();


				$.each($randomShapes, function ( index, $shape ) {


					$(this).css("top", function (  ) {
						return scrollTop + randomNumbers[index]  //+ topValue
					});
				});

			});
		} else {
			$randomShapes.remove();
		}

	},
	badgeHandler: function (  ) {
		$("body").on("click", ".badge", function ( e ) {
			e.preventDefault();

			var targetGroup     = $(this).attr("data-group-target");
			var $targetGroup    = $("[data-group="+targetGroup+"]");

			var target          = $(this).attr("href");
			var $target         = $(target);

			var $badgesGroup    = $("[data-group-target="+targetGroup+"]");


			$targetGroup.removeClass("active");
			$target.addClass("active");

			$badgesGroup.removeClass("active");
			$(this).addClass("active");

		});
	},
	slider: function (  ) {
		
		function getCurrentSlider ( $sliderWrap ) {
			return $sliderWrap.find(".current");
		}

		$.each($("[data-slider]"), function (  index, $slider) {
			$(this).find("[data-slider-unit]").first().addClass("current");
			$(this).find("[data-slider-controls] span").first().addClass("current");
		});


		function nextUnit ( $this ) {
			var numOfUnits      = $this.find("[data-slider-unit]").length;
			var $currentUnit    = getCurrentSlider( $this );

			$currentUnit.removeClass("current");

			if ( $currentUnit.index()+1 < numOfUnits ) {

				$currentUnit.next().addClass("current");

			} else {
				$this.find("[data-slider-unit]").first().addClass("current");
				$this.find("[data-slider-controls] span").first().addClass("current");
			}

			var $newUnit    = $this.find(".current");
			var index       = $newUnit.index();


			$this.find("[data-slider-unit]").first().css("margin-left", function (  ) {
				return -index* parseInt($newUnit.outerWidth());
			});
		}

		function prevUnit ( $this ) {
			var $currentUnit    = getCurrentSlider( $this );

			$currentUnit.removeClass("current");
			if ( $currentUnit.index() > 0 ) {

				$currentUnit.prev().addClass("current");

			} else {
				$this.find("[data-slider-unit]").last().addClass("current");
				$this.find("[data-slider-controls] span").last().addClass("current");
			}

			var $newUnit    = $this.find(".current");
			var index       = $newUnit.index();


			$this.find("[data-slider-unit]").first().css("margin-left", function (  ) {
				return - index* parseInt($newUnit.outerWidth());
			});
		}
		
		$("[data-slider]").swipe( {
			swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
				nextUnit( $(this) );
			},
			swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
				prevUnit( $(this) );
			},
			threshold: 0
		});

		$(".left").on("click", function (  ) {
			prevUnit( $(this).parent() );
		});
		$(".right").on("click", function (  ) {
			nextUnit( $(this).parent() );
		});
	},
	trigerMenu: function (  ) {
	},
	Init: function (  ) {
		this.slider();
		this.geometricElements();
		this.trigerMenu();
		this.badgeHandler();
	}
}