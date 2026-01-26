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
        var transitPurposeId = btn.attr("data-transitpurpose");
        var body = { tenantId: tenantId, transitPurposeId: transitPurposeId };
        var req = $.ajax({
            url: "/viewapi/operations/system/transitpurposes",
            method: "PUT",
            data: JSON.stringify(body),
            dataType: "json",
            contentType: "application/json"
        });
        req.fail(function (xhr) {
            var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
            toastr["error"](msg, "Failed to update tenant support function.");
        });
        req.done(function () {
            var newCaption = selected ? "Enable" : "Disable";
            var newColor = selected ? "green" : "red";
            btn.attr("data-selected", selected ? "false" : "true");
            btn.attr("data-color", newColor);
            btn.html(newCaption + "<span class=\"ladda-label\"></span>");
            toastr["success"]("Updated OK", "Tenant support function changed.");
        });
        req.always(function () {
            setTimeout(function () {
                ladda.stop();
                ladda.remove();
            }, 500);
        });
    });
});
//# sourceMappingURL=operations.system.transitpurposes.js.map