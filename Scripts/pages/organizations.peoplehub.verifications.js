$(document)
    .ready(function () {
    new AccessManagement.Organization.PeopleHub.VerificationsPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var PeopleHub;
        (function (PeopleHub) {
            var VerificationsPage = /** @class */ (function () {
                function VerificationsPage() {
                }
                VerificationsPage.prototype.pageStart = function () {
                    $("button[action='decline-attribute-verification']").click(function (evt) {
                        var btn = $(evt.target);
                        Juillet.Web.Mvc.onDialogOk("#declineattributeverification", function () {
                            var formId = btn.data("form-id");
                            $(formId).submit();
                        });
                    });
                };
                return VerificationsPage;
            }());
            PeopleHub.VerificationsPage = VerificationsPage;
        })(PeopleHub = Organization.PeopleHub || (Organization.PeopleHub = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.peoplehub.verifications.js.map