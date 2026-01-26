/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/bootstrap/index.d.ts"/>
/// <reference path="typings/select2/select2.d.ts"/>
/// <reference path="typings/bootstrap-datepicker/bootstrap-datepicker.d.ts"/>
/// <reference path="typings/bootstrap-colorpicker/bootstrap-colorpicker.d.ts"/>
/// <reference path="typings/bootstrap-clockpicker/bootstrap-clockpicker.d.ts"/>
/// <reference path="typings/cropperjs/index.d.ts"/>
"use strict";
$(document)
    .ready(function () {
    Juillet.Web.Mvc.setupJuilletComponents($("body"));
});
var Juillet;
(function (Juillet) {
    var Web;
    (function (Web) {
        var Mvc;
        (function (Mvc) {
            "use strict";
            // ReSharper disable InconsistentNaming
            var Selectors;
            (function (Selectors) {
                Selectors.CssClass_deferred_notification_item = ".deferred-notification-item";
                Selectors.CssClass_deferred_notification_container = ".deferred-notification-container";
            })(Selectors || (Selectors = {}));
            var Html;
            (function (Html) {
                Html.DataAttr_juillet_title = "data-juillet-title";
                Html.DataAttr_juillet_msg = "data-juillet-msg";
                Html.DataAttr_juillet_glyph = "data-juillet-glyph";
                Html.DataAttr_juillet_id = "data-juillet-id";
                Html.DataAttr_juillet_actionuri = "data-juillet-actionuri";
                Html.DataAttr_juillet_notification_type = "data-juillet-notification-type";
                Html.DataAttr_juillet_notification_raised = "data-juillet-notification-raised";
            })(Html || (Html = {}));
            // ReSharper restore InconsistentNaming
            var Utils;
            (function (Utils) {
                function hexToRgbA(hex) {
                    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                        var c = void 0;
                        c = hex.substring(1).split("");
                        if (c.length === 3) {
                            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                        }
                        c = "0x" + c.join("");
                        return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",1)";
                    }
                    return "rgba(0, 0, 0, 0)";
                }
                Utils.hexToRgbA = hexToRgbA;
            })(Utils || (Utils = {}));
            function setupJuilletComponents(container) {
                updateTimeElements(container);
                setupFormValidation(container);
                bindSelect2(container);
                bindAwesomeCheckBoxes(container);
                bindColorPickers(container);
                bindDatePickers(container);
                bindClockPickers(container);
                bindClipboardButtons(container);
                bindFilterTables(container);
                setupChromeComponents(container);
            }
            Mvc.setupJuilletComponents = setupJuilletComponents;
            function updateTimeElements(container) {
                var currentTime = new Date();
                var shortDate = currentTime.toLocaleDateString();
                var shortTime = currentTime.toLocaleTimeString();
                $("time[data-juillet-currentdatetime]", container).text(shortDate + " " + shortTime);
                $("time[data-juillet-currentdate]", container).text("" + shortDate);
                $("time[data-juillet-currenttime]", container).text("" + shortTime);
                $("time[data-juillet-utctolocal]", container)
                    .each(function (index, elem) {
                    var next = $(elem);
                    next.text(new Date(next.attr("data-juillet-utctolocal")).toLocaleString());
                });
            }
            function setupChromeComponents(container) {
                $("#miniNavbarToggleButton", container)
                    .click(function () {
                    var navbar = $(".navmenu");
                    if (navbar.hasClass("navmenu-mini")) {
                        navbar.removeClass("navmenu-mini");
                    }
                    else {
                        navbar.addClass("navmenu-mini");
                    }
                });
            }
            Mvc.setupChromeComponents = setupChromeComponents;
            ;
            Mvc.notificationTypeInfo = "info";
            Mvc.notificationTypeSuccess = "success";
            Mvc.notificationTypeWarning = "warning";
            Mvc.notificationTypeError = "error";
            function toastDefferredNotifications() {
                $(Selectors.CssClass_deferred_notification_item)
                    .each(function (i, e) {
                    var next = $(e);
                    var msg = {
                        type: next.attr(Html.DataAttr_juillet_notification_type),
                        glyph: next.attr(Html.DataAttr_juillet_glyph),
                        title: next.attr(Html.DataAttr_juillet_title),
                        msg: next.attr(Html.DataAttr_juillet_msg),
                        raised: next.attr(Html.DataAttr_juillet_notification_raised)
                    };
                    showNotificationToast(msg);
                });
                // then remove deferred toasts from the DOM
                $(Selectors.CssClass_deferred_notification_container).remove();
            }
            Mvc.toastDefferredNotifications = toastDefferredNotifications;
            function showNotificationToast(message) {
                var type = toToastrType(message.type);
                var glyph = message.glyph;
                var title = message.title;
                var msg = message.msg;
                var time = new Date(message.raised).toLocaleTimeString();
                toastr[type](msg, title);
            }
            function toToastrType(typeName) {
                switch (typeName.toLocaleLowerCase()) {
                    case Mvc.notificationTypeError:
                        return Mvc.notificationTypeError;
                    case Mvc.notificationTypeWarning:
                        return Mvc.notificationTypeWarning;
                    case Mvc.notificationTypeSuccess:
                        return Mvc.notificationTypeSuccess;
                    default:
                        return Mvc.notificationTypeInfo;
                }
            }
            function bindSelect2(container) {
                // https://select2.org/
                $(".select2-component", container).select2();
            }
            Mvc.bindSelect2 = bindSelect2;
            function bindDatePickers(container) {
                // https://github.com/uxsolutions/bootstrap-datepicker
                $(".datepicker-component", container)
                    .datepicker({
                    orientation: "bottom left",
                    forceParse: true,
                    autoclose: true
                });
            }
            Mvc.bindDatePickers = bindDatePickers;
            function bindClockPickers(container) {
                // http://weareoutman.github.io/clockpicker/
                $(".clockpicker-component", container)
                    .clockpicker({
                    donetext: "OK",
                    default: "now",
                    autoclose: true
                });
            }
            Mvc.bindClockPickers = bindClockPickers;
            function bindColorPickers(container) {
                // https://farbelous.github.io/bootstrap-colorpicker/
                $(".colorpicker-component", container)
                    .colorpicker({
                    component: ".colorpicker-addon"
                });
            }
            Mvc.bindColorPickers = bindColorPickers;
            function bindAwesomeCheckBoxes(container) {
                // https://github.com/flatlogic/awesome-bootstrap-checkbox
                $("input[type=checkbox]", container)
                    .change(function (eventObject) {
                    var checkbox = eventObject.target;
                    if (checkbox.checked) {
                        $(checkbox).attr("checked", "checked");
                        $(checkbox).attr("value", "true");
                    }
                    else {
                        $(checkbox).removeAttr("checked");
                        $(checkbox).attr("value", "false");
                    }
                });
            }
            Mvc.bindAwesomeCheckBoxes = bindAwesomeCheckBoxes;
            function bindClipboardButtons(container) {
                $(".clipboard-button", container).click(function (e) {
                    var textInput = $(e.target).attr("for");
                    $("#" + textInput).select();
                    try {
                        var outcome = document.execCommand("Copy");
                        if (!outcome) {
                            console.warn("Unable to copy to clipboard.  Check browser compatibility and clipboard permissions.");
                        }
                    }
                    catch (e) {
                        alert("Failed to copy to clipboard.");
                    }
                });
            }
            Mvc.bindClipboardButtons = bindClipboardButtons;
            var FilterTable = (function () {
                function FilterTable(container) {
                    this.table = $("table.filtertable-table", container);
                    this.input = $("input.filtertable-input", container);
                    this.setupFiltering();
                }
                FilterTable.prototype.setupFiltering = function () {
                    var _this = this;
                    this.input.on("change keydown paste input", function (e) {
                        var input = $(e.target);
                        var textInput = input.val();
                        if (_this.timer != null) {
                            clearTimeout(_this.timer);
                        }
                        _this.timer = setTimeout(function () {
                            _this.filterTable(_this.table, textInput);
                            _this.timer = null;
                        }, 250);
                    });
                };
                FilterTable.prototype.filterTable = function (table, textInput) {
                    var _this = this;
                    if (textInput.trim().length === 0) {
                        $("tr", table)
                            .each(function (idx, tr) {
                            $(tr).show();
                        });
                    }
                    else {
                        var tokens = textInput.split(" ").filter(function (tok) { return tok.trim().length > 0; });
                        $("tr", table)
                            .each(function (idx, tr) {
                            var row = $(tr);
                            var filterData = row.attr("data-filter");
                            var includeInList = false;
                            for (var i = 0; i < tokens.length; i++) {
                                var expr = _this.toSearchable(tokens[i]);
                                if (expr === "" || _this.isFilterMatch(expr, filterData)) {
                                    includeInList = true;
                                    break;
                                }
                            }
                            if (includeInList) {
                                row.show();
                            }
                            else {
                                row.hide();
                            }
                        });
                    }
                };
                FilterTable.prototype.isFilterMatch = function (expr, name) {
                    name = this.toSearchable(name);
                    var isMatch = name.length >= expr.length && name.substr(0, expr.length) === expr;
                    if (!isMatch) {
                        isMatch = name.indexOf(expr) > -1;
                    }
                    return isMatch;
                };
                FilterTable.prototype.toSearchable = function (expr) {
                    if (expr.trim().length === 0) {
                        return "";
                    }
                    expr = expr.toLowerCase();
                    return expr;
                };
                return FilterTable;
            }());
            function bindFilterTables(container) {
                var jqFilterTable = $(".filtertable", container);
                jqFilterTable.each(function (i, t) {
                    return new FilterTable($(t));
                });
            }
            Mvc.bindFilterTables = bindFilterTables;
            function setupFormValidation(container) {
                // when the fields are live, update the .has-errors class
                $("input, textarea, select", container)
                    .on("focusin focusout keyup", function (e) {
                    var target = $(e.target);
                    updateParentGroupHasErrors(target);
                });
                // when the form is submitted, update the .has-errors class
                $("form", container)
                    .submit(function (f) {
                    var form = $(f.target);
                    form.find("input, textarea, select")
                        .each(function (i, e) {
                        var nextField = $(e);
                        updateParentGroupHasErrors(nextField);
                    });
                });
                // fileinput by http://www.jasny.net/bootstrap/
                // setup validation of required fileinput elements
                var files = $(".fileinput-required", container);
                files.on("change.bs.fileinput", handleRequiredFileInputEvent);
                files.on("clear.bs.fileinput", handleRequiredFileInputEvent);
                files.on("reset.bs.fileinput", handleRequiredFileInputEvent);
            }
            Mvc.setupFormValidation = setupFormValidation;
            function handleRequiredFileInputEvent(e) {
                var next = $(e.target);
                var inputField = next.find("input[type=file]");
                var inputElementName = inputField[0].id.replace("_", ".");
                var isValid = updateRequiredFileInputValidationError(inputField);
                // put the bootstrap .has-errors class on the input-group 
                // or form- group containing the field
                updateParentGroupHasErrors(inputField);
                // update the validation message
                var container = next.parent().find("[data-valmsg-for=\"" + escapeAttributeValue(inputElementName) + "\"]");
                var replaceAttrValue = container.attr("data-valmsg-replace");
                var replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) !== false : null;
                if (isValid) {
                    if (replace) {
                        container.empty();
                    }
                }
                else {
                    if (replace) {
                        var err = "<span class=\"\" id=\"" + inputElementName + "-error\">" + inputField.attr("data-val-required") + "</span>";
                        container.html(err);
                        container.removeClass("field-validation-valid").addClass("field-validation-error");
                    }
                }
            }
            function updateParentGroupHasErrors(inp) {
                var grp = inp.parents(".form-group,.input-group");
                if (inp.hasClass("input-validation-error")) {
                    if (!grp.hasClass("has-error")) {
                        grp.addClass("has-error");
                    }
                }
                else {
                    if (grp.hasClass("has-error")) {
                        grp.removeClass("has-error");
                    }
                }
            }
            function updateRequiredFileInputValidationError(inp) {
                var valid = inp[0].files.length > 0;
                if (valid) {
                    if (inp.hasClass("input-validation-error")) {
                        inp.removeClass("input-validation-error");
                    }
                }
                else {
                    if (!inp.hasClass("input-validation-error")) {
                        inp.addClass("input-validation-error");
                    }
                }
                return valid;
            }
            function escapeAttributeValue(value) {
                // as mentioned on http://api.jquery.com/category/selectors/
                return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
            }
            var AvatarUpload = (function () {
                function AvatarUpload(avatarFile, avatarData, cropperImageElement) {
                    this.setupUploadAvatar(avatarFile, avatarData, cropperImageElement);
                }
                AvatarUpload.prototype.setupUploadAvatar = function (avatarFile, avatarData, cropperImageElement) {
                    var _this = this;
                    var cropperOptions = {
                        aspectRatio: 1,
                        preview: ".avatar-image-preview",
                        crop: function (e) {
                            var data = e.detail;
                            var json = "{\"x\":" + data.x + ",\"y\":" + data
                                .y + ",\"height\":" + data.height + ",\"width\":" + data.width + ",\"rotate\":" + data.rotate + "}";
                            avatarData.val(json);
                        }
                    };
                    this.cropper = new Cropper(cropperImageElement, cropperOptions);
                    avatarFile.change(function (e) {
                        var files = e.target.files;
                        if (files && files.length > 0) {
                            var targetFile = files[0];
                            // create a new URL for the new image
                            if (_this.uploadCandidateUrl) {
                                window.URL.revokeObjectURL(_this.uploadCandidateUrl);
                            }
                            _this.uploadCandidateUrl = window.URL.createObjectURL(targetFile);
                            cropperImageElement.src = _this.uploadCandidateUrl;
                            // recreate cropper for this new image.
                            _this.cropper.destroy();
                            _this.cropper = new Cropper(cropperImageElement, cropperOptions);
                        }
                        else {
                            cropperImageElement.src = null;
                            _this.cropper.destroy();
                        }
                    });
                };
                return AvatarUpload;
            }());
            function avatarUpload(avatarFile, avatarData, cropperImageElement) {
                var editor = new AvatarUpload(avatarFile, avatarData, cropperImageElement);
                return editor;
            }
            Mvc.avatarUpload = avatarUpload;
            function avatarUploadProperty(propertyName) {
                var avatarFile = $("#" + propertyName + "_AvatarFile");
                var avatarData = $("#" + propertyName + "_AvatarMetadataJson");
                var cropperImageElement = $("#" + propertyName + "_cropperImage")[0];
                return avatarUpload(avatarFile, avatarData, cropperImageElement);
            }
            Mvc.avatarUploadProperty = avatarUploadProperty;
            var AvatarTile = (function () {
                function AvatarTile(pickerComponent, tileTextBox, previews) {
                    this.setupAvatarTile(pickerComponent, tileTextBox, previews);
                }
                AvatarTile.prototype.setupAvatarTile = function (pickerComponent, tileTextBox, previews) {
                    var _this = this;
                    var colorHex = pickerComponent.children("input[type=text]");
                    var defaultColor = colorHex.val();
                    var picker = pickerComponent.colorpicker({
                        component: ".colorpicker-addon",
                        color: defaultColor
                    });
                    picker.on("changeColor", function (e) {
                        var color = e.color.toString("rgba");
                        _this.updatePreviews(previews, color, tileTextBox.val());
                    });
                    tileTextBox.on("blur keyup paste", function () {
                        _this.updatePreviews(previews, Utils.hexToRgbA(colorHex.val()), tileTextBox.val());
                    });
                    this.updatePreviews(previews, Utils.hexToRgbA(colorHex.val()), tileTextBox.val());
                };
                AvatarTile.prototype.updatePreviews = function (previews, color, caption) {
                    previews.each(function (i, element) {
                        $(element)[0].style.backgroundColor = color;
                    }).text(caption);
                };
                return AvatarTile;
            }());
            function avatarTile(pickerComponent, tileTextBox, previews) {
                var tile = new AvatarTile(pickerComponent, tileTextBox, previews);
                return tile;
            }
            Mvc.avatarTile = avatarTile;
            function avatarTileProperty(propertyName) {
                var pickerComponent = $("#" + propertyName + "\\.ColorHex_colorpicker");
                var tileTextbox = $("#" + propertyName + "_Label");
                var previews = $(".avatar-tile-preview", pickerComponent.closest(".avatar-tile-editor"));
                return avatarTile(pickerComponent, tileTextbox, previews);
            }
            Mvc.avatarTileProperty = avatarTileProperty;
            var AvatarEditor = (function () {
                function AvatarEditor(upload, tile) {
                    this.tile = tile;
                    this.upload = upload;
                }
                return AvatarEditor;
            }());
            function avatarEditor(upload, tile) {
                return new AvatarEditor(upload, tile);
            }
            Mvc.avatarEditor = avatarEditor;
            function avatarEditorProperty(propertyName) {
                var avatarFile = $("#" + propertyName + "_Upload_AvatarFile");
                var avatarData = $("#" + propertyName + "_Upload_AvatarMetadataJson");
                var cropperImageElement = $("#" + propertyName + "\\.Upload_cropperImage")[0];
                var upload = avatarUpload(avatarFile, avatarData, cropperImageElement);
                var pickerComponent = $("#" + propertyName + "\\.Personalize\\.ColorHex_colorpicker");
                var tileTextbox = $("#" + propertyName + "_Personalize_Label");
                var previews = $(".avatar-tile-preview", pickerComponent.closest(".avatar-tile-editor"));
                var tile = avatarTile(pickerComponent, tileTextbox, previews);
                return this.avatarEditor(upload, tile);
            }
            Mvc.avatarEditorProperty = avatarEditorProperty;
            function onDialogOk(dlg, handler) {
                var dialog;
                if (typeof (dlg) === "string") {
                    dialog = $(dlg);
                }
                else {
                    dialog = dlg;
                }
                var contentUri = dialog.data("modal-uri");
                dialog.load(contentUri, function () {
                    var ok = $(".dialog-ok", dlg);
                    ok.click(function (clk) {
                        dialog.modal("hide");
                        handler(dialog);
                    });
                });
            }
            Mvc.onDialogOk = onDialogOk;
        })(Mvc = Web.Mvc || (Web.Mvc = {}));
    })(Web = Juillet.Web || (Juillet.Web = {}));
})(Juillet || (Juillet = {}));
//# sourceMappingURL=juillet-web-mvc.js.map