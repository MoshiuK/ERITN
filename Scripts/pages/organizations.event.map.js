/// <reference path="../typings/googlemaps/index.d.ts"/>
/// <reference path="../typings/chartjs/index.d.ts"/>
$(document)
    .ready(function () {
    new AccessManagement.Organizations.Event.MapPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organizations;
    (function (Organizations) {
        var Event;
        (function (Event) {
            var MapPage = /** @class */ (function () {
                function MapPage() {
                }
                MapPage.prototype.pageStart = function () {
                    this.reloadMapContent();
                };
                MapPage.prototype.reloadMapContent = function () {
                    var _this = this;
                    var mapElement = document.getElementById("activityMap");
                    if (mapElement === null || mapElement === undefined) {
                        console.error("There was no element with ID 'activityMap' found on the page.");
                        return;
                    }
                    // Create a map object and specify the DOM element for display.
                    var map = new google.maps.Map(mapElement, {
                        scrollwheel: true,
                        streetViewControl: false,
                        disableDefaultUI: true,
                        draggable: true,
                        disableDoubleClickZoom: false,
                        minZoom: 3
                    });
                    var boundsPath = new Array();
                    var activityRows = $("#activityTable tbody tr[data-has-marker]");
                    if (activityRows === null || activityRows === undefined) {
                        console.error("There was no element with ID 'activityTable' found on the page.");
                        return;
                    }
                    var _loop_1 = function (i) {
                        var row = $(activityRows[i]);
                        var activityType = row.data("markerActivitytype");
                        icon = null;
                        if (activityType == "urn:truentry:activitytype:accesssucceeded") {
                            icon = 'https://www.google.com.au/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/dot_pinlet-1-small.png&highlight=4db546,4db546,4db546&color=ff000000?scale=2';
                        }
                        name = row.data("markerPersonfirstname");
                        lastName = row.data("markerPersonlastname");
                        name = name + " " + lastName;
                        initials = row.data("markerPersoninitials");
                        date = row.data("markerDate");
                        time = row.data("markerTime");
                        title = name + " - " + date + ' ' + time;
                        contentString = '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            '<h3 id="firstHeading" class="firstHeading">_title_</h3>' +
                            '<div id="bodyContent">' +
                            '</div>' +
                            '</div>';
                        infowindow = new google.maps.InfoWindow({});
                        var position = {
                            lat: row.data("marker-lat"),
                            lng: row.data("marker-lng")
                        };
                        boundsPath.push(new google.maps.LatLng(position.lat, position.lng));
                        var marker = new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: icon,
                            label: initials,
                            title: name + " - " + date + " " + time
                        });
                        marker.addListener('click', function () {
                            name = marker.getLabel();
                            title = marker.getTitle();
                            infowindow.setContent(contentString.replace("_title_", title));
                            infowindow.open(map, marker);
                        });
                        row.click(function () {
                            _this.panToAndBounceMarker(map, marker);
                        });
                    };
                    var icon, name, lastName, initials, date, time, title, contentString, infowindow;
                    for (var i = 0; i < activityRows.length; i++) {
                        _loop_1(i);
                    }
                    var bounds = this.calculateBounds(boundsPath);
                    map.fitBounds(bounds);
                    var center = bounds.getCenter();
                    map.setCenter(center);
                    var tableHeader = $("#activityTable thead tr");
                    tableHeader.click(function () {
                        map.fitBounds(bounds);
                        map.setCenter(center);
                    });
                };
                MapPage.prototype.calculateBounds = function (points) {
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < points.length; i++) {
                        bounds.extend(points[i]);
                    }
                    return bounds;
                };
                MapPage.prototype.panToAndBounceMarker = function (map, marker) {
                    map.panTo(marker.getPosition());
                    var currentZoom = map.getZoom();
                    if (currentZoom < 16) {
                        map.setZoom(16);
                    }
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    }
                    else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        window.setTimeout(function () {
                            marker.setAnimation(null);
                        }, 2500);
                    }
                };
                return MapPage;
            }());
            Event.MapPage = MapPage;
        })(Event = Organizations.Event || (Organizations.Event = {}));
    })(Organizations = AccessManagement.Organizations || (AccessManagement.Organizations = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.event.map.js.map