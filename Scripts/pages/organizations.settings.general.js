$(document).ready(function () {
    // Prevent accidental form submission via Enter key
    $(window).keydown(function (evt) {
        if (evt.keyCode === 13) {
            event.preventDefault();
            return false;
        }
        return true;
    });

    new AccessManagement.Organizations.Settings.GeneralPage().pageStart();
});

var AccessManagement;
(function (AccessManagement) {
    var Organizations;
    (function (Organizations) {
        var Settings;
        (function (Settings) {
            var GeneralPage = /** @class */ (function () {
                function GeneralPage() {
                    this._originalValues = {};
                }

                GeneralPage.prototype.pageStart = function () {
                    var _this = this;

                    // Hidden fields for Google Places
                    this.hiddenLatLng = $("#RegistrationData_AddressLatLng");
                    this.hiddenPlaceId = $("#RegistrationData_PlaceId");

                    // Google Places autocomplete on the address field
                    var autocompleteElementId = "RegistrationData_Address";
                    var input = document.getElementById(autocompleteElementId);
                    if (input == null) {
                        console.error("No input element with id '" + autocompleteElementId + "' found on page.");
                    } else {
                        var autocomplete = new google.maps.places.Autocomplete(input);
                        autocomplete.addListener("place_changed", function () {
                            var place = autocomplete.getPlace();
                            if (!place || !place.geometry) {
                                console.error("No google place details available for input: '" + (place ? place.name : "") + "'");
                                _this.clearLocationFields();
                                return;
                            }
                            var loc = place.geometry.location.lat() + "," + place.geometry.location.lng();
                            _this.hiddenLatLng.val(loc);
                            _this.hiddenPlaceId.val(place.place_id);
                        });
                    }

                    // Edit button — enter edit mode
                    $("#btnEdit").on("click", function () {
                        _this.enterEditMode();
                    });

                    // Cancel button — discard changes, return to view mode
                    $("#btnCancel").on("click", function () {
                        _this.restoreOriginalValues();
                        _this.exitEditMode();
                    });

                    // Save button — AJAX POST to persist changes
                    $("#btnSave").on("click", function () {
                        _this.saveChanges();
                    });
                };

                // Switch to edit mode: make fields editable, swap buttons
                GeneralPage.prototype.enterEditMode = function () {
                    this.storeOriginalValues();
                    $(".org-field").removeAttr("readonly");
                    $("#btnEdit").hide();
                    $("#btnSave").show();
                    $("#btnCancel").show();
                    this.hideAlert();
                };

                // Switch to view mode: make fields read-only, swap buttons
                GeneralPage.prototype.exitEditMode = function () {
                    $(".org-field").attr("readonly", "readonly");
                    $("#btnSave").hide();
                    $("#btnCancel").hide();
                    $("#btnEdit").show();
                };

                // Snapshot current field values so Cancel can restore them
                GeneralPage.prototype.storeOriginalValues = function () {
                    var _this = this;
                    _this._originalValues = {};
                    $(".org-field").each(function () {
                        _this._originalValues[this.id] = $(this).val();
                    });
                    // Also snapshot the hidden Google Places fields
                    _this._originalValues["RegistrationData_AddressLatLng"] = _this.hiddenLatLng.val();
                    _this._originalValues["RegistrationData_PlaceId"] = _this.hiddenPlaceId.val();
                };

                // Put original values back into inputs
                GeneralPage.prototype.restoreOriginalValues = function () {
                    var _this = this;
                    $(".org-field").each(function () {
                        $(this).val(_this._originalValues[this.id] || "");
                    });
                    _this.hiddenLatLng.val(_this._originalValues["RegistrationData_AddressLatLng"] || "");
                    _this.hiddenPlaceId.val(_this._originalValues["RegistrationData_PlaceId"] || "");
                };

                // AJAX POST — serialises the entire form and sends it to the server
                GeneralPage.prototype.saveChanges = function () {
                    var _this = this;
                    var $saveBtn = $("#btnSave");

                    $saveBtn.prop("disabled", true).text("Saving…");

                    $.ajax({
                        url: $("#generalSettingsForm").attr("action") || window.location.pathname,
                        method: "POST",
                        data: $("#generalSettingsForm").serialize(),
                        success: function () {
                            _this.exitEditMode();
                            _this.showAlert("success", "Organization details updated successfully.");
                        },
                        error: function (xhr) {
                            var message = "An error occurred while saving. Please try again.";
                            if (xhr.status === 400) {
                                message = "Please check your entries and try again.";
                            }
                            _this.showAlert("danger", message);
                        },
                        complete: function () {
                            $saveBtn.prop("disabled", false).html('<i class="glyphicon glyphicon-floppy-disk"></i> Save');
                        }
                    });
                };

                GeneralPage.prototype.showAlert = function (type, message) {
                    var $alert = $("#saveAlert");
                    $alert
                        .removeClass("alert-success alert-danger alert-info")
                        .addClass("alert-" + type)
                        .text(message)
                        .show();

                    // Auto-dismiss success messages after 4 seconds
                    if (type === "success") {
                        setTimeout(function () {
                            $alert.fadeOut();
                        }, 4000);
                    }
                };

                GeneralPage.prototype.hideAlert = function () {
                    $("#saveAlert").hide();
                };

                GeneralPage.prototype.clearLocationFields = function () {
                    this.hiddenLatLng.val("");
                    this.hiddenPlaceId.val("");
                };

                return GeneralPage;
            }());
            Settings.GeneralPage = GeneralPage;
        })(Settings = Organizations.Settings || (Organizations.Settings = {}));
    })(Organizations = AccessManagement.Organizations || (AccessManagement.Organizations = {}));
})(AccessManagement || (AccessManagement = {}));
