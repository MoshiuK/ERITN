$(document)
    .ready(function () {
    new AccessManagement.Administration.Clearinghouse.Organizations().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Clearinghouse;
        (function (Clearinghouse) {
            var Organizations = /** @class */ (function () {
                function Organizations() {
                }
                Organizations.prototype.pageStart = function () {
                    $("#resetKeysButton").click(function () {
                        alert("Reset Keys Hit");
                    });
                    this.setupResetSecurityKeyDialog();
                };
                Organizations.prototype.setupResetSecurityKeyDialog = function () {
                    var dlg = $("#resetSecurityKeys");
                    var contentUri = dlg.data("modal-uri");
                    dlg.load(contentUri, function () {
                        Juillet.Web.Mvc.setupJuilletComponents(dlg);
                    });
                    return dlg;
                };
                return Organizations;
            }());
            Clearinghouse.Organizations = Organizations;
        })(Clearinghouse = Administration.Clearinghouse || (Administration.Clearinghouse = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administrations.clearinghouse.organizations.js.map