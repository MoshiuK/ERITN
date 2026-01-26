$(document)
    .ready(function () {
    var FinancialConstants = /** @class */ (function () {
        function FinancialConstants() {
        }
        FinancialConstants.freeOrganizations = "FreeOrganizations";
        FinancialConstants.lastPaymentReceived = "LastPaymentReceived";
        FinancialConstants.ordersPendingPayment = "OrdersPendingPayment";
        FinancialConstants.paymentAmount = "PaymentAmount";
        FinancialConstants.tenantName = "TenantName";
        return FinancialConstants;
    }());
    var RegistrationConstants = /** @class */ (function () {
        function RegistrationConstants() {
        }
        RegistrationConstants.importedMembers = "ImportedMembers";
        RegistrationConstants.attributesNotVerified = "AttributesNotVerified";
        RegistrationConstants.enrollments = "Enrollments";
        RegistrationConstants.registrations = "Registrations";
        RegistrationConstants.abandonedRegistrations = "AbandonedRegistrations";
        RegistrationConstants.tenantName = "TenantName";
        return RegistrationConstants;
    }());
    var ActivityConstants = /** @class */ (function () {
        function ActivityConstants() {
        }
        ActivityConstants.tenantName = "TenantName";
        ActivityConstants.credentialsIssued = "CredentialsIssued";
        ActivityConstants.successCount = "SuccessCount";
        ActivityConstants.failedCount = "FailedCount";
        ActivityConstants.deniedCount = "DeniedCount";
        ActivityConstants.otherActivityCount = "OtherActivityCount";
        return ActivityConstants;
    }());
    $("button[sps-action='reload-card']").click(function (e) {
        var btn = $(e.target);
        var cardAction = btn.attr("data-card-action");
        var days = btn.attr("data-days");
        $("button[data-card-action='" + cardAction + "']").removeClass("btn-primary").addClass("btn-default");
        btn.addClass("btn-primary");
        $.ajax({
            url: "/Operations/Home/UpdateCard",
            type: 'GET',
            data: {
                timeSpan: days,
                cardAction: cardAction
            },
            cache: false,
            success: function (result) {
                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        $("#".concat(key)).text(result[key]);
                    }
                }
            }
        });
    });
    $("button[sps-action='reload-reg-table']").click(function (e) {
        var btn = $(e.target);
        var year = btn.attr("data-year");
        $.ajax({
            url: "/Operations/Home/UpdateRegistrationTable",
            type: 'GET',
            data: {
                year: year,
            },
            cache: false,
            success: function (result) {
                $("#RegistrationYear").text(year);
                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        $("#" + RegistrationConstants.importedMembers + "_" + key)
                            .text(result[key][RegistrationConstants.importedMembers]);
                        $("#" + RegistrationConstants.attributesNotVerified + "_" + key)
                            .text(result[key][RegistrationConstants.attributesNotVerified]);
                        $("#" + RegistrationConstants.enrollments + "_" + key)
                            .text(result[key][RegistrationConstants.enrollments]);
                        $("#" + RegistrationConstants.registrations + "_" + key)
                            .text(result[key][RegistrationConstants.registrations]);
                        $("#" + RegistrationConstants.abandonedRegistrations + "_" + key)
                            .text(result[key][RegistrationConstants.abandonedRegistrations]);
                    }
                }
            }
        });
    });
    $("button[sps-action='reload-activity-table']").click(function (e) {
        var btn = $(e.target);
        var year = btn.attr("data-year");
        $.ajax({
            url: "/Operations/Home/UpdateActivityTable",
            type: 'GET',
            data: {
                year: year,
            },
            cache: false,
            success: function (result) {
                $("#ActivityYear").text(year);
                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        $("#" + ActivityConstants.credentialsIssued + "_" + key)
                            .text(result[key][ActivityConstants.credentialsIssued]);
                        $("#" + ActivityConstants.deniedCount + "_" + key)
                            .text(result[key][ActivityConstants.deniedCount]);
                        $("#" + ActivityConstants.failedCount + "_" + key)
                            .text(result[key][ActivityConstants.failedCount]);
                        $("#" + ActivityConstants.otherActivityCount + "_" + key)
                            .text(result[key][ActivityConstants.otherActivityCount]);
                        $("#" + ActivityConstants.successCount + "_" + key)
                            .text(result[key][ActivityConstants.successCount]);
                    }
                }
            }
        });
    });
    $("button[sps-action='reload-fin-table']").click(function (e) {
        var btn = $(e.target);
        var year = btn.attr("data-year");
        $.ajax({
            url: "/Operations/Home/UpdateFinancialTable",
            type: 'GET',
            data: {
                year: year,
            },
            cache: false,
            success: function (result) {
                $("#FinancialYear").text(year);
                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        $("#" + FinancialConstants.freeOrganizations + "_" + key)
                            .text(result[key][FinancialConstants.freeOrganizations]);
                        $("#" + FinancialConstants.lastPaymentReceived + "_" + key)
                            .text(result[key][FinancialConstants.lastPaymentReceived]);
                        $("#" + FinancialConstants.ordersPendingPayment + "_" + key)
                            .text(result[key][FinancialConstants.ordersPendingPayment]);
                        $("#" + FinancialConstants.paymentAmount + "_" + key)
                            .text(result[key][FinancialConstants.paymentAmount]);
                    }
                }
            }
        });
    });
});
//# sourceMappingURL=operations.home.index.js.map