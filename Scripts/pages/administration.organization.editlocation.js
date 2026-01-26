$(document).ready(function () {
    new AccessManagement.Administration.Organization.EditLocationPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Organization;
        (function (Organization) {
            var EditLocationPage = /** @class */ (function () {
                function EditLocationPage() {
                }
                EditLocationPage.prototype.pageStart = function () {
                };
                return EditLocationPage;
            }());
            Organization.EditLocationPage = EditLocationPage;
        })(Organization = Administration.Organization || (Administration.Organization = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.organization.editlocation.js.map