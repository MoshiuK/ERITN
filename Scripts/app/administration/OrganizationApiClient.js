/// <reference path="../utils/HttpClient.ts"/>
var OrganizationApiClient;
(function (OrganizationApiClient) {
    var OrganizationService = /** @class */ (function () {
        function OrganizationService() {
        }
        OrganizationService.prototype.toggleTag = function (id, tag) {
            var cli = new HttpClient.XhrHttpClient();
            try {
                var uri = "/viewapi/administration/organization/tags/".concat(id, "?tag=").concat(tag);
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
        OrganizationService.prototype.toggleCap = function (id, cap) {
            var cli = new HttpClient.XhrHttpClient();
            try {
                var uri = "/viewapi/administration/organization/caps/".concat(id, "?cap=").concat(cap);
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
        return OrganizationService;
    }());
    var organizationService = new OrganizationService();
    function getService() {
        return organizationService;
    }
    OrganizationApiClient.getService = getService;
})(OrganizationApiClient || (OrganizationApiClient = {}));
//# sourceMappingURL=OrganizationApiClient.js.map