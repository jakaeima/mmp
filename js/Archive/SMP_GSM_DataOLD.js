/*
Test data for GSM site
*/

var venprodNames = [
	{'compid': 'C01', 'prodid': 'P01', 'vname': 'Weston Solutions Inc.', 'pname': 'GreenGrid'}
];

var prodInstalls = [
{'locid': 'L0000001', 'compid': 'C01', 'prodid': 'P01', 'vname': 'Weston Solutions Inc. (GreenGrid&#174;)', 'lon': -87.625, 'lat': 41.8997222 , 'vlink': 'http://www.westonsolutions.com/', 'vaddress': '841 Bishop Street, Suite 2301', 'vcity': ' Honolulu', 'vstate': ' HI', 'vzip': '96813-3957', 'vcountry': 'USA', 'vphone': '(808) 275-2900', 'vemail': 'info@westonsolutions.com', 'pname': 'GreenGrid&#174;', 'pdesc': '900 NORTH MICHIGAN<br>Building Owner: 900 Tower, LLC, an affiliate of JMB Realty Corporation<br>Client: Moore Landscapes<br>Location: Chicago, Illinois<br>GreenGrid&#174; Size: 14,000 ft2<br>Installation Contractor: Moore Landscapes<br>Landscape Design: Douglas Hoerr<br>Architecture, Inc.<br>Rooftop System: Intensive<br>Status: Completed April 2007<br>', 'pscat': 'RE', 'plink': 'http://www.greengridroofs.com/', 'iaddress': '900 NORTH MICHIGAN', 'icity': 'Chicago', 'istate': 'IL', 'izip': '', 'icountry': ' USA', 'ppic': 'catalog/vendors/Weston/product1.jpg', 'pbenefit': '<a href = "catalog/vendors/Weston/GGBenefitsLEED.pdf">Benefits PDF</a>', 'poclast': 'Ambler', 'pocfirst': 'Mark', 'pocphone': '(808) 275-2911', 'pocemail': 'Mark.Ambler@westonsolutions.com', 'ptestimony': 'Not Available', 'pbrochure': 'GGBinderHonolulu.pdf', 'plevel': 'GOLD' },
{'locid': 'L0000002', 'compid': 'C01', 'prodid': 'P01', 'vname': 'Weston Solutions Inc. (GreenGrid&#174;)', 'lon': -105.0010427, 'lat': 39.7518064, 'vlink': 'http://www.westonsolutions.com/', 'vaddress': '841 Bishop Street, Suite 2301', 'vcity': ' Honolulu', 'vstate': ' HI', 'vzip': '96813-3957', 'vcountry': 'USA', 'vphone': '(808) 275-2900', 'vemail': 'info@westonsolutions.com', 'pname': 'GreenGrid&#174;', 'pdesc': 'U.S. EPA Region 8 Headquarters<br>Denver, CO<br>Client: U.S. EPA & General Services<br>Administration (GSA)<br>Location: U.S. EPA Region 8 Headquarters<br>1595 Wynkoop St., Denver, CO<br>GreenGrid&#174; Size: 19,396 ft2<br>Installation Contractor: Weston Solutions<br>Green Roof Design: Weston Solutions<br>Rooftop System: Extensive<br>Status: Completed Fall 2006', 'pscat': 'RE', 'plink': 'http://www.greengridroofs.com/', 'iaddress': '1595 Wynkoop St', 'icity': 'Denver', 'istate': 'CO', 'izip': '', 'icountry': ' USA', 'ppic': 'catalog/vendors/Weston/product1.jpg', 'pbenefit': '<a href = "catalog/vendors/Weston/GGBenefitsLEED.pdf">Benefits PDF</a>', 'poclast': 'Ambler', 'pocfirst': 'Mark', 'pocphone': '(808) 275-2911', 'pocemail': 'Mark.Ambler@westonsolutions.com', 'ptestimony': 'Not Available', 'pbrochure': 'GGBinderHonolulu.pdf', 'plevel': 'GOLD' }
];


	YAHOO.util.Event.onAvailable("buttoncontainer", function () {
		//	"click" event handler for each item in the Button's menu

		var onProductMenuItemClick = function (p_sType, p_aArgs, p_oItem) {
			
			var sText = p_oItem.cfg.getProperty("text");
			var sValue = p_oItem.value;			
    		oProductsButton.set("label", sText);
    		oProductsButton.set("value", sValue);	
    		document.getElementById("productmenuval").value=sValue;		

		};

		//	"click" event handler for each item in the Button's menu

		var onVendorMenuItemClick = function (p_sType, p_aArgs, p_oItem) {
			
			var sText = p_oItem.cfg.getProperty("text");			
    		var sValue = p_oItem.value;			
    		oVendorsButton.set("label", sText);		
    		oVendorsButton.set("value", sValue);
    		document.getElementById("vendormenuval").value=sValue;	
			//alert(sValue);
		};
	
		//	Create an array of name and value pairs that serve as the data 
		//	source for the Button instance's menu.
      
var aVendors1 = [
    { text: "All", value: "C00", onclick: { fn: onVendorMenuItemClick } },
	{ text: "Weston Solutions Inc. (GreenGrid®)", value: "C01", onclick: { fn: onVendorMenuItemClick } }
    ];

var aProducts1 = [
    { text: "All", value: "P00", onclick: { fn: onProductMenuItemClick } },
	{ text: "GreenGrid®", value: "P01", onclick: { fn: onProductMenuItemClick } }
];


		//	Create a Button instance, wrapping the text label in an <EM>
		//	tag that will be given a fixed width of 10em.

        var oVendorsButton= new YAHOO.widget.Button({ 
                                        type: "menu", 
                                        id:"vendorbutton", 
                                        label: "<em>Select a Company</em>", 
                                        menu: aVendors1, 
                                        container: "buttoncontainer" }); 

		var oProductsButton = new YAHOO.widget.Button({ 
                                        type: "menu", 
                                        id:"productbutton", 
                                        label: "<em>Select a Product</em>", 
                                        menu: aProducts1, 
                                        container: "productbuttoncontainer" }); 
                                        
                                        
        
		
		//	"selectedMenuItemChange" event handler for a Button that will set 
		//	the Button's "label" attribute to the value of the "text" 
		//	configuration property of the MenuItem that was clicked.
	
		//var onSelectedMenuItemChange = function (event) {

		//	var oMenuItem = event.newValue;

		//	this.set("label", ("<em class=\"yui-button-label\">" + 
		//				oMenuItem.cfg.getProperty("text") + "</em>"));

		//};
		//oVendorsButton.on("selectedMenuItemChange", onSelectedMenuItemChange);
		//oProductsButton .on("selectedMenuItemChange", onSelectedMenuItemChange);		
	});
	

