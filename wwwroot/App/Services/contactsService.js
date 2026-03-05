angular
    .module("urgentOnePageBooking")
    .factory("contactsService", ["$http", function ($http) {
        return {
            getClients: function () {
                return $http.get("API/Client")
                    .then((response) => response.data);
            },
            getAllClients: function () {
                return $http.get(`API/Client/${'all'}`)
                    .then((response) => response.data);
            },
            getSubscriptions: function () {
                return $http.get("API/Subscription")
                    .then((response) => response.data);
            },
            getSpeeds: function (clientId) {
                return $http.get(`api/Speed/${clientId}`)
                    .then((response) => response.data);
            },
            getVehicleSizes: function (clientId) {
                return $http.get(`api/VehicleSize/${clientId}`)
                    .then((response) => response.data);
            },
            getContactSubscriptions: function (contactId) {
                return $http.get(`API/ContactSubscription/${contactId}`)
                    .then((response) => response.data);
            },
            createContactSubscription: function (params) {
                return $http.post("API/contactSubscription", params.data)
                    .then((response) => response.data);
            },
            deleteContactSubscription: function (params) {
                return $http.delete(`API/contactSubscription/${params.id}/${params.subId}`)
                    .then((response) => response.data);
            },
            getAllInternetPermissions: function () {
                return $http.get("API/InternetPermission")
                    .then((response) => response.data);
            },
            getInternetPermissions: function (clientId) {
                return $http.get(`API/InternetPermission/${clientId}`)
                    .then((response) => response.data);
            },
            getClientContactInternetPermissions: function (contactId) {
                return $http.get(`API/ClientContactInternetPermission/${contactId}`)
                    .then((response) => response.data);
            },
            getContacts: function (clientId) {
                return $http.get(`API/Contact/${clientId}`)
                    .then((response) => response.data);
            },
            getClientContact: function (contactId, clientId) {
                return $http.get(`API/ClientContact/${contactId}/${clientId}`)
                    .then((response) => response.data);
            },
            updateContact: function (params) {
                return $http.post(`API/Contact/${params.id}`, params.data)
                    .then((response) => response.data);
            },
            createContact: function (params) {
                return $http.post("API/Contact", params.data)
                    .then((response) => response.data);
            },
            deleteContact: function (contactId) {
                return $http.delete(`API/Contact/${contactId}`)
                    .then((response) => response.data);
            },
            updateClientContact: function (params) {
                return $http.post(`API/clientContact/${params.id}`, params.data)
                    .then((response) => response.data);
            },
            createClientContact: function (params) {
                return $http.post("API/clientContact", params.data)
                    .then((response) => response.data);
            },
            deleteClientContact: function (params) {
                return $http.delete(`API/clientContact/${params.id}`)
                    .then((response) => response.data);
            },
            createClientContactInternetPermission: function (params) {
                return $http.post("API/clientContactInternetPermission", params.data)
                    .then((response) => response.data);
            },
            deleteClientContactInternetPermission: function (params) {
                return $http.delete(`API/clientContactInternetPermission/${params.id}/${params.subId}`)
                    .then((response) => response.data);
            },
            getClientContactJobTypes: function (params) {
                return $http.get(`API/clientContactJobType/${params.id}`)
                    .then((response) => response.data);
            },
            createClientContactJobType: function (params) {
                return $http.post("API/clientContactJobType", params.data)
                    .then((response) => response.data);
            },
            deleteClientContactJobType: function (params) {
                return $http.delete(`API/clientContactJobType/${params.id}/${params.clientContactJobTypeId}`)
                    .then((response) => response.data);
            },
            getAddressBook: function (clientId) {
                return $http.get(`API/AddressBook/${clientId}`)
                    .then((response) => response.data);
            },
            getStockSizes: function (clientId) {
                return $http.get(`API/StockSize/${clientId}`)
                    .then((response) => response.data);
            }
        }
    }]);