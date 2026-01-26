/// <reference path="../app/AccessManagement.ts"/>
$(document).ready(function () {
    new OrganizationPaymentsBillDatePage().pageStart();
});
var OrganizationPaymentsBillDatePage = /** @class */ (function () {
    function OrganizationPaymentsBillDatePage() {
    }
    OrganizationPaymentsBillDatePage.prototype.pageStart = function () {
        $(".updatebilldate").click(function (e) {
            var btn = $(e.target);
            var billedDate = encodeURI(btn.data("billedDate"));
            var organizationId = btn.data("organizationId");
            var invoiceId = btn.data("invoiceId");
            var dlg = $("#paymentBilledDateDialog");
            var contentUri = "".concat(dlg.data("modal-uri"), "?organizationId=").concat(organizationId, "&invoiceId=").concat(invoiceId, "&billedDate=").concat(billedDate);
            dlg.load(contentUri, function () {
                Juillet.Web.Mvc.setupJuilletComponents(dlg);
                dlg.show();
            });
        });
        $(".updatepaiddate").click(function (e) {
            var btn = $(e.target);
            var paidDate = encodeURI(btn.data("paidDate"));
            var organizationId = btn.data("organizationId");
            var invoiceId = btn.data("invoiceId");
            var dlg = $("#paymentPaidDateDialog");
            var contentUri = "".concat(dlg.data("modal-uri"), "?organizationId=").concat(organizationId, "&invoiceId=").concat(invoiceId, "&paidDate=").concat(paidDate);
            dlg.load(contentUri, function () {
                Juillet.Web.Mvc.setupJuilletComponents(dlg);
                dlg.show();
            });
        });
        $(".updatereferencenumber").click(function (e) {
            var btn = $(e.target);
            var referenceNumber = encodeURI(btn.data("referencenumber"));
            var organizationId = btn.data("organizationId");
            var invoiceId = btn.data("invoiceId");
            var dlg = $("#paymentUpdateReferenceNumberDialog");
            var contentUri = "".concat(dlg.data("modal-uri"), "?organizationId=").concat(organizationId, "&invoiceId=").concat(invoiceId, "&referenceNumber=").concat(referenceNumber);
            dlg.load(contentUri, function () {
                dlg.modal("show");
            });
        });
    };
    return OrganizationPaymentsBillDatePage;
}());
//# sourceMappingURL=administration.payment.updatebilldate.js.map