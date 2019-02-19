define([
    'backbone',
    'core/js/adapt',
    './adapt-inline-menuView',
], function(Backbone, Adapt, InlineMenuView) {

    function setupInlineMenu(inlineMenuData) {
        var inlineMenuModel = new Backbone.Model(inlineMenuData);
        var inlineMenuCollection = new Backbone.Collection(inlineMenuModel.get('_inlineMenuItems'));

        new InlineMenuView({
            model: inlineMenuModel,
            collection: inlineMenuCollection
        }).$el;
    }

    function initInlineMenu() {
        var inlineMenu = Adapt.course.get('_inlineMenu');
        if (!inlineMenu || inlineMenu._isEnabled === false) return;
        setupInlineMenu(inlineMenu);
    }

    Adapt.on('adapt:start', initInlineMenu);
});