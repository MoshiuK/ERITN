var HttpClient;
(function (HttpClient) {
    // ReSharper disable InconsistentNaming
    var HttpMethods = /** @class */ (function () {
        function HttpMethods() {
        }
        HttpMethods.HttpGET = "GET";
        HttpMethods.HttpPOST = "POST";
        HttpMethods.HttpPUT = "PUT";
        HttpMethods.HttpDELETE = "DELETE";
        HttpMethods.HttpPATCH = "PATCH";
        return HttpMethods;
    }());
    HttpClient.HttpMethods = HttpMethods;
    // ReSharper restore InconsistentNaming
    var HttpResponse = /** @class */ (function () {
        function HttpResponse(httpStatusCode, body) {
            this.body = body;
            this.httpStatusCode = httpStatusCode;
        }
        return HttpResponse;
    }());
    HttpClient.HttpResponse = HttpResponse;
    var HttpError = /** @class */ (function () {
        function HttpError(httpStatusCode, httpStatusText, requestMethod, requestUrl) {
            this.httpStatusCode = httpStatusCode;
            this.httpStatusText = httpStatusText;
            this.requestMethod = requestMethod;
            this.requestUrl = requestUrl;
        }
        return HttpError;
    }());
    HttpClient.HttpError = HttpError;
    var XhrHttpClient = /** @class */ (function () {
        function XhrHttpClient() {
        }
        XhrHttpClient.prototype.send = function (method, url, header, body) {
            if (header == null) {
                throw "header must not be null";
            }
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                xhr.responseType = "json";
                for (var key in header) {
                    xhr.setRequestHeader(key, header[key]);
                }
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(new HttpResponse(xhr.status, xhr.response));
                    }
                    else {
                        reject(new HttpError(xhr.status, xhr.statusText, method, url));
                    }
                };
                xhr.onerror = function (e) {
                    reject(Error(e));
                };
                if (body === null) {
                    xhr.send();
                }
                else {
                    xhr.send(body);
                }
            });
        };
        return XhrHttpClient;
    }());
    HttpClient.XhrHttpClient = XhrHttpClient;
})(HttpClient || (HttpClient = {}));
//# sourceMappingURL=HttpClient.js.map