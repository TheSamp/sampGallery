	(function($){	
	
		var settings = {};
	
		
		_sampGallery = function(elem){		

			var _self = this,  _curItemOffset = {top:-1, left:-1};//store current thumb offset

            function realImgDimension(img) {
                var i = new Image();
                i.src = img.src;
                return {
                    naturalWidth: i.width,
                    naturalHeight: i.height
                };
            }

            function openPreview(_this){
                //var cTotal = $(elem+' .sampgallery-thumb').length;//var _thisIndex = $(_this).index();
                var _thisOffset = $(_this).offset();
                var prevItem = $(elem).children().first();
                var cLast = $(elem+' .sampgallery-thumb').last();
                var lastOffset = cLast.offset();
                var curPreview = $(elem).find('.sampgallery-preview');
                var _thisImg = new Image();
                _thisImg.src = $(_this).attr('href');

                    _thisImg.addEventListener('load', function() {

                        var realSize = realImgDimension(this);
                        var previewDims = {'w':$(elem).width(),'h':$(window).height()-$(_this).height()};
                        var aratio = (previewDims.h/realSize.naturalHeight);
                        var maxPcs = {'w':(previewDims.w-80)/previewDims.w, 'h':1};//image max sixes//-80 for icons left and right side. Fix later just to right side
                        var newDims = {'w':previewDims.w, 'h':previewDims.h};

                            /*if(aratio < 1 && (realSize.naturalWidth > realSize.naturalHeight)){
                                newDims.h = previewDims.h*aratio;
                            }*/

                        var fullImgPath = this.src;
                        var toHeight = newDims.h+'px';

                            if(typeof $(_this).attr('data-fullsize') !== 'undefined') fullImgPath = $(_this).attr('data-fullsize');

                            $(elem+' .sampgallery-thumb').each(function(i, item){
                                var itemOffset = $(item).offset();

                                    if(itemOffset.top > _thisOffset.top || _thisOffset.top == lastOffset.top){

                                        var lastItem = prevItem;

                                            if( _thisOffset.top == lastOffset.top){
                                                lastItem = cLast;
                                            }

                                            if((_curItemOffset.top === _thisOffset.top) && typeof curPreview != 'undefined' && curPreview.length > 0){

                                                    curPreview.addClass('sampgallery-loading').find('a').attr('href', fullImgPath).find('img').attr('src', fullImgPath);
                                                    curPreview.animate({'height':toHeight}, settings.animationspeed/2, function(){
                                                        $(this).removeClass('sampgallery-loading');
                                                    });

                                                $(_this).addClass('sampgallery-active');

                                            }else{

                                                var oHtml = '<div class="sampgallery-preview sampgallery-loading"><div class="sampgallery-preview-close"></div><a href="'+fullImgPath+'" target="_blank"><img src="'+fullImgPath+'" style="max-width:'+(maxPcs.w*100)+'%;max-height:'+(maxPcs.h*100)+'%" /></a></div>';
                                                    if(typeof curPreview != 'undefined' && curPreview.length > 0){
                                                        closePreview(function(){
                                                                $(lastItem).after(oHtml);
                                                                $(_this).addClass('sampgallery-active');
                                                                $(elem).find('.sampgallery-preview').animate({'height':toHeight}, settings.animationspeed/2, function(){
                                                                        $(this).removeClass('sampgallery-loading');
                                                                });
                                                        }, null);
                                                    }else{
                                                            $(lastItem).after(oHtml);
                                                            $(_this).addClass('sampgallery-active');
                                                            $(elem).find('.sampgallery-preview').animate({'height':toHeight}, settings.animationspeed/2, function(){
                                                                    $(this).removeClass('sampgallery-loading');
                                                            });
                                                    }
                                            }

                                            if(settings.scrolltoitem ){
                                                      $('html, body').stop().animate({scrollTop: _thisOffset.top-settings.scrolloffset.top+'px'}, settings.animationspeed);
                                            }
                                        return false;
                                    }
                                prevItem = item;
                            });
                        _curItemOffset = _thisOffset;
                    });
                _thisImg = null;
            }


            function closePreview(callback, args){

                var thisPreview = $(elem).find('.sampgallery-preview');
                var thisItem = $(elem).find('.sampgallery-thumb.sampgallery-active');
                    if(typeof thisItem.offset() != 'undefined') _curItemOffset = thisItem.offset().top-thisPreview.offset().top;

                    if(thisPreview.length > 0){

                            thisPreview.stop().animate({'height':'0px'}, settings.animationspeed/2, function(){
                                    thisPreview.remove();//,'opacity':'0'
                                    if(typeof callback === "function") callback(args);
                            });

                            $(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                    }
            }

				$(elem).on('click', '.sampgallery-thumb', function(evt){

					evt.preventDefault();

                        if($(evt.target).hasClass('sampgallery-active')){
							closePreview(null, null);
                            return false;
						}else{
                                $(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                            openPreview(this);
                        }
				});

                $(elem).on('click', '.sampgallery-preview-close', function(evt){
                    evt.preventDefault();
                    closePreview(null, null);
                });
			settings.afterinit();
            return _self;
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