/// <reference path="../typings/jquery.validation/jquery.validation.d.ts"/>
/// <reference path="../typings/jquery-steps/jquery-steps.d.ts"/>
/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../typings/googlemaps/index.d.ts"/>
$(document)
    .ready(function () {
    new AccessManagement.Administration.Registration.Edit().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Registration;
        (function (Registration) {
            var Edit = /** @class */ (function () {
                function Edit() {
                }
                Edit.prototype.pageStart = function () {
                    // setup Google Maps autocomplete
                    this.initAddressAutocomplete();
                    var transitLocationSelections = $("#transitLocationsSelect");
                    if (transitLocationSelections != null) {
                        transitLocationSelections.select2({
                            placeholder: "Select one or more locations",
                            multiple: true,
                            allowClear: true
                        });
                    }
                    $("a[action='removeTransitLocation']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var id = btn.data("id");
                        var level = btn.data("leveltoremove");
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        var req = $.ajax({
                            url: "/Administration/Registration/RemoveTransitLocation",
                            type: 'POST',
                            data: {
                                __RequestVerificationToken: token,
                                id: id,
                                levelToRemove: level
                            }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                    $("a[action='removeAccessLevel']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var id = btn.data("id");
                        var level = btn.data("leveltoremove");
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        var req = $.ajax({
                            url: "/Administration/Registration/RemoveAccessLevel",
                            type: 'POST',
                            data: {
                                __RequestVerificationToken: token,
                                id: id,
                                levelToRemove: level
                            }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                    $("a[action='removeTransitPurpose']").click(function (evt) {
                        var btn = $(evt.target).closest("a");
                        var id = btn.data("id");
                        var level = btn.data("leveltoremove");
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        var req = $.ajax({
                            url: "/Administration/Registration/RemoveTransitPurpose",
                            type: 'POST',
                            data: {
                                __RequestVerificationToken: token,
                                id: id,
                                levelToRemove: level
                            }
                        });
                        req.always(function () {
                            location.reload();
                        });
                    });
                };
                Edit.prototype.initAddressAutocomplete = function () {
                    var autocompleteElementId = "OrganizationAddress";
                    var input = document.getElementById(autocompleteElementId);
                    if (input == null) {
                        console.error("No input element with id '".concat(autocompleteElementId, "' found on page."));
                        return;
                    }
                    var placeIdInput = $("#OrganizationPlaceId");
                    var latlongInput = $("#OrganizationLocation");
                    var autocomplete = new google.maps.places.Autocomplete(input);
                    autocomplete.addListener("place_changed", function () {
                        var place = autocomplete.getPlace();
                        if (!place.geometry) {
                            // User entered the name of a Place that was not suggested and
                            // pressed the Enter key, or the Place Details request failed.
                            console.error("No google place details available for input: '".concat(place.name, "'"));
                            placeIdInput.val("");
                            return;
                        }
                        latlongInput.val(place.geometry.location.lat() + "," + place.geometry.location.lng());
                        placeIdInput.val(place.place_id);
                    });
                };
                return Edit;
            }());
            Registration.Edit = Edit;
        })(Registration = Administration.Registration || (Administration.Registration = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.registration.edit.js.map