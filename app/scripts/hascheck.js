var $ = require('jquery');
var hascheck = require('hascheck');
var fieldSelection = require('field-selection');

function positionElement ( el, data ) {
	el
		.css({
			top: data.bottom,
			left: data.left
		})
		.appendTo('body');
}

var Hascheck = {

	ns: 'hascheck-Popover',

	init: function () {
		this.$win = $(window);
		this.createPopover();
	},

	template: {
		popover: function ( ns ) {
			return '<div class="'+ns+' '+ns+'--content"><button type="button" class="'+ns+'-close" title="'+chrome.i18n.getMessage('closeButton')+'"><span>'+chrome.i18n.getMessage('closeButton')+'</span></button><div class="'+ns+'-text"></div><div class="'+ns+'-actions"><div class="'+ns+'-action"><a href="http://http://hacheck.tel.fer.hr/" class="'+ns+'-source">Hascheck</a></div><div class="'+ns+'-action"><button type="button" class="'+ns+'-apply">'+chrome.i18n.getMessage('applyChangesButton')+'</button></div></div></div>';
		},
		preloader: function ( ns ) {
			return '<div class="'+ns+' '+ns+'--preloader">'+chrome.i18n.getMessage('preloader')+'</div>';
		}
	},

	getSelection: function () {
		return this.$win[0].getSelection();
	},

	getSelectionText: function () {
		return this.getSelection().toString();
	},

	getSelectionPosition: function () {

		var scrollTop = this.$win.scrollTop();
		var vals = this.getSelection().getRangeAt(0).getBoundingClientRect();

		this.$input = $(':focus').filter('textarea, input').last();

		vals = $.extend({}, vals);

		if ( this.$input.length ) {
			$.extend(vals, this.$input[0].getBoundingClientRect());
		}

		return $.extend({}, vals, {
			top: vals.top + scrollTop,
			bottom: vals.bottom + scrollTop
		});

	},

	createSelect: function ( data ) {

		var select = $('<select />', {
			'class': this.ns+'-suggestion'
		});
		var suspicious = data.suspicious;
		var suggestions = data.suggestions;
		var options = $();

		options = options
						.add($('<option />').val(suspicious).text(suspicious))
						.add($('<option />').prop('disabled', true).text('—'));

		$.each(suggestions, function ( index, suggestion ) {
			options = options.add($('<option />').val(suggestion).text(suggestion));
		});

		select.append(options);

		return select[0].outerHTML;

	},

	delegateEvents: function () {

		this.$el
			.on('click', '.'+this.ns+'-apply', $.proxy(this.apply, this))
			.on('click', '.'+this.ns+'-close', $.proxy(this.destroy, this))
			.on('change', '.'+this.ns+'-suggestion', $.proxy(this.changeSuggestion, this));

	},

	createPopover: function () {

		this.position = this.getSelectionPosition();
		this.$el      = $(this.template.popover(this.ns));
		this.$text    = this.$el.find('.'+this.ns+'-text');
		this.$actions = this.$el.find('.'+this.ns+'-actions');
		this.$apply   = this.$el.find('.'+this.ns+'-apply');

		var text = $.trim(this.getSelectionText());

		this.preloader(true);

		hascheck(text, function ( result ) {

			this.preloader(false);

			this.delegateEvents();

			$.each(result, function ( index, value ) {
				text = text.replace((new RegExp(value.suspicious, 'gi')), this.createSelect(value));
			}.bind(this));

			if ( !(new RegExp(this.ns+'-suggestion', 'g')).test(text) || !this.$input.length ) {
				this.$apply.remove();
			}

			this.$text.html(text);

			positionElement(this.$el, this.position);

		}.bind(this));

	},

	preloader: function ( show ) {
		this.$preloader = this.$preloader || $(this.template.preloader(this.ns));
		if ( show ) {
			positionElement(this.$preloader, this.position);
		} else {
			this.$preloader.addClass('is-hidden');
		}
	},

	changeSuggestion: function ( e ) {

		var el = $(e.currentTarget);

		if ( el.val() === el.find('option').first().val() ) {
			el.removeClass('is-valid');
		} else {
			el.addClass('is-valid');
		}

	},

	apply: function () {

		this.$text.find('select').each(function () {
			var el = $(this);
			el.replaceWith(el.val());
		});

		if ( this.$input.length ) {
			fieldSelection.replace(this.$input[0], this.$text.text());
		}

		this.destroy();

	},

	destroy: function () {
		this.$el.remove();
	},

	destroyAll: function () {
		$('.'+this.ns).remove();
	}

};

Hascheck.init();
