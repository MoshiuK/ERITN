/// <reference path="../utils/HttpClient.ts"/>
var SettingsApiClient;
(function (SettingsApiClient) {
    var SettingsService = /** @class */ (function () {
        function SettingsService() {
        }
        SettingsService.prototype.toggleAccessLevels = function (accessLevelId) {
            var cli = new HttpClient.XhrHttpClient();
            try {
                var uri = "/viewapi/administration/settings/accesslevels/".concat(accessLevelId);
                return cli.send(HttpClient.HttpMethods.HttpPUT, uri, [{ "Content-Type": "application/json" }], null)
                    .then(function (response) {
                    var json = response.body;
                    if (typeof json === "string") {
                        return Promise.resolve(JSON.parse(json));
                    }
                    return Promise.resolve(response.body);
                }, function (err) {
                    console.log("HTTP ERROR ".concat(err));
                    console.log(err);
                    return Promise.reject(err);
                });
            }
            catch (e) {
                console.log("INTERNAL ERROR ".concat(e));
                console.log(e);
                return Promise.reject(e);
            }
        };
        SettingsService.prototype.toggleTransitLocations = function (transitLocationId) {
            var cli = new HttpClient.XhrHttpClient();
            try {
                var uri = "/viewapi/administration/settings/transitlocations/".concat(transitLocationId);
                return cli.send(HttpClient.HttpMethods.HttpPUT, uri, [{ "Content-Type": "application/json" }], null)
                    .then(function (response) {
                    var json = response.body;
                    if (typeof json === "string") {
                        return Promise.resolve(JSON.parse(json));
                    }
                    return Promise.resolve(response.body);
                }, function (err) {
                    console.log("HTTP ERROR ".concat(err));
                    console.log(err);
                    return Promise.reject(err);
                });
            }
            catch (e) {
                console.log("INTERNAL ERROR ".concat(e));
                console.log(e);
                return Promise.reject(e);
            }
        };
        SettingsService.prototype.toggleTransitPurposes = function (transitLocationId) {
            var cli = new HttpClient.XhrHttpClient();
            try {
                var uri = "/viewapi/administration/settings/transitpurposes/".concat(transitLocationId);
                return cli.send(HttpClient.HttpMethods.HttpPUT, uri, [{ "Content-Type": "application/json" }], null)
                    .then(function (response) {
                    var json = response.body;
                    if (typeof json === "string") {
                        return Promise.resolve(JSON.parse(json));
                    }
                    return Promise.resolve(response.body);
                }, function (err) {
                    console.log("HTTP ERROR ".concat(err));
                    console.log(err);
                    return Promise.reject(err);
                });
            }
            catch (e) {
                console.log("INTERNAL ERROR ".concat(e));
                console.log(e);
                return Promise.reject(e);
            }
        };
        return SettingsService;
    }());
    var settingsService = new SettingsService();
    function getService() {
        return settingsService;
    }
    SettingsApiClient.getService = getService;
})(SettingsApiClient || (SettingsApiClient = {}));
//# sourceMappingURL=SettingsApiClient.js.map