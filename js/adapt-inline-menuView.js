define([
    'core/js/adapt'
], function(Adapt) {

    var InlineMenuView = Backbone.View.extend({

        className: "inline-menu",

        initialize: function() {
            this.template = "inline-menu";
            this.render();
            this.listenTo(Adapt, {
                'router:location pageLevelProgress:updateProgressBar': this.updateStatus,
                'device:changed device:resize': this.updateStatus
            });
        },

        events: {
            'click .inline-menu-item-container button': 'onInlineMenuItemClicked'
        },
        
        postRender: function() {
            $('.inline-menu').hide();
        },

        render: function() {
            var collectionData = this.collection.toJSON();
            var modelData = this.model.toJSON();
            var template = Handlebars.templates["inline-menu"];
            //this.$el.html(template({model: modelData, resources:collectionData, _globals: Adapt.course.get('_globals')})).insertBefore('#wrapper');
            this.$el.html(template(modelData)).insertBefore('#wrapper');
            _.defer(_.bind(this.postRender, this));
            return this;
        },

        onInlineMenuItemClicked: function(e) {
            var _nIndex = $(e.currentTarget).index(),
                _nDataIndex = $(e.currentTarget).data('index'),
                _sAction = $(e.currentTarget).data('href');
                console.log('_sAction> ', _sAction);
            (_sAction=="")?window.open('#'+_sAction,'_self'):window.open('#/id/'+_sAction,'_self');
            return false;
        },

        updateStatus: function() {
            $('html').hasClass('location-menu')? $('.inline-menu').hide(): $('.inline-menu').show();
            
            for (var [key, value] of Adapt.completionCollection) {
                var _aStatus = value.split('|'),
                    _sC = '',
                    _sV = '';
                if(_aStatus[0] != "undefined" && _aStatus[0] != "false") _sV = "visited";
                if(_aStatus[1] != "undefined" && _aStatus[1] != "false") _sC = "completed";

                this.$(".inline-menu-item-status[data-id='" + key +"']").addClass(_sV + ' ' + _sC);
                this.$(".inline-menu-item-status[data-id='" + key +"']").siblings('button').addClass(_sV + ' ' + _sC);
            }
        }
    });

    return InlineMenuView;
});