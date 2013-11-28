define(["dojo/_base/declare", "esri/geometry/Polygon"], function (declare, Polygon) {

    return declare(null, {

        constructor: function (spatialReference) {
            this.spatialReference = spatialReference;
        },

        getArrowFromTo: function (x1, y1, x2, y2) {

            var arrow = new Polygon(this.spatialReference);

            var fromPoint = {"x": x1, "y": y1};
            var toPoint = {"x": x2, "y": y2};

            var angle = getAngle(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);

            var offset = 0;

            var p0x = fromPoint.x + getXOffset(angle, offset);
            var p0y = fromPoint.y - getYOffset(angle, offset);

            var length = getDistance(p0x, p0y, toPoint.x, toPoint.y);
            var width = length / 20;

            var phx = p0x + getXOffset(angle, length * 0.8);
            var phy = p0y - getYOffset(angle, length * 0.8);

            var p1x = phx + getXOffset(angle + 90, width * 0.5);
            var p1y = phy - getYOffset(angle + 90, width * 0.5);

            var p2x = phx + getXOffset(angle + 90, width);
            var p2y = phy - getYOffset(angle + 90, width);

            var p3x = phx + getXOffset(angle - 90, width);
            var p3y = phy - getYOffset(angle - 90, width);

            var p4x = phx + getXOffset(angle - 90, width * 0.5);
            var p4y = phy - getYOffset(angle - 90, width * 0.5);

            arrow.addRing([
                [p0x, p0y],
                [p1x, p1y],
                [p2x, p2y],
                [toPoint.x, toPoint.y],
                [p3x, p3y],
                [p4x, p4y],
                [p0x, p0y]
            ]);
            return arrow;
        }
    });

    function getAngle(x1, y1, x2, y2) {
        var deltaX = x2 - x1;
        var deltaY = (y2 - y1);
        var alpha = Math.atan2(-deltaY, deltaX);
        if (alpha < 0) alpha += 2 * Math.PI;
        alpha = Math.round((alpha * 180 / Math.PI));
        return alpha;
    }

    function getXOffset(angle, distance) {
        return Math.cos((angle) * Math.PI / 180) * distance;
    }

    function getYOffset(angle, distance) {
        return Math.sin((angle) * Math.PI / 180) * distance;
    }

    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

});