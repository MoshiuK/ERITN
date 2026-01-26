$(document).ready(function () {
    new AccessManagement.Organizations.Person.ProfilePage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organizations;
    (function (Organizations) {
        var Person;
        (function (Person) {
            var ProfilePage = /** @class */ (function () {
                function ProfilePage() {
                }
                ProfilePage.prototype.pageStart = function () {
                    var editor = Juillet.Web.Mvc.avatarUploadProperty("NewPhoto");
                    Juillet.Web.Mvc.onDialogOk("#confirmRemovePhotoDialog", function () {
                        $("#removePhotoFormId").submit();
                    });
                    // Check the file size of the new image before
                    // allowing it to be uploaded.
                    // This is accomplished by sending a request to the blob url
                    // and getting its size in bytes.
                    // Bug 2481: POST Person/ChangePhoto does not handle large images
                    $("#photoAlertDiv").hide();
                    $(".avatar-upload-cropper-img ").on("load", function () {
                        // Bug 2484: Link to Person/ProfileDetails broken
                        // The remove button creates an exception in the logs. 
                        // The user can update the photo with the change button.
                        $("a.input-group-addon").hide();
                        var imageUrl = $(".avatar-upload-cropper-img ").attr("src");
                        var blob = null;
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', imageUrl, true);
                        xhr.responseType = 'blob';
                        xhr.onload = function () {
                            blob = xhr.response;
                            if (blob.size > 3800000) {
                                $("#uploadPhotoBtn").prop("disabled", true);
                                $("#photoAlertDiv").show();
                            }
                            else {
                                $("#uploadPhotoBtn").prop("disabled", false);
                                $("#photoAlertDiv").hide();
                            }
                        };
                        xhr.send();
                    });
                };
                return ProfilePage;
            }());
            Person.ProfilePage = ProfilePage;
        })(Person = Organizations.Person || (Organizations.Person = {}));
    })(Organizations = AccessManagement.Organizations || (AccessManagement.Organizations = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.person.profile.js.map