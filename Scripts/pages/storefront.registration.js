/// <reference path="../typings/jquery.validation/jquery.validation.d.ts"/>
/// <reference path="../typings/jquery-steps/jquery-steps.d.ts"/>
/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../typings/googlemaps/index.d.ts"/>
$(document)
    .ready(function () {
    new AccessManagement.Storefront.Registration.GeneralPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Storefront;
    (function (Storefront) {
        var Registration;
        (function (Registration) {
            var GeneralPage = /** @class */ (function () {
                function GeneralPage() {
                }
                GeneralPage.prototype.pageStart = function () {
                    var _this = this;
                    // setup steps
                    var stepsContainer = $("#registration-form");
                    stepsContainer.steps({
                        titleTemplate: "<span class='number'>#index#</span>",
                        headerTag: "h3",
                        bodyTag: "section",
                        transitionEffect: "none",
                        onStepChanging: function (event, currentIndex, newIndex) {
                            stepsContainer.validate();
                            var isValid = stepsContainer.valid();
                            switch (newIndex) {
                                case 2:
                                    isValid = _this.registrationStepEnsureLocationSelected();
                                    break;
                                case 3:
                                    isValid = _this.registrationStepEnsureAccessLevelSelected();
                                    break;
                                case 4:
                                    isValid = _this.registrationStepEnsurePurposeSelected() && _this.personnelCountValid();
                                    if (isValid) {
                                        _this.registrationStepLoadPreviewPane();
                                    }
                                    break;
                            }
                            if (isValid) {
                                var err = $("#registrationValidationAlert");
                                err.text("");
                                err.addClass("hidden");
                            }
                            return isValid;
                        },
                        onFinishing: function (event, currentIndex) {
                            stepsContainer.validate();
                            return stepsContainer.valid();
                        },
                        onFinished: function (event, currentIndex) {
                            stepsContainer.submit();
                        },
                        autoFocus: true
                    });
                    stepsContainer.removeClass("hidden");
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
                    $("[data-toggle='popover']").popover();
                    $("#previewButton").click(function () {
                        var previewer = $(".preview-container");
                        var uri = previewer.attr("data-preview-uri");
                        previewer.load(uri);
                    });
                };
                GeneralPage.prototype.registrationStepEnsureLocationSelected = function () {
                    // NOTE: we don't actually need to have any location selected.
                    return true;
                };
                GeneralPage.prototype.registrationStepEnsureAccessLevelSelected = function () {
                    var valid = $("input[name='AccessTiers']:checked").length > 0;
                    if (!valid) {
                        var err = $("#registrationValidationAlert");
                        err.text("You must select at least one access tier for your personnel.");
                        err.removeClass("hidden");
                    }
                    return valid;
                };
                GeneralPage.prototype.personnelCountValid = function () {
                    var personnelCount = $("input[name='PersonnelCount']").val();
                    var valid = personnelCount > 0 && personnelCount < 10000;
                    if (!valid) {
                        var err = $("#registrationValidationAlert");
                        err.text("Personnel count must be between 1 and 9999.");
                        err.removeClass("hidden");
                    }
                    return valid;
                };
                GeneralPage.prototype.registrationStepEnsurePurposeSelected = function () {
                    var valid = $("input[name='TransitPurposes']:checked").length > 0;
                    if (!valid) {
                        var err = $("#registrationValidationAlert");
                        err.text("You must select at least one reason or purpose for access.");
                        err.removeClass("hidden");
                    }
                    return valid;
                };
                GeneralPage.prototype.registrationStepLoadPreviewPane = function () {
                    var previewer = $(".preview-container");
                    var uri = previewer.attr("data-preview-uri");
                    var orgName = $("input[name='OrganizationName']").val();
                    var personName = $("input[name='PrimaryContact.Name']").val();
                    var firstPurpose = $("input[name='TransitPurposes']:checked").first();
                    var purposeCaption = firstPurpose.data("caption");
                    var purposeEsf = firstPurpose.data("esf");
                    var firstAccessLevel = $("input[name='AccessTiers']:checked").first().attr("value");
                    var previewUri = encodeURI("".concat(uri, "?OrganizationName=").concat(orgName, "&PersonName=").concat(personName, "&PurposeCaption=").concat(purposeCaption, "&PurposeEsf=").concat(purposeEsf, "&AccessLevelId=").concat(firstAccessLevel));
                    console.log("Load preview from ".concat(previewUri, "."));
                    previewer.load(previewUri);
                };
                GeneralPage.prototype.initAddressAutocomplete = function () {
                    var autocompleteElementId = "OrganizationLocation";
                    var input = document.getElementById(autocompleteElementId);
                    if (input == null) {
                        console.error("No input element with id '".concat(autocompleteElementId, "' found on page."));
                        return;
                    }
                    var placeIdInput = $("#OrganizationPlaceId");
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
                        placeIdInput.val(place.place_id);
                    });
                };
                return GeneralPage;
            }());
            Registration.GeneralPage = GeneralPage;
        })(Registration = Storefront.Registration || (Storefront.Registration = {}));
    })(Storefront = AccessManagement.Storefront || (AccessManagement.Storefront = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=storefront.registration.js.map