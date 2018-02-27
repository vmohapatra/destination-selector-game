var get = {};
var post = {};
var render = {};

var fired = false;
var savedPosition = 0;
var lastImgDisplayedNum = 0;

get.images = function (num, callback) {
	$.ajax({
		type: "GET",
		url: "/live",
		data: {
			resource: "IMAGES",
			num: num
		},
		success: callback
	});
};

get.dests = function (postId, num, callback) {
	$.ajax({
		type: "GET",
		url: "/live",
		data: {
			resource: "DESTS",
			num: num,
			postId: postId
		},
		success: callback
	});
};

render.images = function (data) {
		$('#div_loading').show();
		if(data.images.length > 0 ) {
			for (var i=0; i < data.images.length; ++i) {
				var count = lastImgDisplayedNum + i;
				var imgContent = '<div id="div_'+ count +'" class="rowpadding col-xs-12 col-md-4">' +
								'<span id="spn_photoCheck_'+ count +'" class="photoSelect"></span>' +
								'<div id="div_photo_'+ count +'" class="photo" style="background-image: url('+data.images[i]+');"></div>'+
								'</div>';
				$('#div_photoContainer div.row').append(imgContent);
			}

			lastImgDisplayedNum += data.images.length;
			fired = false;
			$('#div_loading').hide();
		}
        else {
			$('#div_loading').hide();
        }
};

render.dests = function (data) {
	if (data.dests) {
		var shortnames = [data.dests.length];
		$('#div_destinationResultContainer div.content').empty();
		for (var i=0; i < data.dests.length; ++i) {
			var d = data.dests[i];
			var div = $('<div id="div_destContainer_'+i+'" class="row destination-card"></div>');
			var wikitext = '';
			var style = '';
			var wikilink = d.name;
			if(d.info != ' ')
			{
				wikilink = '<a href="'+d.url+'" target="_blank">'+d.name+'</a>';
				wikitext = ' wikivoyage.org';
				style = ' style="color: #0065B8;"';
				div.css('cursor', 'pointer');
				div.attr('onclick', 'window.open(\''+d.url + '\',\'_blank\')');
				div.attr('target', '_blank');
			}
			else
			{
				d.info = 'Description not available';
			}


			var destDetailsContainerDiv = $('<div id="div_destDetails_'+i+'" class="title-container"></div>');
			destDetailsContainerDiv.append('<h2 id="hdr_dest_'+i+'" class="destDetailHdr"'+style+'>' + wikilink + '</h2>');
			destDetailsContainerDiv.append('<p id="prg_subTxt_dest_'+i+'" class="destDetailSub">' + d.info +
											'<span id="spn_wiki_'+i+'" class="wiki">'+wikitext+'</span>' +
											'</p>');


			var shortname = d.name.replace(/ /g, '+');//d.name.replace(/,.*/, '').replace(/ /g, '+');
			shortname=shortname.replace("'","%27");
			shortnames[i] = shortname;
			var mapAndTagContainerDiv = $('<div id="div_mapAndTagContainer_'+i+'" class="map-and-match"></div>');

			var mapContainerDiv = $('<div id="div_mapContainer_'+i+'" class="map-container"></div>');
			var mapDiv = $('<div id="div_map_'+i+'" class="map"></div>');

			mapDiv.css('background-image',
					"url(http://maps.googleapis.com/maps/api/staticmap?center=" +
					shortname +
					"&zoom=2&size=360x200&scale=1&sensor=false" +
					"&markers=color:0xFFBE00|" +
					shortname +
					"&style=feature:landscape.natural|saturation:-80|lightness:40" +
					"&key=AIzaSyCc5pRzrMHn-2iOeAPzzAkJH3J--alkJvg)"
					);
			mapContainerDiv.append(mapDiv);

			var tagContainerDiv = $('<div id="div_tagContainer_'+i+'" class="tags-container"></div>');
			tagContainerDiv.append('<h3 id="hdr_tag_'+i+'" class="tagHdr">Matched for...</h3>');
			tagContainerDiv.append('<p id="prg_tag_'+i+'" class="tags">'+d.displayTags+'</p>');

			mapAndTagContainerDiv.append(mapContainerDiv);
			mapAndTagContainerDiv.append(tagContainerDiv);

			div.append(destDetailsContainerDiv);
			div.append(mapAndTagContainerDiv);
			$('#div_destinationResultContainer div.content').append(div);
		}
		$('#div_destinationResultContainer div.content').append('<a id="lnk_wiki" href="http://creativecommons.org/licenses/by-sa/3.0/" target="_blank">Descriptions via CC-by-SA 3.0</a>');
		$('#div_siteContainer section.loading').css('min-height', '150px');
		$('#div_destMapBtnContainer').css('background-image',
					"url(http://maps.google.com/maps/api/staticmap?size=470x220&center=25,0&zoom=1" +
					"&style=feature:water|element:geometry|lightness:-10" +
					"&style=feature:landscape|element:geometry|lightness:-25" +
					"&style=element:labels.text|visibility:off" +
					"&style=element:geometry|saturation:-100" +
					"&markers=color:black|" + shortnames[0] +
					"&markers=color:black|" + shortnames[1] +
					"&markers=color:black|" + shortnames[2] +
					"&markers=color:black|" + shortnames[3] +
					"&markers=color:black|" + shortnames[4] +
					"&sensor=false&key=AIzaSyCc5pRzrMHn-2iOeAPzzAkJH3J--alkJvg)"
					);
	}

	var tempProgress = ((data.selectedImages / data.optimumImages)*100);
	if(tempProgress <= 0)
	{
		$('#hdr_taglineStatic').text("Pick the photos that have what you want in a trip");
	}
	else if (tempProgress < 34 )
	{
		$('#hdr_taglineStatic').text("Keep picking photos to improve your destination matches");
	}
	else if (tempProgress < 67)
	{
		$('#hdr_taglineStatic').text("The more photos the better the matches");
	}
	else if (tempProgress < 101)
	{
		$('#hdr_taglineStatic').text("Click the button to view destinations...");
	}
	else
	{
		$('#hdr_taglineStatic').text("Why not? Keep on picking photos!");
	}
	$('#div_innerProgressLevel').css("height",tempProgress + '%');
	$('#div_destMapProgressLevel').css("height",tempProgress + '%');
	$('#div_innerProgressLevel').css("background-color","#FFC300");
	$('#div_destMapProgressLevel').css("background-color","#FFC300");
	$('#spn_destBtnBgImg').css("background-image","url(../css/img/dest_marker.png)");
	$('#spn_destMapBtnBgImg').css("background-image","none");


};


$(document).ready(function () {

	$(window).on('beforeunload', function() {
		$(window).scrollTop(0);
	});

	window.onhashchange= function(){
		if(window.location.hash=='#photos'){
				$('#div_destinationResultContainer').hide();

				$('#div_siteContainer').show();
				if(gameView.getSelectedImgCount() > 0 ) {
					$('#spn_destBtnBgImg').css("background-image","url(../css/img/dest_marker.png)");
					$('#div_footerContainer').show();
				}
				else {
						$('#div_footerContainer').hide();
				}
				$(window).scrollTop(savedPosition);
		}
		else if(window.location.hash=='#destinations'){
				savedPosition = $(window).scrollTop();
				$('#div_siteContainer').hide();
				$('#div_destinationResultContainer').show();
				$(window).scrollTop(0);
		}
	};

	//Store the position of the fixed tagline container
	var fixedStatusBar = $('#div_fixedTaglineContainer'),
    statusBarPosition = {
        top: fixedStatusBar.position().top
    };

	//Define the scroll behavior
	//Backbone.js does not support scroll event. hence the scroll event should be defined outside backbone view
	$(window).bind('scroll', function () {
		//Check for new images if we scroll to the end of available images in game window
		if (	$('#div_siteContainer').is(":visible") &&
				!fired &&
				($(window).scrollTop() + $(window).height() > $(document).height() - 120)
			) {
			fired = true;
			get.images(6, render.images);
		}

		//Code for sticky header in game window
		if($('#div_siteContainer').is(":visible")) {
			// document.body.scrollTop is deprecated. Use document.documentElement.scrollTop
			// reference link
			// https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js/32011598
			if (fixedStatusBar.position().top < document.documentElement.scrollTop) {
				fixedStatusBar.css({
					position: 'fixed',
					top: '0px'
				});
				$('#div_contentContainer').css({
					'margin-top': statusBarPosition.top
				});
			}
			else if (statusBarPosition.top > document.documentElement.scrollTop && fixedStatusBar.css('position') == 'fixed') {
				fixedStatusBar.css({
					position: 'relative',
				});
				$('#div_contentContainer').css({
					'margin-top': '0px'
				});
			}
		}
	});

});
