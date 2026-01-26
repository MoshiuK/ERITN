/// <reference path="../app/AccessManagement.ts"/>
$(document).ready(function () {
    var rowActions = $("#resultsPane a[".concat(AccessManagement.Html.DataAttr_action, "]"));
    rowActions.click(function (jqeo) {
        var src = $(jqeo.target);
        var resourceId = src.attr(AccessManagement.Html.DataAttr_resource_id);
        reloadDetailPaneSelection(resourceId);
    });
    var initialPlace = $("#detailPane").attr(AccessManagement.Html.DataAttr_initial_selection);
    if (initialPlace === null) {
        return;
    }
    reloadDetailPaneSelection(initialPlace);
    function reloadDetailPaneSelection(selectedId) {
        $(".summary-row").removeClass("active");
        $('#' + selectedId).addClass("active");
        var contentUrl = "/Administration/Reports/DirectoryEntry/".concat(selectedId);
        $.ajax({
            url: contentUrl,
            dataType: "html",
            success: function (data) {
                $("#detailPane").html(data);
            }
        });
    }
});
//# sourceMappingURL=administration.reports.jurisdictionreport.js.map