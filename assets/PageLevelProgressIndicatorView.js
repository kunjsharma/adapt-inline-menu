define([
    'core/js/adapt'
], function(Adapt) {

    var PageLevelProgressIndicatorView = Backbone.View.extend({

        initialize: function(options) {
            options = options || {};
            this.calculatePercentage = options.calculatePercentage || this.calculatePercentage;
            this.ariaLabel = options.ariaLabel || '';
            this.type = options.type || this.model.get('_type');
            this.addClasses();
            this.checkAria();
            this.setUpEventListeners();
            this.render();
            this.refresh();
        },

        addClasses: function() {
            this.$el.addClass([
                'pagelevelprogress-indicator',
                this.type + '-indicator'
            ].join(' '));
        },

        checkAria: function() {
            if (this.ariaLabel) return;
            this.$el.attr('aria-hidden', true);
        },

        setUpEventListeners: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, 'change:_isComplete', this.refresh);
            if (!this.collection) return;
            this.listenTo(this.collection, 'change:_isComplete', this.refresh);
        },

        refresh: function() {
            this.checkCompletion();
            this.render();
            Adapt.trigger('pageLevelProgress:updateProgressBar');
        },

        checkCompletion: function() {
            var percentage = this.calculatePercentage();
            this.model.set('percentageComplete', percentage);
            this.$el
                .toggleClass('complete', percentage === 100)
                .toggleClass('incomplete', percentage !== 100);
        },

        calculatePercentage: function() {
            return this.model.get('_isComplete') ? 100 : 0;
        },

        render: function() {
            var data = this.model.toJSON();
            data.ariaLabel = this.ariaLabel;
            data.type = this.type;
            var template = Handlebars.templates[this.constructor.template];
            this.$el.html(template(data));
        }

    }, {
        template: 'pageLevelProgressIndicator'
    });

    return PageLevelProgressIndicatorView;

});
