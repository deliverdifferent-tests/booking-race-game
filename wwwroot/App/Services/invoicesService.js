angular
    .module("urgentOnePageBooking")
    .factory("invoicesService", ["$http", function ($http) {
        return {
            getClients: function () {
                return $http.get("API/Client")
                    .then((response) => response.data);
            },
            getAllClients: function () {
                return $http.get(`API/Client/${'all'}`)
                    .then((response) => response.data);
            },
            getInvoices: function (clientId) {
                return $http.get(`API/invoice/${clientId}`)
                    .then((response) => response.data);
            },
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            },
            getInvoice: function (invoiceId, statementId) {
                return $http.get(`Invoices/${invoiceId}/${statementId}/Invoice`)
                    .then((response) => response.data);
            },
            getClientMonthlyReport: function (clientId, startEndDate) {
                return $http.get(`${clientId}/${startEndDate}/ClientMonthlyReport`)
                    .then((response) => response.data);
            },
            getInvoiceJobs: function (invoiceId, clientId) {
                return $http.get(`API/invoice/${invoiceId}/${clientId}`)
                    .then((response) => response.data);
            },
            getSpeeds: function (clientId) {
                return $http.get(`API/speed/${clientId}`)
                    .then((response) => response.data);
            },
            getVehicleSizes: function (clientId) {
                return $http.get(`api/vehicleSize/${clientId}`)
                    .then((response) => response.data);
            }
        }
    }]);