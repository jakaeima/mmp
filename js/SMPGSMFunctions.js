	var map;
	var geoXml;
	var theErrMsg = "";
	var iconEN;
	var iconPL;
	var iconSO;
	var iconWA;
	var iconWI;
	var iconRE;
	var iconBL;
	var iconMarker;
	var geocoder;
	var xmldata;
	var gsmMarkerCluster;
	var markerBounds = new GLatLngBounds();
	var markers = new Array();
		
    iconEN = new GIcon();
	iconEN.image = "images/icons/energy.png";
	//iconEN.shadow = "images/icons/shadow50.png";
	iconEN.iconSize = new GSize(25, 25);
	//iconEN.shadowSize = new GSize(37, 34);
	iconEN.iconAnchor = new GPoint(10, 17);
	iconEN.infoWindowAnchor = new GPoint(10, 1);
	
	iconPL = new GIcon();
	iconPL.image = "images/icons/power.png";
	//iconPL.shadow = "images/icons/shadow50.png";
	iconPL.iconSize = new GSize(30, 30);
	//iconPL.shadowSize = new GSize(37, 34);
	iconPL.iconAnchor = new GPoint(10, 17);
	iconPL.infoWindowAnchor = new GPoint(10, 1);
	
	iconSO = new GIcon();
	iconSO.image = "images/icons/solar.png";
	//iconSO.shadow = "images/icons/shadow50.png";
	iconSO.iconSize = new GSize(25, 25);
	//iconSO.shadowSize = new GSize(37, 34);
	iconSO.iconAnchor = new GPoint(10, 17);
	iconSO.infoWindowAnchor = new GPoint(10, 1);
	
	iconWA = new GIcon();
	iconWA.image = "images/icons/water.png";
	//iconWA.shadow = "images/icons/shadow50.png";
	iconWA.iconSize = new GSize(30, 30);
	//iconWA.shadowSize = new GSize(37, 34);
	iconWA.iconAnchor = new GPoint(10, 17);
	iconWA.infoWindowAnchor = new GPoint(10, 1);
	
	iconWI = new GIcon();
	iconWI.image = "images/icons/wind.png";
	//iconWI.shadow = "images/icons/shadow50.png";
	iconWI.iconSize = new GSize(30, 30);
	//iconWI.shadowSize = new GSize(37, 34);
	iconWI.iconAnchor = new GPoint(10, 17);
	iconWI.infoWindowAnchor = new GPoint(10, 1);
	
	iconRE = new GIcon();
	iconRE.image = "images/icons/resource.png";
	//iconRE .shadow = "images/icons/shadow50.png";
	iconRE.iconSize = new GSize(30, 30);
	//iconRE .shadowSize = new GSize(37, 34);
	iconRE.iconAnchor = new GPoint(10, 17);
	iconRE.infoWindowAnchor = new GPoint(10, 1);
	
	iconBL = new GIcon();
	iconBL.image = "images/icons/bldg.png";
	//iconRE .shadow = "images/icons/shadow50.png";
	iconBL.iconSize = new GSize(25, 25);
	//iconRE .shadowSize = new GSize(37, 34);
	iconBL.iconAnchor = new GPoint(10, 17);
	iconBL.infoWindowAnchor = new GPoint(10, 1);

	function initialize() {
		YAHOO.gsm.container.panel4 = new YAHOO.widget.Panel("panel4", { width:"600px", visible:true, constraintoviewport:true, fixedcenter:true, modal:true } );
		YAHOO.gsm.container.panel4.render();
      if (GBrowserIsCompatible()) {
        //loadTheXML();
        loadTheMap();
        if (map.isLoaded()) {
          //loadTheXML();
          searchMarkers("init");
          //Default vendor value = "All"
          document.getElementById("vendormenuval").value="C00";
          
        } else {
          //alert(map.isLoaded());
        }
        geocoder = new GClientGeocoder();
      }
    }
    
	function loadTheXML() {
          GDownloadUrl("G70.xml", function(data) {
          xmldata = GXml.parse(data);
         });
    }
    
    function loadTheMap() {
    	handleResize();
        map = new GMap2(document.getElementById("map_canvas"));
        //map.addControl(new GLargeMapControl3D());
        //var topRight = new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(0,0));
        map.addControl(new GOverviewMapControl());
        map.addControl(new PromoControl());
        map.setCenter(new GLatLng(21.485, -157.9), 2);
        //map.setUIToDefault();
        map.enableScrollWheelZoom();
		map.enableContinuousZoom();
		gsmMarkerCluster = new MarkerClusterer(map);
		markerBounds = new GLatLngBounds();
    }

/*To explode markers with same lat lon*/

	function markerOrder(marker,b) {
		return GOverlay.getZIndex(marker.getPoint().lat()) + marker.importance*1000000;
	}
	
	function setOuterBounds(num) {
		var n_outer = markers[num].startcoord.lat() + .5*((markers[num].n_outer - markers[num].s_outer + .00075) / Math.pow(2, -(17 - map.getZoom())));
		var s_outer = markers[num].startcoord.lat() - .5*((markers[num].n_outer - markers[num].s_outer) / Math.pow(2, -(17 - map.getZoom())));
		var e_outer = markers[num].startcoord.lng() + .5*((markers[num].e_outer - markers[num].w_outer + .00025) / Math.pow(2, -(17 - map.getZoom()))); 
		var w_outer = markers[num].startcoord.lng() - .5*((markers[num].e_outer - markers[num].w_outer + .00025) / Math.pow(2, -(17 - map.getZoom()))); 
		var newOuterBounds = new GLatLngBounds(new GLatLng(s_outer, w_outer), new GLatLng(n_outer, e_outer));
		return newOuterBounds;
	}
/*To explode markers with same lat lon*/


	function loadTheMarker3(argOption) {
		/*Document elements
			vendormenuval - Company dropdown value
			productmenuval - Products dropdown value
			venprodInput - AutoComplete textbox text
			venprodHidden - Hidden input for one COMPID and PRODID combo value from venprodInput
			
		*/
		var newGMarkerDesc = "";
		var vendor = "";
		var product = "";
		var searchArg="";
		var vendorArg = document.getElementById('vendormenuval').value;
		var productArg = document.getElementById('productmenuval').value;
		var venprodArgID = document.getElementById('venprodHidden').value;
		var venprodArg = document.getElementById('venprodInput').value;
		var vendorArgID="";
		var productArgID="";
		var venprodArgArray=[];
		var ischecked;
		var chkEN = document.getElementById('chkEN');
		var chkPL = document.getElementById('chkPO');
		var chkSO = document.getElementById('chkSO');
		var chkWA = document.getElementById('chkWA');
		var chkWI = document.getElementById('chkWI');
		var chkRE = document.getElementById('chkRE');
		var chkBL = document.getElementById('chkBL');
		var recFoundCount=0;
		var cluster;
		var categoryLabel="";
		
		markers = [];
		if (venprodArg!="") {
			if (venprodArgID!="") {
				venprodArgArray = venprodArgID.split(" ");
				vendorArgID=venprodArgArray[0];
				productArgID=venprodArgArray[1];
			}
		}
		for (var i = 0; i < prodInstalls.length; i++) {
            var latlng = new GLatLng(parseFloat(prodInstalls[i].lat), parseFloat(prodInstalls[i].lon));
            vendor = prodInstalls[i].compid;
          	product = prodInstalls[i].prodid;
			ischecked=false;
			switch(prodInstalls[i].pscat)
			{
			case "EN":
				categoryLabel="Energy";
				iconMarker = iconEN;
				ischecked = chkEN.checked;
				break;
			case "PL":
				categoryLabel="Power";
				iconMarker = iconPL;
				ischecked = chkPL.checked;
				break;
			case "SO":
				categoryLabel="Solar";
				iconMarker = iconSO;
				ischecked = chkSO.checked;
				break;
			case "WA":
				categoryLabel="Water";
				iconMarker = iconWA;
				ischecked = chkWA.checked;
				break;
			case "WI":
				categoryLabel="Wind";
				iconMarker = iconWI;
				ischecked = chkWI.checked;
				break;
			case "RE":
				categoryLabel="Resource";
				iconMarker = iconRE;
				ischecked = chkRE.checked;
				break;
			case "BL":
				categoryLabel="Building";
				iconMarker = iconBL;
				ischecked = chkBL.checked;
				break;

			default:
			}
			searchArg = "";
			if (ischecked) {
				//On intialization of app set the vendor to All
				if (argOption == "init") {
					vendorArg = "C00";
				}
				//Vendor and Product dropdown value search
				if (vendorArg == "C00" && productArg == product) {
					searchArg = vendorArg + "_" + productArg;
				} else if (vendorArg == vendor && productArg == product) {
					searchArg = vendorArg + "_" + productArg;
				} else if (vendorArg == vendor && productArg == "") {
					searchArg = vendorArg + "_";
				} else if (vendorArg == "C00" && productArg == "") {
					searchArg = vendorArg + "_" + productArg;
				} else if (vendorArg == "C00" && productArg == "P00") {
					searchArg = vendorArg + "_" + productArg;
				} else {
					/*if (vendorArg == "C00" || productArg == "P00") {
						searchArg = vendorArg + "_" + productArg;
					}
					if (vendorArg == vendor && productArg == product) {
						searchArg = vendorArg + "_" + productArg;
					} else {
						if (vendorArg == vendor) {
							searchArg = vendorArg;
						}
						
						if (productArg == product) {
							searchArg = productArg;
						}
					}*/
				}
				//Text box search
				if (vendorArgID == vendor && productArgID == product) {
					searchArg = vendorArgID + "_" + productArgID;
				} else {
					if (vendorArgID == vendor) {
						searchArg = vendorArgID;
					}					
					if (productArgID == product) {
						searchArg = productArgID;
					}
				}			
				
				if (searchArg != "") {
					var sHeight = "";
					switch(prodInstalls[i].plevel) 
					{
						case "GOLD":
							sHeight = "400";
							break;
						case "SILVER":
							sHeight = "250";
							break;
						case "BRONZE":
							sHeight = "180";
							break;
						default:
					}
					if (sHeight != "") {
			            newGMarkerDesc = '<iframe src="GOLD.html?prodlevel=' + prodInstalls[i].plevel + '&compid=' + prodInstalls[i].compid + '&prodid=' + prodInstalls[i].prodid + '&locid=' + prodInstalls[i].locid + '" width="640" height="' + sHeight + '" border="0" frameborder="0" name="Info"></iframe>';
		            } else {

		            }
					//var newGMarker=newMarker(latlng, newGMarkerDesc, prodInstalls[i].locid, iconMarker, null, null, null);
					var newGMarker=newMarker(latlng, newGMarkerDesc, categoryLabel, iconMarker, null, null, null);
					markers.push(newGMarker);
					//map.addOverlay(newGMarker);
					markerBounds.extend(latlng);
					recFoundCount=++recFoundCount;
				}
			}
		}
 
		if (recFoundCount>0) {
			gsmMarkerCluster = new MarkerClusterer(map, markers); 
			if (argOption != "refresh") {
				map.setCenter(markerBounds.getCenter());
				map.setZoom(map.getBoundsZoomLevel(markerBounds));
			}
		}
		return recFoundCount;
                  
    }
 
/*    
function newMarker(markerLocation, markerId, markerIcon, markerInfoWindowHTML) {
	var marker=new GMarker(markerLocation, {icon: markerIcon, title:'Marker['+markerId+']', zIndexProcess:markerOrder});
	GEvent.addListener(marker, 'click', function() {
		marker.openInfoWindowHtml(markerInfoWindowHTML);
	});
	return marker;
} 
*/

	function newMarker(location, html, markerId, markerIcon, iconcolor, iconnum, iconsize) {			
		//var customicon = new GIcon(G_DEFAULT_ICON);
		var customicon = markerIcon;
		customicon.infoWindowAnchor = new GPoint(11,35);
		//if (iconcolor && iconnum && iconsize) { 
		//	//customicon.image = window.sharedFilesURL + 'markers/' + iconsize +'/'+ iconcolor +'/'+ iconnum +'.png'; 
			customicon.image = markerIcon.image;
		//	if (iconsize=='small') {
				//customicon.shadow = window.sharedFilesURL + 'images/icons/shadow50.png';
				//customicon.iconSize = new GSize(15, 15);
				//customicon.shadowSize = new GSize(22, 20);
				customicon.iconAnchor = new GPoint(6, 20);
				customicon.infoWindowAnchor = new GPoint(5, 1);
		//	}
		//}
		//var temp_marker = new GMarker(location, {icon:customicon, zIndexProcess:markerOrder});
		var temp_marker = new GMarker(location, {icon:customicon, title:markerId, zIndexProcess:markerOrder});
		
		temp_marker.iconcolorurl = iconcolor;
		temp_marker.iconnumurl = iconnum;
		temp_marker.iconsizeurl = iconsize;
		if (iconcolor==null && iconnum==null && iconsize==null) {
			temp_marker.startimport=2;
			temp_marker.importance=2;
		} else {
			temp_marker.startimport=1;
			temp_marker.importance=1;
		}
		temp_marker.targeted=0;
		temp_marker.startcoord=location;
		temp_marker.openwindow=false;
		temp_marker.line = null;
		temp_marker.shifted = 0;
		
		var t_error = .0003;
		var shift = .0005;
		var n_coord = temp_marker.getLatLng().lat() + t_error;
		var s_coord = temp_marker.getLatLng().lat() - t_error;
		var e_coord = temp_marker.getLatLng().lng() + t_error;
		var w_coord = temp_marker.getLatLng().lng() - t_error;
		temp_marker.inBounds = new GLatLngBounds(new GLatLng(s_coord, w_coord), new GLatLng(n_coord, e_coord));
		
		
		temp_marker.n_outer = temp_marker.startcoord.lat()+shift;
		temp_marker.s_outer = temp_marker.startcoord.lat()-shift;
		temp_marker.e_outer = temp_marker.startcoord.lng()+shift;
		temp_marker.w_outer = temp_marker.startcoord.lng()-shift;
		temp_marker.outBounds = null;

		GEvent.addListener(temp_marker, "mouseover", function() {		
		if (map.getZoom() >= 14) {
			var step = 0;
			for (x = 0; x < markers.length; x++) {
				var target = markers[x].getLatLng();
				if (temp_marker.inBounds.containsLatLng(target)==true && markers[x].isHidden()==false) {
					step++;
					markers[x].targeted=1;
					markers[x].outBounds = setOuterBounds(x);
				};
			};
			if (step == 1) {
				temp_marker.targeted = 0;
				temp_marker.outBounds = null;
			};
			if (step > 1) {
				if (!map.getInfoWindow().isHidden()) { map.closeInfoWindow(); }
					var tick = 1;
					var deg = (360 / (step));
					for (x = 0; x < markers.length; x++) {
						if (markers[x].targeted==1 && markers[x].shifted==0) {
							map.removeOverlay(markers[x]);
							var delta_lat = (shift +  shift*(Math.pow(2, (17 - map.getZoom())) - 1)) * Math.cos(((deg * tick) * Math.PI) / 180);
							var delta_lng = (shift +  shift*(Math.pow(2, (17 - map.getZoom())) - 1)) * Math.sin(((deg * tick) * Math.PI) / 180);
							var point_latlng = new GLatLng((markers[x].startcoord.lat() + (delta_lat * .15)), (markers[x].startcoord.lng() + (delta_lng * .15)));
							var new_lat = markers[x].getLatLng().lat() + delta_lat;
							var new_lng = markers[x].getLatLng().lng() + delta_lng; 
							markers[x].setLatLng(new GLatLng(new_lat, new_lng));
							markers[x].importance=10;
							map.addOverlay(markers[x]);
							//markers[x].setImage(window.sharedFilesURL + 'markers/' + markers[x].iconsizeurl +'/'+ markers[x].iconcolorurl +'/'+ markers[x].iconnumurl + '.png');
							markers[x].setImage(markerIcon.image);
							markers[x].line = new GPolyline([
							markers[x].startcoord,  
							markers[x].getLatLng()], 
							'#000000', 2, 1);
							map.addOverlay(markers[x].line);
							
							var linepointcolor = '#9BE61A';
							if (markers[x].iconsizeurl=='small') {linepointcolor='#62D962';}
								markers[x].point = new GPolyline([
								markers[x].startcoord,
								point_latlng],
								linepointcolor, 2, 1);
								map.addOverlay(markers[x].point);
								
								markers[x].shifted=1;
								tick++;
							};
						};	 
					};
					GEvent.addListener(map, "mousemove", function(latlng) {
						for (x = 0; x < markers.length; x++) {
							if (markers[x].targeted==1 && markers[x].outBounds.containsLatLng(latlng)==false) {
								if (!map.getInfoWindow().isHidden()) { map.closeInfoWindow(); }
								map.removeOverlay(markers[x].line);
								map.removeOverlay(markers[x].point);
								map.removeOverlay(markers[x]);
								markers[x].setLatLng(markers[x].startcoord);
								markers[x].targeted=0;
								markers[x].shifted=0;
								markers[x].importance = markers[x].startimport;
								map.addOverlay(markers[x]);
								//markers[x].setImage(window.sharedFilesURL + 'markers/' + markers[x].iconsizeurl +'/'+ markers[x].iconcolorurl +'/'+ markers[x].iconnumurl + '.png');
								markers[x].setImage(markerIcon.image);
								if (markers[x].openwindow==true) {
									GEvent.trigger(markers[x], "click")
								};
								markers[x].openwindow=false;
							};
						};	 
					});
				};	
		});
		
		GEvent.addListener(temp_marker, "click", function() {
			for (i=0; i < markers.length; i++) {
				markers[i].openwindow=false;
			}
			temp_marker.openInfoWindowHtml(html);
			temp_marker.openwindow=true;
		});
		return temp_marker;
	}	

/*
*/
	function clearTheMarkers() {
		map.clearOverlays();
		gsmMarkerCluster.clearMarkers();
		gsmMarkerCluster = new MarkerClusterer(map);
		markerBounds = new GLatLngBounds();
		document.getElementById('recFoundCount').innerHTML = "";
		document.getElementById('venprodInput').value = "";
		document.getElementById('venprodHidden').value = "";
		document.getElementById('productmenuval').value = "";
		document.getElementById('vendormenuval').value = "C00";
		document.getElementById('addresssearch').value = "";


		document.getElementById('chkEN').checked = true;
		document.getElementById('chkPO').checked = true;
		document.getElementById('chkSO').checked = true;
		document.getElementById('chkWA').checked = true;
		document.getElementById('chkWI').checked = true;
		document.getElementById('chkRE').checked = true;
		document.getElementById('chkBL').checked = true;

		var oVenButton=YAHOO.util.Dom.get("vendorbutton-button");
		oVenButton.innerHTML="All";

		var oProdButton=YAHOO.util.Dom.get("productbutton-button");
		oProdButton.innerHTML="<em>Select a Product</em>"; 
		
		document.getElementById("vendormenuval").value="C00";
		searchMarkers("init");

/*		map.clearOverlays();
		gsmMarkerCluster.clearMarkers();
		gsmMarkerCluster = new MarkerClusterer(map);
		markerBounds = new GLatLngBounds();
		document.getElementById('recFoundCount').innerHTML = "";
		document.getElementById('venprodInput').value = "";
		document.getElementById('venprodHidden').value = "";
		document.getElementById('productmenuval').value = "";
		document.getElementById('vendormenuval').value = "";
		document.getElementById('addresssearch').value = "";

		var oVenButton=YAHOO.util.Dom.get("vendorbutton-button");
		oVenButton.innerHTML="<em>Select a Company</em>";
    	///var oProdButton=YAHOO.util.Dom.get("productbutton-button");
		//oProdButton.innerHTML="<em>Select a Product</em>";
		var oProdButton=YAHOO.util.Dom.get("productbutton-button");
		oProdButton.innerHTML="<em>Select a Product</em>"; 
*/		
	}
	
	function searchMarkers(argOption) {
		gsmMarkerCluster.clearMarkers();
		gsmMarkerCluster = new MarkerClusterer(map);
		markerBounds = new GLatLngBounds();
		
		var markersFound = loadTheMarker3(argOption);
		var markerCountDiv = document.getElementById('recFoundCount');
		markerCountDiv.innerHTML = " " + markersFound + " records found.";
	}
	
	function resetMarkers () {
		document.getElementById('recFoundCount').innerHTML = "";
		document.getElementById('venprodInput').value = "";
		document.getElementById('venprodHidden').value = "";
		document.getElementById('productmenuval').value = "";
		document.getElementById('vendormenuval').value = "C00";

		var oVenButton=YAHOO.util.Dom.get("vendorbutton-button");
		oVenButton.innerHTML="All";

		var oProdButton=YAHOO.util.Dom.get("productbutton-button");
		oProdButton.innerHTML="<em>Select a Product</em>"; 
		
		document.getElementById("vendormenuval").value="C00";
	}


	function refreshMarkers () {
		searchMarkers("refresh");
		/*
		//Default vendor value = "All"
		var oVenButton=YAHOO.util.Dom.get("vendorbutton");
		//oVenButton.innerHTML="All";
		oVenButton.set("label", "All");
        oVenButton.set("value", "C00");

		//searchMarkers("init");
		document.getElementById("vendormenuval").value="C00";
		*/
	}
	//Address search code ------------------------>>>>>>>>>
	
	// addAddressToMap() is called when the geocoder returns an
    // answer.  It adds a marker to the map with an open info window
    // showing the nicely formatted version of the address and the country code.
	function addAddressToMap(response) {
		//map.clearOverlays();
		if (!response || response.Status.code != 200) {
			alert("Sorry, we were unable to geocode that address");
		} else {
			place = response.Placemark[0];
			point = new GLatLng(place.Point.coordinates[1],
			place.Point.coordinates[0]);
			marker = new GMarker(point);
			map.setCenter(new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]));
			map.addOverlay(marker);
			window.setTimeout(function() {
				map.panTo(new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]));
				}, 1000);
			//marker.openInfoWindowHtml(place.address + '<br>' + '<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode + '<br><input type="button" onClick="zoomAddress();" value="Zoom"');
			marker.openInfoWindowHtml(place.address + '<br>' + '<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);
			zoomAddress();
		}
	}
    
    // showLocation() is called when you click on the Search button
    // in the form.  It geocodes the address entered into the form
    // and adds a marker to the map at that location.
	function showLocation() {
		var address = document.getElementById('addresssearch').value;
		geocoder.getLocations(address, addAddressToMap);
		
	}	
    //Address search code ------------------------>>>>>>>>>
	function zoomAddress() {
		//alert("HI");
		map.setZoom(100);
	}


/*

*/



	//Symbol Refresh button --------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("categoryRefresh", function () {
		// Create a Button without using existing markup
		var oCategoryrefresh= new YAHOO.widget.Button({ label: "Refresh", id: "categoryrefresh", name: "categoryrefresh", container: "categoryRefresh", onclick: { fn: refreshMarkers } });
        //function onExampleSubmit(p_oEvent) {
            //var bSubmit = window.confirm("Are you sure you want to submit this form?");
            //if(!bSubmit) {
              //  YAHOO.util.Event.preventDefault(p_oEvent);
            //}
        //}
	});
	//Symbol Refresh button --------------->>>>>>>>>>

	//Vendor and Product search button --------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("vendorproductSearchButton", function () {
		// Create a Button without using existing markup
		var oSubmitButton5 = new YAHOO.widget.Button({ label: "Search", id: "submitbutton5", name: "submitbutton5", container: "vendorproductSearchButton", onclick: { fn: searchMarkers } });
	});

	//Vendor and Product search button --------------->>>>>>>>>>
	
	//Vendor and Product Reset button --------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("vpResetButton", function () {
		// Create a Button without using existing markup
		var oVendorProductResetButton = new YAHOO.widget.Button({ label: "Reset", id: "vpresetbutton", name: "vpresetbutton", container: "vpResetButton", onclick: { fn: resetMarkers } });
	});
	//Vendor and Product Reset button --------------->>>>>>>>>>

	
	//Clear overlay button - Renamed to Refresh Map--------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("clearOverlayButton", function () {
        // Button to clear overlays
		var oClearoverlaybutton = new YAHOO.widget.Button({ label: "Refresh Map", id: "clearoverlaybutton", name: "clearoverlaybutton", container: "clearOverlayButton", onclick: { fn: clearTheMarkers} });
	});
	//Clear overlay button --------------->>>>>>>>>>
	
	//Address Search button --------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("addresssearchbutton", function () {
        // Create a Button without using existing markup
        var oSubmitButton6 = new YAHOO.widget.Button({ label: "Search", id: "submitbutton6", name: "submitbutton6", value:  "submitbutton6value", container: "addresssearchbutton", onclick: { fn: showLocation} });
        //function onExampleSubmit6(p_oEvent) {
			//James took out
            //var bSubmit = window.confirm("Are you sure you want to submit this form?");
            //if(!bSubmit) {
              //  YAHOO.util.Event.preventDefault(p_oEvent);
            //}
        //}
        //YAHOO.util.Event.on("button-example-form2", "submit", onExampleSubmit6);
	});
	//Address Search button --------------->>>>>>>>>>
/*
Google Maps API map type buttons
*/

	function setMapType0(){
		setMapType(0);
	}
	function setMapType1(){
		setMapType(1);
	}
	function setMapType2(){
		setMapType(2);
	}

	YAHOO.util.Event.onAvailable("maptypebuttons", function () {
		var oLinkButton1 = new YAHOO.widget.Button({label: "Map", id: "mapbutton1", value: "Map", container: "maptypebuttons", onclick: { fn: setMapType0 } });
		var oLinkButton2 = new YAHOO.widget.Button({label: "Satellite", id: "satbutton1", value: "Satellite", container: "maptypebuttons", onclick: { fn: setMapType1 } });	
		var oLinkButton3 = new YAHOO.widget.Button({label: "Hybrid", id: "hybridbutton1", value: "Hybrid", container: "maptypebuttons", onclick: { fn: setMapType2 } });
	});


