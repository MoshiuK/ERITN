/// <reference path="../app/AccessManagement.ts"/>
/// <reference path="../typings/select2/select2.d.ts"/>
$(document).ready(function () {
    new EventLocationsPage().pageStart();
});
var EventLocationsPage = /** @class */ (function () {
    function EventLocationsPage() {
    }
    EventLocationsPage.prototype.pageStart = function () {
        this.setupItemDialog("#addLocationDialog");
    };
    EventLocationsPage.prototype.setupItemDialog = function (dlg, handler) {
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
    return EventLocationsPage;
}());
//# sourceMappingURL=administration.event.locations.js.map