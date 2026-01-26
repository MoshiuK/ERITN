/// <reference path="../app/AccessManagement.ts"/>
/// <reference path="../typings/select2/select2.d.ts"/>
$(document).ready(function () {
    new EventGeneralPage().pageStart();
});
var EventGeneralPage = /** @class */ (function () {
    function EventGeneralPage() {
    }
    EventGeneralPage.prototype.pageStart = function () {
        var eventTypeInitSelection = $("#initialselection-EmergencyEventTypeId");
        var eventTypeId = eventTypeInitSelection.data("event-type-id");
        var eventTypeName = eventTypeInitSelection.data("event-type-name");
        var opt = new Option(eventTypeName, eventTypeId, true, true);
        var eventTypeSelect = $("select[name='EmergencyEventTypeId']");
        eventTypeSelect.append(opt).trigger("change");
    };
    return EventGeneralPage;
}());
//# sourceMappingURL=administration.event.general.js.map