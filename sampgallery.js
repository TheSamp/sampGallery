	(function($){	
	
		var settings = {};
	
		
		_sampGallery = function(elem){		

			var _self = this,  _curItemOffset = {top:-1, left:-1}, _curThbDims = {'w':0,'h':0}, _curImgDims = {'w':0,'h':0}, _curPreviewDims = {'w':0,'h':0};//store current thumb offset

            function realImgDimension(img) {
                var i = new Image();
                i.src = img.src;
                return {
                    w: i.width,
                    h: i.height
                };
            }
            
            function buildControls(url){
                    if($(elem).find('.sampgallery-ctrls').length > 0) $(elem).find('.sampgallery-ctrls').remove();
                var cHtml = '<div class="sampgallery-ctrls">';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-close"></a>';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-zoomin"></a>';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-zoomout"></a>';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-openimage" href="'+url+'" target="_blank"></a>';
                cHtml += '</div>';
                return cHtml;
            }

            function openPreview(_this){
                //var cTotal = $(elem+' .sampgallery-thumb').length;//var _thisIndex = $(_this).index();
                _curThbDims.w = $(_this).outerWidth();
                _curThbDims.h = $(_this).outerHeight();
                $(_this).addClass('sampgallery-loading');
                var _thisOffset = $(_this).offset();
                var prevItem = $(elem).children().first();
                var cLast = $(elem+' .sampgallery-thumb').last();
                var lastOffset = cLast.offset();
                var curPreview = $(elem).find('.sampgallery-preview');
                var _thisImg = new Image();
                _thisImg.src = $(_this).attr('href');

                    _thisImg.addEventListener('load', function() {

                        _curImgDims = realImgDimension(this);
                        var fullImgPath = this.src;

                            if(typeof $(_this).attr('data-fullsize') !== 'undefined') fullImgPath = $(_this).attr('data-fullsize');

                            $(elem+' .sampgallery-thumb').each(function(i, item){
                                var itemOffset = $(item).offset();

                                    if(itemOffset.top > _thisOffset.top || _thisOffset.top == lastOffset.top){

                                        var lastItem = prevItem;

                                            if( _thisOffset.top == lastOffset.top){
                                                lastItem = cLast;
                                            }

                                            if((_curItemOffset.top === _thisOffset.top) && typeof curPreview != 'undefined' && curPreview.length > 0){

                                                    curPreview.prepend(buildControls(fullImgPath)).find('a').attr('href', fullImgPath).find('img').attr('src', fullImgPath);
                                                previewFit(function(){
                                                        $(_this).addClass('sampgallery-active');
                                                }, null);

                                            }else{

                                                var oHtml = '<div class="sampgallery-preview">'+buildControls(fullImgPath)+'<a href="'+fullImgPath+'" target="_blank"><img src="'+fullImgPath+'"></a></div>';
                                                    if(typeof curPreview != 'undefined' && curPreview.length > 0){
                                                        closePreview(function(){
                                                                $(lastItem).after(oHtml);
                                                            previewFit(function(){
                                                                    $(elem+' .sampgallery-thumb').removeClass('sampgallery-loading');
                                                                    $(_this).addClass('sampgallery-active');
                                                            }, null);
                                                        }, null);
                                                    }else{
                                                            $(lastItem).after(oHtml);
                                                        previewFit(function(){
                                                            $(elem+' .sampgallery-thumb').removeClass('sampgallery-loading');
                                                            $(_this).addClass('sampgallery-active');
                                                        }, null);
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
                                    thisPreview.remove();
                                    if(typeof callback === 'function') callback(args);
                            });

                            $(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                    }
            }

				$(elem).on('click', '.sampgallery-thumb', function(evt){

					evt.preventDefault();

                        if($(this).hasClass('sampgallery-active')){
							closePreview(null, null);
                            return false;
						}else{
                                $(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                            openPreview(this);
                        }
				});

                $(elem).on('click', '.sampgallery-ctrl-close', function(evt){
                    evt.preventDefault();
                    closePreview(null, null);
                });

                function previewFit(cb,args){
                    var previewDims = {'w':$(elem).outerWidth(),'h':$(window).height()-_curThbDims.h-settings.scrolloffset.top-settings.scrolloffset.bottom};
                    _curPreviewDims = previewDims;
                    var toHeight = previewDims.h;
                    var prv = $(elem).find('.sampgallery-preview');
                        //prv.find('a > img').attr('style', 'max-width:'+(maxPcs.w*100)+'%;max-height:'+(maxPcs.h*100)+'%');
                        prv.animate({'height':toHeight}, settings.animationspeed/2, function(){
                                $(elem+' .sampgallery-thumb').removeClass('sampgallery-loading');
                                if(typeof cb === 'function') cb(args);
                        });
                }

                function previewZoomin(cb,args){
                    var prv = $(elem).find('.sampgallery-preview');
                    var prvImg = prv.find('a > img');
                    var scaledDims = {'w': prvImg.width(),'h':prvImg.height()};
                    var zD = scaledDims;
                        //prv.find('a > img').removeAttr('style');
                    var isHorizontal = true;
                    var rat = _curPreviewDims.w/scaledDims.w;
                    var pads = prv.css('padding');//+prv.css('padding-bottom');
                    pads = pads.replace('px','');

                        if(_curImgDims.w <= _curImgDims.h) isHorizontal = false;

                        if(!isHorizontal){
                            zD.h = _curImgDims.h;
                        }else{
                            zD.h = Math.round(scaledDims.h*rat);
                        }

                    zD.h = zD.h+parseInt(pads*2);

                        prv.animate({'height':zD.h}, settings.animationspeed/2, function(){
                                if(typeof cb === 'function') cb(args);
                        });
                }

                $(elem).on('click', '.sampgallery-ctrl-zoomin', function(evt){
                    evt.preventDefault();
                    var zi = $(this);
                    previewZoomin(function(){
                            $(elem).find('.sampgallery-ctrls .sampgallery-ctrl').css('display','block');
                            zi.hide();
                    }, null);
                });

                $(elem).on('click', '.sampgallery-ctrl-zoomout', function(evt){
                    evt.preventDefault();
                    var zo = $(this);
                    previewFit(function(){
                            $(elem).find('.sampgallery-ctrls .sampgallery-ctrl').css('display','block');
                            zo.hide();
                    }, null);
                });

			settings.afterinit();
            //return _self;
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
				scrolloffset: {top:0, bottom:0},//if needed to add top offset example fixed header
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