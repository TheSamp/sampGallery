	(function($){	
	
		var settings = {};
	
		
		_sampGallery = function(elem){		

			_self = this;
			
				$(elem+' a.box').click(function(e){
					e.preventDefault();
					closePreview();
					
					var thisOffset = $(this).offset();
					var thisImg = $(this).attr('href');
					var fullImg = thisImg;
						if(typeof $(this).attr('data-fullsize') !== 'undefined') fullImg = $(this).attr('data-fullsize');
					var thisIndex = $(this).index();
					var prevItem;
					
					$(elem+' a.box').each(function(i, item){
						var itemOffset = $(item).offset();
						var lastOffset = $(elem+'').children().last().offset();
						
							if(itemOffset.top > thisOffset.top || lastOffset.top == thisOffset.top){
								var lastItem = prevItem;

									if(lastOffset.top == thisOffset.top) lastItem = $(elem+'').children().last();
									
									$(lastItem).after('<div class="sampgallery-preview"><div class="sampgallery-preview-close"></div><a href="'+fullImg+'" target="_blank"><img src="'+fullImg+'" /></div>');
									$(elem+' .sampgallery-preview-close').click(closePreview);
									$('html, body').stop().animate({scrollTop: $(elem).find('.sampgallery-preview').offset().top}, 500);
								return false;
							}
		
						prevItemOffset = itemOffset;
						prevItem = item;
					});
					
					
				});


			function closePreview(e){		
					if($(elem).find('.sampgallery-preview').length != 0){
							//$('#sampgallery-preview').animate({'height':0}, 1000, function(){
							$('html, body').stop().animate({scrollTop: $(elem).find('.sampgallery-preview').offset().top-($(elem).children().first().height())}, 500);
							$(elem).find('.sampgallery-preview').remove();
									
						//	});
						 
					}
			}

			
			settings.afterinit();
		}
		
		function _setupSampGallery(elem){
		
				
		
		}


		jQuery.fn.sampGallery = function(options){			
			/*options*/
			settings = jQuery.extend({				
				gotoitem: true,
				afterinit: function(){
					console.log('Broom.');
				}
			}, options);
				
			var selected = this;
			_setupSampGallery(selected.selector);
			return _sampGallery(this.selector); 			 						 
		
		};		
		
		/*jQuery.fn.sampGallery.defaults = {}; default options end */				

})($);