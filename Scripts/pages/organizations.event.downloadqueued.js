$(document)
    .ready(function () {
    new AccessManagement.Organization.Event.DownloadQueue().pageStart();
});
var AccessManagement;
(function (AccessManagement) {
    var Organization;
    (function (Organization) {
        var Event;
        (function (Event) {
            var DownloadQueue = /** @class */ (function () {
                function DownloadQueue() {
                }
                DownloadQueue.prototype.pageStart = function () {
                    var retryCaption = $("#retryTimerCaption");
                    var retryCount = parseInt(retryCaption.data("retry-count"));
                    var counter = 10;
                    setInterval(function () {
                        retryCaption.text("Checking again in ".concat(counter, " seconds."));
                        counter--;
                        if (counter === 0) {
                            var prevCount = retryCount - 1;
                            var nextUri = location.href.replace("r=".concat(prevCount), "r=".concat(retryCount));
                            location.replace(nextUri);
                        }
                    }, 1000);
                };
                return DownloadQueue;
            }());
            Event.DownloadQueue = DownloadQueue;
        })(Event = Organization.Event || (Organization.Event = {}));
    })(Organization = AccessManagement.Organization || (AccessManagement.Organization = {}));
})(AccessManagement || (AccessManagement = {}));
//# sourceMappingURL=organizations.event.downloadqueued.js.map