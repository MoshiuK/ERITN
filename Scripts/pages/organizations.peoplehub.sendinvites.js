$(document)
    .ready(function () {
    new AccessManagement.Organization.PeopleHub.SendInvitesPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var PeopleHub;
        (function (PeopleHub) {
            var SendInvitesPage = /** @class */ (function () {
                function SendInvitesPage() {
                }
                SendInvitesPage.prototype.pageStart = function () {
                    var webLinkOptionsContainer = $("#webLinkOptionsContainer");
                    var individualInviteOptionsContainer = $("#individualInviteOptionsContainer");
                    // hack to fix the width
                    webLinkOptionsContainer.find(".select2.select2-container").css("width", "100%");
                    individualInviteOptionsContainer.find(".select2.select2-container").css("width", "100%");
                };
                return SendInvitesPage;
            }());
            PeopleHub.SendInvitesPage = SendInvitesPage;
        })(PeopleHub = Organization.PeopleHub || (Organization.PeopleHub = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.peoplehub.sendinvites.js.map