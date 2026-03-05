angular
    .module("urgentOnePageBooking")
    .factory("stripesService", ["$http", function ($http) {
        return {
            getClients: function () {
                return $http.get("API/Client")
                    .then((response) => response.data);
            },
            getAllClients: function () {
                return $http.get(`API/Client/${'all'}`)
                    .then((response) => response.data);
            },
            getThisClient: function (clientId) {
                return $http.get(`API/Client/${clientId}/${'thisClient'}`)
                    .then((response) => response.data);
            },
            getStripePortal: function (stripeClientId) {
                return $http.get(`API/Stripe/${stripeClientId}`)
                    .then((response) => response.data);
            }
        }
    }]);