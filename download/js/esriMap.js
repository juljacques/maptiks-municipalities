/**
 * Created by willcadell on 16-01-15.
 */
(function () {
    require(["maptiks/map", "dojo/domReady!"], function (Map) {
        var map = new Map("esri-map", {
            center: [-122.75, 54],
            zoom: 10,
            basemap: "topo",
            maptiks_trackcode: 'fa00a61a-a1e7-4bca-aa60-f73315ef662b',
            maptiks_id: 'Home Page Esri',
        });
    });
}());