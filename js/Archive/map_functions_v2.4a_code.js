/**
	Changes to 2.1:
		- addition of monitoring maximize window
	Changes to 2.1:
		- addition of clean power estimator 

*/


var map;
var centerLatitude = 37.77;
var centerLongitude = -122.44; 
var startZoom = 13;
var iconSun; 
var iconYellowPnt;
var tooltip;
var existingMarkers= {};
var existingMuniMarkers= {};
var existingObsMarkers= {};
var existingSwhMarkers={};
var showSmallMarkers = true;
var buildingMarkers= {};

var iconOrangeBig;
var iconAquaBig;
var iconBlueBig;
var iconGreenBig;
var iconOrangeBig;
var iconPinkBig;
var iconRedBig;
var iconYellowBig;
var iconWhiteBig;

function addMarker(longitude, latitude, description, iconName) {
	var marker = new GMarker(new GLatLng(latitude, longitude));
	GEvent.addListener(marker, 'click',
		function() {
			marker.openInfoWindowHtml(description);
		}
	);
	map.addOverlay(marker);
}

function windowHeight() {
	// Standard browsers (Mozilla, Safari, etc.)
	if (self.innerHeight)
		return self.innerHeight;
	// IE 6
	if (document.documentElement && document.documentElement.clientHeight)
		return document.documentElement.clientHeight;
	// IE 5
	if (document.body)
		return document.body.clientHeight;
	// Just in case.
	return 0;
}

function handleResize() {
	if(document.getElementById('top1')){
		var height = windowHeight() - 145;
		//alert(height);
		document.getElementById('map_canvas').style.height = height + 'px';
	}
}



function changeBodyClass(from, to) {
	document.body.className = document.body.className.replace(from, to);
	return false;
}

function init() {
	//document.getElementById('button-sidebar-hide').onclick = function() { return changeBodyClass('sidebar-right', 'nosidebar'); };
	//document.getElementById('button-sidebar-show').onclick = function() { return changeBodyClass('nosidebar', 'sidebar-right'); };
	handleResize();
	
	map = new GMap2(document.getElementById("map"), {draggableCursor: "default", draggingCursor: "move"});
	map.addControl(new GLargeMapControl());

	// ============= Add the tiles =================
	var tilelayer = new GTileLayer(new GCopyrightCollection(), 0, 14);
	tilelayer.getTileUrl = function(tile,zoom){
		//var url = 
		if(zoom >= 15){
			return "tiles_v23/blank.png"; 
		}else{
			return "tiles_v23/" + zoom + "/" + tile.x + "/" + tile.y + ".png"; 
		}
	};
	tilelayer.isPng = function(){return true;};
	var tileOverlay = new GTileLayerOverlay(tilelayer);
	tileOverlay.type = 'currentInstalls';
	
	// === Add the SHW tiles
	var shwtilelayer = new GTileLayer(new GCopyrightCollection(), 0, 14);
	shwtilelayer.getTileUrl = function(tile,zoom){
		//var url = 
		if(zoom >= 15){
			return "shwTiles/blank.png"; 
		}else{
			return "shwTiles/" + zoom + "/" + tile.x + "/" + tile.y + ".png"; 
		}
	};
	shwtilelayer.isPng = function(){return true;};
	var shwTileOverlay = new GTileLayerOverlay(shwtilelayer);
	shwTileOverlay.type = 'shwInstalls';


	//map.addControl(new GMapTypeControl());
	map.addControl(new PromoControl());
	map.enableScrollWheelZoom();
	map.enableContinuousZoom();
	map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
	map.setMapType(G_HYBRID_MAP);
	map.addOverlay(shwTileOverlay);
	map.addOverlay(tileOverlay);

	// ====== set up marker mouseover tooltip div ======
	tooltip = document.createElement("div");
	map.getPane(G_MAP_FLOAT_PANE).appendChild(tooltip);
	tooltip.style.visibility="hidden";
	tooltip.style.width="200px";
	var LegendControl = function(url) {this.url_ = url;};
	LegendControl.prototype = new GControl(true);
	LegendControl.prototype.initialize = function(map) {
		var container = document.createElement("div");
		container.style.width="220px";
		container.style.height=map.getSize().height+"px";
		container.style.zIndex="-500";
		url = this.url_;
		map.getContainer().appendChild(container);
			return container;
	};
	LegendControl.prototype.getDefaultPosition = function() {
		return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(20, 0));
	};
	map.addControl(new LegendControl());

	var baseMarker = new GIcon();
	baseMarker.shadow = "images/markers2/shadow50.png";
	baseMarker.iconSize = new GSize(24, 34);
	baseMarker.shadowSize = new GSize(37, 34);
	baseMarker.iconAnchor = new GPoint(10, 17);
	baseMarker.infoWindowAnchor = new GPoint(10, 1);

	// create icons
	iconOrangeBig = new GIcon(baseMarker);
	iconOrangeBig.image = "images/markers2/orange_marker_24.png";
	iconAquaBig = new GIcon(baseMarker);
	iconAquaBig.image = "images/markers2/aqua_marker_24.png";
	iconBlueBig = new GIcon(baseMarker);
	iconBlueBig.image = "images/markers2/blue_marker_24.png";
	iconGreenBig = new GIcon(baseMarker);
	iconGreenBig.image = "images/markers2/green_marker_24.png";
	iconOrangeBig = new GIcon(baseMarker);
	iconOrangeBig.image = "images/markers2/orange_marker_24.png";
	iconPinkBig = new GIcon(baseMarker);
	iconPinkBig.image = "images/markers2/pink_marker_24.png";
	iconRedBig = new GIcon(baseMarker);
	iconRedBig.image = "images/markers2/red_marker_24.png";
	iconYellowBig = new GIcon(baseMarker);
	iconYellowBig.image = "images/markers2/yellow_marker_24.png";
	iconWhiteBig = new GIcon(baseMarker);
	iconWhiteBig.image = "images/markers2/white_marker_24.png";

	var basePoint = new GIcon();
	basePoint.iconSize = new GSize(8, 8);
	basePoint.iconAnchor = new GPoint(3, 3);
	basePoint.infoWindowAnchor = new GPoint(6, 5);

	iconAquaPnt = new GIcon(basePoint);
	iconAquaPnt.image = "images/markers2/aqua8.gif";
	iconBluePnt = new GIcon(basePoint);
	iconBluePnt.image = "images/markers2/blue8.gif";
	iconGreenPnt = new GIcon(basePoint);
	iconGreenPnt.image = "images/markers2/green8.gif";
	iconOrangePnt = new GIcon(basePoint);
	iconOrangePnt.image = "images/markers2/orange8.gif";
	iconPinkPnt = new GIcon(basePoint);
	iconPinkPnt.image = "images/markers2/pink8.gif";
	iconRedPnt = new GIcon(basePoint);
	iconRedPnt.image = "images/markers2/red8.gif";
	iconYellowPnt = new GIcon(basePoint);
	iconYellowPnt.image = "images/markers2/yellow8.gif";
	iconWhitePnt = new GIcon(basePoint);
	iconWhitePnt.image = "images/markers2/white8.gif";

	iconSun = new GIcon();
	iconSun.image = "images/markers2/current_24.png";
	iconSun.shadow = "images/markers2/shadow50.png";
	iconSun.iconSize = new GSize(24, 34);
	iconSun.shadowSize = new GSize(37, 34);
	iconSun.iconAnchor = new GPoint(10, 17);
	iconSun.infoWindowAnchor = new GPoint(10, 1);

	iconSmallSun = new GIcon();
	iconSmallSun.image = "images/markers2/current_15.png";
	iconSmallSun.shadow = "images/markers2/shadow50.png";
	iconSmallSun.iconSize = new GSize(15, 21);
	iconSmallSun.shadowSize = new GSize(20, 24);
	iconSmallSun.iconAnchor = new GPoint(7, 12);
	iconSmallSun.infoWindowAnchor = new GPoint(10, 1);

	iconCS = new GIcon();
	iconCS.image = "images/markers2/cs_marker_24.png";
	iconCS.shadow = "images/markers2/shadow50.png";
	iconCS.iconSize = new GSize(24, 34);
	iconCS.shadowSize = new GSize(37, 34);
	iconCS.iconAnchor = new GPoint(10, 17);
	iconCS.infoWindowAnchor = new GPoint(10, 1);



	// SET UP CASE STUDIES

	// add new case study: Pet Camp
	var marker1 = new GMarker(new GLatLng(37.74,-122.39), iconCS);
	marker1.tooltip = '<div class="tooltip">Click to view the case study for Pet Camp</div>';

	GEvent.addListener(marker1, "click", function() {
		window.open ('files/petcamp.pdf',"mywindow");	
	});
	map.addOverlay(marker1);
	GEvent.addListener(marker1,"mouseover", function() {
		showTooltip(marker1);
	});        
	GEvent.addListener(marker1,"mouseout", function() {
		tooltip.style.visibility="hidden"
	});        

	// add new case study: Sagan Piechota Architecture
	var marker2 = new GMarker(new GLatLng(37.78, -122.42), iconCS);
	marker2.tooltip = '<div class="tooltip">Click to view the case study for Sagan Piechota Architecture</div>';

	GEvent.addListener(map, "click", function(overlay,point) {
		if(map.getZoom() >= 15){
			return true;
		
		}

		mapWidth = map.getSize().width;
		mapHeight = map.getSize().height;

		nePnt = map.getBounds().getNorthEast();
		swPnt = map.getBounds().getSouthWest();
		
		diffLng = Math.abs(swPnt.lng() - nePnt.lng());
		diffLat = Math.abs(nePnt.lat() - swPnt.lat());
		
		latPixel = diffLng/mapWidth;
		lngPixel = diffLat/mapHeight;

		allowableLatOffset = latPixel*4;
		allowableLngOffset = lngPixel*4;

		if(point){
			// == Hit the database to find the records ==
			var minLat;
			var minLng;
			var curLat = point.lat();
			var curLng = point.lng();
			var foundOne = false;
			for(k = 0; k< installMarkers.length; k++){
				if((Math.abs(curLat - installMarkers[k].lat) < allowableLatOffset) && (Math.abs(curLng - installMarkers[k].lon)< allowableLngOffset)){
					var typeHtml = '';
					if( installMarkers[k].ej == 'Y'){ // ej is environ justice install
						typeHtml = 'Environmental Justice';
					}else if( installMarkers[k].t == '0'){ // typ 0 is normal install
						typeHtml = 'Residential';
					}else if( installMarkers[k].t == '1'){ // typ 1 is commercial funded
						typeHtml = 'Commercial';
					}else if( installMarkers[k].t == '2'){ // typ 1 is commercial funded
						typeHtml = 'NGO';
					}else if( installMarkers[k].t == '3'){ // typ 1 is commercial funded
						typeHtml = 'School/Library';
					}


					var markerHtml = createInstallMarkerHtml(
															 installMarkers[k].d, 		//size
															 installMarkers[k].c, 		//company
															 installMarkers[k].cl, 	//company link
															 installMarkers[k].src,  	//imageTxt
															 installMarkers[k].s,		//savings
															 installMarkers[k].o,		//output
															 installMarkers[k].q,		//quote
															 typeHtml,					//type
															 installMarkers[k].own,		//name of owner - business name
															 installMarkers[k].mon		//monitoring url
														);

					var monUrl = installMarkers[k].mon;
					if(monUrl.length>0){
						var maxContentDiv = document.createElement('div');
						maxContentDiv.innerHTML = '<iframe src ="'+installMarkers[k].mon+'" width="100%" height="700px"></iframe>';
						var maxTitle = "Solar Performance Monitoring";
						map.openInfoWindowHtml(point, markerHtml, {maxWidth:350, maxContent: maxContentDiv, maxTitle: maxTitle});
					}else{
						map.openInfoWindow(point, markerHtml, {maxWidth:350});
					}
					foundOne = true;
					break;
				}
			}
			
			if(!foundOne){
				for(k = 0; k< muniMarkers.length; k++){
					if((Math.abs(curLat - muniMarkers[k].lat) < allowableLatOffset) && (Math.abs(curLng - muniMarkers[k].lon)< allowableLngOffset)){
						//var myHtml = "The GPoint value is: " + minLat+", "+minLng + " at zoom level " + map.getZoom();
						
							var markerHtml = createMuniMarkerHtml(
																	muniMarkers[k].d, 		//size
																	muniMarkers[k].c, 		//company
																	muniMarkers[k].cl, 		//company link
																	muniMarkers[k].n,		//name of the location
																	muniMarkers[k].cs,		//case study for the location
																	muniMarkers[k].ph,		//location has a photo
																	muniMarkers[k].src		//source of the photos
																);

						
						map.openInfoWindow(point, markerHtml, {maxWidth:350});
						foundOne = true;
						break;
					}
				}
			}
			if(!foundOne){
				for(k = 0; k< obsMarkers.length; k++){
					if((Math.abs(curLat - obsMarkers[k].lat) < allowableLatOffset) && (Math.abs(curLng - obsMarkers[k].lon)< allowableLngOffset)){
						//var myHtml = "The GPoint value is: " + minLat+", "+minLng + " at zoom level " + map.getZoom();
				
						var markerHtml = createObsMarkerHtml(
																obsMarkers[k].n,		//name of the monitoring station
																obsMarkers[k].num 		//number of the monitoring station
															);

						map.openInfoWindow(point, markerHtml, {maxWidth:600});
						foundOne = true;
						break;
					}
				}
			}
			if(!foundOne){
				for(k = 0; k< swhInstalls.length; k++){
					if((Math.abs(curLat - swhInstalls[k].lat) < allowableLatOffset) && (Math.abs(curLng - swhInstalls[k].lng)< allowableLngOffset)){
						//var myHtml = "The GPoint value is: " + minLat+", "+minLng + " at zoom level " + map.getZoom();


						// createShwMarkerHtml(qty, colArea, storVol, nrgSavTherms,co2Sav, installer, installerUrl){

						//GLog.write(swhInstalls[k].q,swhInstalls[k].ca,swhInstalls[k].stvol,	swhInstalls[k].sthrm,swhInstalls[k].co2,swhInstalls[k].in,swhInstalls[k].curl);
					
						var markerHtml = createShwMarkerHtml(
																swhInstalls[k].q,		//quantity of the collectors
																swhInstalls[k].ca,		//collector area (ft2)
																swhInstalls[k].stvol,	//storage volume (gal)
																swhInstalls[k].sthrm,	//energy savings in therms
																swhInstalls[k].co2,		//C02 savings
																swhInstalls[k].c,		//installer name
																swhInstalls[k].cl		//installer url
																);
						map.openInfoWindow(point, markerHtml, {maxWidth:600});
						foundOne = true;
						break;
					}
				}
			}
		}

	});
	GEvent.addListener(marker2, "click", function() {
		window.open ('files/sagan_piechota.pdf',"mywindow");	
	});
	map.addOverlay(marker2);
	GEvent.addListener(marker2,"mouseover", function() {
		showTooltip(marker2);
	});        
	GEvent.addListener(marker2,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});

	// add new case study: The Rosebud Agency
	var marker3 = new GMarker(new GLatLng(37.769, -122.452), iconCS);
	marker3.tooltip = '<div class="tooltip">Click to view the case study for The Rosebud Agency</div>';
	GEvent.addListener(marker3, "click", function() {
		window.open ('files/Rosebud_final 8.18.07.pdf',"mywindow");	
	});
	map.addOverlay(marker3);
	GEvent.addListener(marker3,"mouseover", function() {
		showTooltip(marker3);
	});        
	GEvent.addListener(marker3,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});

	// add new case study: Clubbo Records
	var marker4 = new GMarker(new GLatLng(37.7438, -122.426), iconCS);
	marker4.tooltip = '<div class="tooltip">Click to view the case study for Clubbo Records</div>';
	GEvent.addListener(marker4, "click", function() {
		window.open ('files/Clubbo_final.pdf',"mywindow");	
	});
	map.addOverlay(marker4);
	GEvent.addListener(marker4,"mouseover", function() {
		showTooltip(marker4);
	});        
	GEvent.addListener(marker4,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        

	// add new case study: LGBT Center 
	var marker5 = new GMarker(new GLatLng(37.771750, -122.424048), iconCS);
	marker5.tooltip = '<div class="tooltip">Click to view the case study for the LGBT Center </div>';
	GEvent.addListener(marker5, "click", function() {
		window.open ('files/LGBT Center_final_2008.06.09.pdf',"mywindow");	
	});
	map.addOverlay(marker5);
	GEvent.addListener(marker5,"mouseover", function() {
		showTooltip(marker5);
	});        
	GEvent.addListener(marker5,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        

	// add new case study: British Motors 
	var marker6 = new GMarker(new GLatLng(37.784013, -122.421672), iconCS);
	marker6.tooltip = '<div class="tooltip">Click to view the case study for British Motors </div>';
	GEvent.addListener(marker6, "click", function() {
		window.open ('files/British Motors_final_2008.06.09.pdf',"mywindow");	
	});
	map.addOverlay(marker6);
	GEvent.addListener(marker6,"mouseover", function() {
		showTooltip(marker6);
	});
	GEvent.addListener(marker6,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        

	// add new case study: JumpSLIDE Networks 
	var marker7 = new GMarker(new GLatLng(37.754872, -122.411793), iconCS);
	marker7.tooltip = '<div class="tooltip">Click to view the case study for JumpSLIDE Networks </div>';
	GEvent.addListener(marker7, "click", function() {
		window.open ('files/JumpSLIDE_final_2008.06.09.pdf',"mywindow");	
	});
	map.addOverlay(marker7);
	GEvent.addListener(marker7,"mouseover", function() {
		showTooltip(marker7);
	});
	GEvent.addListener(marker7,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        

	// add new case study: Yoga Garden
	var marker8 = new GMarker(new GLatLng(37.771981, -122.436867), iconCS);
	marker8.tooltip = '<div class="tooltip">Click to view the case study for Yoga Garden</div>';
	GEvent.addListener(marker8, "click", function() {
		window.open ('files/Yoga Garden_final_ 2008.06.09.pdf',"mywindow");	
	});
	map.addOverlay(marker8);
	GEvent.addListener(marker8,"mouseover", function() {
		showTooltip(marker8);
	});
	GEvent.addListener(marker8,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        
	
	
	// add new case study: Sharon St
	var marker9 = new GMarker(new GLatLng(37.765200,-122.429500), iconCS);
	marker9.tooltip = '<div class="tooltip">Click to view the Castro Duplex case study</div>';
	GEvent.addListener(marker9, "click", function() {
		window.open ('files/SFSWH_57_Sharon_St_Case Study_final.pdf',"mywindow");	
	});
	map.addOverlay(marker9);
	GEvent.addListener(marker9,"mouseover", function() {
		showTooltip(marker9);
	});
	GEvent.addListener(marker9,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        
	
	
	// add new case study: Joe Cassidy
	var marker10 = new GMarker(new GLatLng(37.756700,-122.446800), iconCS);
	marker10.tooltip = '<div class="tooltip">Click to view the Joe Cassidy case study</div>';
	GEvent.addListener(marker10, "click", function() {
		window.open ('files/Joe_Cassidy_final.pdf',"mywindow");	
	});
	map.addOverlay(marker10);
	GEvent.addListener(marker10,"mouseover", function() {
		showTooltip(marker10);
	});
	GEvent.addListener(marker10,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        
	
	
	// add new case study: OpenHand
	var marker11 = new GMarker(new GLatLng(37.783800,-122.419000), iconCS);
	marker11.tooltip = '<div class="tooltip">Click to view the Project Open Hand case study</div>';
	GEvent.addListener(marker11, "click", function() {
		window.open ('files/OpenHand_final.pdf',"mywindow");	
	});
	map.addOverlay(marker11);
	GEvent.addListener(marker11,"mouseover", function() {
		showTooltip(marker11);
	});
	GEvent.addListener(marker11,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        
	
	
	// add new case study: Yoga Garden
	var marker12 = new GMarker(new GLatLng(37.7842,-122.4287), iconCS);
	marker12.tooltip = '<div class="tooltip">Click to view the St. Francis Square case study</div>';
	GEvent.addListener(marker12, "click", function() {
		window.open ('files/SFSWH_St_Francis_Square_Case_Study_final.pdf',"mywindow");	
	});
	map.addOverlay(marker12);
	GEvent.addListener(marker12,"mouseover", function() {
		showTooltip(marker12);
	});
	GEvent.addListener(marker12,"mouseout", function() {
		tooltip.style.visibility="hidden";
	});        
	
	
	
	
	
	


	// END OF ADD NEW CASE STUDY

	updateMarkers();

	GEvent.addListener(map, 'zoomend', function(){
		updateMarkers();
	});

	GEvent.addListener(map, 'moveend', function(){
		updateMarkers();
	});
	GEvent.addListener(map, 'zoomstart', function(){
		map.savePosition();
	});

	GEvent.addListener(map, 'movestart', function(){
		map.savePosition();
	});

}

function updateMarkers(){
	// start zoom is 13, max zoom is 19
	// show big markers after 15
	var mapBounds = map.getBounds();
	var curZoom = map.getZoom();
	var deleteMarkers = false;
	
	// show the small point markers in the legend
	if ((curZoom < 15) && (!showSmallMarkers)){
		//need to switch to small markers
		deleteMarkers = true;
		showSmallMarkers = true;
		jQuery('#legend').empty().append('<table border="0" width="240px" cellspacing="0" cellpadding="0" style="margin:0;padding:0;">'+
			'<tr><td colspan="2" class="marker" style="margin:0;padding:0;font-weight: bold;"><img src="images/spacer5.gif"/>Solar Installations</td></tr>'+
			'<tr><td class="marker"><img src="images/spacer5.gif"/><img id="marker-city" src="images/markers2/green8.gif" align="top" /><a href="http://www.sfenvironment.org/downloads/library/sfpuc_solar_map_presentation.pdf" target="_blank"> Municipal </a></td>'+
			'<td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/yellow8.gif" align="top" /> Residential </td></tr>'+
			'<tr><td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/pink8.gif" align="top" /> Commercial</td>'+
			'<td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/aqua8.gif" align="top" /> Schools/libraries</td></tr>'+
			'<tr><td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/blue8.gif" align="top" /> Non-profits</td><td class="marker"><img src="images/spacer5.gif"/><img id="marker-ej" src="images/markers2/red8.gif" align="top" /> <a href=\'http://sfwater.org/mto_main.cfm/MC_ID/12/MSC_ID/139/MTO_ID/360\' target=\'_blank\'>Monitoring stations </a></td></tr>'+
			'<tr><td colspan="2" class="marker"><img src="images/spacer5.gif"/><img id="marker-ej" src="images/markers2/orange8.gif" align="top" /> <a href="http://www.sfenvironment.org/our_programs/overview.html?ssi=1" target=\'_blank\'>Environmental Justice Program</a></td></tr>'+
			'<tr><td class="marker" style="padding-left:7px;" ><img src="images/markers/case_studies_marker_small.png" align="top" /> Case Study</td><td class="marker"><img src="images/spacer5.gif"/><img id="marker-ej" src="images/markers2/white8.gif" align="top" /> Solar Hot Water </td>  </tr>'+
			'<tr><td class="marker" style="padding-left:7px;" colspan="2"><a href="feedback_db.php?TB_iframe=true&amp;height=400&amp;width=600" title="Submit Sites" class="thickbox" style="color:green;">Don\'t see your solar installation on the map?</a></tr>'+
		'</table>');

	}else if((curZoom >= 15) && (showSmallMarkers)){
		//need to switch to big markers
		deleteMarkers = true;
		showSmallMarkers = false;
		jQuery('#legend').empty().append('<table border="0" width="240px" cellspacing="0" cellpadding="0" style="margin:0;padding:0;">'+
			'<tr><td colspan="2" class="marker" style="margin:0;padding:0;font-weight: bold;"><img src="images/spacer5.gif"/>Solar Installations</td></tr>'+
			'<tr><td class="marker"><img src="images/spacer5.gif"/><img id="marker-city" src="images/markers2/green_marker_15.png" align="top" /> <a href="http://www.sfenvironment.org/downloads/library/sfpuc_solar_map_presentation.pdf" target="_blank"> Municipal </a></td>'+
			'<td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/yellow_marker_15.png" align="top" /> Residential </td></tr>'+
			'<tr><td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/pink_marker_15.png" align="top" /> Commercial </td>'+
			'<td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/aqua_marker_15.png" align="top" /> Schools/libraries </td></tr>'+
			'<tr><td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/blue_marker_15.png" align="top" /> Non-profits </td><td class="marker"><img src="images/spacer5.gif"/><img id="marker-ej" src="images/markers2/red_marker_15.png" align="top" /> <a href=\'http://sfwater.org/mto_main.cfm/MC_ID/12/MSC_ID/139/MTO_ID/360\' target=\'_blank\'>Monitoring stations</a></td></tr>'+
			'<tr><td colspan="2" class="marker"><img src="images/spacer5.gif"/><img id="marker-ej" src="images/markers2/orange_marker_15.png" align="top" /> <a href="http://www.sfenvironment.org/our_programs/overview.html?ssi=1" target=\'_blank\'>Environmental Justice Program</a></td></tr>'+
			'<tr><td class="marker" style="padding-left:7px;"><img src="images/markers/case_studies_marker_small.png" align="top" /> Case Study</td><td class="marker"><img src="images/spacer5.gif"/><img id="marker-owner" src="images/markers2/white_marker_15.png" align="top" /> Solar Hot Water </td></tr>'+
			'<tr><td class="marker" style="padding-left:7px;" colspan="2"><a href="feedback_db.php?TB_iframe=true&amp;height=400&amp;width=600" title="Submit Sites" class="thickbox" style="color:green;">Don\'t see your solar installation on the map?</a></tr>'+
		'</table>');
	}

	// clear the current marker class on the map when you zoom to a specific place
	if(deleteMarkers){
		for(k in existingMarkers){
			map.removeOverlay(existingMarkers[k]);
			delete existingMarkers[k];
		}
		for(k in existingMuniMarkers){
			map.removeOverlay(existingMuniMarkers[k]);
			delete existingMuniMarkers[k];
		}
		for(k in existingObsMarkers){
			map.removeOverlay(existingObsMarkers[k]);
			delete existingObsMarkers[k];
		}
		for(k in existingSwhMarkers){
			map.removeOverlay(existingSwhMarkers[k]);
			delete existingSwhMarkers[k];
		}
		
	}

	// clear the current marker class on the map that are not in the current extent
	for(k in existingMarkers){
		if(!mapBounds.contains(existingMarkers[k].getPoint())){
			map.removeOverlay(existingMarkers[k]);
			delete existingMarkers[k];
		}
	}
	for(k in existingMuniMarkers){
		if(!mapBounds.contains(existingMuniMarkers[k].getPoint())){
			map.removeOverlay(existingMuniMarkers[k]);
			delete existingMuniMarkers[k];
		}
	}
	for(k in existingObsMarkers){
		if(!mapBounds.contains(existingObsMarkers[k].getPoint())){
			map.removeOverlay(existingObsMarkers[k]);
			delete existingObsMarkers[k];
		}
	}
	for(k in existingSwhMarkers){
		if(!mapBounds.contains(existingSwhMarkers[k].getPoint())){
			map.removeOverlay(existingSwhMarkers[k]);
			delete existingSwhMarkers[k];
		}
	}

	/**
		Type: 
		0:  Residential Install --> Yellow
		1:  Commercial install 	--> Pink
		2:  NGO facility	--> Blue
		3:  School		--> Aqua
		ej: Enviro Justice	--> Orange
	*/
if(curZoom >= 15){
	for(k = 0; k< installMarkers.length; k++){
		var latlng = new GLatLng( installMarkers[k].lat, installMarkers[k].lon);
		if(!existingMarkers[k] && mapBounds.contains(latlng)){
			var newIcon = null;
			var typeHtml = '';
			if( installMarkers[k].ej == 'Y'){ // ej is environ justice install
				newIcon =  (showSmallMarkers) ? iconOrangePnt : iconOrangeBig;
				typeHtml = 'Environmental Justice';
			}else if( installMarkers[k].t == '0'){ // typ 0 is normal install
				newIcon =  (showSmallMarkers) ? iconYellowPnt : iconYellowBig;
				typeHtml = 'Residential';
			}else if( installMarkers[k].t == '1'){ // typ 1 is commercial funded
				newIcon =  (showSmallMarkers) ? iconPinkPnt : iconPinkBig;
				typeHtml = 'Commercial';
			}else if( installMarkers[k].t == '2'){ // typ 1 is commercial funded
				newIcon =  (showSmallMarkers) ? iconBluePnt : iconBlueBig;
				typeHtml = 'NGO';
			}else if( installMarkers[k].t == '3'){ // typ 1 is commercial funded
				newIcon =  (showSmallMarkers) ? iconAquaPnt : iconAquaBig;
				typeHtml = 'School/Library';
			}else{ // else --> typ 2 would be city facility
				newIcon =  (showSmallMarkers) ? iconGreenPnt : iconGreenBig;
			}

//createMarker(lon, lat, size, installer, coLink, iconName, imageTxt, savings, output, ownerQuote, typeHtml, ownerName, monUrl)
			existingMarkers[k] = createMarker(
										 installMarkers[k].lon, 	//lon
										 installMarkers[k].lat, 	//lat
										 installMarkers[k].d, 		//size
										 installMarkers[k].c, 		//company
										 installMarkers[k].cl, 	//company link
										newIcon, 		//iconName
										installMarkers[k].src, // installMarkers[k].img,  	//imageTxt
										 installMarkers[k].s,		//savings
										 installMarkers[k].o,		//output
										 installMarkers[k].q,		//quote
										 typeHtml,					//type
										 installMarkers[k].own,		//name of owner - business name
										 installMarkers[k].mon		//monitoring url
										);	
			map.addOverlay(existingMarkers[k]);
		}
	}
	// Add the muni markers
	for(k = 0; k< muniMarkers.length; k++){
		var latlng = new GLatLng( muniMarkers[k].lat, muniMarkers[k].lon);
		if(!existingMuniMarkers[k] && mapBounds.contains(latlng)){
			var muniIcon = (showSmallMarkers) ? iconGreenPnt : iconGreenBig;
			existingMuniMarkers[k] = createMuniMarker(
										muniMarkers[k].lon, 	//lon
										muniMarkers[k].lat, 	//lat
										muniMarkers[k].d, 		//size
										muniMarkers[k].c, 		//company
										muniMarkers[k].cl, 		//company link
										muniIcon, 				//iconName
										muniMarkers[k].n,		//name of the location
										muniMarkers[k].cs,		//case study for the location
										muniMarkers[k].ph,		//location has a photo
										muniMarkers[k].src		//source of the photo
										);	
			map.addOverlay(existingMuniMarkers[k]);
		}
	}
	// Add the observation markers
	for(k = 0; k< obsMarkers.length; k++){
		var latlng = new GLatLng( obsMarkers[k].lat, obsMarkers[k].lon);
		if(!existingObsMarkers[k] && mapBounds.contains(latlng)){
			var obsIcon = (showSmallMarkers) ? iconRedPnt : iconRedBig;
			existingObsMarkers[k] = createObsMarker(
										obsMarkers[k].lon, 	//lon
										obsMarkers[k].lat, 	//lat
										obsMarkers[k].n,		//name of the monitoring station
										obsMarkers[k].num, 		//number of the monitoring station
										obsIcon
										);	
			map.addOverlay(existingObsMarkers[k]);
		}
	}
		// Add the observation markers
		for(k = 0; k< swhInstalls.length; k++){
			var latlng = new GLatLng( swhInstalls[k].lat, swhInstalls[k].lng);
			if(!existingSwhMarkers[k] && mapBounds.contains(latlng)){
				var swhIcon = (showSmallMarkers) ? iconWhitePnt : iconWhiteBig;
				existingSwhMarkers[k] = createSwhMarker(
											swhInstalls[k].lng, 	//lon
											swhInstalls[k].lat, 	//lat
											swhIcon,
											swhInstalls[k].q,		//quantity of the collectors
											swhInstalls[k].ca,		//collector area (ft2)
											swhInstalls[k].stvol,	//storage volume (gal)
											swhInstalls[k].sthrm,	//energy savings in therms
											swhInstalls[k].co2,		//C02 savings
											swhInstalls[k].c,		//installer name
											swhInstalls[k].cl		//installer url
											);	
				map.addOverlay(existingSwhMarkers[k]);
			}
	}
	
	
}
}

						//longitude, lat, size, company, companyLink, iconName, imageTxt, savings, output, quote
function createMuniMarker(lon, lat, size, installer, coLink, iconName, locName, caseStudy, hasPhoto, photoSrc){
	var marker = new GMarker(new GLatLng(lat, lon), {icon: iconName});

	//System size: 1.7 kW
	//System output: 330 kWh/year
	//Electric savings: $200/year
	//Installer: ABC installer (hyperlink to url)
	//
	//System owner says: “I love solar!”
	//[photo inserted, if available]
	var markerHtml = createMuniMarkerHtml(size, installer, coLink, locName, caseStudy, hasPhoto, photoSrc);
//GLog.write(existingHtml);
	GEvent.addListener(marker, 'click', function(){
		marker.openInfoWindowHtml(markerHtml, {maxWidth:350});
	});

	return marker;
}

function createMuniMarkerHtml(size, installer, coLink, locName, caseStudy, hasPhoto, imageTxt){
	var sizeOutput = (size != 'unk') ? "System size: " + size +" kW <br/>": "The system size has not been reported<br/>";
	//var outputOutput = (output.length>0) ? "System output: " + output +"<br/>": "";
	//var savingsOutput = (savings.length>0) ? "Electric savings: " + savings +"<br/>": "";
	var coHtml = (coLink.length>0) ? '<a class= "cont-link" href="'+coLink+'" target="_blank">'+installer+'</a>' : installer;
	var installerOutput = (installer) ? "Installer: " + coHtml +"<br/><br/>": "<br/>";
	var caseStudyOutput = (caseStudy) ? "<a class= 'cont-link' href='"+caseStudy+"' target='_blank'>Read about this installation</a>": "";
				 
	var imageOutput = '';
	if(imageTxt.length > 0){
		if(imageTxt.indexOf('http') >=0){
			imageOutput = '<a  class= "cont-link" href="'+imageTxt+'" target="_blank">view photos</a>'		
		
		}else{
			var temp = new Array();
			temp = imageTxt.split('&');
			imageOutput = '<img width="300px" height="'+temp[1]+'" src="photos/'+temp[0]+'.jpg"/>';
		}
	}

	//var quoteOutput = (ownerQuote.length>0) ? 'System owner says: <span class="owner-quote" > '+ownerQuote+'</span><br/>': '';
				 
	//var imageOutput = '';
	//if(imageTxt.length > 0){
	//	var temp = new Array();
	//	temp = imageTxt.split('&');
	//	imageOutput = '<img width="300px" height="'+temp[1]+'" src="photos/'+temp[0]+'.jpg"/>';
	//}
	var existingHtml = "<div id=\"table-address\">"+locName+"</div>"+sizeOutput+installerOutput+caseStudyOutput+imageOutput;

	return existingHtml;
}


function createObsMarker(lon, lat, n, num, iconName){
	var marker = new GMarker(new GLatLng(lat, lon), {icon: iconName});

	
	
	var markerHtml = createObsMarkerHtml(n, num);

	GEvent.addListener(marker, 'click', function(){
		marker.openInfoWindowHtml(markerHtml, {maxWidth:600});
	});

	return marker;
}

// =========== Create Install Marker HTML ===================
function createObsMarkerHtml(n, num){
	var imageOutput = (num) ? '<div style="height:350px;overflow: auto;"> <div height="700px"><img width="550px" height="360px" src="http://sfwater.org/files/powerpolicy/SolarMonitoring/WeeklyOutput_1'+num+'.png" />'+
					'<br/><br/><img width="550px" height="360px" src="http://sfwater.org/files/powerpolicy/SolarMonitoring/MonthlyOutput_1'+num+'.png" /></div></div>': '<a class= "cont-link" href="http://sfwater.org/detail.cfm/MC_ID/12/MSC_ID/139/MTO_ID/360/C_ID/1888" target="_blank">Get additional information on monitoring stations</a>';
	//if(imageTxt.length > 0){
	//	var temp = new Array();
	//	temp = imageTxt.split('&');
	//	imageOutput = '<img width="300px" height="'+temp[1]+'" src="photos/'+temp[0]+'.jpg"/>';
	//}
	var existingHtml = "<div id=\"table-address\">"+n+"</div>"+imageOutput;
	return existingHtml;


}
function createSwhMarker(lon, lat, iconName, qty, colArea, storVol, nrgSavTherms,co2Sav, installer, installerUrl){
	var marker = new GMarker(new GLatLng(lat, lon), {icon: iconName});

	
	
	var markerHtml = createShwMarkerHtml(qty, colArea, storVol, nrgSavTherms,co2Sav, installer, installerUrl);

	GEvent.addListener(marker, 'click', function(){
		marker.openInfoWindowHtml(markerHtml, {maxWidth:600});
	});

	return marker;
}


// =========== Create Install Marker HTML ===================
function createShwMarkerHtml(qty, colArea, storVol, nrgSavTherms,co2Sav, installer, installerUrl){
	// set up the text for the solar hot water marker

	sizeRows = '';
	if(qty.length > 0 || colArea.length > 0 || storVol.length > 0){
		setFirst = false; // flag to add a header row for the size
		if(qty.length > 0){
			sizeRows = sizeRows+'<tr><td>System Size:</td><td>'+qty+' collectors</td></tr>';
			setFirst = true;		
		}
		if(colArea.length > 0){
			if(!setFirst){
				sizeRows = sizeRows+'<tr><td>System Size:</td><td>'+parseInt(colArea)*parseInt(qty)+' sq feet</td></tr>';
				setFirst = true;		
			}else{
				sizeRows = sizeRows+'<tr><td></td><td>'+parseInt(colArea)*parseInt(qty)+' sq feet</td></tr>';
			}
		}
		if(storVol.length > 0){
			if(!setFirst){
				sizeRows = sizeRows+'<tr><td>System Size:</td><td>'+parseInt(storVol)+' gallons</td></tr>';
				setFirst = true;		
			}else{
				sizeRows = sizeRows+'<tr><td></td><td>'+parseInt(storVol)+' gallons</td></tr>';
			}
		}
	}
	savRow = '';
	if(nrgSavTherms.length > 0){
		savRow = '<tr><td>Estimated Savings:</td><td>'+parseInt(nrgSavTherms)+' therms/yr</td></tr>';
	}
	co2SavRow = '';
	if(co2Sav.length > 0){
		co2SavRow = '<tr><td>Estimated CO2<br/> Emissions Savings:</td><td>'+parseInt(co2Sav)+' lbs/yr</td></tr>';
	}
	installerRow = '';	
	if(installer.length > 0){
		if(installerUrl.length > 0){
			installerRow = '<tr><td>Installer:</td><td><a class= "cont-link" href="'+installerUrl+'" target="_blank">'+installer+' </a></td></tr>';
		}else{
			installerRow = '<tr><td>Installer:</td><td>'+installer+'</td></tr>';
		}
	}	
		
	outTable = '<table>'+sizeRows+savRow+installerRow+co2SavRow+'</table>';
		

	var existingHtml = "<div id=\"table-address\">Solar Water Heating Installation</div>"+outTable;
	return existingHtml;


}
// =========== Create Install Marker HTML ===================
function createInstallMarkerHtml(size, installer, coLink, imageTxt, savings, output, ownerQuote, typeHtml, ownerName, monUrl){
	
	var sizeOutput = (size != 'unk') ? "System size: " + size +" kW <br/>": "The system size has not been reported<br/>";
	var outputOutput = (output.length>0) ? "System output: " + output +"<br/>": "";
	var savingsOutput = (savings.length>0) ? "Electric savings: " + savings +"<br/>": "";
	var coHtml = (coLink.length>0) ? '<a class= "cont-link" href="'+coLink+'" target="_blank">'+installer+'</a>' : installer;
	var installerOutput = (installer) ? "Installer: " + coHtml +"<br/><br/>": "<br/>";
	var ownerOutput = (ownerName) ? "Location: " + ownerName +"<br/>": "";
				 
	var quoteOutput = (ownerQuote.length>0) ? 'System owner says: <span class="owner-quote" > '+ownerQuote+'</span><br/>': '';
	
	var monitoringOutput = (monUrl.length>0)? '<br/><a class= "cont-link"  href=\'javascript:maxThis();\'>View monitoring information</a>':'';
	
	var imageOutput = '';
	if(imageTxt.length > 0){
		if(imageTxt.indexOf('http') >=0){
			imageOutput = '<a  class= "cont-link" href="'+imageTxt+'" target="_blank">view photos</a>'		
		
		}else{
			var temp = new Array();
			temp = imageTxt.split('&');
			imageOutput = '<img width="300px" height="'+temp[1]+'" src="photos/'+temp[0]+'.jpg"/>';
		}
	}

	var existingHtml = "<div id=\"table-address\">Current "+typeHtml+" Solar Install</div>"+ownerOutput+sizeOutput+outputOutput+savingsOutput+installerOutput+quoteOutput+imageOutput+monitoringOutput;
	return existingHtml;
}

function maxThis(){
	map.getInfoWindow().maximize();
}


window.onresize = handleResize;
//window.onload = init;

var PromoControl = function(url) {
	this.url_ = url;
};

PromoControl.prototype = new GControl(true);

PromoControl.prototype.initialize = function(map) {
	var container = document.createElement("a");
	addClass(container, 'gmnoprint');
	container.innerHTML = '<img  class="fixpng" style="cursor:pointer" src="images/g70_logo.png" style="BORDER-RIGHT: 0px; PADDING-RIGHT: 0px; BORDER-TOP: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; BORDER-LEFT: 0px; WIDTH: 27px; CURSOR: pointer; PADDING-TOP: 0px; BORDER-BOTTOM: 0px; HEIGHT: 25px" border="0" >';
	container.style.width='27px';
	//container.style.height='34.5333px';
	
	url = this.url_;
	
	GEvent.addDomListener(container, "click", function() {
		document.location = "http://www.group70int.com";
	});
	
	map.getContainer().appendChild(container);
	
	return container;
};

PromoControl.prototype.getDefaultPosition = function() {
	return new GControlPosition(G_ANCHOR_BOTTOM_LEFT, new GSize(70, 0));
};

function addClass(element, value) {
	if (!element.className) {
		element.className = value;
	} else {
		var newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}

function deleteBuildingMarkers(){
	for(k in buildingMarkers){
		map.removeOverlay(buildingMarkers[k]);
		delete buildingMarkers[k];
	}
}

function setSmallMarker(lat, lon, address, sqft, polyTxt, sta, zip, pctUsable, usedSafe, bldgCount, mapblklot){
	var point = new GLatLng(lat,lon);
	var curMarker = new GMarker(point, iconSmallSun);
	//map.addOverlay(curMarker);

	// estimate the mean roof kW used for the CPE
	// formulas actually reside in function getMarkerHtml
	//		var kwL = Math.round((rfsq/200)/4);
	//		var kwH = Math.round((rfsq/100)/4);
	if(usedSafe == 1){
		//var maxKw = Math.round((safeArea/100)/4);
		var maxKw = Math.round(sqft * pctUsable/100);
		
	}else{
		var maxKw = Math.round((sqft/100)/4);
	}

	// clean power estimator max
	var maxContentDiv = document.createElement('div');
	maxContentDiv.innerHTML = 'Loading';
	var maxTitle = "Clean Power Estimate";
	var markerText = '<div id="table-address">'+address+'<sup>**</sup></div>'+getMarkerHtml(sqft, sta, pctUsable, usedSafe, bldgCount, mapblklot, zip); //+'<div id="table-address"><span id=\'assumptions\'>assumptions</span><span id=\'close\'>close window and zoom out</span></div>';

	var iw = map.getInfoWindow();
	GEvent.addListener(iw, "maximizeclick", function() {
		maxContentDiv.innerHTML = '<iframe src="cpe/cpe.php?address='+address+'&maxKw='+maxKw+'&zip='+zip+'" width="100%" height="800px" id="cpe-frame"></iframe>';
	});

	GEvent.addListener(curMarker, 'click', function(){
		curMarker.openInfoWindowHtml(markerText, {maxWidth:450, maxContent: maxContentDiv, maxTitle: maxTitle});
	});
	
	return curMarker;
}

function viewBldgs(mapblklot, radStationId, zip){
	jQuery.ajax({
		type: "POST",
		url: "buildingInfo_v24pg.php",
		data: "value="+mapblklot,
		success: function(msg){
			deleteBuildingMarkers();
			var c = 0;
			jQuery(msg).find('item').each(function(nr){
				buildingMarkers[c] = setSmallMarker(jQuery('lat', this).text(), jQuery('lon', this).text(), '', jQuery('sqft', this).text(), '', radStationId, zip, jQuery('pct', this).text(), 1, 1, mapblklot);
				map.addOverlay(buildingMarkers[c]);
				c=c+1;
				//alert(jQuery('bid', this).text());
				//outText += '<li class="maplink" rel="'+jQuery('value', this).text() +'" dir="'+nr+'">'+ jQuery('value', this).text() +'</li>';
			});


		}
	});
}

function getMarkerHtml(rawsqft, radStationId, myPctUsable, myUsedSafe, bldgCount, mapblklot, zip){

	if((rawsqft.length > 0) && (parseInt(rawsqft)>0)){
	
		if(myUsedSafe == 1){
			rfsq = Math.round(rawsqft * myPctUsable);
			if(parseInt(bldgCount)>1){
				areaHtml = '<tr><td>Total Roof Size:</td><td>'+Math.round(rawsqft)+' ft<sup>2</sup> (Usable Roof: '+rfsq+' ft<sup>2</sup>)</td></tr>';
			}else{
				areaHtml = '<tr><td>Roof Size:</td><td>'+Math.round(rawsqft)+' ft<sup>2</sup> (Usable Roof: '+rfsq+' ft<sup>2</sup>)</td></tr>';
			}
		}else{
			rfsq = Math.round(rawsqft);
			areaHtml = '  <tr><td>Roof Size:</td><td>'+rfsq+' ft<sup>2</sup></td></tr>';
		}
	
		var solarIns = 5;
		switch (radStationId){
		case "SF01":
			solarIns = 4.2;
			break;
		case "SF02":
			solarIns = 4.6;
			break;
		case "SF03":
			solarIns = 4.6;
			break;
		case "SF04":
			solarIns = 4.1;
			break;
		case "SF05":
			solarIns = 4.6;
			break;
		case "SF06":
			solarIns = 4.6;
			break;
		case "SF07":
			solarIns = 4.2;
			break;
		case "SF08":
			solarIns = 4.5;
			break;
		case "SF09":
			solarIns = 4.6;
			break;
		case "SF10":
			solarIns = 4.5;
			break;
		case "SF11":
			solarIns = 4.6;
			break;
		}	
	
		//Solar PV Potential 
		//kW (low estimate) = Math.round((roofSize/100)/4)
		//kW (high estimate) = Math.round((roofSize/50)/4)
		var kwL = Math.round((rfsq/200)*0.7);  // remove form 
		var kwH = Math.round((rfsq/100)*0.7);

		//Annual Electricity Produced 
		//KWh/year = kW*5*(.60 x 365)
		var kwYearH = kwH*solarIns*365*0.77; // multiply *.77
		var kwYearL = kwL*solarIns*365*0.77;

		//Annual Electricity Savings 
		//$/year = (kW x 1461)*0.11430
		// 06/26/08 - changed from 0.11430 to 0.16474 per Jason's request
		var dolYrH = (kwH * solarIns * 365*0.77)*0.16474;
		var dolYrL = (kwL * solarIns * 365*0.77)*0.16474;

		//Annual Carbon Savings 
		//lbs. CO2/year =1812*kWh
		var lbsCO2YearH =0.746*(kwH*solarIns*365*0.77);
		var lbsCO2YearL =0.746*(kwL*solarIns*365*0.77);

		bldgHtml = '';
		if(parseInt(bldgCount)>1){
			bldgHtml = '<tr><td colspan=2  ALIGN="center"><a href="#" style="color:#2264C2;;font-size:11px;" onclick="viewBldgs(\''+mapblklot+'\', \''+radStationId+'\', \''+zip+'\');">View estimates for each of the '+bldgCount+' buildings on this parcel</a></td></tr>  <tr><td>&nbsp;</td><td>&nbsp;</td></tr>';
		}



		output = '<table>'+
				 '  <tr><td colspan=2 style="font-weight:bold;">My Solar Potential</td></tr>'+
				 '  <tr><td colspan=2 ><hr/></td></tr>'+areaHtml+
				 '  <tr><td>Estimated solar PV potential: </td><td>'+kwL+' kW</td></tr>'+
				 '  <tr><td>Estimated electricity produced: </td><td>'+kwYearL.toFixed(0)+' kWh/yr<sup>a</sup></td></tr>'+
				 '  <tr><td>Estimated electricity savings: </td><td>$'+dolYrL.toFixed(0)+' per year<sup>a</sup></td></tr>'+
				 '  <tr><td>Estimated carbon savings: </td><td>'+lbsCO2YearL.toFixed(0)+' lbs per year<sup>a</sup></td></tr>'+
				 '  <tr><td COLSPAN=2 ALIGN="center"><font style="color:gray;font-size:10px;"><sup>a</sup> Assumes '+solarIns+' average peak sun-hours per day</font></td></tr>'+
				 '  <tr><td>&nbsp;</td><td>&nbsp;</td></tr>'+
		// take the next step		 '  <tr><td COLSPAN=2 ALIGN="center" ><a id="nextstep" onclick="nextStep();" href="#" title="nextstep" class="thickbox">Take the next step</a></td></tr>'+
					bldgHtml+
				'</table>'+
				 '<div class="hr"></div><span class="infowin">'+
					'<a href=\'javascript:maxThis();\' ><span style="font-weight:bold;font-size:12px;">Get Cost Estimates >></span></a><br/>'+
					'<hr/>'+
					'<br/><span style="font-weight:bold;font-size:12px;">Links</span>'+
					'<hr/>'+
					'<a href="http://www.gosolarcalifornia.ca.gov/retailers/search-new.php" target="_blank">Find a solar installer</a><br/>'+
					'<a href="http://www.sfenvironment.org/our_programs/interests.html?ssi=6&ti=15&ii=63" target="_blank">More information</a> about installing solar <br/>'+
					'<br/>'+
					'<span style="color:red;">*</span><a onclick="showWin(\'disclaimer\');">Disclaimer</a><span style="color:red;">*</span> <br/>'+
					'Map locations are approximate<br/>'+
					'<a onclick="showWin(\'estimates\');">Find out how we estimated your solar potential</a></span>';
	}else{
		output = '<div>Unfortunately, information for this address <br/>is currently not available.  Please try a different<br/> address or contact <a class="sf-env" href="http://www.sfenvironment.org/our_programs/interests.html?ssi=6&ti=15&ii=63" target="_blank"> SF Environment </a> for more <br/>information about this location.</div>'+
				 '<div class="hr"></div><span class="infowin"><br/>'+
					'<a href="http://www.gosolarcalifornia.ca.gov/database/" target="_blank">Click here </a>to find a solar installer <br/>'+
					'<a href="http://www.sfenvironment.org/our_programs/interests.html?ssi=6&ti=15&ii=63" target="_blank">Click here </a>for more information on installing solar <br/>'+
					'<br/>'+
					'<a onclick="showWin(\'estimates\');">How the estimates were derived</a> &nbsp;&nbsp;----&nbsp;&nbsp; <a onclick="showWin(\'disclaimer\');">Disclaimer</a> <br/>'+
					'** Map locations are approximate</span>';

//					'<a href=\'javascript:maxThis();\'>Click here </a>for a more detailed estimate <br/>'+


	}
	return output;
}

function showWin(page){
	switch(page){
		case 'nextStep':
			sendTo = 'http://www2.sfenvironment.org/aboutus/energy/solarsf/how_checklist.htm?TB_iframe=true&amp;height=400&amp;width=700';
			pageTitle = 'Take the next step';
			break;
		case 'disclaimer':
			sendTo = 'disclaimers.html?TB_iframe=true&amp;height=400&amp;width=600';
			pageTitle = 'Disclaimers';
			break;
		case 'estimates':
			sendTo = 'estimates_v2.html?TB_iframe=true&amp;height=400&amp;width=600';
			pageTitle = 'How estimates were derived';
			break;
	}

	tb_show(pageTitle, sendTo, null);


}

function nextStep(){
	tb_show('Take the next step', 'http://www2.sfenvironment.org/aboutus/energy/solarsf/how_checklist.htm?TB_iframe=true&amp;height=400&amp;width=700', null);
}


function showCaseStudy(filename){
	 window.open ('files/'+filename,"mywindow");
	//tb_show('caseStudy', 'petcamp.pdf?TB_iframe=true&amp;height=600&amp;width=600', null);
}
						//longitude, lat, size, company, companyLink, iconName, imageTxt, savings, output, quote
function createMarker(lon, lat, size, installer, coLink, iconName, imageTxt, savings, output, ownerQuote, typeHtml, ownerName, monUrl){

	var marker = new GMarker(new GLatLng(lat, lon), {icon: iconName});

	//System size: 1.7 kW
	//System output: 330 kWh/year
	//Electric savings: $200/year
	//Installer: ABC installer (hyperlink to url)
	//
	//System owner says: “I love solar!”
	//[photo inserted, if available]

	//if(size != 'unk'){
	//	//var eleOutput = output;
	//	//var eleSavings = Math.round((size * 1461)*0.11430);
	//	existingHtml = existingHtml + "System size: "+size+" kW <br /> System output: "+output+" kWh/yr <br/> Electric savings: $"+eleSavings+"/yr <br/> Installer: "+ installer +"<br/><br/>"+imageTxt;
	//} else {
	//	existingHtml = existingHtml + "<div>The system size at this location is unknown<br/> Installer: "+ installer +"<br/><br/>"+imageTxt+"</div>";
	//}
	var markerHtml = createInstallMarkerHtml(size, installer, coLink, imageTxt, savings, output, ownerQuote, typeHtml, ownerName, monUrl);

	if(monUrl.length>0){
		var maxContentDiv = document.createElement('div');
		maxContentDiv.innerHTML = '<iframe src ="'+monUrl+'" width="100%" height="700px"></iframe>';
		var maxTitle = "Solar Performance Monitoring";
	}
	
	//var iw = map.getInfoWindow();
	//GEvent.addListener(iw, "maximizeclick", function() {
	//	GDownloadUrl(monUrl, function(data) {
	//		maxContentDiv.innerHTML = data;
	//	});
	//});

	GEvent.addListener(marker, 'click', function(){
		if(monUrl.length>0){
			marker.openInfoWindowHtml(markerHtml, {maxWidth:350, maxContent: maxContentDiv, maxTitle: maxTitle});
		}else{
			marker.openInfoWindowHtml(markerHtml, {maxWidth:350});
		}
	});

	return marker;
}







// ====== This function displays the tooltip ======
// it can be called from an icon mousover or a side_bar mouseover
function showTooltip(marker) {
	tooltip.innerHTML = marker.tooltip;
	var point=map.getCurrentMapType().getProjection().fromLatLngToPixel(map.fromDivPixelToLatLng(new GPoint(0,0),true),map.getZoom());
	var offset=map.getCurrentMapType().getProjection().fromLatLngToPixel(marker.getPoint(),map.getZoom());
	var anchor=marker.getIcon().iconAnchor;
	var width=marker.getIcon().iconSize.width;
	var height=tooltip.clientHeight;
	var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(offset.x - point.x - anchor.x + width, offset.y - point.y -anchor.y -height)); 
	pos.apply(tooltip);
	tooltip.style.visibility="visible";
}

function setMapType(type){
	 var mt = map.getMapTypes();
	 map.setMapType(mt[type]);
}
function resetMap(){
	map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}