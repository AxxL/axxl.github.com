var map;
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/tasks/locator",
    "esri/graphic",
    "esri/layers/WebTiledLayer",
    "esri/geometry/webMercatorUtils",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/InfoTemplate",
    "dojo/_base/Color",
    "dojo/number",
    "dojo/parser",
    "dojo/dom",
    "dijit/registry",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function(
    Map,
    Extent,
    Locator,
    Graphic,
    WebTiledLayer,
    webMercatorUtils,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    InfoTemplate,
    Color,
    number,
    parser,
    dom,
    registry) {
    parser.parse();

    // map = new Map("map", { 
    //     basemap: "streets", 
    //     center: [6.956,50.937],
    //     zoom: 14
    // });

    var lods = new Array(
        { "level": 0, "resolution": 76.4370282850732, "scale": 288895.277144 },
        { "level": 1, "resolution": 38.2185141425366, "scale": 144447.638572 },
        { "level": 2, "resolution": 19.1092570712683, "scale": 72223.819286 },
        { "level": 3, "resolution": 9.55462853563415, "scale": 36111.909643 },
        { "level": 4, "resolution": 4.77731426794937, "scale": 18055.954822 },
        { "level": 5, "resolution": 2.38865713397468, "scale": 9027.977411 },
        { "level": 6, "resolution": 1.19432856685505, "scale": 4513.988705 },
        { "level": 7, "resolution": 0.597164283559817, "scale": 2256.994353 });	

    map = new Map("map",{
        extent:new Extent({
            "xmax": 775830.0943380357,
            "xmin": 773553.7040896099,
            "ymax": 6610846.735113374,
            "ymin": 6610069.227216351,
            "spatialReference":{
                "wkid": 102100
            }
        }),
        lods:lods
    });

    var karteTiled = new WebTiledLayer("http://geoportal1.stadt-koeln.de/osm-stadtplan/${level}/${col}/${row}.png",{
        "copyright": "<a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap</a>",
        "id": "Stadt Koeln"			
    });
    map.addLayer(karteTiled);	

    var locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

    var infoTemplate = new InfoTemplate("Location", "Address: ${Address}");
    var symbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 
        15, 
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID, 
            new Color([0, 0, 255, 0.5]), 
            8
        ), 
        new Color([0, 0, 255])
    );

    locator.on("location-to-address-complete", function(evt) {
        if (evt.address.address) {
            var address = evt.address.address;
            var location = webMercatorUtils.geographicToWebMercator(evt.address.location);
            // this service returns geocoding results in geographic -
            // convert to web mercator to display on map
            // var location = webMercatorUtils.geographicToWebMercator(evt.location);
            var graphic = new Graphic(location, symbol, address, infoTemplate);
            map.graphics.add(graphic);
            
            map.infoWindow.setTitle(graphic.getTitle());
            map.infoWindow.setContent(graphic.getContent());
            
            //display the info window with the address information
            var screenPnt = map.toScreen(location);
            map.infoWindow.resize(200,100);
            map.infoWindow.show(screenPnt, map.getInfoWindowAnchor(screenPnt));
        }
    });

    map.on("click", function(evt) {
        map.graphics.clear();
        locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 100);
    });
});
