angular
    .module("urgentOnePageBooking")
    .filter('object2Array', function () {
        return function (input) {
            var out = [];
            for (i in input) {
                out.push(input[i]);
            }
            return out;
        }
    })
    .controller("homeControl", ["$rootScope", "$scope", "$state", "homesService", "NgMap", "GeoCoder", function ($rootScope, $scope, $state, homesService, NgMap, GeoCoder) {

        /* --- API Scheiße --- */

        $scope.getClients = function () {
            homesService.getClients()
                .then(function (data) {
                    if (data.success) {
                        $scope.clients = data.clients;

                        $scope.hideForCreditCard();

                        $state.current.data.contactId = $scope.clients[0].loggedInContactId;

                        if ($scope.clients[0].id != 9196) {
                            $scope.getIntercom();
                        };

                        $scope.setInitialStep();
                    } else {
                        $rootScope.showNotification("Error getting clients", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting clients", "fa-exclamation");
                });
        };

        $scope.getAllClients = function () {
            homesService.getAllClients()
                .then(function (data) {
                    if (data.success) {
                        $scope.allClients = data.clients;
                    } else {
                        $rootScope.showNotification("Error getting clients", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting clients", "fa-exclamation");
                });
        };

        $scope.getThisClient = function () {
            homesService.getThisClient($scope.booking.client.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.booking.client = data.client;

                        $scope.clients[$scope.clients.findIndex(e => e.id === $scope.booking.client.id)] = $scope.booking.client;

                        $scope.initClient();
                    } else {
                        $rootScope.showNotification("Error getting this client", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this client", "fa-exclamation");
                });
        };

        $scope.getVehicleSizes = function () {
            homesService.getVehicleSizes($scope.booking.client.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.vehicleSizes = data.vehicleSizes;
                    } else {
                        $rootScope.showNotification("Error getting vehicle sizes", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting vehicle sizes", "fa-exclamation");
                });
        };

        $scope.getSuburbs = function () {
            homesService.getSuburbs()
                .then(function (data) {
                    if (data.success) {
                        $scope.suburbs = data.suburbs;
                    } else {
                        $rootScope.showNotification("Error getting suburbs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting suburbs", "fa-exclamation");
                });
        };

        $scope.getSpeeds = function () {
            homesService.getSpeeds($scope.booking.client.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.speeds = data.speeds;
                    } else {
                        $rootScope.showNotification("Error getting services", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting services", "fa-exclamation");
                });
        };

        $scope.getReferences = function (letter) {
            homesService.getReferences($scope.booking.client.id, letter)
                .then(function (data) {
                    if (data.success) {
                        if (letter == "A") {
                            $scope.referencesA = data.references;
                        } else {
                            $scope.referencesB = data.references;
                        };
                    } else {
                        $rootScope.showNotification("Error getting references", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting references", "fa-exclamation");
                });
        };

        $scope.getSavedJobs = function () {
            homesService.getJobSaveds($scope.booking.client.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.savedJobs = data.jobSaveds;
                    } else {
                        $rootScope.showNotification("Error getting saved jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting saved jobs", "fa-exclamation");
                });
        };

        $scope.updateSavedBooking = function () {
            homesService.updateSavedBooking($scope.booking.client.id, $scope.booking.savedBooking)
                .then(function (data) {
                    if (data.success) {
                        $scope.booking.savedBooking = data.jobSaved;
                        $rootScope.showNotification("Your saved booking '" + data.jobSaved.name + "' has been successfully updated!", "fa-check");
                    } else {
                        $rootScope.showNotification("Error updating your saved booking", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data) {
                        if (response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error updating your saved booking", "fa-exclamation");
                    }
                });
        };

        $scope.createSavedBooking = function () {
            homesService.createSavedBooking($scope.booking.client.id, $scope.booking.savedBooking)
                .then(function (data) {
                    if (data.success) {
                        $scope.booking.savedBooking = data.jobSaved;
                        $rootScope.showNotification("Your saved booking '" + data.jobSaved.name + "' has been successfully created!", "fa-check");
                    } else {
                        $rootScope.showNotification("Error creating your saved booking", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data) {
                        if (response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error creating your saved booking", "fa-exclamation");
                    }
                });
        };

        $scope.getManualAPIData = function () {
            $scope.dangerousGoodsClasses = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }];
            $scope.proofOfDeliveries = [{ value: "EMAIL", name: "Email" }, { value: "TEXT", name: "Text" }, { value: "EMAILANDTEXT", name: "Email & Text" }]; //Null is "WEBSITE"
            $scope.signatureNotRequireds = [{ value: "Letter Box" }, { value: "Front Door" }, { value: "Back Door" }, { value: "Safe Place" }, { value: "Other (add to 'Delivery Notes')" }]; //Null is sig required
            $scope.labelSizes = [{ value: 1, name: "Label (100 X 174mm)" }, { value: 2, name: "Label (100 X 150mm)" }]; //Null is PDF
            $scope.badRegionalSpeedIds = [1, 2, 3, 4, 20, 24, 25, 29, 36, 37, 38, 10];
            $scope.bikeSpeedIds = [1, 2, 3, 4, 20, 24, 25, 29];
        };

        $scope.getGeocodeData = function (address, suburb, direction) {
            //City doesn't geocode correctly
            if ($scope.countryCode == "NZ" && (suburb === "City" || suburb === "CBD")) {
                suburb = "Auckland CBD";
            }
            //Here maps
            var addressObject = { address: address, city: suburb, countryCode: $scope.countryCode };

            homesService.getGeocodeData(addressObject, suburb)
                .then(function (data) {
                    if (data && data.googleMapsData && data.googleMapsData.results) {
                        if (direction == 'from') {
                            $scope.booking.fromDetails = data.googleMapsData.results[0];
                        } else if (direction == 'to') {
                            $scope.booking.toDetails = data.googleMapsData.results[0];
                        } else {
                            $scope.booking.fromDetails = data.googleMapsData.results[0];
                            $scope.booking.savedClientDetails = data.googleMapsData.results[0];
                            $scope.booking.clientAddressGeocoded = true;
                        }
                    } else {
                        if (direction == 'from') {
                            $scope.booking.fromDetails = null;
                        } else if (direction == 'to') {
                            $scope.booking.toDetails = null;
                        } else {
                            $scope.booking.fromDetails = null;
                            $scope.booking.savedClientDetails = null;
                            $scope.booking.clientAddressGeocoded = true;
                        }
                        $rootScope.showNotification("Error geocoding address - please check that your client address is valid", "fa-exclamation");
                    }
                    /*if (data && data.hereMapsData && data.hereMapsData.items) {
                        if (direction == 'from') {
                            $scope.booking.fromDetails = data.hereMapsData.items[0];
                        } else if (direction == 'to') {
                            $scope.booking.toDetails = data.hereMapsData.items[0];
                        } else {
                            $scope.booking.fromDetails = data.hereMapsData.items[0];
                            $scope.booking.savedClientDetails = data.hereMapsData.items[0];
                            $scope.booking.clientAddressGeocoded = true;
                        }
                    }*/
                })
                .catch(function () {
                    if (direction == 'from') {
                        $scope.booking.fromDetails = null;
                    } else if (direction == 'to') {
                        $scope.booking.toDetails = null;
                    } else {
                        $scope.booking.fromDetails = null;
                        $scope.booking.savedClientDetails = null;
                        $scope.booking.clientAddressGeocoded = true;
                    }
                    $rootScope.showNotification("Error geocoding address", "fa-exclamation");
                });
        };

        $scope.getUrgentToken = function () {
            var loginObject = {
                contactId: $scope.booking.client.loggedInContactId,
                id: $scope.booking.client.id
            };

            homesService.getUrgentToken(loginObject)
                .then(function (data) {
                    if (data.token) {
                        $scope.urgentToken = data.token;
                    } else {
                        $rootScope.showNotification("Error getting token", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting token", "fa-exclamation");
                });
        };

        $scope.getRates = function () {
            //Hide to and from extra info to fit rates
            $scope.showFromExtra = false;
            $scope.showToExtra = false;

            homesService.getRates($scope.getRatesObject, $scope.urgentToken)
                .then(function (data) {
                    if (angular.equals(data.errors, {})) {
                        $scope.rates = data.rates;
                        $scope.getSelectedRates();
                        $scope.getFastestGreenSpeed();
                        $scope.noRates = false;
                        $scope.ratesLoading = false;
                        if ($scope.countryCode == 'NZ') {
                            $scope.hideBadRates();
                        };
                    } else if (data.rates) {
                        for (error in data.errors) {
                            if (!data.errors[error].includes("valide") && !data.errors[error].includes("provid") && !data.errors[error].includes("Next Day Premiums")) { //Ignore the 'too big' and 'don't do DG' errors from API
                                $rootScope.showNotification(error + " " + data.errors[error], "fa-exclamation");
                            }
                        };
                        $scope.rates = data.rates;
                        $scope.getSelectedRates();
                        $scope.getFastestGreenSpeed();
                        $scope.noRates = false;
                        $scope.ratesLoading = false;
                        if ($scope.countryCode == 'NZ') {
                            $scope.hideBadRates();
                        };
                    } else {
                        for (error in data.errors) {
                            $rootScope.showNotification(error + " " + data.errors[error], "fa-exclamation");
                        };
                        $scope.rates = null;
                        $scope.noRates = true;
                        $scope.ratesLoading = false;
                    }
                })
                .catch(function (response) {
                    if (response.data) {
                        if (response.data.errors) {
                            for (i in response.data.errors) {
                                $rootScope.showNotification(response.data.errors[i], "fa-exclamation");
                            };
                        } else if (response.data.messages) {
                            for (i in response.data.messages) {
                                $rootScope.showNotification(response.data.messages[i].message, "fa-exclamation");
                            };
                        };
                        $scope.rates = null;
                        $scope.noRates = true;
                        $scope.ratesLoading = false;
                    } else {
                        $rootScope.showNotification("Error getting rates", "fa-exclamation");
                        $scope.rates = null;
                        $scope.noRates = true;
                        $scope.ratesLoading = false;
                    }
                })
        };

        $scope.bookJob = function () {
            if ($scope.bookJobInProgress)
                return;

            if (!$scope.booking.client.bookJobPermission) {
                $rootScope.showNotification("You do not have permission to book this job. Please contact via the live chat.", "fa-exclamation");
                $scope.jobLoading = false;
                return;
            };

            $scope.bookJobInProgress = true;

            homesService.bookJob($scope.bookJobObject, $scope.urgentToken)
                .then(function (data) {
                    if (data.errorsList == undefined || data.errorsList.length == 0) {
                        $scope.jobData = { jobID: data.jobID, jobNumber: data.jobNumber, trackingUrl: data.trackingUrl };

                        //Get this job incase it's bulk - for label printing (diff labels for bulk vs live)
                        $scope.getThisJob();

                        //Code to charge sign up client on payment
                        if ($scope.booking.client.stripeClient) {
                            $scope.createStripeChargeHold();
                        } else if ($scope.booking.client.id === 9196 || $scope.booking.client.id == 35957) {
                            //Do nothing - waiting for redirect to checkout
                        } else {
                            $scope.setStep("jobBooked");
                            $scope.jobLoading = false;
                        }
                    } else {
                        for (error in data.errorsList) {
                            $rootScope.showNotification(data.errorsList[parseInt(error)].message, "fa-exclamation"); //If any have: data.errorsList[parseInt(error)].property + " " + 
                        };
                        $scope.jobData = null;
                        $scope.jobLoading = false;
                    }
                })
                .catch(function (response) {
                    if (response.data.errors) {
                        for (error in response.data.errorsList) {
                            $rootScope.showNotification(response.data.errorsList[parseInt(error)].message, "fa-exclamation");
                        };
                        $scope.jobData = null;
                        $scope.jobLoading = false;
                    } else {
                        $rootScope.showNotification("Error booking job", "fa-exclamation");
                        $scope.jobData = null;
                        $scope.jobLoading = false;
                    }
                })
                .finally(() => $scope.bookJobInProgress = false);
        };

        $scope.getThisJob = function () {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            homesService.getThisJob($scope.jobData.jobID, $scope.jobData.jobNumber, !$scope.checkIfCurrentDateTime())
                .then(function (data) {
                    if (data.success) {
                        $scope.thisJob = data.job;

                        if ($scope.booking.client.id === 9196) {
                            $scope.openStripeOneTimeCheckout();
                        } else if ($scope.booking.client.id === 35957) {
                            $state.go("mobileConfirmation", { "jobId": $scope.jobData.jobID, "isBulk": $scope.thisJob.isBulk, "prebook": $scope.thisJob.prebook, "email": $scope.booking.podEmail }, { location: "replace" });
                        };
                    } else {
                        $rootScope.showNotification("Error getting this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this job", "fa-exclamation");
                })
                .finally(() => $scope.jobsLoading = false);
        };

        $scope.deleteJob = function () {
            if ($scope.deleteJobInProgress)
                return;

            $scope.deleteJobInProgress = true;

            homesService.deleteJob($scope.jobData.jobID, $scope.jobData.jobNumber)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobData = null;
                        $scope.setStep("bookingConfirmation");
                    } else {
                        $rootScope.showNotification("Error deleting job", "fa-exclamation");
                        $scope.setStep("jobBooked");
                    }
                })
                .catch(function (response) {
                    if (response.data.errors) {
                        for (error in response.data.errors) {
                            $rootScope.showNotification(error + " " + response.data.errors[error], "fa-exclamation");
                        };
                        $scope.setStep("jobBooked");
                    } else {
                        $rootScope.showNotification("Error deleting job", "fa-exclamation");
                        $scope.setStep("jobBooked");
                    }
                })
                .finally(() => $scope.deleteJobInProgress = false);
        };

        $scope.createStripeCustomer = function () {
            if ($scope.stripeCustomerCreateInProgress)
                return;

            $scope.stripeCustomerCreateInProgress = true;

            homesService.createStripeCheckoutSession({ "data": { "client": $scope.booking.client, "contact": $scope.booking.clientContact } })
                .then(function (data) {
                    if (data) {
                        window.location.href = data;
                    } else {
                        $rootScope.showNotification("There was a problem retrieving your Credit Card session. Please try again or get in contact with DFRNT.", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    $rootScope.showNotification("There was a problem retrieving your Credit Card session. Please try again or get in contact with DFRNT.", "fa-exclamation");
                })
                .finally(() => $scope.stripeCustomerCreateInProgress = false);
        };

        $scope.createStripeChargeHold = function () {
            $scope.createStripeChargeObject = { "jobId": $scope.jobData.jobID, "jobNumber": $scope.jobData.jobNumber, "amount": $scope.booking.selectedRate.amount * 1.15 };

            homesService.createStripeChargeHold($scope.booking.client.stripeClientId, $scope.createStripeChargeObject)
                .then(function (data) {
                    if (data.success) {
                        $scope.setStep("jobBooked");
                    } else {
                        $scope.deleteJob();
                        $rootScope.showNotification("There was a problem creating this charge with your Credit Card. Please check that your card has enough funds and is not expired. You can check your Credit Card info via Settings -> Credit Card.", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    $scope.deleteJob();
                    $rootScope.showNotification("There was a problem creating this charge with your Credit Card. Please check that your card has enough funds and is not expired. You can check your Credit Card info via Settings -> Credit Card.", "fa-exclamation");
                })
                .finally(() => $scope.jobLoading = false);
        };

        $scope.openStripeOneTimeCheckout = function () {
            if ($scope.stripeCheckoutSession)
                return;

            $scope.stripeCheckoutSession = true;

            $scope.openStripeCheckoutObject = { "jobId": $scope.jobData.jobID, "jobNumber": $scope.jobData.jobNumber, "amount": $scope.booking.selectedRate.amount * 1.15, "isBulk": $scope.thisJob.isBulk, "prebook": $scope.thisJob.prebook, "email": $scope.booking.clientContact.email };

            homesService.openStripeOneTimeCheckout($scope.openStripeCheckoutObject, "mobile")
                .then(function (data) {
                    if (data) {
                        window.location.href = data;
                    } else {
                        $rootScope.showNotification("There was a problem opening the Credit Card checkout page.", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    $rootScope.showNotification("There was a problem opening the Credit Card checkout page.", "fa-exclamation");
                })
                .finally(() => $scope.stripeCheckoutSession = false);
        };

        $scope.printLabel = function () {
            if ($scope.printLabelInProgress)
                return;

            $scope.printLabelInProgress = true;

            var promise = $scope.thisJob.isParentBulk
                ? homesService.getBulkLabel($scope.thisJob.parentId)
                : ($scope.thisJob.isBulk
                    ? homesService.getBulkLabel($scope.thisJob.id)
                    : homesService.getAPILabel($scope.thisJob.id, $scope.booking.labelSize, $scope.urgentToken)); //homesService.getLabel($scope.jobData.jobID, $scope.booking.client.id));

            promise
                .then(function (data) {
                    if (data) {
                        $scope.label = data;
                        // Remove data URL prefix if present
                        const base64 = $scope.label.replace(/^data:application\/pdf;base64,/, '');

                        // Decode base64 to binary
                        const binaryStr = atob(base64);

                        // Convert binary to Uint8Array
                        const bytes = new Uint8Array(binaryStr.length);
                        for (let i = 0; i < binaryStr.length; i++) {
                            bytes[i] = binaryStr.charCodeAt(i);
                        }
                        const blob = new Blob([bytes], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        window.open(url);
                    } else {
                        $rootScope.showNotification("Error getting label", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting label", "fa-exclamation");
                })
                .finally(() => $scope.printLabelInProgress = false);
        };

        $scope.getTimeZoneFromGPS = function (direction) {
            var lat = direction === "from" ? $scope.booking.fromLat : $scope.booking.toLat;
            var lng = direction === "from" ? $scope.booking.fromLong : $scope.booking.toLong;

            homesService.getTimeZoneFromGPS(lat, lng)
                .then(function (data) {
                    if (data) {
                        if (direction === "from") {
                            $scope.fromTimeZone = $scope.timeZones.find(x => x.displayName === data);
                            $scope.booking.pickupTimeZone = $scope.fromTimeZone;
                            if ($scope.booking.deliverByTimeZone == null) {
                                $scope.booking.deliverByTimeZone = $scope.fromTimeZone;
                            };
                        } else {
                            $scope.toTimeZone = $scope.timeZones.find(x => x.displayName === data);
                            $scope.booking.deliverByTimeZone = $scope.toTimeZone;
                        }
                        $scope.setCurrentTime();
                    } else {
                        $rootScope.showNotification("Error getting Time Zone from GPS", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting Time Zone from GPS", "fa-exclamation");
                });
        };

        $scope.getTimeZones = function () {
            homesService.getTimeZones()
                .then(function (data) {
                    if (data.success) {
                        $scope.timeZones = data.timeZones;
                    } else {
                        $rootScope.showNotification("Error getting time zones", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting time zones", "fa-exclamation");
                });
        };

        $scope.getCountryCode = function () {
            homesService.getCountryCode()
                .then(function (data) {
                    if (data) {
                        $scope.countryCode = data;
                        $scope.setCountryCodeOptions();
                    } else {
                        $rootScope.showNotification("Error getting country code", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting country code", "fa-exclamation");
                });
        };

        /* --- Map Scheiße --- */

        $scope.$watch('booking.fromDetails', function (newValue, oldValue, scope) {
            setTimeout(function () {
                if ($scope.booking && $scope.booking.fromSearch && $scope.booking.fromDetails) {
                    if ($scope.booking.fromDetails.geometry && $scope.booking.fromDetails.address_components) {
                        //Google maps geocoding
                        if ($scope.booking.fromDetails.geometry.location) {
                            $scope.booking.fromLat = typeof $scope.booking.fromDetails.geometry.location.lat == "number" ? $scope.booking.fromDetails.geometry.location.lat : $scope.booking.fromDetails.geometry.location.lat();
                            $scope.booking.fromLong = typeof $scope.booking.fromDetails.geometry.location.lng == "number" ? $scope.booking.fromDetails.geometry.location.lng : $scope.booking.fromDetails.geometry.location.lng();

                            $scope.getHereFromMarker();
                            $scope.getTimeZoneFromGPS("from");
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("postal_code"))) {
                            $scope.booking.fromZipCode = $scope.booking.fromDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.booking.fromZipCode = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("street_number"))) {
                            $scope.booking.fromStreetNum = $scope.booking.fromDetails.address_components.find(x => x.types.includes("street_number")).long_name;
                        } else {
                            $scope.booking.fromStreetNum = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("route"))) {
                            $scope.booking.fromStreetName = $scope.booking.fromDetails.address_components.find(x => x.types.includes("route")).long_name;
                        } else {
                            $scope.booking.fromStreetName = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("sublocality"))) {
                            $scope.booking.fromCity = $scope.booking.fromDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.booking.fromCity = $scope.booking.fromDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.booking.fromCity = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality"))) {
                            $scope.booking.fromState = $scope.booking.fromDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality")).long_name;
                        } else {
                            $scope.booking.fromState = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("subpremise"))) {
                            $scope.booking.fromSubpremise = $scope.booking.fromDetails.address_components.find(x => x.types.includes("subpremise")).long_name;
                        } else {
                            $scope.booking.fromSubpremise = null;
                        }

                        $scope.booking.fromStreetAddress = ($scope.booking.fromSubpremise ? $scope.booking.fromSubpremise + "/" : "") + ($scope.booking.fromStreetNum ? $scope.booking.fromStreetNum + " " : "") + ($scope.booking.fromStreetName ? $scope.booking.fromStreetName : "");

                        // Fill the selected address
                        $scope.booking.fromSearch = $scope.booking.fromStreetAddress + ($scope.booking.fromCity ? ", " + $scope.booking.fromCity : ", ")
                            + ($scope.booking.fromState ? ", " + $scope.booking.fromState : ", ") + ($scope.booking.fromZipCode ? ", " + $scope.booking.fromZipCode : ", ");

                        if ($scope.booking.savedBookingSet && $scope.booking.fromStreetAddress.includes($scope.booking.savedBooking.fromAddressStreetName) && $scope.checkFromCompanyName()) {
                            //from company already set in saved booking
                        } else if ($scope.checkFromCompanyName()) {
                            //from company already set initially
                        } else if ($scope.booking.originalFromCompany && $scope.booking.originalFromCompany === $scope.booking.toCompanyName && $scope.checkFromCompanyName()) {
                            //addresses swapped
                        } else if ($scope.fromAddressBookCompanySaved) {
                            //from company set by address book
                        } else {
                            //new company name
                            $scope.booking.fromCompanyName = $scope.checkCompanyNameMatch($scope.booking.fromDetails.name, $scope.booking.fromStreetAddress) ? $scope.booking.fromDetails.name : null;
                        }

                        $scope.booking.fromDeliveryAddress = $scope.booking.fromDetails.formatted_address;

                    }

                    if ($scope.booking.savedBookingSet && $scope.booking.savedBooking.toAddressStreetName && $scope.booking.savedBooking.toCity && $scope.checkFromSavedBookingAddress()) {
                        $scope.fromTimeStamp = new Date();
                    }

                    if ($scope.booking.fromLat && $scope.booking.toLat && ($scope.booking.fromLat != $scope.booking.toLat)) {
                        //Need special case for drawing route lines when both addresses set simultaneously (saved booking)
                        if ($scope.booking.savedBookingSet && $scope.booking.savedBooking.toAddressStreetName && $scope.booking.savedBooking.toCity && $scope.checkFromSavedBookingAddress()) {
                            if ($scope.toTimeStamp != null) {
                                $scope.drawRouteLine();
                                $scope.fromTimeStamp = null;
                                $scope.toTimeStamp = null;
                            }
                        } else {
                            $scope.drawRouteLine();
                        }

                        $scope.checkDefaultPackageSize();
                        $scope.checkIfRatesReady();
                        $scope.findJobType();
                    }
                } else {
                    $scope.booking.fromLat = null;
                    $scope.booking.fromLong = null;

                    $scope.removeHereFromMarker();
                }

                $scope.$apply();
            }, 1000);
        });

        $scope.checkFromCompanyName = function () {
            return $scope.booking.fromDetails.name !== $scope.booking.fromCompanyName && typeof ($scope.booking.fromDetails.name) === "undefined";
        };

        $scope.checkFromSavedBookingAddress = function () {
            return $scope.booking.savedBooking.fromAddressStreetName == null || ($scope.booking.savedBooking.fromAddressStreetName.includes($scope.booking.fromStreetNum) && $scope.booking.savedBooking.toAddressStreetName.includes($scope.booking.fromStreetName)) || ($scope.booking.client.address.includes($scope.booking.fromStreetNum) && $scope.booking.client.address.includes($scope.booking.fromStreetName));
        };

        $scope.$watch('booking.toDetails', function (newValue, oldValue, scope) {
            setTimeout(function () {
                if ($scope.booking && $scope.booking.toSearch && $scope.booking.toDetails) {
                    if ($scope.booking.toDetails.geometry && $scope.booking.toDetails.address_components) {
                        if ($scope.booking.toDetails.geometry.location) {
                            $scope.booking.toLat = typeof $scope.booking.toDetails.geometry.location.lat == "number" ? $scope.booking.toDetails.geometry.location.lat : $scope.booking.toDetails.geometry.location.lat();
                            $scope.booking.toLong = typeof $scope.booking.toDetails.geometry.location.lng == "number" ? $scope.booking.toDetails.geometry.location.lng : $scope.booking.toDetails.geometry.location.lng();

                            $scope.getHereToMarker();
                            $scope.getTimeZoneFromGPS("to");
                        }

                        // get postcode
                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("postal_code"))) {
                            $scope.booking.toZipCode = $scope.booking.toDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.booking.toZipCode = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("street_number"))) {
                            $scope.booking.toStreetNum = $scope.booking.toDetails.address_components.find(x => x.types.includes("street_number")).long_name;
                        } else {
                            $scope.booking.toStreetNum = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("route"))) {
                            $scope.booking.toStreetName = $scope.booking.toDetails.address_components.find(x => x.types.includes("route")).long_name;
                        } else {
                            $scope.booking.toStreetName = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("sublocality"))) {
                            $scope.booking.toCity = $scope.booking.toDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.booking.toDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.booking.toCity = $scope.booking.toDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.booking.toCity = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality"))) {
                            $scope.booking.toState = $scope.booking.toDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality")).long_name;
                        } else {
                            $scope.booking.toState = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("subpremise"))) {
                            $scope.booking.toSubpremise = $scope.booking.toDetails.address_components.find(x => x.types.includes("subpremise")).long_name;
                        } else {
                            $scope.booking.toSubpremise = null;
                        }

                        $scope.booking.toStreetAddress = ($scope.booking.toSubpremise ? $scope.booking.toSubpremise + "/" : "") + ($scope.booking.toStreetNum ? $scope.booking.toStreetNum + " " : "") + ($scope.booking.toStreetName ? $scope.booking.toStreetName : "");

                        // Fill the selected address
                        $scope.booking.toSearch = $scope.booking.toStreetAddress + ($scope.booking.toCity ? ", " + $scope.booking.toCity : ", ")
                            + ($scope.booking.toState ? ", " + $scope.booking.toState : ", ") + ($scope.booking.toZipCode ? ", " + $scope.booking.toZipCode : ", ");

                        if ($scope.booking.savedBookingSet && $scope.booking.toStreetAddress.includes($scope.booking.savedBooking.toAddressStreetName) && $scope.checkToCompanyName()) {
                            //to company already set in saved booking
                        } else if ($scope.booking.originalFromCompany && $scope.booking.originalFromCompany === $scope.booking.toCompanyName && $scope.checkToCompanyName()) {
                            //addresses swapped
                        } else if ($scope.toAddressBookCompanySaved) {
                            //to company set by address book
                        } else {
                            //new company name
                            $scope.booking.toCompanyName = $scope.checkCompanyNameMatch($scope.booking.toDetails.name, $scope.booking.toStreetAddress) ? $scope.booking.toDetails.name : null;
                        }

                        $scope.booking.toDeliveryAddress = $scope.booking.toDetails.formatted_address;

                    }

                    if ($scope.booking.savedBookingSet && $scope.booking.savedBooking.toAddressStreetName && $scope.booking.savedBooking.toCity && $scope.checkToSavedBookingAddress()) {
                        $scope.toTimeStamp = new Date();
                    }

                    if ($scope.booking.fromLat && $scope.booking.toLat && ($scope.booking.fromLat != $scope.booking.toLat)) {
                        //Need special case for drawing route lines when both addresses set simultaneously (saved booking)
                        if ($scope.booking.savedBookingSet && $scope.booking.savedBooking.toAddressStreetName && $scope.booking.savedBooking.toCity && $scope.checkToSavedBookingAddress()) {
                            if ($scope.fromTimeStamp != null) {
                                $scope.drawRouteLine();
                                $scope.fromTimeStamp = null;
                                $scope.toTimeStamp = null;
                            }
                        } else {
                            $scope.drawRouteLine();
                        }

                        $scope.checkDefaultPackageSize();
                        $scope.checkIfRatesReady();
                        $scope.findJobType();
                    }
                } else {
                    $scope.booking.toLat = null;
                    $scope.booking.toLong = null;

                    $scope.removeHereToMarker();
                }

                $scope.$apply();
            }, 1000);
        });

        $scope.checkToCompanyName = function () {
            return $scope.booking.toDetails.name !== $scope.booking.toCompanyName && typeof ($scope.booking.toDetails.name) === "undefined";
        };

        $scope.checkToSavedBookingAddress = function () {
            return $scope.booking.savedBooking.toAddressStreetName.includes($scope.booking.toStreetNum) && $scope.booking.savedBooking.toAddressStreetName.includes($scope.booking.toStreetName);
        };

        $scope.checkDefaultPackageSize = function () {
            if ($scope.booking.fromState != $scope.booking.toState && $scope.lastAddressChange == 'local') {
                $scope.lastAddressChange = 'regional';
            } else if ($scope.booking.fromState != $scope.booking.toState && $scope.lastAddressChange == 'regional') {
                //Do nothing
            } else {
                $scope.lastAddressChange = 'local';
            };
        };

        $scope.checkCompanyNameMatch = function (bookingName, companyName) {
            var splitBookingName = bookingName ? bookingName.split(" ") : [""];
            var splitCompanyName = companyName ? companyName.split(" ") : [""];

            if (splitBookingName.length < 2 || splitBookingName.length != splitCompanyName.length) {
                return true;
            } else {
                var count = 0;
                for (i in splitBookingName) {
                    if (splitBookingName[i].substring(0, 1) === splitCompanyName[i].substring(0, 1)) {
                        count += 1;
                    }
                }
                if (count === splitBookingName.length) {
                    return false;
                } else {
                    return true;
                }
            }
        };

        $scope.setCountryCodeOptions = function () {
            $scope.fromAutocompleteOptions = {
                watchEnter: true,
                country: $scope.countryCode
            };
            $scope.toAutocompleteOptions = {
                watchEnter: true,
                country: $scope.countryCode
            };
            if ($scope.countryCode == 'US') {
                $scope.toAutocompleteOptions.country = 'US,CA';
                $scope.mapCenter = { lat: 40.711722, lng: -74.006513 };
                $scope.currencyCode = 'US';
                $scope.weightUnit = 'lb';
                $scope.dimsUnit = 'in';
                $scope.cubicUnit = 'F³';
            } else {
                $scope.mapCenter = { lat: -36.850657, lng: 174.764660 };
                $scope.currencyCode = 'NZ';
                $scope.weightUnit = 'kg';
                $scope.dimsUnit = 'cm';
                $scope.cubicUnit = 'M³';
            };
        }

        /* --- Here Maps Functions --- */

        $scope.getHereMap = function () {
            var platform = new H.service.Platform({
                'apikey': 'KedIcK-HWes4X4mqtK64i4jrxTkD7tAWfJdLCXwGPD8'
            });
            $scope.platform = platform;

            const engineType = H.Map.EngineType['HARP'];

            // Obtain the default map types from the platform object:
            var defaultLayers = platform.createDefaultLayers({ engineType });

            // Instantiate (and display) a map object:
            var map = new H.Map(
                document.getElementById('mapContainer'),
                defaultLayers.raster.normal.map,
                {
                    zoom: 14,
                    center: { lat: -36.850657, lng: 174.764660 },
                    engineType: engineType
                });

            window.addEventListener('resize', () => map.getViewPort().resize());

            var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
            var ui = H.ui.UI.createDefault(map, defaultLayers);
            ui.removeControl('zoom');

            $scope.map = map;

            // disable fractional zooming for Behavior
            behavior.disable(H.mapevents.Behavior.Feature.FRACTIONAL_ZOOM);

            // add H.ui.ZoomControl with the disabled fractional zooming
            var zoomControl = new H.ui.ZoomControl({ fractionalZoom: false });
            ui.addControl('zoom', zoomControl);
        };

        $scope.getHereFromMarker = function () {
            //Creates here maps marker if it doesn't exist, otherwise updates marker location
            if (!$scope.fromMarker) {
                var fromPoint = new H.geo.Point($scope.booking.fromLat, $scope.booking.fromLong);
                var icon = new H.map.Icon("https://img.icons8.com/ios-filled/50/39e75f/marker.png", { size: { w: 50, h: 50 } });
                var fromMarker = new H.map.Marker(fromPoint, { icon: icon });
                $scope.fromMarker = fromMarker;
                $scope.map.addObject(fromMarker);

                //Center map on marker if only one of to/from
                if (!$scope.toMarker) {
                    $scope.map.setCenter({ lat: $scope.booking.fromLat, lng: $scope.booking.fromLong });
                };
            } else {
                $scope.fromMarker.setGeometry(new H.geo.Point($scope.booking.fromLat, $scope.booking.fromLong));

                //Center map on marker if only one of to/from
                if (!$scope.toMarker) {
                    $scope.map.setCenter({ lat: $scope.booking.fromLat, lng: $scope.booking.fromLong });
                };
            }
        };

        $scope.getHereToMarker = function () {
            //Creates here maps marker if it doesn't exist, otherwise updates marker location
            if (!$scope.toMarker) {
                var toPoint = new H.geo.Point($scope.booking.toLat, $scope.booking.toLong);
                var icon = new H.map.Icon("https://img.icons8.com/ios-filled/50/ff6863/marker.png", { size: { w: 50, h: 50 } });
                var toMarker = new H.map.Marker(toPoint, { icon: icon });
                $scope.toMarker = toMarker;
                $scope.map.addObject(toMarker);

                //Center map on marker if only one of to/from
                if (!$scope.fromMarker) {
                    $scope.map.setCenter({ lat: $scope.booking.toLat, lng: $scope.booking.toLong });
                };
            } else {
                $scope.toMarker.setGeometry(new H.geo.Point($scope.booking.toLat, $scope.booking.toLong));

                //Center map on marker if only one of to/from
                if (!$scope.fromMarker) {
                    $scope.map.setCenter({ lat: $scope.booking.toLat, lng: $scope.booking.toLong });
                };
            }
        };

        $scope.centerHereMap = function () {
            var totalLat = $scope.booking.fromLat + $scope.booking.toLat;
            var totalLong = $scope.booking.fromLong + $scope.booking.toLong;
            var diffLong = Math.abs($scope.booking.fromLong - $scope.booking.toLong);
            var centerLat = totalLat / 2;
            var centerLong = totalLong / 2 - (diffLong * 0.3); //Placeholder value to skew map slightly onto right side

            $scope.map.setCenter({ lat: centerLat, lng: centerLong });
        };

        $scope.drawRouteLine = function (flight = false) {
            var routingParameters = {
                routingMode: 'fast',
                transportMode: 'car',
                origin: $scope.booking.fromLat + ',' + $scope.booking.fromLong,
                destination: $scope.booking.toLat + ',' + $scope.booking.toLong,
                return: 'polyline'
            };

            if ($scope.routeLine) {
                $scope.map.removeObjects([$scope.fromMarker, $scope.toMarker]);
                $scope.removeObjectById('route');
            } else {
                $scope.map.removeObjects([$scope.fromMarker, $scope.toMarker]);
            };

            if (flight) {
                // Create a linestring to use as a point source for the route line and add start and end points with curved line
                const lineString = new H.geo.LineString();
                const startPoint = { lat: $scope.booking.fromLat, lng: $scope.booking.fromLong };
                const endPoint = { lat: $scope.booking.toLat, lng: $scope.booking.toLong };

                const curvePoints = $scope.createCurvedPath(startPoint, endPoint, 0.1);

                curvePoints.forEach(point => {
                    lineString.pushPoint(point);
                });

                var curvedLine = new H.map.Polyline(lineString, {
                    style: { strokeColor: 'black', lineWidth: 3 }
                });

                curvedLine.id = 'route';
                $scope.routeLine = curvedLine;

                // Add the route polyline:
                $scope.map.addObject(curvedLine);

                // Add the two markers to the map:
                $scope.map.addObjects([$scope.fromMarker, $scope.toMarker]);

                // Set the map's viewport to make the whole route visible:
                $scope.map.getViewModel().setLookAtData({ bounds: $scope.routeLine.getBoundingBox() });

                // Center the map
                $scope.centerHereMap();
            } else {
                // Define a callback function to process the routing response:
                var onResult = function (result) {
                    // ensure that at least one route was found
                    if (result.routes.length) {
                        result.routes[0].sections.forEach((section) => {
                            // Create a linestring to use as a point source for the route line
                            let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                            // Create a polyline to display the route:
                            let routeLine = new H.map.Polyline(linestring, {
                                style: { strokeColor: 'black', lineWidth: 3 }
                            });

                            routeLine.id = 'route';
                            $scope.routeLine = routeLine;

                            // Add the route polyline (potentially multiple parts):
                            $scope.map.addObject(routeLine);
                        });

                        // Add the two markers to the map:
                        $scope.map.addObjects([$scope.fromMarker, $scope.toMarker]);

                        if (result.routes[0].sections.length > 1) {
                            // Make a group so bounding box fits for south island (multiple route lines)
                            var group = new H.map.Group();
                            var group1 = new H.map.Marker({ lat: $scope.booking.fromLat, lng: $scope.booking.fromLong });
                            var group2 = new H.map.Marker({ lat: $scope.booking.toLat, lng: $scope.booking.toLong });
                            group.addObjects([group1, group2]);

                            // Set the map's viewport to make the whole route visible:
                            $scope.map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() });
                        } else {
                            // Set the map's viewport to make the whole route visible:
                            $scope.map.getViewModel().setLookAtData({ bounds: $scope.routeLine.getBoundingBox() });
                        }

                        // Center the map
                        $scope.centerHereMap();
                    }
                }
            };

            // Get an instance of the routing service version 8:
            var router = $scope.platform.getRoutingService(null, 8);

            // Call calculateRoute() with the routing parameters,
            // the callback and an error callback function (called if a
            // communication error occurs):
            router.calculateRoute(routingParameters, onResult,
                function (error) {
                    alert(error.message);
                });
        };

        // Function to create a curved path between two points
        $scope.createCurvedPath = function (startPoint, endPoint, curvature = 0.5) {
            // Calculate control point for the curve (perpendicular to the line)
            const dx = endPoint.lng - startPoint.lng;
            const dy = endPoint.lat - startPoint.lat;

            // Midpoint
            const midPoint = {
                lat: startPoint.lat + dy * 0.5,
                lng: startPoint.lng + dx * 0.5
            };

            // Calculate perpendicular offset for control point
            const offset = {
                lat: -dx * curvature,
                lng: dy * curvature
            };

            // Control point
            const controlPoint = {
                lat: midPoint.lat + offset.lat,
                lng: midPoint.lng + offset.lng
            };

            // Generate points along the quadratic Bézier curve
            const curvePoints = [];
            const steps = 30; // Number of points along the curve

            for (let t = 0; t <= 1; t += 1 / steps) {
                // Quadratic Bézier formula: B(t) = (1-t)^2*P0 + 2(1-t)tP1 + t^2*P2
                const lat = Math.pow(1 - t, 2) * startPoint.lat +
                    2 * (1 - t) * t * controlPoint.lat +
                    Math.pow(t, 2) * endPoint.lat;

                const lng = Math.pow(1 - t, 2) * startPoint.lng +
                    2 * (1 - t) * t * controlPoint.lng +
                    Math.pow(t, 2) * endPoint.lng;

                curvePoints.push({ lat: lat, lng: lng });
            }

            return curvePoints;
        };

        $scope.removeHereFromMarker = function () {
            //removes from marker if only 1 marker, otherwise removes marker & line and re-centers remaining marker
            if ($scope.fromMarker) {
                if (!$scope.routeLine) {
                    $scope.map.removeObject($scope.fromMarker);
                    $scope.fromMarker = null;
                    $scope.map.setCenter({ lat: -36.850657, lng: 174.764660 });
                } else {
                    $scope.map.removeObject($scope.fromMarker);
                    $scope.removeObjectById('route');
                    $scope.fromMarker = null;
                    $scope.routeLine = null;
                    $scope.getHereToMarker();
                }
            }
        };

        $scope.removeHereToMarker = function () {
            //removes from marker if only 1 marker, otherwise removes marker & line and re-centers remaining marker
            if ($scope.toMarker) {
                if (!$scope.routeLine) {
                    $scope.map.removeObject($scope.toMarker);
                    $scope.toMarker = null;
                    $scope.map.setCenter({ lat: -36.850657, lng: 174.764660 });
                } else {
                    $scope.map.removeObject($scope.toMarker)
                    $scope.removeObjectById('route');
                    $scope.toMarker = null;
                    $scope.routeLine = null;
                    $scope.getHereFromMarker();
                }
            }
        };

        $scope.removeObjectById = function (id) {
            for (object of $scope.map.getObjects()) {
                if (object.id === id) {
                    $scope.map.removeObject(object);
                }
            }
        };

        /* --- Google maps functions --- */

        /*NgMap.getMap().then(function (map) {
            $scope.map = map;
            if (map.markers && map.markers.length > 0) {
                $scope.marker = map.markers[0];
            };
        });

        $scope.getPath = function () {
            $scope.path = [[$scope.booking.fromLat, $scope.booking.fromLong], [$scope.booking.toLat, $scope.booking.toLong]];
        };

        $scope.centerMap = function () {
            var totalLat = $scope.booking.fromLat + $scope.booking.toLat;
            var totalLong = $scope.booking.fromLong + $scope.booking.toLong;
            var diffLong = Math.abs($scope.booking.fromLong - $scope.booking.toLong);
            $scope.booking.centerLat = totalLat / 2;
            $scope.booking.centerLong = totalLong / 2 - (diffLong * 0.3); //Placeholder value to skew map slightly onto right side (aim for 0.01 for central)
            $scope.zoomMap();
        };

        $scope.zoomMap = function () { //Make map zoom out to fit the markers
            var bounds = new google.maps.LatLngBounds();
            var firstMarker = new google.maps.LatLng($scope.booking.fromLat, $scope.booking.fromLong);
            var secondMarker = new google.maps.LatLng($scope.booking.toLat, $scope.booking.toLong);
            bounds.extend(firstMarker);
            bounds.extend(secondMarker);
            $scope.map.fitBounds(bounds);
        };*/

        /* --- Validation Scheiße --- */

        $scope.focusField = function (redId, focusId = null) {
            $scope.redField = redId;
            $scope.previousBorder = document.getElementById(redId).style.border;
            setTimeout(function () {
                document.getElementById(redId).style.border = "2px solid red";
                document.getElementById(focusId ?? redId).focus();
            }, 100);
        };

        $scope.resetBorder = function () {
            if (document.getElementById($scope.redField)) {
                document.getElementById($scope.redField).style.border = $scope.previousBorder;
            }
            $scope.previousBorder = null;
            $scope.redField = null;
        };

        $scope.checkCreditCard = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.creditCard.errors = [];

                if ($scope.isCreditCardClient()) {
                    if ($scope.booking.clientContact.name == "Enter Your Name Here") {
                        $scope.creditCard.errors.push("You must supply a valid name.");
                        $scope.focusField("creditCardNameBorder", "creditCardName");
                        $(".loading").fadeOut();
                        return;
                    }

                    if (!$scope.booking.clientContact.email.includes("@") || !$scope.booking.clientContact.email.includes(".")) {
                        $scope.creditCard.errors.push("You must supply a valid email.");
                        $scope.focusField("creditCardEmailBorder", "creditCardEmail");
                        $(".loading").fadeOut();
                        return;
                    }
                }

                $scope.setClient();
            } catch (e) {
                console.log(e);
                $scope.creditCard.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkTimeData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.time.errors = [];

                if (!$scope.booking.deliveryDate) {
                    $scope.time.errors.push("Ready Date is required");
                    $scope.focusField("readyDateBorder", "readyDate");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate > $scope.dateMaxDate) {
                    $scope.time.errors.push("Ready Date must be within the given range");
                    $scope.focusField("readyDateBorder", "readyDate");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate < $scope.currDate) {
                    $scope.time.errors.push("Ready Date must not be in the past");
                    $scope.focusField("readyDateBorder", "readyDate");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.deliveryTime) {
                    $scope.time.errors.push("Ready Time is required");
                    $scope.focusField("readyTimeBorder", "readyTime");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate.getHours() == $scope.currDate.getHours() && $scope.booking.deliveryTime < $scope.currTime) {
                    $scope.time.errors.push("Ready Time must not be in the past");
                    $scope.focusField("readyTimeBorder", "readyTime");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryTime.getHours() < 6 || $scope.booking.deliveryTime.getHours() >= 19) {
                    $scope.time.errors.push("Ready Time must be between 6am and 7pm");
                    $scope.focusField("readyTimeBorder", "readyTime");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.timeSaved = true;
                $scope.checkIfRatesReady();
                $scope.setStep("address");
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.time.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkSizeData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.size.errors = [];

                if ($scope.isManualQuantity == false && !$scope.booking.stockSize) {
                    $scope.size.errors.push("Package Size is required while in 'standard'");
                    $scope.focusField("packageSize");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity == true && (!$scope.booking.manualQuantity && !$scope.booking.basicQuantity)) {
                    $scope.size.errors.push("Custom Dimensions are required while in 'custom'");
                    $scope.focusField("customTable");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity == true && ($scope.booking.manualQuantity.length < 1 && $scope.booking.basicQuantity.length < 1)) {
                    $scope.size.errors.push("At least 1 row must be entered in custom dimensions while in 'custom'");
                    $scope.focusField("customTable");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity == true && (($scope.booking.manualQuantity.length >= 1 && $scope.checkManualQuantity() == false) || ($scope.booking.basicQuantity.length >= 1 && $scope.checkBasicQuantity() == false))) {
                    $scope.size.errors.push("None of the 'custom dimensions' fields may be blank or less than zero");
                    $scope.focusField("customTable");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity) {
                    $scope.booking.stockSize = null;
                    $scope.booking.quantity = 1;
                    $scope.sizeSaved = "manual";
                } else {
                    $scope.booking.manualQuantity = [{ length: null, width: null, height: null, weight: null, quantity: 1 }];
                    $scope.sizeSaved = "basic";
                }

                //Checking these DG fields incase user using saved booking and skips going to DG page
                if ($scope.booking.dangerousGoods == true && $scope.booking.dangerousGoodsClass == null) {
                    $scope.dangerousGoods.errors.push("DG class is required if sending dangerous goods");
                    $scope.focusField("dgModal");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.dangerousGoods == true && (typeof $scope.booking.dangerousGoodsDocs === "undefined" || $scope.booking.dangerousGoodsDocs == false)) {
                    $scope.dangerousGoods.errors.push("You must have documentation to send dangerous goods with us");
                    $scope.focusField("dgModal");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.checkIfRatesReady();
                $scope.setStep('address');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.size.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkDGData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.dangerousGoods.errors = [];

                if ($scope.booking.dangerousGoods == true && (typeof $scope.booking.dangerousGoodsDocs === "undefined" || $scope.booking.dangerousGoodsDocs == false)) {
                    $scope.dangerousGoods.errors.push("You must have documentation to send dangerous goods with us");
                    $scope.focusField("dgDocs");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.dangerousGoods == true && $scope.booking.dangerousGoodsClass == null) {
                    $scope.dangerousGoods.errors.push("DG class is required if sending dangerous goods");
                    $scope.focusField("dgClassBorder", "dgClass");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.dgSaved = true;

                $scope.setStep('size');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.dangerousGoods.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkTruckData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.truck.errors = [];

                if ($scope.booking.truck == true && $scope.booking.deliverTo == null) {
                    $scope.truck.errors.push("'Deliver to' is required for sending truck jobs");
                    $scope.focusField("deliverTo");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.truckSaved = true;

                $scope.setStep('size');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.dangerousGoods.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkFormData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.booking.errors = [];

                if (!$scope.booking.fromDetails) {
                    $scope.booking.errors.push("A valid From Address is required");
                    $scope.focusField("fromAddress", "fromBookingGpsSearch");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.toDetails) {
                    $scope.booking.errors.push("A valid To Address is required");
                    $scope.focusField("toAddress", "toBookingGpsSearch");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.deliveryDate) {
                    $scope.booking.errors.push("Ready Date is required");
                    $scope.focusField("timeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate < $scope.currDate) {
                    $scope.booking.errors.push("Ready Date must not be in the past");
                    $scope.focusField("timeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.deliveryTime) {
                    $scope.booking.errors.push("Ready Time is required");
                    $scope.focusField("timeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate.getTime() == $scope.currDate.getTime() && $scope.booking.deliveryTime < $scope.currTime) {
                    $scope.booking.errors.push("Ready Time must not be in the past");
                    $scope.focusField("timeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.sizeSaved) {
                    $scope.booking.errors.push("Delivery Size is required");
                    $scope.focusField("sizeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.sizeSaved == "basic" && !$scope.booking.stockSize) {
                    $scope.booking.errors.push("Delivery Size is required");
                    $scope.focusField("sizeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.sizeSaved == "manual" && $scope.checkManualQuantity() == false) {
                    $scope.booking.errors.push("Delivery Size is required");
                    $scope.focusField("sizeModal");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.selectedRate) {
                    $scope.booking.errors.push("You must select a service to continue");
                    $scope.focusField("speeds");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.selectedRate.speedId === 124 || $scope.booking.selectedRate.speedId === 125) { //Different time rules for chilled/frozen trucks
                    if ($scope.booking.deliveryTime.getHours() < 6 || $scope.booking.deliveryTime.getHours() >= 19) {
                        $scope.booking.errors.push("Ready Time must be between 6am and 7pm for chilled/frozen trucks");
                        $scope.focusField("timeModal");
                        $(".loading").fadeOut();
                        return;
                    }
                } else {
                    if ($scope.booking.truck === true && ($scope.booking.deliveryTime.getHours() < 7 || ($scope.booking.deliveryTime.getHours() == 7 && $scope.booking.deliveryTime.getMinutes() < 30) || $scope.booking.deliveryTime.getHours() >= 17)) {
                        $scope.booking.errors.push("Ready Time for trucks must be between 7:30am and 5pm");
                        $scope.focusField("timeModal");
                        $(".loading").fadeOut();
                        return;
                    }
                }

                $scope.setContactDetails();
                $scope.booking.sigNotRequired = $scope.booking.client.sigRequiredDefault;
                $scope.checkIfReferencesNeeded();
                $scope.setStep("extraInfo");
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.booking.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkTrackingData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.extraInfo.errors = [];

                if ($scope.podShow('email') && !$scope.booking.podEmail) {
                    $scope.extraInfo.errors.push("A valid Tracking Email is required");
                    $scope.focusField("trackingEmailBorder", "trackingEmail");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.podShow('mobile') && !$scope.booking.podMobile) {
                    $scope.extraInfo.errors.push("A valid Tracking Mobile is required");
                    $scope.focusField("trackingMobileBorder", "trackingMobile");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.setStep('extraInfoContact');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.extraInfo.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkContactData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.extraInfoContact.errors = [];

                if (!$scope.booking.pickupContact) {
                    $scope.extraInfoContact.errors.push("A valid Pickup Contact Name is required");
                    $scope.focusField("pickupContactBorder", "pickupContact");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.sigNotRequired == "Other (add to 'Delivery Notes')" && !$scope.booking.deliveryNotes) {
                    $scope.extraInfoContact.errors.push("'Signature not required' specifics are required in 'Delivery Notes'");
                    $scope.focusField("deliveryNotesBorder", "deliveryNotes");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.setStep('extraInfoReferences');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.extraInfoContact.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkReferenceData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.extraInfoReferences.errors = [];

                if ($scope.booking.client.referenceAMandatory && !$scope.booking.clientRefA) {
                    $scope.extraInfoReferences.errors.push("A valid Client Reference A is required");
                    if ($scope.booking.client.referenceADefineList) {
                        $scope.focusField("clientRefASelectBorder", "clientRefASelect");
                    } else {
                        $scope.focusField("clientRefAInputBorder", "clientRefAInput");
                    }
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.client.referenceBMandatory && !$scope.booking.clientRefB) {
                    $scope.extraInfoReferences.errors.push("A valid Client Reference B is required");
                    if ($scope.booking.client.referenceBDefineList) {
                        $scope.focusField("clientRefBSelectBorder", "clientRefBSelect");
                    } else {
                        $scope.focusField("clientRefBInputBorder", "clientRefBInput");
                    }
                    $(".loading").fadeOut();
                    return;
                }

                $scope.setStep('bookingConfirmation');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.extraInfoReferences.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkConfirmation = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                $scope.confirmation.errors = [];

                /* Add confirmation checking scheiße here */

                $scope.jobLoading = true;
                $scope.getJobData();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.confirmation.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        /* --- General Scheiße --- */

        $scope.setStep = function (label) {
            if (label == 'time' && !$scope.timeSaved) {
                $scope.setCurrentTime();
            }
            $scope.step = label;
        };

        $scope.clearAll = function () {
            $scope.resetAll();
            $scope.clearSaved();
            $scope.getSavedJobs();
            $scope.setStep('client');
        };

        $scope.openNewTab = function (url) {
            window.open(url, '_blank');
        };

        /* --- Client Scheiße --- */

        $scope.setInitialStep = function () {
            if ($scope.clients.length > 1) {
                $scope.booking.client = $scope.clients.find(x => x.defaultClient == 1);
                $scope.setInternal();
                if ($scope.booking.client != null) {
                    $scope.initClient('all');
                }
                $scope.setStep('client');
            } else {
                $scope.booking.client = $scope.clients[0];
                $scope.internal = $scope.clients[0].internal;
                $scope.initClient('all');
                $scope.setStep('client');
            };
            //Hides old booking if stripe
            $scope.setStripeState();
        };

        $scope.setClient = function () {
            $scope.stockSizes = $scope.booking.client.stockSizes;
            $scope.setSavedBooking();
            if (!$scope.booking.savedBookingSet) {
                $scope.setClientAddress();
                $scope.setClientContactDefaults();
            };

            //no address set for credit card
            if ($scope.isCreditCardClient() == true) {
                $scope.clearAddress("from");
            };

            $scope.sizeSaved = null;
            $scope.rates = null;

            $scope.getUrgentToken();
            $scope.setStep('address');
        };

        $scope.clientBack = function () {
            $scope.clearSavedBooking();
            $scope.resetContact();
            $scope.setStep('client');
        };

        $scope.initClient = function (all = null) {
            if (all === null) {
                $scope.setContact();
                $scope.getSpeeds();
                $scope.getSavedJobs();
                $scope.getVehicleSizes();
            } else {
                $scope.getThisClient();
            }
        };

        $scope.resetContact = function () {
            $scope.booking.pickupContact = null;
            $scope.booking.pickupPhone = null;
            $scope.booking.deliveryContact = null;
            $scope.booking.deliveryPhone = null;
            $scope.booking.podEmail = null;
            $scope.booking.podMobile = null;
        };

        $scope.setContact = function () {
            if ($scope.booking.client.contacts.length == 1) {
                $scope.booking.clientContact = $scope.booking.client.contacts[0];
            }

            for (i in $scope.booking.client.contacts) {
                if ($scope.booking.client.contacts[i].id == $scope.booking.client.loggedInContactId) {
                    $scope.booking.clientContact = $scope.booking.client.contacts[i];
                }
            }
        };

        $scope.setClientAddress = function () {
            $scope.booking.fromSearch = $scope.booking.client.address;
            $scope.booking.fromCompanyName = $scope.booking.client.name;
            $scope.booking.fromExtra = $scope.booking.client.addressExtras;
            $scope.booking.pickupNotes = $scope.booking.client.extraInfo;
            $scope.getGeocodeData($scope.booking.client.address.replaceAll(" ", "+"), $scope.booking.client.suburb.replaceAll(" ", "+"), 'first');
            $scope.clientAddressDirection = "from";
        };

        $scope.setClientContactDefaults = function () {
            //jobSize
            if ($scope.vehicleSizes != null && $scope.vehicleSizes.length > 0) { //FIX ME BETTER 
                $scope.booking.vehicle = $scope.booking.clientContact.defaultJobSize ?
                    $scope.vehicleSizes.find(v => v.id === $scope.booking.clientContact.defaultJobSize) :
                    $scope.vehicleSizes.find(v => v.defaultForBooking === true);

                if ($scope.booking.clientContact.defaultJobSize
                    && $scope.vehicleSizes.find(v => v.id === $scope.booking.clientContact.defaultJobSize).name.toLowerCase().includes("truck")) {
                    //Set truck fields if truck is default
                    $scope.booking.truck = true;
                    $scope.truckSaved = true;
                }
            }

            $scope.booking.stockSize = $scope.booking.client.stockSizes.find((e) => e.id == $scope.booking.clientContact.defaultPackageSize);

            //tracking
            $scope.booking.proofOfDelivery = $scope.setProofOfDelivery($scope.booking.clientContact.defaultTrackingMethod);
            $scope.booking.podEmail = $scope.booking.clientContact.defaultTrackingEmail;
            $scope.booking.podMobile = $scope.booking.clientContact.defaultTrackingMobile;

            //hold
            $scope.booking.holdJob = $scope.booking.clientContact.holdJobs;
            $scope.timeSaved = $scope.booking.clientContact.holdJobs;

            //jobType
            if ($scope.booking.clientContact.defaultJobType === 2 && $scope.booking.toDetails == null) {
                $scope.booking.jobType = "DeliverToUs";
                $scope.swapToFromAddress();
                $scope.getGeocodeData($scope.booking.client.address.replaceAll(" ", "+"), $scope.booking.client.americanCity.replaceAll(" ", "+"), 'to');
                $scope.clientAddressDirection = "to";
            } else if ($scope.booking.clientContact.defaultJobType === 3 && $scope.booking.toDetails == null) {
                $scope.booking.jobType = "ThirdParty";
                $scope.clearAddress("from");
                $scope.booking.pickupContact = null;
                $scope.booking.pickupPhone = null;
                $scope.booking.pickupNotes = null;
                $scope.clientAddressDirection = "none";
           };

            //jobSpeed - chooses this or fastest non direct
            $scope.booking.presetSpeed = $scope.booking.clientContact.defaultJobSpeed;
        };

        $scope.setContactDetails = function () {
            $scope.booking.seePickupContactNotes = false;
            $scope.booking.seeDeliveryContactNotes = false;

            $scope.booking.pickupContact = $scope.booking.jobType == "Pickup" ? ($scope.booking.pickupContact ?? $scope.booking.clientContact.name) : $scope.booking.pickupContact;
            $scope.booking.pickupPhone = $scope.booking.jobType == "Pickup" ? ($scope.booking.pickupPhone ?? $scope.booking.clientContact.mobile) : $scope.booking.pickupPhone;

            $scope.booking.deliveryContact = $scope.booking.jobType == "DeliverToUs" ? ($scope.booking.deliveryContact ?? $scope.booking.clientContact.name) : $scope.booking.deliveryContact;
            $scope.booking.deliveryPhone = $scope.booking.jobType == "DeliverToUs" ? ($scope.booking.deliveryPhone ?? $scope.booking.clientContact.mobile) : $scope.booking.deliveryPhone;

            $scope.booking.podEmail = $scope.booking.podEmail ?? $scope.booking.clientContact.email;
            $scope.booking.podMobile = $scope.booking.podMobile ?? $scope.booking.clientContact.mobile;
        };

        $scope.isCreditCardClient = function () {
            if ($scope.booking.client) {
                return ($scope.booking.client.id == 9196 || $scope.booking.client.id == 35957 || $scope.booking.client.id == 11);
            } else {
                return false;
            }
        };

        $scope.creditCardSelectAll = function (id, value) {
            if (value.substring(0, 10).toLowerCase() === "enter your") {
                document.getElementById(id).select();
            }
        };

        $scope.creditCardDataFilled = function () {
            return !(($scope.booking.client.id == 9196 || $scope.booking.client.id == 35957) && (!$scope.booking.clientContact.name || !$scope.booking.clientContact.mobile || !$scope.booking.clientContact.email));
        };

        $scope.hideForCreditCard = function () {
            if ($scope.clients[0].id == 9196) {
                $state.current.data.hideForCreditCard = true;
            }
        };

        $scope.clearClient = function () {
            $scope.booking.client = null;
            $scope.booking.clientContact = null;
        };

        $scope.setInternal = function () {
            for (i in $scope.clients) {
                if ($scope.clients[i].baseClient === true) {
                    $scope.internal = $scope.clients[i].internal;
                }
            }
        };

        $scope.setStripeState = function () {
            for (i in $scope.clients) {
                if ($scope.clients[i].stripeClient === true) {
                    $state.current.data.hideOldPage = true;
                }
            }
        };

        $scope.realResults = function (input) {
            $scope.delayedClients = [];
            if (!input) {
                return $scope.delayedClients;
            } else if (input.length < 2) {
                return $scope.delayedClients;
            } else {
                $scope.delayedClients = $scope.allClients;
                return $scope.delayedClients;
            }
        };

        $scope.setSavedBooking = function () {
            if (!$scope.booking.savedBooking) {
                $scope.booking.savedBooking = {};
            } else {
                $scope.booking.savedBookingSet = true;
                $scope.booking.clientAddressGeocoded = true;
                $scope.booking.fromSearch = ($scope.booking.savedBooking.fromAddressStreetName ? $scope.booking.savedBooking.fromAddressStreetName + ", " : "") + ($scope.booking.savedBooking.fromSuburb ?? "");
                $scope.booking.fromCompanyName = $scope.booking.savedBooking.fromAddress;
                $scope.booking.fromExtra = $scope.booking.savedBooking.fromAddressExtras;
                $scope.booking.toSearch = ($scope.booking.savedBooking.toAddressStreetName ? $scope.booking.savedBooking.toAddressStreetName + ", " : "") + ($scope.booking.savedBooking.toSuburb ?? "");
                $scope.booking.toCompanyName = $scope.booking.savedBooking.toAddress;
                $scope.booking.toExtra = $scope.booking.savedBooking.toAddressExtras;
                $scope.booking.quantity = $scope.booking.savedBooking.quantity ?? 1;

                $scope.booking.dangerousGoods = $scope.booking.savedBooking.dgClass != null && $scope.booking.savedBooking.dgDocument == true;
                $scope.dgSaved = $scope.booking.savedBooking.dgClass != null && $scope.booking.savedBooking.dgDocument == true;
                $scope.booking.dangerousGoodsClass = $scope.booking.savedBooking.dgClass;
                $scope.booking.dangerousGoodsDocs = $scope.booking.savedBooking.dgDocument == 1 ? true : false; //saved as int in savedbookings table for some reason
                $scope.booking.pickupContact = $scope.booking.savedBooking.fromContact;
                $scope.booking.pickupPhone = $scope.booking.savedBooking.fromPhone;
                $scope.booking.deliveryContact = $scope.booking.savedBooking.toContact;
                $scope.booking.deliveryPhone = $scope.booking.savedBooking.toPhone;

                $scope.booking.clientRefA = $scope.booking.savedBooking.clientRefA;
                $scope.booking.clientRefB = $scope.booking.savedBooking.clientRefB;
                $scope.booking.clientNotes = $scope.booking.savedBooking.clientNotes;

                $scope.booking.proofOfDelivery = $scope.setProofOfDelivery($scope.booking.savedBooking.proofOfDelivery);
                $scope.booking.podEmail = $scope.booking.savedBooking.podEmail;
                $scope.booking.podMobile = $scope.booking.savedBooking.podMobile;

                if ($scope.booking.savedBooking.notes) {
                    $scope.booking.pickupNotes = $scope.booking.savedBooking.notes;
                    $scope.booking.deliveryNotes = $scope.booking.savedBooking.notes;
                } else {
                    $scope.booking.pickupNotes = "";
                    $scope.booking.deliveryNotes = "";
                };

                $scope.booking.pickupNotes += $scope.booking.savedBooking.fromAddressExtras2 ? $scope.booking.savedBooking.fromAddressExtras2 : "";
                $scope.booking.deliveryNotes += $scope.booking.savedBooking.toAddressExtras2 ? $scope.booking.savedBooking.toAddressExtras2 : "";

                if ($scope.booking.savedBooking.fromAddressStreetName && $scope.booking.savedBooking.fromSuburb) {
                    $scope.getGeocodeData($scope.booking.savedBooking.fromAddressStreetName ? $scope.booking.savedBooking.fromAddressStreetName.replaceAll(" ", "+") : "",
                        $scope.booking.savedBooking.fromSuburb ? $scope.booking.savedBooking.fromSuburb.replaceAll(" ", "+") : "", 'from');
                } else {
                    $scope.setClientAddress();
                }

                if ($scope.booking.savedBooking.toAddressStreetName && $scope.booking.savedBooking.toSuburb) {
                    $scope.getGeocodeData($scope.booking.savedBooking.toAddressStreetName ? $scope.booking.savedBooking.toAddressStreetName.replaceAll(" ", "+") : "",
                        $scope.booking.savedBooking.toSuburb ? $scope.booking.savedBooking.toSuburb.replaceAll(" ", "+") : "", 'to');
                } else {
                    $scope.booking.toSearch = null;
                }

                //$scope.booking.stockSize = $scope.stockSizes.find(x => x.id == $scope.booking.savedBooking.size);
                $scope.booking.presetSpeed = $scope.booking.savedBooking.speed;

                $scope.booking.truck = $scope.booking.savedBooking.truck;
                $scope.booking.vehicle = $scope.vehicleSizes.find(v => v.id === $scope.booking.savedBooking.size) || $scope.vehicleSizes.find(v => v.defaultForBooking === true);
                $scope.truckSaved = $scope.booking.savedBooking.truck;
                $scope.booking.tailLiftPickup = $scope.booking.savedBooking.truckTailliftPU;
                $scope.booking.tailLiftDropoff = $scope.booking.savedBooking.truckTailliftDO;
                $scope.booking.deliverTo = $scope.booking.savedBooking.truckPrivateResidence === 1 ? "Residential" : "Business";
            }
        };

        $scope.setProofOfDelivery = function (proofOfDelivery) {
            if (proofOfDelivery === 0) {
                return null;
            } else if (proofOfDelivery === 1) {
                return 'EMAIL';
            } else if (proofOfDelivery === 2) {
                return 'TEXT';
            } else if (proofOfDelivery === 3) {
                return 'EMAILANDTEXT';
            } else {
                return null;
            }
        };

        $scope.clearSavedBooking = function () {
            if ($scope.booking.savedBookingSet != true) {
                $scope.booking.savedBooking = null;
            } else {
                $scope.booking.savedBookingSet = false;
                $scope.booking.clientAddressGeocoded = false;
                $scope.booking.fromSearch = null;
                $scope.booking.fromCompanyName = null;
                $scope.booking.fromExtra = null;
                $scope.booking.toSearch = null;
                $scope.booking.toCompanyName = null;
                $scope.booking.toExtra = null;
                $scope.booking.quantity = 1;

                $scope.booking.dangerousGoods = null;
                $scope.dgSaved = null;
                $scope.booking.dangerousGoodsClass = null;
                $scope.booking.dangerousGoodsDocs = null;
                $scope.booking.pickupContact = null;
                $scope.booking.pickupPhone = null;
                $scope.booking.deliveryContact = null;
                $scope.booking.deliveryPhone = null;

                $scope.booking.clientRefA = null;
                $scope.booking.clientRefB = null;
                $scope.booking.clientNotes = null;

                $scope.booking.proofOfDelivery = "EMAILANDTEXT"; //default to email and text
                $scope.booking.podEmail = null;
                $scope.booking.podMobile = null;

                $scope.booking.pickupNotes = null;
                $scope.booking.deliveryNotes = null;

                $scope.booking.fromDetails = null;
                $scope.booking.toDetails = null;

                $scope.booking.stockSize = null;
                $scope.booking.presetSpeed = null;

                $scope.booking.truck = null;
                $scope.booking.vehicle = null;
                $scope.truckSaved = null;
                $scope.booking.tailLiftPickup = null;
                $scope.booking.tailLiftDropoff = null;
                $scope.booking.deliverTo = "Business";

                $scope.booking.savedBooking = null;
            }
        };

        $scope.updateOrCreateSavedBooking = function () {
            $scope.booking.newSavedBookingName = null;
            $('.savedBooking-modal').modal();
        };

        $scope.checkUpdateSavedBooking = function () {
            $rootScope.showPrompt("Confirm saved booking update", "This will update the saved booking with any new values from the current job booking.", function (params) {
                $scope.getSavedBookingData();

                $scope.updateSavedBooking();
            });
        };

        $scope.checkCreateSavedBooking = function () {
            if (!$scope.booking.newSavedBookingName) {
                $rootScope.showNotification("You must enter a name for this saved booking!", "fa-exclamation")
                return;
            }

            $rootScope.showPrompt("Confirm saved booking creation", "This will create a saved booking with the specified name and all values from the current job booking.", function (params) {
                $scope.getSavedBookingData();

                $scope.booking.savedBooking.name = $scope.booking.newSavedBookingName;

                $scope.createSavedBooking();
            });
        };

        $scope.getSavedBookingData = function () {
            $scope.booking.savedBooking.fromAddressStreetName = $scope.getStreetAddress('from');
            $scope.booking.savedBooking.fromSuburb = $scope.booking.fromCity ? $scope.booking.fromCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu
            $scope.booking.savedBooking.fromAddress = $scope.booking.fromCompanyName ?? $scope.getCompanyName("from");
            $scope.booking.savedBooking.fromAddressExtras = $scope.booking.fromExtra ?? null;
            $scope.booking.savedBooking.toAddressStreetName = $scope.getStreetAddress('to');
            $scope.booking.savedBooking.toSuburb = $scope.booking.toCity ? $scope.booking.toCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu
            $scope.booking.savedBooking.toAddress = $scope.booking.toCompanyName ?? $scope.getCompanyName("to");
            $scope.booking.savedBooking.toAddressExtras = $scope.booking.toExtra ?? null;
            $scope.booking.savedBooking.quantity = $scope.booking.quantity;

            $scope.booking.savedBooking.dgClass = $scope.booking.dangerousGoods ? $scope.booking.dangerousGoodsClass : null;
            $scope.booking.savedBooking.dgDocument = $scope.booking.dangerousGoods && $scope.booking.dangerousGoodsDocs == true ? 1 : null; //is an int in savedbooking DB for some reason
            $scope.booking.savedBooking.fromContact = $scope.booking.pickupContact ?? null;
            $scope.booking.savedBooking.fromPhone = $scope.booking.pickupPhone ?? null;
            $scope.booking.savedBooking.toContact = $scope.booking.deliveryContact ?? null;
            $scope.booking.savedBooking.toPhone = $scope.booking.deliveryPhone ?? null;

            $scope.booking.savedBooking.clientRefA = $scope.booking.clientRefA ?? null;
            $scope.booking.savedBooking.clientRefB = $scope.booking.clientRefB ?? null;
            $scope.booking.savedBooking.clientNotes = $scope.booking.clientNotes ?? null;

            $scope.booking.savedBooking.proofOfDelivery = $scope.getProofOfDelivery($scope.booking.proofOfDelivery);
            $scope.booking.savedBooking.podEmail = $scope.podShow("email") === true ? $scope.booking.podEmail : null;
            $scope.booking.savedBooking.podMobile = $scope.podShow("mobile") === true ? $scope.booking.podMobile : null;

            $scope.booking.savedBooking.fromAddressExtras2 = $scope.booking.pickupNotes ?? null;
            $scope.booking.savedBooking.toAddressExtras2 = $scope.booking.deliveryNotes ?? null;

            //$scope.booking.savedBooking.size = $scope.booking.stockSize ? $scope.booking.stockSize.id : null;
            $scope.booking.savedBooking.size = $scope.booking.vehicle.id;
            $scope.booking.savedBooking.speed = $scope.booking.selectedRate.speedId;

            $scope.booking.savedBooking.truck = $scope.booking.truck;
            $scope.booking.savedBooking.truckTailliftPU = $scope.booking.truck ? $scope.booking.tailLiftPickup : null;
            $scope.booking.savedBooking.truckTailliftDO = $scope.booking.truck ? $scope.booking.tailLiftDropoff : null;
            $scope.booking.savedBooking.truckPrivateResidence = $scope.booking.truck ? ($scope.booking.deliverTo == "Residential" ? true : false) : null;

            //Unused parts of savedBooking table
            /*$scope.booking.savedBooking.backupFromAddress = $scope.booking.savedBooking.backupFromAddress ?? null;
            $scope.booking.savedBooking.backupToAddress = $scope.booking.savedBooking.backupToAddress ?? null;
            $scope.booking.savedBooking.contact = $scope.booking.savedBooking.contact ?? null;
            $scope.booking.savedBooking.deactivated = $scope.booking.savedBooking.deactivated ?? null;
            $scope.booking.savedBooking.deliverToLeaveID = $scope.booking.savedBooking.deliverToLeaveID ?? null;
            $scope.booking.savedBooking.delivertoPrivateBusiness = $scope.booking.savedBooking.delivertoPrivateBusiness ?? null;
            $scope.booking.savedBooking.fromLat = $scope.booking.savedBooking.fromLat ?? null;
            $scope.booking.savedBooking.fromLong = $scope.booking.savedBooking.fromLong ?? null;
            $scope.booking.savedBooking.toLat = $scope.booking.savedBooking.toLat ?? null;
            $scope.booking.savedBooking.toLong = $scope.booking.savedBooking.toLong ?? null;
            $scope.booking.savedBooking.insertFromWS = $scope.booking.savedBooking.insertFromWS ?? null;
            $scope.booking.savedBooking.jobTab = $scope.booking.savedBooking.jobTab ?? null;
            $scope.booking.savedBooking.notes = $scope.booking.savedBooking.notes ?? null;
            $scope.booking.savedBooking.ourRef = $scope.booking.savedBooking.ourRef ?? null;
            $scope.booking.savedBooking.pallets = $scope.booking.savedBooking.pallets ?? null;
            $scope.booking.savedBooking.pickupFrom = $scope.booking.savedBooking.pickupFrom ?? null;
            $scope.booking.savedBooking.requiredDeliveryTime = $scope.booking.savedBooking.requiredDeliveryTime ?? null;
            $scope.booking.savedBooking.return = $scope.booking.savedBooking.return ?? null;
            $scope.booking.savedBooking.returnSpeed = $scope.booking.savedBooking.returnSpeed ?? null;
            $scope.booking.savedBooking.truckHours = $scope.booking.savedBooking.truckHours ?? null;
            $scope.booking.savedBooking.truckStartTime = $scope.booking.savedBooking.truckStartTime ?? null;
            $scope.booking.savedBooking.type = $scope.booking.savedBooking.type ?? null;
            $scope.booking.savedBooking.weight = $scope.booking.savedBooking.weight ?? null;*/
        };

        $scope.getProofOfDelivery = function (proofOfDelivery) {
            if (proofOfDelivery == null) {
                return 0;
            } else if (proofOfDelivery === 'EMAIL') {
                return 1;
            } else if (proofOfDelivery === 'TEXT') {
                return 2;
            } else if (proofOfDelivery === 'EMAILANDTEXT') {
                return 3;
            } else {
                return 0;
            }
        };

        $scope.clearSaved = function () {
            $scope.booking.savedBookingSet = false;
            $scope.booking.clientAddressGeocoded = false;
            $scope.booking.presetSpeed = null;
            $scope.booking.savedBooking = null;
            $scope.booking.newSavedBookingName = null;
        };

        /* --- Address Scheiße --- */

        $scope.clearAllAddresses = function () {
            $scope.clearAddress("from");
            $scope.clearAddress("to");
            $scope.booking.errors = null;
        };

        $scope.clearAddress = function (label) {
            if (label == "to") {
                $scope.booking.toSearch = null;
                $scope.booking.toDetails = null;
                $scope.booking.toCompanyName = null;
                $scope.booking.toExtra = null;
                $scope.booking.toLat = null;
                $scope.booking.toLong = null;
                $scope.booking.centerLat = null;
                $scope.booking.centerLong = null;
                $scope.rates = null;
            } else {
                $scope.booking.fromSearch = null;
                $scope.booking.fromDetails = null;
                $scope.booking.fromCompanyName = null;
                $scope.booking.fromExtra = null;
                $scope.booking.fromLat = null;
                $scope.booking.fromLong = null;
                $scope.booking.centerLat = null;
                $scope.booking.centerLong = null;
                $scope.rates = null;
            }
        };

        $scope.resetAll = function () {
            //Keeps or sets from address when clearing or starting subsequent bookings
            if ($scope.clientAddressDirection === "from") {
                if ($scope.booking.fromDetails === $scope.booking.savedClientDetails) {
                    $scope.clearAddress("to");
                } else {
                    $scope.clearAddress("from");
                    $scope.clearAddress("to");
                    $scope.booking.fromSearch = $scope.booking.client.address;
                    $scope.booking.fromCompanyName = $scope.booking.client.name;
                    $scope.booking.fromDetails = $scope.booking.savedClientDetails;
                    $scope.booking.fromExtra = $scope.booking.client.addressExtras;
                    $scope.booking.pickupNotes = $scope.booking.client.extraInfo;
                };
            } else {
                if ($scope.booking.toDetails === $scope.booking.savedClientDetails) {
                    $scope.clearAddress("from");
                } else {
                    $scope.clearAddress("from");
                    $scope.clearAddress("to");
                    $scope.booking.toSearch = $scope.booking.client.address;
                    $scope.booking.toCompanyName = $scope.booking.client.name;
                    $scope.booking.toDetails = $scope.booking.savedClientDetails;
                    $scope.booking.toExtra = $scope.booking.client.addressExtras;
                    $scope.booking.deliveryNotes = $scope.booking.client.extraInfo;
                };
            }

            $scope.booking.errors = null;
            $scope.booking.originalFromCompany = null;
            $scope.booking.originalFromExtra = null;
            $scope.showFromExtra = true;
            $scope.showToExtra = true;

            $scope.clearSize();
            $scope.clearDG();
            $scope.clearTruck();
            $scope.clearTime();
            $scope.clearExtra();
            $scope.toTimeZone = null;
            $scope.lastManuallySelectedRate = null;
            $scope.jobData = null;
        }

        $scope.checkEmpty = function (label) {
            if (label == "to") {
                if ($scope.booking.toSearch.length == 0) {
                    $scope.clearAddress(label);
                }
            } else {
                if ($scope.booking.fromSearch.length == 0) {
                    $scope.clearAddress(label);
                }
            }
        };

        $scope.getStreetAddress = function (direction) {
            if (direction == "from") {
                return ($scope.booking.fromSubpremise ? $scope.booking.fromSubpremise + "/" : "") + ($scope.booking.fromStreetNum ? $scope.booking.fromStreetNum + " " : "") + $scope.booking.fromStreetName;
            } else {
                return ($scope.booking.toSubpremise ? $scope.booking.toSubpremise + "/" : "") + ($scope.booking.toStreetNum ? $scope.booking.toStreetNum + " " : "") + $scope.booking.toStreetName;
            }
        };

        $scope.getCompanyName = function (direction) {
            if (direction == "from" && $scope.booking.fromDetails && $scope.booking.fromDetails.name) {
                return $scope.booking.fromDetails.name != $scope.getStreetAddress("from") ? $scope.booking.fromDetails.name : null;
            } else if (direction == "to" && $scope.booking.toDetails && $scope.booking.toDetails.name) {
                return $scope.booking.toDetails.name != $scope.getStreetAddress("to") ? $scope.booking.toDetails.name : null;
            } else if (direction == "from" && $scope.booking.jobType == "Pickup") {
                return $scope.booking.client.name;
            } else if (direction == "to" && $scope.booking.jobType == "DeliverToUs") {
                return $scope.booking.client.name;
            } else {
                return null;
            }
        };

        $scope.swapToFromAddress = function () {
            var tempAddress = $scope.booking.toSearch;
            var tempAddressDetails = $scope.booking.toDetails;

            $scope.booking.toSearch = $scope.booking.fromSearch;
            $scope.booking.toDetails = $scope.booking.fromDetails;

            $scope.booking.fromSearch = tempAddress;
            $scope.booking.fromDetails = tempAddressDetails;

            $scope.booking.originalFromCompany = $scope.booking.fromCompanyName;
            $scope.booking.fromCompanyName = $scope.booking.toCompanyName;
            $scope.booking.toCompanyName = $scope.booking.originalFromCompany;

            $scope.booking.originalFromExtra = $scope.booking.fromExtra;
            $scope.booking.fromExtra = $scope.booking.toExtra;
            $scope.booking.toExtra = $scope.booking.originalFromExtra;
        };

        $scope.displayFromExtra = function () {
            $scope.showFromExtra = !$scope.showFromExtra;
        };

        $scope.displayToExtra = function () {
            $scope.showToExtra = !$scope.showToExtra;
        };

        /* --- Time/Date Scheiße --- */

        $scope.setCurrentTime = function () {
            $scope.getDate();
            $scope.getTime();
            $scope.booking.deliveryTime = new Date($scope.currTime.getTime());
            $scope.booking.deliveryDate = new Date($scope.currDate.getTime());
        };

        $scope.clearTime = function () {
            $scope.setCurrentTime();
            $scope.clearTimeExtras();
            $scope.timeSaved = false;
            $scope.checkIfRatesReady();
            $scope.setStep('address');
            $scope.time.errors = [];
        };

        $scope.timeBack = function () {
            $scope.setStep('address');
            $scope.time.errors = [];
            if (!$scope.timeSaved) {
                $scope.setCurrentTime();
            };
        };

        $scope.clearTimeExtras = function () {
            $scope.booking.holdJob = false;
            $scope.booking.deliverByTimeZone = $scope.toTimeZone;
            $scope.booking.pickupTimeZone = $scope.fromTimeZone;
            $scope.clearRecurring();
        };

        $scope.getDate = function () {
            var today = new Date();

            //code to deal with timezone potentially booking prev date
            if ($scope.booking.pickupTimeZone) {
                var timeOffset = (today.getHours() - $scope.timeZone.offsetHours + $scope.booking.pickupTimeZone.offsetHours);
                if (timeOffset < 0) {
                    today.setDate(today.getDate() - 1);
                } else if (timeOffset >= 24) {
                    today.setDate(today.getDate() + 1);
                };
            };

            var year = today.getFullYear();
            var month = String(today.getMonth() + 1).padStart(2, '0');
            var day = String(today.getDate()).padStart(2, '0');

            $scope.currDate = new Date(year, (parseInt(month) - 1), day);

            $scope.minDate = year + "-" + month + "-" + day;

            if (($scope.booking.client && $scope.booking.client.stripeClient) || $scope.isCreditCardClient()) {
                $scope.dateMaxDate = new Date(year, month - 1, day);
                $scope.maxDate = $scope.dateMaxDate.getFullYear() + "-" + String($scope.dateMaxDate.getMonth() + 1).padStart(2, '0') + "-" + String($scope.dateMaxDate.getDate() + 4).padStart(2, '0');
                $scope.dateMaxDate.setDate($scope.dateMaxDate.getDate() + 4);
            } else {
                $scope.dateMaxDate = new Date(year, month, day);
                $scope.maxDate = $scope.dateMaxDate.getFullYear() + "-" + String($scope.dateMaxDate.getMonth() + 1).padStart(2, '0') + "-" + String($scope.dateMaxDate.getDate()).padStart(2, '0');
            }

            if (!$scope.booking.deliveryDate) {
                $scope.booking.deliveryDate = new Date($scope.currDate.getTime());
            };
        };

        $scope.getTime = function () {
            var today = new Date();

            //change the time to be in the timezone of the from address
            if ($scope.booking.pickupTimeZone) {
                today.setHours(today.getHours() - $scope.timeZone.offsetHours + $scope.booking.pickupTimeZone.offsetHours);
            };

            var roundedMins = Math.ceil(today.getMinutes() / 10) * 10;
            var hours = roundedMins != 60 ? String(today.getHours()).padStart(2, '0') : String(today.getHours() + 1).padStart(2, '0');
            var minutes = String(roundedMins != 60 ? roundedMins : 00).padStart(2, '0'); //Get mins rounded to nearest 10 (or 00 if 60)

            $scope.currTime = new Date($scope.minDate + "T" + hours + ":" + minutes + ":00");

            if (!$scope.booking.deliveryTime) {
                $scope.booking.deliveryTime = new Date($scope.currTime.getTime());
            };
        };

        $scope.getDateTimeString = function () {
            var month = $scope.booking.deliveryDate.toLocaleString('default', { month: 'short' });
            var day = $scope.booking.deliveryDate.getDate();
            var time = $scope.booking.deliveryTime.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })
            return (day + " " + month + ", " + time + 
                ($scope.booking.deliverBy && $scope.booking.deliverByTimeZone != $scope.booking.pickupTimeZone ? " (" + $scope.booking.pickupTimeZone.code + ")" : ""));
        };

        $scope.combineDateTime = function () {
            var year = $scope.booking.deliveryDate.getFullYear();
            var month = String($scope.booking.deliveryDate.getMonth() + 1).padStart(2, '0');
            var day = String($scope.booking.deliveryDate.getDate()).padStart(2, '0');
            var hours = String($scope.booking.deliveryTime.getHours()).padStart(2, '0');
            var minutes = String($scope.booking.deliveryTime.getMinutes()).padStart(2, '0');

            return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00";
        };

        $scope.checkIfCurrentDateTime = function () {
            if ($scope.currTime.getTime() === $scope.booking.deliveryTime.getTime() && $scope.currDate.getTime() === $scope.booking.deliveryDate.getTime()) {
                return true;
            } else {
                return false;
            }
        }

        $scope.getTimeZoneInfo = function (timeZoneName) {
            var date = new Date();

            // Format the date according to the specified timezone
            var nameFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timeZoneName,
                timeZoneName: 'long'
            });

            var codeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timeZoneName,
                timeZoneName: 'short'
            });

            // Get the formatted parts to extract timezone information
            const nameParts = nameFormatter.formatToParts(date);
            const timeZoneNamePart = nameParts.find(part => part.type === 'timeZoneName');

            const codeParts = codeFormatter.formatToParts(date);
            const timeZoneCodePart = codeParts.find(part => part.type === 'timeZoneName');

            // Get the timezone offset in minutes
            const timezoneOffset = new Date(date.toLocaleString('en-US', { timeZone: timeZoneName })) -
                new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));

            // Convert to hours (negative values for ahead of UTC, positive for behind)
            const offsetHours = timezoneOffset / (1000 * 60 * 60);

            return {
                name: timeZoneName,
                displayName: timeZoneNamePart ? timeZoneNamePart.value : null,
                code: timeZoneCodePart ? timeZoneCodePart.value : null,
                offsetHours: offsetHours,
                offsetString: `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`,
                comboName: (timeZoneNamePart ? timeZoneNamePart.value : null) + " (" + (timeZoneCodePart ? timeZoneCodePart.value : null) + ")"
            };
        };

        /* --- Size Scheiße --- */

        $scope.clearSize = function () {
            $scope.booking.stockSize = null;
            $scope.booking.quantity = 1;
            $scope.booking.manualQuantity = [{ length: null, width: null, height: null, weight: null, quantity: 1 }];
            $scope.booking.basicQuantity = [];
            $scope.sizeSaved = null;
            $scope.checkIfRatesReady();
            $scope.setStep('address');
            $scope.size.errors = [];
        };

        $scope.sizeBack = function () {
            $scope.setStep('address');
            $scope.size.errors = [];

            if (!$scope.sizeSaved) {
                $scope.booking.stockSize = null;
                $scope.booking.quantity = 1;
                $scope.booking.manualQuantity = [{ length: null, width: null, height: null, weight: null, quantity: 1 }];
                $scope.booking.basicQuantity = [];
            } else if ($scope.sizeSaved == "manual") {
                $scope.booking.stockSize = null;
                $scope.booking.quantity = 1;
            } else {
                $scope.booking.manualQuantity = [{ length: null, width: null, height: null, weight: null, quantity: 1 }];
                $scope.booking.basicQuantity = [];
            };
        };

        $scope.setVehicleStep = function () {
            if ($scope.countryCode == 'NZ' && !$scope.booking.truck) {
                $scope.booking.van = $scope.booking.vehicle.name.toLowerCase().includes("van");
                $scope.booking.bike = $scope.booking.vehicle.name.toLowerCase().includes("bike");
            } else {
                $scope.booking.van = null;
                $scope.booking.bike = null;
            };

            if ($scope.booking.vehicle.name.toLowerCase().includes("truck")) {
                $scope.booking.truck = true;
                $scope.setStep('truck');
            } else {
                $scope.booking.truck = null;
            };
        };

        $scope.checkSizeValidity = function () {
            if ($scope.isManualQuantity == false) {
                if (!$scope.booking.stockSize) {
                    return true;
                } else {
                    return false;
                }
            } else if ($scope.isManualQuantity == true && ($scope.booking.manualQuantity || $scope.booking.basicQuantity)) {
                if (($scope.booking.manualQuantity.length >= 1 && $scope.booking.manualQuantity[0].weight > 0) || ($scope.booking.basicQuantity.length >= 1)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        $scope.checkManualQuantity = function () {
            var check = 0;
            for (let i = 0; i < $scope.booking.manualQuantity.length; i++) {
                if ($scope.booking.manualQuantity[i].length == null || $scope.booking.manualQuantity[i].length <= 0) {
                    check += 1;
                }
                if ($scope.booking.manualQuantity[i].width == null || $scope.booking.manualQuantity[i].width <= 0) {
                    check += 1;
                }
                if ($scope.booking.manualQuantity[i].height == null || $scope.booking.manualQuantity[i].height <= 0) {
                    check += 1;
                }
                if ($scope.booking.manualQuantity[i].weight == null || $scope.booking.manualQuantity[i].weight <= 0) {
                    check += 1;
                }
                if ($scope.booking.manualQuantity[i].quantity == null || $scope.booking.manualQuantity[i].quantity < 1) {
                    check += 1;
                }
            };

            if (check > 0) {
                return false;
            } else {
                return true;
            }
        };

        $scope.checkBasicQuantity = function () {
            var check = 0;
            for (let i = 0; i < $scope.booking.basicQuantity.length; i++) {
                if ($scope.booking.basicQuantity[i].quantity == null || $scope.booking.basicQuantity[i].quantity < 1) {
                    check += 1;
                }
            };

            if (check > 0) {
                return false;
            } else {
                return true;
            }
        };

        $scope.incrementQuantity = function () {
            if ($scope.booking.quantity < 999) {
                $scope.booking.quantity += 1;
            }
        };

        $scope.decrementQuantity = function () {
            if ($scope.booking.quantity > 1) {
                $scope.booking.quantity -= 1;
            }
        };

        $scope.intQuantity = function () {
            if (typeof $scope.booking.quantity === 'string') {
                $scope.booking.quantity = parseInt($scope.booking.quantity);

                if ($scope.booking.quantity >= 999) {
                    $scope.booking.quantity = 999;
                } else if ($scope.booking.quantity <= 1) {
                    $scope.booking.quantity = 1;
                }
            };
        };

        $scope.addManualQuantityRow = function () {
            if ($scope.booking.manualQuantity.length + $scope.booking.basicQuantity.length >= 10) {
                return;
            };
            $scope.booking.manualQuantity.push({ length: null, width: null, height: null, weight: null, quantity: 1 });
        };

        $scope.removeManualQuantityRow = function (index) {
            if ($scope.booking.manualQuantity.length + $scope.booking.basicQuantity.length > 1) {
                $scope.booking.manualQuantity.splice(index, 1);
            }
        };

        $scope.addBasicQuantityRow = function () {
            if ($scope.booking.basicQuantity.length + $scope.booking.manualQuantity.length >= 10) {
                return;
            };
            var doubleUpName = false;
            var index = -1;
            if ($scope.booking.selectedStockSize) {
                for (i in $scope.booking.basicQuantity) {
                    if ($scope.booking.basicQuantity[i].name == $scope.booking.selectedStockSize.name) { //Increment quantity if double up package size
                        doubleUpName = true;
                        index = i;
                    }
                }
                if (doubleUpName) {
                    $scope.booking.basicQuantity[index].quantity += 1;
                } else {
                    var stockSize = $scope.booking.selectedStockSize; //Otherwise just add it, it's unique bruz
                    $scope.booking.basicQuantity.push({ name: stockSize.name, length: stockSize.length, width: stockSize.width, height: stockSize.height, weight: stockSize.weight, quantity: 1 });
                    $scope.removeEmptyManualQuantityRow();
                    $scope.getRowCubicFeet($scope.booking.basicQuantity[$scope.booking.basicQuantity.length - 1]);
                }
            };
        };

        $scope.removeEmptyManualQuantityRow = function () {
            var originalLength = $scope.booking.manualQuantity.length;
            for (i = 0; i < originalLength; i++) {
                var reverseIndex = originalLength - (1 + parseInt(i)); //go through in reverse order so you can delete them all without missing due to shortening array
                if ($scope.booking.manualQuantity[reverseIndex].length == null && $scope.booking.manualQuantity[reverseIndex].width == null && $scope.booking.manualQuantity[reverseIndex].height == null
                    && $scope.booking.manualQuantity[reverseIndex].weight == null) {
                    $scope.removeManualQuantityRow(reverseIndex);
                };
            };
        };

        $scope.removeBasicQuantityRow = function (index) {
            if ($scope.booking.basicQuantity.length + $scope.booking.manualQuantity.length > 1) {
                $scope.booking.basicQuantity.splice(index, 1);
            } else {
                $scope.addManualQuantityRow();
                $scope.booking.basicQuantity.splice(index, 1);
            };
        };

        $scope.setBasicManual = function (choice) {
            $scope.isManualQuantity = choice;
        };

        $scope.checkGreatestCubic = function () {
            if ($scope.booking.stockSize) {
                var basicCubic = ($scope.booking.stockSize.length / 100) * ($scope.booking.stockSize.width / 100) * ($scope.booking.stockSize.height / 100);
                var basicGreatestLength = Math.max($scope.booking.stockSize.length, $scope.booking.stockSize.width, $scope.booking.stockSize.height);
                $scope.booking.van = (basicCubic >= 0.9855 || basicGreatestLength > 150);
            } else if ($scope.booking.manualQuantity.length >= 1 || $scope.booking.basicQuantity.length >= 1) {
                var greatestCubic = 0;
                var greatestLength = 0;
                for (i in $scope.booking.manualQuantity) {
                    var cubic = ($scope.booking.manualQuantity[i].length / 100) * ($scope.booking.manualQuantity[i].width / 100) * ($scope.booking.manualQuantity[i].height / 100);
                    if (cubic > greatestCubic) {
                        greatestCubic = cubic;
                    }
                    if (Math.max($scope.booking.manualQuantity[i].length, $scope.booking.manualQuantity[i].width, $scope.booking.manualQuantity[i].height) > greatestLength) {
                        greatestLength = Math.max($scope.booking.manualQuantity[i].length, $scope.booking.manualQuantity[i].width, $scope.booking.manualQuantity[i].height);
                    }
                }
                for (i in $scope.booking.basicQuantity) {
                    var secondCubic = ($scope.booking.basicQuantity[i].length / 100) * ($scope.booking.basicQuantity[i].width / 100) * ($scope.booking.basicQuantity[i].height / 100);
                    if (secondCubic > greatestCubic) {
                        greatestCubic = secondCubic;
                    }
                    if (Math.max($scope.booking.basicQuantity[i].length, $scope.booking.basicQuantity[i].width, $scope.booking.basicQuantity[i].height) > greatestLength) {
                        greatestLength = Math.max($scope.booking.basicQuantity[i].length, $scope.booking.basicQuantity[i].width, $scope.booking.basicQuantity[i].height);
                    }
                }
                $scope.booking.van = (greatestCubic >= 0.9855 || greatestLength > 150);
            } else {
                $scope.booking.van = false;
            }
        };

        $scope.getTotalQuantity = function () {
            var count = 0;
            for (i in $scope.booking.packageList) {
                count += parseInt($scope.booking.packageList[i].units);
            };
            return count;
        };

        $scope.getTotalWeightSummary = function () {
            var weight = 0;
            for (i in $scope.booking.packageList) {
                weight += parseInt($scope.booking.packageList[i].units * $scope.booking.packageList[i].kg);
            };
            return weight;
        };

        $scope.checkIfValidBike = function () {
            if ($scope.booking.stockSize) {
                var basicCubic = ($scope.booking.stockSize.length / 100) * ($scope.booking.stockSize.width / 100) * ($scope.booking.stockSize.height / 100);
                $scope.validBike = (basicCubic <= 0.14805 && $scope.booking.stockSize.weight <= 25);
            } else if ($scope.booking.manualQuantity.length >= 1 || $scope.booking.basicQuantity.length >= 1) {
                var greatestCubic = 0;
                var greatestWeight = 0;
                for (i in $scope.booking.manualQuantity) {
                    var cubic = ($scope.booking.manualQuantity[i].length / 100) * ($scope.booking.manualQuantity[i].width / 100) * ($scope.booking.manualQuantity[i].height / 100);
                    if (cubic > greatestCubic) {
                        greatestCubic = cubic;
                    }
                    if ($scope.booking.manualQuantity[i].weight > greatestWeight) {
                        greatestWeight = $scope.booking.manualQuantity[i].weight;
                    }
                }
                for (i in $scope.booking.basicQuantity) {
                    var secondCubic = ($scope.booking.basicQuantity[i].length / 100) * ($scope.booking.basicQuantity[i].width / 100) * ($scope.booking.basicQuantity[i].height / 100);
                    if (secondCubic > greatestCubic) {
                        greatestCubic = secondCubic;
                    }
                    if ($scope.booking.basicQuantity[i].weight > greatestWeight) {
                        greatestWeight = $scope.booking.basicQuantity[i].weight;
                    }
                }
                $scope.validBike = (greatestCubic <= 0.14805 && greatestWeight <= 25);
            } else {
                $scope.validBike = false;
            }
        };

        $scope.setCubic = function (row) {
            if (row.cubic != null && row.cubic != (row.length * row.width * row.height * ($scope.countryCode != "NZ" ? 0.000579 : 0.000001))) {
                row.cubicSaved = true;
            }
        };

        $scope.getRowCubicFeet = function (row) {
            if (row.length && row.width && row.height && row.cubicSaved != true) {
                row.cubic = parseFloat((row.length * row.width * row.height * ($scope.countryCode != "NZ" ? 0.000579 : 0.000001)).toFixed(3));
            }
        };

        /* --- Dangerous Goods Scheiße --- */

        $scope.dgBack = function () {
            if (!$scope.dgSaved) {
                $scope.booking.dangerousGoods = null;
                $scope.booking.dangerousGoodsClass = null;
                $scope.booking.dangerousGoodsDocs = null;
            };

            $scope.setStep('size');
        };

        $scope.clearDG = function () {
            $scope.booking.dangerousGoods = null;
            $scope.booking.dangerousGoodsClass = null;
            $scope.booking.dangerousGoodsDocs = null;
            $scope.dgSaved = null;
            $scope.setStep('size');
            $scope.dangerousGoods.errors = [];
        };

        $scope.dangerousGoodsTrue = function () {
            if ($scope.booking.dangerousGoods == true) {
                $scope.setStep('dangerousGoods');
            };
        };

        $scope.checkDGValidity = function () {
            if ($scope.booking.dangerousGoods) {
                if ($scope.booking.dangerousGoodsClass != null && $scope.booking.dangerousGoodsDocs == true) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        /* --- Truck Scheiße --- */

        $scope.truckBack = function () {
            if (!$scope.truckSaved) {
                $scope.booking.truck = null;
                $scope.booking.vehicle = null;
                $scope.booking.tailLiftPickup = null;
                $scope.booking.tailLiftDropoff = null;
                $scope.booking.deliverTo = "Business";
            };

            $scope.setStep('size');
        };

        $scope.clearTruck = function () {
            $scope.booking.truck = null;
            $scope.booking.vehicle = null;
            $scope.booking.tailLiftPickup = null;
            $scope.booking.tailLiftDropoff = null;
            $scope.booking.deliverTo = "Business";
            $scope.truckSaved = null;
            $scope.setStep('size');
            $scope.truck.errors = [];
        };

        $scope.checkTruckValidity = function () {
            if ($scope.booking.truck) {
                return false;
            } else {
                return true;
            }
        };

        $scope.getPackageSizeString = function () {
            var palletString = "";
            if ($scope.sizeSaved == "basic") { //Only time this is called for 'basic' is for truck - so pallets
                palletString += $scope.booking.quantity + " Pallets: " + $scope.booking.quantity + " @ " + ($scope.booking.stockSize.length) + "(L) x " + ($scope.booking.stockSize.width) + "(W) x "
                    + ($scope.booking.stockSize.height) + "(H) - " + $scope.booking.stockSize.weight + "(LB)";
            } else if ($scope.sizeSaved == "manual") {
                var totalQuantity = 0;

                for (i = 0; i < $scope.booking.manualQuantity.length; i++) {
                    palletString += $scope.booking.manualQuantity[i].quantity + " @ " + ($scope.booking.manualQuantity[i].length) + "(L) x " + ($scope.booking.manualQuantity[i].width) + "(W) x "
                        + ($scope.booking.manualQuantity[i].height) + "(H) - " + $scope.booking.manualQuantity[i].weight + "(LB), ";
                    totalQuantity += $scope.booking.manualQuantity[i].quantity;
                };
                for (i = 0; i < $scope.booking.basicQuantity.length; i++) {
                    palletString += $scope.booking.basicQuantity[i].quantity + " @ " + ($scope.booking.basicQuantity[i].length) + "(L) x " + ($scope.booking.basicQuantity[i].width) + "(W) x "
                        + ($scope.booking.basicQuantity[i].height) + "(H) - " + $scope.booking.basicQuantity[i].weight + "(LB), ";
                    totalQuantity += $scope.booking.basicQuantity[i].quantity;
                };

                palletString = totalQuantity + ($scope.booking.truck ? "x Pallet" : "x Item") + (totalQuantity > 1 ? "s" : "") + ": " + palletString;
            };

            return palletString.replace(/,\s*$/, "");
        };

        /* --- Rates Scheiße --- */

        $scope.checkIfRatesReady = function () {
            if ($scope.sizeSaved && ($scope.timeSaved || $scope.checkIfCurrentDateTime()) && $scope.booking.toDetails && $scope.booking.fromDetails && $scope.booking.fromSearch
                && $scope.booking.vehicle) {
                $scope.prepareGetRatesObject();
            } else {
                $scope.rates = null;
            };
        };

        $scope.prepareGetRatesObject = function () {
            if (!$scope.booking.dimensionsType) {
                $scope.booking.dimensionsType = 1; // Default to Per Item
            }

            $scope.ratesLoading = true;
            $scope.booking.selectedRate = null;
            $scope.findJobType();
            $scope.getPackagesObject();
            if ($scope.countryCode == 'NZ') {
                $scope.checkGreatestCubic();
                if ($scope.booking.bike) {
                    $scope.checkIfValidBike();
                }
            }

            if ($scope.booking.client.addressBookOnly && $scope.countryCode == 'NZ') {
                $scope.modifyWaihekeSuburbs();
            }

            $scope.getRatesObject = {
                from: {
                    companyName: $scope.booking.fromCompanyName ?? $scope.getCompanyName("from"),
                    buildingName: null,
                    streetAddress: $scope.getStreetAddress("from"),
                    city: $scope.countryCode != 'NZ' ? $scope.booking.fromCity : $scope.booking.fromState,
                    state: $scope.countryCode != 'NZ' ? $scope.booking.fromState : null,
                    suburb: $scope.countryCode == 'NZ' ? $scope.booking.fromCity : null,
                    zipCode: $scope.countryCode != 'NZ' ? $scope.booking.fromZipCode : null,
                    postCode: $scope.countryCode == 'NZ' ? $scope.booking.fromZipCode : null,
                    countryCode: $scope.countryCode,
                    latitude: $scope.booking.fromLat,
                    longitude: $scope.booking.fromLong
                },
                to: {
                    companyName: $scope.booking.toCompanyName ?? $scope.getCompanyName("to"),
                    buildingName: null,
                    streetAddress: $scope.getStreetAddress("to"),
                    city: $scope.countryCode != 'NZ' ? $scope.booking.toCity : $scope.booking.toState,
                    state: $scope.countryCode != 'NZ' ? $scope.booking.toState : null,
                    suburb: $scope.countryCode == 'NZ' ? $scope.booking.toCity : null,
                    zipCode: $scope.countryCode != 'NZ' ? $scope.booking.toZipCode : null,
                    postCode: $scope.countryCode == 'NZ' ? $scope.booking.toZipCode : null,
                    countryCode: $scope.countryCode,
                    latitude: $scope.booking.toLat,
                    longitude: $scope.booking.toLong
                },
                packages: $scope.booking.packageList,

                dimensionsType: $scope.booking.dimensionsType || 1,
                isSaturdayDelivery: $scope.booking.deliveryDate.getDay() == 6,
                isDangerousGoods: (typeof $scope.booking.dangerousGoods !== 'undefined' && $scope.booking.dangerousGoods == true),
                dryIceWeight: $scope.booking.dangerousGoods === true ? ($scope.booking.dryIceWeight ?? null) : null,
                isPrebook: false, //$scope.booking.recurring
                dateTime: $scope.combineDateTime(),
                jobType: $scope.booking.jobType,

                vehicleSizeId: $scope.booking.vehicle.id,
                van: $scope.booking.van ?? false,
                bike: $scope.booking.bike ?? false,
                truck: $scope.booking.truck == true ? {
                    pickupTailLift: $scope.booking.tailLiftPickup,
                    dropoffTailLift: $scope.booking.tailLiftDropoff,
                    privateRes: $scope.booking.deliverTo == 'Residential' ? true : false,
                    hasDGDocuments: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsDocs : null,
                    truckStartTime: null,
                    truckHours: null
                } : null,
                ourReference: $scope.booking.client.addressBookOnly ? ($scope.booking.fromAddressCode ?? '?') + ($scope.booking.toAddressCode ?? '?') : null,
                clientReferenceA: $scope.booking.clientRefA ?? null,
                clientReferenceB: $scope.booking.clientRefB ?? null
            };

            $scope.getRates();
        };

        $scope.getPackagesObject = function () {
            var packageList = [];
            if ($scope.sizeSaved == "basic") {
                packageList.push({
                    name: $scope.booking.stockSize.name,
                    length: $scope.booking.stockSize.length,
                    width: $scope.booking.stockSize.width,
                    height: $scope.booking.stockSize.height,
                    cubic: ($scope.booking.stockSize.length * $scope.booking.stockSize.width * $scope.booking.stockSize.height * ($scope.countryCode != "NZ" ? 0.000579 : 0.000001)),
                    kg: $scope.booking.stockSize.weight,
                    type: null,
                    packageCode: null,
                    units: $scope.booking.quantity
                });
            } else if ($scope.sizeSaved == "manual") {
                for (i = 0; i < $scope.booking.manualQuantity.length; i++) {
                    packageList.push({
                        name: null,
                        length: $scope.booking.manualQuantity[i].length,
                        width: $scope.booking.manualQuantity[i].width,
                        height: $scope.booking.manualQuantity[i].height,
                        cubic: $scope.booking.manualQuantity[i].cubic,
                        kg: $scope.booking.manualQuantity[i].weight,
                        type: null,
                        packageCode: null,
                        units: $scope.booking.manualQuantity[i].quantity
                    });
                };
                for (i = 0; i < $scope.booking.basicQuantity.length; i++) {
                    packageList.push({
                        name: $scope.booking.basicQuantity[i].name,
                        length: $scope.booking.basicQuantity[i].length,
                        width: $scope.booking.basicQuantity[i].width,
                        height: $scope.booking.basicQuantity[i].height,
                        cubic: $scope.booking.basicQuantity[i].cubic,
                        kg: $scope.booking.basicQuantity[i].weight,
                        type: null,
                        packageCode: null,
                        units: $scope.booking.basicQuantity[i].quantity
                    });
                };
            };

            $scope.booking.packageList = packageList;
        };

        $scope.findJobType = function () {
            //Sometimes addresses like 'st' or 'street' not matching so removing that for comparison
            var clientAddress = $scope.booking.client.address;
            var clientLastIndex = clientAddress.lastIndexOf(" ");
            var clientTrimmedAddress = clientLastIndex != null ? clientAddress.substring(0, clientLastIndex) : clientAddress;
            //var clientSuburb = $scope.booking.client.suburb;

            var fromAddress = $scope.getStreetAddress("from");
            var fromLastIndex = fromAddress.lastIndexOf(" ");
            var fromTrimmedAddress = fromLastIndex != null ? fromAddress.substring(0, fromLastIndex) : fromAddress;
           // var fromSuburb = $scope.booking.fromCity ? $scope.booking.fromCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu

            var toAddress = $scope.getStreetAddress("to");
            var toLastIndex = toAddress.lastIndexOf(" ");
            var toTrimmedAddress = toLastIndex != null ? toAddress.substring(0, toLastIndex) : toAddress;
            //var toSuburb = $scope.booking.toCity ? $scope.booking.toCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu

            //var fromSuburbSame = $scope.checkSuburb(clientSuburb, $scope.booking.client.alias, fromSuburb);
            //var toSuburbSame = $scope.checkSuburb(clientSuburb, $scope.booking.client.alias, toSuburb);

            if (clientTrimmedAddress == fromTrimmedAddress) { //&& fromSuburbSame) {
                $scope.booking.jobType = "Pickup";
            } else if (clientTrimmedAddress == toTrimmedAddress) { //&& toSuburbSame) {
                $scope.booking.jobType = "DeliverToUs";
            } else {
                $scope.booking.jobType = "ThirdParty";
            };
        };

        $scope.setRateSelected = function (selectedRate) {
            for (rate in $scope.rates) {
                $scope.rates[rate].selected = false;
            };
            selectedRate.selected = true;
            $scope.booking.selectedRate = selectedRate;

            $scope.updateFlightRouteLine(selectedRate);

            //Save last selected rate to set after getting rates again if still there
            $scope.lastManuallySelectedRate = selectedRate.speedId;
        };

        $scope.updateFlightRouteLine = function (selectedRate) {
            if ($scope.speeds.find(x => x.id === selectedRate.speedId).groupingName.includes("Flight")) {
                $scope.drawRouteLine(true);
            } else {
                if ($scope.lastManuallySelectedRate != null && $scope.speeds.find(x => x.id === $scope.lastManuallySelectedRate).groupingName.includes("Flight")) {
                    $scope.drawRouteLine();
                };
            };
        };

        $scope.getSpeedImage = function (rate) {
            if (rate.serviceName == "15 Minutes") {
                return "15min";
            }
            if (rate.serviceName == "30 Minutes") {
                return "30min";
            }
            if (rate.serviceName == "45 Minutes") {
                return "45min";
            }
            if (rate.serviceName == "75 Minutes") {
                return "75min";
            }
            if (rate.serviceName == "90 Minutes") {
                return "90min";
            }
            if (rate.serviceName == "One Hour") {
                return "1hour";
            }
            if (rate.serviceName == "Two Hour") {
                return "2hour";
            }
            if (rate.serviceName == "Three Hour") {
                return "3hour";
            }
            if (rate.serviceName == "Evening Home") {
                return "eveningHome";
            }
            if (rate.serviceName == "Economy") {
                return "economy";
            }
            if (rate.serviceName == "Truck Super") {
                return "truckSuper2Hour";
            }
            if (rate.serviceName == "Truck Express") {
                return "truckExpress3Hour";
            }
            if (rate.serviceName == "Truck Standard") {
                return "truckStandard4Hour";
            }
            if (rate.serviceName == "Truck Economy") {
                return "truckEconomyBy5pm";
            }
            if (rate.serviceName.includes("Nationwide Flight")) {
                return "airNationwide";
            }
            return $scope.booking.van === true || $scope.booking.vehicle === "van" ? "vanHire" : "carHire";
        };

        $scope.getSelectedRates = function () {
            if ($scope.rates.length === 0)
                return;

            var shortestIndex = -1;
            var shortestDuration = 10000000;

            for (i in $scope.rates) { //Finds top rate to default select that is not direct
                if ($scope.rates[i].duration < shortestDuration && (!$scope.rates[i].serviceName.includes("DIRECT")) && $scope.rates[i].duration !== 0) {
                    shortestDuration = $scope.rates[i].duration;
                    shortestIndex = i;
                };
            }

            if ($scope.lastManuallySelectedRate) {
                $scope.matchAndApplySelectedRate(shortestIndex, $scope.lastManuallySelectedRate);
            } else {
                if (!$scope.booking.presetSpeed) {
                    if (shortestIndex !== -1) {
                        $scope.rates[shortestIndex].selected = true;
                        $scope.booking.selectedRate = $scope.rates[shortestIndex];
                    }
                } else {
                    $scope.matchAndApplySelectedRate(shortestIndex, $scope.booking.presetSpeed);
                }
            }
        };

        $scope.matchAndApplySelectedRate = function (shortestIndex, speedId) {
            var foundSpeed = $scope.rates.find(x => x.speedId === speedId);

            if (typeof foundSpeed !== 'undefined') {
                foundSpeed.selected = true;
                $scope.booking.selectedRate = foundSpeed;
            } else {
                if (shortestIndex !== -1) {
                    $scope.rates[shortestIndex].selected = true;
                    $scope.booking.selectedRate = $scope.rates[shortestIndex];
                }
            }

            if ($scope.speeds.find(x => x.id === $scope.booking.selectedRate.speedId).groupingName.includes("Flight")) {
                $scope.updateFlightRouteLine($scope.booking.selectedRate);
            }
        };

        $scope.removeAllLaterSchedules = function () {
            if ($scope.rates.length === 0)
                return;

            $scope.removeLaterSchedules("Afternoon Super");
            $scope.removeLaterSchedules("Afternoon Home");
            $scope.removeLaterSchedules("Morning Express");
            $scope.removeLaterSchedules("Hamilton Link");
            $scope.removeLaterSchedules("Bay of Plenty Link");
            /*$scope.removeLaterSchedules("Afternoon Chilled");
            $scope.removeLaterSchedules("Afternoon Hamilton Chilled");
            $scope.removeLaterSchedules("Afternoon Tauranga Chilled");*/
        };

        $scope.removeLaterSchedules = function (schedule) {
            var earliestDate = new Date(Date.now() + (10 * 86400000)); //Date 10 days from now
            var earliestIndex = -1;
            var allIndex = [];

            for (i in $scope.rates) {
                if ($scope.rates[i].serviceName.includes(schedule)) {
                    if (new Date($scope.rates[i].bookDate) < earliestDate) {
                        earliestDate = new Date($scope.rates[i].bookDate);
                        earliestIndex = i;
                        allIndex.push(i);
                    } else {
                        allIndex.push(i);
                    }
                }
            }

            //Hide all schedules with this name other than the earliest/closest one
            for (i in allIndex) {
                if (allIndex[i] != earliestIndex) {
                    $scope.rates[allIndex[i]].hidden = true;
                }
            };
        };

        $scope.getFastestGreenSpeed = function () {
            var fastestDuration = 720;
            var fastestSpeed = null;
            for (i in $scope.rates) {
                if ($scope.rates[i].serviceName.includes("Minutes") || $scope.rates[i].serviceName.includes("Hour")) {
                    if ($scope.rates[i].availabilityColour === "#00FF00") {
                        if ($scope.rates[i].duration < fastestDuration) {
                            fastestDuration = $scope.rates[i].duration;
                            fastestSpeed = $scope.rates[i];
                        }
                    }
                }
            }

            $scope.fastestGreenSpeed = fastestSpeed;
        };

        $scope.hideBadRates = function () {
            var fromSuburb = $scope.matchSuburbName($scope.booking.fromCity, "object");
            var toSuburb = $scope.matchSuburbName($scope.booking.toCity, "object");
            if (fromSuburb != null && toSuburb != null) {
                var ratesCount = $scope.rates.length;
                var hiddenCount = 0;
                //Hide Auckland P2P for reg->reg
                if (fromSuburb.siteId != 1 && toSuburb.siteId != 1) {
                    for (i in $scope.rates) {
                        if ($scope.badRegionalSpeedIds.includes($scope.rates[i].speedId)) {
                            $scope.rates[i].hidden = true;
                            hiddenCount += 1;
                        };
                    };
                };
                //Hide NDP and DDS for AKL -> AKL
                if (fromSuburb.siteId == 1 && toSuburb.siteId == 1) {
                    for (i in $scope.rates) {
                        if ($scope.rates[i].speedId == 79 || $scope.rates[i].speedId == 10) {
                            $scope.rates[i].hidden = true;
                            hiddenCount += 1
                        };
                    };
                };
                if (ratesCount == hiddenCount) {
                    $scope.rates = null;
                    $scope.noRates = true;
                };
            };
        };

        $scope.matchSuburbName = function (suburbName, returnValue) {
            suburbName = suburbName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            var suburb = $scope.suburbs.find(x => x.name === suburbName);
            if (typeof suburb !== 'undefined') {
                return (returnValue == "id" ? suburb.id : suburb);
            } else {
                suburb = $scope.suburbs.find(x => x.alias !== null && x.alias.includes(suburbName));
                if (typeof suburb !== 'undefined') {
                    return (returnValue == "id" ? suburb.id : suburb);
                } else {
                    return null;
                }
            };
        };

        $scope.modifyWaihekeSuburbs = function () {
            if (($scope.booking.fromZipCode == "1081" || $scope.booking.fromZipCode == "1841") && $scope.booking.fromCity != "Waiheke") {
                $scope.booking.fromCity = "Waiheke";
                $scope.booking.toCity = "Auckland";
            }
            if (($scope.booking.toZipCode == "1081" || $scope.booking.toZipCode == "1841") && $scope.booking.toCity != "Waiheke") {
                $scope.booking.toCity = "Waiheke";
                $scope.booking.toState = "Auckland";
            }
        };

        /* --- Extra Scheiße ---*/

        $scope.clearExtra = function () {
            $scope.clearExtraTracking();
            $scope.clearExtraContact();
            $scope.clearExtraReference();
        };

        $scope.clearExtraTracking = function () {
            $scope.booking.proofOfDelivery = "EMAILANDTEXT"; //default to email and text
            $scope.booking.podEmail = null;
            $scope.booking.podMobile = null;
            $scope.booking.sigNotRequired = null;
            $scope.extraInfo.errors = null;
        };

        $scope.clearExtraContact = function () {
            $scope.booking.pickupContact = null;
            $scope.booking.pickupPhone = null;
            $scope.booking.pickupNotes = null;
            $scope.booking.deliveryContact = null;
            $scope.booking.deliveryPhone = null;
            $scope.booking.deliveryNotes = null;
            $scope.extraInfoContact.errors = null;
        };

        $scope.clearExtraReference = function () {
            $scope.booking.clientRefA = null;
            $scope.booking.clientRefB = null;
            $scope.booking.clientNotes = null;
        };

        $scope.extraInfoBack = function () {
            $scope.setStep('address');
            $scope.extraInfo.errors = [];
        };

        $scope.extraContactBack = function () {
            $scope.setStep('extraInfo');
            $scope.extraInfoContact.errors = [];
        };

        $scope.extraReferenceBack = function () {
            $scope.setStep('extraInfoContact');
            $scope.extraInfoReferences.errors = [];
        };

        $scope.podShow = function (label) {
            if ($scope.booking.proofOfDelivery != null) {
                if (label == 'email') {
                    if ($scope.booking.proofOfDelivery == "EMAIL" || $scope.booking.proofOfDelivery == "EMAILANDTEXT") {
                        return true;
                    } else {
                        return false;
                    };
                } else if (label == 'mobile') {
                    if ($scope.booking.proofOfDelivery == "TEXT" || $scope.booking.proofOfDelivery == "EMAILANDTEXT") {
                        return true;
                    } else {
                        return false;
                    };
                };
            } else {
                return false;
            };
        };

        $scope.checkIfReferencesNeeded = function () {
            if ($scope.booking.client.referenceADefineList === true) {
                $scope.getReferences("A");
            };

            if ($scope.booking.client.referenceBDefineList === true) {
                $scope.getReferences("B");
            };
        };

        $scope.getJobData = function () {
            if ($scope.countryCode == 'NZ') {
                $scope.checkGreatestCubic();
            }

            $scope.bookJobObject = {
                quoteId: $scope.booking.selectedRate.quoteId,
                speedId: $scope.booking.selectedRate.speedId,
                vehicleSizeId: $scope.booking.vehicle.id,
                jobType: $scope.booking.jobType,
                pickup: {
                    name: $scope.booking.clientContact.name,
                    contactPerson: $scope.booking.pickupContact != null && $scope.booking.pickupContact !== "" ? $scope.booking.pickupContact : ".",
                    phoneNumber: $scope.booking.pickupPhone,
                    from: {
                        companyName: $scope.booking.fromCompanyName ?? $scope.getCompanyName("from"),
                        buildingName: $scope.booking.fromExtra,
                        streetAddress: $scope.getStreetAddress("from"),
                        city: $scope.countryCode != 'NZ' ? $scope.booking.fromCity : $scope.booking.fromState,
                        state: $scope.countryCode != 'NZ' ? $scope.booking.fromState : null,
                        suburb: $scope.countryCode == 'NZ' ? $scope.booking.fromCity : null,
                        zipCode: $scope.countryCode != 'NZ' ? $scope.booking.fromZipCode : null,
                        postCode: $scope.countryCode == 'NZ' ? $scope.booking.fromZipCode : null,
                        countryCode: $scope.countryCode,
                        latitude: $scope.booking.fromLat,
                        longitude: $scope.booking.fromLong
                    },
                    notes: ($scope.booking.pickupNotes ?? "") + ($scope.booking.truck === true || $scope.sizeSaved === "manual" ? " " + $scope.getPackageSizeString() : ""), //Appending pallet size string for truck/manually sized jobs.
                },
                delivery: {
                    name: $scope.booking.deliveryContact != null && $scope.booking.deliveryContact !== "" ? $scope.booking.deliveryContact : ".",
                    contactPerson: $scope.booking.deliveryContact != null && $scope.booking.deliveryContact !== "" ? $scope.booking.deliveryContact : ".",
                    phoneNumber: $scope.booking.deliveryPhone,
                    to: {
                        companyName: $scope.booking.toCompanyName ?? $scope.getCompanyName("to"),
                        buildingName: $scope.booking.toExtra,
                        streetAddress: $scope.getStreetAddress("to"),
                        city: $scope.countryCode != 'NZ' ? $scope.booking.toCity : $scope.booking.toState,
                        state: $scope.countryCode != 'NZ' ? $scope.booking.toState : null,
                        suburb: $scope.countryCode == 'NZ' ? $scope.booking.toCity : null,
                        zipCode: $scope.countryCode != 'NZ' ? $scope.booking.toZipCode : null,
                        postCode: $scope.countryCode == 'NZ' ? $scope.booking.toZipCode : null,
                        countryCode: $scope.countryCode,
                        latitude: $scope.booking.toLat,
                        longitude: $scope.booking.toLong
                    },
                    notes: ($scope.booking.deliveryNotes ?? "") + ($scope.booking.sigNotRequired != null && $scope.booking.sigNotRequired != "Other (add to 'Delivery Notes')" ? " " + $scope.booking.sigNotRequired : ""),
                },
                packages: $scope.booking.packageList,
                dimensionsType: $scope.booking.dimensionsType || 1,
                dateTime: $scope.booking.selectedRate.speedId.toString().length > 3 ? $scope.booking.selectedRate.bookDate : $scope.combineDateTime(),
                jobNotificationType: $scope.booking.proofOfDelivery != null ? $scope.booking.proofOfDelivery : "WEBSITE",
                jobNotificationEmail: $scope.podShow("email") === true ? $scope.booking.podEmail : null,
                jobNotificationMobile: $scope.podShow("mobile") === true ? $scope.booking.podMobile : null,
                isSignatureRequired: $scope.sigNotRequired == null ? true : false,
                isSaturdayDelivery: $scope.booking.deliveryDate.getDay() == 6,
                isDangerousGoods: (typeof $scope.booking.dangerousGoods !== 'undefined' && $scope.booking.dangerousGoods == true),
                hasDGDocument: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsDocs : null,
                dgClass: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsClass : null,
                dryIceWeight: null, //$scope.booking.dangerousGoods === true ? ($scope.booking.dryIceWeightUnit === 'KG' ? parseFloat(($scope.booking.dryIceWeight * 2.20462262).toFixed(2)) : $scope.booking.dryIceWeight) : null,
                clientReferenceA: $scope.booking.clientRefA,
                clientReferenceB: $scope.booking.clientRefB,
                ourReference: $scope.booking.client.addressBookOnly ? ($scope.booking.fromAddressCode ?? '?') + ($scope.booking.toAddressCode ?? '?') : null,
                clientNotes: $scope.booking.clientNotes,
                onHold: $scope.booking.holdJob,
                van: $scope.booking.van ?? false,
                bike: $scope.booking.bike ?? false,
                truck: $scope.booking.truck == true ? {
                    pickupTailLift: $scope.booking.tailLiftPickup,
                    dropoffTailLift: $scope.booking.tailLiftDropoff,
                    privateRes: $scope.booking.deliverTo == 'Residential' ? true : false,
                    hasDGDocuments: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsDocs : null,
                    truckStartTime: null,
                    truckHours: null
                } : null,
                storageState: $scope.booking.selectedRate.serviceName.toLowerCase().includes("chilled") ? "Chilled" : ($scope.booking.selectedRate.serviceName.toLowerCase().includes("frozen") ? "Frozen" : null),
                deliveryState: $scope.booking.selectedRate.serviceName.toLowerCase().includes("chilled") ? "Chilled" : ($scope.booking.selectedRate.serviceName.toLowerCase().includes("frozen") ? "Frozen" : null),
                sourceId: 11, //Mobile new booking sourceID
                pickupReadyDateTime: $scope.booking.selectedRate.speedId.toString().length > 3 ? $scope.combineDateTime() : null,
                pickupTimeZone: $scope.booking.pickupTimeZone.displayName,
                deliverByTimeZone: $scope.booking.deliverByTimeZone.displayName,
                loggedInContactId: $scope.booking.client.loggedInContactId
            };

            $scope.bookJob();
        };

        /* --- Confirmation jawnz --- */

        $scope.getConfirmationAddress = function (direction) {
            if (direction == "from") {
                return ($scope.booking.pickupContact ? $scope.booking.pickupContact + ",\n" : "") +
                    ($scope.booking.fromCompanyName ? $scope.booking.fromCompanyName + ",\n" : ($scope.getCompanyName("from") ? $scope.getCompanyName("from") + ",\n" : "")) +
                    ($scope.booking.fromExtra != null ? $scope.booking.fromExtra + ",\n" : "") +
                    ($scope.getStreetAddress("from") ? $scope.getStreetAddress("from") + ",\n" : "") + ($scope.booking.fromCity ? $scope.booking.fromCity + ",\n" : "") +
                    ($scope.booking.fromState ? $scope.booking.fromState + ($scope.booking.fromZipCode ? " " + $scope.booking.fromZipCode : "") : "");
            } else {
                return ($scope.booking.deliveryContact ? $scope.booking.deliveryContact + ",\n" : "") +
                    ($scope.booking.toCompanyName ? $scope.booking.toCompanyName + ",\n" : ($scope.getCompanyName("to") ? $scope.getCompanyName("to") + ",\n" : "")) +
                    ($scope.booking.toExtra != null ? $scope.booking.toExtra + ",\n" : "") +
                    ($scope.getStreetAddress("to") ? $scope.getStreetAddress("to") + ",\n" : "") + ($scope.booking.toCity ? $scope.booking.toCity + ",\n" : "") + 
                    ($scope.booking.toState ? $scope.booking.toState + ($scope.booking.toZipCode ? " " + $scope.booking.toZipCode : "") : "");
            };
        };

        $scope.openLabelModal = function () {
            $('.printLabel-modal').modal();
        };

        /* --- Intercom jawnz --- */

        $scope.getIntercom = function () {
            var thisContact = undefined;
            var index = 0;

            while (!thisContact) {
                thisContact = $scope.clients[index].contacts.find(x => x.id === $scope.clients[0].loggedInContactId);
                index += 1;
            };

            window.intercomSettings = {
                api_base: "https://api-iam.intercom.io",
                app_id: "yso4cj22",
                name: thisContact.name, // Full name
                email: thisContact.email, // Email address
                created_at: thisContact.createdUnix, // Signup date as a Unix timestamp
                company: {
                    id: $scope.clients[0].id,
                    name: $scope.clients[0].name,
                    created_at: $scope.clients[0].createdUnix
                },
                NewBookingPage: true
            };

            var w = window;
            var ic = w.Intercom;
            if (typeof ic === "function") {
                ic('reattach_activator');
                ic('update', w.intercomSettings);
            } else {
                var d = document;
                var i = function () {
                    i.c(arguments);
                };
                i.q = [];
                i.c = function (args) {
                    i.q.push(args);
                };
                w.Intercom = i;
                var l = function () {
                    var s = d.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://widget.intercom.io/widget/yso4cj22';
                    var x = d.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                };
                if (document.readyState === 'complete') {
                    l();
                } else if (w.attachEvent) {
                    w.attachEvent('onload', l);
                } else {
                    w.addEventListener('load', l, false);
                }
            }
        };

        /* --- Init --- */

        $scope.prepareAll = function () {
            $scope.getHereMap();
            $scope.creditCard = [];
            $scope.booking = [];
            $scope.time = [];
            $scope.timeSaved = false;
            $scope.size = [];
            $scope.sizeSaved = null;
            $scope.dangerousGoods = [];
            $scope.truck = [];
            $scope.extraInfo = [];
            $scope.extraInfoSaved = false;
            $scope.extraInfoContact = [];
            $scope.extraInfoReferences = [];
            $scope.confirmation = [];
            $scope.step = "client";
            $scope.clientAddressGeocoded = false;
            $scope.setCurrentTime();
            $scope.booking.deliverTo = "Business";
            $scope.booking.quantity = 1;
            $scope.booking.manualQuantity = [];
            $scope.booking.basicQuantity = [];
            $scope.isManualQuantity = false;
            $scope.addManualQuantityRow();
            $scope.booking.proofOfDelivery = "EMAILANDTEXT";
            $scope.showFromExtra = true;
            $scope.showToExtra = true;
            $scope.validBike = false;
            $scope.timeZone = $scope.getTimeZoneInfo(Intl.DateTimeFormat().resolvedOptions().timeZone);
        };

        $scope.retrieveAll = function () {
            $scope.getCountryCode();
            $scope.getClients(); //Also sets up intercom after retrieving clients
            $scope.getTimeZones();
            $scope.getAllClients();
            $scope.getSuburbs();
            $scope.getManualAPIData();
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Home";

            $scope.prepareAll();
            $scope.retrieveAll();

            $(".page-loading").stop().fadeOut(100);
        }();
    }]);
