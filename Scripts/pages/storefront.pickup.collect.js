$(document)
    .ready(function () {
    new AccessManagement.Storefront.Pickup.CollectPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Storefront;
    (function (Storefront) {
        var Pickup;
        (function (Pickup) {
            var CollectPage = /** @class */ (function () {
                function CollectPage() {
                }
                CollectPage.prototype.pageStart = function () {
                    $("#collectButton").click(function (e) {
                        var btn = $(e.target);
                        btn.button("loading");
                        var id = btn.data("ticket-id");
                        var nonce = btn.data("ticket-nonce");
                        $.ajax({
                            url: "/api/storefront/pickup/credentials/".concat(id, "/collect?nonce=").concat(nonce),
                            type: "PUT",
                            contentType: "application/json",
                            success: function () {
                                toastr.success("Flagged your credentials for pickup.", "OK");
                                btn.text("Done.");
                                btn.attr("disabled", "");
                            },
                            error: function (xhr, status, err) {
                                btn.button("reset");
                                console.error("Failed to mark credentials for collection. Message: ".concat(err));
                                console.error(xhr);
                                toastr.error("Something went wrong.  Try refreshing this page.", "ERROR");
                            }
                        });
                    });
                };
                return CollectPage;
            }());
            Pickup.CollectPage = CollectPage;
        })(Pickup = Storefront.Pickup || (Storefront.Pickup = {}));
    })(Storefront = AccessManagement.Storefront || (AccessManagement.Storefront = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=storefront.pickup.collect.js.map