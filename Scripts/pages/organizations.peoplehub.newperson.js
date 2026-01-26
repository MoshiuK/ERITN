$(document)
    .ready(function () {
    new AccessManagement.Organization.PeopleHub.NewPersonPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var PeopleHub;
        (function (PeopleHub) {
            var NewPersonPage = /** @class */ (function () {
                function NewPersonPage() {
                }
                NewPersonPage.prototype.pageStart = function () {
                    var nameField = $("#Name");
                    nameField.focus();
                    $("#createButton").click(function (e) {
                        if ($("#newPersonForm").valid()) {
                            var spin = Ladda.create(e.target);
                            spin.start();
                            $("#newPersonForm").submit();
                            // Necessary for IE
                            $("#createButton").show();
                        }
                    });
                    var primaryIdSelect = $('#primaryIdSelect');
                    var secondaryIdSelect = $('#secondaryIdSelect');
                    var primaryIdSelectedVal = primaryIdSelect.val();
                    var secondaryIdSelectedVal = secondaryIdSelect.val();
                    var message = $('#message');
                    var alertDiv = $('#alertDiv');
                    // Prevent duplicate id types.
                    alertDiv.hide();
                    // If either of the ids are changed to match the other currently selected id,
                    // update the select to the previous value and display an error message.
                    $('#secondaryIdSelect').on('change', function () {
                        if (secondaryIdSelect.val() === primaryIdSelect.val()) {
                            message.html('Please select two different forms of id.');
                            secondaryIdSelect.val(secondaryIdSelectedVal).trigger('change.select2');
                            alertDiv.removeClass('hidden');
                            alertDiv.show();
                            alertDiv.delay(2000).fadeOut();
                        }
                        else {
                            secondaryIdSelectedVal = secondaryIdSelect.val();
                            message.html('&nbsp');
                            alertDiv.hide();
                        }
                    });
                    $('#primaryIdSelect').on('change', function () {
                        if (primaryIdSelect.val() === secondaryIdSelect.val()) {
                            message.html('Please select two different forms of id.');
                            primaryIdSelect.val(primaryIdSelectedVal).trigger('change.select2');
                            alertDiv.removeClass('hidden');
                            alertDiv.show();
                            alertDiv.delay(2000).fadeOut();
                        }
                        else {
                            primaryIdSelectedVal = primaryIdSelect.val();
                            message.html('&nbsp');
                            alertDiv.hide();
                        }
                    });
                };
                return NewPersonPage;
            }());
            PeopleHub.NewPersonPage = NewPersonPage;
        })(PeopleHub = Organization.PeopleHub || (Organization.PeopleHub = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.peoplehub.newperson.js.map