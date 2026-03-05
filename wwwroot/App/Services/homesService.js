angular
    .module("urgentOnePageBooking")
    .factory("homesService", ["$http", function ($http) {
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
            createReference: function (params) {
                return $http.post(`API/reference/${params.id}/${params.refName}/${params.letter}`)
                    .then((response) => response.data)
            },
            deleteReference: function (params) {
                return $http.delete(`API/reference/${params.id}/${params.refId}/${params.letter}`)
                    .then((response) => response.data)
            },
            getJobSaveds: function (clientId) {
                return $http.get(`API/JobSaved/${clientId}`)
                    .then((response) => response.data);
            },
            getAddressBook: function (clientId) {
                return $http.get(`API/AddressBook/${clientId}`)
                    .then((response) => response.data);
            },
            updateSavedBooking: function (clientId, savedBooking) {
                return $http.post(`API/JobSaved/${clientId}/${'update'}`, savedBooking)
                    .then((response) => response.data);
            },
            createSavedBooking: function (clientId, savedBooking) {
                return $http.post(`API/JobSaved/${clientId}`, savedBooking)
                    .then((response) => response.data);
            },
            getUrgentToken: function (loginObject) {
                var tokenObject = {
                    "Login": loginObject
                };

                return $http.post("API/UrgentAPI/Token", tokenObject)
                    .then((response) => response.data);
            },
            getRates: function (dataObject, token) {
                var tokenObject = {
                    "Rates": dataObject,
                    "Token": token
                };

                return $http.post("API/UrgentAPI/Rates", tokenObject)
                    .then((response) => response.data);
            },
            getRerateAmount: function (rerateObject, token) {
                var tokenObject = {
                    "Job": rerateObject,
                    "Token": token
                };

                return $http.post("api/UrgentAPI/Rerate", tokenObject)
                    .then((response) => response.data);
            },
            bookJob: function (dataObject, token) { 
                var tokenObject = {
                    "Job": dataObject,
                    "Token": token
                };

                return $http.post("API/UrgentAPI/Job", tokenObject)
                    .then((response) => response.data);
            },
            updateBulkQuantity: function (dataObject, token) {
                var tokenObject = {
                    "Quantity": dataObject,
                    "Token": token
                };

                return $http.post("api/UrgentAPI/Quantity", tokenObject)
                    .then((response) => response.data);
            },
            getAPILabel: function (jobId, size, token) {
                var tokenObject = {
                    "JobLabelId": jobId,
                    "Size": size,
                    "Token": token
                };

                return $http.post("API/UrgentAPI/JobLabel", tokenObject)
                    .then((response) => response.data);
            },
            updateContactJob: function (job) {
                return $http.post("api/Job/Contact", job)
                    .then((response) => response.data);
            },
            deleteJob: function (jobId, jobNumber) {
                return $http.delete(`API/Job/${jobId}/${jobNumber}`)
                    .then((response) => response.data);
            },
            toggleJobVoid: function (jobId, jobNumber, toggleVoid) {
                return $http.post(`API/Job/${jobId}/${jobNumber}/${toggleVoid}`)
                    .then((response) => response.data);
            },
            getGeocodeData: function (addressObject) {
                return $http.post("api/Key", addressObject)
                .then((response) => response.data);
            },
            createStripeCheckoutSession: function (params) {
                return $http.post("API/stripe", params.data)
                    .then((response) => response.data);
            },
            createStripeChargeHold: function (stripeCustomerId, chargeObject) {
                return $http.post(`API/stripe/${stripeCustomerId}`, chargeObject)
                    .then((response) => response.data);
            },
            openStripeOneTimeCheckout: function (checkoutObject, page) {
                return $http.post(`API/stripe/${'onetime'}/${page}`, checkoutObject)
                    .then((response) => response.data);
            },
            getThisJob: function (jobId, jobNumber, prebook) {
                return $http.get(`API/Job/${jobId}/${jobNumber}/${prebook}`)
                    .then((response) => response.data);
            },
            getSpeedDescription: function (request) {
                return $http.post(`API/Speed/${'description'}`, request)
                    .then((response) => response.data);
            },
            getAccessorialCharges: function (accessorialChargeGroupId, clientId, speedId, vehicleSizeId) {
                return $http.get(`/API/AccessorialCharge/${accessorialChargeGroupId}/${clientId}/${speedId}/${vehicleSizeId}`)
                    .then((response) => response.data);
            },
            validateAccessCode: function (accessCode) {
                return $http.get(`API/Client/Access/${accessCode}`)
                    .then((response) => response.data);
            },
            getContactJobs: function (clientId, contactId) {
                return $http.get(`api/Job/Contact/${clientId}/${contactId}`)
                    .then((response) => response.data);
            },
            getFilteredContactJobs: function (clientId, contactId, request) {
                return $http.post(`api/Job/FilteredContact/${clientId}/${contactId}`, request)
                    .then((response) => response.data);
            },
            getJobTypeStatuses: function () {
                return $http.get("API/JobTypeStatus")
                    .then((response) => response.data);
            },
            getVehicleSizes: function (clientId) {
                return $http.get(`API/VehicleSize/${clientId}`)
                    .then((response) => response.data);
            },
            getSuburbs: function () {
                return $http.get("API/Suburb")
                    .then((response) => response.data);
            },
            getTimeZoneFromGPS: function (latitude, longitude) {
                return $http.post(`API/Key/${latitude}/${longitude}`)
                    .then((response) => response.data);
            },
            getTimeZones: function () {
                return $http.get("API/TimeZone")
                    .then((response) => response.data);
            },
            getSpeeds: function (clientId) {
                return $http.get(`API/Speed/${clientId}`)
                    .then((response) => response.data);
            },
            getAllowedSpeeds: function () {
                return $http.get("api/Speed/Allowed")
                    .then((response) => response.data);
            },
            getLabel: function (jobId, clientId) {
                return $http.get(`Labels/Jobs/${jobId}/${clientId}`)
                    .then((response) => response.data);
            },
            getBulkLabel: function (bulkJobId) {
                return $http.get(`Labels/BulkJobs/${bulkJobId}`)
                    .then((response) => response.data);
            },
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            },
            getUndeliverableLocations: function () {
                return $http.get("api/UndeliverableLocation")
                    .then((response) => response.data);
            },
            getSites: function () {
                return $http.get("API/Site")
                    .then((response) => response.data);
            },
            connectReturnParts: function (firstJobId, secondJobId) {
                return $http.post(`API/Job/ConnectReturnParts/${firstJobId}/${secondJobId}`)
                    .then((response) => response.data);
            }
        };
    }])