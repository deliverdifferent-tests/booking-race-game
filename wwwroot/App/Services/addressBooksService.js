angular
    .module("urgentOnePageBooking")
    .factory("addressBooksService", ["$http", function ($http) {
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
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            },
            getAddressBook: function (clientId) {
                return $http.get(`API/AddressBook/${clientId}`)
                    .then((response) => response.data);
            },
            getSuburbs: function () {
                return $http.get("API/Suburb")
                    .then((response) => response.data);
            },
            updateAddressBook: function (clientId, addressBook) {
                return $http.post(`API/AddressBook/${clientId}/${'update'}`, addressBook)
                    .then((response) => response.data);
            },
            createAddressBook: function (clientId, addressBook) {
                return $http.post(`API/AddressBook/${clientId}`, addressBook)
                    .then((response) => response.data);
            },
            deleteAddressBook: function (addressBookId) {
                return $http.delete(`API/AddressBook/${addressBookId}`)
                    .then((response) => response.data);
            }
        }
    }]);