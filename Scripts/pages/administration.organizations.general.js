$(document)
    .ready(function () {
    $(window).keydown(function (evt) {
        if (evt.keyCode === 13) {
            event.preventDefault();
            return false;
        }
        return true;
    });
    new AccessManagement.Administration.Organization.GeneralPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Organization;
        (function (Organization) {
            var GeneralPage = /** @class */ (function () {
                function GeneralPage() {
                }
                GeneralPage.prototype.pageStart = function () {
                    var _this = this;
                    this.hiddenLatLng = $("#RegistrationData_AddressLatLng");
                    this.hiddenPlaceId = $("#RegistrationData_PlaceId");
                    var autocompleteElementId = "RegistrationData_Address";
                    var input = document.getElementById(autocompleteElementId);
                    if (input == null) {
                        console.error("No input element with id '".concat(autocompleteElementId, "' found on page."));
                        return;
                    }
                    var autocomplete = new google.maps.places.Autocomplete(input);
                    autocomplete.addListener("place_changed", function () {
                        var place = autocomplete.getPlace();
                        if (place === null || place === undefined) {
                            _this.clearLocationFields();
                            return;
                        }
                        if (!place.geometry) {
                            // User entered the name of a Place that was not suggested and
                            // pressed the Enter key, or the Place Details request failed.
                            console.error("No google place details available for input: '".concat(place.name, "'"));
                            _this.clearLocationFields();
                            return;
                        }
                        var loc = "".concat(place.geometry.location.lat(), ",").concat(place.geometry.location.lng());
                        _this.hiddenLatLng.val(loc);
                        _this.hiddenPlaceId.val(place.place_id);
                    });
                };
                GeneralPage.prototype.clearLocationFields = function () {
                    this.hiddenLatLng.val("");
                    this.hiddenPlaceId.val("");
                };
                return GeneralPage;
            }());
            Organization.GeneralPage = GeneralPage;
        })(Organization = Administration.Organization || (Administration.Organization = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.organizations.general.js.map