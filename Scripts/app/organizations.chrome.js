$(document)
    .ready(function () {
    new AccessManagement.Organizations.Chrome().setupNotificationToolbar();
});
var AccessManagement;
(function (AccessManagement) {
    var Organizations;
    (function (Organizations) {
        var Chrome = /** @class */ (function () {
            function Chrome() {
            }
            Chrome.prototype.setupNotificationToolbar = function () {
                $("#notificationsToolbarItem")
                    .find("a[href='#'].notifications-link")
                    .click(function () {
                    var thisPage = encodeURI(window.location.href);
                    var req = $.ajax({
                        url: "/Organizations/Home/ClearNotifications?returnUrl=".concat(thisPage),
                        method: "POST"
                    });
                    req.fail(function (xhr) {
                        var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
                        toastr["error"](msg, "Failed to clear messages.");
                    });
                    req.done(function () {
                        window.location.reload();
                    });
                });
            };
            return Chrome;
        }());
        Organizations.Chrome = Chrome;
    })(Organizations = AccessManagement.Organizations || (AccessManagement.Organizations = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.chrome.js.map