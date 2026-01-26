/// <reference path="../app/AccessManagement.ts"/>
/// <reference path="../typings/select2/select2.d.ts"/>
$(document).ready(function () {
    new PersonAttributesPage().pageStart();
});
var PersonAttributesPage = /** @class */ (function () {
    function PersonAttributesPage() {
    }
    PersonAttributesPage.prototype.pageStart = function () {
        var _this = this;
        $('[data-toggle="popover"]').popover();
        this.setupItemDialog("#newInfoDialog", this.setupInstrumentEditing);
        this.setupItemDialog("#newDocumentDialog", this.setupInstrumentEditing);
        this.setupItemDialog("#newCertificationDialog", this.setupInstrumentEditing);
        this.setupItemDialog("#newAffiliationDialog", this.setupInstrumentEditing);
        $(".edit-attribute").click(function (e) {
            var btn = $(e.target);
            var propertyId = btn.data("property-id");
            var propertyTypeId = btn.data("property-type-id");
            var propertyTypeName = btn.data("property-type-name");
            var editorUri = btn.data("editor-uri");
            var dlg = $("#edit-attribute-dialog");
            dlg.load(editorUri, function () {
                Juillet.Web.Mvc.setupJuilletComponents(dlg);
                _this.setupInstrumentEditing(dlg, { id: propertyId, typeId: propertyTypeId, name: propertyTypeName });
                dlg.show();
            });
        });
        $(".verify-attribute").click(function (e) {
            var btn = $(e.target);
            var propertyId = btn.data("property-id");
            var dlg = $("#verifyAttributeDialog");
            var contentUri = "".concat(dlg.data("modal-uri"), "?propertyId=").concat(propertyId);
            dlg.load(contentUri, function () {
                dlg.modal("show");
            });
        });
    };
    PersonAttributesPage.prototype.setupItemDialog = function (dlg, handler) {
        var dialog;
        if (typeof (dlg) === "string") {
            dialog = $(dlg);
        }
        else {
            dialog = dlg;
        }
        var contentUri = dialog.data("modal-uri");
        dialog.load(contentUri, function () {
            Juillet.Web.Mvc.setupJuilletComponents(dialog);
            // hack to fix the width
            dialog.find(".select2.select2-container").css("width", "100%");
            if (handler !== undefined) {
                handler(dialog);
            }
        });
    };
    PersonAttributesPage.prototype.setupInstrumentEditing = function (dialog, initialSelection) {
        var select = dialog.find("select[name='PropertyTypeId']");
        if (initialSelection !== undefined && initialSelection !== null) {
            var opt = new Option(initialSelection.name, initialSelection.typeId, true, true);
            select.append(opt).trigger("change");
            select.prop("disabled", "true");
            PersonAttributesPage.loadInstrumentEditor(dialog, initialSelection.typeId, initialSelection.id);
        }
        else {
            select.on("select2:select", function (e) {
                var selection = e.params.data;
                PersonAttributesPage.loadInstrumentEditor(dialog, selection.id);
            });
        }
    };
    PersonAttributesPage.loadInstrumentEditor = function (dialog, propertyTypeId, propertyId) {
        var isNew = propertyId == undefined || propertyId == null;
        var container = $(".instrument-editor-container", dialog);
        var editorUri = "".concat(container.data("editor-uri"), "?propertyTypeId=").concat(propertyTypeId);
        if (!isNew) {
            editorUri = editorUri + "&propertyId=".concat(propertyId);
        }
        container.load(editorUri, function () {
            Juillet.Web.Mvc.setupJuilletComponents(container);
            if (!isNew) {
                container.append("<input name=\"PropertyTypeId\" type=\"hidden\" value=\"".concat(propertyTypeId, "\"/>"));
            }
            $(".initial-selection", container).each(function (index, element) {
                var sel = $(element);
                var inputName = sel.data("select-name");
                var id = sel.data("selected-id");
                var select = $("select[name=".concat(inputName, "]"), container);
                if (inputName == "OrganizationId") {
                    select.prop("disabled", "true");
                    $("select[name=".concat(inputName, "]"), container).parent().css("display", "none");
                    return;
                }
                var dataUri = select.data("ajax--url");
                $.get(dataUri, function (data) {
                    for (var i = 0; i < data.results.length; i++) {
                        var next = data.results[i];
                        if (next.id === id) {
                            var opt = new Option(next.text, next.id, true, true);
                            select.append(opt).trigger("change");
                            return;
                        }
                    }
                });
            });
        });
    };
    return PersonAttributesPage;
}());
//# sourceMappingURL=organization.person.attributes.js.map