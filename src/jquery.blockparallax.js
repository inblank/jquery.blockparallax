/*!
 * jQuery Block Parallax - parallax in not rectangular blocks
 * (c) 2016 Pavel Aleksandrov
 * MIT Licensed.
 *
 * https://github.com/inblank/jquery.blockparallax
 */

/*global define, exports, module, jQuery, window, document*/
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    "use strict";
    $.fn.blockparallax = function (options) {
        options = $.extend({
            "path": null, // Формирования кривой. Если не задано, должно быть указано в теге отвечающего за кривую
            "smooth": 7, // плавность движения параллакса. Чем больше тем медленнее смещение элементов при движении мышки
            "speed": 0.03 //
        }, options);

        var offset, interval, movedElements = [];

        this.each(function () {
            var container = $(this),
                containerWidth = container.innerWidth(),
                path = container.find('[data-parallax="path"]');

            if (path.length) {
                path = path.eq(0); // пока работаем с одним путем
                // работаем только если есть кривая
                if (options.path) {
                    // задана обработка пути
                    options.path(container, path);
                }
                var pattern = /\s*url\(["']?([^\)'"]+)["']?/.exec(path.css('fill'));
                if (pattern && (pattern = container.find(pattern[1])).length) {
                    // должен быть задан паттерн для паралакса
                    // строим список объектов
                    var element, isPattern, pos, x, y, ratio;
                    container.find('[data-parallax-ratio]').each(function () {
                        element = $(this);
                        ratio = element.data('parallax-ratio');
                        if (ratio != 0) {
                            isPattern = element.parent()[0].tagName.toLowerCase() === 'pattern';
                            pos = element.position();
                            x = parseInt(isPattern ? element.attr('x') : pos.left);
                            y = parseInt(isPattern ? element.attr('y') : pos.top);
                            movedElements.push({
                                "element": element,
                                "isPattern": isPattern,
                                "ratio": ratio,
                                "x": x,
                                "y": y,
                                "newX": x,
                                "newY": y
                            });
                        }
                    });
                    offset = container.offset().left;
                }
            }
            $('body').on('mousemove', function (e) {
                var position = e.clientX - offset;
                if (position < 0) {
                    position = 0;
                }
                if (position > containerWidth) {
                    position = containerWidth;
                }
                position -= containerWidth / 2;
                $.each(movedElements, function (i, el) {
                    el.newX = el.x - position * el.ratio * options.speed;
                });
                if (!interval) {
                    interval = setInterval(moveElements, options.smooth);
                }
            });
        });

        function moveElements() {
            var x, step, count = 0;
            $.each(movedElements, function (i, el) {
                if (el.isPattern) {
                    x = parseInt(el.element.attr('x'));
                } else {
                    x = parseInt(el.element.position().left);
                }
                if (x != el.newX) {
                    step = (el.newX > x ? 1 : -1) * Math.abs(el.ratio);
                    if (step < 0) {
                        if (x + step < el.newX) {
                            step = el.newX - x;
                        }
                    } else {
                        if (x + step > el.newX) {
                            step = el.newX - x;
                        }
                    }
                    if (el.isPattern) {
                        el.element.attr('x', x + step);
                    } else {
                        el.element.css('left', x + step);
                    }
                } else {
                    count++;
                }
            });
            if (count == movedElements.length) {
                clearInterval(interval);
                interval = false;
            }
        }

        return this;
    };

}));