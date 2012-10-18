/**
	photofeed
	@version:		1.0.0
	@author:		Julien Loutre <julien.loutre@gmail.com>
*/
(function($){
 	$.fn.extend({
 		scriptloader: function() {
			var plugin_namespace = "scriptloader";
			
			var pluginClass = function() {};
			
			pluginClass.prototype.init = function (options) {
				try {
					
					var scope = this;
					
					this.options = $.extend({
						onComplete: 	function() {},
						onScriptLoad: 	function(scriptName) {},
						start:			true,
						scripts:		[]
					},options);
					
					this.scripts 		= [];
					this.currentIndex 	= 0;
					
					var i;
					
					for (i=0;i<this.options.scripts.length;i++) {
						this.scripts.push(this.options.scripts[i]);
					}
					
					if (this.options.start) {
						this.start();
					}
					
				} catch (err) {
					this.error(err);
				}
			};
			
			pluginClass.prototype.start = function () {
				try {
					var scope 	= this;
					this.start 	= true;
					this.loadNext();
					
				} catch (err) {
					this.error(err);
				}
			};
			pluginClass.prototype.loadNext = function (options) {
				try {
					
					var scope 	= this;
					
					if (this.currentIndex == this.scripts.length) {
						this.options.onComplete();
						return true;
					}
					
					if (this.currentIndex < this.scripts.length) {
						$.ajax({
							url: 		this.scripts[this.currentIndex],
							dataType:	"script",
							type:		"POST",
							data:		{
								
							},
							success: 	function(data){
								scope.options.onScriptLoad(scope.scripts[scope.currentIndex]);
								scope.currentIndex++;
								scope.loadNext();
							}
						});
						
					}
					
						
				} catch (err) {
					this.error(err);
				}
			};
			
			
			
			
			
			
			
			pluginClass.prototype.__init = function (element) {
				try {
					this.element = element;
				} catch (err) {
					this.error(err);
				}
			};
			// centralized error handler
			pluginClass.prototype.error = function (e) {
				if (console && console.info) {
					console.info("error on "+plugin_namespace+":",e);
				}
			};
			// Centralized routing function
			pluginClass.prototype.execute = function (fn, options) {
				try {
					if (typeof(this[fn]) == "function") {
						var output = this[fn].apply(this, [options]);
					} else {
						this.error("'"+fn.toString()+"()' is not a function");
					}
				} catch (err) {
					this.error(err);
				}
			};
			
			// process
			var fn;
			var options;
			if (arguments.length == 0) {
				fn = "init";
				options = {};
			} else if (arguments.length == 1 && typeof(arguments[0]) == 'object') {
				fn = "init";
				options = $.extend({},arguments[0]);
			} else {
				fn = arguments[0];
				options = arguments[1];
			}
			$.each(this, function(idx, item) {
				// if the plugin does not yet exist, let's create it.
				if ($(item).data(plugin_namespace) == null) {
					$(item).data(plugin_namespace, new pluginClass());
					$(item).data(plugin_namespace).__init($(item));
				}
				$(item).data(plugin_namespace).execute(fn, options);
			});
			return this;
    	}
	});
	
})(jQuery);

