/// <reference path="../typings/chartjs/index.d.ts"/>
$(document)
    .ready(function () {
    new AccessManagement.Organization.Home.DashboardPage().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var Home;
        (function (Home) {
            var DashboardPage = /** @class */ (function () {
                function DashboardPage() {
                }
                DashboardPage.prototype.pageStart = function () {
                    this.setupSummaryChart();
                    AccessManagement.Common.Ux.setupMessageListHandler();
                    AccessManagement.Common.Ux.setupOrganizationActionListHandler();
                };
                DashboardPage.prototype.setupSummaryChart = function () {
                    var canvas = document.getElementById("organizationChart");
                    if (canvas === null || canvas === undefined) {
                        console.error("Canvas element 'organizationChart' not found.");
                        return;
                    }
                    var chartContext = canvas.getContext("2d");
                    var chartData = $("#organizationChartData");
                    var labels = chartData.data("calendar").split(",");
                    var personnelCountData = chartData.data("countPersonnel").toString().split(",");
                    var credentialsCountData = chartData.data("countCredentials").toString().split(",");
                    var successCountData = chartData.data("countAccessSuccess").toString().split(",");
                    var failureCountData = chartData.data("countAccessFailure").toString().split(",");
                    var chartConfiguration = {
                        type: "line",
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "# Personnel",
                                    data: personnelCountData,
                                    backgroundColor: "blue",
                                    borderColor: "blue",
                                    borderWidth: 2,
                                    fill: false,
                                },
                                {
                                    label: "# Credentials",
                                    data: credentialsCountData,
                                    backgroundColor: "gray",
                                    borderColor: "gray",
                                    borderWidth: 2,
                                    fill: false,
                                },
                                {
                                    label: "# Access Allowed",
                                    data: successCountData,
                                    backgroundColor: "green",
                                    borderColor: "green",
                                    borderWidth: 2,
                                    fill: false,
                                },
                                {
                                    label: "# Access Denied",
                                    data: failureCountData,
                                    backgroundColor: "red",
                                    borderColor: "red",
                                    borderWidth: 2,
                                    fill: false,
                                },
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
                return DashboardPage;
            }());
            Home.DashboardPage = DashboardPage;
        })(Home = Organization.Home || (Organization.Home = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.home.dashboard.js.map