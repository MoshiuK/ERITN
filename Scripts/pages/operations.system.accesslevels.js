/// <reference path="../typings/jquery/jquery.d.ts"/>
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
        var accessLevelId = btn.attr("data-accesslevel");
        var body = { tenantId: tenantId, accessLevelId: accessLevelId };
        var req = $.ajax({
            url: "/viewapi/operations/system/accesslevels",
            method: "PUT",
            data: JSON.stringify(body),
            dataType: "json",
            contentType: "application/json"
        });
        req.fail(function (xhr) {
            var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
            toastr["error"](msg, "Failed to update tenant access level.");
        });
        req.done(function () {
            var newCaption = selected ? "Enable" : "Disable";
            var newColor = selected ? "green" : "red";
            btn.attr("data-selected", selected ? "false" : "true");
            btn.attr("data-color", newColor);
            btn.html(newCaption + "<span class=\"ladda-label\"></span>");
            toastr["success"]("Updated OK", "Tenant access level changed.");
        });
        req.always(function () {
            setTimeout(function () {
                ladda.stop();
                ladda.remove();
            }, 500);
        });
    });
});
//# sourceMappingURL=operations.system.accesslevels.js.map