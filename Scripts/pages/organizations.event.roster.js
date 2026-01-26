$(document)
    .ready(function () {
    new AccessManagement.Organizations.Event.RosterPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organizations;
    (function (Organizations) {
        var Event;
        (function (Event) {
            var RosterPage = /** @class */ (function () {
                function RosterPage() {
                }
                RosterPage.prototype.pageStart = function () {
                    var _this = this;
                    var input = $("#rosterListFilter");
                    var eventId = input.data("event-id");
                    input.on("change keydown paste input", (function (evt) {
                        var textInput = $(evt.target).val();
                        if (_this.userFilterTimer != null) {
                            clearTimeout(_this.userFilterTimer);
                        }
                        _this.userFilterTimer = setTimeout(function () {
                            _this.reloadRosterTable(eventId, textInput);
                            _this.userFilterTimer = null;
                        }, 250);
                    }));
                    this.setupReissueButton();
                    this.setupTableSelections();
                    this.setupSendButton();
                    this.setupDownloadSelectedButton();
                    this.setupDownloadAllButton();
                    this.setupCreateSelectedButton();
                };
                RosterPage.prototype.setupReissueButton = function () {
                    var _this = this;
                    $("#reissueCredentialButton").click(function () {
                        _this.scheduleReissue();
                    });
                };
                RosterPage.prototype.setupDownloadAllButton = function () {
                    var _this = this;
                    $("#downloadAllCredentialsButton").click(function () {
                        _this.scheduleDownloadAll();
                    });
                };
                RosterPage.prototype.setupDownloadSelectedButton = function () {
                    var _this = this;
                    $("#downloadCredentialButton").click(function () {
                        var credentialIds = _this.getCheckedCredentialIds();
                        _this.scheduleForDownload(credentialIds);
                    });
                };
                RosterPage.prototype.setupCreateSelectedButton = function () {
                    var _this = this;
                    $("#createCredentialButton").click(function () {
                        var credentialIds = _this.getCheckedCredentialIds();
                        _this.createForDownload(credentialIds);
                    });
                };
                RosterPage.prototype.setupSendButton = function () {
                    var _this = this;
                    $("#sendCredentialButton").click(function () {
                        var credentialIds = _this.getCheckedCredentialIds();
                        _this.scheduleForDistribution(credentialIds);
                    });
                };
                RosterPage.prototype.getCheckedCredentialIds = function () {
                    var ids = [];
                    this.getCheckedInputs()
                        .filter("input[data-credential-id]")
                        .each(function (i, e) {
                        var target = $(e);
                        ids.push(target.data("credential-id"));
                    });
                    return ids;
                };
                RosterPage.prototype.getCheckedInputs = function () {
                    var results = [];
                    var checked = $("input[data-roster-entry-type]");
                    checked.each(function (i, e) {
                        var target = $(e);
                        if (target.prop("checked")) {
                            results.push(e);
                        }
                    });
                    return $(results);
                };
                RosterPage.prototype.setupTableSelections = function () {
                    var _this = this;
                    var all = $("input[data-roster-entry-type]");
                    all.change(function (evt) {
                        var target = $(evt.target);
                        var tr = target.closest("tr");
                        if (target.prop("checked")) {
                            tr.addClass("active");
                        }
                        else {
                            tr.removeClass("active");
                        }
                    });
                    this.allOrNoneIsAll = true;
                    $("#selectAllButton").click(function () {
                        _this.selectAllToggle();
                    });
                    $("#selectAllMenuItem").click(function () {
                        _this.selectAllToggle();
                    });
                    $("#selectNoneMenuItem").click(function () {
                        _this.selectAllCore(false);
                    });
                    $("#selectUnsentMenuItem").click(function () {
                        _this.selectCredentialNotSent();
                    });
                    $("#selectClearedMenuItem").click(function () {
                        _this.selectClearedForAccess();
                    });
                };
                RosterPage.prototype.reloadRosterTable = function (id, textInput) {
                    var _this = this;
                    var params = window.location.search.substring(1).split("&");
                    var url = "/Organizations/Event/RosterTable/".concat(id);
                    if (textInput !== null && textInput !== undefined && textInput.length > 0) {
                        params = params.filter(function (val) { return val.indexOf("q=") !== 0; });
                        params.push("q=".concat(textInput));
                    }
                    if (params.length > 0) {
                        url = "".concat(url, "?").concat(params[0]);
                        for (var i = 1; i < params.length; i++) {
                            url = "".concat(url, "&").concat(params[i]);
                        }
                    }
                    var req = $.ajax({
                        url: url,
                        method: "GET",
                        dataType: "html"
                    });
                    req.done(function (tableContent) {
                        var table = $("#rosterList");
                        var container = table.parent();
                        table.remove();
                        container.html(tableContent);
                        Juillet.Web.Mvc.setupJuilletComponents(container);
                        _this.setupTableSelections();
                    });
                };
                RosterPage.prototype.selectAllToggle = function () {
                    this.selectAllCore(this.allOrNoneIsAll);
                    this.allOrNoneIsAll = !this.allOrNoneIsAll;
                };
                RosterPage.prototype.selectNone = function () {
                    this.selectAllCore(false);
                };
                RosterPage.prototype.selectAllCore = function (checked) {
                    var all = $("input[data-roster-entry-type]");
                    all.each(function (i, element) {
                        var target = $(element);
                        target.prop("checked", checked);
                    });
                    this.applyActiveClass(all);
                };
                RosterPage.prototype.selectCredentialNotSent = function () {
                    this.selectAllCore(false);
                    var unsent = $("input[data-roster-entry-type='credential-owner'][data-is-sent='False']");
                    unsent.each(function (i, element) {
                        $(element).prop("checked", true);
                    });
                    this.applyActiveClass(unsent);
                };
                RosterPage.prototype.selectClearedForAccess = function () {
                    this.selectAllCore(false);
                    var cleared = $("input[data-roster-entry-type='member-no-credential'][data-cleared='True']");
                    cleared.each(function (i, element) {
                        $(element).prop("checked", true);
                    });
                    this.applyActiveClass(cleared);
                };
                RosterPage.prototype.applyActiveClass = function (elements) {
                    elements.each(function (i, element) {
                        var target = $(element);
                        var tr = target.closest("tr");
                        if (target.prop("checked")) {
                            tr.addClass("active");
                        }
                        else {
                            tr.removeClass("active");
                        }
                    });
                };
                RosterPage.prototype.scheduleForDistribution = function (credentialIds) {
                    var form = $("#distributeForm");
                    credentialIds.forEach(function (nextId) {
                        $("<input type='hidden' name='credentialIds' value='".concat(nextId, "'/>"))
                            .appendTo(form);
                    });
                    form.submit();
                };
                RosterPage.prototype.scheduleForDownload = function (credentialIds) {
                    var form = $("#downloadForm");
                    credentialIds.forEach(function (nextId) {
                        $("<input type='hidden' name='credentialIds' value='".concat(nextId, "'/>"))
                            .appendTo(form);
                    });
                    form.submit();
                };
                RosterPage.prototype.createForDownload = function (credentialIds) {
                    var form = $("#createForm");
                    credentialIds.forEach(function (nextId) {
                        $("<input type='hidden' name='credentialIds' value='".concat(nextId, "'/>"))
                            .appendTo(form);
                    });
                    form.submit();
                };
                RosterPage.prototype.scheduleReissue = function () {
                    var form = $("#reissueForm");
                    form.submit();
                };
                RosterPage.prototype.scheduleDownloadAll = function () {
                    var form = $("#downloadForm");
                    $("<input type='hidden' name='allCredentials' value='True'/>").appendTo(form);
                    form.submit();
                };
                return RosterPage;
            }());
            Event.RosterPage = RosterPage;
        })(Event = Organizations.Event || (Organizations.Event = {}));
    })(Organizations = AccessManagement.Organizations || (AccessManagement.Organizations = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.event.roster.js.map