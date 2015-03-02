	(function($){	
	
		var settings = {};
	
		
		_sampGallery = function(elem){		

			var _self = this, curOffset = 0;

            function openPreview(_this){
                var _thisOffset = $(_this).offset();
                var _thisImg = $(_this).attr('href');
                var fullImg = _thisImg;

                if(typeof $(_this).attr('data-fullsize') !== 'undefined') fullImg = $(_this).attr('data-fullsize');

                var _thisIndex = $(_this).index();
                var prevItem;

                $(elem+' .sampgallery-thumb').each(function(i, item){
                    var itemOffset = $(item).offset();
                    var lastOffset = $(elem+'').children().last().offset();

                        if(itemOffset.top > _thisOffset.top || lastOffset.top == _thisOffset.top){
                            var lastItem = prevItem;

                                if(lastOffset.top == _thisOffset.top) lastItem = $(elem+'').children().last();

                                $(lastItem).after('<div class="sampgallery-preview"><div class="sampgallery-preview-close"></div><a href="'+fullImg+'" target="_blank"><img src="'+fullImg+'" /></div>');
                                $(elem).on('click', ' .sampgallery-preview-close', function(evt){
                                    evt.preventDefault();
                                    closePreview(null, null);}
                                );

                                if(settings.scrolltoitem ){

                                    var tY = ($(elem).find('.sampgallery-preview').offset().top-($(item).height()/2))-settings.scrolloffset.top;
                                        if(tY != curOffset){
                                                $('html, body').stop().animate({scrollTop: tY}, settings.animationspeed, function(){
                                                    curOffset = $(elem).find('.sampgallery-preview').offset().top;
                                                });
                                        }
                                }else{
                                    curOffset = $(elem).find('.sampgallery-preview').offset().top;
                                }

                            return false;
                        }

                    prevItemOffset = itemOffset;
                    prevItem = item;
                });
            }

            function closePreview(callback, args){

                var thisPreview = $(elem).find('.sampgallery-preview');

                    if(thisPreview.length > 0){

                            if(settings.scrolltoitem){
                                    $('html, body').stop().animate({scrollTop: -($(elem).children().first().height())-settings.scrolloffset.top}, settings.animationspeed/2, function(){});
                            }
                            //console.log(thisPreview.offset().top +'!='+ curOffset);
                            if(thisPreview.offset().top != curOffset){

                                    thisPreview.stop().animate({'height':'0','opacity':'0'}, settings.animationspeed/2, function(){
                                        curOffset = thisPreview.offset().top;
                                            thisPreview.remove();
                                            if(typeof callback === "function") callback(args);
                                    });
                            }else{
                                curOffset = thisPreview.offset().top;
                                    thisPreview.remove();
                                    if(typeof callback === "function") callback(args);
                            }
                    }
            }

				$(elem+' .sampgallery-thumb').click(function(evt){
					evt.preventDefault();

                        if($(evt.target).hasClass('sampgallery-active')){
                                $(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
							closePreview(null, null);
                            return false;
						}else{
                                $(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                                if($(elem).find('.sampgallery-preview').length > 0){
                                    closePreview(openPreview, this);
                                }else{
                                    openPreview(this);
                                }
                            $(evt.target).addClass('sampgallery-active');
                        }
				});
			settings.afterinit();
		}
		
		function _setupSampGallery(elem){
			
				$(elem+' .sampgallery-thumb').each(function(i, item){
					/*vanilla js
					var t_img = item.firstChild.src;
						
						if(typeof item.getAttribute('data-thumb') !== 'undefined') t_img = item.getAttribute('data-thumb');					
					item.firstChild.src = t_img;
					
						if(settings.thumbscaled){
							item.firstChild.remove();
								$(item).css({'background-image':'url('+t_img+')'});
						}
					*/
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
					//console.log('Broom.');//function to do after init
				}
			}, options);
				
			var selected = this;
			_setupSampGallery(selected.selector);
			return _sampGallery(this.selector); 			 						 
		
		};		
		/*jQuery.fn.sampGallery.defaults = {}; default options end */				

})($);