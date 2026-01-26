$(document)
    .ready(function () {
    new AccessManagement.Organization.Home.MessagesPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var Home;
        (function (Home) {
            var MessagesPage = /** @class */ (function () {
                function MessagesPage() {
                }
                MessagesPage.prototype.pageStart = function () {
                    $("button[data-message-id]").click(function (evt) {
                        var ladda = Ladda.create(evt.target);
                        ladda.start();
                        var btn = $(evt.target);
                        var messageId = btn.data("message-id");
                        var req = $.ajax({
                            url: "/viewapi/organizations/home/messages/".concat(messageId),
                            method: "DELETE"
                        });
                        req.fail(function (xhr) {
                            var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
                            toastr["error"](msg, "Failed to update tenant transit location.");
                        });
                        req.done(function () {
                            setTimeout(function () {
                                btn.closest("tr").remove();
                                if ($("tbody > tr").length === 0) {
                                    window.location.reload();
                                }
                            }, 600);
                        });
                        req.always(function () {
                            setTimeout(function () {
                                ladda.stop();
                                ladda.remove();
                            }, 500);
                        });
                    });
                };
                return MessagesPage;
            }());
            Home.MessagesPage = MessagesPage;
        })(Home = Organization.Home || (Organization.Home = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.home.messages.js.map