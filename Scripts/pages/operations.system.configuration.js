/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/toastr/index.d.ts"/>
/// <reference path="../typings/ladda/ladda.d.ts"/>
$(document)
    .ready(function () {
    $("button[sps-action='update-config']").click(function (e) {
        var ladda = Ladda.create(e.target);
        ladda.start();
        var btn = $(e.target);
        var fieldId = btn.attr("data-field-id");
        var value = $("#".concat(fieldId)).val();
        var key = btn.attr("data-key");
        var body = { key: key, value: value };
        var req = $.ajax({
            url: "/viewapi/operations/system/configuration",
            method: "PUT",
            data: JSON.stringify(body),
            dataType: "json",
            contentType: "application/json"
        });
        req.fail(function (xhr) {
            var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
            toastr["error"](msg, "Failed to update configuration item");
        });
        req.done(function () {
            toastr["success"]("Updated OK", "Configuration item changed");
        });
        req.always(function () {
            setTimeout(function () {
                ladda.stop();
                ladda.remove();
            }, 500);
        });
    });
});
//# sourceMappingURL=operations.system.configuration.js.map