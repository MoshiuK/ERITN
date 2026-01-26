$(document)
    .ready(function () {
    new AccessManagement.Organization.Reports.MemberReportViewer().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var Reports;
        (function (Reports) {
            var Selectors;
            (function (Selectors) {
                Selectors.runReportButton = "#runReportButton";
                Selectors.editCriteriaButton = "#editCriteriaButton";
                Selectors.editCriteriaDialog = "#editCriteriaDialog";
                Selectors.editCriteriaDialogOk = "#editCriteriaDialogOk";
                Selectors.saveAsButton = "#saveAsButton";
                Selectors.saveAsDialog = "#saveAsDialog";
                Selectors.saveAsDialogOk = "#saveAsDialogOk";
                Selectors.timeSpanCaption = "#timeSpanCaption";
                Selectors.timeSpanItems = "a[data-timespan]";
                Selectors.criteriaNotBefore = "#criteria_NotBefore";
                Selectors.criteriaNotAfter = "#criteria_NotAfter";
                Selectors.criteriaTextArea = "#criteriaTextArea";
                Selectors.toggleSideBarButton = "#toggleSideBarButton";
                Selectors.reportViewSidebar = ".report-viewer-sidebar";
                Selectors.reportViewSidebarContainer = ".report-viewer-sidebar-container";
                Selectors.reportColumnPicker = ".report-column-picker";
                Selectors.reportViewerContent = ".report-viewer-content";
                Selectors.reportPager = "#reportPager";
                Selectors.reportToolbarPageSizeItem = "li.page-size-item";
                Selectors.reportToolbarPageSizeCaption = "#pageSizeCaption";
                Selectors.reportPagerPage = "li.pager-page";
                Selectors.reportPagingIndexField = "#pagingIndexField";
                Selectors.reportPagingSizeField = "#pagingSizeField";
                Selectors.reportMementoNameField = "#memento_DisplayName";
                Selectors.downloadFrame = "#downloadFrame";
                Selectors.exportActions = ".export-action";
            })(Selectors || (Selectors = {}));
            var MemberReportViewer = /** @class */ (function () {
                function MemberReportViewer() {
                }
                MemberReportViewer.prototype.pageStart = function () {
                    var _this = this;
                    $(Selectors.timeSpanCaption).text("No date restrictions.");
                    $(Selectors.runReportButton).click(function (evt) {
                        var ladda = Ladda.create(evt.target);
                        ladda.start();
                        _this.reloadReportContent();
                        setTimeout(function () {
                            ladda.stop();
                            ladda.remove();
                        }, 1000);
                    });
                    // criteria dialog
                    $(Selectors.editCriteriaButton).click(function () {
                        $(Selectors.editCriteriaDialog).modal("show");
                    });
                    $(Selectors.editCriteriaDialogOk).click(function () {
                        _this.updateCriteriaFieldFromServer();
                    });
                    // time span button/menu
                    $(Selectors.timeSpanItems).click(function (evt) {
                        _this.updateTimeSpanCaption($(evt.target));
                    });
                    // toggle sidebar
                    $(Selectors.toggleSideBarButton).click(function (evt) {
                        _this.toggleSideBar($(evt.target));
                    });
                    // column visibility
                    $(Selectors.reportColumnPicker).change(function () {
                        _this.updateTableColumnVisbility();
                    });
                    // bind the toolbar controls
                    this.bindToolbarControls();
                };
                MemberReportViewer.prototype.bindToolbarControls = function () {
                    var _this = this;
                    // save as dialog
                    $(Selectors.saveAsButton).click(function () {
                        $(Selectors.saveAsDialog).modal("show");
                    });
                    $(Selectors.saveAsDialogOk).click(function () {
                        _this.saveReport();
                    });
                    // pager
                    $(Selectors.reportPagerPage).click(function (evt) {
                        _this.handlePagerPage(evt);
                    });
                    // page size
                    $(Selectors.reportToolbarPageSizeItem).click(function (evt) {
                        var target = $(evt.target).closest("li");
                        var size = target.data("page-size");
                        $(Selectors.reportPagingSizeField).val(size);
                        $(Selectors.reportToolbarPageSizeCaption).text("".concat(size, " per page"));
                    });
                    // export actions
                    $(Selectors.exportActions).click(function (evt) {
                        _this.exportReport(evt);
                    });
                };
                MemberReportViewer.prototype.handlePagerPage = function (evt) {
                    var target = $(evt.target).closest("li");
                    var index = target.data("page-index");
                    var size = target.data("page-size");
                    $(Selectors.reportPagingIndexField).val(index);
                    $(Selectors.reportPagingSizeField).val(size);
                    this.reloadReportContent();
                };
                MemberReportViewer.prototype.reloadReportContent = function () {
                    var _this = this;
                    var criteria = this.buildCriteriaQueryParams();
                    var options = this.buildOptionsQueryParams();
                    var req = $.ajax({
                        url: "/Organizations/Reports/MemberReportTable?".concat(options, "&").concat(criteria),
                        method: "GET"
                    });
                    req.fail(function (xhr) {
                        var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
                        toastr["error"](msg, "Failed to reload report.");
                    });
                    req.done(function (data) {
                        $(Selectors.reportViewerContent).html(data);
                        // we just reloaded the toolbar HTML... rebind the controls.
                        _this.bindToolbarControls();
                    });
                };
                MemberReportViewer.prototype.saveReport = function () {
                    var criteria = this.buildCriteriaQueryParams();
                    var options = this.buildOptionsQueryParams();
                    var displayName = $(Selectors.reportMementoNameField).val();
                    var req = $.ajax({
                        url: "/Organizations/Reports/MemberReportMemento?".concat(options, "&").concat(criteria, "&displayName=").concat(displayName),
                        method: "PUT"
                    });
                    req.fail(function (xhr) {
                        var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
                        toastr["error"](msg, "Failed to save report.");
                    });
                    req.done(function (data) {
                        toastr["success"]("Saved report ".concat(displayName, ".").concat(data), "Save Report");
                        setTimeout(function () {
                            window.location.href = "/Organizations/Reports/MemberReportFromMemento?mementoId=".concat(data.mementoId);
                        }, 1000);
                    });
                };
                MemberReportViewer.prototype.exportReport = function (evt) {
                    var target = $(evt.target).closest("li");
                    var uriStem = target.data("action-uri");
                    var criteria = this.buildCriteriaQueryParams();
                    var options = this.buildOptionsQueryParams();
                    var fullUrl = "".concat(uriStem, "?").concat(options, "&").concat(criteria);
                    window.location.href = fullUrl;
                };
                MemberReportViewer.prototype.updateTableColumnVisbility = function () {
                    $(Selectors.reportColumnPicker).each(function (idx, cbx) {
                        var checkbox = $(cbx);
                        var columnSelector = checkbox.data("column-selector");
                        if (checkbox.attr("checked")) {
                            $(columnSelector).show();
                        }
                        else {
                            $(columnSelector).hide();
                        }
                    });
                };
                MemberReportViewer.prototype.toggleSideBar = function (btn) {
                    var collapsed = btn.data("collapsed") === "True";
                    if (collapsed) {
                        $(Selectors.reportViewSidebar).animate({ width: "225px" });
                        btn.data("collapsed", "False");
                        btn.html("<i class='fa fa-angle-double-left'></i> Hide Options");
                        if (btn.hasClass("sidebar-button-hidden")) {
                            btn.removeClass("sidebar-button-hidden");
                        }
                        btn.addClass("sidebar-button-visible");
                        $(Selectors.reportViewSidebarContainer).show();
                    }
                    else {
                        $(Selectors.reportViewSidebar).animate({ width: "0" });
                        btn.data("collapsed", "True");
                        btn.html("<i class='fa fa-angle-double-right'></i> Show Options");
                        if (btn.hasClass("sidebar-button-visible")) {
                            btn.removeClass("sidebar-button-visible");
                        }
                        btn.addClass("sidebar-button-hidden");
                        $(Selectors.reportViewSidebarContainer).hide();
                    }
                };
                MemberReportViewer.prototype.updateCriteriaFieldFromServer = function () {
                    var criteriaField = $(Selectors.criteriaTextArea);
                    var queryParams = this.buildCriteriaQueryParams();
                    var req = $.ajax({
                        url: "/Organizations/Reports/CriteriaString?".concat(queryParams),
                        method: "GET"
                    });
                    req.fail(function (xhr) {
                        var msg = "HTTP ERROR ".concat(xhr.status, ": ").concat(xhr.statusText, ".\r\n").concat(xhr.responseText);
                        toastr["error"](msg, "Failed to format crtieria string.");
                        criteriaField.val("");
                    });
                    req.done(function (data) {
                        criteriaField.val(data);
                    });
                };
                MemberReportViewer.prototype.updateTimeSpanCaption = function (li) {
                    var timeSpanCaption = $(Selectors.timeSpanCaption);
                    var notBeforeStr = li.data("notbefore");
                    var notAfterStr = li.data("notafter");
                    if (notBeforeStr === undefined || notAfterStr === undefined) {
                        timeSpanCaption.text("No date restrictions.");
                        $(Selectors.criteriaNotBefore).val("");
                        $(Selectors.criteriaNotAfter).val("");
                    }
                    else {
                        $(Selectors.criteriaNotBefore).val(notBeforeStr);
                        $(Selectors.criteriaNotAfter).val(notAfterStr);
                        var notBefore = new Date(notBeforeStr);
                        var notAfter = new Date(notAfterStr);
                        timeSpanCaption.text("".concat(notBefore.toDateString(), " - ").concat(notAfter.toDateString()));
                    }
                    this.updateCriteriaFieldFromServer();
                };
                ;
                MemberReportViewer.prototype.getQueryDataAsMap = function () {
                    var vars = {};
                    var hash;
                    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
                    for (var i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split("=");
                        if (hash.length === 2) {
                            var existing = vars[hash[0]];
                            if (existing !== undefined) {
                                vars[hash[0]] = decodeURIComponent(hash[1].replace(/\+/g, " "));
                            }
                            else {
                                console.log("Query string -> multiple values for '".concat(hash[0], "'.  Discarding value '").concat(hash[1], "'."));
                            }
                        }
                    }
                    return vars;
                };
                MemberReportViewer.prototype.buildCriteriaQueryParams = function () {
                    var searchCriteria = $("#editCriteriaDialog :input")
                        .filter(function (index, element) {
                        return $(element).val() !== "";
                    })
                        .serialize();
                    return searchCriteria;
                };
                MemberReportViewer.prototype.buildOptionsQueryParams = function () {
                    var columns = [];
                    var options = $("#optionsSideBar :input")
                        .filter(function (index, element) {
                        var next = $(element);
                        // push column visibility checkboxes values to array.
                        var name = next.attr("name");
                        if (name !== undefined &&
                            name !== null &&
                            name.match("^column-cbx") &&
                            next.is(":checked")) {
                            columns.push(next.data("column-key"));
                            return false;
                        }
                        return next.val() !== "";
                    })
                        .serialize();
                    var paging = $("#reportPager :input").serialize();
                    return "".concat(paging, "&").concat(options, "&columnsVisibleCsv=").concat(columns.join(","));
                };
                return MemberReportViewer;
            }());
            Reports.MemberReportViewer = MemberReportViewer;
        })(Reports = Organization.Reports || (Organization.Reports = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.reports.memberreportviewer.js.map