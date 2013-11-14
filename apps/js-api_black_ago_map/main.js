var map;
require(["esri/map", "dojo/domReady!"], function(Map) {
    map = new Map("mapDiv", {
        basemap: "gray",
        center: [6.97, 50.93], // long, lat
        zoom: 13,
        sliderStyle: "small"
    });
});
