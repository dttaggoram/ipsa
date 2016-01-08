/****************************************
	Barebones Lightbox Template
	by Kyle Schaeffer
	kyleschaeffer.com
	* requires jQuery
****************************************/

// Parse variables from URL
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


// display the lightbox
function lightbox(ajaxContentMPName){

	// add lightbox/shadow <div/>'s if not previously added
	if($('#lightbox').size() == 0){
		var theLightbox = $('<div id="lightbox"/>');
		var theShadow = $('<div id="lightbox-shadow"/>');
		$(theShadow).click(function(e){
			closeLightbox();
		});
		$('body').append(theShadow);
		$('body').append(theLightbox);
	}

	// remove any previously added content
	$('#lightbox').empty();

	// insert AJAX content
	if(ajaxContentMPName != null){
		// temporarily add a "Loading..." message in the lightbox
		$('#lightbox').append('<p class="loading">Loading...</p>');

		url = ajaxContentMPName.split(",");
		// request AJAX content
		$.ajax({
			type: 'GET',
			url: "http://data.parliament.uk/membersdataplatform/services/mnis/members/query/surname*" + url[1] + "%7Cforename*" + url[0] + "/",
			success:function(data){
				// remove "Loading..." message and append AJAX content
				$('#lightbox').empty();
				mpdata = data.getElementsByTagName("Members")[0].childNodes[0].innerHTML;
				$('#lightbox').append("<p>" + mpdata + "</p>");
				console.log(mpdata);
			},
			error:function(){
				alert('AJAX Failure!');
			}
		});
		

	}

	// move the lightbox to the current window top + 100px
	$('#lightbox').css('top', $(window).scrollTop() + 50 + 'px');
	$('#lightbox').width( window.innerWidth - 100 + 'px');

	// display the lightbox
	$('#lightbox').show();
	$('#lightbox-shadow').show();

}

// close the lightbox
function closeLightbox(){

	// hide lightbox and shadow <div/>'s
	$('#lightbox').hide();
	$('#lightbox-shadow').hide();

	// remove contents of lightbox in case a video or other content is actively playing
	$('#lightbox').empty();
}