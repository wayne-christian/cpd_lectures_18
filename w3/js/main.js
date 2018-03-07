"use strict";

//get width nad height of device. we do not need to wair for the dom
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


//DECLARE GLOBAL VARS
var wall_bg_image;
var wallslider=null;
var pictureSource; // picture source
var destinationType; // sets the format of returned value 
var wallimagedata;
var artmatrix;
var image;
var artCanvas = document.createElement('canvas');
var TO_RADIANS = Math.PI / 180;
var inpg=false;

// Wait for PhoneGap to connect with the device

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready to be used!
//
function onDeviceReady() {
    //console.log("device ready");
	// use for quick checking in browser, bi passes get camera function
	inpg=true;
	// store camera info on devoce ready
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
	console.log(pictureSource, destinationType);

	console.log('device ready', device.platform)
}


// camera functions

// This is the index page
$(document).on('pagecreate', '#my-wall', function() {
    console.log('#my-wall');
    //pictureSource = navigator.camera.PictureSourceType;
    // destinationType = navigator.camera.DestinationType;
	
	
	// this uses the bx slider plugin. relies on html mark up
	// I have stored the instantiation in a variable
	//means I can access it later or remove it if needs be
	wallslider = $('#wallExamples').bxSlider({
                mode: 'fade',
                controls: false,
				auto: true,
                pager: false,
                nextText: '',
                prevText: '',
				preloadImages: 'visible',
				onSliderLoad:function(){
					console.log('loaded');
					$('.wallholder').css("opacity","1"); 
				}

      });
	
	   $('.wallinfoBtn').bind("click", function () {
	   	//console.log('.wallinfoBtn');
	   	event.preventDefault();
	   	$('#wallinfo').show();


	   	if (wallinfoslider != null) {
	   		//console.log('has re bx destroy');
	   		wallinfoslider.destroySlider();
	   	}
	   	//console.log('create bx');

	   	wallinfoslider = $('#wallInfoSlider').bxSlider({
	   		mode: 'fade',
	   		controls: true,
	   		auto: false,
	   		pager: true,
	   		nextText: '',
	   		prevText: '',
	   		preloadImages: 'all',
	   		onSliderLoad: function () {
	   			console.log('loaded');
	   			$('.one_quarter').css("opacity", "1");
	   		}

	   	});


	   	$('.overlayCloseBtn').bind("click", function () {

	   		$('.overlay').hide();
	   	});
	   });
	
	// jquery multiple selectors using , these are two seperate items.
    $('#getImage, #wallExamples li img').on("click", function() {
        console.log('get photo');
		if(inpg){
        capturePhotoWithData();
		}else{
			
		onPhotoDataSuccess(null);	
		}
    });
	
});


//my-wall-edit.html page

$(document).on('pagecreate', '#wall_edit', function() {
	console.log("page create #wall_edit'");
	
	// adds a click event for the right hand side submenu to show based on the location button i.e london

   $('.location').on("click", function() {
	   //prevent any default actions i.e if there was href/link
        event.preventDefault();
	   
	   //hide all submenus with class gallery-choice
        $('.gallery-choice').hide();
	   //bit dirty but using the this referent which is the item taht was clicked
	   // use jquery data method. gets teh value of data-location attribute
        var location_menu = '#' + $(this).data('location');
	   //show it
        $(location_menu).show();

    });
	
	// add click events to all submenus although they are hidden
    $('.wall-thumbnail').on("click", function() {
		console.log("wall click");
		
		//store the associated image to show in the edit wall area
		// note these are larger images and not the thumbnails as they will be full screen
		//size need to cater for all screens i.e ipad retina
        var wall_link = $(this).data('src');
		
		//custom function PASSING THE SELECTED IMAGE and changes page
        add_wall_image(wall_link);
		//HIDE SUBMENU
        $('.gallery-choice').hide();
		
		//Shows a save icon to store 
		$('.createwall').show();


    });
    

    //console.log('#wall_edit');
	// for testing. if we want to test the page we can load an placeholder image 
	//other wise the edit wall page relies on a previous image selection
   
	if (!wallimagedata) {
        wallimagedata = 'ASSETS/wall-temp.jpg';
    }
	
	//gets the image date and used it as a background image (data uri - base 64)
	//uncomment below to simply update the back ground css - good for speed, NOT good to manipulate
	//$('#wall_image_holder').css('background-image', 'url(' + wallimagedata + ')');
   //console.log(wallimagedata);
	
	
	//get a canvas element already in the page, better to use js than jquery here.
	//easyier to get a pre styled element than inject back into the dom
	wall_bg_image = document.getElementById("canvas_wall_image");
	
	//set width and height to the screen size. look at the top of the page
    wall_bg_image.width = w;
    wall_bg_image.height = h;
	
	
	//we draw to the ctx not canvas... remember level 1
    var imgctx = wall_bg_image.getContext("2d");
	
	//create an image object
    var imageObj = new Image();
    imageObj.onload = function() {
        
		//dont worry too much about this but we need to redraw the photo in proportion.. why?
        drawImageProp(imgctx, imageObj, 0, 0, w, h);
    };
	
	//set the src of the image object to the photo taken which will then fire th eload event above
    imageObj.src = wallimagedata;

    
	// add a click event to save image
	$('.saveBtn').on("click", function() {
		// custom function to create an image
        createwallcanvas();
    });





});

// Called when a photos data is successfully retrieved
//
function onPhotoDataSuccess(imageData) {

	// store image data so we can manipulate it, put it in a canvas or img tag
	//this is a global variable and can be accessed when we want - jqm uses ajax so there is no page refresh
	// so we can store and access with no issues
    wallimagedata = imageData;
	
	// this tells JQM to load in a new page programmatically not through a link
    $(":mobile-pagecontainer").pagecontainer("change", 'my-wall-edit.html', {
        transition: "slide",
        showLoadMsg: true
    });
}

// Called when a photos file is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
    // Get image handle
    //alert('image taken');
    console.log(JSON.stringify(imageData));

    var wallImage = new Image();

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    wallImage.src = imageData;
    document.body.appendChild(wallImage);
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI 
    console.log('image uri is',imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhotoWithData() {
	console.log('photo event fired');
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 80,
        correctOrientation: true
    });
}

function capturePhotoWithFile() {
    navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 80,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

// Called if something bad happens.
// 
function onFail(message) {
    alert('Failed because: ' + message);
}


// this combines the background and artwork canvaes as one image so cn be stored 
function createwallcanvas() {

	//artmatrix is an array of x, y, scale and rotation of the html draggable artwork - is is part of the interact.js. 
	// we then redraw to a hidden canvas and save as an image. // you could use the screen grab plugin
	// but you will need to hide the navs
	
    console.log(artmatrix);

    artCanvas.width = w;
    artCanvas.height = h;
    var artCtx = artCanvas.getContext('2d');
    artCtx.save();
    artCtx.strokeStyle = '#000';
    var stroke = 12 * artmatrix.scale; // some color/style
    artCtx.lineWidth = stroke;

    //console.log('check', artmatrix);


    //artCtx.scale(artmatrix.scale);
    artCtx.shadowColor = "rgba( 0, 0, 0, 0.3 )";
    artCtx.shadowBlur = 3;
    artCtx.shadowOffsetX = 1;
    artCtx.shadowOffsetY = 1;
    artCtx.translate(artmatrix.x, artmatrix.y);
    artCtx.rotate(artmatrix.angle * TO_RADIANS);
    //artCtx.translate( artmatrix.x, artmatrix.y );
    artCtx.drawImage(image, -(artmatrix.width / 2), -(artmatrix.height / 2), artmatrix.width, artmatrix.height);
    artCtx.strokeRect(-(artmatrix.width / 2) - 6, -(artmatrix.height / 2) - 6, artmatrix.width + 6, artmatrix.height + 6);

    // and restore the co-ords to how they were when we began
    artCtx.restore();
    //document.body.appendChild(artCanvas);	
	$.mobile.loading('show', {
            text: 'Saving wall art to your photo library',
            textVisible: true,
        });
        // create backing canvas
        var backCanvas = document.createElement('canvas');
        backCanvas.width = w;
        backCanvas.height = h;
        var backCtx = backCanvas.getContext('2d');


        // save main canvas contents
        backCtx.drawImage(wall_bg_image, 0, 0);
        backCtx.drawImage(artCanvas, 0, 0);
		
		document.body.appendChild(backCanvas);	
	console.log('storeimage');

	// creates an image from canvas and saves it to the library
	// note that this will not work with PHONEGAP DESKTOP YOU WILL NEED OT BUILD
        window.canvas2ImagePlugin.saveImageDataToLibrary(
            function(msg) {
				
				// just set a 3 second time out to catch the image and give feedback to user than somehing is happening
                setTimeout(function() {
                    $.mobile.loading('hide');	
                }, 3000);

               
            },
            function(err) {
                console.log(err);
            },
            backCanvas
        );
	
	/*
	take screen shot instead
	navigator.screenshot.save(function (error, res) {
		if (error) {
			console.error(error);
		} else {
			console.log('ok', res.filePath);
		}
	}, 'jpg', 80);*/

}

function add_wall_image(wall_link) {
    console.log('start gestures', wall_link);

    image = new Image();

    image.onload = function() {
		console.log('image loaded');
        $('#artwork_image').attr("src", wall_link).show();
        $('#artworkholder').show();
        $('#rotate-holder').attr('data-x', w / 2).attr('data-y', h / 2);
        artmatrix = {
            x: (w / 2),
            y: (h / 2),
            scale: 1,
            angle: 0,
            width: $('#artwork_image').width(),
            height: $('#artwork_image').height()
        };
        var angle = 0;

        var scale = 1,
            gestureArea = document.getElementById('rotate-holder'),
            scaleElement = document.getElementById('artwork_image'),
            rotateElement = document.getElementById('artwork_image'),
            resetTimeout;

        interact(gestureArea)
            .gesturable({
                onstart: function(event) {
                    clearTimeout(resetTimeout);
                    scaleElement.classList.remove('reset');
                },
                onmove: function(event) {
                    scale = scale * (1 + event.ds);
                    angle += event.da;

                    scaleElement.style.webkitTransform =
                        scaleElement.style.transform =
                        'scale(' + scale + ') rotate(' + angle + 'deg) translate(-50%,-50%)';

                    dragMoveListener(event);

                },
                onend: function(event) {
                    //scaleElement.classList.add('reset');
                    ////console.log('end',artmatrix);
                }
            }).draggable({
                    onmove: dragMoveListener,
                    onend: function(event) {
                        ////console.log('drag end',artmatrix);
                    }
                }

            );

        function reset() {
            scale = 1;
            scaleElement.style.webkitTransform =
                scaleElement.style.transform =
                'scale(1)';
        }

        // listen to movements

        function dragMoveListener(event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            artmatrix = {
                x: x,
                y: y,
                scale: scale,
                angle: angle,
                width: $('#artwork_image').width() * scale,
                height: $('#artwork_image').height() * scale
            };
            //console.log('drag', artmatrix);
        }

        // this is used later in the resizing and gesture demos
        window.dragMoveListener = dragMoveListener;

    };
    image.src = wall_link;
    $('.gallery-choice').hide();
    //sort out gestures and scale, rotate etc


}


// draw image proportionally function // you dont need to understand but useful
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, // new prop. width
        nh = ih * r, // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

