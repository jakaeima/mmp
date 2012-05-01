/*
*/

 var geoXml;
    var theErrMsg = "";
    var iconEN;
    var iconPL;
    var iconSO;
    var iconWA;
    var iconWI;
    var iconRE;
    var iconMarker;
    var geocoder;
    var xmldata;
    
    
    iconEN = new GIcon();
	iconEN.image = "images/icons/energy.png";
	//iconEN.shadow = "images/icons/shadow50.png";
	iconEN.iconSize = new GSize(18, 26);
	//iconEN.shadowSize = new GSize(37, 34);
	iconEN.iconAnchor = new GPoint(10, 17);
	iconEN.infoWindowAnchor = new GPoint(10, 1);
	
	iconPL = new GIcon();
	iconPL.image = "images/icons/power.png";
	//iconPL.shadow = "images/icons/shadow50.png";
	iconPL.iconSize = new GSize(21, 29);
	//iconPL.shadowSize = new GSize(37, 34);
	iconPL.iconAnchor = new GPoint(10, 17);
	iconPL.infoWindowAnchor = new GPoint(10, 1);
	
	iconSO = new GIcon();
	iconSO.image = "images/icons/solar.png";
	//iconSO.shadow = "images/icons/shadow50.png";
	iconSO.iconSize = new GSize(25, 26);
	//iconSO.shadowSize = new GSize(37, 34);
	iconSO.iconAnchor = new GPoint(10, 17);
	iconSO.infoWindowAnchor = new GPoint(10, 1);
	
	iconWA = new GIcon();
	iconWA.image = "images/icons/water.png";
	//iconWA.shadow = "images/icons/shadow50.png";
	iconWA.iconSize = new GSize(16, 25);
	//iconWA.shadowSize = new GSize(37, 34);
	iconWA.iconAnchor = new GPoint(10, 17);
	iconWA.infoWindowAnchor = new GPoint(10, 1);
	
	iconWI = new GIcon();
	iconWI.image = "images/icons/wind.png";
	//iconWI.shadow = "images/icons/shadow50.png";
	iconWI.iconSize = new GSize(24, 29);
	//iconWI.shadowSize = new GSize(37, 34);
	iconWI.iconAnchor = new GPoint(10, 17);
	iconWI.infoWindowAnchor = new GPoint(10, 1);
	
	iconRE = new GIcon();
	iconRE.image = "images/icons/resource.png";
	//iconRE .shadow = "images/icons/shadow50.png";
	iconRE.iconSize = new GSize(27, 26);
	//iconRE .shadowSize = new GSize(37, 34);
	iconRE.iconAnchor = new GPoint(10, 17);
	iconRE.infoWindowAnchor = new GPoint(10, 1);
	


/*

*/
	function setupWeatherMarkers() {
		mgr = new MarkerManager(map);
		mgr.addMarkers(getWeatherMarkers(20), 3);
		mgr.addMarkers(getWeatherMarkers(200), 6);
		mgr.addMarkers(getWeatherMarkers(1000), 8);
		mgr.refresh();
	}


/*

*/


	function initialize() {
      if (GBrowserIsCompatible()) {
        //loadTheXML();
        loadTheMap();

        //map = new GMap2(document.getElementById("map_canvas"));
        if (map.isLoaded()) {
          loadTheXML();
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
        map.addControl(new GLargeMapControl3D());
        //var topRight = new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(0,0));
        map.addControl(new GOverviewMapControl());
        map.addControl(new PromoControl());
        map.setCenter(new GLatLng(21.485, -157.9), 10);
        //map.setUIToDefault();
        map.enableScrollWheelZoom();
		map.enableContinuousZoom();
		
    }




/*


*/

function randomMarkers() {
    	var randomIcon;
    	var j;
    	var sType="";
    	
		// Add 10 markers to the map at random locations
		var bounds = map.getBounds();
		var southWest = bounds.getSouthWest();
		var northEast = bounds.getNorthEast();
		var lngSpan = northEast.lng() - southWest.lng();
		var latSpan = northEast.lat() - southWest.lat();
		
		var typeArray = new Array();
		var chkEN = document.getElementById('chkEN');
		var chkPL = document.getElementById('chkPO');
		var chkSO = document.getElementById('chkSO');
		var chkWA = document.getElementById('chkWA');
		var chkWI = document.getElementById('chkWI');
		var chkRE = document.getElementById('chkRE');
		
		var txtVendorProduct = document.getElementById('vendorproductSearch');
		var cluster;
		var markersArray=[];

		typeArray[0]=false;
		typeArray[1]=chkEN .checked;
		typeArray[2]=chkPL.checked;
		typeArray[3]=chkSO.checked;
		typeArray[4]=chkWA.checked;
		typeArray[5]=chkWI.checked;
		typeArray[6]=chkRE.checked;
		
		for (var i = 1; i < 10; i++) {
			if (i>6) {
	    		j=10-i;
	    	} else {
	    		j=i;
	    	}
	    	
	        if (typeArray[j]) {
	        	switch(j)
		    	{
				case 1:
					randomIcon= iconEN;
					sType = "Energy";
					break;
				case 2:
					randomIcon= iconPL;
					sType = "Plugin";
					break;
				case 3:
					randomIcon= iconSO;
					sType = "Solar";
					break;
				case 4:
					randomIcon= iconWA;
					sType = "Water";
					break;
				case 5:
					randomIcon= iconWI;
					sType = "Wind";
					break;
				case 6:
					randomIcon= iconRE;
					sType = "Resource";
					break;
				default:
					randomIcon= iconRE;
					sType = "Unknown " + j;
					break;
				}
				randomIcon.shadow = "images/icons/shadow50.png";
				randomIcon.shadowSize = new GSize(37, 34);
	
				var latlng = new GLatLng(southWest.lat() + latSpan * Math.random(),
				southWest.lng() + lngSpan * Math.random());
				var newRandomMarker
				var newRandomMarker=new GMarker(latlng, {icon: randomIcon, title: i});
				newRandomMarker.bindInfoWindowHtml(sType+" installation location.");
				markersArray.push(newRandomMarker);
				//map.addOverlay(newRandomMarker);
			}
		}
		
		cluster=new ClusterMarker(map, { markers:markersArray } );
		cluster.fitMapToMarkers();
		
		map.savePosition();
		
    	return 0;
    }
    
    
    
  function loadTheMarker1() {
          var markers = xmldata.documentElement.getElementsByTagName("marker");
          var newGMarkerDesc = "";
          var vendor = "";
          var product = "";
          var searchArg="";
          var vendorArg = document.getElementById('vendormenuval').value;
          var productArg = document.getElementById('productmenuval').value;
          
          //alert(vendorArg + " - " + productArg);
          
          for (var i = 0; i < markers.length; i++) {
            var latlng = new GLatLng(parseFloat(markers[i].getAttribute("lat")),
                                    parseFloat(markers[i].getAttribute("lng")));
            vendor = markers[i].getAttribute("compid");
          	product = markers[i].getAttribute("prodid");
		
			switch(markers[i].getAttribute("icon"))
			{
			case "EN":
				iconMarker = iconEN;
				break;
			case "PL":
				iconMarker = iconPL;
				break;
			case "SO":
				iconMarker = iconSO;
				break;
			case "WA":
				iconMarker = iconWA;
				break;
			case "WI":
				iconMarker = iconWI;
				break;
			case "RE":
				iconMarker = iconRE;
				break;
			default:
			}
			searchArg = "";
			if (vendorArg == vendor && productArg == product) {
				searchArg = vendorArg + "_" + productArg;
			} else {
				if (vendorArg == vendor) {
					searchArg = vendorArg;
				}
				
				if (productArg == product) {
					searchArg = productArg;
				}
			}
			//alert(vendorArg + "_" + productArg + "_" + vendor + "_" + product + " : " + searchArg);
			if (searchArg != "") {
				var newGMarker=new GMarker(latlng, {icon: iconMarker, title: markers[i].getAttribute("title") });
	            //var newGMarkerDesc = new markers[i].getElementsByTagName("description")[0];
	
	            newGMarkerDesc = (markers[i].getElementsByTagName("description")[0].getAttribute("theHTML"));
	            //alert(newGMarkerDesc);
	            //alert((parseString(newGMarkerDesc.getAttribute("theHTML"))));
	
	            newGMarker.bindInfoWindowHtml((markers[i].getElementsByTagName("description")[0].getAttribute("theHTML")),{maxWidth:300});
	            //newGMarker.bindInfoWindowHtml("HI");
	            map.addOverlay(newGMarker);
           	}
          }
          
          	
        
    }
    
    function loadTheMarker2() {
          var markers = xmldata.documentElement.getElementsByTagName("marker");
          var newGMarkerDesc = "";
          var vendor = "";
          var product = "";
          var searchArg="";
          var vendorArg = document.getElementById('vendormenuval').value;
          var productArg = document.getElementById('productmenuval').value;
          
          var ischecked;
          var chkEN = document.getElementById('chkEN');
		var chkPL = document.getElementById('chkPO');
		var chkSO = document.getElementById('chkSO');
		var chkWA = document.getElementById('chkWA');
		var chkWI = document.getElementById('chkWI');
		var chkRE = document.getElementById('chkRE');

          //alert(vendorArg + " - " + productArg + ": " + prodInstalls.length);
         
          for (var i = 0; i < prodInstalls.length; i++) {
            var latlng = new GLatLng(parseFloat(prodInstalls[i].lat),
                                    parseFloat(prodInstalls[i].lon));
            vendor = prodInstalls[i].compid;
          	product = prodInstalls[i].prodid;
			ischecked=false;
			switch(prodInstalls[i].pscat)
			{
			case "EN":
				iconMarker = iconEN;
				ischecked = chkEN.checked
				break;
			case "PL":
				iconMarker = iconPL;
				ischecked = chkPL.checked
				break;
			case "SO":
				iconMarker = iconSO;
				ischecked = chkSO.checked
				break;
			case "WA":
				iconMarker = iconWA;
				ischecked = chkWA.checked
				break;
			case "WI":
				iconMarker = iconWI;
				ischecked = chkWI.checked
				break;
			case "RE":
				iconMarker = iconRE;
				ischecked = chkRE.checked
				break;
			default:
			}
			searchArg = "";
			if (ischecked) {
				if (vendorArg == vendor && productArg == product) {
					searchArg = vendorArg + "_" + productArg;
				} else {
					if (vendorArg == vendor) {
						searchArg = vendorArg;
					}
					
					if (productArg == product) {
						searchArg = productArg;
					}
				}
				//alert(i + " - " + vendorArg + "_" + productArg + "_" + vendor + "_" + product + " : " + searchArg);
				if (searchArg != "") {
					var newGMarker=new GMarker(latlng, {icon: iconMarker, title: prodInstalls[i].vname });
		            //var newGMarkerDesc = new markers[i].getElementsByTagName("description")[0];
					var sHeight = "";
					switch(prodInstalls[i].plevel) 
					{
						case "GOLD":
							sHeight = "470";
							break;
						case "SILVER":
							sHeight = "430";
							break;
						case "BRONZE":
							sHeight = "180";
							break;
						default:
					}
	
					if (sHeight != "") {
			            newGMarkerDesc = '<iframe src="' + prodInstalls[i].plevel + '.html?compid=' + prodInstalls[i].compid + '&prodid=' + prodInstalls[i].prodid + '" width="640" height="' + sHeight + '" border="0" frameborder="0" name="Info"></iframe>';
			            //alert(newGMarkerDesc);
			            //&lt;iframe src=&quot;Bronze.html?compid=C04&amp;prodid=P04&quot; width=&quot;640&quot; height=&quot;180&quot; border=&quot;0&quot; frameborder=&quot;0&quot;name=&quot;Info&quot;&gt;&lt;/iframe&gt;
			            //alert((parseString(newGMarkerDesc.getAttribute("theHTML"))));
			
			            newGMarker.bindInfoWindowHtml((newGMarkerDesc ),{maxWidth:300});
			            //newGMarker.bindInfoWindowHtml("HI");
		            } else {
		            	newGMarker.bindInfoWindowHtml(prodInstalls[i].pname);
		            }
		            map.addOverlay(newGMarker);
	           	}
           	}
          }
          
          
          	
        
    }


	function loadTheMarker3() {
		var markers = xmldata.documentElement.getElementsByTagName("marker");
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
		var recFoundCount=0;
		var cluster;
		var markersArray=[];

		if (venprodArg!="") {
			if (venprodArgID!="") {
				venprodArgArray = venprodArgID.split(" ");
				vendorArgID=venprodArgArray[0];
				productArgID=venprodArgArray[1];
			}
		}
		//alert("'" + vendorArg + "', '" + productArg + "', '" + vendorArgID + "', '" + productArgID + "'");
        //alert(vendorArg + " - " + productArg + ": " + prodInstalls.length);
         
          for (var i = 0; i < prodInstalls.length; i++) {
            var latlng = new GLatLng(parseFloat(prodInstalls[i].lat),
                                    parseFloat(prodInstalls[i].lon));
            vendor = prodInstalls[i].compid;
          	product = prodInstalls[i].prodid;
			ischecked=false;
			switch(prodInstalls[i].pscat)
			{
			case "EN":
				iconMarker = iconEN;
				ischecked = chkEN.checked
				break;
			case "PL":
				iconMarker = iconPL;
				ischecked = chkPL.checked
				break;
			case "SO":
				iconMarker = iconSO;
				ischecked = chkSO.checked
				break;
			case "WA":
				iconMarker = iconWA;
				ischecked = chkWA.checked
				break;
			case "WI":
				iconMarker = iconWI;
				ischecked = chkWI.checked
				break;
			case "RE":
				iconMarker = iconRE;
				ischecked = chkRE.checked
				break;
			default:
			}
			searchArg = "";
			if (ischecked) {
				if (vendorArg == "C00" || productArg == "P00") {
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
				}
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

				//alert(i + " - " + vendorArg + "_" + productArg + "_" + vendor + "_" + product + " : " + searchArg);
				if (searchArg != "") {
					var newGMarker=new GMarker(latlng, {icon: iconMarker, title: prodInstalls[i].vname });
		            //var newGMarkerDesc = new markers[i].getElementsByTagName("description")[0];
					var sHeight = "";
					switch(prodInstalls[i].plevel) 
					{
						case "GOLD":
							sHeight = "470";
							break;
						case "SILVER":
							sHeight = "430";
							break;
						case "BRONZE":
							sHeight = "180";
							break;
						default:
					}
	
					GEvent.addListener(newGMarker, "click", function() {
						if (sHeight != "") {
				            
				            newGMarkerDesc = '<iframe src="' + prodInstalls[i].plevel + '.html?compid=' + prodInstalls[i].compid + '&prodid=' + prodInstalls[i].prodid + '" width="640" height="' + sHeight + '" border="0" frameborder="0" name="Info"></iframe>';
				            
				            newGMarker.openInfoWindowHtml(newGMarkerDesc );
				            //newGMarker.bindInfoWindowHtml((newGMarkerDesc ),{maxWidth:300});
				            //newGMarker.bindInfoWindowHtml("HI");
			            } else {
	//		            	newGMarker.bindInfoWindowHtml(prodInstalls[i].pname);
			            	newGMarker.openInfoWindowHtml(prodInstalls[i].pname);
			            }
		            });
		            map.addOverlay(newGMarker);
		            markersArray.push(newGMarker);
		            recFoundCount=++recFoundCount;
	           	}
           	}
          }
			if (recFoundCount>0) {
				cluster=new ClusterMarker(map, { markers:markersArray } );
				cluster.fitMapToMarkers();
				
				map.savePosition();
			}
          return recFoundCount;        
    }
    
    
    
    
    
/*

*/


	function clearMarkers() {
		map.clearOverlays();
		document.getElementById('recFoundCount').innerHTML = "";
		document.getElementById('venprodInput').value = "";
		document.getElementById('venprodHidden').value = "";
		document.getElementById('productmenuval').value = "";
		document.getElementById('vendormenuval').value = "";
		document.getElementById('addresssearch').value = "";

		var oVenButton=YAHOO.util.Dom.get("vendorbutton-button");
		oVenButton.innerHTML="<em>Select a Vendor</em>";
		//alert(oVenButton.innerHTML);
    	///var oProdButton=YAHOO.util.Dom.get("productbutton-button");
		//oProdButton.innerHTML="<em>Select a Product</em>";
		var oProdButton=YAHOO.util.Dom.get("productbutton-button");
		oProdButton.innerHTML="<em>Select a Product</em>";
		 
	}
	
	function searchMarkers() {
		//loadTheXML();
		var markersFound = loadTheMarker3();
		var markerCountDiv = document.getElementById('recFoundCount');
		markerCountDiv.innerHTML = " " + markersFound + " records found.";
		
		//var oProdButton=YAHOO.util.Dom.get("productbuttoncontainer");
		

		//alert(oProdButton.innerHTML);
		//map.zoomToMarkers();
		//randomMarkers(); 
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
       map.addOverlay(marker);
       window.setTimeout(function() {
	      map.panTo(new GLatLng(place.Point.coordinates[1],
                           place.Point.coordinates[0]));
	    }, 1000);
       marker.openInfoWindowHtml(place.address + '<br>' +
         '<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);
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
	
	
/*

*/

	//Vendor and Product search button --------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("vendorproductSearchButton", function () {

        // Create a Button without using existing markup

        //var oSubmitButton5 = new YAHOO.widget.Button({ type: "submit", label: "Search", id: "submitbutton5", name: "submitbutton5", value:  "submitbutton5value", container: "vendorproductSearchButton" });
		var oSubmitButton5 = new YAHOO.widget.Button({ label: "Search", id: "submitbutton5", name: "submitbutton5", container: "vendorproductSearchButton", onclick: { fn: searchMarkers } });

        function onExampleSubmit(p_oEvent) {

            //var bSubmit = window.confirm("Are you sure you want to submit this form?");

            //if(!bSubmit) {
            
              //  YAHOO.util.Event.preventDefault(p_oEvent);
            
            //}

        }

        //YAHOO.util.Event.on("button-example-form", "submit", onExampleSubmit);

	});
	//Vendor and Product search button --------------->>>>>>>>>>
	
	//Clear overlay button --------------->>>>>>>>>>
	YAHOO.util.Event.onAvailable("clearOverlayButton", function () {
        // Button to clear overlays
		var oSubmitButton5 = new YAHOO.widget.Button({ label: "Clear", id: "clearoverlaybutton", name: "clearoverlaybutton", container: "clearOverlayButton", onclick: { fn: clearMarkers} });
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
		//	var oLinkButton3 = new YAHOO.widget.Button("hybridbutton1"); 
	});

