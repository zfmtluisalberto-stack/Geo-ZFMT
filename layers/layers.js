var wms_layers = [];


        var lyr_GoogleSatellite_0 = new ol.layer.Tile({
            'title': 'Google Satellite',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
            crossOrigin: 'anonymous',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });
var format_OcupantesirregularesZFMT_1 = new ol.format.GeoJSON();
var features_OcupantesirregularesZFMT_1 = format_OcupantesirregularesZFMT_1.readFeatures(json_OcupantesirregularesZFMT_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_OcupantesirregularesZFMT_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_OcupantesirregularesZFMT_1.addFeatures(features_OcupantesirregularesZFMT_1);
var lyr_OcupantesirregularesZFMT_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_OcupantesirregularesZFMT_1, 
                style: style_OcupantesirregularesZFMT_1,
                popuplayertitle: 'Ocupantes irregulares - ZFMT',
                interactive: true,
                title: '<img src="styles/legend/OcupantesirregularesZFMT_1.png" /> Ocupantes irregulares - ZFMT'
            });
var format_DesincorporacionesDGZFMT_2 = new ol.format.GeoJSON();
var features_DesincorporacionesDGZFMT_2 = format_DesincorporacionesDGZFMT_2.readFeatures(json_DesincorporacionesDGZFMT_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_DesincorporacionesDGZFMT_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_DesincorporacionesDGZFMT_2.addFeatures(features_DesincorporacionesDGZFMT_2);
var lyr_DesincorporacionesDGZFMT_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_DesincorporacionesDGZFMT_2, 
                style: style_DesincorporacionesDGZFMT_2,
                popuplayertitle: 'Desincorporaciones - DGZFMT',
                interactive: true,
                title: '<img src="styles/legend/DesincorporacionesDGZFMT_2.png" /> Desincorporaciones - DGZFMT'
            });
var format_AcuerdosDestinoDGZMT_3 = new ol.format.GeoJSON();
var features_AcuerdosDestinoDGZMT_3 = format_AcuerdosDestinoDGZMT_3.readFeatures(json_AcuerdosDestinoDGZMT_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_AcuerdosDestinoDGZMT_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_AcuerdosDestinoDGZMT_3.addFeatures(features_AcuerdosDestinoDGZMT_3);
var lyr_AcuerdosDestinoDGZMT_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_AcuerdosDestinoDGZMT_3, 
                style: style_AcuerdosDestinoDGZMT_3,
                popuplayertitle: 'Acuerdos Destino - DGZMT',
                interactive: true,
                title: '<img src="styles/legend/AcuerdosDestinoDGZMT_3.png" /> Acuerdos Destino - DGZMT'
            });
var format_ConcesionesDGZFMT_4 = new ol.format.GeoJSON();
var features_ConcesionesDGZFMT_4 = format_ConcesionesDGZFMT_4.readFeatures(json_ConcesionesDGZFMT_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ConcesionesDGZFMT_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ConcesionesDGZFMT_4.addFeatures(features_ConcesionesDGZFMT_4);
var lyr_ConcesionesDGZFMT_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ConcesionesDGZFMT_4, 
                style: style_ConcesionesDGZFMT_4,
                popuplayertitle: 'Concesiones - DGZFMT',
                interactive: true,
                title: '<img src="styles/legend/ConcesionesDGZFMT_4.png" /> Concesiones - DGZFMT'
            });
var format_DelimitacionesDGZFMT_5 = new ol.format.GeoJSON();
var features_DelimitacionesDGZFMT_5 = format_DelimitacionesDGZFMT_5.readFeatures(json_DelimitacionesDGZFMT_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_DelimitacionesDGZFMT_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_DelimitacionesDGZFMT_5.addFeatures(features_DelimitacionesDGZFMT_5);
var lyr_DelimitacionesDGZFMT_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_DelimitacionesDGZFMT_5, 
                style: style_DelimitacionesDGZFMT_5,
                popuplayertitle: 'Delimitaciones - DGZFMT',
                interactive: true,
    title: 'Delimitaciones - DGZFMT<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_0.png" /> AMBIENTES COSTEROS<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_1.png" /> EM<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_2.png" /> PM<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_3.png" /> PME<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_4.png" /> RECINTO PORTUARIO<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_5.png" /> TGM<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_6.png" /> ZF<br />\
    <img src="styles/legend/DelimitacionesDGZFMT_5_7.png" /> ZFE<br />' });
var format_Cuadriculaestrategicazonificada_6 = new ol.format.GeoJSON();
var features_Cuadriculaestrategicazonificada_6 = format_Cuadriculaestrategicazonificada_6.readFeatures(json_Cuadriculaestrategicazonificada_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Cuadriculaestrategicazonificada_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Cuadriculaestrategicazonificada_6.addFeatures(features_Cuadriculaestrategicazonificada_6);
var lyr_Cuadriculaestrategicazonificada_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Cuadriculaestrategicazonificada_6, 
                style: style_Cuadriculaestrategicazonificada_6,
                popuplayertitle: 'Cuadricula estrategica zonificada',
                interactive: true,
                title: '<img src="styles/legend/Cuadriculaestrategicazonificada_6.png" /> Cuadricula estrategica zonificada'
            });

lyr_GoogleSatellite_0.setVisible(true);lyr_OcupantesirregularesZFMT_1.setVisible(true);lyr_DesincorporacionesDGZFMT_2.setVisible(true);lyr_AcuerdosDestinoDGZMT_3.setVisible(true);lyr_ConcesionesDGZFMT_4.setVisible(true);lyr_DelimitacionesDGZFMT_5.setVisible(true);lyr_Cuadriculaestrategicazonificada_6.setVisible(true);
var layersList = [lyr_GoogleSatellite_0,lyr_OcupantesirregularesZFMT_1,lyr_DesincorporacionesDGZFMT_2,lyr_AcuerdosDestinoDGZMT_3,lyr_ConcesionesDGZFMT_4,lyr_DelimitacionesDGZFMT_5,lyr_Cuadriculaestrategicazonificada_6];
lyr_OcupantesirregularesZFMT_1.set('fieldAliases', {'fid': 'fid', 'Clave': 'Clave', 'ID': 'ID', 'NOMBRE DEL': 'NOMBRE DEL', 'ID-OCUPACI': 'ID-OCUPACI', 'ID - Actua': 'ID - Actua', 'ZONA': 'ZONA', 'X': 'X', 'Y': 'Y', 'TIPO DE US': 'TIPO DE US', 'ZF': 'ZF', 'TGM': 'TGM', 'TOTAL': 'TOTAL', });
lyr_DesincorporacionesDGZFMT_2.set('fieldAliases', {'layer': 'layer', 'area': 'area', 'dof': 'dof', 'developer': 'developer', });
lyr_AcuerdosDestinoDGZMT_3.set('fieldAliases', {'begin': 'begin', 'end': 'end', 'area': 'area', 'perimeter': 'perimeter', 'layer': 'layer', 'developer': 'developer', 'dof': 'dof', });
lyr_ConcesionesDGZFMT_4.set('fieldAliases', {'fid': 'fid', 'Concesion_': 'Concesion_', 'id': 'id', 'No. Conces': 'No. Conces', 'Objetcid': 'Objetcid', 'Expediente': 'Expediente', 'Nombre del': 'Nombre del', 'Persona Mo': 'Persona Mo', 'Persona Fi': 'Persona Fi', 'Persona _1': 'Persona _1', 'Representa': 'Representa', 'Contacto': 'Contacto', 'Correo Ele': 'Correo Ele', 'RFC': 'RFC', 'Telefono': 'Telefono', 'Domicilio': 'Domicilio', 'Domicili_1': 'Domicili_1', 'Domicili_2': 'Domicili_2', 'Direccion': 'Direccion', 'Ubicacion': 'Ubicacion', 'I': 'I', 'II': 'II', 'III': 'III', 'IV': 'IV', 'V': 'V', 'VI': 'VI', 'Fecha otor': 'Fecha otor', 'Superficie': 'Superficie', 'Tipo de us': 'Tipo de us', 'Tarifa apl': 'Tarifa apl', 'Importe an': 'Importe an', 'Importe bi': 'Importe bi', 'Vigencia d': 'Vigencia d', 'Vigencia h': 'Vigencia h', 'Años': 'Años', 'Debe desde': 'Debe desde', 'Debe hasta': 'Debe hasta', 'Situación': 'Situación', 'Notificaci': 'Notificaci', });
lyr_DelimitacionesDGZFMT_5.set('fieldAliases', {'Layer': 'Layer', 'PLANO': 'PLANO', 'ESTADO': 'ESTADO', 'MUNICIPIO': 'MUNICIPIO', 'LOCALIDAD': 'LOCALIDAD', 'AÑO': 'AÑO', 'developer': 'developer', });
lyr_Cuadriculaestrategicazonificada_6.set('fieldAliases', {'id': 'id', 'clave': 'clave', });
lyr_OcupantesirregularesZFMT_1.set('fieldImages', {'fid': '', 'Clave': '', 'ID': '', 'NOMBRE DEL': '', 'ID-OCUPACI': '', 'ID - Actua': '', 'ZONA': '', 'X': '', 'Y': '', 'TIPO DE US': '', 'ZF': '', 'TGM': '', 'TOTAL': '', });
lyr_DesincorporacionesDGZFMT_2.set('fieldImages', {'layer': '', 'area': '', 'dof': '', 'developer': '', });
lyr_AcuerdosDestinoDGZMT_3.set('fieldImages', {'begin': '', 'end': '', 'area': '', 'perimeter': '', 'layer': '', 'developer': '', 'dof': '', });
lyr_ConcesionesDGZFMT_4.set('fieldImages', {'fid': '', 'Concesion_': '', 'id': '', 'No. Conces': '', 'Objetcid': '', 'Expediente': '', 'Nombre del': '', 'Persona Mo': '', 'Persona Fi': '', 'Persona _1': '', 'Representa': '', 'Contacto': '', 'Correo Ele': '', 'RFC': '', 'Telefono': '', 'Domicilio': '', 'Domicili_1': '', 'Domicili_2': '', 'Direccion': '', 'Ubicacion': '', 'I': '', 'II': '', 'III': '', 'IV': '', 'V': '', 'VI': '', 'Fecha otor': '', 'Superficie': '', 'Tipo de us': '', 'Tarifa apl': '', 'Importe an': '', 'Importe bi': '', 'Vigencia d': '', 'Vigencia h': '', 'Años': '', 'Debe desde': '', 'Debe hasta': '', 'Situación': '', 'Notificaci': '', });
lyr_DelimitacionesDGZFMT_5.set('fieldImages', {'Layer': 'TextEdit', 'PLANO': 'TextEdit', 'ESTADO': 'TextEdit', 'MUNICIPIO': 'TextEdit', 'LOCALIDAD': 'TextEdit', 'AÑO': 'TextEdit', 'developer': 'TextEdit', });
lyr_Cuadriculaestrategicazonificada_6.set('fieldImages', {'id': 'TextEdit', 'clave': 'TextEdit', });
lyr_OcupantesirregularesZFMT_1.set('fieldLabels', {'fid': 'hidden field', 'Clave': 'inline label - always visible', 'ID': 'hidden field', 'NOMBRE DEL': 'inline label - always visible', 'ID-OCUPACI': 'inline label - always visible', 'ID - Actua': 'hidden field', 'ZONA': 'inline label - always visible', 'X': 'inline label - always visible', 'Y': 'inline label - always visible', 'TIPO DE US': 'inline label - always visible', 'ZF': 'inline label - always visible', 'TGM': 'inline label - always visible', 'TOTAL': 'inline label - always visible', });
lyr_DesincorporacionesDGZFMT_2.set('fieldLabels', {'layer': 'hidden field', 'area': 'hidden field', 'dof': 'inline label - always visible', 'developer': 'hidden field', });
lyr_AcuerdosDestinoDGZMT_3.set('fieldLabels', {'begin': 'hidden field', 'end': 'hidden field', 'area': 'hidden field', 'perimeter': 'hidden field', 'layer': 'hidden field', 'developer': 'hidden field', 'dof': 'inline label - always visible', });
lyr_ConcesionesDGZFMT_4.set('fieldLabels', {'fid': 'hidden field', 'Concesion_': 'inline label - visible with data', 'id': 'hidden field', 'No. Conces': 'inline label - always visible', 'Objetcid': 'hidden field', 'Expediente': 'hidden field', 'Nombre del': 'inline label - always visible', 'Persona Mo': 'hidden field', 'Persona Fi': 'hidden field', 'Persona _1': 'hidden field', 'Representa': 'inline label - always visible', 'Contacto': 'inline label - always visible', 'Correo Ele': 'inline label - always visible', 'RFC': 'inline label - always visible', 'Telefono': 'inline label - always visible', 'Domicilio': 'inline label - always visible', 'Domicili_1': 'inline label - always visible', 'Domicili_2': 'inline label - always visible', 'Direccion': 'inline label - always visible', 'Ubicacion': 'inline label - always visible', 'I': 'hidden field', 'II': 'hidden field', 'III': 'hidden field', 'IV': 'hidden field', 'V': 'hidden field', 'VI': 'hidden field', 'Fecha otor': 'inline label - always visible', 'Superficie': 'inline label - always visible', 'Tipo de us': 'inline label - always visible', 'Tarifa apl': 'inline label - always visible', 'Importe an': 'inline label - always visible', 'Importe bi': 'inline label - always visible', 'Vigencia d': 'inline label - always visible', 'Vigencia h': 'inline label - always visible', 'Años': 'inline label - always visible', 'Debe desde': 'hidden field', 'Debe hasta': 'hidden field', 'Situación': 'hidden field', 'Notificaci': 'hidden field', });
lyr_DelimitacionesDGZFMT_5.set('fieldLabels', {'Layer': 'inline label - always visible', 'PLANO': 'inline label - always visible', 'ESTADO': 'inline label - always visible', 'MUNICIPIO': 'inline label - always visible', 'LOCALIDAD': 'inline label - always visible', 'AÑO': 'inline label - always visible', 'developer': 'hidden field', });
lyr_Cuadriculaestrategicazonificada_6.set('fieldLabels', {'id': 'hidden field', 'clave': 'inline label - always visible', });
lyr_Cuadriculaestrategicazonificada_6.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});