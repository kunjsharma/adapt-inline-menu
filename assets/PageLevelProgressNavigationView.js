define([
    'core/js/adapt',
    './completionCalculations',
    './PageLevelProgressView'
], function(Adapt, completionCalculations, PageLevelProgressView) {

    var PageLevelProgressNavigationView = Backbone.View.extend({

        tagName: 'button',

        className: 'base page-level-progress-navigation',

        events: {
            'click': 'onProgressClicked'
        },

        initialize: function() {
            this.listenTo(Adapt, {
                'remove': this.remove,
                'router:location': this.updateProgressBar,
                'pageLevelProgress:update': this.refreshProgressBar
            });

            this.listenTo(this.collection, 'change:_isComplete', this.updateProgressBar);
            this.listenTo(this.model, 'change:_isComplete', this.updateProgressBar);

            this.$el.attr('role', 'button');

            this.ariaText = Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressIndicatorBar +  ' ';

            this.render();

            _.defer(this.updateProgressBar.bind(this));
        },

        render: function() {
            var components = this.collection.toJSON();
            var data = {
                components: components,
                _globals: Adapt.course.get('_globals')
            };

            var template = Handlebars.templates['pageLevelProgressNavigation'];
            $('.navigation-drawer-toggle-button').after(this.$el.html(template(data)));
            return this;
        },

        refreshProgressBar: function() {
            var currentPageComponents = _.filter(this.model.findDescendantModels('components'), function(comp) {
                return comp.get('_isAvailable') === true;
            });
            var availableChildren = completionCalculations.filterAvailableChildren(currentPageComponents);
            var enabledProgressComponents = completionCalculations.getPageLevelProgressEnabledModels(availableChildren);

            this.collection.reset(enabledProgressComponents);
            this.updateProgressBar();
        },

        updateProgressBar: function() {
            var completionObject = completionCalculations.calculateCompletion(this.model);

            //take all assessment, nonassessment and subprogress into percentage
            //this allows the user to see if assessments have been passed, if assessment components can be retaken, and all other component's completion

            var completed = completionObject.nonAssessmentCompleted + completionObject.assessmentCompleted + completionObject.subProgressCompleted;
            var total  = completionObject.nonAssessmentTotal + completionObject.assessmentTotal + completionObject.subProgressTotal;

            var percentageComplete = Math.floor((completed / total)*100);


            this.$('.page-level-progress-navigation-bar').css('width', percentageComplete + '%');

            // Add percentage of completed components as an aria label attribute
            this.$el.attr('aria-label', this.ariaText +  percentageComplete + '%');

            // Set percentage of completed components to model attribute to update progress on MenuView
            this.model.set('completedChildrenAsPercentage', percentageComplete);
            Adapt.trigger('pageLevelProgress:updateProgressBar');
        },

        onProgressClicked: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            Adapt.drawer.triggerCustomView(new PageLevelProgressView({collection: this.collection}).$el, false);
        }

    });

    return PageLevelProgressNavigationView;

});
