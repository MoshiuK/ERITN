$(document)
    .ready(function () {
    new AccessManagement.Organization.Event.PickupsPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var Event;
        (function (Event) {
            var PickupsPage = /** @class */ (function () {
                function PickupsPage() {
                }
                PickupsPage.prototype.pageStart = function () {
                    var _this = this;
                    var inputField = $("#pickupsListFilter");
                    var eventId = inputField.data("event-id");
                    inputField.on("change keydown paste input", (function (evt) {
                        var textInput = $(evt.target).val();
                        if (_this.userFilterTimer != null) {
                            clearTimeout(_this.userFilterTimer);
                        }
                        _this.userFilterTimer = setTimeout(function () {
                            _this.reloadInvitationList(textInput, eventId);
                            _this.userFilterTimer = null;
                        }, 250);
                    }));
                };
                PickupsPage.prototype.reloadInvitationList = function (textInput, eventId) {
                    var params = [];
                    var url = "/Organizations/Event/PickupsTable/" + eventId;
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
                        var table = $("#pickupsList");
                        var container = table.parent();
                        table.remove();
                        container.html(tableContent);
                    });
                };
                return PickupsPage;
            }());
            Event.PickupsPage = PickupsPage;
        })(Event = Organization.Event || (Organization.Event = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.event.pickups.js.map