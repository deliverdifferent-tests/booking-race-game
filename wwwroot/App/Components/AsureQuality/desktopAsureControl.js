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
    .controller("desktopAsureControl", ["$rootScope", "$scope", "$state", "$filter", "homesService", "NgMap", "GeoCoder", function ($rootScope, $scope, $state, $filter, homesService, NgMap, GeoCoder) {

        /* --- API Scheiße --- */

        $scope.getThisClient = function () {
            homesService.getThisClient(9673)
                .then(function (data) {
                    if (data.success) {
                        $scope.booking.client = data.client;

                        $scope.clients.push($scope.booking.client);

                        $scope.asureClient = data.client;

                        $scope.getUrgentToken();

                        $scope.initClient();
                    } else {
                        $rootScope.showNotification("Error getting this client", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this client", "fa-exclamation");
                });
        };

        $scope.validateContact = function () {
            if ($scope.validateContactInProgress)
                return;

            $scope.booking.errors = [];
            $scope.validateContactInProgress = true;

            homesService.validateAccessCode($scope.booking.password)
                .then(function (data) {
                    if (data.success && data.contact != null) {
                        $scope.contactValidated = true;
                        $scope.booking.clientContact = data.contact;

                        $scope.contacts = [];
                        $scope.contacts.push($scope.booking.clientContact);
                    } else {
                        $scope.contactValidated = false;
                        $scope.booking.errors.push("Error validating this access code");
                        $rootScope.showNotification("Error validating this access code", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $scope.contactValidated = false;
                    $scope.booking.errors.push("Error validating this access code");
                    $rootScope.showNotification("Error validating this access code", "fa-exclamation");
                })
                .finally(() => $scope.validateContactInProgress = false);
        };

        $scope.getContactJobs = function () {
            homesService.getContactJobs(9673, $scope.booking.clientContact.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobs = data.jobs;
                    } else {
                        $rootScope.showNotification("Error getting jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting jobs", "fa-exclamation");
                });
        };

        $scope.getFilteredContactJobs = function () {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            homesService.getFilteredContactJobs(9673, $scope.booking.clientContact.id, $scope.filter.filters)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobs = data.jobs;
                    } else {
                        $rootScope.showNotification("Error getting filtered jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting filtered jobs", "fa-exclamation");
                })
                .finally(() => $scope.jobsLoading = false);
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

        $scope.getSites = function () {
            homesService.getSites()
                .then(function (data) {
                    if (data.success) {
                        $scope.sites = data.sites;
                    } else {
                        $rootScope.showNotification("Error getting sites", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting sites", "fa-exclamation");
                });
        };

        $scope.getSpeeds = function () {
            homesService.getSpeeds(9673)
                .then(function (data) {
                    if (data.success) {
                        $scope.speeds = data.speeds;
                    } else {
                        $rootScope.showNotification("Error getting speeds", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting speeds", "fa-exclamation");
                });
        };

        $scope.getJobTypeStatuses = function () {
            homesService.getJobTypeStatuses()
                .then(function (data) {
                    if (data.success) {
                        $scope.jobTypeStatuses = data.jobTypeStatuses;
                    } else {
                        $rootScope.showNotification("Error getting job type statuses", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting job type statuses", "fa-exclamation");
                });
        };

        $scope.getSavedJobs = function () {
            homesService.getJobSaveds($scope.booking.client.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.noneSelected = { id: null, name: "-- None Selected --" };
                        $scope.savedJobs = data.jobSaveds;
                        $scope.savedJobs.splice(0, 0, $scope.noneSelected);
                    } else {
                        $rootScope.showNotification("Error getting saved jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting saved jobs", "fa-exclamation");
                });
        };

        $scope.getUndeliverableLocations = function () {
            homesService.getUndeliverableLocations()
                .then(function (data) {
                    if (data.success) {
                        $scope.undeliverableLocations = data.undeliverableLocations;
                    } else {
                        $rootScope.showNotification("Error getting undeliverable locations", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting undeliverable locations", "fa-exclamation");
                });
        };

        $scope.getManualAPIData = function () {
            $scope.dangerousGoodsClasses = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }];
            $scope.proofOfDeliveries = [{ value: "EMAIL", name: "Email" }, { value: "TEXT", name: "Text" }, { value: "EMAILANDTEXT", name: "Email & Text" }]; //Null is "WEBSITE"
            $scope.signatureNotRequireds = [{ value: "Letter Box" }, { value: "Front Door" }, { value: "Back Door" }, { value: "Safe Place" }, { value: "Other (add to 'Delivery Notes')" }]; //Null is sig required
            $scope.labelSizes = [{ value: 1, name: "Label (100 X 174mm)" }, { value: 3, name: "Label (100 X 150mm)" }]; //Null is PDF
            $scope.allowedSpeedIds = [1, 2, 3, 4, 20, 24, 25, 29, 35, 36, 37, 64];
            $scope.badRegionalSpeedIds = [1, 2, 3, 4, 20, 24, 25, 29, 36, 37, 10];
        };

        $scope.getGeocodeData = function (address, suburb, direction) {
            //City doesn't geocode correctly
            if (suburb === "City" || suburb === "CBD") {
                suburb = "Auckland CBD";
            }
            //Here maps
            var addressObject = { address: address, city: suburb, countryCode: "NZ" };

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
                        $rootScope.showNotification("Error geocoding address - please check with Urgent that your client address is valid", "fa-exclamation");
                    }
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
                username: $scope.booking.client.code,
                password: $scope.booking.client.webServicePassword,
                id: $scope.booking.client.id
            };

            homesService.getUrgentToken(loginObject)
                .then(function (data) {
                    if (data.token) {
                        $scope.urgentToken = data.token;
                    } else {
                        $rootScope.showNotification("Error getting urgent token", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting urgent token", "fa-exclamation");
                });
        };

        $scope.getRates = function () {
            homesService.getRates($scope.getRatesObject, $scope.urgentToken)
                .then(function (data) {
                    if (angular.equals(data.errors, {})) {
                        $scope.rates = data.rates;
                        $scope.getSelectedRates();
                        $scope.noRates = false;
                    } else if (data.rates) {
                        for (error in data.errors) {
                            if (!data.errors[error].includes("valide") && !data.errors[error].includes("provid") && !data.errors[error].includes("Next Day Premiums")) { //Ignore the 'too big' and 'don't do DG' errors from API
                                $rootScope.showNotification(error + " " + data.errors[error], "fa-exclamation");
                            }
                        };
                        $scope.rates = data.rates;
                        $scope.getSelectedRates();
                        $scope.noRates = false;
                    } else {
                        for (error in data.errors) {
                            $rootScope.showNotification(error + " " + data.errors[error], "fa-exclamation");
                        };
                        $scope.rates = null;
                        $scope.noRates = true;
                        $scope.jobLoading = false;
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
                        $scope.jobLoading = false;
                    } else {
                        $rootScope.showNotification("Error getting rates", "fa-exclamation");
                        $scope.rates = null;
                        $scope.noRates = true;
                        $scope.jobLoading = false;
                    }
                })
        };

        $scope.bookJob = function () {
            if ($scope.bookJobInProgress)
                return;

            if (!$scope.booking.client.bookJobPermission) {
                $rootScope.showNotification("You do not have permission to book this job. Please contact Urgent via the live chat.", "fa-exclamation");
                $scope.jobLoading = false;
                return;
            };

            $scope.bookJobInProgress = true;

            homesService.bookJob($scope.bookJobObject, $scope.urgentToken)
                .then(function (data) {
                    if (data.errorsList == undefined || data.errorsList.length == 0) {
                        $scope.jobData = { jobID: data.jobID, jobNumber: data.jobNumber, trackingUrl: data.trackingUrl };

                        //Get this job incase it's bulk - for label printing (diff labels for bulk vs live)
                        $scope.getThisJob($scope.jobData.jobID, $scope.jobData.jobNumber, false);

                        $scope.setStep("jobBooked");
                        $scope.jobLoading = false;
                    } else {
                        for (error in data.errorsList) {
                            $rootScope.showNotification(data.errorsList[parseInt(error)].message, "fa-exclamation"); //If any have: data.errorsList[parseInt(error)].property + " " + 
                        };
                        $scope.jobData = null;
                        $scope.jobLoading = false;
                    }
                })
                .catch(function (response) {
                    if (response.data.errorsList) {
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

        $scope.getThisJob = function (jobId, jobNumber, prebook) {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            homesService.getThisJob(jobId, jobNumber, prebook)
                .then(function (data) {
                    if (data.success) {
                        $scope.thisJob = data.job;

                        if ($scope.step != 'jobList') {
                            $scope.printLabel();
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

        $scope.deleteJob = function (jobId, jobNumber) {
            if ($scope.deleteJobInProgress)
                return;

            $scope.deleteJobInProgress = true;

            homesService.deleteJob(jobId, jobNumber)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobData = null;
                        if ($scope.step != 'jobList') {
                            $scope.clearAll();
                        } else {
                            $scope.getContactJobs();
                        }
                        $rootScope.showNotification("Job cancelled successfully", "fa-check");
                    } else {
                        $rootScope.showNotification("Error cancelling job", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data.errors) {
                        for (error in response.data.errors) {
                            $rootScope.showNotification(error + " " + response.data.errors[error], "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error cancelling job", "fa-exclamation");
                    }
                })
                .finally(() => $scope.deleteJobInProgress = false);
        };

        $scope.printLabel = function () {
            if ($scope.printLabelInProgress)
                return;

            $scope.printLabelInProgress = true;

            homesService.getAPILabel($scope.thisJob.id, $scope.booking.labelSize, $scope.urgentToken)
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

        $scope.checkIfPrebook = function (job) {
            var now = new Date();
            var today = new Date(now);
            var date = new Date(job.date);
            var time = new Date(job.time);
            if (date > today || (date.getDate() == today.getDate() && (time.getHours() > today.getHours() || (time.getHours() == today.getHours() && time.getMinutes() > today.getMinutes())))) {
                return true;
            };
            return false;
        };

        $scope.getSpeedDescription = function (job) {
            if ($scope.speedDescriptionLoading)
                return;

            $scope.speedDescriptionLoading = true;

            var date = $filter('date')(job.date, 'yyyy-MM-dd') + "T" + job.timeHours + ":00.000Z";

            $scope.rerateObject = {
                speedId: job.speedId,
                sizeId: job.vehicleSize,
                From: {
                    streetAddress: job.fromAddress,
                    suburb: $scope.getSuburbName(job.fromAddressSuburbId),
                    suburbId: job.fromAddressSuburbId,
                    city: $scope.getSiteName(job.fromAddressSuburbId),
                    latitude: job.pickupLat,
                    longitude: job.pickupLong
                },
                To: {
                    streetAddress: job.toAddress,
                    suburb: $scope.getSuburbName(job.toAddressSuburbId),
                    suburbId: job.toAddressSuburbId,
                    city: $scope.getSiteName(job.toAddressSuburbId),
                    latitude: job.deliveryLat,
                    longitude: job.deliveryLong
                },
                //Packages: packages,
                weight: job.weight,
                quantity: job.quantity,
                isDangerousGoods: ((job.dgClass != null && job.dgClass != 0) || job.dgDocs) ?? false,
                isPrebook: $scope.checkIfPrebook(job),
                dateTime: date,
                bike: job.vehicleSize === 1,
                van: job.vehicleSize === 3,
                Truck: job.vehicleSize === 4 ? {
                    pickupTailLift: job.vehicleSize === 4 && job.jobItems != null ? job.jobItems.some(x => x.pu === true) : null,
                    dropoffTailLift: job.vehicleSize === 4 && job.jobItems != null ? job.jobItems.some(x => x.do === true) : null,
                    privateRes: job.vehicleSize === 4 && job.jobItems != null ? job.jobItems.some(x => x.privateRes === true) : null,
                    hasDGDocuments: job.dgDocs,
                    truckStartTime: date,
                    truckHours: 0
                } : null,
                ourReference: job.ourRef ?? null,
                clientReferenceA: job.clientRefA,
                clientReferenceB: job.clientRefB
            };

            homesService.getRerateAmount($scope.rerateObject, $scope.urgentToken)
                .then(function (data) {
                    if (data.success) {
                        $scope.speedDescription = data.rerate;
                        $scope.updateQuantity(job);
                    } else {
                        $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                })
                .finally(() => $scope.speedDescriptionLoading = false);
        };

        $scope.updateQuantity = function (job) {
            if ($scope.updateQuantityInProgress)
                return;

            $scope.updateQuantityInProgress = true;

            if ($scope.checkCancelValidity(job) && $scope.checkPriceDifference(job)) {
                job.newAmount = $scope.speedDescription.rate;
            } else {
                job.newAmount = null;
            };

            homesService.updateContactJob(job)
                .then(function (data) {
                    if (data.success) {
                        $rootScope.showNotification("Quantity updated successfully", "fa-check");
                        $scope.getFilteredContactJobs();
                    } else {
                        $rootScope.showNotification("Error updating quantity", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data.messages) {
                        for (error in response.data.messages) {
                            $scope.job.errors = [];
                            $scope.job.errors.push(response.data.messages[error].message);
                            $rootScope.showNotification(response.data.messages[error].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error updating quantity", "fa-exclamation");
                    }
                })
                .finally(() => $scope.updateQuantityInProgress = false);
        };

        $scope.updateBulkQuantity = function (job) {
            if ($scope.updateQuantityInProgress)
                return;

            $scope.updateQuantityInProgress = true;

            var quantityObject = {
                jobNumber: job.jobNumber,
                quantity: job.quantity
            };

            homesService.updateBulkQuantity(quantityObject, $scope.urgentToken)
                .then(function (data) {
                    if (data.success) {
                        $rootScope.showNotification("Bulk quantity updated successfully", "fa-check");
                        $scope.getFilteredContactJobs();
                    } else {
                        $rootScope.showNotification("Error updating bulk quantity", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error updating bulk quantity", "fa-exclamation");
                })
                .finally(() => $scope.updateQuantityInProgress = false);
        };

        /* --- Map Scheiße --- */

        $scope.$watch('booking.fromDetails', function (newValue, oldValue, scope) {
            setTimeout(function () {
                if ($scope.booking && $scope.booking.fromSearch && $scope.booking.fromDetails) {
                    if ($scope.booking.fromDetails.geometry && $scope.booking.fromDetails.address_components) {
                        if ($scope.booking.fromDetails.geometry.location) {
                            $scope.booking.fromLat = typeof $scope.booking.fromDetails.geometry.location.lat == "number" ? $scope.booking.fromDetails.geometry.location.lat : $scope.booking.fromDetails.geometry.location.lat();
                            $scope.booking.fromLong = typeof $scope.booking.fromDetails.geometry.location.lng == "number" ? $scope.booking.fromDetails.geometry.location.lng : $scope.booking.fromDetails.geometry.location.lng();
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("postal_code"))) {
                            $scope.booking.fromPostCode = $scope.booking.fromDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.booking.fromPostCode = null;
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
                            $scope.booking.fromSuburb = $scope.booking.fromDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.booking.fromSuburb = $scope.booking.fromDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.booking.fromSuburb = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.booking.fromCity = $scope.booking.fromDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.booking.fromCity = null;
                        }

                        if ($scope.booking.fromDetails.address_components.find(x => x.types.includes("subpremise"))) {
                            $scope.booking.fromSubpremise = $scope.booking.fromDetails.address_components.find(x => x.types.includes("subpremise")).long_name;
                        } else {
                            $scope.booking.fromSubpremise = null;
                        }

                        $scope.booking.fromStreetAddress = ($scope.booking.fromSubpremise ? $scope.booking.fromSubpremise + "/" : "") + ($scope.booking.fromStreetNum ? $scope.booking.fromStreetNum + " " : "") + ($scope.booking.fromStreetName ? $scope.booking.fromStreetName : "");

                        // Fill the selected address
                        $scope.booking.fromSearch = $scope.booking.fromStreetAddress + ", " + ($scope.booking.fromSuburb ? $scope.booking.fromSuburb : "");

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
                            $scope.booking.fromCompanyName = $scope.booking.fromDetails.name !== $scope.booking.fromStreetAddress ? $scope.booking.fromDetails.name : null;
                        }

                        $scope.booking.fromDeliveryAddress = $scope.booking.fromDetails.formatted_address;
                    }
                } else {
                    $scope.booking.fromLat = null;
                    $scope.booking.fromLong = null;
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
                        }

                        // get postcode
                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("postal_code"))) {
                            $scope.booking.toPostCode = $scope.booking.toDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.booking.toPostCode = null;
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
                            $scope.booking.toSuburb = $scope.booking.toDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.booking.toDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.booking.toSuburb = $scope.booking.toDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.booking.toSuburb = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.booking.toCity = $scope.booking.toDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.booking.toCity = null;
                        }

                        if ($scope.booking.toDetails.address_components.find(x => x.types.includes("subpremise"))) {
                            $scope.booking.toSubpremise = $scope.booking.toDetails.address_components.find(x => x.types.includes("subpremise")).long_name;
                        } else {
                            $scope.booking.toSubpremise = null;
                        }

                        $scope.booking.toStreetAddress = ($scope.booking.toSubpremise ? $scope.booking.toSubpremise + "/" : "") + ($scope.booking.toStreetNum ? $scope.booking.toStreetNum + " " : "") + ($scope.booking.toStreetName ? $scope.booking.toStreetName : "");

                        // Fill the selected address
                        $scope.booking.toSearch = $scope.booking.toStreetAddress + ", " + ($scope.booking.toSuburb ? $scope.booking.toSuburb : "");

                        if ($scope.booking.savedBookingSet && $scope.booking.toStreetAddress.includes($scope.booking.savedBooking.toAddressStreetName) && $scope.checkToCompanyName()) {
                            //to company already set in saved booking
                        } else if ($scope.booking.originalFromCompany && $scope.booking.originalFromCompany === $scope.booking.toCompanyName && $scope.checkToCompanyName()) {
                            //addresses swapped
                        } else if ($scope.toAddressBookCompanySaved) {
                            //to company set by address book
                        } else {
                            //new company name
                            $scope.booking.toCompanyName = $scope.booking.toDetails.name !== $scope.booking.toStreetAddress ? $scope.booking.toDetails.name : null;
                        }

                        $scope.booking.toDeliveryAddress = $scope.booking.toDetails.formatted_address;
                    }
                } else {
                    $scope.booking.toLat = null;
                    $scope.booking.toLong = null;
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

        /* --- Validation Scheiße --- */

        $scope.checkData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.booking.errors = [];

                //Address errors
                if (!$scope.booking.fromDetails) {
                    $scope.booking.errors.push("A valid From Address is required");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.toDetails) {
                    $scope.booking.errors.push("A valid To Address is required");
                    $(".loading").fadeOut();
                    return;
                }

                //Time errors
                if (!$scope.booking.deliveryDate) {
                    $scope.booking.errors.push("Pickup Date is required");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.deliveryTime) {
                    $scope.booking.errors.push("Pickup Time is required");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate > $scope.dateMaxDate) {
                    $scope.booking.errors.push("Pickup Date must be within the given range");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate < $scope.currDate) {
                    $scope.booking.errors.push("Pickup Date must not be in the past");
                    $(".loading").fadeOut();
                    return;
                }

                //Size errors
                if (!$scope.booking.stockSize) {
                    $scope.booking.errors.push("Package Size is required");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.quantity || $scope.booking.quantity < 1) {
                    $scope.booking.errors.push("Quantity is required");
                    $(".loading").fadeOut();
                    return;
                }

                //Dg errors
                //Checking these DG fields incase user using saved booking and skips going to DG page
                if ($scope.booking.dangerousGoods === true && $scope.booking.dangerousGoodsClass == null) {
                    $scope.booking.errors.push("DG class is required if sending dangerous goods");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.dangerousGoods === true && (typeof $scope.booking.dangerousGoodsDocs === "undefined" || $scope.booking.dangerousGoodsDocs == false)) {
                    $scope.booking.errors.push("You must have documentation to send dangerous goods with us");
                    $(".loading").fadeOut();
                    return;
                }

                //Truck errors
                if ($scope.booking.truck === true && $scope.booking.deliverTo == null) {
                    $scope.booking.errors.push("'Deliver to' is required for sending truck jobs");
                    $(".loading").fadeOut();
                    return;
                }

                //Tracking errors
                if ($scope.podShow('email') && !$scope.booking.podEmail) {
                    $scope.booking.errors.push("A valid Tracking Email is required");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.podShow('mobile') && !$scope.booking.podMobile) {
                    $scope.booking.errors.push("A valid Tracking Mobile is required");
                    $(".loading").fadeOut();
                    return;
                }

                //Contact errors
                if ($scope.booking.jobType !== "Pickup" && !$scope.booking.pickupContact) {
                    $scope.booking.errors.push("A valid Pickup Contact Name is required");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.sigNotRequired === "Other (add to 'Delivery Notes')" && !$scope.booking.deliveryNotes) {
                    $scope.booking.errors.push("'Signature not required' specifics are required in 'Delivery Notes'");
                    $(".loading").fadeOut();
                    return;
                }

                //Reference errors
                if ($scope.booking.client.referenceAMandatory && !$scope.booking.clientRefA) {
                    $scope.booking.errors.push("A valid Client Reference A is required");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.client.referenceBMandatory && !$scope.booking.clientRefB) {
                    $scope.booking.errors.push("A valid Client Reference B is required");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.jobLoading = true;
                $scope.prepareGetRatesObject();

                $(".loading").fadeOut();
            } catch (e) {
                console.log(e);
                $scope.booking.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkTimeData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.time.errors = [];

                if (!$scope.booking.deliveryDate) {
                    $scope.time.errors.push("Pickup Date is required");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.deliveryTime) {
                    $scope.time.errors.push("Pickup Time is required");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate > $scope.dateMaxDate) {
                    $scope.time.errors.push("Pickup Date must be within the given range");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate < $scope.currDate) {
                    $scope.time.errors.push("Pickup Date must not be in the past");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate == $scope.currDate && $scope.booking.deliveryTime < $scope.currTime) {
                    $scope.time.errors.push("Pickup Time must not be in the past");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.timeSaved = true;
                $('.time-modal').modal('hide');
                $scope.checkIfRatesReady();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.time.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkFilters = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.filter.errors = [];

                if (!$scope.filter.filters.dateFrom) {
                    $scope.filter.errors.push("You must enter a valid from date.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.filter.filters.dateTo) {
                    $scope.filter.errors.push("You must enter a valid to date.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.filter.filters.dateFrom > $scope.filter.filters.dateTo) {
                    $scope.filter.errors.push("To date must be on or after the from date.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.filter.filters.dateFrom.getFullYear() < 1999 || $scope.filter.filters.dateTo.getFullYear() < 1999) {
                    $scope.filter.errors.push("You must enter a date after 1998.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.getFilteredContactJobs();
                $('.filter-modal').modal('hide');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.filter.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        /* --- General Scheiße --- */

        $scope.setStep = function (label) {
            $scope.step = label;
        };

        $scope.openNewTab = function (url) {
            window.open(url, '_blank');
        };

        $scope.onSearchKeyDown = function (event) {
            //Search when user has pressed enter on search input only
            if (event.which !== 13 && event.keyCode !== 13)
                return;

            $scope.validateContact();
        };

        $scope.clearAll = function () {
            $scope.clearSavedBooking();
            $scope.booking.selectedRate = null;
            $scope.setStep("client");
        };

        $scope.openJobList = function () {
            $scope.getContactJobs();
            $scope.setStep('jobList');
        };

        /* --- Client Scheiße --- */

        $scope.setClient = function () {
            $scope.stockSizes = $scope.booking.client.stockSizes;
            if (!$scope.timeSaved) {
                $scope.setCurrentTime();
            }
            $scope.booking.stockSize = $scope.booking.client.stockSizes.find((e) => e.name == 'Polybin');

            $scope.sizeSaved = "basic";
            $scope.rates = null;

            $scope.checkData();
        };

        $scope.initClient = function () {
            $scope.setContact();
            $scope.getSavedJobs();
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

            //Only called once for non-internal single-client users after the getThisClient function has completed
            if ($scope.internal == false && $scope.clients.length == 1 && $scope.booking.client.bookJobPermission && !$scope.isCreditCardClient()) {
                $scope.setClient();
            }
        };

        $scope.setClientContactDefaults = function () {
            //jobSize
            $scope.booking.truck = $scope.booking.clientContact.defaultJobSize === 4;
            $scope.booking.vehicle = $scope.booking.clientContact.defaultJobSize === 4 ? "truck" : ($scope.booking.clientContact.defaultJobSize === 3 ? "van" :($scope.booking.clientContact.defaultJobSize === 1 ? "bike" : "car"));
            $scope.truckSaved = $scope.booking.clientContact.defaultJobSize === 4;
            $scope.booking.stockSize = $scope.booking.client.stockSizes.find((e) => e.id == $scope.booking.clientContact.defaultPackageSize);

            //tracking
            $scope.booking.proofOfDelivery = $scope.setProofOfDelivery($scope.booking.clientContact.defaultTrackingMethod);
            $scope.booking.podEmail = $scope.booking.clientContact.defaultTrackingEmail;
            $scope.booking.podMobile = $scope.booking.clientContact.defaultTrackingMobile;

            //jobType
            if ($scope.booking.clientContact.defaultJobType === 2 && $scope.booking.toDetails == null) {
                $scope.booking.jobType = "DeliverToUs";
                $scope.swapToFromAddress();
                $scope.getGeocodeData($scope.booking.client.address.replaceAll(" ", "+"), $scope.booking.client.suburb.replaceAll(" ", "+"), 'to');
                $scope.clientAddressDirection = "to";
            };

            //jobSpeed - chooses this or fastest non direct
            $scope.booking.presetSpeed = $scope.booking.clientContact.defaultJobSpeed;
        };

        $scope.setContactDetails = function () {
            $scope.booking.jobType = "Pickup";

            $scope.booking.pickupContact = $scope.booking.pickupContact ?? $scope.booking.clientContact.name;
            $scope.booking.pickupPhone = $scope.booking.pickupPhone ?? $scope.booking.clientContact.mobile;

            $scope.booking.podEmail = $scope.booking.podEmail ?? $scope.booking.clientContact.email;
            $scope.booking.podMobile = $scope.booking.podMobile ?? $scope.booking.clientContact.mobile;
        };

        $scope.clearClient = function () {
            $scope.contactValidated = false;
            $scope.booking.client = $scope.asureClient;
            $scope.booking.clientContact = null;
            $scope.booking.savedBooking = null;
            $scope.booking.quantity = 1;
            $scope.booking.password = null;
            $scope.clearSavedBooking();
            $scope.clearTime();
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
            $scope.setCurrentTime();
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

            $scope.getGeocodeData($scope.booking.savedBooking.fromAddressStreetName.replaceAll(" ", "+"),
                $scope.booking.savedBooking.fromSuburb.replaceAll(" ", "+"), 'from');

            $scope.getGeocodeData($scope.booking.savedBooking.toAddressStreetName.replaceAll(" ", "+"),
                $scope.booking.savedBooking.toSuburb.replaceAll(" ", "+"), 'to');

            //$scope.booking.stockSize = $scope.stockSizes.find(x => x.id == $scope.booking.savedBooking.size);
            $scope.booking.presetSpeed = $scope.booking.savedBooking.speed;
            $scope.formatBookingTimeForFrontend();

            $scope.booking.truck = $scope.booking.savedBooking.truck;
            $scope.booking.vehicle = $scope.booking.savedBooking.truck ? "truck" : ($scope.booking.savedBooking.size === 3 ? "van" : ($scope.booking.savedBooking.size === 1 ? "bike" : "car"));
            $scope.truckSaved = $scope.booking.savedBooking.truck;
            $scope.booking.tailLiftPickup = $scope.booking.savedBooking.truckTailliftPU;
            $scope.booking.tailLiftDropoff = $scope.booking.savedBooking.truckTailliftDO;
            $scope.booking.deliverTo = $scope.booking.savedBooking.truckPrivateResidence === 1 ? "Residential" : "Business";
        };

        $scope.clearSavedBooking = function () {
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

        $scope.clearSaved = function () {
            $scope.booking.savedBookingSet = false;
            $scope.booking.presetSpeed = null;
            $scope.booking.savedBooking = null;
            $scope.booking.newSavedBookingName = null;
        };

        $scope.formatBookingTimeForFrontend = function () {
            var currentTime = Date.now();
            if ($scope.booking.savedBooking.bookingTime != null) {
                var year = $scope.booking.deliveryDate.getFullYear();
                var month = String($scope.booking.deliveryDate.getMonth() + 1).padStart(2, '0');
                var day = String($scope.booking.deliveryDate.getDate()).padStart(2, '0');
                var hours = $scope.booking.savedBooking.bookingTime.substring(11, 13);
                var minutes = $scope.booking.savedBooking.bookingTime.substring(14, 16);

                $scope.booking.deliveryTime = new Date(year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00");

                if (currentTime > $scope.booking.deliveryTime) {
                    $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 1);
                }

                $scope.timeSaved = true;
            } else {
                $scope.clearTime();
            };
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

        $scope.setAddressDetails = function (address, direction) {
            var suburbName = address.suburbName ?? (address.toSuburbId ? $scope.getSuburbName(address.toSuburbId) : "");

            if (direction == "from") {
                $scope.booking.fromSearch = address.addressStreetName + (address.toSuburbId ? ((address.addressStreetName ? ", " : "") + suburbName) : "");
                $scope.booking.fromCompanyName = address.addressCompanyName;
                if (address.addressExtras || address.addressExtras2) {
                    $scope.booking.fromExtra = address.addressExtras ?? "" + (address.addressExtras2 ? (address.addressExtras ? ", " : "") + address.addressExtras2 : "");
                };
            } else if (direction == "to") {
                $scope.booking.toSearch = address.addressStreetName + (address.toSuburbId ? ((address.addressStreetName ? ", " : "") + suburbName) : "");
                $scope.booking.toCompanyName = address.addressCompanyName;
                if (address.addressExtras || address.addressExtras2) {
                    $scope.booking.toExtra = address.addressExtras ?? "" + (address.addressExtras2 ? (address.addressExtras ? ", " : "") + address.addressExtras2 : "");
                };
            };

            $scope.fromAddressBookCompanySaved = address.addressCompanyName != null && direction == "from" ? true : false;
            $scope.toAddressBookCompanySaved = address.addressCompanyName != null && direction == "to" ? true : false;
            $scope.getGeocodeData(address.addressStreetName.replaceAll(" ", "+"), $scope.getSuburbName(address.toSuburbId).replaceAll(" ", "+"), direction);
        };

        $scope.getSuburbName = function (suburbId) {
            var index = $scope.suburbs.findIndex(function (item, i) {
                return item.id === suburbId
            });
            return $scope.suburbs[index].name;
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

        $scope.getSiteName = function (suburbId) {
            var index = $scope.suburbs.findIndex(function (item, i) {
                return item.id === suburbId
            });
            var siteId = $scope.suburbs[index].siteId;

            var index2 = $scope.sites.findIndex(function (item, i) {
                return item.id === siteId
            });
            return $scope.sites[index2].name;
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
            $scope.timeSaved = false;
            $scope.time.errors = [];
        };

        $scope.timeBack = function () {
            $scope.time.errors = [];
            if (!$scope.timeSaved) {
                $scope.setCurrentTime();
            };
        };

        $scope.getDate = function () {
            var today = new Date();
            var year = today.getFullYear();
            var month = String(today.getMonth() + 1).padStart(2, '0');
            var day = String(today.getDate()).padStart(2, '0');

            $scope.currDate = new Date(year, (parseInt(month) - 1), day);

            $scope.minDate = year + "-" + month + "-" + day;

            if ($scope.booking.client && $scope.booking.client.stripeClient) {
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
            return (day + " " + month + ", " + time);
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
        };

        $scope.openTimeModal = function () {
            if (!$scope.timeSaved) {
                $scope.setCurrentTime();
            };
            $('.time-modal').modal({ backdrop: 'static', keyboard: false });
        };

        $scope.validDate = function (selectedDate) {
            return selectedDate ? selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) <= 9 ? "0" : "") + (selectedDate.getMonth() + 1) + "-" +
                (selectedDate.getDate() <= 9 ? "0" : "") + selectedDate.getDate() + "T00:00:00" : null;
        };

        /* --- Size Scheiße --- */

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

        $scope.intQuantitySelected = function () {
            if (typeof $scope.selectedJob.quantity === 'string') {
                $scope.selectedJob.quantity = parseInt($scope.selectedJob.quantity);

                if ($scope.selectedJob.quantity >= 999) {
                    $scope.selectedJob.quantity = 999;
                } else if ($scope.selectedJob.quantity <= 1) {
                    $scope.selectedJob.quantity = 1;
                }
            };
        };

        /* --- Truck Scheiße --- */

        $scope.getPackageSizeString = function () {
            var palletString = $scope.booking.quantity + " Pallets: " + $scope.booking.quantity + " @ " + ($scope.booking.stockSize.length / 100) + "(L) x " + ($scope.booking.stockSize.width / 100) + "(W) x "
                + ($scope.booking.stockSize.height / 100) + "(H) - " + $scope.booking.stockSize.weight + "(KG)";

            return palletString.replace(/,\s*$/, "");
        };

        /* --- Rates Scheiße --- */

        $scope.checkIfRatesReady = function () {
            if ($scope.booking.toDetails && $scope.booking.fromDetails && $scope.booking.fromSearch && ($scope.booking.stockSize && $scope.booking.quantity)) {
                $scope.prepareGetRatesObject();
            } else {
                $scope.rates = null;
                $scope.booking.selectedRate = null;
            };
        };

        $scope.prepareGetRatesObject = function () {
            $scope.ratesLoading = true;
            $scope.booking.selectedRate = null;
            $scope.findJobType();
            $scope.getPackagesObject();

            $scope.getRatesObject = {
                from: {
                    companyName: $scope.booking.fromCompanyName ?? $scope.getCompanyName("from"),
                    buildingName: null,
                    streetAddress: $scope.getStreetAddress("from"),
                    suburb: $scope.booking.fromSuburb,
                    city: $scope.booking.fromCity,
                    postCode: $scope.booking.fromPostCode,
                    countryCode: "NZ",
                    latitude: $scope.booking.fromLat,
                    longitude: $scope.booking.fromLong
                },
                to: {
                    companyName: $scope.booking.toCompanyName ?? $scope.getCompanyName("to"),
                    buildingName: null,
                    streetAddress: $scope.getStreetAddress("to"),
                    suburb: $scope.booking.toSuburb,
                    city: $scope.booking.toCity,
                    postCode: $scope.booking.toPostCode,
                    countryCode: "NZ",
                    latitude: $scope.booking.toLat,
                    longitude: $scope.booking.toLong
                },
                packages: $scope.booking.packageList,

                isSaturdayDelivery: $scope.booking.deliveryDate.getDay() == 6,
                isDangerousGoods: (typeof $scope.booking.dangerousGoods !== 'undefined' && $scope.booking.dangerousGoods == true),
                isPrebook: !$scope.checkIfCurrentDateTime(),
                dateTime: $scope.combineDateTime(),
                jobType: $scope.booking.jobType,
                vehicleSizeId: ($scope.booking.vehicle == "van" ? 3 : ($scope.booking.vehicle == "bike" ? 1 : ($scope.booking.truck == true ? 4 : 2))),
                van: $scope.booking.truck == true ? false : $scope.booking.vehicle == "van" ? true : $scope.booking.van,
                bike: $scope.booking.truck == true ? false : $scope.booking.vehicle == "bike",
                truck: $scope.booking.truck == true ? {
                    pickupTailLift: $scope.booking.tailLiftPickup,
                    dropoffTailLift: $scope.booking.tailLiftDropoff,
                    privateRes: $scope.booking.deliverTo == 'Residential' ? true : false,
                    hasDGDocuments: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsDocs : null,
                    truckStartTime: null,
                    truckHours: null
                } : null,
                ourReference: null,
                clientReferenceA: $scope.booking.clientRefA ?? null,
                clientReferenceB: $scope.booking.clientRefB ?? null
            };

            $scope.getRates();
        };

        $scope.getPackagesObject = function () {
            var packageList = [];
            packageList.push({
                name: $scope.booking.stockSize.name,
                length: $scope.booking.stockSize.length,
                width: $scope.booking.stockSize.width,
                height: $scope.booking.stockSize.height,
                kg: $scope.booking.stockSize.weight,
                type: null,
                packageCode: null,
                units: $scope.booking.quantity
            });

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
            // var fromSuburb = $scope.booking.fromSuburb ? $scope.booking.fromSuburb.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu

            var toAddress = $scope.getStreetAddress("to");
            var toLastIndex = toAddress.lastIndexOf(" ");
            var toTrimmedAddress = toLastIndex != null ? toAddress.substring(0, toLastIndex) : toAddress;
            //var toSuburb = $scope.booking.toSuburb ? $scope.booking.toSuburb.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu

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

        $scope.getSelectedRates = function () {
            if ($scope.rates.length === 0)
                return;

            for (i in $scope.rates) { //Get speed ids from schedule ids e.g. 24124 -> 124
                var speedLength = $scope.rates[i].quoteId.length;
                if (speedLength >= 4) {
                    $scope.rates[i].actualSpeedId = parseInt($scope.rates[i].quoteId.substring(speedLength - 3, speedLength));
                } else {
                    $scope.rates[i].actualSpeedId = $scope.rates[i].speedId;
                }
            }

            $scope.matchAndApplySelectedRate($scope.booking.presetSpeed);
        };

        $scope.matchAndApplySelectedRate = function (speedId) {
            var matchingSpeeds = $scope.rates.filter(x => x.actualSpeedId === speedId);
            var foundSpeed;

            if (matchingSpeeds.length == 1) {
                foundSpeed = matchingSpeeds[0];
            } else if (matchingSpeeds.length > 1) { //finds earliest booktime in case of schedule
                foundSpeed = matchingSpeeds.reduce((prev, curr) => prev.bookDate < curr.bookDate ? prev : curr);
            }

            if (typeof foundSpeed !== 'undefined') {
                foundSpeed.selected = true;
                $scope.booking.selectedRate = foundSpeed;
                $scope.getJobData();
                $scope.jobLoading = true;
            } else {
                $scope.booking.selectedRate = null;
                $scope.jobLoading = false;
                $scope.booking.errors.push("Could not find a speed matching this saved booking.");

            }
        };

        $scope.fixedDecimal = function (x) {
            return Number.parseFloat(x.slice(2)).toFixed(2);
        };

        /* --- Extra Scheiße ---*/

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

        $scope.getJobData = function () {
            $scope.bookJobObject = {
                quoteId: $scope.booking.selectedRate.quoteId,
                speedId: $scope.booking.selectedRate.speedId,
                jobType: $scope.booking.jobType,
                pickup: {
                    name: $scope.booking.clientContact.name,
                    contactPerson: $scope.booking.pickupContact != null && $scope.booking.pickupContact !== "" ? $scope.booking.pickupContact : ".",
                    phoneNumber: $scope.booking.pickupPhone,
                    from: {
                        companyName: $scope.booking.fromCompanyName ?? $scope.getCompanyName("from"),
                        buildingName: $scope.booking.fromExtra,
                        streetAddress: $scope.getStreetAddress("from"),
                        suburb: $scope.booking.fromSuburb,
                        city: $scope.booking.fromCity,
                        postCode: $scope.booking.fromPostCode,
                        countryCode: "NZ",
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
                        suburb: $scope.booking.toSuburb,
                        city: $scope.booking.toCity,
                        postCode: $scope.booking.toPostCode,
                        countryCode: "NZ",
                        latitude: $scope.booking.toLat,
                        longitude: $scope.booking.toLong
                    },
                    notes: ($scope.booking.deliveryNotes ?? "") + ($scope.booking.sigNotRequired != null && $scope.booking.sigNotRequired != "Other (add to 'Delivery Notes')" ? " " + $scope.booking.sigNotRequired : ""), //append leave location.
                },
                packages: $scope.booking.packageList,
                dateTime: $scope.booking.selectedRate.bookDate ?? $scope.combineDateTime(), //Use speed's booktime/date for schedules (non-schedules use date passed in getRates request)
                jobNotificationType: $scope.booking.proofOfDelivery != null ? $scope.booking.proofOfDelivery : "WEBSITE",
                jobNotificationEmail: $scope.podShow("email") === true ? $scope.booking.podEmail : null,
                jobNotificationMobile: $scope.podShow("mobile") === true ? $scope.booking.podMobile : null,
                isSignatureRequired: $scope.sigNotRequired == null ? true : false,
                isSaturdayDelivery: $scope.booking.deliveryDate.getDay() == 6,
                isDangerousGoods: (typeof $scope.booking.dangerousGoods !== 'undefined' && $scope.booking.dangerousGoods == true),
                hasDGDocument: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsDocs : null,
                dgClass: $scope.booking.dangerousGoods === true ? $scope.booking.dangerousGoodsClass : null,
                clientReferenceA: $scope.booking.clientRefA,
                clientReferenceB: $scope.booking.clientRefB,
                clientNotes: $scope.booking.clientNotes,
                onHold: false,
                vehicleSizeId: ($scope.booking.vehicle == "van" ? 3 : ($scope.booking.vehicle == "bike" ? 1 : ($scope.booking.truck == true ? 4 : 2))),
                van: $scope.booking.truck == true ? false : $scope.booking.vehicle == "van" || $scope.booking.van,
                bike: $scope.booking.truck == true ? false : $scope.booking.vehicle == "bike",
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
                sourceId: 14, //asure booking page
                pickupReadyDateTime: $scope.booking.selectedRate.bookDate ? $scope.combineDateTime() : null,
                loggedInContactId: $scope.booking.clientContact.id
            };

            $scope.bookJob();
        };

        /* --- Confirmation Scheiße --- */

        $scope.getConfirmationAddress = function (direction) {
            if (direction == "from") {
                return ($scope.booking.pickupContact ? $scope.booking.pickupContact + ($scope.booking.pickupPhone ? " - " + $scope.booking.pickupPhone : "") + ",\n" : "") +
                    ($scope.booking.fromCompanyName ? $scope.booking.fromCompanyName + ",\n" : ($scope.getCompanyName("from") ? $scope.getCompanyName("from") + ",\n" : "")) +
                    ($scope.booking.fromExtra != null ? $scope.booking.fromExtra + ",\n" : "") +
                    ($scope.getStreetAddress("from") ? $scope.getStreetAddress("from") + ",\n" : "") + ($scope.booking.fromSuburb ? $scope.booking.fromSuburb + ",\n" : "") +
                    ($scope.booking.fromCity ? $scope.booking.fromCity + ($scope.booking.fromPostCode ? " " + $scope.booking.fromPostCode : "") : "");
            } else {
                return ($scope.booking.deliveryContact ? $scope.booking.deliveryContact + ($scope.booking.deliveryPhone ? " - " + $scope.booking.deliveryPhone : "") + ",\n" : "") +
                    ($scope.booking.toCompanyName ? $scope.booking.toCompanyName + ",\n" : ($scope.getCompanyName("to") ? $scope.getCompanyName("to") + ",\n" : "")) +
                    ($scope.booking.toExtra != null ? $scope.booking.toExtra + ",\n" : "") +
                    ($scope.getStreetAddress("to") ? $scope.getStreetAddress("to") + ",\n" : "") + ($scope.booking.toSuburb ? $scope.booking.toSuburb + ",\n" : "") +
                    ($scope.booking.toCity ? $scope.booking.toCity + ($scope.booking.toPostCode ? " " + $scope.booking.toPostCode : "") : "");
            };
        };

        $scope.openLabelModal = function (job, jobId) {
            if ($scope.step === 'jobList') {
                $scope.getThisJob(job.id, job.jobNumber, job.recurring);
            } else {
                $scope.thisJob.id = jobId;
            };

            $('.printLabel-modal').modal();
        };

        $scope.openTracking = function (job) {
            window.open(job.trackingUrl, '_blank');
        };

        /* --- Job List Scheiße --- */

        $scope.checkCancelValidity = function (job) {
            var status = $scope.getStatusName(job.status, job.speedId);

            if (job.status === 0 || job.status === 10000 || status === "Booked" || status === "Assigned") {
                return true;
            } else {
                return false;
            }
        };

        $scope.getStatusName = function (statusId, speedId) {
            //Prebook
            if (statusId === 10000) {
                return "Prebook";
            };

            var index = $scope.jobTypeStatuses.findIndex(function (item, i) {
                return item.jobTypeId === speedId && item.jobStatusId === statusId
            });
            return index !== -1 ? $scope.jobTypeStatuses[index].name : null;
        };

        $scope.getLocationName = function (undeliverableLocationId) {
            var index = $scope.undeliverableLocations.findIndex(function (item, i) {
                return item.id === undeliverableLocationId
            });
            return index !== -1 ? $scope.undeliverableLocations[index].name : null;
        };

        $scope.getSpeedName = function (speedId) {
            var index = $scope.speeds.findIndex(function (item, i) {
                return item.id === speedId
            });
            return $scope.speeds[index].name;
        };

        $scope.openFilterModal = function () {
            $('.filter-modal').modal();
        };

        $scope.clearFilters = function () {
            $scope.filter.filters = {};
            $scope.filter.filters.dateFrom = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.filter.filters.dateFrom.setDate($scope.filter.filters.dateFrom.getDate() - 3);
            $scope.filter.filters.dateTo = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.filter.filters.dateTo.setDate($scope.filter.filters.dateTo.getDate() + 3);
        };

        $scope.clearAndGetFiltered = function () {
            $scope.clearFilters();
            $scope.getFilteredContactJobs();
        };

        $scope.jobListBack = function () {
            $scope.clearFilters();
            $scope.jobs = null;
            $scope.setStep('client');
        };

        $scope.openCancelModal = function (job) {
            $scope.selectedJob = job;
            $('.cancel-modal').modal();
        };

        $scope.openQuantityModal = function (job) {
            $scope.selectedJob = JSON.parse(JSON.stringify(job));
            $scope.selectedJob.originalQuantity = $scope.selectedJob.quantity;
            $('.quantity-modal').modal();
        };

        $scope.updateJobQuantity = function (job) {
            if (job.jobRelationshipId === 19) { //jobrelationshiptypeid
                $scope.updateBulkQuantity(job);
            } else {
                $scope.setJobWeight(job);
            }
        };

        $scope.setJobWeight = function (job) {
            var weightPerJob = job.weight / job.originalQuantity;
            job.weight = weightPerJob * job.quantity;
            $scope.getSpeedDescription(job);
        };

        $scope.checkPriceDifference = function (job) {
            if (job && job.amount && $scope.speedDescription && $scope.speedDescription.rate) {
                return Math.abs(job.amount - $scope.speedDescription.rate) >= 0.01;
            };
        };

        /* --- Init --- */

        $scope.prepareAll = function () {
            $scope.clients = [];
            $scope.contacts = [];
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
            $scope.setCurrentTime();
            $scope.booking.deliverTo = "Business";
            $scope.booking.quantity = 1;
            $scope.booking.proofOfDelivery = "EMAILANDTEXT";
            $scope.booking.van = false;
            $scope.contactValidated = false;
            $scope.asureClient = null;
            $scope.filter = {};
            $scope.filter.filters = {};
            $scope.filter.filters.dateFrom = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.filter.filters.dateFrom.setDate($scope.filter.filters.dateFrom.getDate() - 3);
            $scope.filter.filters.dateTo = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.filter.filters.dateTo.setDate($scope.filter.filters.dateTo.getDate() + 3);
        };

        $scope.retrieveAll = function () {
            $scope.getThisClient();
            $scope.getSuburbs();
            $scope.getSites();
            $scope.getJobTypeStatuses();
            $scope.getUndeliverableLocations();
            $scope.getSpeeds();
            $scope.getManualAPIData();
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "UrgentBook Home";

            $scope.prepareAll();
            $scope.retrieveAll();

            $(".page-loading").stop().fadeOut(100);
        }();
    }]);
