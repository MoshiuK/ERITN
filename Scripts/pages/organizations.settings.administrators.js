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
    // TODO: use underscore
    //if (_.isNull(initialPlace) || _.isUndefined(initialPlace)) {
    //  return;
    //}
    reloadDetailPaneSelection(initialPlace);
    function updateMapSection() {
        var mapElement = document.getElementById("mapDiv");
        if (mapElement === null || mapElement === undefined) {
            console.error("There was no element with ID 'mapDiv' found on the page.");
            return;
        }
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(mapElement, {
            scrollwheel: false,
            streetViewControl: false,
            disableDefaultUI: true,
            draggable: false,
            disableDoubleClickZoom: true,
            center: new google.maps.LatLng(parseFloat($("#latField").val()), parseFloat($("#longField").val())),
            zoom: 15
        });
        var position = {
            lat: parseFloat($("#latField").val()),
            lng: parseFloat($("#longField").val())
        };
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
    }
    function reloadDetailPaneSelection(selectedId) {
        var contentUrl = "/Administration/OrganizationsHub/DirectoryEntry/".concat(selectedId);
        $.ajax({
            url: contentUrl,
            dataType: "html",
            success: function (data) {
                $("#detailPane").html(data);
                updateMapSection();
            }
        });
    }
});
//# sourceMappingURL=organizations.settings.administrators.js.map