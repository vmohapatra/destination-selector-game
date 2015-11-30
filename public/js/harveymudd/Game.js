/**
 * @Author  <mailto:vmohapatra@expedia.com>Vijayalaxmi Mohapatra</mailto>
 */
	/* Model */

	/* View */
	/**
	 * The Harvey Mudd game view
	 */
	 var GameView = Backbone.View.extend({
		 	/**
			 * Attaches `this.el` to an existing element
			 */
			 el: $('body'), 
			/**
			 * Automatically called upon instantiation
			 * You make all types of bindings, excluding UI events, such as clicks, etc
			 */
			 initialize: function() {
				// every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render', 'imageSelected', 'showDestinations', 'backToGame', 'getSelectedImgCount', 'generateRandomNum', 'restartGame', 'launchSurvey');
				this.render();
			 },
			/**
			 * DOM events are bound to View methods. 
			 * Backbone doesn't have a separate controller to handle such bindings 
			 * It all happens in a View.
			 */
			 events: {
				 'click .photo': 'imageSelected',
				 'click #div_destMapBtnBgImgContainer, #div_destinationBtnContainer, #spn_destBtnBgImg, #div_destMapBtnContainer, #spn_destMapBtnBgImg': 'showDestinations',
				 'click #div_bkBtn, #div_resultsHdrTxt': 'backToGame',
				 'click #div_hdrRestartGame, #div_ftrRestartGame': 'restartGame',
				 'click #div_hdrLaunchSurvey, #div_ftrLaunchSurvey': 'launchSurvey'
			 },
			/**
			 * Function in charge of rendering the entire view in this.el. 
			 * Needs to be manually called by the user.
			 */
			 render: function(){
					$('#div_destinationResultContainer').hide();
					get.images(12, render.images);
					
					$('#div_footerContainer').hide();
					window.location.hash='photos';
			 },
			/**
			 * Custom function to return number of selected images
			 */
			 getSelectedImgCount : function() {				 
				 return $('div.photoActive').length;
			 },
			/**
			 * Custom function to post selection / de-selection of image to server
			 */
			 imageSelected : function(evt) {
				 var selectedImg = $(evt.target);				 
				 var checkMark = $(evt.target).parent().children(".photoSelect");				 
				 
				 var selectedImgId = $(evt.target).attr('id');
				 var tempSubstrIndex = document.getElementById(selectedImgId).style.backgroundImage.indexOf('images');
				 var postStr = document.getElementById(selectedImgId).style.backgroundImage.substring(tempSubstrIndex-1);
				 
				 var typeOfPost = 'DEFAULT';
				 if(selectedImg.hasClass('photoActive')) {
					$(evt.target).removeClass("photoActive");
					typeOfPost = "UNACCEPT";
					$(checkMark).css( "display", "none" );
				}
				else {
					$(evt.target).addClass("photoActive");
					$(checkMark).css( "display", "block" );
					typeOfPost = "ACCEPT";
				}
				
				var selImgCount = this.getSelectedImgCount();
				var latestPostUniqueID = this.generateRandomNum()+'-'+this.generateRandomNum()+'-'+this.generateRandomNum()+'-'+this.generateRandomNum()+'-'+this.generateRandomNum() ;
				$.ajax({
					type: "POST",
					url: "/live",
					data: {
						action: typeOfPost,
						target: postStr.substring(0,postStr.length-1),
						imgCount: selImgCount,
						postId: latestPostUniqueID
					}
				})
				.done(function(){})
				.fail(function(){console.log('post fail');})
				.always(function(resp){
					get.dests(latestPostUniqueID, selImgCount, render.dests);
				});
				
				if(this.getSelectedImgCount() > 0 ) {
					$('#spn_destMapBtnBgImg').css("background-image","url(../css/img/loading.gif)");
					$('#spn_destBtnBgImg').css("background-image","url(../css/img/loading.gif)");
					$('#div_innerProgressLevel').css("background-color","#CCCCCC");
					$('#div_destMapProgressLevel').css("background-color","#CCCCCC");
					$('#div_footerContainer').show();
				}
				else {
					$('#div_footerContainer').hide();
				}
			},
		   /**
		    * Custom function to show destinations in a list
		    */
			showDestinations : function(evt) {					
                window.location.hash='destinations';				
			},
		   /**
		    * Custom function to take back to same scrolled position in game
		    */
			backToGame : function(evt) {				
				window.location.hash='photos';
			},
		  /**
		    * Custom function to restart game
		    */
			restartGame : function(evt) {
				window.location.reload();				
			},
		  /**
		    * Custom function to launch survey
		    */
			launchSurvey : function(evt) {
				window.open('https://www.surveymonkey.com/s/PGHBQJF');			
			},
		   /**
		    * Custom function to generate random number
		    */
			generateRandomNum : function() {
				return Math.floor(
    	                Math.random() * 0x10000 /* 65536 */
    	        ).toString(16);
			}			
	 });
	 
	 var gameView = new GameView();//Instantiate the game view
