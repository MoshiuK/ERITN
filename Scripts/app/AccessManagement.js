var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AccessManagement;
(function (AccessManagement) {
    // ReSharper disable InconsistentNaming
    var Actions;
    (function (Actions) {
        Actions.PutApi_Toggle = "putapi-toggle";
    })(Actions = AccessManagement.Actions || (AccessManagement.Actions = {}));
    var Selectors;
    (function (Selectors) {
        Selectors.CssClass_access_level_label = ".access-level-label";
    })(Selectors || (Selectors = {}));
    var Html;
    (function (Html) {
        Html.DataAttr_action = "data-sps-action";
        Html.DataAttr_action_uri = "data-sps-action-uri";
        Html.DataAttr_resource_id = "data-sps-resource-id";
        Html.DataAttr_resource_name = "data-sps-resource-name";
        Html.DataAttr_initial_selection = "data-sps-initial-selection";
        function selectAction(actionName) {
            return $("".concat(Html.DataAttr_action, "['").concat(actionName, "']"));
        }
        Html.selectAction = selectAction;
    })(Html = AccessManagement.Html || (AccessManagement.Html = {}));
    // ReSharper restore InconsistentNaming
    var ToastingError = /** @class */ (function (_super) {
        __extends(ToastingError, _super);
        function ToastingError(message, title) {
            if (title === void 0) { title = ""; }
            var _this = _super.call(this, message) || this;
            _this.title = title;
            return _this;
        }
        return ToastingError;
    }(Error));
    AccessManagement.ToastingError = ToastingError;
    var ActionEvent = /** @class */ (function () {
        function ActionEvent(jQueryEvent, action, actionUri, resourceId, resourceName) {
            this.jQueryEvent = jQueryEvent;
            this.action = action;
            this.actionUri = actionUri;
            this.resourceId = resourceId;
            this.resourceName = resourceName;
            this.target = $(this.jQueryEvent.target);
        }
        return ActionEvent;
    }());
    function onActionClicked(action, handler) {
        action.click(function (jqeo) {
            var src = $(jqeo.target);
            var actionType = src.attr(Html.DataAttr_action);
            var actionUri = src.attr(Html.DataAttr_action_uri);
            var resourceId = src.attr(Html.DataAttr_resource_id);
            var resourceName = src.attr(Html.DataAttr_resource_name);
            var actionEvent = new ActionEvent(jqeo, actionType, actionUri, resourceId, resourceName);
            var bi = src.find(".busy-indicator");
            try {
                if (bi.hasClass("hidden")) {
                    bi.removeClass("hidden");
                }
                handler(actionEvent);
            }
            catch (err) {
                if (err instanceof ToastingError) {
                    toastr.error(err.message, err.title);
                }
                else {
                    toastr.error(err.message, err.name);
                }
            }
            finally {
                if (!bi.hasClass("hidden")) {
                    bi.addClass("hidden");
                }
            }
        });
    }
    AccessManagement.onActionClicked = onActionClicked;
    var Toasts = /** @class */ (function () {
        function Toasts() {
        }
        Toasts.prototype.showError = function (err, title) {
            if (err instanceof ToastingError) {
                toastr.error(err.title, err.message);
                return;
            }
            toastr.error(err, title);
        };
        Toasts.prototype.showSuccess = function (message, title) {
            toastr.success(message, title);
        };
        return Toasts;
    }());
    var toastInstance = new Toasts();
    function toasts() {
        return toastInstance;
    }
    AccessManagement.toasts = toasts;
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=AccessManagement.js.map