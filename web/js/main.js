com = {crono: { gla: { helper: {} } }}; com.crono.gla.helper = function() {var self = this; this.featureLayer;  self.legendData = {};  self.excludePropertiesList = ['objectid', 'shape', 'type', 'layerid', 'total value (£bn)', 'amenity value (£m)', 'total value of mental health savings (£m)', 'total value of physical health savings (£m)', 'total value of recreational benefits (£m)',
'percentage of the borough that is publicly accessible green space (%)' ];
this.info_message1 = 'Combined economic value estimated for health, amenity, recreation, carbon storage and temperature regulation benefits of public parks in London.';
this.info_message2 = 'Annual net economic value estimated for health, amenity, recreation, carbon storage and temperature regulation benefits of public parks in London.';
this.info_message3 = 'Annual net economic value per Borough resident estimated for health, amenity, recreation, carbon storage and temperature regulation benefits of public parks in London.';
this.info_message4 = 'The value of avoided health care spending due to public parks - estimated from the relationship between proximity to green space and self-reported mental health outcomes in England.'; this.info_message5 = 'The value of the reduced risk and associated avoided costs of disease due to public parks - estimated from the contribution parks play in increasing levels of physical activity.'; this.info_message6 = 'The value people place on living in areas with more public parks - based on the estimated relationship between local house prices and surrounding green space across London (Smith, 2010).'; this.info_message7 = 'The value of recreation in London’s public parks - estimated using the Outdoor Recreation Valuation (ORVal) tool (Day & Smith, 2016).';
this.init = function() {self.loadMap('');}; this.onOpacityChange = function() {var val = $('input[type=range]').val(); landBaseLayer.setOpacity(val / 10);};
this.saveMapPoint = function() {var points = esri.geometry.webMercatorToGeographic(helperObj.map.infoWindow.location);  var zohoMapTable = {latitude: points.y, longitude: points.x};
        $.post('map/saveMapPoint', zohoMapTable).done(function(response) {self.map.infoWindow.hide(); landBaseLayer.refresh(); }); }
this.loadMap = function(token) { self.about_map();  //self.mapServer = 'https://dev.gwkgds.org.uk/server/rest/services/GLA/GLa_Webmap3/MapServer';
self.mapServer = 'https://maps.london.gov.uk/gla/rest/services/apps/Natural_Capital_report/MapServer'; self.token = '';
require(["esri/map", "esri/virtualearth/VETiledLayer", "esri/geometry/Extent", "esri/layers/ArcGISDynamicMapServiceLayer",  'esri/dijit/Popup', 'esri/symbols/SimpleFillSymbol',
'esri/Color', 'dojo/dom-construct', 'dojo/dom-class', 'esri/symbols/SimpleLineSymbol', 'esri/virtualearth/VEGeocoder', 'esri/tasks/IdentifyParameters', 'esri/tasks/IdentifyTask', 'esri/dijit/PopupMobile' ],
function(Map, VETiledLayer, Extent, ArcGISDynamicMapServiceLayer, Popup, SimpleFillSymbol, Color, domConstruct, domClass, SimpleLineSymbol,  VEGeocoder, IdentifyParameters, IdentifyTask, PopupMobile)
{var szBkey='Au-BsmTdtDXpl2ODlgl9oSxI-IAJ8iYPWgrHTvU_E1wQYyJoo98PDk45M3kZ0oQM';var veTileLayer, bingMapsKey = szBkey;//'As9QBiGS-vF01SV8wkYBT4RCYnlJsL4dTOaqn2MvGtteGZhtRnDCVMqhdNMBrz79';
var fill = new SimpleFillSymbol( esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol( esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([158, 0, 89, 0.80]), 2), new dojo.Color([0, 0, 0, 0.2]));
var lineSymbol = new SimpleLineSymbol({color: 'FFFF00'  }); var popup;
if ($(document.body).width() > 959) {
    popup = new Popup({fillSymbol: fill, lineSymbol: lineSymbol, highlight: true, popupWindow: true,  titleInBody: false}, domConstruct.create("div"));}
else {popup = new PopupMobile({fillSymbol: fill, lineSymbol: lineSymbol, highlight: true, popupWindow: true, titleInBody: false}, domConstruct.create("div"));}
  self.extent = new Extent({xmax: 129858.84322225579,  xmin: -163659.34539293332, ymax: 6751966.329809583, ymin: 6662993.6288856035, 'spatialReference': {'wkid': 102100 } });
  domClass.add(popup.domNode, "dark"); popup.on('hide', function() {$(document.getElementsByClassName('selected')) .removeClass('selected'); });
  self.veGeocoder = new esri.virtualearth.VEGeocoder({bingMapsKey: bingMapsKey, mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD });
  self.map = new Map("map", {extent: self.extent, autoResize: true, infoWindow: popup, fadeOnZoom: true, slider: true, wrapAround180: true, nav: false });// infoWindow : popup,// zoom : zoom,
  veTileLayer = new VETiledLayer({bingMapsKey: bingMapsKey, mapStyle: VETiledLayer.MAP_STYLE_ROAD});
  landBaseLayer = new ArcGISDynamicMapServiceLayer(self.mapServer + self.token, {opacity: .7, spatialReference: {wkid: 102100 } }); self.loadLegends();
  self.identifyTask = new IdentifyTask(self.mapServer + self.token); self.identifyParams = new IdentifyParameters(); self.identifyParams.tolerance = 6; self.identifyParams.returnGeometry = true;
  self.identifyParams.layerIds = [0]; self.identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL; self.identifyParams.width = self.map.width; self.identifyParams.height = self.map.height;
  self.map.addLayer(veTileLayer); self.map.addLayer(landBaseLayer); self.addFeatureLayer(); 
  self.map.on("load", function() {self.map.graphics.enableMouseEvents(); self.map.graphics.on("mouse-out", self.closeDialog); });
  dojo.connect(landBaseLayer, 'onLoad', function(landBaseLayer) {landBaseLayer.setVisibleLayers([0]); dojo.require("esri.geometry.webMercatorUtils"); }); // landBaseLayer.setVisibleLayers([0]);
  self.map.on("click", self.onMapClick); }); }
this.loadLegends = function() {$.getJSON(self.mapServer + '/legend/?f=json&pretty=true', function(legends) {var /* legends = $.parseJSON(lgnd), */ layers = legends.layers, orderId = 0;
  for (var index = 0; index < layers.length; index++) {
    if (layers[index].legend && layers[index].legend.length > 1) {var legendList = [];
      for (var i = 0; i < layers[index].legend.length; i++) {
        var data = {layerName: layers[index].layerName || layers[index].layerFullName, layerId: layers[index].layerId, orderId: orderId++,
          legendData: ('<div><img src="data:image/png;base64,' + layers[index].legend[i].imageData + '" />' + '<span> &nbsp;' + layers[index].legend[i].label + '</span></div>'),
          imageData: layers[index].legend[i].imageData, layerFullName: layers[index].layerName + '( ' + layers[index].legend[i].label + ' )'};
        legendList.push(data);}
      self.legendData[layers[index].layerId] = legendList;} 
	else {var data = {layerId: layers[index].layerId, orderId: orderId++, 
	  legendData: ('<div><img src="data:image/png;base64,' + layers[index].legend[0].imageData + '" />' + '<span> &nbsp;' + layers[index].layerName + '</span></div>'),
      imageData: layers[index].legend[0].imageData, layerName: layers[index].layerName || layers[index].layerFullName, layerFullName: layers[index].layerName };
    self.legendData[layers[index].layerId] = [data]; /* * if (layers[index].layerId == 0) {checkedStore.add(layers[index]); } */ } }
    self.layerSelectionChanged(0);}); }
this.onMapClick = function(evt) {self.executeIdentifyTask(evt);}
this.isNotNull = function(value) {var retVal = false; value = String(value); if (value.trim() != '' && value.toLowerCase() != 'null' && value.toLowerCase() != 'undefined') {retVal = true;}
  return retVal;}
this.onLocateMeClick = function(postSearch, addAPoint) {var zoomToLocation = function(location) {
  var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));  self.map.centerAndZoom(pt, 12);}
  var locationError = function(error) {switch (error.code) {case error.PERMISSION_DENIED: alert("Location not provided"); break;
    case error.POSITION_UNAVAILABLE: alert("Current location not available"); break; case error.TIMEOUT: alert("Timeout");break; default: alert("unknown error"); break;} };
  if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);};};
this.zoomToMaxExtent = function() {self.map.setExtent(self.extent);}
this.layerSelectionChanged = function(val) {/* var val = el.selectedOptions[0].value;*/ landBaseLayer.setVisibleLayers([val]);  var legendString = '';
        if ($.isEmptyObject(self.legendData)) {return;}
        if (self.legendData[val]) {// legendString += '<h2 class="main-heading">'  // + self.legendData[val][0].layerName + '<h2>';
           for (var t = 0; t < self.legendData[val].length; t++) {legendString += self.legendData[val][t].legendData;} }
        $('#legend_div').html(legendString); }
this.executeIdentifyTask = function(evt, geometry, churchId) { var visibleLayers = landBaseLayer.visibleLayers;
  // $('.basic_information font').html('Basic Information'); // $('.right_popup_wrapper').removeClass('hidden');
  // $('#buffer_chart_information').addClass('hidden'); // $('.chart_information').addClass('hidden');
  self.map.infoWindow.setTitle('GLA'); var rendered = false; self.identifyParams.geometry = evt.mapPoint;  self.identifyParams.mapExtent = self.map.extent;
  self.identifyParams.layerIds = visibleLayers.sort(function(a, b) {return a - b;}); var deferred = self.identifyTask.execute(self.identifyParams);
  deferred.addCallback(function(response) {var features = [];
  if (response.length <= 0) {helperObj.hideLoading(); return;} else if (!geometry && response.length > 5) {response.length = 5; if (!self.isIE()) {  }}
  self.identifiedLocalAuthorities = []; // for (var index = 0; index < response.length; index++) {
  return dojo.map(response, function(result) {/* var result = response[index];*/var feature = result.feature; var template = new esri.InfoTemplate(); var content = '<table> <tbody>';
    var contentRight = ''; var t = '', title = ''; feature.attributes['layerId'] = result.layerId; var contentIndex = 0;
    for (var x in feature.attributes) {if (x && self.excludePropertiesList.indexOf(x.toLowerCase()) != -1) {continue;}
      if (!title) {title = feature.attributes[feature.displayFieldName] ||  feature.attributes[x];};
      var label = x, value = feature.attributes[x]; if (label) {label = label.replace('_', ' ');}
      if (label == 'Download full borough report') {var web = value; if (!self.isNotNull(web)) {web = '-';} else {var pattwww = /www./g; var pattHttp = /http:/g;
        if (!pattHttp.test(web)) {/*web = 'https://' + web; */ }; web = '<a class="dwnld-btn" target = "_blank" href="' +  web + '">Download</a>';}
        content += '<tr><td>Download full borough report</td><td>' +  web + '</td></tr>';} // <i title="Download full borough report" class="fa // fa-info-circle// i_info"// aria-hidden="true"></i>
      else if (label == 'Borough' ||  label =='Percentage of the borough that is publicly accessible green space') {content +='<tr><td>'+ label +'</td><td>'+  value +'</td></tr>';} 
	      else {content +='<tr><td>'+ label +'</td><td>'+ value +'<i title="'+ self.getInfoMessage(label) +'" class="fa fa-info-circle i_info" aria-hidden="true"></i></td></tr>';} //}content += '</div>';
          $('.chart_information').addClass('hidden');}
    content += '</tr></tbody></table>';
    var template = new esri.InfoTemplate(feature.attributes[feature.displayFieldName], content); feature.setInfoTemplate(template);  // if (!rendered) {
      var title = result.layerName.replace('(£bn)', ''); title = title.replace('(£m)', ''); $('div#sub-title').html(title); $('#result_div').html(content);  $('#result_div').slideDown();
      $('#result_div').addClass('data-list_div'); $('.status').removeClass('hidden'); self.map.infoWindow.setContent(content); return feature; }); });
  self.map.infoWindow.setFeatures([deferred]); if (geometry) {self.map.setExtent(evt.exten);} };

this.getInfoMessage = function(val) {switch (val) { case 'Total calculated value': return this.info_message1; break; case 'Annual net value': return this.info_message2; break;
  case 'Annual net value per person': return this.info_message3; break; case 'Mental health': return this.info_message4; break;
  case 'Physical health': return this.info_message5; break; case 'Property': return this.info_message6; break; case 'Recreation': return this.info_message7; break;}}

this.toggleLeftPanel = function() {$('.panel #left-content-wrapper').slideToggle();var panel = $('.left_panel .panel-heading i');
        if (panel.hasClass('fa-minus')) {panel.removeClass('fa-minus'); panel.addClass('fa-plus');} else {panel.removeClass('fa-plus'); panel.addClass('fa-minus'); } }
this.toggleRightPanel = function() {$('#result_div').slideToggle();  var panel = $('#left-content-wrapper .status a i');
        if (panel.hasClass('fa-minus')) {panel.removeClass('fa-minus'); panel.addClass('fa-plus'); $('#result_div').removeClass('data-list_div');} 
		else {panel.removeClass('fa-plus'); panel.addClass('fa-minus'); $('#result_div').addClass('data-list_div');} }
this.addFeatureLayer = function(evt) {require(["esri/Color", "esri/symbols/SimpleLineSymbol", "esri/layers/FeatureLayer", "esri/symbols/SimpleMarkerSymbol", "dijit/TooltipDialog", "dijit/popup", "esri/graphic", "esri/lang", "esri/symbols/SimpleFillSymbol",  "dojo/dom-style", "esri/renderers/SimpleRenderer" ],
  function(Color, SimpleLineSymbol, FeatureLayer, SimpleMarkerSymbol, TooltipDialog, dijitPopup, Graphic,  esriLang, SimpleFillSymbol, domStyle, SimpleRenderer) {
    if (self.featureLayer) {self.featureLayer.clearSelection();} 
	else {self.featureLayer = new FeatureLayer(self.mapServer + '/5' + self.token, {mode: FeatureLayer.MODE_SNAPSHOT,  outFields: ["Borough"], opacity: .7  }); }
    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255, 0.0]), 1), new Color([125, 125, 125, 0.0]));
    // self.featureLayer.setSelectionSymbol(symbol);
    self.featureLayer.setRenderer(new SimpleRenderer(symbol)); self.map.addLayer(self.featureLayer); self.map.infoWindow.resize(245, 125);
    dialog = new TooltipDialog({id: "tooltipDialog", style: "position: absolute; font: normal normal normal 10pt Helvetica;z-index:100" }); dialog.startup();
    var highlightSymbol=new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255]),3), new Color([255,255,255,0.2]));
    self.featureLayer.on("mouse-out", self.closeDialog);
    self.featureLayer.on("mouse-move", function(evt) {var t = "<b>${Borough}</b>"; var content = esriLang.substitute(evt.graphic.attributes, t);
      var highlightGraphic = new Graphic(evt.graphic.geometry, highlightSymbol);// self.map.graphics.add(highlightGraphic);
      dialog.setContent(content);  /*  * domStyle.set(dialog.domNode, "opacity", * 0.85); */
      self.dijitPopup = dijitPopup; self.dijitPopup.open({popup: dialog, x: (evt.pageX + 10), y: (evt.pageY + 10) });  }); }); };
this.closeDialog=function() {/* self.map.graphics.clear();*/self.dijitPopup.close(dialog);}
this.about_map=function() {/* swal("", "<div id='swal_content'>Loading...</div>", "info"); $(".sweet-alert #swal_content").load("about.html"); */
swal("London's Natural Capital Map",  "<p>&nbsp; &nbsp; This data highlights the enormous economic value and benefits provided by public parks and green spaces. It provides a compelling evidence base for maintaining, or even increasing, investment in London’s public green spaces. It also highlights the need for policy-makers and decision-makers to explore new sustainable models for financing public parks provision.</p> <p>&nbsp; Click on a Borough for more information on the economic value of its different green space benefits.</p>", "info") }}