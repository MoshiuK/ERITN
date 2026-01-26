$(document)
    .ready(function () {
    new AccessManagement.Administration.Registration.SummaryLine().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Registration;
        (function (Registration) {
            var SummaryLine = /** @class */ (function () {
                function SummaryLine() {
                }
                SummaryLine.prototype.pageStart = function () {
                    $("a[action='abandon']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var id = btn.data("id");
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        var req = $.ajax({
                            url: "/Administration/Registration/Abandon",
                            type: 'POST',
                            data: {
                                __RequestVerificationToken: token,
                                id: id
                            }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                };
                return SummaryLine;
            }());
            Registration.SummaryLine = SummaryLine;
        })(Registration = Administration.Registration || (Administration.Registration = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.registration.summaryline.js.map