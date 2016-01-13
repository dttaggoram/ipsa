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

		url = ajaxContentMPName.split(" ");
		// request AJAX content
		$.ajax({
			type: 'GET',
			url: "http://data.parliament.uk/membersdataplatform/services/mnis/members/query/surname*" + url[1] + "%7Cforename*" + url[0] + "%7CMembership=all/Interests%7CConstituencies/",
			success:function(data){

				var monthNames = [
				  "January", "February", "March",
				  "April", "May", "June", "July",
				  "August", "September", "October",
				  "November", "December"
				];


				// remove "Loading..." message and append AJAX content
				$('#lightbox').empty();
				
				mpdata = data.getElementsByTagName("Members")[0].childNodes[0];
				mpdatafullname = mpdata.getElementsByTagName("FullTitle")[0].childNodes[0].nodeValue;
				mpdataparty = mpdata.getElementsByTagName("Party")[0].childNodes[0].nodeValue;
				mpdataconstituency = mpdata.getElementsByTagName("MemberFrom")[0].childNodes[0].nodeValue;
				mpdatampsince = mpdata.getElementsByTagName("HouseStartDate")[0].childNodes[0].nodeValue;
				mpdatampinterests = mpdata.getElementsByTagName("Interests")[0].getElementsByTagName("Category");
				mpdatampConstituencyPosts = mpdata.getElementsByTagName("Constituencies")[0].getElementsByTagName("Constituency");
				var posts = "";
				for (i=0; i<mpdatampConstituencyPosts.length; i++) {
					if (mpdatampConstituencyPosts[i].getElementsByTagName("EndDate")[0].childNodes[0] == undefined) {
						enddate = "current";
					}
					else { 
						enddate = new Date(mpdatampConstituencyPosts[i].getElementsByTagName("EndDate")[0].childNodes[0].nodeValue);
						enddate = enddate.getDate() + " " + monthNames[enddate.getMonth()] + " " + enddate.getFullYear();
					}

					startdate = new Date(mpdatampConstituencyPosts[i].getElementsByTagName("StartDate")[0].childNodes[0].nodeValue);



					posts += "<p>" + mpdatampConstituencyPosts[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
					posts += " from " + startdate.getDate() + " " + monthNames[startdate.getMonth()] + " " + startdate.getFullYear();
					posts += " to " + enddate + "</p>";
				}

				var interests = "<h3>Registered Financial Interests</h3><ul>";
				if (mpdatampinterests.length > 0) {
					for (i=0; i<mpdatampinterests.length; i++) {
						interests += "<li>Category:" + mpdatampinterests[i].getAttribute("Name")+"<ul>";
						for (j=0; j<mpdatampinterests[i].childNodes.length; j++) {
							if(mpdatampinterests[i].childNodes[j]>0) {
								interests += "<li>" + mpdatampinterests[i].childNodes[j].getElementsByTagName("RegisteredInterest")[0].childNodes[0].nodeValue + "</li>";
							}
						}
						interests += "</ul></li>";
					}
					interests += "</ul>";
				} 
				else {
					interests += "<p>No registered financial interests for these dates."
				}




				since = new Date(mpdatampsince);
				//until = new Date()

				mpoutput = "<div id='lightboxcontent'>";
				mpoutput += "<div style='position:absolute; top:10px; right:10px'><a id='closebutton' href='#' onclick='closeLightbox()'>Close</a></div>";
				mpoutput += "<h1>"+mpdatafullname+"</h1>";
				mpoutput += "<h4>Party: "+mpdataparty+"</h4>";
				mpoutput += posts;
				mpoutput += "<h3>Expenses Change Over the Past 3 Years</h3>";
				mpoutput += "<div id='lightbox-line-chart'></div>";
				mpoutput += "<p><a href='#'>Download this data</a></p>";
				mpoutput += interests;
				mpoutput += "</div>";
				$('#lightbox').append(mpoutput);
				lightboxlinechart(ajaxContentMPName);

				if($('#lightbox').height()<window.innerHeight) {
					shadowheight = window.innerHeight;
				}
				else {
					shadowheight = $('#lightbox').height() + $('#navbar').height() + 50;
				}
				$('#lightbox-shadow').height(shadowheight);

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
	$('#lightbox-shadow').height($('#lightbox').height+1000);



	$(document).keyup(function(e) { 
        if (e.keyCode == 27) { // esc keycode
			closeLightbox()
        }
    });


}

// close the lightbox
function closeLightbox(){

	// hide lightbox and shadow <div/>'s
	$('#lightbox').hide();
	$('#lightbox-shadow').hide();

	// remove contents of lightbox in case a video or other content is actively playing
	$('#lightbox').empty();
}
