angular
    .module("urgentOnePageBooking")
    .factory("clientsService", ["$http", function ($http) {
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
            getReferences: function (clientId, letter) {
                return $http.get(`API/Reference/${clientId}/${letter}`)
                    .then((response) => response.data);
            },
            updateClient: function (params) {
                return $http.post(`API/client/${params.id}`, params.data)
                    .then((response) => response.data);
            },
            createReference: function (params) {
                return $http.post(`API/reference/${params.id}/${params.refName}/${params.letter}`)
                    .then((response) => response.data)
            },
            deleteReference: function (params) {
                return $http.delete(`API/reference/${params.id}/${params.refId}/${params.letter}`)
                    .then((response) => response.data)
            },
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            },
            getSuburbs: function () {
                return $http.get("API/Suburb")
                    .then((response) => response.data);
            }
        }
    }]);