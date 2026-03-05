angular
    .module("urgentOnePageBooking")
    .factory("jobListsService", ["$http", function ($http) {
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
            getSpeeds: function (clientId) {
                return $http.get(`API/speed/${clientId}`)
                    .then((response) => response.data);
            },
            getVehicleSizes: function (clientId) {
                return $http.get(`api/vehicleSize/${clientId}`)
                    .then((response) => response.data);
            },
            getCouriers: function () {
                return $http.get("API/Courier")
                    .then((response) => response.data);
            },
            getJobTypeStatuses: function () {
                return $http.get("API/JobTypeStatus")
                    .then((response) => response.data);
            },
            getUndeliverableLocations: function () {
                return $http.get("API/UndeliverableLocation")
                    .then((response) => response.data);
            },
            getReferences: function (clientId, letter) {
                return $http.get(`API/Reference/${clientId}/${letter}`)
                    .then((response) => response.data);
            },
            getTodaysJobs: function (clientId) {
                return $http.get(`API/Job/${clientId}`)
                    .then((response) => response.data);
            },
            getFilteredJobs: function (clientId, filters) {
                return $http.post(`API/Job/${clientId}`, filters)
                    .then((response) => response.data);
            },
            getThisJob: function (jobId, isBulk, prebook) {
                return $http.get(`API/Job/This/${jobId}/${isBulk}/${prebook}`)
                    .then((response) => response.data);
            },
            getThisSpeeds: function (request) {
                return $http.post('API/Speed', request)
                    .then((response) => response.data);
            },
            getSpeedDescription: function (request) {
                return $http.post(`API/Speed/${'description'}`, request)
                    .then((response) => response.data);
            },
            getUrgentToken: function (loginObject) {
                var tokenObject = {
                    "Login": loginObject
                };

                return $http.post("api/UrgentAPI/Token", tokenObject)
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
            updateJob: function (job) {
                return $http.post("API/Job", job)
                    .then((response) => response.data);
            },
            cancelJob: function (jobId, clientId, statusId) {
                return $http.delete(`API/Job/${jobId}/${clientId}/${statusId}`)
                    .then((response) => response.data);
            },
            readyNow: function (jobBookingId) {
                return $http.post(`API/Job/${jobBookingId}/${'ready'}`)
                    .then((response) => response.data);
            },
            sendFeedback: function (request) {
                return $http.post("API/Feedback", request)
                    .then((response) => response.data);
            },
            sendEmail: function (request) {
                return $http.post("API/Email", request)
                    .then((response) => response.data);
            },
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            },
            getSuburbs: function () {
                return $http.get("API/Suburb")
                    .then((response) => response.data);
            },
            getSites: function () {
                return $http.get("API/Site")
                    .then((response) => response.data);
            },
            getAllowedSpeeds: function () {
                return $http.get("api/Speed/Allowed")
                    .then((response) => response.data);
            },
            getJobStatusScans: function (jobId) {
                return $http.get(`api/Job/JobStatusScans/${jobId}`)
                    .then((response) => response.data);
            },
            getJobAccessorialCharges: function (jobId) {
                return $http.get(`API/JobAccessorial/${jobId}`)
                    .then((response) => response.data);
            },
            addJobAccessorialCharges: function (jobId, charges) {
                return $http.post(`API/JobAccessorial/${jobId}`, charges)
                    .then((response) => response.data);
            },
            updateJobAccessorialCharge: function (payload) {
                return $http.put(`API/JobAccessorial/${payload.jobAccessorialChargeId}`, payload)
                    .then((response) => response.data);
            },
            deleteJobAccessorialCharge: function (jobAccessorialChargeId) {
                return $http.delete(`API/JobAccessorial/${jobAccessorialChargeId}`)
                    .then((response) => response.data);
            },
            sendPodEmail: function (request) {
                return $http.post('API/PodReport/Send', request)
                    .then((response) => response.data);
            }
        }
    }]);