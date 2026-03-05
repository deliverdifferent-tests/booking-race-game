angular
    .module("urgentOnePageBooking")
    .factory("confirmationsService", ["$http", function ($http) {
        return {
            getSpeeds: function () {
                return $http.get("API/speed")
                    .then((response) => response.data);
            },
            getSuburbs: function () {
                return $http.get("API/Suburb")
                    .then((response) => response.data);
            },
            getThisJob: function (jobId, isBulk, prebook) {
                return $http.get(`API/Job/This/${jobId}/${isBulk}/${prebook}`)
                    .then((response) => response.data);
            },
            toggleJobVoid: function (jobId, jobNumber, toggleVoid) {
                return $http.post(`API/Job/${jobId}/${jobNumber}/${toggleVoid}`)
                    .then((response) => response.data);
            },
            setPaymentIntent: function (jobId, jobNumber) {
                return $http.post(`API/Stripe/PaymentIntent/${jobId}/${jobNumber}`)
                    .then((response) => response.data);
            },
            sendEmail: function (request) {
                return $http.post("API/Email", request)
                    .then((response) => response.data);
            }
        }
    }]);