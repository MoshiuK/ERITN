/// <reference path="../typings/ladda/ladda.d.ts"/>
/*
 app/accessmanagementportal.ts - This script is included in all pages, all areas.
 */
"use strict";
var _this = this;
$(document)
    .ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    Juillet.Web.Mvc.toastDefferredNotifications();
    AccessManagement.Common.Ux.setupSignOutAfterIdle();
});
// Minimize navbar when screen is 768px or smaller
$(window).bind("resize", function () {
    var body = $("body");
    if ($(_this).width() <= 768) {
        if (!body.hasClass("body-small")) {
            body.addClass("body-small");
        }
        if (!body.hasClass("mini-navbar")) {
            body.addClass("mini-navbar");
        }
        $("#navbar-brand-image").hide();
    }
    else {
        if (body.hasClass("body-small")) {
            body.removeClass("body-small");
        }
        if (body.hasClass("mini-navbar")) {
            body.removeClass("mini-navbar");
        }
        $("#navbar-brand-image").show();
    }
});
var AccessManagement;
(function (AccessManagement) {
    var Common;
    (function (Common) {
        var Ux;
        (function (Ux) {
            function setupSignOutAfterIdle() {
                var signOutDialog = $("#signOutAfterIdleDialog");
                if (signOutDialog === undefined || signOutDialog === null || signOutDialog.length === 0) {
                    console.log("".concat(location.href, " - idle timer for sign out is not enabled on this page."));
                    return;
                }
                signOutDialog.on("hidden.bs.modal", function () {
                    location.reload();
                });
                var timeInMillis = signOutDialog.data("timeout-millis");
                var waitInterval = signOutDialog.data("wait-interval");
                var root = $(document);
                var secondsField = $("#signOutSecondsField");
                var options = {
                    timeout: timeInMillis,
                };
                root.idleTimer(options);
                root.on("idle.idleTimer", function (evt, el, obj) {
                    signOutDialog.modal("show");
                    var i = waitInterval;
                    setInterval(function () {
                        secondsField.text(i);
                        i--;
                        if (i === 0) {
                            location.href = "/Authentication/SigningOut";
                        }
                    }, 1000);
                });
            }
            Ux.setupSignOutAfterIdle = setupSignOutAfterIdle;
            function setupMessageListHandler() {
                $(".message-list-item .action-button").click(function (evt) {
                    var target = $(evt.target).closest("a");
                    var action = target.data("action-btn");
                    var id = target.data("action-id");
                    switch (action) {
                        case "delete":
                            deleteMessage(id, target.closest("li"));
                            break;
                        default:
                            console.error("Unhandled button clicked on message list '".concat(action, "'."));
                            break;
                    }
                });
            }
            Ux.setupMessageListHandler = setupMessageListHandler;
            function deleteMessage(messageId, container) {
                var req = $.ajax({
                    url: "/viewapi/organizations/home/messages/".concat(messageId),
                    method: "DELETE"
                });
                req.fail(function (xhr) {
                    var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".");
                    toastr["error"](msg, "Failed to delete message.");
                });
                req.done(function () {
                    container.slideUp();
                    setTimeout(function () {
                        container.remove();
                    }, 600);
                });
            }
            function setupOrganizationActionListHandler(isPersonalView) {
                if (isPersonalView === void 0) { isPersonalView = false; }
                $(".action-list-item .action-button").click(function (evt) {
                    var target = $(evt.target).closest("a");
                    var action = target.data("action-btn");
                    var id = target.data("action-id");
                    switch (action) {
                        case "rescind":
                            rescindAction(id, target.closest("li"), isPersonalView);
                            break;
                        case "take":
                            takeAction(id, target.closest("li"));
                            break;
                        case "complete":
                            completeAction(id, target.closest("li"));
                            break;
                        default:
                            console.error("Unhandled button click on action list '".concat(action, "'."));
                            break;
                    }
                });
            }
            Ux.setupOrganizationActionListHandler = setupOrganizationActionListHandler;
            function rescindAction(actionId, container, isPersonalView) {
                var req = $.ajax({
                    url: "/viewapi/organizations/home/actions/".concat(actionId, "/rescind"),
                    method: "PUT"
                });
                req.fail(function (xhr) {
                    var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".");
                    toastr["error"](msg, "Failed to rescind action.");
                });
                req.done(function () {
                    if (isPersonalView) {
                        // hide the item being recinded when its a personal view
                        container.slideUp();
                        setTimeout(function () {
                            container.remove();
                        }, 600);
                    }
                    else {
                        // switch from rescind action to take action
                        var a = container.find("a").first();
                        a.data("action-btn", "take");
                        a.attr("title", "Take");
                        a.html("<i class='fa fa-play-circle fa-fw'></i>");
                    }
                });
            }
            function takeAction(actionId, container) {
                var req = $.ajax({
                    url: "/viewapi/organizations/home/actions/".concat(actionId, "/take"),
                    method: "PUT"
                });
                req.fail(function (xhr) {
                    var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".");
                    toastr["error"](msg, "Failed to take action.");
                });
                req.done(function () {
                    // switch from take action to rescind action
                    var a = container.find("a").first();
                    a.data("action-btn", "rescind");
                    a.attr("title", "Rescind");
                    a.html("<i class='fa fa-undo fa-fw'></i>");
                });
            }
            function completeAction(actionId, container) {
                var req = $.ajax({
                    url: "/viewapi/organizations/home/actions/".concat(actionId, "/complete"),
                    method: "PUT"
                });
                req.fail(function (xhr) {
                    var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".");
                    toastr["error"](msg, "Failed to complete action.");
                });
                req.done(function () {
                    container.slideUp();
                    setTimeout(function () {
                        container.remove();
                    }, 600);
                });
            }
        })(Ux = Common.Ux || (Common.Ux = {}));
    })(Common = AccessManagement.Common || (AccessManagement.Common = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=accessmanagementportal.js.map