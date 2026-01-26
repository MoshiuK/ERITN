$(document)
    .ready(function () {
    $(window).keydown(function (evt) {
        if (evt.keyCode === 13) {
            event.preventDefault();
            return false;
        }
        return true;
    });
    new AccessManagement.Administration.Organization.AdvancedPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Organization;
        (function (Organization) {
            var AdvancedPage = /** @class */ (function () {
                function AdvancedPage() {
                }
                AdvancedPage.prototype.pageStart = function () {
                    var _this = this;
                    var cbEmailChannel = $("#EmailAttachmentsEnabled");
                    if (cbEmailChannel.prop("checked") === true) {
                        this.setEnabledState(true);
                    }
                    else {
                        this.setEnabledState(false);
                    }
                    cbEmailChannel.change(function () {
                        if (cbEmailChannel.prop("checked") === true) {
                            _this.setEnabledState(true);
                        }
                        else {
                            _this.setEnabledState(false);
                        }
                    });
                    var initialSelections = $("#EmailAttachmentsFormFactorsInitialSelections")
                        .data("initial-selections").split(",");
                    var formFactorsSelect = $("#EmailAttachmentsFormFactors");
                    initialSelections.forEach(function (n) {
                        var option = formFactorsSelect.find("option[value='".concat(n, "']"));
                        option.prop("selected", "selected");
                        option.trigger("change");
                    });
                };
                AdvancedPage.prototype.setEnabledState = function (enabled) {
                    if (enabled) {
                        $("#EmailAttachmentsTemplateId").removeAttr("disabled");
                        $("#EmailAttachmentsUseNativeTemplates").removeAttr("disabled");
                        $("#EmailAttachmentsFormFactors").removeAttr("disabled");
                    }
                    else {
                        $("#EmailAttachmentsTemplateId").attr("disabled", "disabled");
                        $("#EmailAttachmentsUseNativeTemplates").attr("disabled", "disabled");
                        $("#EmailAttachmentsFormFactors").attr("disabled", "disabled");
                    }
                };
                return AdvancedPage;
            }());
            Organization.AdvancedPage = AdvancedPage;
        })(Organization = Administration.Organization || (Administration.Organization = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.organizations.advanced.js.map