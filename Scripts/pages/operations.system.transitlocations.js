/// <reference path="../typings/toastr/index.d.ts"/>
/// <reference path="../typings/ladda/ladda.d.ts"/>
$(document)
    .ready(function () {
    $("button[sps-action='toggle-selection']").click(function (e) {
        var ladda = Ladda.create(e.target);
        ladda.start();
        var btn = $(e.target);
        var selected = btn.attr("data-selected").toLowerCase() === "true";
        var tenantId = btn.attr("data-tenant");
        var transitlocationId = btn.attr("data-transitlocation");
        var body = { tenantId: tenantId, transitlocationId: transitlocationId };
        var req = $.ajax({
            url: "/viewapi/operations/system/transitlocations",
            method: "PUT",
            data: JSON.stringify(body),
            dataType: "json",
            contentType: "application/json"
        });
        req.fail(function (xhr) {
            var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
            toastr["error"](msg, "Failed to update tenant transit location.");
        });
        req.done(function () {
            var newCaption = selected ? "Enable" : "Disable";
            var newColor = selected ? "green" : "red";
            btn.attr("data-selected", selected ? "false" : "true");
            btn.attr("data-color", newColor);
            btn.html(newCaption + "<span class=\"ladda-label\"></span>");
            toastr["success"]("Updated OK", "Tenant transit location changed.");
        });
        req.always(function () {
            setTimeout(function () {
                ladda.stop();
                ladda.remove();
            }, 500);
        });
    });
    $("a[data-upload-logo-dialog]").click(function (e) {
        var btn = $(e.target).closest("a");
        var dialogBodyUrl = btn.data("upload-logo-dialog");
        if (dialogBodyUrl === null || dialogBodyUrl === undefined) {
            toastr.error("Unable to load dialog.  Try refreshing the page.");
        }
        var dlg = $("#uploadLogoDialog");
        var ladda;
        dlg.load(dialogBodyUrl, function (responseBody, status, xhr) {
            if (status === "success") {
                Juillet.Web.Mvc.setupJuilletComponents(dlg);
                var submitButton = $("button[type='submit']", dlg);
                if (submitButton.length > 0) {
                    ladda = Ladda.create(submitButton[0]);
                    submitButton.click(function () {
                        ladda.start();
                    });
                }
            }
            else {
                toastr.error("Error occurred loading dialog content. Status = ".concat(status, "; HTTP ").concat(xhr.status, "; ").concat(responseBody));
            }
        });
        dlg.on("hidden.bs.modal", function () {
            if (ladda === null || ladda === undefined) {
                return;
            }
            ladda.stop();
            ladda.remove();
        });
        dlg.modal("show");
    });
});
//# sourceMappingURL=operations.system.transitlocations.js.map