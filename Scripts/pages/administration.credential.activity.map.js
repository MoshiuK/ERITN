/// <reference path="../typings/googlemaps/index.d.ts"/>
/// <reference path="../typings/chartjs/index.d.ts"/>
$(document)
    .ready(function () {
    new AccessManagement.Administration.Credential.Activity.MapPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Credential;
        (function (Credential) {
            var Activity;
            (function (Activity) {
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
                            minZoom: 7
                        });
                        var boundsPath = new Array();
                        var activityRows = $("#activityTable tbody tr[data-has-marker]");
                        if (activityRows === null || activityRows === undefined) {
                            console.error("There was no element with ID 'activityTable' found on the page.");
                            return;
                        }
                        var _loop_1 = function (i) {
                            var row = $(activityRows[i]);
                            lat = row.data("marker-lat");
                            lng = row.data("marker-lng");
                            if (lat === "(none)" || lng === "(none)") {
                                return "continue";
                            }
                            activityType = row.data("markerActivitytype");
                            icon = null;
                            if (activityType == "urn:truentry:activitytype:accesssucceeded") {
                                icon = 'https://spsonlqauc.blob.core.windows.net/public/images/dot_pinlet-1-small.png';
                            }
                            // Converts from UTC to Local.
                            date = new Date(row.data("markerDate")).toString();
                            activityId = row.data("markerId");
                            remarks = row.data("markerRemarks");
                            timeAgo = row.data("markerTimeAgo");
                            memberName = row.data("markerMembername");
                            officerName = row.data("markerOfficer");
                            contentString = '<div style="width: 100%; padding-left:10px; height: 25px;float: left;color: #FFF;background: _color_;line-height: 25px"> ' +
                                ' <strong> ' +
                                '  <b>Access Point Official Name </b> ' +
                                ' </strong> ' +
                                '</div> ' +
                                '<div style="float:left;width:100%;padding:0px 0px 5px 0px;border:0px solid #ccc;border-top:none;"> ' +
                                '  <div style="float:left;color:#666;font-size:18px;font-weight:bold;margin:0px 0px;"> ' +
                                '   <div style="padding: 0px;">_officer_name_</div> ' +
                                '  </div> ' +
                                '</div> ' +
                                '<br /> ' +
                                '<div style="width: 100%; padding-left:10px; height: 25px;float: left;color: #FFF;background: _color_;line-height: 25px"> ' +
                                ' <strong> ' +
                                '  <b>Member Name </b> ' +
                                ' </strong> ' +
                                '</div> ' +
                                '<div style="float:left;width:100%;padding:0px 0px 5px 0px;border:0px solid #ccc;border-top:none;"> ' +
                                ' <div style="float:left;color:#666;font-size:18px;font-weight:bold;margin:0px 0px;"> ' +
                                '  <div style="padding: 0px;">_member_name_</div> ' +
                                ' </div> ' +
                                '</div> ' +
                                '<div style="width: 100%; padding-left:10px; height: 25px;float: left;color: #FFF;background: _color_;line-height: 25px"> ' +
                                ' <strong> ' +
                                '  <b>Date and Time </b> ' +
                                ' </strong> ' +
                                '</div> ' +
                                '<div style="float:left;width:100%;padding:0px 0px 5px 0px;border:0px solid #ccc;border-top:none;"> ' +
                                ' <div style="float:left;color:#666;font-size:18px;font-weight:bold;margin:0px 0px;"> ' +
                                '  <div style="padding: 0px;">_date_time_</div> ' +
                                ' </div> ' +
                                '</div>' +
                                '<div style="width: 100%; padding-left:10px; height: 25px;float: left;color: #FFF;background: _color_;line-height: 25px"> ' +
                                ' <strong> ' +
                                '  <b>Remarks </b> ' +
                                ' </strong> ' +
                                '</div> ' +
                                '<div style="float:left;width:100%;padding:0px 0px 5px 0px;border:0px solid #ccc;border-top:none;"> ' +
                                ' <div style="float:left;color:#666;font-size:18px;font-weight:bold;margin:0px 0px;"> ' +
                                '  <div style="padding: 0px;">_remarks_</div> ' +
                                ' </div> ' +
                                '</div>';
                            infowindow = new google.maps.InfoWindow({ content: contentString });
                            var position = {
                                lat: lat,
                                lng: lng
                            };
                            boundsPath.push(new google.maps.LatLng(position.lat, position.lng));
                            var marker = new google.maps.Marker({
                                position: position,
                                map: map,
                                icon: icon,
                                title: date
                            });
                            marker.setValues({ type: "activityId", id: activityId });
                            marker.setValues({ type: "remarks", remarks: remarks });
                            marker.setValues({ type: "timeAgo", timeAgo: timeAgo });
                            marker.setValues({ type: "officerName", officerName: officerName });
                            marker.setValues({ type: "memberName", memberName: memberName });
                            marker.setValues({ type: "activityType", activityType: activityType });
                            marker.addListener('click', function () {
                                var markerActivityType = marker.get("activityType");
                                var markerRemarks = marker.get("remarks");
                                var markerOfficerName = marker.get("officerName");
                                var markerMemberName = marker.get("memberName");
                                var color;
                                if (markerActivityType === "urn:truentry:activitytype:accesssucceeded") {
                                    color = '#00CC00';
                                }
                                else {
                                    color = '#FF0000';
                                }
                                var date = marker.getTitle();
                                var mapObj = {
                                    _officer_name_: decodeURIComponent(markerOfficerName),
                                    _date_time_: date,
                                    _remarks_: unescape(markerRemarks),
                                    _color_: color,
                                    _member_name_: unescape(markerMemberName),
                                };
                                var content = contentString.replace(/_officer_name_|_member_name_|_color_|_date_time_|_remarks_/gi, function (matched) {
                                    return mapObj[matched];
                                });
                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                            });
                            row.click(function () {
                                _this.panToAndBounceMarker(map, marker);
                            });
                        };
                        var lat, lng, activityType, icon, date, activityId, remarks, timeAgo, memberName, officerName, contentString, infowindow;
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
                Activity.MapPage = MapPage;
            })(Activity = Credential.Activity || (Credential.Activity = {}));
        })(Credential = Administration.Credential || (Administration.Credential = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.credential.activity.map.js.map