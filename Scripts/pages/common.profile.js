$(document)
    .ready(function () {
    new AccessManagement.Common.Profile.ProfilePage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Common;
    (function (Common) {
        var Profile;
        (function (Profile) {
            var ProfilePage = /** @class */ (function () {
                function ProfilePage() {
                }
                ProfilePage.prototype.pageStart = function () {
                    Common.Ux.setupMessageListHandler();
                    Common.Ux.setupOrganizationActionListHandler(true);
                };
                return ProfilePage;
            }());
            Profile.ProfilePage = ProfilePage;
        })(Profile = Common.Profile || (Common.Profile = {}));
    })(Common = AccessManagement.Common || (AccessManagement.Common = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=common.profile.js.map