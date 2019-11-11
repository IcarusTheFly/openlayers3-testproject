angular.module('ol3App').directive('ol3Map', ['ol3LocalStorage', function (ol3LocalStorage) {
    return {
        restrict: 'E',
        templateUrl: 'templates/ng-map.tpl',
        compile: function (element, attributes) {
            return {
                post: function (scope, element, attributes, controller, transcludeFn) {
                    ol3LocalStorage.RestoreState();
                    var mainLayer = new ol.layer.Tile({
                        source: new ol.source.OSM()
                    });

                    var vectorSource = new ol.source.Vector({
                        wrapX: false
                    });
                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource
                    });

                    var map = new ol.Map({
                        layers: [mainLayer, vectorLayer],
                        target: 'map',
                        controls: ol.control.defaults({
                            attribution: false,
                            zoom: true,
                        }),
                        view: new ol.View({
                            center: [
                                1500000,
                                6900000
                            ],
                            zoom: 12,
                            minZoom: 10,
                            maxZoom: 17
                        })
                    });

                    for (var i = 0; i < ol3LocalStorage.interactions.length; i++) {
                        var feature = new ol.Feature({
                            geometry: new ol.geom.Polygon(ol3LocalStorage.interactions[i])
                        });
                        vectorSource.addFeature(feature);
                    }

                    var polygonDraw = new ol.interaction.Draw({
                        source: vectorSource,
                        type: ('Polygon')
                    });
                    map.addInteraction(polygonDraw);

                    polygonDraw.on('drawend', function () {
                        vectorSource.once('addfeature', function (evt) {
                            ol3LocalStorage.interactions.push(evt.feature.getGeometry().getCoordinates());
                        });
                    });

                    scope.pngExport = function () {
                        map.once('postcompose', function (event) {
                            var canvas = event.context.canvas;
                            canvas.toBlob(function (blob) {
                                saveAs(blob, 'map.png');
                            });
                        });
                        map.renderSync();
                    };

                    scope.removeFeatures = function () {
                        while (vectorSource.getFeatures().length > 0) {
                            vectorSource.removeFeature(vectorSource.getFeatures()[0]);
                        }
                        ol3LocalStorage.interactions = [];
                    };
                }
            }
        }
    };
}]);