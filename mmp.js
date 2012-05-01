var mapg = null;
var stViewg=null;

var latlngG = new google.maps.LatLng(21.485, -157.9);
var zoomLevel = null;
var geocoder;
var gMarkers = new Array();

$(document).ready(function() {
	//initialize toolbar
	//alert("ll2");
	var toolset = "1";
	
	initToolBar(toolset);
	
	
} );
	
	
function initialize() {
	initMap();
	
	loadTheMarker3("blank_search");
}

function initMap() {
	
	
	//initialize Google Map -- BEGIN
	zoomLevel = 10;
	
	var myOptions = {
      zoom: zoomLevel ,
      center: latlngG ,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: true
    };
    
    mapg = new google.maps.Map(document.getElementById("map"), myOptions);
	
	var panoramaOptions = {
      position: latlngG,
      pov: {
        heading: 34,
        pitch: 10,
        zoom: 1
   	  }
    };

	stViewg= new  google.maps.StreetViewPanorama(document.getElementById("sViewg"),panoramaOptions);
	mapg.setStreetView(stViewg);

	//Add listeners
	/*---Zoom---*/
	google.maps.event.addListener(mapg , 'zoom_changed', function() {
		
	});
			
	google.maps.event.addListener(mapg , 'center_changed', function() {

	});
	
	google.maps.event.addListener(mapg, 'click', function(event){
		
	});
	
	geocoder = new google.maps.Geocoder();
	
	//initialize Google Map -- END 
	
	
}


function initToolBar(toolset) {
	var toolbardiv = $("#toolbar");
	//alert("ll");
	toolbardiv.empty();
	var t1 = $("<div id='t1' class='tool' url='http://google.com'>").text("T1").appendTo(toolbardiv);
	var t2 = $("<div id='t2' class='tool'>").text("T2").appendTo(toolbardiv);
	var t3 = $("<div id='t3' class='tool'>").text("T3").appendTo(toolbardiv);
	var t4 = $("<div id='t4' class='tool'>").text("T4").appendTo(toolbardiv);
	
	$("#t1").click(
		function()
		{
	    	window.location = $(this).attr("url");
		}
	);
	
	$("#t2").click(
		function()
		{
	    	alert("Tool 2");
		}
	);
	
	$("#t3").click(
		function()
		{
	    	openShadowBox("Tool 3");
		}
	);
	
	$("#t4").click(
		function()
		{
	    	openShadowBox("Tool 4");
		}
	);
	
}

function openShadowBox(params) {
	//NOT DONE YET - NEED TO FINISH

		var sContent = "";
		
			sContent = "<div id='welcome-msg' style='background-color:#fff;font-family:\"Lucida Grande\", Verdana, Arial, Helvetica, sans-serif;font-weight:200;'>";
			sContent = sContent+"You cannot check out any pages at this time.";
			sContent = sContent+"</div>";
		
		Shadowbox.open({	
			content:    sContent,
			player:     "html",
			title:      "\""+params+"\"",
			height: 160
	    });
}


//MARKER CODE
	function loadTheMarker3(argOption) {
		var searchArg="";
		var ischecked;
		var recFoundCount=0;
		var cluster;
		var categoryLabel="";
		
		
		deleteOverlays();
		gMarkers = [];
		/*
		var image = 'images/beachflag.png';
		var myLatLng = new google.maps.LatLng(-33.890542, 151.274856);
		var beachMarker = new google.maps.Marker({
		    position: myLatLng,
		    map: map,
		    icon: image
		});
		*/
		//Google Map
		var image = '../images/CCHDPP.png';
		var j=0;
		var countDown="";
		//document.getElementById('txtCount2').value=j + " ";


		var lat;
		var lon;
		var myLatLng;
		var bldgPermitF="";
		var tmk="";
		var applicant="";
		var owner="";
		var occupancy="";
		var matchText="";
		var blMatch="";
		var testText="";
		var s ="";
		//document.getElementById('TextArea1').value="";	

		for (var i = 0; i < prodInstalls.length; i++) {
			
			lat=parseFloat(prodInstalls[i].LAT);
			lon=parseFloat(prodInstalls[i].LON);
			myLatLng = new google.maps.LatLng(lat, lon);
			bldgPermitF=prodInstalls[i].BUILDINGPE;
			tmk=prodInstalls[i].TMK8;
			applicant=prodInstalls[i].APPLICANT;
			owner=prodInstalls[i].OWNER;
			occupancy=prodInstalls[i].OCCUPANCYG;
			matchText=argOption.toLowerCase();
			blMatch=true;
			testText="";
			
			//document.getElementById('txtCount').value=i + " ";

			if (argOption!="") {
				
				blMatch=false;
				if (argOption=="blank_search") {
					blMatch=true;
				} else {
					/**/
					if (testMatch(bldgPermitF,argOption)){
						blMatch=true;		
					}
					
					if (testMatch(tmk,argOption)){
						blMatch=true;		
					}
					/**/
					if (testMatch(applicant,argOption)){
						blMatch=true;		
					}
		
					if (testMatch(owner,argOption)){
						blMatch=true;		
					}
					
					if (testMatch(occupancy,argOption)){
						blMatch=true;		
					}
					
				}
			}
			
			if (blMatch) {
				j++;
				//countDown = i+'';
				//document.getElementById('txtCount2').value=j + " ";
				var popupHTML="TMK: " + tmk + "<br>Permit Number: " + bldgPermitF + "<br>Applicant: " + applicant + "<br>Owner: " + owner + "<br>Occupancy: " + occupancy
				
				///////////////////////////////////////////
				/////GMap
				var newGMarker=newMarker(myLatLng, popupHTML, tmk, image, null, null, null);
				////var newGMarker=newMarker(myLatLng, "HI", "HI HI", image, null, null, null);
				gMarkers.push(newGMarker);
				/////GMap
				///////////////////////////////////////////
				
			}
			
		}
		var markerCluster = new MarkerClusterer(mapg, gMarkers);
		//Alert("Done");	                  
    }





	function testMatch(str1, str2) {
    	var testText=str1.toLowerCase();
    	var matchText=str2.toLowerCase();
    	var s="";
    	
    	
				
    	if (testText==matchText){
	    	//s=document.getElementById('TextArea1').value + "\n" + str1 + "-" + str2;
			//document.getElementById('TextArea1').value=s;
			return true;
		} else {
			return false;		
		}

    	
    }
    
	function newMarker(position, html, markerId, markerIcon, iconcolor, iconnum, iconsize) {
		var beachMarker = new google.maps.Marker({
			position: position,
			title:markerId,
			map: mapg,
			icon: markerIcon
		});

		var infowindow = new google.maps.InfoWindow({
		    content: html
		});
		
		google.maps.event.addListener(beachMarker, 'click', function() {
			//for (i=0; i < gMarkers.length; i++) {
			//	gMarkers[i].close();
			//}
			infowindow.open(mapg,beachMarker);
		});
		return beachMarker;
	}
	
	function clearOverlays() {
		if (gMarkers) {
		    for (i in gMarkers) {
		      gMarkers[i].setMap(null);
		    }
		  }

	}
	
	// Deletes all markers in the array by removing references to them
	function deleteOverlays() {
	  if (gMarkers) {
	    for (i in gMarkers) {
	      gMarkers[i].setMap(null);
	    }
	    gMarkers.length = 0;
	  }
	}
	
