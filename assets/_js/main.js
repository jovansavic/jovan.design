import $ from 'jquery';

$(window).on('load', function() {
    Common.init();
    Components.init();
});

const Common = {
    countLines: function($target) {
        // const style = $target.css(); // window.getComputedStyle(target, null);
        let height = parseInt( $target.css('height') );
        const fontSize = parseInt( $target.css('font-size') );
        let lineHeight = parseInt( $target.css('line-height') );
        const boxSizing = $target.css('box-sizing');

        if (isNaN(lineHeight)) lineHeight = fontSize * 1.2;

        if (boxSizing=='border-box') {
            const paddingTop = parseInt($target.css('padding-top'));
            const paddingBottom = parseInt($target.css('padding-bottom'));
            const borderTop = parseInt($target.css('border-top-width'));
            const borderBottom = parseInt($target.css('border-bottom-width'));
            height = height - paddingTop - paddingBottom - borderTop - borderBottom;
        }
        const lines = Math.ceil(height / lineHeight);
        return lines;
    },
    coolText: function() {
        const $span = $('.span-wrap span').first().clone(true);
        $('.span-wrap span').remove();
        $.each($('.cool-text'), function(index, $coolText) {
            const $text = $(this).find('.text');
            const $spanWrap = $(this).find('.span-wrap');
            const linesNumber = Common.countLines($text);
            const elementDelay = parseFloat( $(this).attr('data-delay') );
            let color;

            if ( Common.hasAttr($(this), 'data-bgc') ) {
                color = $(this).attr('data-bgc');
            } else {
                color = 'white';
            }

            const fontSize = parseFloat($text.css('font-size'));
            const textHeight = parseFloat($text.css('height'));
            let lineHeght = parseFloat( $text.css('line-height') );
            if ( isNaN(lineHeght) ) lineHeght = fontSize * 1.2;

            const add = (lineHeght - fontSize) / 2;

            $(this).css('height', textHeight);
            $spanWrap.css('height', textHeight);

            // const style =

            for ( let i = 0; i < linesNumber; i++ ) {
                const $spanClone = $span.clone(true);
                let delay = elementDelay + i/8;
                delay += 's';
                $spanClone.css({
                    'background': color,
                    'height': fontSize + add,
                    'transition-delay': delay,
                });
                $spanWrap.append($spanClone);
            }
        });
    },
    menuTrigger: function() {
        $('.float-menu-toggle, .menu-shadow').on('click', function() {
            $('.float-menu, .menu-shadow, .float-menu-toggle').toggleClass('active');

            if ( $('.float-menu-toggle').hasClass('active') ) {
                $('.float-menu-toggle .material-icons').html('close');
            } else {
                $('.float-menu-toggle .material-icons').html('menu');
            }
        });
    },
    isScrolledIntoView: function(elem) {
        const docViewTop = $(window).scrollTop();
        const docViewBottom = docViewTop + screen.height;
        const elemTop = $(elem).offset().top;
        return (elemTop <= docViewBottom-150);
    },
    triggerAnimation: function() {
        function handleTriggering() {
            $('[data-animate]').each(function() {
                if (Common.isScrolledIntoView(this) === true) {
                    $(this).addClass('animated');
                }
            });
        }

        $(window).scroll(function() {
            handleTriggering();
        });
        handleTriggering();
    },
    hasAttr: function($element, attrName) {
        const attr = $element.attr(attrName);
        if (typeof attr !== typeof undefined && attr !== false) {
            return true;
        }
    },
    footerMargin: function() {
        const mainHeight = $('body').outerHeight();
        const screenHeight = $( 'body' ).height();
        const marTop = screenHeight - (mainHeight + $('.site-footer').outerHeight());

        if (mainHeight < screenHeight) {
            $('.site-footer').css('margin-top', marTop);
        }
    },
    init: function() {
        this.coolText();
        this.menuTrigger();
        this.triggerAnimation();
        this.footerMargin();
    },
};

const Components = {
    geometricElements: function() {
        let $randomShapes = $('.random-shape');
        let randomNumbers = [];

        if ($(window).width() > 768) {
            $.each( $randomShapes, function( index, $shape ) {
                randomNumbers.push( Math.floor(Math.random() * 500) + 50 );
            });


            $(window).on('scroll', function() {
                let scrollTop = $(this).scrollTop();


                $.each($randomShapes, function( index, $shape ) {
                    $(this).css('top', function() {
                        return scrollTop + randomNumbers[index];
                    });
                });
            });
        } else {
            $randomShapes.remove();
        }
    },
    badgeHandler: function() {
        $('body').on('click', '.badge', function( e ) {
            e.preventDefault();

            const targetGroup = $(this).attr('data-group-target');
            const $targetGroup = $('[data-group='+targetGroup+']');

            const target = $(this).attr('href');
            const $target = $(target);

            const $badgesGroup = $('[data-group-target='+targetGroup+']');


            $targetGroup.removeClass('active');
            $target.addClass('active');

            $badgesGroup.removeClass('active');
            $(this).addClass('active');
        });
    },
    slider: function() {
        function getCurrentSlider( $sliderWrap ) {
            return $sliderWrap.find('.current');
        }

        $.each($('[data-slider]'), function(index, $slider) {
            $(this).find('[data-slider-unit]').first().addClass('current');
            $(this).find('[data-slider-controls] span').first().addClass('current');
        });


        function nextUnit($this) {
            const numOfUnits = $this.find('[data-slider-unit]').length;
            const $currentUnit = getCurrentSlider( $this );

            $currentUnit.removeClass('current');

            if ( $currentUnit.index()+1 < numOfUnits ) {
                $currentUnit.next().addClass('current');
            } else {
                $this.find('[data-slider-unit]').first().addClass('current');
                $this.find('[data-slider-controls] span').first().addClass('current');
            }

            const $newUnit = $this.find('.current');
            const index = $newUnit.index();


            $this.find('[data-slider-unit]').first().css('margin-left', function() {
                return -index* parseInt($newUnit.outerWidth());
            });
        }

        function prevUnit($this) {
            const $currentUnit = getCurrentSlider($this);

            $currentUnit.removeClass('current');
            if ($currentUnit.index() > 0) {
                $currentUnit.prev().addClass('current');
            } else {
                $this.find('[data-slider-unit]').last().addClass('current');
                $this.find('[data-slider-controls] span').last().addClass('current');
            }

            const $newUnit = $this.find('.current');
            const index = $newUnit.index();


            $this.find('[data-slider-unit]').first().css('margin-left', function() {
                return - index* parseInt($newUnit.outerWidth());
            });
        }

        $('[data-slider]').swipe( {
            swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
                nextUnit( $(this) );
            },
            swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
                prevUnit( $(this) );
            },
            threshold: 0,
        });

        $('.left').on('click', function() {
            prevUnit( $(this).parent() );
        });
        $('.right').on('click', function() {
            nextUnit( $(this).parent() );
        });
    },
    trigerMenu: function() {

    },
    init: function() {
        this.slider();
        this.geometricElements();
        this.trigerMenu();
        this.badgeHandler();
    },
};
