/// <reference path="../typings/toastr/index.d.ts"/>
/// <reference path="../app/AccessManagement.ts"/>
$(document)
    .ready(function () {
    var accessLevelActions = $("[".concat(AccessManagement.Html.DataAttr_action, "='toggle-accesslevel']"));
    AccessManagement.onActionClicked(accessLevelActions, function (evt) {
        SettingsApiClient.getService().toggleAccessLevels(evt.resourceId).then(function (val) {
            var caption = val ? "Activated '".concat(evt.resourceName, "'") : "Deactivated '".concat(evt.resourceName, "'");
            AccessManagement.toasts().showSuccess(caption, "Access Level Changed");
            updateButtonStyle(evt.target, val);
            updateStatusIndicator(evt.resourceId, val);
        }, function (err) {
            AccessManagement.toasts().showError(err.message, err.name);
        });
    });
    $("#addAccessLevelDialog").on("shown.bs.modal", function (evt) {
        Juillet.Web.Mvc.bindSelect2();
    });
    var transitLocationActions = $("[".concat(AccessManagement.Html.DataAttr_action, "='toggle-transitlocation']"));
    AccessManagement.onActionClicked(transitLocationActions, function (evt) {
        SettingsApiClient.getService().toggleTransitLocations(evt.resourceId).then(function (val) {
            var caption = val ? "Activated '".concat(evt.resourceName, "'") : "Deactivated '".concat(evt.resourceName, "'");
            AccessManagement.toasts().showSuccess(caption, "Transit Location Changed");
            updateButtonStyle(evt.target, val);
            updateStatusIndicator(evt.resourceId, val);
        }, function (err) {
            AccessManagement.toasts().showError(err.message, err.name);
        });
    });
    $("#addTransitLocationDialog").on("shown.bs.modal", function (evt) {
        Juillet.Web.Mvc.bindSelect2();
    });
    var transitPurposeActions = $("[".concat(AccessManagement.Html.DataAttr_action, "='toggle-transitpurpose']"));
    AccessManagement.onActionClicked(transitPurposeActions, function (evt) {
        SettingsApiClient.getService().toggleTransitPurposes(evt.resourceId).then(function (val) {
            var caption = val ? "Activated '".concat(evt.resourceName, "'") : "Deactivated '".concat(evt.resourceName, "'");
            AccessManagement.toasts().showSuccess(caption, "Transit Purpose Changed");
            updateButtonStyle(evt.target, val);
            updateStatusIndicator(evt.resourceId, val);
        }, function (err) {
            AccessManagement.toasts().showError(err.message, err.name);
        });
    });
    $("#addTransitPurposeDialog").on("shown.bs.modal", function (evt) {
        Juillet.Web.Mvc.bindSelect2();
    });
    function updateButtonStyle(button, active) {
        if (active) {
            if (!button.hasClass("btn-warning")) {
                button.addClass("btn-warning");
            }
            if (button.hasClass("btn-success")) {
                button.removeClass("btn-success");
            }
            button.find("span").text("Deactivate");
        }
        else {
            if (!button.hasClass("btn-success")) {
                button.addClass("btn-success");
            }
            if (button.hasClass("btn-warning")) {
                button.removeClass("btn-warning");
            }
            button.find("span").text("Activate");
        }
    }
    function updateStatusIndicator(resourceId, active) {
        var label = $("#status-".concat(resourceId));
        label.text(active ? "ACTIVE" : "INACTIVE");
        if (active) {
            if (label.hasClass("label-default")) {
                label.removeClass("label-default");
            }
            if (!label.hasClass("label-success")) {
                label.addClass("label-success");
            }
        }
        else {
            if (label.hasClass("label-success")) {
                label.removeClass("label-success");
            }
            if (!label.hasClass("label-default")) {
                label.addClass("label-default");
            }
        }
    }
});
//# sourceMappingURL=administration.settings.common.js.map