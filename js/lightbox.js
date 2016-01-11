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

		//url = ajaxContentMPName.split(",");
		// request AJAX content
		$.ajax({
			type: 'GET',
			url: "http://data.parliament.uk/membersdataplatform/services/mnis/members/query/name*" + ajaxContentMPName + "%7CMembership=all/Interests%7CGovernmentPosts%7COppositionPosts/",
//			url: "http://data.parliament.uk/membersdataplatform/services/mnis/members/query/surname*" + url[1] + "%7Cforename*" + url[0] + "/BiographyEntries%7CCommittees%7CExperiences%7CGovernmentPosts%7CInterests%7COppositionPosts%7CParliamentaryPosts/",
			success:function(data){
				// remove "Loading..." message and append AJAX content
				$('#lightbox').empty();
				//console.log("http://data.parliament.uk/membersdataplatform/services/mnis/members/query/name*" + ajaxContentMPName + "&7CMembership=all/Interests%7CGovernmentPosts%7COppositionPosts/")
				mpdata = data.getElementsByTagName("Members")[0].childNodes[0];
				mpdatafullname = mpdata.getElementsByTagName("FullTitle")[0].childNodes[0].nodeValue;
				//mpdataministername = mpdata.getElementsByTagName("LayingMinisterName")[0].childNodes[0].nodeValue;
				mpdataparty = mpdata.getElementsByTagName("Party")[0].childNodes[0].nodeValue;
				mpdataconstituency = mpdata.getElementsByTagName("MemberFrom")[0].childNodes[0].nodeValue;
				mpdatampsince = mpdata.getElementsByTagName("HouseStartDate")[0].childNodes[0].nodeValue;
				mpdatampinterests = mpdata.getElementsByTagName("Interests")[0].getElementsByTagName("Category");
				mpdatampGovernmentPosts = mpdata.getElementsByTagName("GovernmentPosts")[0].getElementsByTagName("GovernmentPost");
				mpdatampOppositionPosts = mpdata.getElementsByTagName("OppositionPosts")[0].getElementsByTagName("OppositionPost");

				var posts = "";
				for (i=0; i<mpdatampGovernmentPosts.length; i++) {

					if (mpdatampGovernmentPosts[i].getElementsByTagName("EndDate")[0].childNodes[0] == undefined) {
						enddate = "current";
					}
					else { 
						enddate = mpdatampGovernmentPosts[i].getElementsByTagName("EndDate")[0].childNodes[0].nodeValue;
					}

					posts += "<p>" + mpdatampGovernmentPosts[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
					posts += " from " + mpdatampGovernmentPosts[i].getElementsByTagName("StartDate")[0].childNodes[0].nodeValue;
					posts += " to " + enddate + "</p>";
				}

				for (i=0; i<mpdatampOppositionPosts.length; i++) {

					if (mpdatampOppositionPosts[i].getElementsByTagName("EndDate")[0].childNodes[0] == undefined) {
						enddate = "current";
					}
					else { 
						enddate = mpdatampOppositionPosts[i].getElementsByTagName("EndDate")[0].childNodes[0].nodeValue;
					}

					posts += "<p>" + mpdatampOppositionPosts[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
					posts += " from " + mpdatampOppositionPosts[i].getElementsByTagName("StartDate")[0].childNodes[0].nodeValue;
					posts += " to " + enddate + "</p>";
				}


				var interests = "<h3>Registered Financial Interests</h3><ul>";
				for (i=0; i<mpdatampinterests.length; i++) {
					interests += "<li>Category:" + mpdatampinterests[i].getAttribute("Name")+"<ul>";
					for (j=0; j<mpdatampinterests[i].childNodes.length; j++) {
						interests += "<li>" + mpdatampinterests[i].childNodes[j].getElementsByTagName("RegisteredInterest")[0].childNodes[0].nodeValue + "</li>";
					}
					interests += "</ul></li>";
				}
				interests += "</ul>";



				mpoutput = "<div id='lightboxcontent'>";
				mpoutput += "<div style='position:absolute; top:10px; right:10px'><a id='closebutton' href='#' onclick='closeLightbox()'>Close</a></div>";
				mpoutput += "<h1>"+mpdatafullname+"</h1>";
				//mpoutput += "<h2>"+mpdataministername+"</h2>";
				mpoutput += "<h4>Party: "+mpdataparty+" | Constituency: " + mpdataconstituency + " | MP since:" + mpdatampsince + "</h4>";
				mpoutput += posts;
				mpoutput += "<h3>Expenses Details</h3><table id='lightboxexpenses' class='table table-striped'></table>";
				mpoutput += "<div id='lightbox-line-chart'></div>";
				mpoutput += interests;
				mpoutput += "</div>";
				$('#lightbox').append(mpoutput);
				$('body').append(theShadow);
				$("#lightboxexpenses").html($("#mptable").html());
				lightboxlinechart();

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