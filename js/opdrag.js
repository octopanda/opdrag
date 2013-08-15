;(function($, window, document, undefined){
	$.fn.opdrag = function(options){
		var opts = $.extend({}, $.fn.opdrag.options, options);
		var areae = [];
		var area = null;
		return this.each(function(idx, em){
			var dragging = {
				$em: $(em),
				mouseX: 0,
				mouseY: 0,
				init: function(){
					this.$em.find(opts.drags).mousedown(this.select);
				},
				select: function(e){
					e.preventDefault();
					area = areae[idx];
					var $target = $(e.target);
					area.$em.$item = $target.closest(opts.item);
					area.$em.$item.mousemove(function(){
						area.pickup(e);
					});
					var itemposX = area.$em.$item.offset().left - parseInt(area.$em.$item.css("marginLeft"));
					var itemposY = area.$em.$item.offset().top - parseInt(area.$em.$item.css("marginTop"));
					area.mouseX = e.pageX - itemposX;
					area.mouseY = e.pageY - itemposY;
				},
				pickup: function(e){
					e.preventDefault();
					area.$em.$item.unbind("mousemove");
					area.$em.$copyitem = area.$em.$item.clone(true);
					area.$em.$copyitem.css({"opacity": 0.4});
					area.$em.$item.after(area.$em.$copyitem);
					area.$em.find(area.$em.$item).detach().appendTo(area.$em);
					area.$em.$item.css({
						"position": "absolute",
						"z-index": 9999
					});
					var cpos = [];
					area.$em.find(opts.item).not(area.$em.$item).each(function(i, e){
						cpos.push(area.getPos(this));
					});
					area.cpos = cpos;
					$(document).bind("mousemove", area.move);
					$(document).bind("mouseup", area.dropdown);
				},
				move: function(e){
					e.preventDefault();
					area.$em.$item.css({
						"left": e.pageX - area.mouseX,
						"top": e.pageY - area.mouseY
					});
					var itemPos = area.getPos(area.$em.$item);
					var copyitemPos = area.getPos(area.$em.$copyitem);
					var areaPos = area.getPos(area.$em);
					if(e.pageX > areaPos.left && e.pageX < areaPos.right && e.pageY > areaPos.top && e.pageY < areaPos.bottom){
						for(var i = 0; i < area.cpos.length; i++){
							if(i != area.$em.$copyitem.index() && e.pageY >= area.cpos[i].top && e.pageY <= area.cpos[i].bottom){
								var $copy = area.$em.$copyitem.detach();
								area.$em.find(opts.item).eq(i).before($copy);
								break;
							}
						}
					}
				},
				dropdown: function(e){
					$(document).unbind("mousemove");
					var $copy = area.$em.$item.detach();
					area.$em.$copyitem.before($copy);
					area.$em.$copyitem.remove();
					area.$em.$copyitem = undefined;
					area.$em.$item.css({
						"top": "",
						"left": "",
						"position": "",
						"z-index": ""
					});
					$(document).unbind("mouseup");
				},
				getPos: function(element){
					var $element = $(element), pos = {}, offset = $element.offset();
					pos.left = offset.left;
					pos.top = offset.top;
					pos.right = offset.left + $element.width();
					pos.bottom = offset.top + $element.height();
					return pos;
				}
			}
			areae.push(dragging);
			dragging.init();
		});
	};
	$.fn.opdrag.options = {
		item: ".item",
		drags: ".hd"
	};
})(jQuery, window, document);