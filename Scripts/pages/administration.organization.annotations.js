$(document).ready(function () {
    new AccessManagement.Administration.Organization.AnnotationsPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Organization;
        (function (Organization) {
            var AnnotationsPage = /** @class */ (function () {
                function AnnotationsPage() {
                }
                AnnotationsPage.prototype.pageStart = function () {
                    this.setupTagToggles();
                    this.setupCapToggles();
                    this.setupContactEditorDialog();
                };
                AnnotationsPage.prototype.setupTagToggles = function () {
                    var organizationId = $("#tagsPanel").data("organization-id");
                    var toggleTagActions = $("[".concat(AccessManagement.Html.DataAttr_action, "='toggle-tag']"));
                    toggleTagActions.click(function (evt) {
                        var item = $(evt.target);
                        var tag = item.data("tag-value");
                        OrganizationApiClient.getService().toggleTag(organizationId, tag).then(function (val) {
                            if (val) {
                                if (!item.hasClass("active")) {
                                    item.addClass("active");
                                }
                            }
                            else {
                                if (item.hasClass("active")) {
                                    item.removeClass("active");
                                }
                            }
                        }, function (err) {
                            AccessManagement.toasts().showError(err.message, err.name);
                        });
                    });
                };
                AnnotationsPage.prototype.setupCapToggles = function () {
                    var organizationId = $("#capsPanel").data("organization-id");
                    var toggleCapActions = $("[".concat(AccessManagement.Html.DataAttr_action, "='toggle-cap']"));
                    toggleCapActions.click(function (evt) {
                        var item = $(evt.target);
                        var cap = item.data("cap-value");
                        OrganizationApiClient.getService().toggleCap(organizationId, cap).then(function (val) {
                            if (val) {
                                if (!item.hasClass("active")) {
                                    item.addClass("active");
                                }
                            }
                            else {
                                if (item.hasClass("active")) {
                                    item.removeClass("active");
                                }
                            }
                        }, function (err) {
                            AccessManagement.toasts().showError(err.message, err.name);
                        });
                    });
                };
                AnnotationsPage.prototype.setupContactEditorDialog = function () {
                    var dlg = $("#edit-contact-annotation-dialog");
                    var editContactActions = $("[".concat(AccessManagement.Html.DataAttr_action, "='edit-contact']"));
                    editContactActions.click(function (evt) {
                        var item = $(evt.target);
                        var contentUri = dlg.data("modal-uri") + "?contactId=" + item.data("contact-id");
                        dlg.load(contentUri, function () {
                            Juillet.Web.Mvc.setupJuilletComponents(dlg);
                            dlg.modal("show");
                        });
                    });
                };
                return AnnotationsPage;
            }());
            Organization.AnnotationsPage = AnnotationsPage;
        })(Organization = Administration.Organization || (Administration.Organization = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.organization.annotations.js.map