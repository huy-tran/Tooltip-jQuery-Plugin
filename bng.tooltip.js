//Tooltip object
var Tooltip = {

	init: function( options, elem ) {
		this.settings = $.extend( {}, this.defaults, options ); // Store Plugin's settings by mergin defaults and options passed by the users
		
		this.elem = elem;
		this.$elem = $( elem );

		this.text = this._getText(); // Get data-bng-title attribute from element
		this.frag = this._build( this.text, this.settings['position'] ); // Build fragment for tooltip container
		this.container = this._style( this.frag , this.settings['position']); // Style CSS for tooltip container 
		this.showTooltip(this.text); // display tooltip

		return this;
	},
	//Plugin's defaults
	defaults: {
		'position': null,
		'width': 300,
		'background-color': '#da2e2b',
		'border-radius': 5,
		'font-size': 14,
		'color': '#fff',
		transition: 'fadeToggle',
		delay: 400
	},

	showTooltip: function( text ) {
		var self = this;
		var widthTooltip = self.settings['width'];		
		// Remove native title attribute so browser will not show it when hover
		self.elem.title = '';
		// Show tooltip if has bng-title data on that element
		if ( text ) {
			self.$elem.hover(function( evt ) {
				// Get width and height of target element and define left position of tooltip
				var widthElem = $(this).outerWidth(),
					heightElem = $(this).outerHeight(),
					leftPos = ( widthTooltip - widthElem ) / 2;
				// Tooltip to be displayed top or bottom position
				if ( self.settings.position && self.settings.position === 'bottom' ) {
					self.container.css({
						top: heightElem + 8, // 8px is width of tooltip's arrow
						left: -leftPos
					});
				} else {

					self.container.css({
						bottom: heightElem + 8, // 8px is width of tooltip's arrow
						left: -leftPos
				})
			}
				self.container.appendTo($(this));
				self.container[self.settings.transition](self.settings.delay);				
			}, function() {
				self.container.hide();
			});			
		} else {
			return false;
		}
	},

	_getText: function() {
		return this.$elem.data('bng-title');
	},

	_build: function( text ) {
		return $("<div id='bngTooltip'><span class='bng-arrow'></span><div class='bngTooltip-content'>" + 
				text +
				"</div></div>");
	},

	_style: function( frag, position ) {
		var arrow = frag.find('span.bng-arrow');
		if ( position && position === 'bottom' ) {
			arrow
				.addClass('bng-arrow-up')
				.css('border-bottom-color', this.settings['background-color']);
		} else {
			arrow
				.addClass('bng-arrow-down')
				.css('border-top-color', this.settings['background-color']);
		}
		frag.css({
			'width': this.settings['width'],
			'color': this.settings['color'],
			'background-color': this.settings['background-color'],
			'border-radius': this.settings['border-radius'],
			'font-size': this.settings['font-size'],
		});
		return frag;
	}
};
// Checking if browser has Object.create
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F(){};
		F.prototype = obj;
		return new F();
	};
}
// Plugin pattern
( function( $, window, document, undefined ) {
	$.plugin = function( name, object ) {
		$.fn[name] = function( options ) {
			return this.each( function() {
				if ( ! $.data( this, name ) ) {
					$.data( this, name, Object.create( object ).init( options, this ) );
				}
			});
		};
	};
	//Create Plugin name and pass main object
	$.plugin( 'bngTooltip', Tooltip);
} ) ( jQuery, window, document );
