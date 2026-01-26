$(document)
    .ready(function () {
    new AccessManagement.Organization.PeopleHub.PeoplePage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var PeopleHub;
        (function (PeopleHub) {
            var PeoplePage = /** @class */ (function () {
                function PeoplePage() {
                }
                PeoplePage.prototype.pageStart = function () {
                    var _this = this;
                    this.setupAddLocationDialog();
                    $("#peopleListFilter").on("change keydown paste input", (function (evt) {
                        var textInput = $(evt.target).val();
                        if (_this.userFilterTimer != null) {
                            clearTimeout(_this.userFilterTimer);
                        }
                        var selectedTeamIds = [];
                        $(".teams-list li.active").each(function (idx, e) {
                            selectedTeamIds.push($(e).data("team-id"));
                        });
                        _this.userFilterTimer = setTimeout(function () {
                            _this.reloadPeopleList(textInput, selectedTeamIds.join(","));
                            _this.userFilterTimer = null;
                        }, 250);
                    }));
                    $("button[action='add-team-member']").click(function () {
                        $("#addMemberDialog").modal("show");
                    });
                };
                PeoplePage.prototype.reloadPeopleList = function (textInput, selectedTeamIds) {
                    var params = [];
                    var url = "/Organizations/PeopleHub/PeopleTable";
                    if (textInput !== null && textInput !== undefined && textInput.length > 0) {
                        params.push("q=".concat(textInput));
                        $("#pagingDiv").hide();
                    }
                    else {
                        $("#pagingDiv").find('.btn.active').removeClass('active');
                        var firstPage = $("a[href*='paging.index=0']");
                        firstPage.addClass("active");
                        $("#pagingDiv").show();
                    }
                    if (selectedTeamIds !== null && selectedTeamIds !== undefined && selectedTeamIds.length > 0) {
                        params.push("team=".concat(selectedTeamIds));
                    }
                    if (params.length > 0) {
                        url = "".concat(url, "?").concat(params[0]);
                        for (var i = 1; i < params.length; i++) {
                            url = "".concat(url, "&").concat(params[i]);
                        }
                    }
                    var req = $.ajax({
                        url: url,
                        method: "GET",
                        dataType: "html"
                    });
                    req.done(function (tableContent) {
                        var table = $("#peopleList");
                        var container = table.parent();
                        table.remove();
                        container.html(tableContent);
                    });
                };
                PeoplePage.prototype.setupAddLocationDialog = function () {
                    var dlg = $("#addMemberDialog");
                    if (dlg === undefined || dlg === null || dlg.length === 0) {
                        return null;
                    }
                    var contentUri = dlg.data("modal-uri");
                    dlg.load(contentUri, function () {
                        Juillet.Web.Mvc.setupJuilletComponents(dlg);
                        // hack to fix the width
                        dlg.find(".select2.select2-container").css("width", "100%");
                    });
                    return dlg;
                };
                return PeoplePage;
            }());
            PeopleHub.PeoplePage = PeoplePage;
        })(PeopleHub = Organization.PeopleHub || (Organization.PeopleHub = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.peoplehub.people.js.map