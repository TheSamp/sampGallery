	(function($){	
	
		var settings = {};
	
		
		_sampGallery = function(elem){		

			_self = this;
			
				$(elem+' .sampgallery-thumb').click(function(e){
					e.preventDefault();					
						
						if($(e.target).hasClass('sampgallery-active')){
							closePreview();
								$(e.target).removeClass('sampgallery-active');
							return false;
							
						}else $(e.target).addClass('sampgallery-active');
					
					var thisOffset = $(this).offset();
					var thisImg = $(this).attr('href');
					var fullImg = thisImg;
					
						if(typeof $(this).attr('data-fullsize') !== 'undefined') fullImg = $(this).attr('data-fullsize');

					var thisIndex = $(this).index();
					var prevItem;
					
					$(elem+' .sampgallery-thumb').each(function(i, item){
						var itemOffset = $(item).offset();
						var lastOffset = $(elem+'').children().last().offset();
						
							if(itemOffset.top > thisOffset.top || lastOffset.top == thisOffset.top){
								var lastItem = prevItem;

									if(lastOffset.top == thisOffset.top) lastItem = $(elem+'').children().last();
									
									$(lastItem).after('<div class="sampgallery-preview"><div class="sampgallery-preview-close"></div><a href="'+fullImg+'" target="_blank"><img src="'+fullImg+'" /></div>');
									$(elem+' .sampgallery-preview-close').click(closePreview);
									
											if(settings.scrolltoitem) $('html, body').stop().animate({scrollTop: ($(elem).find('.sampgallery-preview').offset().top-($(item).height()/2))-settings.scrolloffset.top}, settings.animationspeed);
											
								return false;
							}
		
						prevItemOffset = itemOffset;
						prevItem = item;
					});
					
					
				});


			function closePreview(e){	
					
					$(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
						
						var thisPreview = $(elem).find('.sampgallery-preview');
						
					if(thisPreview.length != 0){
							
							if(settings.scrolltoitem){
								 $('html, body').stop().animate({scrollTop: thisPreview.offset().top-($(elem).children().first().height())-settings.scrolloffset.top}, settings.animationspeed/2, function(){
		
								});
							}											
						
						 thisPreview.stop().animate({'height':'0','opacity':'0'}, settings.animationspeed/2, function(){
									 thisPreview.remove();	
							});
						 
					}
			}

			
			settings.afterinit();
		}
		
		function _setupSampGallery(elem){
			
				$(elem+' .sampgallery-thumb').each(function(i, item){

					/*
					vanilla js
					var t_img = item.firstChild.src;
						
						if(typeof item.getAttribute('data-thumb') !== 'undefined') t_img = item.getAttribute('data-thumb');					
					item.firstChild.src = t_img;
					
						if(settings.thumbscaled){
							item.firstChild.remove();
								$(item).css({'background-image':'url('+t_img+')'});
						}*/
					var t_img = jQuery(item).attr('src');
						
						if(typeof jQuery(item).attr('data-thumb') !== 'undefined') t_img = jQuery(item).attr('data-thumb');					
					jQuery(item).attr('src', t_img);
					
						if(settings.thumbscaled){
							jQuery(item).find('img').first().remove();
								$(item).css({'background-image':'url('+t_img+')'});
						}
						
				});
		
		}


		jQuery.fn.sampGallery = function(options){			
			/*options*/
			settings = jQuery.extend({				
				scrolltoitem: true,//Scroll page to preview
				scrolloffset: {top:0},//if needed to add top offset example fixed header
				animationspeed: 1000,
				thumbscaled: true,//use thumbs as background-images
				afterinit: function(){
					console.log('Broom.');//function to do after init
				}
			}, options);
				
			var selected = this;
			_setupSampGallery(selected.selector);
			return _sampGallery(this.selector); 			 						 
		
		};		
		/*jQuery.fn.sampGallery.defaults = {}; default options end */				

})($);