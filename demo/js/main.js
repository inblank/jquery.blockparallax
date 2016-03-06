$(function () {
    $('.parallax').blockparallax({
        "path": function (container, path) {
            // рассчитываем "зубчики"
            var d = "",
                dReverse = '',
                tooth = [30, 50],// высота, ширина зубца
                size = [container.innerWidth(), container.innerHeight()],//ширина, высота
                xStep = tooth[1] / 2,
                toothTop = false;
            for (var i = 0; i <= size[0]; i += xStep) {
                d += i + ',' + (toothTop ? tooth[0] : 0) + ' ';
                dReverse = ' ' + i + ',' + (size[1] - (toothTop ? tooth[0] : 0)) + dReverse;
                toothTop = !toothTop;
            }
            path.attr('d', "M " + d + " " + size[0] + "," + size[1] + " " + dReverse + " z");
        }
    });
});
