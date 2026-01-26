$(document)
    .ready(function () {
    new AccessManagement.Organization.PeopleHub.EnrollmentsPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var PeopleHub;
        (function (PeopleHub) {
            var EnrollmentsPage = /** @class */ (function () {
                function EnrollmentsPage() {
                }
                EnrollmentsPage.prototype.pageStart = function () {
                    var _this = this;
                    $("#enrollmentListFilter").on("change keydown paste input", (function (evt) {
                        var textInput = $(evt.target).val();
                        if (_this.userFilterTimer != null) {
                            clearTimeout(_this.userFilterTimer);
                        }
                        _this.userFilterTimer = setTimeout(function () {
                            _this.reloadInvitationList(textInput);
                            _this.userFilterTimer = null;
                        }, 250);
                    }));
                    $("a[action='filter']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var filter = btn.data("include");
                        var req = $.ajax({
                            url: "/Organizations/Enrollments/ToggleFilterPreference",
                            method: "PUT",
                            dataType: "json",
                            data: { "filter": filter }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                    $("a[action='order-by']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var tag = btn.data("sort-tag");
                        var req = $.ajax({
                            url: "/Organizations/Enrollments/SetOrderByPreference",
                            method: "PUT",
                            dataType: "json",
                            data: { "tag": tag }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                    $("a[action='date-filter']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var tag = btn.data("filter-tag");
                        var req = $.ajax({
                            url: "/Organizations/Enrollments/SetDateFilterPreference",
                            method: "PUT",
                            dataType: "json",
                            data: { "tag": tag }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                };
                EnrollmentsPage.prototype.reloadInvitationList = function (textInput) {
                    var params = [];
                    var url = "/Organizations/Enrollments/EnrollmentTable";
                    if (textInput !== null && textInput !== undefined && textInput.length > 0) {
                        params.push("q=".concat(textInput));
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
                        var table = $("#enrollmentList");
                        var container = table.parent();
                        table.remove();
                        container.html(tableContent);
                    });
                };
                return EnrollmentsPage;
            }());
            PeopleHub.EnrollmentsPage = EnrollmentsPage;
        })(PeopleHub = Organization.PeopleHub || (Organization.PeopleHub = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.peoplehub.enrollments.js.map