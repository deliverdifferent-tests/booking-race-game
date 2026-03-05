angular
    .module("urgentOnePageBooking")
    .factory("dimensionsService", ["$http", function ($http) {
        return {
            getClients: function () {
                return $http.get("API/Client")
                    .then((response) => response.data);
            },
            getAllClients: function () {
                return $http.get(`API/Client/${'all'}`)
                    .then((response) => response.data);
            },
            getDimensions: function (clientId) {
                return $http.get(`API/StockSize/${clientId}`)
                    .then((response) => response.data);
            },
            updateDimension: function (params) {
                return $http.post("API/StockSize", params.data)
                    .then((response) => response.data);
            },
            createDimension: function (params) {
                return $http.post(`API/StockSize/${params.clientId}`, params.data)
                    .then((response) => response.data);
            },
            deleteDimension: function (params) {
                return $http.delete(`API/StockSize/${params.id}`)
                    .then((response) => response.data);
            },
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            }
        }
    }]);