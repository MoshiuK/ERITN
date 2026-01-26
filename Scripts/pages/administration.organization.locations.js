$(document).ready(function () {
    new AccessManagement.Administration.Organization.LocationsPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Organization;
        (function (Organization) {
            var LocationsPage = /** @class */ (function () {
                function LocationsPage() {
                }
                LocationsPage.prototype.pageStart = function () {
                    $("button[action='delete-organization-location']").click(function (evt) {
                        var btn = $(evt.target);
                        Juillet.Web.Mvc.onDialogOk("#confirmDeleteLocation", function () {
                            var formId = btn.data("form-id");
                            $(formId).submit();
                        });
                    });
                };
                return LocationsPage;
            }());
            Organization.LocationsPage = LocationsPage;
        })(Organization = Administration.Organization || (Administration.Organization = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.organization.locations.js.map