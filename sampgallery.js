/*Known issues: Will not work properly with jQuery versions (below 1.8) that don'thandle box-sizing correctly*/
(function($){
	
	var settings = {};
		
		_sampGallery = function(elem){		

			var _self = this, _scrSizes = {'xs':480, 'sm':767, 'md': 768},  _curItemOffset = {top:-1, left:-1}, _curThbDims = {'w':0,'h':0}, _curImgDims = {'w':0,'h':0}, _curPreviewDims = {'w':0,'h':0}, _curElemDims = {'w':jQuery(elem).outerWidth(),'h':jQuery(elem).outerHeight()};//store current thumb offset

            function realImgDimension(img) {
                var i = new Image();
                i.src = img.src;
                return {
                    w: parseInt(i.width),
                    h: parseInt(i.height)
                };
            }

            function doScroll(item){
                var itemOffset = jQuery(item).offset();
                    if(settings.scrolltoitem ){
                        var scrlTo = itemOffset.top-settings.scrolloffset.top;

                            if(_curElemDims.w < _scrSizes.sm){
                                scrlTo = itemOffset.top+((jQuery(item).height()/4)*3);//leave 1/4 of thumb visible
                            }

                            jQuery('html, body').stop().animate({scrollTop: scrlTo+'px'}, settings.animationspeed);
                        _curItemOffset = itemOffset;
                    }
            }
            
            function buildControls(url){
                    if(jQuery(elem).find('.sampgallery-ctrls').length > 0) jQuery(elem).find('.sampgallery-ctrls').remove();
                var cHtml = '<div class="sampgallery-ctrls">';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-close"></a>';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-zoomin"></a>';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-zoomout"></a>';
                cHtml += '<a class="sampgallery-ctrl sampgallery-ctrl-openimage" href="'+url+'" target="_blank"></a>';
                cHtml += '</div>';
                return cHtml;
            }

            function openPreview(_this){
                //var cTotal = jQuery(elem+' .sampgallery-thumb').length;//var _thisIndex = jQuery(_this).index();
                _curThbDims.w = jQuery(_this).outerWidth();
                _curThbDims.h = jQuery(_this).outerHeight();
                jQuery(_this).addClass('sampgallery-loading');
                var _thisOffset = jQuery(_this).offset();
                var prevItem = jQuery(elem).children().first();
                var cLast = jQuery(elem+' .sampgallery-thumb').last();
                var lastOffset = cLast.offset();
                var curPreview = jQuery(elem).find('.sampgallery-preview');
                var _thisImg = new Image();
                _thisImg.src = jQuery(_this).attr('href');

                    _thisImg.addEventListener('load', function() {

                        _curImgDims = realImgDimension(this);
                        var fullImgPath = this.src;

                            if(typeof jQuery(_this).attr('data-fullsize') !== 'undefined') fullImgPath = jQuery(_this).attr('data-fullsize');

                            jQuery(elem+' .sampgallery-thumb').each(function(i, item){
                                var itemOffset = jQuery(item).offset();

                                    if(itemOffset.top > _thisOffset.top || _thisOffset.top == lastOffset.top){

                                        var lastItem = prevItem;

                                            if( _thisOffset.top == lastOffset.top){
                                                lastItem = cLast;
                                            }

                                            if((_curItemOffset.top === _thisOffset.top) && typeof curPreview != 'undefined' && curPreview.length > 0){

                                                    curPreview.prepend(buildControls(fullImgPath)).find('a').attr('href', fullImgPath).find('img').attr('src', fullImgPath);
                                                previewFitWindow(function(){
                                                        jQuery(_this).addClass('sampgallery-active');
                                                    doScroll(_this);
                                                }, null);

                                            }else{

                                                var oHtml = '<div class="sampgallery-preview">'+buildControls(fullImgPath)+'<a href="'+fullImgPath+'" target="_blank"><img src="'+fullImgPath+'"></a></div>';
                                                    if(typeof curPreview != 'undefined' && curPreview.length > 0){
                                                        closePreview(function(){
                                                                jQuery(lastItem).after(oHtml);
                                                            previewFitWindow(function(){
                                                                    jQuery(elem+' .sampgallery-thumb').removeClass('sampgallery-loading');
                                                                    jQuery(_this).addClass('sampgallery-active');
                                                                doScroll(_this);
                                                            }, null);
                                                        }, null);
                                                    }else{
                                                            jQuery(lastItem).after(oHtml);
                                                        previewFitWindow(function(){
                                                                jQuery(elem+' .sampgallery-thumb').removeClass('sampgallery-loading');
                                                                jQuery(_this).addClass('sampgallery-active');
                                                            doScroll(_this);
                                                        }, null);
                                                    }
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

                var thisPreview = jQuery(elem).find('.sampgallery-preview');
                var thisItem = jQuery(elem).find('.sampgallery-thumb.sampgallery-active');
                    if(typeof thisItem.offset() != 'undefined') _curItemOffset = thisItem.offset().top-thisPreview.offset().top;

                    if(thisPreview.length > 0){

                            thisPreview.stop().animate({'height':'0px'}, settings.animationspeed, function(){
                                    thisPreview.remove();
                                    if(typeof callback === 'function') callback(args);
                            });

                            jQuery(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                    }
            }

				jQuery(elem).on('click', '.sampgallery-thumb', function(evt){

					evt.preventDefault();

                        if(jQuery(this).hasClass('sampgallery-active')){
							closePreview(null, null);
                            return false;
						}else{
                                jQuery(elem+' .sampgallery-thumb').removeClass('sampgallery-active');
                            openPreview(this);
                        }
				});

                jQuery(elem).on('click', '.sampgallery-ctrl-close', function(evt){
                    evt.preventDefault();
                    closePreview(null, null);
                });


            function  ctrlHandler(type){

                var tC = jQuery(elem).find('.sampgallery-preview').find('.sampgallery-ctrls');

                    tC.find('.sampgallery-ctrl-zoomin, .sampgallery-ctrl-zoomout').css('display','none');

                    if(_curPreviewDims.w > _scrSizes.sm){
                        if(_curImgDims.h > _curPreviewDims.h){
                                tC.find('.sampgallery-ctrl-zoomin').css('display','block');
                        }else if(_curImgDims.h < _curPreviewDims.h){
                                //tC.find('.sampgallery-ctrl-zoomout').css('display','block');
                        }
                    }
            }


            function previewFitWindow(cb,args){

                var toHeight = calcFitWindow()['h'];

                    if(_curElemDims.w < _scrSizes.sm){
                        toHeight = calcFitPreviewer()['h'];
                    }

                    jQuery(elem).find('.sampgallery-preview').animate({'height': toHeight}, settings.animationspeed, function(){
                            jQuery(elem+' .sampgallery-thumb').removeClass('sampgallery-loading');
                        ctrlHandler('zoomin');
                            if(typeof cb === 'function') cb(args);
                    });
            }


            function previewZoomin(cb,args){
                    jQuery(elem).find('.sampgallery-preview').animate({'height': calcFitPreviewer()['h']}, settings.animationspeed, function(){
                        ctrlHandler('zoomout');
                            if(typeof cb === 'function') cb(args);
                    });
            }


            function calcFitWindow(){
                var previewDims = {'w':jQuery(elem).outerWidth(),'h':jQuery(window).height()-_curThbDims.h-settings.scrolloffset.top-settings.scrolloffset.bottom};
                _curPreviewDims = previewDims;
                var prv = jQuery(elem).find('.sampgallery-preview');
                var ith = (prv.outerHeight()-prv.height())+parseInt(_curImgDims.h);
                var fD = {'w': previewDims.w, 'h': previewDims.h};
                    if(fD.h > ith) fD.h = ith;
                    //prv.find('a > img').attr('style', 'max-width:'+(maxPcs.w*100)+'%;max-height:'+(maxPcs.h*100)+'%');
                return fD;
            }


            function calcFitPreviewer(){
                var prv = jQuery(elem).find('.sampgallery-preview');
                var pad = parseInt(prv.outerHeight()-prv.height());
                var rat = _curImgDims.w/(_curElemDims.w-pad);
                var zD = {'w': prv.outerWidth()};

                    if(_curImgDims.w > _curElemDims.w-pad) zD.w = _curElemDims.w-pad;

                    if(zD.w > _curImgDims.w) zD.w = _curImgDims.w;

                    if(_curImgDims.w === _curImgDims.h) rat = 1;//Not a mathematician so dunno why square images go weird

                zD.h = (_curImgDims.h/rat)+pad;
                return zD;
            }

                jQuery(elem).on('click', '.sampgallery-ctrl-zoomin', function(evt){
                    evt.preventDefault();
                    var zi = jQuery(this);
                    previewZoomin(function(){
                            if(_curPreviewDims.w > _scrSizes.sm){
                                    jQuery(elem).find('.sampgallery-ctrls .sampgallery-ctrl').css('display','block');
                                zi.hide();
                            }
                    }, null);
                });

                jQuery(elem).on('click', '.sampgallery-ctrl-zoomout', function(evt){
                    evt.preventDefault();
                    var zo = jQuery(this);
                    previewFitWindow(function(){
                            if(_curPreviewDims.w > _scrSizes.sm){
                                    jQuery(elem).find('.sampgallery-ctrls .sampgallery-ctrl').css('display','block');
                                zo.hide();
                            }
                    }, 'zoomout');
                });

            var resizeTimer;
                jQuery(window).on('resize', function(){

                        if(resizeTimer)	clearTimeout(resizeTimer);
                        //if element changes more than half thumb width remove preview and reset thumbs
                        if(Math.abs(_curElemDims.w-jQuery(elem).outerWidth()) > jQuery(elem).find('.sampgallery-thumb').outerWidth()/2){

                            resizeTimer = setTimeout(function() {
                                _curElemDims = {'w':jQuery(elem).outerWidth(),'h':jQuery(elem).outerHeight()};
                                    jQuery(elem).find('.sampgallery-preview').remove();
                                    jQuery(elem).find('.sampgallery-thumb').removeClass('sampgallery-loading sampgallery-active');
                            }, 250);
                        }
                });

			    if(typeof settings.afterinit === 'function') settings.afterinit();
            //return _self;
		}
		
		function _setupSampGallery(elem){
				jQuery(elem).addClass('sampgallery').show().children().each(function(i, item){
					/*vanilla js
					var t_img = item.firstChild.src;
						
						if(typeof item.getAttribute('data-thumb') !== 'undefined') t_img = item.getAttribute('data-thumb');					
					item.firstChild.src = t_img;
					
						if(settings.thumbscaled){
							item.firstChild.remove();
								jQuery(item).css({'background-image':'url('+t_img+')'});
						}
					*/

                        if(settings.showintro){
                                jQuery(item).addClass('sampgallery-thumb sampgallery-thumb-intro').delay(i*250).animate({'opacity':1}, settings.animationspeed, function(){
                                         jQuery(item).removeClass('sampgallery-thumb-intro');
                                });
                        }else{
                                jQuery(item).addClass('sampgallery-thumb');
                        }

					var t_img = jQuery(item).attr('src');
						
						if(typeof jQuery(item).attr('data-thumb') !== 'undefined') t_img = jQuery(item).attr('data-thumb');					
					jQuery(item).attr('src', t_img);
					
						if(settings.thumbscaled){
							jQuery(item).find('img').first().remove();
								jQuery(item).css({'background-image':'url('+t_img+')'});
						}
						
				});
		}


		jQuery.fn.sampGallery = function(options){			
			settings = jQuery.extend({
				scrolltoitem: true,//Scroll page to preview
				scrolloffset: {top:0, bottom:0},//if needed to add offset, for example for fixed header and footer. Works only when screen is larger  than 767 pixels
				animationspeed: 300,
				thumbscaled: true,//use thumbs as background-images
                //keepzoom: true,//keep zoom setting, not yet implemented
                showintro: false,//Boolean, animate photos in, if this is used the element has to have class="sampgallery" added in markup
				afterinit: function(){
					//console.log('Broom.');//function to do after init
				}
			}, options);
				
			var _tselector = (typeof($(this).attr('id')) !== 'undefined' || $(this).attr('id') !== null) ? '#' + $(this).attr('id') :  '.' + $(this).attr('class');
			_setupSampGallery(_tselector);
			return _sampGallery(_tselector);
		};		
		/*jQuery.fn.sampGallery.defaults = {}; default options end */
})($);