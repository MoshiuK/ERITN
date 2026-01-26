/// <reference path="../app/AccessManagement.ts"/>
/// <reference path="../typings/select2/select2.d.ts"/>
$(document).ready(function () {
    new AccessManagement.Administration.Person.OrganizationsPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Person;
        (function (Person) {
            var OrganizationsPage = /** @class */ (function () {
                function OrganizationsPage() {
                }
                OrganizationsPage.prototype.pageStart = function () {
                    var _this = this;
                    $("button[action='edit-transit-details']").click(function (evt) {
                        var btn = $(evt.target);
                        var editorUri = btn.data("editor-uri");
                        var dlg = $("#edit-transit-settings-dialog");
                        dlg.load(editorUri, function () {
                            Juillet.Web.Mvc.setupJuilletComponents(dlg);
                            // hack to fix the width
                            dlg.find(".select2.select2-container").css("width", "100%");
                            // initial selections
                            var initialSelectionInfo = dlg.find("#initial-selection-info");
                            _this.setupInitialSelection(dlg, "AccessLevelId", _this.extractInitialSelectionInfo(initialSelectionInfo, "access-level"));
                            _this.setupInitialSelection(dlg, "PurposeId", _this.extractInitialSelectionInfo(initialSelectionInfo, "purpose"));
                            _this.setupInitialSelection(dlg, "LocationId", _this.extractInitialSelectionInfo(initialSelectionInfo, "location"));
                            dlg.modal("show");
                        });
                    });
                };
                OrganizationsPage.prototype.extractInitialSelectionInfo = function (element, prefix) {
                    return { id: element.data("".concat(prefix, "-id")), name: element.data("".concat(prefix, "-name")) };
                };
                OrganizationsPage.prototype.setupInitialSelection = function (dialog, selectName, selectionInfo) {
                    var select = dialog.find("select[name='".concat(selectName, "']"));
                    if (selectionInfo !== undefined && selectionInfo !== null) {
                        var opt = new Option(selectionInfo.name, selectionInfo.id, true, true);
                        select.append(opt).trigger("change");
                    }
                    return select;
                };
                return OrganizationsPage;
            }());
            Person.OrganizationsPage = OrganizationsPage;
        })(Person = Administration.Person || (Administration.Person = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.person.organizations.js.map