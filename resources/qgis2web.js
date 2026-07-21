
var map = new ol.Map({
    target: 'map',
    renderer: 'canvas',
    layers: layersList,
    view: new ol.View({
        constrainResolution: true,
        maxZoom: 28,
        minZoom: 1,
        
    })
});

//initial view - epsg:3857 coordinates if not "Match project CRS"
map.getView().fit([-12295986.011356, 2763372.337773, -12272928.736217, 2777205.091231], map.getSize());

//change cursor
function pointerOnFeature(evt) {
    if (evt.dragging) {
        return;
    }
    var hasFeature = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: function(layer) {
            return layer && (layer.get("interactive"));
        }
    });
    map.getViewport().style.cursor = hasFeature ? "pointer" : "";
}
map.on('pointermove', pointerOnFeature);
function styleCursorMove() {
    map.on('pointerdrag', function() {
        map.getViewport().style.cursor = "move";
    });
    map.on('pointerup', function() {
        map.getViewport().style.cursor = "default";
    });
}
styleCursorMove();

////small screen definition
    var hasTouchScreen = map.getViewport().classList.contains('ol-touch');
    var isSmallScreen = window.innerWidth < 650;

////controls container

    //top left container
    var topLeftContainer = new ol.control.Control({
        element: (() => {
            var topLeftContainer = document.createElement('div');
            topLeftContainer.id = 'top-left-container';
            return topLeftContainer;
        })(),
    });
    map.addControl(topLeftContainer)

    //bottom left container
    var bottomLeftContainer = new ol.control.Control({
        element: (() => {
            var bottomLeftContainer = document.createElement('div');
            bottomLeftContainer.id = 'bottom-left-container';
            return bottomLeftContainer;
        })(),
    });
    map.addControl(bottomLeftContainer)
  
    //top right container
    var topRightContainer = new ol.control.Control({
        element: (() => {
            var topRightContainer = document.createElement('div');
            topRightContainer.id = 'top-right-container';
            return topRightContainer;
        })(),
    });
    map.addControl(topRightContainer)

    //bottom right container
    var bottomRightContainer = new ol.control.Control({
        element: (() => {
            var bottomRightContainer = document.createElement('div');
            bottomRightContainer.id = 'bottom-right-container';
            return bottomRightContainer;
        })(),
    });
    map.addControl(bottomRightContainer)

//popup
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var sketch;

function stopMediaInPopup() {
    var mediaElements = container.querySelectorAll('audio, video');
    mediaElements.forEach(function(media) {
        media.pause();
        media.currentTime = 0;
    });
}
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    stopMediaInPopup();
    return false;
};
var overlayPopup = new ol.Overlay({
    element: container,
	autoPan: true
});
map.addOverlay(overlayPopup)
    
    
var NO_POPUP = 0
var ALL_FIELDS = 1

/**
 * Returns either NO_POPUP, ALL_FIELDS or the name of a single field to use for
 * a given layer
 * @param layerList {Array} List of ol.Layer instances
 * @param layer {ol.Layer} Layer to find field info about
 */
function getPopupFields(layerList, layer) {
    // Determine the index that the layer will have in the popupLayers Array,
    // if the layersList contains more items than popupLayers then we need to
    // adjust the index to take into account the base maps group
    var idx = layersList.indexOf(layer) - (layersList.length - popupLayers.length);
    return popupLayers[idx];
}

//highligth collection
var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: collection,
        useSpatialIndex: false // optional, might improve performance
    }),
    style: [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.1)'
        }),
    })],
    updateWhileAnimating: true, // optional, for instant visual feedback
    updateWhileInteracting: true // optional, for instant visual feedback
});

var doHighlight = false;
var doHover = false;

function createPopupField(currentFeature, currentFeatureKeys, layer) {
    var popupText = '';
    for (var i = 0; i < currentFeatureKeys.length; i++) {
        if (currentFeatureKeys[i] != 'geometry' &&
            currentFeatureKeys[i] != 'layerObject' &&
            currentFeatureKeys[i] != 'idO' &&
            currentFeatureKeys[i] != '_mvtLayer_') {
            var popupField = '';
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "hidden field") {
                continue;
            } else if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data") {
                if (currentFeature.get(currentFeatureKeys[i]) == null) {
                    continue;
                }
            }
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - always visible" ||
                layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data") {
                popupField += '<th>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</th><td>';
            } else {
                popupField += '<td colspan="2">';
            }
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
                if (currentFeature.get(currentFeatureKeys[i]) == null) {
                    continue;
                }
            }
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - always visible" ||
                layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
                popupField += '<strong>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</strong><br />';
            }
            if (layer.get('fieldImages')[currentFeatureKeys[i]] != "ExternalResource") {
				popupField += (currentFeature.get(currentFeatureKeys[i]) != null ? autolinker.link(currentFeature.get(currentFeatureKeys[i]).toLocaleString()) + '</td>' : '');
			} else {
				var fieldValue = currentFeature.get(currentFeatureKeys[i]);
				if (/\.(gif|jpg|jpeg|tif|tiff|png|avif|webp|svg)$/i.test(fieldValue)) {
					popupField += (fieldValue != null ? '<img src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" /></td>' : '');
				} else if (/\.(mp4|webm|ogg|avi|mov|flv)$/i.test(fieldValue)) {
					popupField += (fieldValue != null ? '<video controls><source src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" type="video/mp4">Il tuo browser non supporta il tag video.</video></td>' : '');
				} else if (/\.(mp3|wav|ogg|aac|flac)$/i.test(fieldValue)) {
                    popupField += (fieldValue != null ? '<audio controls><source src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" type="audio/mpeg">Il tuo browser non supporta il tag audio.</audio></td>' : '');
                } else {
					popupField += (fieldValue != null ? autolinker.link(fieldValue.toLocaleString()) + '</td>' : '');
				}
			}
            popupText += '<tr>' + popupField + '</tr>';
        }
    }
    return popupText;
}

var highlight;
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

function onPointerMove(evt) {
    if (!doHover && !doHighlight) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var currentFeature;
    var currentLayer;
    var currentFeatureKeys;
    var clusteredFeatures;
    var clusterLength;
    var popupText = '<ul>';

    // Collect all features and their layers at the pixel
    var featuresAndLayers = [];
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (!(layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") === undefined))) {
            return;
        }
        var layerTitle = (layer && layer.get('popuplayertitle')) ? layer.get('popuplayertitle') : '';
        // Exclude strategic grid layer from hover/selection
        if (/cuadriculaestrategicazonificada|cuadricula/i.test(layerTitle)) {
            return;
        }
        featuresAndLayers.push({ feature, layer });
    });

    // Iterate over the features and layers in reverse order
    for (var i = featuresAndLayers.length - 1; i >= 0; i--) {
        var feature = featuresAndLayers[i].feature;
        var layer = featuresAndLayers[i].layer;
        var doPopup = false;
        for (k in layer.get('fieldImages')) {
            if (layer.get('fieldImages')[k] != "Hidden") {
                doPopup = true;
            }
        }
        currentFeature = feature;
        currentLayer = layer;
        clusteredFeatures = feature.get("features");
        if (clusteredFeatures) {
            clusterLength = clusteredFeatures.length;
        }
        if (typeof clusteredFeatures !== "undefined") {
            if (doPopup) {
                for(var n=0; n<clusteredFeatures.length; n++) {
                    currentFeature = clusteredFeatures[n];
                    currentFeatureKeys = currentFeature.getKeys();
                    popupText += '<li><table>'
                    popupText += '<a>' + '<b>' + layer.get('popuplayertitle') + '</b>' + '</a>';
                    popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                    popupText += '</table></li>';    
                }
            }
        } else {
            currentFeatureKeys = currentFeature.getKeys();
            if (doPopup) {
                popupText += '<li><table>';
                popupText += '<a>' + '<b>' + layer.get('popuplayertitle') + '</b>' + '</a>';
                popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                popupText += '</table></li>';
            }
        }
    }

    if (popupText == '<ul>') {
        popupText = '';
    } else {
        popupText += '</ul>';
    }
    
	if (doHighlight) {
        if (currentFeature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (currentFeature) {
                var featureStyle
                if (typeof clusteredFeatures == "undefined") {
					var style = currentLayer.getStyle();
					var styleFunction = typeof style === 'function' ? style : function() { return style; };
					featureStyle = styleFunction(currentFeature)[0];
				} else {
					featureStyle = currentLayer.getStyle().toString();
				}

                if (currentFeature.getGeometry().getType() == 'Point' || currentFeature.getGeometry().getType() == 'MultiPoint') {
                    var radius
					if (typeof clusteredFeatures == "undefined") {
						radius = featureStyle.getImage().getRadius();
					} else {
						radius = parseFloat(featureStyle.split('radius')[1].split(' ')[1]) + clusterLength;
					}

                    highlightStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: new ol.style.Fill({
                                color: "rgba(255, 255, 0, 1.00)"
                            }),
                            radius: radius
                        })
                    })
                } else if (currentFeature.getGeometry().getType() == 'LineString' || currentFeature.getGeometry().getType() == 'MultiLineString') {

                    var featureWidth = featureStyle.getStroke().getWidth();

                    highlightStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 255, 0, 1.00)',
                            lineDash: null,
                            width: featureWidth
                        })
                    });

                } else {
                    highlightStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 0, 1.00)'
                        })
                    })
                }
                featureOverlay.getSource().addFeature(currentFeature);
                featureOverlay.setStyle(highlightStyle);
            }
            highlight = currentFeature;
        }
    }

    if (doHover) {
        if (popupText) {
			content.innerHTML = popupText;
            container.style.display = 'block';
            overlayPopup.setPosition(coord);
        } else {
            container.style.display = 'none';
            closer.blur();
        }
    }
};

map.on('pointermove', onPointerMove);

var popupContent = '';
var popupCoord = null;
var featuresPopupActive = false;

function updatePopup() {
    if (popupContent) {
        content.innerHTML = popupContent;
        container.style.display = 'block';
		overlayPopup.setPosition(popupCoord);
    } else {
        container.style.display = 'none';
        closer.blur();
        stopMediaInPopup();
    }
} 

function onSingleClickFeatures(evt) {
    if (doHover || sketch) {
        return;
    }
    if (!featuresPopupActive) {
        featuresPopupActive = true;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var currentFeature = null;
    var currentLayer = null;
    var currentFeatureKeys;
    var clusteredFeatures;
    var popupText = '<ul>';

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (!(layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") === undefined))) {
            return;
        }
        // Allow selection from any interactive vector layer (not only specific export layers)
        // Skip non-vector layers (e.g., WMS) by checking for a getSource/getFeatures method
        if (!layer || !layer.getSource || typeof layer.getSource !== 'function') {
            return;
        }
        var layerTitle = (layer && layer.get('popuplayertitle')) ? layer.get('popuplayertitle') : '';
        // Exclude strategic grid layer from selection
        if (/cuadriculaestrategicazonificada|cuadricula/i.test(layerTitle)) {
            return;
        }
        var source = layer.getSource();
        if (!source || typeof source.getFeatures !== 'function') {
            return;
        }
        if (!currentFeature) {
            currentFeature = feature;
            currentLayer = layer;
        }
        clusteredFeatures = feature.get("features");
        var doPopup = false;
        var fieldImages = layer.get('fieldImages') || {};
        for (var k in fieldImages) {
            if (fieldImages[k] !== "Hidden") {
                doPopup = true;
                break;
            }
        }
        if (typeof clusteredFeatures !== "undefined") {
            if (!currentFeature && clusteredFeatures.length > 0) {
                currentFeature = clusteredFeatures[0];
                currentLayer = layer;
            }
            if (doPopup) {
                for (var n = 0; n < clusteredFeatures.length; n++) {
                    var clusterFeature = clusteredFeatures[n];
                    currentFeatureKeys = clusterFeature.getKeys();
                    popupText += '<li><table>';
                    popupText += '<a><b>' + layer.get('popuplayertitle') + '</b></a>';
                    popupText += createPopupField(clusterFeature, currentFeatureKeys, layer);
                    popupText += '</table></li>';
                }
            }
        } else {
            if (doPopup) {
                currentFeatureKeys = currentFeature.getKeys();
                popupText += '<li><table>';
                popupText += '<a><b>' + layer.get('popuplayertitle') + '</b></a>';
                popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                popupText += '</table>';
            }
        }
        return true;
    });

    if (popupText === '<ul>') {
        popupText = '';
    } else {
        popupText += '</ul>';
    }

    if (!currentFeature) {
        popupContent = '';
        selectedPlanFeature = null;
        selectedPlanLayer = null;
        selectedPlanLayerLabel = null;
        selectedFeatureOverlayCollection.clear();
        updateSearchMessage('export-plan-message', 'No se encontró polígono para seleccionar.');
    } else {
        popupContent = popupText || '<p>Polígono seleccionado.</p>';
        selectedPlanFeature = currentFeature;
        selectedPlanLayer = currentLayer;
        selectedPlanLayerLabel = currentLayer && currentLayer.get('popuplayertitle') ? currentLayer.get('popuplayertitle') : null;
        selectedFeatureOverlayCollection.clear();
        if (selectedPlanFeature && selectedPlanFeature.getGeometry()) {
            var displayFeature = selectedPlanFeature.clone();
            displayFeature.setGeometry(selectedPlanFeature.getGeometry().clone());
            selectedFeatureOverlayCollection.push(displayFeature);
            applyOverlayPopupMetadata(selectedFeatureOverlayLayer, currentLayer);
        }
        updateSearchMessage('export-plan-message', 'Polígono seleccionado para exportar.');
    }
    popupCoord = coord;
    updatePopup();
}

function onSingleClickWMS(evt) {
    if (doHover || sketch) {
        return;
    }
    if (!featuresPopupActive) {
        popupContent = '';
    }
    var coord = evt.coordinate;
    var viewProjection = map.getView().getProjection();
    var viewResolution = map.getView().getResolution();

    for (var i = 0; i < wms_layers.length; i++) {
        if (wms_layers[i][1] && wms_layers[i][0].getVisible()) {
            var url = wms_layers[i][0].getSource().getFeatureInfoUrl(
                evt.coordinate, viewResolution, viewProjection, {
                    'INFO_FORMAT': 'text/html',
                });
            if (url) {
                const wmsTitle = wms_layers[i][0].get('popuplayertitle');
                var ldsRoller = '<div class="roller-switcher" style="height: 25px; width: 25px;"></div>';

                popupCoord = coord;
                popupContent += ldsRoller;
                updatePopup();

                var timeoutPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('Timeout exceeded'));
                    }, 5000); // (5 second)
                });

                function tryFetch(urls) {
                    if (urls.length === 0) {
                        return Promise.reject(new Error('All fetch attempts failed'));
                    }
                    return fetch(urls[0])
                        .then((response) => {
                            if (response.ok) {
                                return response.text();
                            } else {
                                throw new Error('Fetch failed');
                            }
                        })
                        .catch(() => tryFetch(urls.slice(1))); // Try next URL
                }

                const urlsToTry = [
                    url,
                    encodeURIComponent(url),
                    'https://api.allorigins.win/raw?url=' + encodeURIComponent(url)
                ];

                Promise.race([tryFetch(urlsToTry), timeoutPromise])
                    .then((html) => {
                        if (html.indexOf('<table') !== -1) {
                            popupContent += '<a><b>' + wmsTitle + '</b></a>';
                            popupContent += html + '<p></p>';
                            updatePopup();
                        }
                    })
                    .finally(() => {
                        setTimeout(() => {
                            var loaderIcon = document.querySelector('.roller-switcher');
                            if (loaderIcon) loaderIcon.remove();
                        }, 500); // (0.5 second)
                    });
            }
        }
    }
}

map.on('singleclick', onSingleClickFeatures);
map.on('singleclick', onSingleClickWMS);

//get container
var topLeftContainerDiv = document.getElementById('top-left-container')
var bottomLeftContainerDiv = document.getElementById('bottom-left-container')
var topRightContainerDiv = document.getElementById('top-right-container')
var bottomRightContainerDiv = document.getElementById('bottom-right-container')

var searchSelectionCollection = new ol.Collection();
var searchSelectionOverlay = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: searchSelectionCollection,
        useSpatialIndex: false
    }),
    style: function(feature) {
        var geometry = feature.getGeometry();
        if (geometry && geometry.getType && (geometry.getType() === 'Point' || geometry.getType() === 'MultiPoint')) {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({ color: 'rgba(255, 69, 0, 0.9)' }),
                    stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
                })
            });
        }
        return new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'rgba(255, 69, 0, 0.95)', width: 3 }),
            fill: new ol.style.Fill({ color: 'rgba(255, 69, 0, 0.18)' })
        });
    },
    updateWhileAnimating: true,
    updateWhileInteracting: true
});
map.addLayer(searchSelectionOverlay);

var selectedFeatureOverlayCollection = new ol.Collection();
var selectedFeatureOverlayLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: selectedFeatureOverlayCollection,
        useSpatialIndex: false
    }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 215, 0, 0.95)',
            width: 4
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 215, 0, 0.2)'
        })
    }),
    updateWhileAnimating: true,
    updateWhileInteracting: true
});
map.addLayer(selectedFeatureOverlayLayer);

var selectedPlanFeature = null;
var selectedPlanLayer = null;
var selectedPlanLayerLabel = null;

function getMapCanvasDataURL(callback) {
    var canvas = document.querySelector('#map canvas');
    if (canvas && typeof canvas.toDataURL === 'function') {
        try {
            callback(canvas.toDataURL('image/png'));
            return;
        } catch (err) {
            console.warn('Canvas export fallo, intentando de nuevo después de renderizar:', err);
        }
    }
    map.once('rendercomplete', function() {
        var canvasRetry = document.querySelector('#map canvas');
        if (canvasRetry && typeof canvasRetry.toDataURL === 'function') {
            try {
                callback(canvasRetry.toDataURL('image/png'));
                return;
            } catch (err) {
                console.warn('Canvas export falla tras rendercomplete:', err);
            }
        }
        callback(null);
    });
    map.renderSync();
}

function showGoogleSatelliteForExport(callback) {
    var satelliteLayer = typeof lyr_GoogleSatellite_0 !== 'undefined' ? lyr_GoogleSatellite_0 : null;
    if (!satelliteLayer) {
        callback(null);
        return;
    }
    var previousVisibility = satelliteLayer.getVisible();
    satelliteLayer.setVisible(true);
    map.once('rendercomplete', function() {
        callback(previousVisibility);
    });
    map.renderSync();
}

function getLegendSymbol(layer) {
    var title = layer && layer.get('popuplayertitle') ? layer.get('popuplayertitle') : 'Seleccionado';
    var symbol = {
        title: title,
        fill: '#4c7fbf',
        stroke: '#1f3d7a'
    };
    if (/concesi/i.test(title)) {
        symbol.fill = '#1f78b4';
        symbol.stroke = '#0d4e7c';
    } else if (/ocupante/i.test(title)) {
        symbol.fill = '#e66100';
        symbol.stroke = '#9b4300';
    } else if (/acuerdos/i.test(title)) {
        symbol.fill = '#4daf4a';
        symbol.stroke = '#2a6d2a';
    } else if (/desincorpor/i.test(title)) {
        symbol.fill = '#984ea3';
        symbol.stroke = '#5b2f73';
    } else if (/delimitaci/i.test(title)) {
        symbol.fill = '#ff7f00';
        symbol.stroke = '#b25b00';
    }
    return symbol;
}

function getScaleText() {
    var view = map.getView();
    var resolution = view.getResolution();
    if (!resolution) {
        return '';
    }
    var projection = view.getProjection();
    var metersPerUnit = ol.proj.Units.METERS_PER_UNIT[projection.getUnits()] || 1;
    var dpi = 96;
    var scaleDenominator = Math.round(resolution * metersPerUnit * dpi / 0.0254);
    return 'Escala aproximada 1:' + scaleDenominator.toLocaleString('es-ES');
}

function createFeatureCanvasDataURL(feature, width, height) {
    var geom = feature.getGeometry();
    if (!geom) {
        return null;
    }
    var extent = geom.getExtent();
    if (!extent) {
        return null;
    }
    width = width || 1200;
    height = height || 700;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    var padding = 50;
    var drawWidth = width - padding * 2;
    var drawHeight = height - padding * 2;
    var minX = extent[0];
    var minY = extent[1];
    var maxX = extent[2];
    var maxY = extent[3];
    var geomWidth = maxX - minX;
    var geomHeight = maxY - minY;
    if (geomWidth <= 0 || geomHeight <= 0) {
        return canvas.toDataURL('image/png');
    }
    var scale = Math.min(drawWidth / geomWidth, drawHeight / geomHeight) * 0.92;
    var offsetX = padding + (drawWidth - geomWidth * scale) / 2;
    var offsetY = padding + (drawHeight - geomHeight * scale) / 2;

    function toCanvasCoord(coord) {
        var x = offsetX + (coord[0] - minX) * scale;
        var y = height - (offsetY + (coord[1] - minY) * scale);
        return [x, y];
    }

    ctx.strokeStyle = '#1f3d7a';
    ctx.fillStyle = 'rgba(70, 130, 180, 0.35)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    function drawCoordinates(coords) {
        if (!coords || coords.length === 0) {
            return;
        }
        ctx.beginPath();
        var first = toCanvasCoord(coords[0]);
        ctx.moveTo(first[0], first[1]);
        for (var j = 1; j < coords.length; j++) {
            var pt = toCanvasCoord(coords[j]);
            ctx.lineTo(pt[0], pt[1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    var type = geom.getType();
    if (type === 'Polygon') {
        var rings = geom.getCoordinates();
        for (var i = 0; i < rings.length; i++) {
            drawCoordinates(rings[i]);
        }
    } else if (type === 'MultiPolygon') {
        var polys = geom.getCoordinates();
        for (var p = 0; p < polys.length; p++) {
            var rings2 = polys[p];
            for (var r = 0; r < rings2.length; r++) {
                drawCoordinates(rings2[r]);
            }
        }
    } else if (type === 'LineString') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 3;
        var coords = geom.getCoordinates();
        ctx.beginPath();
        var start = toCanvasCoord(coords[0]);
        ctx.moveTo(start[0], start[1]);
        for (var k = 1; k < coords.length; k++) {
            var point = toCanvasCoord(coords[k]);
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
    } else if (type === 'Point') {
        var pt = toCanvasCoord(geom.getCoordinates());
        ctx.fillStyle = 'rgba(70, 130, 180, 0.75)';
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    } else if (type === 'MultiLineString') {
        var lines = geom.getCoordinates();
        for (var m = 0; m < lines.length; m++) {
            var coords2 = lines[m];
            ctx.beginPath();
            var s = toCanvasCoord(coords2[0]);
            ctx.moveTo(s[0], s[1]);
            for (var n = 1; n < coords2.length; n++) {
                var pt2 = toCanvasCoord(coords2[n]);
                ctx.lineTo(pt2[0], pt2[1]);
            }
            ctx.stroke();
        }
    } else {
        ctx.fillStyle = 'rgba(70, 130, 180, 0.35)';
        ctx.strokeStyle = '#1f3d7a';
        var coords3 = geom.getCoordinates();
        ctx.beginPath();
        var start2 = toCanvasCoord(coords3[0]);
        ctx.moveTo(start2[0], start2[1]);
        for (var q = 1; q < coords3.length; q++) {
            var pt3 = toCanvasCoord(coords3[q]);
            ctx.lineTo(pt3[0], pt3[1]);
        }
        ctx.stroke();
    }

    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, drawWidth, drawHeight);

    return canvas.toDataURL('image/png');
}

function prepareExportMapView(callback) {
    var layers = map.getLayers().getArray();
    var previousVisibility = [];
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (!layer || !layer.getVisible || typeof layer.setVisible !== 'function') {
            continue;
        }
        previousVisibility.push({ layer: layer, visible: layer.getVisible() });
    }

    for (var j = 0; j < layers.length; j++) {
        var exportLayer = layers[j];
        if (!exportLayer || !exportLayer.getVisible || typeof exportLayer.setVisible !== 'function') {
            continue;
        }
        var isBaseLayer = exportLayer instanceof ol.layer.Tile || exportLayer.get('type') === 'base';
        var isDelimitacionesLayer = exportLayer === lyr_DelimitacionesDGZFMT_5;
        var shouldShow = isBaseLayer || isDelimitacionesLayer || exportLayer === selectedFeatureOverlayLayer;
        exportLayer.setVisible(shouldShow);
    }

    map.renderSync();
    callback(function() {
        for (var k = 0; k < previousVisibility.length; k++) {
            previousVisibility[k].layer.setVisible(previousVisibility[k].visible);
        }
        map.renderSync();
    });
}

function exportSelectedPlanPDF(title) {
    if (!selectedPlanFeature || !selectedPlanLayer) {
        updateSearchMessage('export-plan-message', 'Selecciona primero un polígono en el mapa.');
        return;
    }

    // Allow export for any selected vector layer except the strategic grid
    var selLayerTitle = (selectedPlanLayer && selectedPlanLayer.get('popuplayertitle')) ? selectedPlanLayer.get('popuplayertitle') : '';
    if (/cuadriculaestrategicazonificada|cuadricula/i.test(selLayerTitle)) {
        updateSearchMessage('export-plan-message', 'La capa de cuadricula no se puede exportar. Selecciona otra capa.');
        return;
    }

    title = title && title.trim() ? title.trim() : 'Plano de selección';
    var layer = selectedPlanLayer;
    var legend = getLegendSymbol(layer);

    prepareExportMapView(function(restoreMapView) {
        getMapCanvasDataURL(function(imgData) {
            restoreMapView();

            var fallbackNote = '';
            if (!imgData) {
                imgData = createFeatureCanvasDataURL(selectedPlanFeature, 1200, 720);
                if (!imgData) {
                    updateSearchMessage('export-plan-message', 'No se pudo generar el plano.');
                    return;
                }
                fallbackNote = 'Se generó una vista simplificada del plano.';
            }

            var jsPDFConstructor = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
            if (!jsPDFConstructor) {
                updateSearchMessage('export-plan-message', 'Biblioteca PDF no cargada.');
                return;
            }
            var doc = new jsPDFConstructor({ orientation: 'landscape', unit: 'pt', format: 'a4' });
            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();
            var margin = 40;
            var imageWidth = width - margin * 2;
            var imageHeight = height * 0.68;
            var mapLeft = margin;
            var mapTop = 108;
            var mapRight = mapLeft + imageWidth;
            var mapBottom = mapTop + imageHeight;

            doc.setFillColor(245, 248, 252);
            doc.rect(0, 0, width, height, 'F');

            doc.setFillColor(13, 71, 161);
            doc.roundedRect(margin - 10, 18, imageWidth + 20, 72, 8, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, 46);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('Fecha: ' + new Date().toLocaleString('es-ES'), margin, 66);
            doc.text('Capa: ' + legend.title, margin + 260, 66);
            doc.text('Escala aproximada: ' + getScaleText().replace('Escala aproximada ', ''), margin + 470, 66);
            if (fallbackNote) {
                doc.setFontSize(8);
                doc.setTextColor('#5b6470');
                doc.text(fallbackNote, margin, 82);
            }

            doc.setDrawColor(22, 73, 137);
            doc.setLineWidth(1.2);
            doc.roundedRect(mapLeft - 6, mapTop - 6, imageWidth + 12, imageHeight + 12, 8, 8, 'S');
            doc.addImage(imgData, 'PNG', mapLeft, mapTop, imageWidth, imageHeight);

            var northX = mapRight - 72;
            var northY = mapTop + 44;
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(northX - 22, northY - 22, 44, 44, 7, 7, 'F');
            doc.setDrawColor('#0f4a8a');
            doc.setLineWidth(1.2);
            doc.circle(northX, northY, 12, 'S');
            doc.line(northX, northY - 7, northX, northY + 7);
            doc.line(northX - 5, northY + 2, northX, northY - 8);
            doc.line(northX + 5, northY + 2, northX, northY - 8);
            doc.setFontSize(9);
            doc.setTextColor('#0f4a8a');
            doc.text('N', northX - 3, northY + 3);

            var scaleX = mapLeft + 24;
            var scaleY = mapBottom - 42;
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(scaleX - 12, scaleY - 20, 188, 34, 6, 6, 'F');
            doc.setDrawColor('#0f4a8a');
            doc.setLineWidth(1.4);
            doc.line(scaleX + 8, scaleY, scaleX + 152, scaleY);
            doc.line(scaleX + 8, scaleY - 6, scaleX + 8, scaleY + 6);
            doc.line(scaleX + 152, scaleY - 6, scaleX + 152, scaleY + 6);
            doc.setFontSize(8);
            doc.setTextColor('#0f4a8a');
            doc.text('0', scaleX + 4, scaleY + 16);
            doc.text('100 m', scaleX + 140, scaleY + 16);

            doc.save('plano-seleccion.pdf');
            updateSearchMessage('export-plan-message', 'Plano PDF generado.');
        });
    });
}

function attachPlanExportButton() {
    var button = document.getElementById('export-plan-button');
    var titleInput = document.getElementById('plan-title-input');
    if (!button || !titleInput) {
        return;
    }
    button.addEventListener('click', function() {
        exportSelectedPlanPDF(titleInput.value);
    });
}

attachPlanExportButton();

function normalizeSearchValue(value) {
    return (value === undefined || value === null) ? '' : value.toString().trim().toLowerCase();
}

function buildUniqueSearchValues(layer, fieldName) {
    var unique = {};
    var values = [];
    if (!layer || !fieldName || !layer.getSource) {
        return values;
    }
    var source = layer.getSource();
    if (!source) {
        return values;
    }
    var features = source.getFeatures();
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var fieldValue = feature.get(fieldName);
        if (fieldValue !== undefined && fieldValue !== null) {
            var label = fieldValue.toString();
            var key = normalizeSearchValue(label);
            if (key && !unique[key]) {
                unique[key] = true;
                values.push(label);
            }
        }
    }
    values.sort();
    return values;
}

function populateDatalist(listId, values, filter) {
    var datalist = document.getElementById(listId);
    if (!datalist) {
        return;
    }
    datalist.innerHTML = '';
    filter = normalizeSearchValue(filter);
    var matches = [];
    for (var i = 0; i < values.length; i++) {
        var text = values[i];
        var normalizedText = normalizeSearchValue(text);
        if (!filter || normalizedText.indexOf(filter) !== -1 || normalizedText.startsWith(filter)) {
            matches.push(text);
        }
    }
    for (var j = 0; j < matches.length && j < 200; j++) {
        var option = document.createElement('option');
        option.value = matches[j];
        datalist.appendChild(option);
    }
}

function findFeatureByField(layer, fieldName, searchValue) {
    if (!layer || !fieldName) {
        return null;
    }
    var term = normalizeSearchValue(searchValue);
    if (!term) {
        return null;
    }
    var source = layer.getSource();
    if (!source) {
        return null;
    }
    var features = source.getFeatures();
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var fieldValue = feature.get(fieldName);
        if (fieldValue !== undefined && fieldValue !== null) {
            var fieldText = normalizeSearchValue(fieldValue);
            if (fieldText === term || fieldText.indexOf(term) !== -1) {
                return feature;
            }
        }
    }
    return null;
}

function copyFeatureProperties(sourceFeature, targetFeature) {
    if (!sourceFeature || !targetFeature || !sourceFeature.getProperties || !targetFeature.setProperties) {
        return;
    }
    var properties = sourceFeature.getProperties();
    if (properties && properties.geometry !== undefined) {
        delete properties.geometry;
    }
    targetFeature.setProperties(properties);
}

function applyOverlayPopupMetadata(overlayLayer, sourceLayer) {
    if (!overlayLayer || !sourceLayer) {
        return;
    }
    overlayLayer.set('fieldAliases', sourceLayer.get('fieldAliases') || {});
    overlayLayer.set('fieldLabels', sourceLayer.get('fieldLabels') || {});
    overlayLayer.set('fieldImages', sourceLayer.get('fieldImages') || {});
    overlayLayer.set('popuplayertitle', sourceLayer.get('popuplayertitle') || 'Polígono');
    overlayLayer.set('interactive', true);
}

function showPopupForFeature(feature, layer, coordinate) {
    if (!feature || !layer) {
        return;
    }
    var popupText = '<ul>';
    var fieldImages = layer.get('fieldImages') || {};
    var shouldShowPopup = false;
    for (var key in fieldImages) {
        if (fieldImages[key] !== 'Hidden') {
            shouldShowPopup = true;
            break;
        }
    }
    if (shouldShowPopup) {
        var featureKeys = feature.getKeys();
        popupText += '<li><table>';
        popupText += '<a><b>' + (layer.get('popuplayertitle') || 'Polígono') + '</b></a>';
        popupText += createPopupField(feature, featureKeys, layer);
        popupText += '</table></li>';
    }
    popupText = popupText === '<ul>' ? '' : popupText + '</ul>';
    popupContent = popupText || '<p>Polígono seleccionado.</p>';
    popupCoord = coordinate || (feature.getGeometry() && feature.getGeometry().getInteriorPoint ? feature.getGeometry().getInteriorPoint().getCoordinates() : map.getView().getCenter());
    updatePopup();
}

function zoomToSearchFeature(feature, layer) {
    if (!feature) {
        return;
    }
    var geometry = feature.getGeometry();
    if (!geometry) {
        return;
    }
    var clonedGeometry = geometry.clone();
    var resultFeature = new ol.Feature({ geometry: clonedGeometry });
    copyFeatureProperties(feature, resultFeature);
    searchSelectionCollection.clear();
    searchSelectionCollection.push(resultFeature);
    applyOverlayPopupMetadata(searchSelectionOverlay, layer);
    selectedPlanFeature = feature;
    selectedPlanLayer = layer || null;
    selectedPlanLayerLabel = layer && layer.get('popuplayertitle') ? layer.get('popuplayertitle') : null;
    selectedFeatureOverlayCollection.clear();
    if (selectedPlanFeature && selectedPlanFeature.getGeometry()) {
        var displayFeature = selectedPlanFeature.clone();
        displayFeature.setGeometry(selectedPlanFeature.getGeometry().clone());
        selectedFeatureOverlayCollection.push(displayFeature);
        applyOverlayPopupMetadata(selectedFeatureOverlayLayer, layer);
    }
    var view = map.getView();
    var popupCoordinate = geometry.getInteriorPoint ? geometry.getInteriorPoint().getCoordinates() : (geometry.getExtent ? ol.extent.getCenter(geometry.getExtent()) : view.getCenter());

    function fitToGeometry() {
        if (geometry.getType() === 'Point' || geometry.getType() === 'MultiPoint') {
            view.animate({ center: geometry.getCoordinates(), zoom: Math.max(view.getZoom() || 5, 16), duration: 700 });
        } else {
            var extent = geometry.getExtent();
            if (extent && extent[0] !== extent[2] && extent[1] !== extent[3]) {
                view.fit(extent, { size: map.getSize(), padding: [80, 80, 80, 80], maxZoom: 18, duration: 700 });
            } else {
                view.animate({ center: popupCoordinate, zoom: Math.max(view.getZoom() || 5, 16), duration: 700 });
            }
        }
    }

    if (layer && typeof layer.setVisible === 'function') {
        layer.setVisible(true);
    }
    map.renderSync();
    map.once('rendercomplete', function() {
        fitToGeometry();
    });
    fitToGeometry();
    showPopupForFeature(feature, layer, popupCoordinate);
}

function updateSearchMessage(messageId, message) {
    var element = document.getElementById(messageId);
    if (element) {
        element.textContent = message;
    }
}

function attachLayerSearch(buttonId, inputId, messageId, listId, layer, fieldName, layerLabel) {
    var button = document.getElementById(buttonId);
    var input = document.getElementById(inputId);
    var searchValues = buildUniqueSearchValues(layer, fieldName);
    if (!button || !input) {
        return;
    }
    populateDatalist(listId, searchValues, '');
    function refreshSuggestions() {
        populateDatalist(listId, searchValues, input.value);
        updateSearchMessage(messageId, '');
    }

    input.addEventListener('input', refreshSuggestions);
    input.addEventListener('keyup', refreshSuggestions);
    input.addEventListener('focus', refreshSuggestions);
    input.addEventListener('change', refreshSuggestions);
    button.addEventListener('click', function() {
        var value = input.value;
        if (!value || !value.trim()) {
            updateSearchMessage(messageId, 'Ingrese un valor para buscar.');
            return;
        }
        var feature = findFeatureByField(layer, fieldName, value);
        if (feature) {
            if (!layer.getVisible()) {
                layer.setVisible(true);
            }
            zoomToSearchFeature(feature, layer);
            updateSearchMessage(messageId, layerLabel + ' encontrado');
        } else {
            searchSelectionCollection.clear();
            updateSearchMessage(messageId, layerLabel + ' no encontrado');
        }
    });
    input.addEventListener('keypress', function(evt) {
        if (evt.key === 'Enter') {
            button.click();
        }
    });
}

attachLayerSearch('search-concesiones-button', 'search-concesiones-input', 'search-concesiones-message', 'concesiones-list', lyr_ConcesionesDGZFMT_4, 'No. Conces', 'Concesión');
attachLayerSearch('search-ocupantes-button', 'search-ocupantes-input', 'search-ocupantes-message', 'ocupantes-list', lyr_OcupantesirregularesZFMT_1, 'Clave', 'Ocupante');

function attachOpacityControl(inputId, valueId, layer) {
    var input = document.getElementById(inputId);
    var value = document.getElementById(valueId);
    if (!input || !value || !layer) {
        return;
    }
    input.addEventListener('input', function() {
        var opacity = parseInt(input.value, 10) / 100;
        layer.setOpacity(opacity);
        value.textContent = Math.round(opacity * 100) + '%';
    });
}

attachOpacityControl('opacity-concesiones', 'opacity-concesiones-value', lyr_ConcesionesDGZFMT_4);
attachOpacityControl('opacity-acuerdos', 'opacity-acuerdos-value', lyr_AcuerdosDestinoDGZMT_3);
attachOpacityControl('opacity-desincorporaciones', 'opacity-desincorporaciones-value', lyr_DesincorporacionesDGZFMT_2);
attachOpacityControl('opacity-ocupantes', 'opacity-ocupantes-value', lyr_OcupantesirregularesZFMT_1);

function formatUTMCoordinate(coord) {
    if (!coord || coord.length < 2) {
        return '';
    }
    var lonLat = ol.proj.transform(coord, map.getView().getProjection(), 'EPSG:4326');
    var lon = lonLat[0];
    var lat = lonLat[1];
    if (typeof proj4 === 'undefined') {
        return 'UTM no disponible';
    }
    var zone = Math.floor((lon + 180) / 6) + 1;
    var hemisphere = lat >= 0 ? 'N' : 'S';
    var epsgCode = (lat >= 0 ? 32600 : 32700) + zone;
    var projName = 'EPSG:' + epsgCode;
    if (!proj4.defs[projName]) {
        proj4.defs(projName, '+proj=utm +zone=' + zone + ' +datum=WGS84 +units=m +no_defs' + (lat < 0 ? ' +south' : ''));
    }
    var utm = proj4('EPSG:4326', projName, [lon, lat]);
    if (!utm || utm.length < 2) {
        return 'UTM no disponible';
    }
    var easting = Math.round(utm[0]);
    var northing = Math.round(utm[1]);
    return 'UTM ' + zone + hemisphere + ': ' + easting + ' E, ' + northing + ' N';
}

function updateCoordinateDisplay(evt) {
    var element = document.getElementById('coordinate-display');
    if (!element) {
        return;
    }
    if (!evt || !evt.coordinate) {
        element.textContent = 'UTM coordinates: mover el cursor sobre el mapa';
        return;
    }
    element.textContent = formatUTMCoordinate(evt.coordinate);
}

map.on('pointermove', updateCoordinateDisplay);
map.on('pointerdrag', updateCoordinateDisplay);
map.on('moveend', function() {
    var center = map.getView().getCenter();
    updateCoordinateDisplay({ coordinate: center });
});

//title

//abstract


//geolocate

	let isTracking = false;

	const geolocateButton = document.createElement('button');
	geolocateButton.className = 'geolocate-button fa fa-map-marker';
	geolocateButton.title = 'Ir a mi posición';

	const geolocateControl = document.createElement('div');
	geolocateControl.className = 'ol-unselectable ol-control geolocate';
	geolocateControl.appendChild(geolocateButton);

	const accuracyFeature = new ol.Feature();
	accuracyFeature.setStyle(new ol.style.Style({
	  fill: new ol.style.Fill({ color: 'rgba(51, 153, 204, 0.2)' }),
	  stroke: new ol.style.Stroke({ color: '#3399CC', width: 2 }),
	}));

	const positionFeature = new ol.Feature({
	  style: new ol.style.Style({
		image: new ol.style.Circle({
		  radius: 6,
		  fill: new ol.style.Fill({ color: '#3399CC' }),
		  stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
		}),
	  }),
	});

	const geolocateOverlay = new ol.layer.Vector({
	  source: new ol.source.Vector({
		features: [accuracyFeature, positionFeature],
	  }),
	});
	
	const geolocation = new ol.Geolocation({
	  projection: map.getView().getProjection(),
	  trackingOptions: {
		enableHighAccuracy: true,
		maximumAge: 10000,
		timeout: 60000,
	  },
	});

	geolocation.on('error', function(error) {
	  console.warn('Geolocation error:', error.message);
	  geolocateButton.blur();
	});

	geolocation.on('change:accuracyGeometry', function () {
	  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
	});

	geolocation.on('change:position', function () {
	  const coords = geolocation.getPosition();
	  positionFeature.setGeometry(coords ? new ol.geom.Point(coords) : null);
	  if (coords && isTracking) {
		map.getView().setCenter(coords);
		if (map.getView().getZoom() < 14) {
		  map.getView().setZoom(14);
		}
	  }
	});

	function handleGeolocate(event) {
	  if (event) {
		event.preventDefault();
	  }
	  if (isTracking) {
		geolocation.setTracking(false);
		map.removeLayer(geolocateOverlay);
		isTracking = false;
		geolocateButton.classList.remove('active');
	  } else {
		geolocation.setTracking(true);
		map.addLayer(geolocateOverlay);
		isTracking = true;
		geolocateButton.classList.add('active');
		const pos = geolocation.getPosition();
		if (pos) {
		  map.getView().setCenter(pos);
		  if (map.getView().getZoom() < 14) {
			map.getView().setZoom(14);
		  }
		}
	  }
	}

	geolocateButton.addEventListener('click', handleGeolocate);
	geolocateButton.addEventListener('touchstart', handleGeolocate);


//measurement
let measuring = false;

	const measureButton = document.createElement('button');
	measureButton.className = 'measure-button fas fa-ruler';
	measureButton.title = 'Measure';

	const measureControl = document.createElement('div');
	measureControl.className = 'ol-unselectable ol-control measure-control';
	measureControl.appendChild(measureButton);
	map.getTargetElement().appendChild(measureControl);

	// Event handler
	function handleMeasure() {
	  if (!measuring) {
		selectLabel.style.display = "";
		map.addInteraction(draw);
		createHelpTooltip();
		createMeasureTooltip();
		measuring = true;
	  } else {
		selectLabel.style.display = "none";
		map.removeInteraction(draw);
		map.removeOverlay(helpTooltip);
		map.removeOverlay(measureTooltip);
		const staticTooltips = document.getElementsByClassName("tooltip-static");
		while (staticTooltips.length > 0) {
		  staticTooltips[0].parentNode.removeChild(staticTooltips[0]);
		}
		measureLayer.getSource().clear();
		sketch = null;
		measuring = false;
	  }
	}

	measureButton.addEventListener('click', handleMeasure);
	measureButton.addEventListener('touchstart', handleMeasure);

    map.on('pointermove', function(evt) {
        if (evt.dragging) {
            return;
        }
        if (measuring) {
            /** @type {string} */
            var helpMsg = 'Click to start drawing';
            if (sketch) {
                var geom = (sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg;
                }
            }
            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);
        }
    });
    

    var selectLabel = document.createElement("label");
    selectLabel.innerHTML = "&nbsp;Measure:&nbsp;";

    var typeSelect = document.createElement("select");
    typeSelect.id = "type";

    var measurementOption = [
        { value: "LineString", description: "Length" },
        { value: "Polygon", description: "Area" }
        ];
    measurementOption.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.text = option.description;
        typeSelect.appendChild(optionElement);
    });

    selectLabel.appendChild(typeSelect);
    measureControl.appendChild(selectLabel);

    selectLabel.style.display = "none";
	/**
	 * Currently drawn feature.
	 * @type {ol.Feature}
	 */

	/**
	 * The help tooltip element.
	 * @type {Element}
	 */
	var helpTooltipElement;


	/**
	 * Overlay to show the help messages.
	 * @type {ol.Overlay}
	 */
	var helpTooltip;


	/**
	 * The measure tooltip element.
	 * @type {Element}
	 */
	var measureTooltipElement;


	/**
	 * Overlay to show the measurement.
	 * @type {ol.Overlay}
	 */
	var measureTooltip;


	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	var continueLineMsg = 'Click to continue drawing the line';



	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	var continuePolygonMsg = "1click continue, 2click close";


	var typeSelect = document.getElementById("type");
	var typeSelectForm = document.getElementById("form_measure");

	typeSelect.onchange = function (e) {		  
	  map.removeInteraction(draw);
	  addInteraction();
	  map.addInteraction(draw);		  
	};

	var measureLineStyle = new ol.style.Style({
	  stroke: new ol.style.Stroke({ 
		color: "rgba(0, 0, 255)", //blu
		lineDash: [10, 10],
		width: 4
	  }),
	  image: new ol.style.Circle({
		radius: 6,
		stroke: new ol.style.Stroke({
		  color: "rgba(255, 255, 255)", 
		  width: 1
		}),
	  })
	});

	var measureLineStyle2 = new ol.style.Style({	  
		stroke: new ol.style.Stroke({
			color: "rgba(255, 255, 255)", 
			lineDash: [10, 10],
			width: 2
		  }),
	  image: new ol.style.Circle({
		radius: 5,
		stroke: new ol.style.Stroke({
		  color: "rgba(0, 0, 255)", 
		  width: 1
		}),
			  fill: new ol.style.Fill({
		  color: "rgba(255, 204, 51, 0.4)", 
		}),
		  })
	});

	var labelStyle = new ol.style.Style({
	  text: new ol.style.Text({
		font: "14px Calibri,sans-serif",
		fill: new ol.style.Fill({
		  color: "rgba(0, 0, 0, 1)"
		}),
		stroke: new ol.style.Stroke({
		  color: "rgba(255, 255, 255, 1)",
		  width: 3
		})
	  })
	});

	var labelStyleCache = [];

	var styleFunction = function (feature, type) {
	  var styles = [measureLineStyle, measureLineStyle2];
	  var geometry = feature.getGeometry();
	  var type = geometry.getType();
	  var lineString;
	  if (!type || type === type) {
		if (type === "Polygon") {
		  lineString = new ol.geom.LineString(geometry.getCoordinates()[0]);
		} else if (type === "LineString") {
		  lineString = geometry;
		}
	  }
	  if (lineString) {
		var count = 0;
		lineString.forEachSegment(function (a, b) {
		  var segment = new ol.geom.LineString([a, b]);
		  var label = formatLength(segment);
		  if (labelStyleCache.length - 1 < count) {
			labelStyleCache.push(labelStyle.clone());
		  }
		  labelStyleCache[count].setGeometry(segment);
		  labelStyleCache[count].getText().setText(label);
		  styles.push(labelStyleCache[count]);
		  count++;
		});
	  }
	  return styles;
	};
	var source = new ol.source.Vector();

	var measureLayer = new ol.layer.Vector({
	  source: source,
	  displayInLayerSwitcher: false,
	  style: function (feature) {
		labelStyleCache = [];
		return styleFunction(feature);
	  }
	});

	map.addLayer(measureLayer);

	var draw; // global so we can remove it later
	function addInteraction() {
	  var type = typeSelect.value;
	  draw = new ol.interaction.Draw({
		source: source,
		type: /** @type {ol.geom.GeometryType} */ (type),
		style: function (feature) {
				  return styleFunction(feature, type);
				}
	  });

	  var listener;
	  draw.on('drawstart',
		  function(evt) {
			// set sketch
			sketch = evt.feature;

			/** @type {ol.Coordinate|undefined} */
			var tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on('change', function(evt) {
			  var geom = evt.target;
			  var output;
			  if (geom instanceof ol.geom.Polygon) {
					  output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
					  tooltipCoord = geom.getInteriorPoint().getCoordinates();
					} else if (geom instanceof ol.geom.LineString) {
					  output = formatLength(/** @type {ol.geom.LineString} */ (geom));
					  tooltipCoord = geom.getLastCoordinate();
					}
			  measureTooltipElement.innerHTML = output;
			  measureTooltip.setPosition(tooltipCoord);
			});
		  }, this);

	  draw.on('drawend',
		  function(evt) {
			measureTooltipElement.className = 'tooltip tooltip-static';
			measureTooltip.setOffset([0, -7]);
			// unset sketch
			sketch = null;
			// unset tooltip so that a new one can be created
			measureTooltipElement = null;
			createMeasureTooltip();
			ol.Observable.unByKey(listener);
		  }, this);
	}


	/**
	 * Creates a new help tooltip
	 */
	function createHelpTooltip() {
	  if (helpTooltipElement) {
		helpTooltipElement.parentNode.removeChild(helpTooltipElement);
	  }
	  helpTooltipElement = document.createElement('div');
	  helpTooltipElement.className = 'tooltip hidden';
	  helpTooltip = new ol.Overlay({
		element: helpTooltipElement,
		offset: [15, 0],
		positioning: 'center-left'
	  });
	  map.addOverlay(helpTooltip);
	}


	/**
	 * Creates a new measure tooltip
	 */
	function createMeasureTooltip() {
	  if (measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	  }
	  measureTooltipElement = document.createElement('div');
	  measureTooltipElement.className = 'tooltip tooltip-measure';
	  measureTooltip = new ol.Overlay({
		element: measureTooltipElement,
		offset: [0, -15],
		positioning: 'bottom-center'
	  });
	  map.addOverlay(measureTooltip);
	}


  /**
  * format length output
  * @param {ol.geom.LineString} line
  * @return {string}
  */
  var formatLength = function(line) {
    var length;
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = map.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += ol.sphere.getDistance(c1, c2);
      }
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
          ' ' + 'm';
    }
    return output;
  };

  /**
  * Format area output.
  * @param {ol.geom.Polygon} polygon The polygon.
  * @return {string} Formatted area.
  */
	var formatArea = function (polygon) {
		var sourceProj = map.getView().getProjection();
		var geom = polygon.clone().transform(sourceProj, 'EPSG:3857');
		var area = Math.abs(ol.sphere.getArea(geom));
		var output;
		if (area > 1000000) {
			output = Math.round((area / 1000000) * 1000) / 1000 + ' ' + 'km<sup>2</sup>';
		} else {
			output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
		}
		return output.replace('.', ',');
	};

  addInteraction();

  var parentElement = document.querySelector(".measure-control");
  var elementToMove = document.getElementById("form_measure");
  if (elementToMove && parentElement) {
    parentElement.insertBefore(elementToMove, parentElement.firstChild);
  }


//geocoder


//layer search


//scalebar


//layerswitcher

var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: "Layers",
    target: 'top-right-container'
});
map.addControl(layerSwitcher);
    





//attribution
var bottomAttribution = new ol.control.Attribution({
  collapsible: false,
  collapsed: false,
  className: 'bottom-attribution'
});
map.addControl(bottomAttribution);

map.once('rendercomplete', function() {
  var bottomAttributionUl = bottomAttribution.element.querySelector('ul');
  if (bottomAttributionUl) {
    var layerAttrs = Array.from(bottomAttributionUl.querySelectorAll('li'))
      .map(function(li) { return li.innerHTML.trim(); }).filter(Boolean);
    var attribHtml = `
    <a href="https://github.com/qgis2web/qgis2web">qgis2web</a> &middot;
    <a href="https://openlayers.org/">OpenLayers</a> &middot;
    <a href="https://qgis.org/">QGIS</a>`;
    if (layerAttrs.length > 0) { attribHtml += ' &nbsp;|&nbsp; ' + layerAttrs.join(', '); }
    bottomAttributionUl.innerHTML = '<li>' + attribHtml + '</li>';
  }
});


// Disable "popup on hover" or "highlight on hover" if ol-control mouseover
var preDoHover = doHover;
var preDoHighlight = doHighlight;
var isPopupAllActive = false;
document.addEventListener('DOMContentLoaded', function() {
	if (doHover || doHighlight) {
		var controlElements = document.getElementsByClassName('ol-control');
		for (var i = 0; i < controlElements.length; i++) {
			controlElements[i].addEventListener('mouseover', function() { 
				doHover = false;
				doHighlight = false;
			});
			controlElements[i].addEventListener('mouseout', function() {
				doHover = preDoHover;
				if (isPopupAllActive) { return }
				doHighlight = preDoHighlight;
			});
		}
	}
});


//move controls inside containers, in order
    //zoom
    var zoomControl = document.getElementsByClassName('ol-zoom')[0];
    if (zoomControl) {
        topLeftContainerDiv.appendChild(zoomControl);
    }
    //geolocate
    if (typeof geolocateControl !== 'undefined') {
        topLeftContainerDiv.appendChild(geolocateControl);
    }
    //measure
    if (typeof measureControl !== 'undefined') {
        topLeftContainerDiv.appendChild(measureControl);
    }
    //geocoder
    var searchbar = document.getElementsByClassName('photon-geocoder-autocomplete ol-unselectable ol-control')[0];
    if (searchbar) {
        topLeftContainerDiv.appendChild(searchbar);
    }
    //search layer
    var searchLayerControl = document.getElementsByClassName('search-layer')[0];
    if (searchLayerControl) {
        topLeftContainerDiv.appendChild(searchLayerControl);
    }
    //scale line
    var scaleLineControl = document.getElementsByClassName('ol-scale-line')[0];
    if (scaleLineControl) {
        scaleLineControl.className += ' ol-control';
        bottomLeftContainerDiv.appendChild(scaleLineControl);
    }
    //attribution
    var attributionControl = document.getElementsByClassName('bottom-attribution')[0];
    if (attributionControl) {
        bottomRightContainerDiv.appendChild(attributionControl);
    }