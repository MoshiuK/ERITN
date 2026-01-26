$(document)
    .ready(function () {
    new AccessManagement.Organizations.Teams.MembersPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organizations;
    (function (Organizations) {
        var Teams;
        (function (Teams) {
            var MembersPage = /** @class */ (function () {
                function MembersPage() {
                }
                MembersPage.prototype.pageStart = function () {
                    this.setupAddLocationDialog();
                    $("button[action='add-team-member']").click(function () {
                        $("#addMemberDialog").modal("show");
                    });
                    $("button[action='remove-team-member']").click(function (evt) {
                        var btn = $(evt.target);
                        var memberId = btn.data("member-id");
                        $("#removeTeamMember_Id_Field").attr("value", memberId);
                        $("#removeTeamMember_Form").submit();
                    });
                };
                MembersPage.prototype.setupAddLocationDialog = function () {
                    var dlg = $("#addMemberDialog");
                    var contentUri = dlg.data("modal-uri");
                    dlg.load(contentUri, function () {
                        Juillet.Web.Mvc.setupJuilletComponents(dlg);
                        // hack to fix the width
                        dlg.find(".select2.select2-container").css("width", "100%");
                    });
                    return dlg;
                };
                return MembersPage;
            }());
            Teams.MembersPage = MembersPage;
        })(Teams = Organizations.Teams || (Organizations.Teams = {}));
    })(Organizations = AccessManagement.Organizations || (AccessManagement.Organizations = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.teams.members.js.map