define([
    'core/js/adapt'
], function(Adapt) {

    // Calculate completion of a contentObject
    Adapt.completionCollection = new Map();
    function calculateCompletion(contentObjectModel) {

        var viewType = contentObjectModel.get('_type'),
            nonAssessmentComponentsTotal = 0,
            nonAssessmentComponentsCompleted = 0,
            assessmentComponentsTotal = 0,
            assessmentComponentsCompleted = 0,
            subProgressCompleted = 0,
            subProgressTotal = 0,
            isComplete = contentObjectModel.get("_isComplete") ? 1 : 0;

        // If it's a page
        if (viewType == 'page') {
            var children = _.filter(contentObjectModel.findDescendantModels('components'), function(comp) {
                return comp.get('_isAvailable') === true && comp.get('_isOptional') === false;
            });

            var availableChildren = filterAvailableChildren(children);
            var components = getPageLevelProgressEnabledModels(availableChildren);

            var nonAssessmentComponents = getNonAssessmentComponents(components);

            nonAssessmentComponentsTotal = nonAssessmentComponents.length;
            nonAssessmentComponentsCompleted = getComponentsCompleted(nonAssessmentComponents).length;

            var assessmentComponents = getAssessmentComponents(components);

            assessmentComponentsTotal = assessmentComponents.length;
            assessmentComponentsCompleted = getComponentsInteractionCompleted(assessmentComponents).length;

            subProgressCompleted = contentObjectModel.get("_subProgressComplete") || 0;
            subProgressTotal = contentObjectModel.get("_subProgressTotal") || 0;

            var pageCompletion = {
                "subProgressCompleted": subProgressCompleted,
                "subProgressTotal": subProgressTotal,
                "nonAssessmentCompleted": nonAssessmentComponentsCompleted,
                "nonAssessmentTotal": nonAssessmentComponentsTotal,
                "assessmentCompleted": assessmentComponentsCompleted,
                "assessmentTotal": assessmentComponentsTotal
            };

            var showPageCompletionCourse = Adapt.course.get("_pageLevelProgress") && Adapt.course.get("_pageLevelProgress")._showPageCompletion !== false;
            var showPageCompletionPage = contentObjectModel.get("_pageLevelProgress") && contentObjectModel.get("_pageLevelProgress")._showPageCompletion !== false;

            if (showPageCompletionCourse && showPageCompletionPage) {
                //optionally add one point extra for page completion to eliminate incomplete pages and full progress bars
                // if _showPageCompletion is true then the progress bar should also consider it so add 1 to nonAssessmentTotal
                pageCompletion.nonAssessmentCompleted += isComplete;
                pageCompletion.nonAssessmentTotal += 1;
            }
            var completionCollection = {
                'id': contentObjectModel.get('_id'),
                'state': {
                    "isComplete": contentObjectModel.get('_isComplete'),
                    "isVisited": contentObjectModel.get('_isVisited')
                }
            };
            Adapt.completionCollection.set(contentObjectModel.get('_id'), contentObjectModel.get('_isVisited') +'|'+contentObjectModel.get('_isComplete'));

            return pageCompletion;
        }
        // If it's a sub-menu
        else if (viewType == 'menu') {

            _.each(contentObjectModel.get('_children').models, function(contentObject) {
                var completionObject = calculateCompletion(contentObject);
                subProgressCompleted += contentObjectModel.subProgressCompleted || 0;
                subProgressTotal += contentObjectModel.subProgressTotal || 0;
                nonAssessmentComponentsTotal += completionObject.nonAssessmentTotal;
                nonAssessmentComponentsCompleted += completionObject.nonAssessmentCompleted;
                assessmentComponentsTotal += completionObject.assessmentTotal;
                assessmentComponentsCompleted += completionObject.assessmentCompleted;
            });

            return {
                "subProgressCompleted": subProgressCompleted,
                "subProgressTotal" : subProgressTotal,
                "nonAssessmentCompleted": nonAssessmentComponentsCompleted,
                "nonAssessmentTotal": nonAssessmentComponentsTotal,
                "assessmentCompleted": assessmentComponentsCompleted,
                "assessmentTotal": assessmentComponentsTotal,
            };
        }
    }

    function getNonAssessmentComponents(models) {
        return _.filter(models, function(model) {
            return !model.get('_isPartOfAssessment');
        });
    }

    function getAssessmentComponents(models) {
        return _.filter(models, function(model) {
            return model.get('_isPartOfAssessment');
        });
    }

    function getComponentsCompleted(models) {
        return _.filter(models, function(item) {
            return item.get('_isComplete');
        });
    }

    function getComponentsInteractionCompleted(models) {
        return _.filter(models, function(item) {
            return item.get('_isComplete');
        });
    }

    //Get only those models who were enabled for pageLevelProgress
    function getPageLevelProgressEnabledModels(models) {
        return _.filter(models, function(model) {
            if (model.get('_pageLevelProgress')) {
                return model.get('_pageLevelProgress')._isEnabled;
            }
        });
    }

    function unavailableInHierarchy(parents) {
        if (parents.length > 0) {
            var parentsAvailable = _.map(parents, function(parent) {
                return parent.get('_isAvailable');
            });
            return _.indexOf(parentsAvailable, false) > -1;
        } else {
            return;
        }
    }

    function filterAvailableChildren(children) {
        var availableChildren = [];

        for(var i = 0, count = children.length; i < count; i++) {
            var parents = children[i].getAncestorModels();
            if (!unavailableInHierarchy(parents)) {
                availableChildren.push(children[i]);
            }
        }

        return availableChildren;
    }

    return {
    	calculateCompletion: calculateCompletion,
    	getPageLevelProgressEnabledModels: getPageLevelProgressEnabledModels,
        filterAvailableChildren: filterAvailableChildren
    };

});
