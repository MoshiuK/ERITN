/// <reference path="../typings/googlemaps/index.d.ts"/>
/// <reference path="../typings/chartjs/index.d.ts"/>
$(document)
    .ready(function () {
    new AccessManagement.Administration.Home.DashboardPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Administration;
    (function (Administration) {
        var Home;
        (function (Home) {
            var DashboardPage = /** @class */ (function () {
                function DashboardPage() {
                }
                DashboardPage.prototype.pageStart = function () {
                    this.reloadMapContent();
                    this.setupActivityChart();
                };
                DashboardPage.prototype.setupActivityChart = function () {
                    var canvas = document.getElementById("activityChart");
                    if (canvas === null || canvas === undefined) {
                        console.error("Canvas element 'activityChart' not found.");
                        return;
                    }
                    var chartContext = canvas.getContext("2d");
                    var chartData = $("#activityChartData");
                    var labels = chartData.data("calendar").split(",");
                    var errorCountData = chartData.data("count-errors").split(",");
                    var warningCountData = chartData.data("count-warnings").split(",");
                    var informationCountData = chartData.data("count-information").split(",");
                    var otherCountData = chartData.data("count-other").split(",");
                    var chartConfiguration = {
                        type: "line",
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "# Errors",
                                    data: errorCountData,
                                    backgroundColor: "red",
                                    borderColor: "red",
                                    borderWidth: 2,
                                    fill: false,
                                },
                                {
                                    label: "# Warnings",
                                    data: warningCountData,
                                    backgroundColor: "orange",
                                    borderColor: "orange",
                                    borderWidth: 2,
                                    fill: false,
                                },
                                {
                                    label: "# Information",
                                    data: informationCountData,
                                    backgroundColor: "blue",
                                    borderColor: "blue",
                                    borderWidth: 2,
                                    fill: false,
                                },
                                {
                                    label: "# Other",
                                    data: otherCountData,
                                    backgroundColor: "gray",
                                    borderColor: "gray",
                                    borderWidth: 2,
                                    fill: false,
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }
                                ]
                            }
                        }
                    };
                    var activityChart = new Chart(chartContext, chartConfiguration);
                };
                DashboardPage.prototype.reloadMapContent = function () {
                    var _this = this;
                    var mapElement = document.getElementById("topOrgsMap");
                    if (mapElement === null || mapElement === undefined) {
                        console.error("There was no element with ID 'topOrgsMap' found on the page.");
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
                    var organizationRows = $("#topOrgsTable tbody tr[data-has-marker]");
                    if (organizationRows === null || organizationRows === undefined) {
                        console.error("There was no element with ID 'topOrgsMap' found on the page.");
                        return;
                    }
                    var _loop_1 = function (i) {
                        var row = $(organizationRows[i]);
                        var position = {
                            lat: row.data("marker-lat"),
                            lng: row.data("marker-lng")
                        };
                        boundsPath.push(new google.maps.LatLng(position.lat, position.lng));
                        var marker = new google.maps.Marker({
                            position: position,
                            map: map
                        });
                        row.click(function () {
                            _this.panToAndBounceMarker(map, marker);
                        });
                    };
                    for (var i = 0; i < organizationRows.length; i++) {
                        _loop_1(i);
                    }
                    var bounds = this.calculateBounds(boundsPath);
                    map.fitBounds(bounds);
                    var center = bounds.getCenter();
                    map.setCenter(center);
                    var tableHeader = $("#topOrgsTable thead tr");
                    tableHeader.click(function () {
                        map.fitBounds(bounds);
                        map.setCenter(center);
                    });
                };
                DashboardPage.prototype.calculateBounds = function (points) {
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < points.length; i++) {
                        bounds.extend(points[i]);
                    }
                    return bounds;
                };
                DashboardPage.prototype.panToAndBounceMarker = function (map, marker) {
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
                return DashboardPage;
            }());
            Home.DashboardPage = DashboardPage;
        })(Home = Administration.Home || (Administration.Home = {}));
    })(Administration = AccessManagement.Administration || (AccessManagement.Administration = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=administration.home.index.js.map