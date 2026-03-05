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
    .controller("desktopHomeControl", ["$rootScope", "$scope", "$state", "$timeout", "homesService", "NgMap", "GeoCoder", function ($rootScope, $scope, $state, $timeout, homesService, NgMap, GeoCoder) {

        /* --- Pickup & Delivery Accessorials (testbed mockup) --- */
        $scope.pickupAccessorialsOpen = false;
        $scope.deliveryAccessorialsOpen = false;

        $scope.pickupAccessorials = [
            { id: 1, name: 'Tail Lift Required', amount: 25.00, selected: false },
            { id: 2, name: 'Hand Unload', amount: 15.00, selected: false },
            { id: 3, name: 'Inside Pickup (Beyond Door)', amount: 20.00, selected: false },
            { id: 4, name: 'Pallet Jack Required', amount: 30.00, selected: false },
            { id: 5, name: 'Stairs (per flight)', amount: 10.00, selected: false },
            { id: 6, name: 'Wait Time (per 15 min)', amount: 12.50, selected: false }
        ];

        $scope.deliveryAccessorials = [
            { id: 7, name: 'Tail Lift Required', amount: 25.00, selected: false },
            { id: 8, name: 'Hand Unload', amount: 15.00, selected: false },
            { id: 9, name: 'Inside Delivery (Beyond Door)', amount: 20.00, selected: false },
            { id: 10, name: 'Pallet Jack Required', amount: 30.00, selected: false },
            { id: 11, name: 'Stairs (per flight)', amount: 10.00, selected: false },
            { id: 12, name: 'Wait Time (per 15 min)', amount: 12.50, selected: false },
            { id: 13, name: 'Residential Delivery', amount: 8.00, selected: false }
        ];

        $scope.getSelectedPickupAccessorials = function () {
            return $scope.pickupAccessorials.filter(function (a) { return a.selected; });
        };

        $scope.getSelectedDeliveryAccessorials = function () {
            return $scope.deliveryAccessorials.filter(function (a) { return a.selected; });
        };

        /* --- API Scheiße --- */

        $scope.getClients = function () {
            homesService.getClients()
                .then(function (data) {
                    if (data.success) {
                        $scope.clients = data.clients;

                        $scope.hideForCreditCard();

                        $state.current.data.contactId = $scope.clients[0].loggedInContactId;

                        if ($scope.countryCode == 'NZ' && $scope.clients[0].id != 9196) {
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
            return homesService.getVehicleSizes($scope.booking.client.id)
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

        $scope.getReferences = function (letter) {
            homesService.getReferences($scope.booking.client.id, letter)
                .then(function (data) {
                    if (data.success) {
                        if (letter === "A") {
                            $scope.referencesA = data.references;
                            $scope.referencesAOriginal = JSON.parse(JSON.stringify(data.references));
                        } else {
                            $scope.referencesB = data.references;
                            $scope.referencesBOriginal = JSON.parse(JSON.stringify(data.references));
                        };
                    } else {
                        $rootScope.showNotification("Error getting references", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting references", "fa-exclamation");
                });
        };

        $scope.saveReferenceChanges = function (letter) {
            if ($scope.subChangeInProgress)
                return;

            $scope.subChangeInProgress = true;

            var oldRefs = [];
            var newRefs = [];

            if (letter === "A") {
                for (let i = 0; i < $scope.referencesAOriginal.length; i++) {
                    oldRefs.push($scope.referencesAOriginal[i].name);
                }
                for (let i = 0; i < $scope.referencesA.length; i++) {
                    newRefs.push($scope.referencesA[i].name);
                }
            } else {
                for (let i = 0; i < $scope.referencesBOriginal.length; i++) {
                    oldRefs.push($scope.referencesBOriginal[i].name);
                }
                for (let i = 0; i < $scope.referencesB.length; i++) {
                    newRefs.push($scope.referencesB[i].name);
                }
            }

            subDiff = oldRefs.filter(x => !newRefs.includes(x));
            subDiffIds = letter === "A" ? $scope.referencesAOriginal.filter(x => subDiff.includes(x.name)) : $scope.referencesBOriginal.filter(x => subDiff.includes(x.name));

            addDiff = newRefs.filter(x => !oldRefs.includes(x));

            var deletePromises = [];
            for (i in subDiffIds) {
                data = { "id": $scope.booking.client.id, "refId": subDiffIds[i].id, "letter": letter };
                deletePromises.push(homesService.deleteReference(data));
            };

            Promise.all(deletePromises)
                .then(function (data) {
                    var createPromises = [];
                    for (i in addDiff) {
                        data = { "id": $scope.booking.client.id, "refName": addDiff[i], "letter": letter };
                        createPromises.push(homesService.createReference(data));
                    }
                    Promise.all(createPromises)
                        .then(function (data) {
                            $rootScope.showNotification("References updated successfully", "fa-check");
                            $scope.getReferences(letter);
                        })
                        .catch(function () {
                            $rootScope.showNotification("Error adding new references", "fa-exclamation");
                        })
                        .finally(() => $scope.subChangeInProgress = false);
                })
                .catch(function () {
                    $rootScope.showNotification("Error removing old references", "fa-exclamation");
                    $scope.subChangeInProgress = false;
                });
        };

        $scope.getAddressBook = function () {
            return homesService.getAddressBook($scope.booking.client.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.addressBook = data.addressBook;
                    } else {
                        $rootScope.showNotification("Error getting address book", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting address book", "fa-exclamation");
                });
        };

        $scope.getAllowedSpeeds = function () {
            homesService.getAllowedSpeeds()
                .then(function (data) {
                    if (data.success) {
                        $scope.allowedSpeeds = data.speeds;
                    } else {
                        $rootScope.showNotification("Error getting allowed speeds", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting allowed speeds", "fa-exclamation");
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

        $scope.getSpeeds = function () {
            return homesService.getSpeeds($scope.booking.client.id)
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

        $scope.updateSavedBooking = function () {
            if ($scope.savedBookingSaveInProgress)
                return;

            $scope.savedBookingSaveInProgress = true;

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
                })
                .finally(() => $scope.savedBookingSaveInProgress = false);
        };

        $scope.createSavedBooking = function () {
            if ($scope.savedBookingSaveInProgress)
                return;

            $scope.savedBookingSaveInProgress = true;

            homesService.createSavedBooking($scope.booking.client.id, $scope.booking.savedBooking)
                .then(function (data) {
                    if (data.success) {
                        $scope.booking.savedBooking = data.jobSaved;
                        $rootScope.showNotification("Your saved booking '" + data.jobSaved.name + "' has been successfully created!", "fa-check");
                        $scope.getSavedJobs();
                    } else {
                        $scope.booking.savedBooking = { id: null, name: "-- None Selected --" };
                        $rootScope.showNotification("Error creating your saved booking", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    $scope.booking.savedBooking = { id: null, name: "-- None Selected --" };
                    if (response.data) {
                        if (response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error creating your saved booking", "fa-exclamation");
                    }
                })
                .finally(() => $scope.savedBookingSaveInProgress = false);
        };

        $scope.getPricingBreakdown = function () {
            if ($scope.speedDescriptionLoading)
                return;

            $scope.speedDescriptionLoading = true;

            try {
                var jobObject = {
                    id: 1,
                    clientId: $scope.booking.client.id,
                    americanFromCompany: $scope.booking.fromCompanyName,
                    americanFromZip: $scope.booking.fromZipCode,
                    americanFromState: $scope.booking.fromState,
                    americanToCompany: $scope.booking.toCompanyName,
                    americanToZip: $scope.booking.toZipCode,
                    americanToState: $scope.booking.toState,
                    weight: $scope.booking.totalBasicWeight > 0 ? $scope.booking.totalBasicWeight : $scope.getTotalWeightBoth(),
                    quantity: $scope.booking.stockSize ? $scope.booking.quantity : $scope.getTotalQuantityBoth(),
                    cubic: $scope.getCubicSumBoth(),
                    dryIceWeight: $scope.booking.dangerousGoods === true ? $scope.booking.dryIceWeight : null,
                    vehicleSize: $scope.booking.vehicle.id,
                    speedId: $scope.booking.selectedRate.speedId,
                    dgDocs: $scope.booking.dangerousGoodsDocs,
                    date: $scope.validDate($scope.booking.deliveryDate),
                    timeHours: $scope.booking.deliveryTime.getHours().toString().padStart(2, "0") + ":" + $scope.booking.deliveryTime.getMinutes().toString().padStart(2, "0"),
                    pickupLat: $scope.booking.fromLat,
                    pickupLong: $scope.booking.fromLong,
                    deliveryLat: $scope.booking.toLat,
                    deliveryLong: $scope.booking.toLong,
                    archived: false, bookedBy: "not used", jobNumber: "not used", isBulk: 0, dimensionsType: $scope.booking.dimensionsType
                };
            } catch (error) {
                $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                $scope.speedDescriptionLoading = false;
            }

            homesService.getSpeedDescription(jobObject)
                .then(function (data) {
                    if (data.success) {
                        $scope.speedDescription = data.speedDescription;
                        $scope.splitDescription();
                    } else {
                        $scope.speedDescription = null;
                        $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $scope.speedDescription = null;
                    $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                })
                .finally(() => $scope.speedDescriptionLoading = false);
        };

        $scope.getRerateAmount = function () {
            if ($scope.speedDescriptionLoading)
                return;

            $scope.speedDescriptionLoading = true;

            homesService.getRerateAmount($scope.rerateObject, $scope.urgentToken)
                .then(function (data) {
                    if (data.success) {
                        $scope.speedDescription = data.rerate;
                        $scope.splitDescription();
                    } else {
                        $scope.speedDescription = null;
                        //$rootScope.showNotification("Error getting rerate amount for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $scope.speedDescription = null;
                    //$rootScope.showNotification("Error getting rerate amount for this job", "fa-exclamation");
                })
                .finally(() => $scope.speedDescriptionLoading = false);
        };

        $scope.getAccessorialCharges = function () {
            if (!$scope.booking.selectedRate || !$scope.booking.selectedRate.accessorialChargeGroupId) {
                $scope.accessorialCharges = [];
                $scope.currentAccessorialChargeGroupId = null;
                $scope.accessorialChargesInitialized = false;
                return;
            }

            if ($scope.accessorialChargesLoading) return;

            // Check if this is the same rate group AND charges are already initialized
            // Only preserve if we've fully processed charges before
            var isSameGroup = $scope.currentAccessorialChargeGroupId === $scope.booking.selectedRate.accessorialChargeGroupId
                && $scope.accessorialChargesInitialized
                && $scope.accessorialCharges && $scope.accessorialCharges.length > 0;

            var previousSelections = {};
            var previousInputValues = {};

            if (isSameGroup && $scope.accessorialCharges) {
                $scope.accessorialCharges.forEach(charge => {
                    previousSelections[charge.accessorialChargeId] = charge.selected;
                    previousInputValues[charge.accessorialChargeId] = charge.inputValue;
                });
            }

            // If same group and initialized, just update values without re-fetching
            if (isSameGroup) {
                $scope.updateAutoPopulatedChargeValues();
                return;
            }

            $scope.accessorialChargesLoading = true;

            homesService.getAccessorialCharges($scope.booking.selectedRate.accessorialChargeGroupId, $scope.booking.client.id, $scope.booking.selectedRate.speedId, $scope.booking.vehicle.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.accessorialCharges = data.charges;

                        $scope.processAccessorialCharges(false, {}, {});

                        $scope.currentAccessorialChargeGroupId = $scope.booking.selectedRate.accessorialChargeGroupId;
                        $scope.accessorialChargesInitialized = true;
                    } else {
                        $rootScope.showNotification("Error getting accessorial charges", "fa-exclamation");
                        $scope.accessorialCharges = [];
                        $scope.currentAccessorialChargeGroupId = null;
                        $scope.accessorialChargesInitialized = false;
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting accessorial charges", "fa-exclamation");
                    $scope.accessorialCharges = [];
                    $scope.currentAccessorialChargeGroupId = null;
                    $scope.accessorialChargesInitialized = false;
                })
                .finally(() => {
                    $scope.accessorialChargesLoading = false;
                });
        };

        $scope.getManualAPIData = function () {
            $scope.dangerousGoodsClasses = [
                { value: 1, name: "Class 1 - Explosives" },
                { value: 2, name: "Class 2 - Gases" },
                { value: 3, name: "Class 3 - Flammable Liquids" },
                { value: 4, name: "Class 4 - Flammable Solids" },
                { value: 5, name: "Class 5 - Oxidizing Substances" },
                { value: 6, name: "Class 6 - Toxic Substances" },
                { value: 7, name: "Class 7 - Radioactive Materials" },
                { value: 8, name: "Class 8 - Corrosive Substances" },
                { value: 9, name: "Class 9 - Miscellaneous (Dry Ice)" }
            ];
            $scope.proofOfDeliveries = [{ value: "EMAIL", name: "Email" }, { value: "TEXT", name: "Text" }, { value: "EMAILANDTEXT", name: "Email & Text" }]; //Null is "WEBSITE"
            $scope.signatureNotRequireds = [{ value: "Letter Box" }, { value: "Front Door" }, { value: "Back Door" }, { value: "Safe Place" }, { value: "Other (add to 'Delivery Notes')" }]; //Null is sig required
            $scope.labelSizes = [{ value: 1, name: "Label (100 X 174mm)" }, { value: 2, name: "Label (100 X 150mm)" }]; //Null is PDF
            $scope.badRegionalSpeedIds = [1, 2, 3, 4, 20, 24, 25, 29, 36, 37, 38, 10];
            $scope.bikeSpeedIds = [1, 2, 3, 4, 20, 24, 25, 29];
            $scope.frequencies = [{ value: "Weekly" }, { value: "Fortnightly" }, { value: "First of the Month" }, { value: "Second of the Month" },
                { value: "Third of the Month" }, { value: "First Workday of the Month" }, { value: "Last Workday of the Month" }];
            $scope.days = [{ value: "Monday" }, { value: "Tuesday" }, { value: "Wednesday" }, { value: "Thursday" }, { value: "Friday" }, { value: "Saturday" }, { value: "Sunday" }];
        };

        $scope.getEconomyRunTimes = function () {
            $scope.economyRuns = [];
            if ($scope.booking.client.economyRun1) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun1.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun1) }) };
            if ($scope.booking.client.economyRun2) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun2.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun2) }) };
            if ($scope.booking.client.economyRun3) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun3.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun3) }) };
            if ($scope.booking.client.economyRun4) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun4.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun4) }) };
            if ($scope.booking.client.economyRun5) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun5.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun5) }) };
            if ($scope.booking.client.economyRun6) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun6.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun6) }) };
            if ($scope.booking.client.economyRun7) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun7.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun7) }) };
            if ($scope.booking.client.economyRun8) { $scope.economyRuns.push({ name: $scope.booking.client.economyRun8.substring(11, 16), value: $scope.fixEconomyDate($scope.booking.client.economyRun8) }) };
        };

        $scope.fixEconomyDate = function (date) {
            var currentDate = new Date();
            var economyDate = new Date(date);

            return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), economyDate.getHours(), economyDate.getMinutes());
        };

        $scope.getGeocodeData = function (address, city, direction) {
            $scope.manualGeocodingUnderway = true;

            //City doesn't geocode correctly
            if ($scope.countryCode == "NZ" && (city === "City" || city === "CBD")) {
                city = "Auckland CBD";
            }

            //Here maps
            var addressObject = { address: address, city: city, countryCode: $scope.countryCode };

            homesService.getGeocodeData(addressObject)
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
                })
                .finally(() => $scope.manualGeocodingUnderway = false);
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
                        $rootScope.showNotification("Error getting token", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting token", "fa-exclamation");
                });
        };

        $scope.getRates = function () {
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

                        //Get this job in case it's bulk - for label printing (diff labels for bulk vs live)
                        $scope.getThisJob();

                        if ($scope.returnJob) {
                            $scope.connectReturnParts($scope.firstJobId, data.jobID);
                        };

                        //Code to charge sign up client on payment
                        if ($scope.booking.client.stripeClient) {
                            $scope.createStripeChargeHold(); //move to server
                        } else if ($scope.countryCode == "NZ" && ($scope.booking.client.id === 9196 || $scope.booking.client.id === 35957)) {
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

        $scope.getThisJob = function () {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            homesService.getThisJob($scope.jobData.jobID, $scope.jobData.jobNumber, $scope.booking.recurring)
                .then(function (data) {
                    if (data.success) {
                        $scope.thisJob = data.job;

                        if ($scope.countryCode == "NZ" && $scope.booking.client.id === 9196) {
                            $scope.openStripeOneTimeCheckout();
                        } else if ($scope.countryCode == "NZ" && $scope.booking.client.id === 35957) {
                            $state.go("confirmation", { "jobId": $scope.jobData.jobID, "isBulk": $scope.thisJob.isBulk, "prebook": $scope.thisJob.recurring, "email": $scope.booking.podEmail }, { location: "replace" });
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

        $scope.connectReturnParts = function (firstJobId, secondJobId) {
            if ($scope.connectInProgress)
                return;

            $scope.connectInProgress = true;

            homesService.connectReturnParts(firstJobId, secondJobId)
                .then(function (data) {
                    if (data.success) {
                        $scope.returnParentId = data.returnParentId;
                        $scope.jobData.jobNumber = $scope.getNewReturnChildJobNumber();
                    } else {
                        $rootScope.showNotification("Error connecting jobs", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data.errors) {
                        for (error in response.data.errors) {
                            $rootScope.showNotification(error + " " + response.data.errors[error], "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error connecting jobs", "fa-exclamation");
                    }
                })
                .finally(() => $scope.connectInProgress = false);
        };

        $scope.deleteJob = function () {
            if ($scope.deleteJobInProgress)
                return;

            $scope.deleteJobInProgress = true;

            homesService.deleteJob($scope.jobData.jobID, $scope.jobData.jobNumber)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobData = null;
                        $scope.setStep("address");
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

            $scope.openStripeCheckoutObject = { "jobId": $scope.jobData.jobID, "jobNumber": $scope.jobData.jobNumber, "amount": $scope.booking.selectedRate.amount * 1.15, "isBulk": $scope.thisJob.isBulk, "prebook": $scope.thisJob.recurring, "email": $scope.booking.clientContact.email };

            homesService.openStripeOneTimeCheckout($scope.openStripeCheckoutObject, "desktop")
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

                        if (!$scope.timeSaved) {
                            $scope.setCurrentTime();
                        }
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
            $scope.fromGeocodingUnderway = true;
            setTimeout(function () {
                if ($scope.booking && $scope.booking.fromSearch && $scope.booking.fromDetails) {
                    if ($scope.booking.fromDetails.geometry && $scope.booking.fromDetails.address_components) {
                        $scope.getHereMap();

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

                $scope.fromGeocodingUnderway = false;
                $scope.$apply();
            }, 1000);
        });

        $scope.checkFromCompanyName = function () {
            return $scope.checkCompanyNameMatch($scope.booking.fromDetails.name, $scope.booking.fromCompanyName) && typeof ($scope.booking.fromDetails.name) === "undefined";
        };

        $scope.checkFromSavedBookingAddress = function () {
            return $scope.booking.savedBooking.fromAddressStreetName == null || ($scope.booking.savedBooking.fromAddressStreetName.includes($scope.booking.fromStreetNum) && $scope.booking.savedBooking.toAddressStreetName.includes($scope.booking.fromStreetName)) || ($scope.booking.client.address.includes($scope.booking.fromStreetNum) && $scope.booking.client.address.includes($scope.booking.fromStreetName));
        };

        $scope.$watch('booking.toDetails', function (newValue, oldValue, scope) {
            $scope.toGeocodingUnderway = true;
            setTimeout(function () {
                if ($scope.booking && $scope.booking.toSearch && $scope.booking.toDetails) {
                    if ($scope.booking.toDetails.geometry && $scope.booking.toDetails.address_components) {
                        $scope.getHereMap();

                        if ($scope.booking.toDetails.geometry.location) {
                            $scope.booking.toLat = typeof $scope.booking.toDetails.geometry.location.lat == "number" ? $scope.booking.toDetails.geometry.location.lat : $scope.booking.toDetails.geometry.location.lat();
                            $scope.booking.toLong = typeof $scope.booking.toDetails.geometry.location.lng == "number" ? $scope.booking.toDetails.geometry.location.lng : $scope.booking.toDetails.geometry.location.lng();

                            $scope.getHereToMarker();
                            $scope.getTimeZoneFromGPS("to");
                        }

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

                $scope.toGeocodingUnderway = false;
                $scope.$apply();
            }, 1000);
        });

        $scope.checkToCompanyName = function () {
            return $scope.checkCompanyNameMatch($scope.booking.toDetails.name, $scope.booking.toCompanyName) && typeof ($scope.booking.toDetails.name) === "undefined";
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
            if (!$scope.map) {
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
                        center: $scope.mapCenter,
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
            }
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

        $scope.centerHereMap = function (viewScope) {
            var totalLat = $scope.booking.fromLat + $scope.booking.toLat;
            var totalLong = $scope.booking.fromLong + $scope.booking.toLong;
            //var diffLong = Math.abs($scope.booking.fromLong - $scope.booking.toLong);
            var centerLat = totalLat / 2;
            var centerLong = totalLong / 2; //Placeholder value to skew map slightly onto right side

            $scope.map.setCenter({ lat: centerLat, lng: centerLong });

            // Get the current bounding box
            var boundingBox = viewScope.getBoundingBox();

            // Expand the bounding box to zoom out
            var topLeft = boundingBox.getTopLeft();
            var bottomRight = boundingBox.getBottomRight();

            // Calculate how much to expand the bounding box by (around 10%)
            var latDiff = Math.abs(topLeft.lat - bottomRight.lat) * 0.25;
            var lngDiff = Math.abs(topLeft.lng - bottomRight.lng) * 0.25;

            // Create an expanded bounding box
            var expandedBoundingBox = new H.geo.Rect(
                topLeft.lat + latDiff,
                topLeft.lng - lngDiff,
                bottomRight.lat - latDiff,
                bottomRight.lng + lngDiff
            );

            // Set the view to use the expanded bounding box
            $scope.map.getViewModel().setLookAtData({ bounds: expandedBoundingBox });
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

                // Center the map
                $scope.centerHereMap($scope.routeLine);
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

                            // Center the map
                            $scope.centerHereMap(group);
                        } else {
                            // Center the map
                            $scope.centerHereMap($scope.routeLine);
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
            }
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
                lat: midPoint.lat + Math.abs(offset.lat),
                lng: midPoint.lng + Math.abs(offset.lng)
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
                    $scope.map.setCenter({ lat: 40.711722, lng: -74.006513 });
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
                    $scope.map.setCenter({ lat: 40.711722, lng: -74.006513 });
                } else {
                    $scope.map.removeObject($scope.toMarker);
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

                $scope.creditCard.errors = [];

                if ($scope.redField) {
                    $scope.resetBorder();
                };

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

        $scope.checkData = function (accessorialCharge) {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.booking.errors = [];

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                //Address errors
                if (!$scope.booking.fromDetails) {
                    $scope.booking.errors.push("A valid From Address is required");
                    $scope.focusField("fromAddress", "fromBookingGpsSearch");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.pickupContact) {
                    $scope.booking.errors.push("A valid Pickup Contact Name is required");
                    $scope.focusField("pickupContactBorder", "pickupContact");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.booking.toDetails) {
                    $scope.booking.errors.push("A valid To Address is required");
                    $scope.focusField("toAddress", "toBookingGpsSearch");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.sigNotRequired === "Other (add to 'Delivery Notes')" && !$scope.booking.deliveryNotes) {
                    $scope.booking.errors.push("'Signature not required' specifics are required in 'Delivery Notes'");
                    $scope.focusField("deliveryNotesBorder", "deliveryNotes");
                    $(".loading").fadeOut();
                    return;
                }

                //Size errors
                if ($scope.isManualQuantity === false && !$scope.booking.stockSize) {
                    $scope.booking.errors.push("Package Size is required while in 'standard'");
                    $scope.focusField("packageSize");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity === true && (!$scope.booking.manualQuantity && !$scope.booking.basicQuantity)) {
                    $scope.booking.errors.push("Custom Dimensions are required while in 'custom'");
                    $scope.focusField("customTable");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity === true && ($scope.booking.manualQuantity.length < 1 && $scope.booking.basicQuantity.length < 1)) {
                    $scope.booking.errors.push("At least 1 row must be entered in custom dimensions while in 'custom'");
                    $scope.focusField("customTable");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.isManualQuantity === true && (($scope.booking.manualQuantity.length >= 1 && $scope.checkManualQuantity() === false) || ($scope.booking.basicQuantity.length >= 1 && $scope.checkBasicQuantity() === false))) {
                    $scope.booking.errors.push("Either cubic or l/w/h, as well as weight must be entered and greater than zero");
                    $scope.focusField("customTable");
                    $(".loading").fadeOut();
                    return;
                }

                //Speed errors
                if (!$scope.booking.selectedRate) {
                    $scope.booking.errors.push("You must select a service to continue");
                    $scope.focusField("speeds");
                    $(".loading").fadeOut();
                    return;
                }

                //Time errors
                if (!$scope.booking.deliveryDate) {
                    $scope.booking.errors.push("Ready Date is required");
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

                if ($scope.booking.deliveryDate > $scope.dateMaxDate) {
                    $scope.booking.errors.push("Ready Date must be within the given range");
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

                if ($scope.booking.holdJob && $scope.booking.selectedRate.quoteId.length >= 4) {
                    $scope.booking.errors.push("On Hold cannot be set for scheduled jobs");
                    $scope.focusField("timeModal");
                    $(".loading").fadeOut();
                    return;
                }

                //Dg errors
                //Checking these DG fields incase user using saved booking and skips going to DG page
                if ($scope.booking.dangerousGoods === true && $scope.booking.dangerousGoodsClass == null) {
                    $scope.booking.errors.push("DG class is required if sending dangerous goods");
                    $scope.focusField("dgModal");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.dangerousGoods === true && (typeof $scope.booking.dangerousGoodsDocs === "undefined" || $scope.booking.dangerousGoodsDocs == false)) {
                    $scope.booking.errors.push("You must have documentation to send dangerous goods with us");
                    $scope.focusField("dgModal");
                    $(".loading").fadeOut();
                    return;
                }

                //Truck errors
                if ($scope.booking.truck === true && $scope.booking.deliverTo == null) {
                    $scope.booking.errors.push("'Deliver to' is required for sending truck jobs");
                    $scope.focusField("truckModal");
                    $(".loading").fadeOut();
                    return;
                }

                //Tracking errors
                if ($scope.podShow('email') && !$scope.booking.podEmail) {
                    $scope.booking.errors.push("A valid Tracking Email is required");
                    $scope.focusField("trackingEmailBorder", "trackingEmail");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.podShow('mobile') && !$scope.booking.podMobile) {
                    $scope.booking.errors.push("A valid Tracking Mobile is required");
                    $scope.focusField("trackingMobileBorder", "trackingMobile");
                    $(".loading").fadeOut();
                    return;
                }

                //Reference errors
                if ($scope.booking.client.referenceAMandatory && !$scope.booking.clientRefA) {
                    $scope.booking.errors.push("A valid Client Reference A is required");
                    if ($scope.booking.client.referenceADefineList) {
                        $scope.focusField("clientRefASelectBorder", "clientRefASelect");
                    } else {
                        $scope.focusField("clientRefAInputBorder", "clientRefAInput");
                    }
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.client.referenceBMandatory && !$scope.booking.clientRefB) {
                    $scope.booking.errors.push("A valid Client Reference B is required");
                    if ($scope.booking.client.referenceBDefineList) {
                        $scope.focusField("clientRefBSelectBorder", "clientRefBSelect");
                    } else {
                        $scope.focusField("clientRefBInputBorder", "clientRefBInput");
                    }
                    $(".loading").fadeOut();
                    return;
                }

                if (accessorialCharge === 0) {
                    $scope.jobLoading = true;
                    $scope.getJobData();
                } else {
                    $scope.openAccessorialChargeModal();
                }

                $(".loading").fadeOut();
            } catch (e) {
                console.log(e);
                $scope.booking.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkDGData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.dangerousGoods.errors = [];

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                if ($scope.booking.dangerousGoods === true && (typeof $scope.booking.dangerousGoodsDocs === "undefined" || $scope.booking.dangerousGoodsDocs === false)) {
                    $scope.dangerousGoods.errors.push("You must have documentation to send dangerous goods with us");
                    $scope.focusField("dgDocs");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.dangerousGoods === true && $scope.booking.dangerousGoodsClass == null) {
                    $scope.dangerousGoods.errors.push("DG class is required if sending dangerous goods");
                    $scope.focusField("dgClassBorder", "dgClass");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.dgSaved = true;

                $('.dg-modal').modal('hide');
                $scope.checkIfRatesReady();
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

                $scope.truck.errors = [];

                if ($scope.redField) {
                    $scope.resetBorder();
                };

                if ($scope.booking.truck === true && $scope.booking.deliverTo == null) {
                    $scope.truck.errors.push("'Deliver to' is required for sending truck jobs");
                    $scope.focusField("deliverTo");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.truckSaved = true;

                $('.truck-modal').modal('hide');
                $scope.checkIfRatesReady();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.dangerousGoods.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkTimeData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.time.errors = [];

                if ($scope.redField) {
                    $scope.resetBorder();
                };

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
                    if (!$scope.economyRun) {
                        $scope.focusField("readyTimeBorder", "readyTime");
                    } else {
                        $scope.focusField("economyReadyTimeBorder", "economyReadyTime");
                    };
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliveryDate.getTime() == $scope.currDate.getTime() && $scope.booking.deliveryTime < $scope.currTime && !$scope.booking.holdJob) {
                    $scope.time.errors.push("Ready Time must not be in the past");
                    if (!$scope.economyRun) {
                        $scope.focusField("readyTimeBorder", "readyTime");
                    } else {
                        $scope.focusField("economyReadyTimeBorder", "economyReadyTime");
                    };
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.booking.deliverBy) {
                    if (!$scope.booking.deliverByDate) {
                        $scope.time.errors.push("Deliver By Date is required");
                        $scope.focusField("deliverByDateBorder", "deliverByDate");
                        $(".loading").fadeOut();
                        return;
                    }

                    if ($scope.booking.deliverByDate > $scope.dateMaxDate) {
                        $scope.time.errors.push("Deliver By Date must be within the given range");
                        $scope.focusField("deliverByDateBorder", "deliverByDate");
                        $(".loading").fadeOut();
                        return;
                    }

                    if ($scope.booking.deliverByDate < $scope.booking.deliveryDate) {
                        $scope.time.errors.push("Deliver By Date must not be before the pickup date");
                        $scope.focusField("deliverByDateBorder", "deliverByDate");
                        $(".loading").fadeOut();
                        return;
                    }

                    if (!$scope.booking.deliverByTime) {
                        $scope.time.errors.push("Deliver By Time is required");
                        $scope.focusField("deliverByTimeBorder", "deliverByTime");
                        $(".loading").fadeOut();
                        return;
                    }

                    if ($scope.booking.deliverByDate.getTime() == $scope.booking.deliveryDate.getTime() && $scope.booking.deliverByTime < $scope.booking.deliveryTime) {
                        $scope.time.errors.push("Deliver By Time must not be before the pickup time");
                        $scope.focusField("deliverByTimeBorder", "deliverByTime");
                        $(".loading").fadeOut();
                        return;
                    }
                }

                if ($scope.booking.recurring) {
                    if (!$scope.booking.recurringDays) {
                        $scope.time.errors.push("Recurrance Days are required");
                        $scope.focusField("recurringDaysBorder", "recurringDays");
                        $(".loading").fadeOut();
                        return;
                    }

                    if (!$scope.booking.recurringFrequency) {
                        $scope.time.errors.push("Recurrance Frequency is required");
                        $scope.focusField("recurringFrequencyBorder", "recurringFrequency");
                        $(".loading").fadeOut();
                        return;
                    }
                }

                /*if (($scope.booking.deliveryTime.getHours() < 6 || $scope.booking.deliveryTime.getHours() >= 19) && !$scope.booking.holdJob) {
                    $scope.time.errors.push("Pickup Time must be between 6am and 7pm");
                    $(".loading").fadeOut();
                    return;
                }*/

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

        /* --- General Scheiße --- */

        $scope.setStep = function (label) {
            $scope.step = label;
        };

        $scope.clearAll = function () {
            $scope.resetAll();
            $scope.booking.clientAddressGeocoded = false;
            $scope.clearSaved();
            $scope.getSavedJobs();

            //Address book clear
            $scope.booking.searchType = "Google";
            $scope.booking.fromAddressBookSuggestions = [];
            $scope.booking.toAddressBookSuggestions = [];

            //clear podEmail, podMobile and contact data so they can be set as default in case of changed client post-booking
            $scope.booking.podEmail = null;
            $scope.booking.podMobile = null;
            $scope.booking.pickupContact = null;
            $scope.booking.pickupPhone = null;
            $scope.booking.deliveryContact = null;
            $scope.booking.deliveryPhone = null;

            $scope.currentAccessorialChargeGroupId = null;
            $scope.accessorialChargesInitialized = false;
            $scope.accessorialCharges = [];

            //Skip the client page unless they need it
            if (!$scope.internal && $scope.clients.length == 1) {
                $scope.setClient();
            } else {
                $scope.setStep('client');
            };
        };

        $scope.openNewTab = function (url) {
            window.open(url, '_blank');
        };

        /* --- Client Scheiße --- */

        $scope.setInitialStep = function () {
            if ($scope.clients.length > 1) {
                $scope.booking.client = $scope.clients.find(x => x.defaultClient == 1) ?? null;
                $scope.setInternal();
                if ($scope.booking.client != null) {
                    $scope.initClient('all');
                }
                $scope.setStep('client');
            } else {
                $scope.booking.client = $scope.clients[0];
                $scope.internal = $scope.clients[0].internal;
                $scope.initClient('all');

                if ($scope.internal == true || !$scope.booking.client.bookJobPermission || $scope.isCreditCardClient()) {
                    $scope.setStep('client');
                } else {
                    //to stop showing delay before showing address after thisClient loaded
                    $scope.setStep('address');
                }
            };
            //Hides old booking if stripe
            $scope.setStripeState();
        };

        $scope.setClient = function () {
            $scope.stockSizes = $scope.booking.client.stockSizes;
            $scope.booking.stockSize = $scope.booking.client.stockSizes.find((e) => e.name == 'Banana Box');
            $scope.lastAddressChange = 'local';

            $scope.getReferences("A");
            $scope.getReferences("B");
            $scope.booking.sigNotRequired = $scope.booking.client.sigRequiredDefault;

            $scope.setSavedBooking();
            if (!$scope.booking.savedBookingSet) {
                $scope.setClientAddress();
                $scope.setContactDetails();
                $scope.setClientContactDefaults();
            };

            //no address set for credit card
            if ($scope.isCreditCardClient() == true) {
                $scope.clearAddress("from");
            };

            $scope.sizeSaved = null;
            $scope.rates = null;

            $scope.getTotalWeight();
            $scope.getUrgentToken();
            $scope.setStep('address');
        };

        $scope.clientBack = function () {
            $scope.clearSavedBooking();
            $scope.resetContact();
            $scope.booking.searchType = "Google";
            $scope.booking.fromAddressBookSuggestions = [];
            $scope.booking.toAddressBookSuggestions = [];
            $scope.booking.errors = null;
            $scope.returnJob = false;
            $scope.firstJobId = null;
            $scope.firstJobNumber = null;
            $scope.currentAccessorialChargeGroupId = null;
            $scope.accessorialChargesInitialized = false;
            $scope.accessorialCharges = [];
            $scope.setStep('client');
        };

        $scope.initClient = function (all = null) {
            if (all === null) {
                const promises = [
                    $scope.getSpeeds(),
                    $scope.getVehicleSizes()
                ];

                if ($scope.countryCode == 'NZ') {
                    promises.push($scope.getAddressBook());
                }

                Promise.all(promises).then(function () {
                    // Now call setContact after everything is loaded
                    $scope.setContact();
                    if ($scope.countryCode == 'NZ') {
                        $scope.getEconomyRunTimes();
                    }
                });

                $scope.getSavedJobs();
                if ($scope.booking.client.addressBookOnly) {
                    $scope.booking.searchType = "AddressBook";
                };
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

            //Only called once for non-internal single-client users after the getThisClient function has completed
            if ($scope.internal == false && $scope.clients.length == 1 && $scope.booking.client.bookJobPermission && !$scope.isCreditCardClient()) {
                $scope.setClient();
            }
        };

        $scope.setClientAddress = function () {
            $scope.booking.fromSearch = $scope.booking.client.address;
            $scope.booking.fromCompanyName = $scope.booking.client.name;
            $scope.booking.fromExtra = $scope.booking.client.addressExtras;
            $scope.booking.pickupNotes = $scope.booking.client.extraInfo;
            $scope.getGeocodeData($scope.booking.client.address.replaceAll(" ", "+"), $scope.booking.client.americanCity.replaceAll(" ", "+"), 'first');
            $scope.clientAddressDirection = "from";
        };

        $scope.setClientContactDefaults = function () {
            //jobSize
            if ($scope.vehicleSizes != null && $scope.vehicleSizes.length > 0) { 
                $scope.booking.vehicle = $scope.booking.clientContact.defaultJobSize ?
                    $scope.vehicleSizes.find(v => v.id === $scope.booking.clientContact.defaultJobSize) :
                    $scope.vehicleSizes.find(v => v.defaultForBooking === true);

                $scope.booking.van = $scope.booking.vehicle.name.toLowerCase().includes("van") ?? null;
                $scope.booking.bike = $scope.booking.vehicle.name.toLowerCase().includes("bike") ?? null;

                if ($scope.booking.clientContact.defaultJobSize && ($scope.step == "client" ||
                    ($scope.internal == false && $scope.clients.length == 1 && ($scope.step == "address" || $scope.step == "jobBooked")))
                    && $scope.vehicleSizes.find(v => v.id === $scope.booking.clientContact.defaultJobSize).name.toLowerCase().includes("truck")) {
                    //Set truck fields if truck is default
                    $scope.booking.truck = true;
                    $scope.truckSaved = true;
                    $scope.openTruckModal();
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

            if ($scope.booking.clientContact.defaultClientAddressBookId) {
                var address = $scope.addressBook.find(x => x.id === $scope.booking.clientContact.defaultClientAddressBookId);
                if (address) {
                    $scope.setAddressDetails(address, 'from');
                }
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

        $scope.isCreditCardClient = function () {
            if ($scope.booking.client) {
                return ($scope.booking.client.id == 9196 || $scope.booking.client.id == 35957 || $scope.booking.client.id == 11);
            } else {
                return false;
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
                $scope.booking.savedBooking = null;
            } else {
                if ($scope.booking.savedBooking.id != null) {
                    $scope.booking.savedBookingSet = true;
                    $scope.booking.clientAddressGeocoded = true;
                    $scope.booking.saveBookingTime = false;
                    $scope.booking.fromSearch = ($scope.booking.savedBooking.fromAddressStreetName ? $scope.booking.savedBooking.fromAddressStreetName + ", " : "") + (($scope.booking.savedBooking.americanFromCity ?? $scope.booking.savedBooking.fromSuburb) ?? "");
                    $scope.booking.fromCompanyName = $scope.booking.savedBooking.americanFromCompany ?? $scope.booking.savedBooking.fromAddress;
                    $scope.booking.fromExtra = $scope.booking.savedBooking.americanFromExtras ?? $scope.booking.savedBooking.fromAddressExtras;
                    $scope.booking.toSearch = ($scope.booking.savedBooking.toAddressStreetName ? $scope.booking.savedBooking.toAddressStreetName + ", " : "") + (($scope.booking.savedBooking.americanToCity ?? $scope.booking.savedBooking.toSuburb) ?? "");
                    $scope.booking.toCompanyName = $scope.booking.savedBooking.americanToCompany ?? $scope.booking.savedBooking.toAddress;
                    $scope.booking.toExtra = $scope.booking.savedBooking.americanToExtras ?? $scope.booking.savedBooking.toAddressExtras;
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

                    if ($scope.booking.savedBooking.fromAddressStreetName && ($scope.booking.savedBooking.americanFromCity || $scope.booking.savedBooking.fromSuburb)) {
                        $scope.getGeocodeData($scope.booking.savedBooking.fromAddressStreetName.replaceAll(" ", "+"),
                            ($scope.booking.savedBooking.americanFromCity ?? $scope.booking.savedBooking.fromSuburb).replaceAll(" ", "+"), 'from');
                    } else {
                        $scope.setClientAddress();
                    }

                    if ($scope.booking.savedBooking.toAddressStreetName && ($scope.booking.savedBooking.americanToCity || $scope.booking.savedBooking.toSuburb)) {
                        $scope.getGeocodeData($scope.booking.savedBooking.toAddressStreetName.replaceAll(" ", "+"),
                            ($scope.booking.savedBooking.americanToCity ?? $scope.booking.savedBooking.toSuburb).replaceAll(" ", "+"), 'to');
                    } else {
                        $scope.booking.toSearch = null;
                        $scope.booking.toDetails = null;
                    }

                    $scope.booking.dimensionsType = $scope.booking.savedBooking.dimensionsType || 1;
                    $scope.booking.presetSpeed = $scope.booking.savedBooking.speed;
                    $scope.formatBookingTimeForFrontend();

                    $scope.booking.truck = $scope.booking.savedBooking.truck;
                    $scope.booking.vehicle = $scope.vehicleSizes.find(v => v.id === $scope.booking.savedBooking.size) || $scope.vehicleSizes.find(v => v.defaultForBooking === true);
                    $scope.booking.van = $scope.booking.vehicle.name.toLowerCase().includes("van") ?? null;
                    $scope.booking.bike = $scope.booking.vehicle.name.toLowerCase().includes("bike") ?? null;
                    $scope.truckSaved = $scope.booking.savedBooking.truck;
                    $scope.booking.tailLiftPickup = $scope.booking.savedBooking.truckTailliftPU;
                    $scope.booking.tailLiftDropoff = $scope.booking.savedBooking.truckTailliftDO;
                    $scope.booking.deliverTo = $scope.booking.savedBooking.truckPrivateResidence === 1 ? "Residential" : "Business";
                    $scope.checkIfRatesReady();
                } else {
                    $scope.resetAll();
                }
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
                var savedBookingId = $scope.booking.savedBooking.id;
                var savedBookingName = $scope.booking.savedBooking.name;
                $scope.getSavedBookingData();
                $scope.booking.savedBooking.id = savedBookingId;
                $scope.booking.savedBooking.name = savedBookingName;

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

        $scope.openCreateSavedBookingModal = function () {
            $scope.booking.newSavedBookingName = null;
            $('.createSavedBooking-modal').modal();
        };

        $scope.getSavedBookingData = function () {
            $scope.booking.savedBooking = {};
            $scope.booking.savedBooking.fromAddressStreetName = $scope.getStreetAddress('from');
            $scope.booking.savedBooking.fromSuburb = $scope.booking.fromCity ? $scope.booking.fromCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu
            $scope.booking.savedBooking.americanFromCity = $scope.booking.fromCity ? $scope.booking.fromCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null;
            $scope.booking.savedBooking.americanFromState = $scope.booking.fromState ?? null;
            $scope.booking.savedBooking.fromAddress = $scope.booking.fromCompanyName ?? $scope.getCompanyName("from");
            $scope.booking.savedBooking.americanFromCompany = $scope.booking.fromCompanyName ?? $scope.getCompanyName("from");
            $scope.booking.savedBooking.fromAddressExtras = $scope.booking.fromExtra ?? null;
            $scope.booking.savedBooking.americanFromExtras = $scope.booking.fromExtra ?? null;
            $scope.booking.savedBooking.toAddressStreetName = $scope.getStreetAddress('to');
            $scope.booking.savedBooking.toSuburb = $scope.booking.toCity ? $scope.booking.toCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null; //remove accents for comparison e.g. Ōtāhuhu -> Otahuhu
            $scope.booking.savedBooking.americanToCity = $scope.booking.toCity ? $scope.booking.toCity.normalize('NFD').replace(/[\u0300-\u036f]/g, "") : null;
            $scope.booking.savedBooking.americanToState = $scope.booking.toState ?? null;
            $scope.booking.savedBooking.toAddress = $scope.booking.toCompanyName ?? $scope.getCompanyName("to");
            $scope.booking.savedBooking.americanToCompany = $scope.booking.toCompanyName ?? $scope.getCompanyName("to");
            $scope.booking.savedBooking.toAddressExtras = $scope.booking.toExtra ?? null;
            $scope.booking.savedBooking.americanToExtras = $scope.booking.toExtra ?? null;

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


            $scope.booking.savedBooking.size = $scope.booking.vehicle.id;
            $scope.booking.savedBooking.dimensionsType = $scope.booking.dimensionsType;
            $scope.booking.savedBooking.speed = $scope.booking.selectedRate ? $scope.getActualSpeedId($scope.booking.selectedRate) : null;

            $scope.booking.savedBooking.truck = $scope.booking.truck;
            $scope.booking.savedBooking.truckTailliftPU = $scope.booking.truck ? $scope.booking.tailLiftPickup : null;
            $scope.booking.savedBooking.truckTailliftDO = $scope.booking.truck ? $scope.booking.tailLiftDropoff : null;
            $scope.booking.savedBooking.truckPrivateResidence = $scope.booking.truck ? ($scope.booking.deliverTo == "Residential" ? true : false) : null;

            $scope.formatBookingTimeForBackend();

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

        $scope.getActualSpeedId = function (rate) {
            scheduleLength = rate.quoteId.length;
            if (scheduleLength >= 4) {
                return parseInt(rate.quoteId.substring(scheduleLength - 3, scheduleLength));
            } else {
                return rate.speedId;
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
            $scope.booking.presetSpeed = null;
            $scope.booking.savedBooking = null;
            $scope.booking.newSavedBookingName = null;
        };

        $scope.formatBookingTimeForBackend = function () {
            if ($scope.booking.deliveryTime != null && $scope.timeSaved === true && $scope.booking.saveBookingTime === true) {
                var hours = String($scope.booking.deliveryTime.getHours()).padStart(2, '0');
                var minutes = String($scope.booking.deliveryTime.getMinutes()).padStart(2, '0');

                $scope.booking.savedBooking.bookingTime = "1970-01-01T" + hours + ":" + minutes + ":00";
            }
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
                    $scope.setNextBusinessDay();
                };

                $scope.booking.saveBookingTime = true;
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

        $scope.clearFullFrom = function () {
            $scope.clearAddress("from");
            $scope.booking.pickupContact = null;
            $scope.booking.pickupPhone = null;
            $scope.booking.pickupNotes = null;
        };

        $scope.resetAll = function () {
            //Clear extra first incase we set it again
            $scope.clearExtra();
            $scope.fromAddressBookCompanySaved = false;
            $scope.toAddressBookCompanySaved = false;

            if (!$scope.booking.dimensionsType) {
                $scope.booking.dimensionsType = 1;
            }

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

                //Set back to default
                $scope.booking.pickupContact = $scope.booking.clientContact.name;
                $scope.booking.pickupPhone = $scope.booking.clientContact.mobile;
            } else if ($scope.clientAddressDirection === "to") {
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

                //Set back to default
                $scope.booking.deliveryContact = $scope.booking.clientContact.name;
                $scope.booking.deliveryPhone = $scope.booking.clientContact.mobile;
            } else {
                $scope.clearAddress("from");
                $scope.clearAddress("to");
            }

            $scope.booking.errors = null;
            $scope.booking.originalFromCompany = null;
            $scope.booking.originalFromExtra = null;

            $scope.clearSize();
            $scope.clearDG();
            $scope.clearTruck();
            $scope.clearTime();
            if ($scope.booking.savedBookingSet) {
                $scope.clearSaved();
            };
            $scope.toTimeZone = null;

            $scope.speedDescription = null;

            $scope.lastAddressChange = 'local';
            $scope.setClientContactDefaults();
            $scope.basicWeightSaved = false;
            $scope.lastManuallySelectedRate = null;
            $scope.showFromCompany = false;
            $scope.showToCompany = false;
            $scope.checkIfRatesReady();
            $scope.jobData = null;
            $scope.returnJob = false;
            $scope.firstJobId = null;
            $scope.firstJobNumber = null;

            $scope.currentAccessorialChargeGroupId = null;
            $scope.accessorialChargesInitialized = false;
            $scope.accessorialCharges = [];
        };

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
                return ($scope.booking.fromSubpremise ? $scope.booking.fromSubpremise + "/" : "") + ($scope.booking.fromStreetNum ? $scope.booking.fromStreetNum + " " : "") + ($scope.booking.fromStreetName ?? "");
            } else {
                return ($scope.booking.toSubpremise ? $scope.booking.toSubpremise + "/" : "") + ($scope.booking.toStreetNum ? $scope.booking.toStreetNum + " " : "") + ($scope.booking.toStreetName ?? "");
            }
        };

        $scope.getCompanyName = function (direction) {
            if (direction == "from" && $scope.booking.fromDetails && $scope.booking.fromDetails.name) {
                return $scope.checkCompanyNameMatch($scope.booking.fromDetails.name, $scope.getStreetAddress("from")) ? $scope.booking.fromDetails.name : null;
            } else if (direction == "to" && $scope.booking.toDetails && $scope.booking.toDetails.name) {
                return $scope.checkCompanyNameMatch($scope.booking.toDetails.name, $scope.getStreetAddress("to")) ? $scope.booking.toDetails.name : null;
            } else if (direction == "from" && $scope.booking.jobType == "Pickup") {
                return $scope.booking.client.name;
            } else if (direction == "to" && $scope.booking.jobType == "DeliverToUs") {
                return $scope.booking.client.name;
            } else {
                return null;
            }
        };

        $scope.swapToFromAddress = function () {
            var checkAndSwap = function () {
                if ($scope.fromGeocodingUnderway || $scope.toGeocodingUnderway || $scope.manualGeocodingUnderway) {
                    // Still geocoding, check again in 100ms
                    $timeout(checkAndSwap, 100);
                    return;
                }

                // Geocoding complete, safe to swap
                var tempAddress = $scope.booking.toSearch;
                var tempAddressDetails = $scope.booking.toDetails;
                var tempContact = $scope.booking.pickupContact;
                var tempPhone = $scope.booking.pickupPhone;
                var tempNotes = $scope.booking.pickupNotes;

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

                $scope.booking.pickupContact = $scope.booking.deliveryContact;
                $scope.booking.pickupPhone = $scope.booking.deliveryPhone;
                $scope.booking.pickupNotes = $scope.booking.deliveryNotes;
                $scope.booking.deliveryContact = tempContact;
                $scope.booking.deliveryPhone = tempPhone;
                $scope.booking.deliveryNotes = tempNotes;
            };

            checkAndSwap();
        };

        $scope.searchTypeChanged = function () {
            $scope.fromAddressBookCompanySaved = false;
            $scope.toAddressBookCompanySaved = false;
        };

        $scope.getAddressBookSuggestions = function (searchText, direction) {
            searchText = searchText.toLowerCase();
            if (direction == "from") {
                $scope.booking.fromAddressBookSuggestions = $scope.addressBook.filter(address => address.deliverTo.toLowerCase().includes(searchText) || (address.code ? address.code.toLowerCase().includes(searchText) : false));
            } else {
                $scope.booking.toAddressBookSuggestions = $scope.addressBook.filter(address => address.deliverTo.toLowerCase().includes(searchText) || (address.code ? address.code.toLowerCase().includes(searchText) : false));
            };
        };

        $scope.setAddressDetails = function (address, direction) {
            var suburbName = address.toSuburb ?? (address.toSuburbId ? $scope.getSuburbName(address.toSuburbId) : "");

            if (direction == "from") {
                $scope.booking.fromSearch = address.addressStreetName + (address.toSuburbId ? ((address.addressStreetName ? ", " : "") + suburbName) : "");
                $scope.booking.fromCompanyName = address.addressCompanyName;
                if (address.addressExtras || address.addressExtras2) {
                    $scope.booking.fromExtra = address.addressExtras ?? "" + (address.addressExtras2 ? (address.addressExtras ? ", " : "") + address.addressExtras2 : "");
                };
                $scope.booking.fromAddressCode = address.code ?? '';
            } else if (direction == "to") {
                $scope.booking.toSearch = address.addressStreetName + (address.toSuburbId ? ((address.addressStreetName ? ", " : "") + suburbName) : "");
                $scope.booking.toCompanyName = address.addressCompanyName;
                if (address.addressExtras || address.addressExtras2) {
                    $scope.booking.toExtra = address.addressExtras ?? "" + (address.addressExtras2 ? (address.addressExtras ? ", " : "") + address.addressExtras2 : "");
                };
                $scope.booking.toAddressCode = address.code ?? '';
            };

            if ($scope.booking.client.addressBookOnly && !$scope.booking.fromAddressCode) {
                $scope.booking.fromAddressCode = '100';
            };

            $scope.fromAddressBookCompanySaved = address.addressCompanyName != null && direction == "from" ? true : false;
            $scope.toAddressBookCompanySaved = address.addressCompanyName != null && direction == "to" ? true : false;
            $scope.getGeocodeData(address.addressStreetName.replaceAll(" ", "+"), address.toSuburb ?? $scope.getSuburbName(address.toSuburbId).replaceAll(" ", "+"), direction);
        };

        $scope.getSuburbName = function (suburbId) {
            var index = $scope.suburbs.findIndex(function (item, i) {
                return item.id === suburbId
            });
            return $scope.suburbs[index].name;
        };

        $scope.matchSuburbName = function (suburbName, returnValue) {
            if (!suburbName) return null; suburbName = suburbName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            var suburb = $scope.suburbs.find(x => x.name === suburbName);
            if (typeof suburb !== 'undefined') {
                return (returnValue == "id" ? suburb.id : suburb);
            } else {
                suburb = $scope.suburbs.find(x => x.alias != null && Array.isArray(x.alias) && x.alias.includes(suburbName));
                if (typeof suburb !== 'undefined') {
                    return (returnValue == "id" ? suburb.id : suburb);
                } else {
                    return null;
                }
            };
        };

        $scope.toggleCompanyName = function (direction, show) {
            if (direction === "from") {
                $scope.showFromCompany = show;
                $scope.showToCompany = false;
                if (show === true) {
                    setTimeout(function () {
                        document.getElementById("fromCompany").focus();
                    }, 100);
                };
            } else {
                $scope.showFromCompany = false;
                $scope.showToCompany = show;
                if (show === true) {
                    setTimeout(function () {
                        document.getElementById("toCompany").focus();
                    }, 100);
                };
            };
        };

        $scope.matchSuburbName = function (suburbName, returnValue) {
            if (!suburbName) return null; suburbName = suburbName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            var suburb = $scope.suburbs.find(x => x.name === suburbName);
            if (typeof suburb !== 'undefined') {
                return (returnValue == "id" ? suburb.id : suburb);
            } else {
                suburb = $scope.suburbs.find(x => x.alias != null && Array.isArray(x.alias) && x.alias.includes(suburbName));
                if (typeof suburb !== 'undefined') {
                    return (returnValue == "id" ? suburb.id : suburb);
                } else {
                    return null;
                }
            };
        };

        /* --- Time/Date Scheiße --- */

        $scope.setCurrentTime = function () {
            $scope.getDate();
            $scope.getTime();
            $scope.booking.deliveryTime = new Date($scope.currTime.getTime());
            $scope.booking.deliverByTime = new Date($scope.currTime.getTime());
            $scope.booking.deliveryDate = new Date($scope.currDate.getTime());
            $scope.booking.deliverByDate = new Date($scope.currDate.getTime());
        };

        $scope.clearTime = function () {
            $scope.setCurrentTime();
            $scope.booking.deliverBy = false;
            $scope.clearTimeExtras();
            $scope.timeSaved = false;
            $scope.time.errors = [];
            $scope.checkIfRatesReady();
        };

        $scope.clearRecurring = function () {
            $scope.booking.recurring = false;
            $scope.booking.recurringName = null;
            $scope.booking.recurringDays = null;
            $scope.booking.recurringFrequency = null;
            $scope.booking.recurringHolidays = null;
            $scope.booking.recurringInitialDays = null;
        };

        $scope.clearTimeExtras = function () {
            $scope.booking.holdJob = false;
            $scope.booking.deliverByTimeZone = $scope.toTimeZone;
            $scope.booking.pickupTimeZone = $scope.fromTimeZone;
            $scope.clearRecurring();
        };

        $scope.timeBack = function () {
            $scope.time.errors = [];
            if (!$scope.timeSaved) {
                $scope.setCurrentTime();
                $scope.clearTimeExtras();
            };
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
                $scope.booking.deliverByDate = new Date($scope.currDate.getTime());
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
                $scope.booking.deliverByTime = new Date($scope.currTime.getTime());
            };
        };

        $scope.getDateTimeString = function () {
            var month = $scope.booking.deliveryDate.toLocaleString('default', { month: 'short' });
            var day = $scope.booking.deliveryDate.getDate();
            var timeString = $scope.booking.deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            return (day + " " + month + ", " + timeString +
                ($scope.booking.deliverBy && $scope.booking.deliverByTimeZone != $scope.booking.pickupTimeZone ? " (" + $scope.booking.pickupTimeZone.code + ")" : ""));
        };

        $scope.getDeliverByDateTimeString = function () {
            if (!$scope.booking.deliverBy) {
                return "Deliver ASAP" + " (" + $scope.booking.pickupTimeZone.code + ")";
            } else {
                var month = $scope.booking.deliverByDate.toLocaleString('default', { month: 'short' });
                var day = $scope.booking.deliverByDate.getDate();
                var timeString = $scope.booking.deliverByTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                return (day + " " + month + ", " + timeString + " (" + $scope.booking.deliverByTimeZone.code + ")");
            }
        };

        $scope.combineDateTime = function () {
            $scope.getTime();
            if ($scope.booking.deliveryTime < $scope.currTime && $scope.booking.deliveryDate.getTime() === $scope.currDate.getTime()) {
                $scope.booking.deliveryTime = $scope.currTime;
            }

            var year = $scope.booking.deliveryDate.getFullYear();
            var month = String($scope.booking.deliveryDate.getMonth() + 1).padStart(2, '0');
            var day = String($scope.booking.deliveryDate.getDate()).padStart(2, '0');
            var hours = String($scope.booking.deliveryTime.getHours()).padStart(2, '0');
            var minutes = String($scope.booking.deliveryTime.getMinutes()).padStart(2, '0');

            return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00";
        };

        $scope.combineDeliverByDateTime = function () {
            if (!$scope.booking.deliverBy) {
                return null;
            } else {
                var year = $scope.booking.deliverByDate.getFullYear();
                var month = String($scope.booking.deliverByDate.getMonth() + 1).padStart(2, '0');
                var day = String($scope.booking.deliverByDate.getDate()).padStart(2, '0');
                var hours = String($scope.booking.deliverByTime.getHours()).padStart(2, '0');
                var minutes = String($scope.booking.deliverByTime.getMinutes()).padStart(2, '0');

                return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00";
            }
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

        $scope.setEconomyRunTime = function () {
            var currentTime = new Date();

            var closestIndex = -1;
            for (i in $scope.economyRuns) {
                if ($scope.economyRuns[i].value > currentTime) {
                    if (closestIndex === -1 || $scope.economyRuns[i].value < $scope.economyRuns[closestIndex].value) {
                        closestIndex = i;
                    }
                }
            }
            if (closestIndex === -1) {
                $scope.booking.deliveryTime = $scope.economyRuns[0].value;
            } else {
                $scope.booking.deliveryTime = $scope.economyRuns[closestIndex].value;
            }

            if (currentTime > $scope.booking.deliveryTime) {
                $scope.setEcoNextBusinessDay();
            }

            $scope.timeSaved = true;
        };

        $scope.setNextBusinessDay = function () {
            var dayNumber = $scope.booking.deliveryDate.getDay();
            if (dayNumber === 6) { //Saturday + 2 = Mon
                $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 2);
            } else if (dayNumber === 5) { //Friday + 3 = Mon
                $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 3);
            } else { //Other days sun-thur just add 1
                $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 1);
            };
        };

        $scope.setEcoNextBusinessDay = function () {
            var dayNumber = $scope.booking.deliveryDate.getDay();

            if (dayNumber === 6) { //Saturday
                if ($scope.booking.client.sunEcoRun) {
                    $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 1); // Go to Sunday
                } else {
                    $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 2); // Skip to Monday
                }
            } else if (dayNumber === 5) { //Friday
                if ($scope.booking.client.satEcoRun) {
                    $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 1); // Go to Saturday
                } else if ($scope.booking.client.sunEcoRun) {
                    $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 2); // Go to Sunday
                } else {
                    $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 3); // Skip to Monday
                }
            } else { //Other days sun-thur just add 1
                $scope.booking.deliveryDate.setDate($scope.booking.deliveryDate.getDate() + 1);
            };
        };

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

        $scope.getRecurranceDays = function () {
            var dayString = "0000000";
            for (i in $scope.booking.recurringDays) {
                if ($scope.booking.recurringDays[i].value === "Monday") {
                    dayString = "1" + dayString.substring(1);
                } else if ($scope.booking.recurringDays[i].value === "Tuesday") {
                    dayString = dayString.substring(0, 1) + "1" + dayString.substring(2);
                } else if ($scope.booking.recurringDays[i].value === "Wednesday") {
                    dayString = dayString.substring(0, 2) + "1" + dayString.substring(3);
                } else if ($scope.booking.recurringDays[i].value === "Thursday") {
                    dayString = dayString.substring(0, 3) + "1" + dayString.substring(4);
                } else if ($scope.booking.recurringDays[i].value === "Friday") {
                    dayString = dayString.substring(0, 4) + "1" + dayString.substring(5);
                } else if ($scope.booking.recurringDays[i].value === "Saturday") {
                    dayString = dayString.substring(0, 5) + "1" + dayString.substring(6);
                } else if ($scope.booking.recurringDays[i].value === "Sunday") {
                    dayString = dayString.substring(0, 6) + "1";
                };
            };
            return dayString;
        };

        $scope.updateRecurringInitialDays = function () {
            if ($scope.booking.recurringFrequency === 'Weekly') {
                $scope.booking.recurringInitialDays = 7;
            } else if ($scope.booking.recurringFrequency === 'Fortnightly') {
                $scope.booking.recurringInitialDays = 14;
            } else {
                $scope.booking.recurringInitialDays = null;
            }
        };

        $scope.addMinutes = function (minutes) {
            var originalDate = $scope.booking.deliveryTime.getDate();
            //var newDate = new Date($scope.booking.deliveryTime);
            $scope.booking.deliveryTime.setMinutes($scope.booking.deliveryTime.getMinutes() + minutes);
            var isNextDay = $scope.booking.deliveryTime.getDate() !== originalDate;

            if (isNextDay) {
                $scope.setNextBusinessDay();
            };
        }

        /* --- Size Scheiße --- */

        $scope.clearSize = function () {
            $scope.booking.stockSize = null;

            $scope.booking.quantity = 1;
            $scope.booking.manualQuantity = [{ length: null, width: null, height: null, weight: null, quantity: 1 }];
            $scope.booking.basicQuantity = [];
            $scope.booking.selectedStockSize = null;
            $scope.sizeSaved = null;
            $scope.size.errors = [];
        };

        $scope.setVehicleStep = function () {
            if ($scope.booking.vehicle.name.toLowerCase().includes("truck")) {
                $scope.booking.truck = true;
                $scope.openTruckModal();
            } else {
                $scope.booking.truck = null;
            };

            if ($scope.countryCode == 'NZ' && !$scope.booking.truck) {
                $scope.booking.van = $scope.booking.vehicle.name.toLowerCase().includes("van");
                $scope.booking.bike = $scope.booking.vehicle.name.toLowerCase().includes("bike");
            } else {
                $scope.booking.van = null;
                $scope.booking.bike = null;
            };

            $scope.checkIfRatesReady();
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
                if ($scope.booking.manualQuantity[i].cubic == null || $scope.booking.manualQuantity[i].cubic <= 0) {
                    check += 1;
                }/*
                if ($scope.booking.manualQuantity[i].length == null || $scope.booking.manualQuantity[i].length <= 0) {
                    check += 1;
                }
                if ($scope.booking.manualQuantity[i].width == null || $scope.booking.manualQuantity[i].width <= 0) {
                    check += 1;
                }
                if ($scope.booking.manualQuantity[i].height == null || $scope.booking.manualQuantity[i].height <= 0) {
                    check += 1;
                }*/
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
                $scope.checkIfRatesReady();
            }
        };

        $scope.decrementQuantity = function () {
            if ($scope.booking.quantity > 1) {
                $scope.booking.quantity -= 1;
                $scope.checkIfRatesReady();
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
            $scope.checkIfRatesReady();
        };

        $scope.removeManualQuantityRow = function (index) {
            if ($scope.booking.manualQuantity.length + $scope.booking.basicQuantity.length > 1) {
                $scope.booking.manualQuantity.splice(index, 1);
                $scope.checkIfRatesReady();
            };
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
                $scope.checkIfRatesReady();
            }
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
            $scope.checkIfRatesReady();
        };

        $scope.setBasicManual = function (choice) {
            $scope.isManualQuantity = choice;
        };

        $scope.checkGreatestCubic = function () {
            if ($scope.booking.stockSize) {
                var basicCubic = ($scope.booking.stockSize.length / 100) * ($scope.booking.stockSize.width / 100) * ($scope.booking.stockSize.height / 100);
                var basicGreatestLength = Math.max($scope.booking.stockSize.length, $scope.booking.stockSize.width, $scope.booking.stockSize.height);
                $scope.booking.van = ($scope.booking.van || basicCubic >= 0.9855 || basicGreatestLength > 150);
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
                $scope.booking.van = ($scope.booking.van || greatestCubic >= 0.9855 || greatestLength > 150);
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

        $scope.getTotalWeightBoth = function () {
            var weight = 0;
            for (i in $scope.booking.manualQuantity) {
                var qty = $scope.booking.dimensionsType === 2 ? 1 : parseInt($scope.booking.manualQuantity[i].quantity);
                weight += ($scope.booking.manualQuantity[i].weight != null ? parseFloat($scope.booking.manualQuantity[i].weight) : 0) * qty;
            };
            for (i in $scope.booking.basicQuantity) {
                var qty = $scope.booking.dimensionsType === 2 ? 1 : parseInt($scope.booking.basicQuantity[i].quantity);
                weight += ($scope.booking.basicQuantity[i].weight != null ? parseFloat($scope.booking.basicQuantity[i].weight) : 0) * qty;
            };
            return weight;
        };


        $scope.getTotalQuantityBoth = function () {
            var count = 0;
            for (i in $scope.booking.manualQuantity) {
                count += parseInt($scope.booking.manualQuantity[i].quantity);
            };
            for (i in $scope.booking.basicQuantity) {
                count += parseInt($scope.booking.basicQuantity[i].quantity);
            };
            return count;
        };

        $scope.setBasicWeight = function () {
            if ($scope.booking.totalBasicWeight != $scope.booking.stockSize.weight * $scope.booking.quantity) {
                $scope.basicWeightSaved = true;
            }
            $scope.checkIfRatesReady();
        };

        $scope.getTotalWeight = function () {
            if ($scope.booking.stockSize && $scope.basicWeightSaved != true) {
                $scope.booking.totalBasicWeight = ($scope.booking.stockSize.weight * $scope.booking.quantity);
                if ($scope.booking.totalBasicWeight % 1 != 0) {
                    $scope.booking.totalBasicWeight = $scope.booking.totalBasicWeight.toFixed(2);
                }
            } else {
                if ($scope.basicWeightSaved != true) {
                    $scope.booking.totalBasicWeight = 0;
                } else {
                    return;
                }
            }
        };

        $scope.setCubic = function (row) {
            if (row.cubic != null && row.cubic != (row.length * row.width * row.height * ($scope.countryCode != "NZ" ? 0.000579 : 0.000001))) {
                row.cubicSaved = true;
                $scope.checkIfRatesReady();
            }
        };

        $scope.getRowCubicFeet = function (row) {
            if (row.length && row.width && row.height && row.cubicSaved != true) {
                row.cubic = parseFloat((row.length * row.width * row.height * ($scope.countryCode != "NZ" ? 0.000579 : 0.000001)).toFixed(3));
            }
        };

        $scope.getCubicSumBoth = function () {
            var cubic = 0;
            if ($scope.booking.stockSize) {
                cubic += parseFloat(($scope.booking.stockSize.length * $scope.booking.stockSize.width * $scope.booking.stockSize.height
                    * ($scope.countryCode != "NZ" ? 0.000579 : 0.000001)).toFixed(3)) * $scope.booking.quantity;
            } else {
                for (i in $scope.booking.manualQuantity) {
                    var qty = $scope.booking.dimensionsType === 2 ? 1 : parseInt($scope.booking.manualQuantity[i].quantity);
                    cubic += ($scope.booking.manualQuantity[i].cubic != null ? parseFloat($scope.booking.manualQuantity[i].cubic) : 0) * qty;
                };
                for (i in $scope.booking.basicQuantity) {
                    var qty = $scope.booking.dimensionsType === 2 ? 1 : parseInt($scope.booking.basicQuantity[i].quantity);
                    cubic += ($scope.booking.basicQuantity[i].cubic != null ? parseFloat($scope.booking.basicQuantity[i].cubic) : 0) * qty;
                };
            }
            return parseFloat(cubic.toFixed(3));
        };

        $scope.checkIfValidBike = function () {
            if ($scope.booking.stockSize) {
                var basicCubic = ($scope.booking.stockSize.length / 100) * ($scope.booking.stockSize.width / 100) * ($scope.booking.stockSize.height / 100);
                $scope.validBike = (basicCubic <= 0.14805 && ($scope.booking.totalBasicWeight / $scope.booking.quantity) <= 25);
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

        /* --- Dangerous Goods Scheiße --- */

        $scope.dgBack = function () {
            $scope.dangerousGoods.errors = [];
            if (!$scope.dgSaved) {
                $scope.booking.dangerousGoods = false;
                $scope.booking.dangerousGoodsClass = null;
                $scope.booking.dangerousGoodsDocs = null;
                $scope.booking.dryIceWeight = null;
            };
        };

        $scope.clearDG = function () {
            $scope.booking.dangerousGoods = null;
            $scope.booking.dangerousGoodsClass = null;
            $scope.booking.dangerousGoodsDocs = null;
            $scope.booking.dryIceWeight = null;
            $scope.dgSaved = null;
            $scope.dangerousGoods.errors = [];
        };

        $scope.dangerousGoodsTrue = function () {
            if ($scope.booking.dangerousGoods === true) {
                $scope.openDGModal();
            } else {
                $scope.checkIfRatesReady();
            };
        };

        $scope.checkDGValidity = function () {
            if ($scope.booking.dangerousGoods) {
                if ($scope.booking.dangerousGoodsClass !== null && $scope.booking.dangerousGoodsDocs === true) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        $scope.openDGModal = function () {
            $('.dg-modal').modal({ backdrop: 'static', keyboard: false });
        };

        $scope.toggleDimensionsType = function () {
            ;
            $scope.booking.dimensionsType = $scope.booking.dimensionsType === 2 ? 1 : 2;
            $scope.checkIfRatesReady();
        };

        $scope.convertDryIceWeight = function () {
            if (!$scope.booking.dryIceWeight) return;

            if ($scope.booking.dryIceWeightUnit === 'KG') {
                // Converting from LBS to KG
                $scope.booking.dryIceWeight = parseFloat(($scope.booking.dryIceWeight * 0.45359237).toFixed(2));
            } else {
                // Converting from KG to LBS
                $scope.booking.dryIceWeight = parseFloat(($scope.booking.dryIceWeight * 2.20462262).toFixed(2));
            }
        };

        /* --- Truck Scheiße --- */

        $scope.truckBack = function () {
            $scope.truck.errors = [];
            if (!$scope.truckSaved) {
                $scope.booking.truck = null;
                $scope.booking.tailLiftPickup = null;
                $scope.booking.tailLiftDropoff = null;
                $scope.booking.deliverTo = "Business";
            };
        };

        $scope.clearTruck = function () {
            $scope.booking.truck = null;
            $scope.booking.tailLiftPickup = null;
            $scope.booking.tailLiftDropoff = null;
            $scope.booking.deliverTo = "Business";
            $scope.truckSaved = null;
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

        $scope.openTruckModal = function () {
            $('.truck-modal').modal({ backdrop: 'static', keyboard: false });
        };

        /* --- Rates Scheiße --- */

        $scope.checkIfRatesReady = function () {
            if ($scope.isManualQuantity) {
                $scope.booking.stockSize = null;
                $scope.booking.quantity = 1;
                $scope.basicWeightSaved = false;
                $scope.sizeSaved = "manual";
            } else {
                $scope.booking.manualQuantity = [{ length: null, width: null, height: null, weight: null, quantity: 1 }];
                $scope.sizeSaved = "basic";
            }
            $scope.getTotalWeight();
            $scope.speedDescriptionOpen = false;

            if ($scope.booking.toDetails && $scope.booking.fromDetails && $scope.booking.fromSearch && (($scope.booking.stockSize && $scope.booking.quantity) || $scope.checkManualQuantity()) && $scope.booking.vehicle) {
                $scope.prepareGetRatesObject();
            } else {
                $scope.rates = null;
                $scope.booking.selectedRate = null;
            };

            if ($scope.accessorialChargesInitialized && $scope.accessorialCharges && $scope.accessorialCharges.length > 0) {
                $timeout(function () {
                    $scope.updateAutoPopulatedChargeValues();
                }, 100); // Small delay to ensure weight is calculated first
            }
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

            if (($scope.booking.client.addressBookOnly || $scope.booking.client.baggageActive) && $scope.countryCode == 'NZ') {
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
                dryIceWeight: $scope.booking.dangerousGoods === true ? $scope.booking.dryIceWeight : null,
                isPrebook: $scope.booking.recurring,
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
                    kg: $scope.basicWeightSaved == true ? $scope.booking.totalBasicWeight / $scope.booking.quantity : $scope.booking.stockSize.weight, //Divide total weight by quantity if it has been changed
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

            var fromAddress = $scope.getStreetAddress("from");
            var fromLastIndex = fromAddress.lastIndexOf(" ");
            var fromTrimmedAddress = fromLastIndex != null ? fromAddress.substring(0, fromLastIndex) : fromAddress;

            var toAddress = $scope.getStreetAddress("to");
            var toLastIndex = toAddress.lastIndexOf(" ");
            var toTrimmedAddress = toLastIndex != null ? toAddress.substring(0, toLastIndex) : toAddress;

            if (clientTrimmedAddress == fromTrimmedAddress) {
                $scope.booking.jobType = "Pickup";
            } else if (clientTrimmedAddress == toTrimmedAddress) {
                $scope.booking.jobType = "DeliverToUs";
            } else {
                $scope.booking.jobType = "ThirdParty";
            };
        };

        $scope.setRateSelected = function (selectedRate) {
            if ($scope.booking.selectedRate != selectedRate) {
                for (rate in $scope.rates) {
                    $scope.rates[rate].selected = false;
                };
                selectedRate.selected = true;
                $scope.booking.selectedRate = selectedRate;


                $scope.updateFlightRouteLine(selectedRate);

                //Save last selected rate to set after getting rates again if still there
                $scope.lastManuallySelectedRate = selectedRate.actualSpeedId;

                //Change schedule speed id to normal speed id e.g. 449096 -> 96
                $scope.trimmedSpeedId = selectedRate.actualSpeedId;

                if ($scope.checkIfSpeedIdAllowed($scope.trimmedSpeedId)) {
                    var speed = $scope.speeds.find(x => x.id === $scope.trimmedSpeedId);
                    if ($scope.countryCode != "NZ" || (speed && speed.groupingName && speed.groupingName.includes("US"))) {
                        $scope.getPricingBreakdown();
                    } else {
                        $scope.prepareRerateObject();
                        $scope.checkEconomyRun(selectedRate);
                    };
                };

                $scope.getAccessorialCharges();
            }
        };

        $scope.checkEconomyRun = function (selectedRate) {
            //if specific booking time is already set from saved booking don't mess with it
            if ($scope.booking.savedBooking == null || $scope.booking.savedBooking.bookingTime == null) {
                if ([37, 38].includes(selectedRate.speedId) && $scope.economyRun === false) {
                    $scope.setCurrentTime();
                    $scope.booking.holdJob = false;
                    $scope.timeSaved = false;
                    $scope.time.errors = [];
                    $scope.setEconomyRunTime();
                    $scope.economyRun = true;
                } else if ([37, 38].includes(selectedRate.speedId) && $scope.economyRun === true) {
                    //skip
                } else {
                    if ($scope.economyRun === true) {
                        $scope.setCurrentTime();
                        $scope.booking.holdJob = false;
                        $scope.timeSaved = false;
                        $scope.time.errors = [];
                    }
                    $scope.economyRun = false;
                }
            }
        };

        $scope.updateFlightRouteLine = function (selectedRate) {
            if ($scope.speeds.find(x => x.id === selectedRate.actualSpeedId).groupingName.includes("Flight")) {
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
            if ($scope.speeds.find(x => x.id === rate.speedId)?.groupingName.includes("Flight")) {
                return "airNationwide";
            }
            return $scope.booking.van ? "vanHire" : "carHire";
        };

        $scope.getSelectedRates = function () {
            if ($scope.rates.length === 0)
                return;

            for (i in $scope.rates) { //Get speed ids from schedule ids e.g. 24124 -> 124
                var speedLength = $scope.rates[i].speedId.toString().length;
                if (speedLength >= 4) {
                    $scope.rates[i].actualSpeedId = parseInt($scope.rates[i].speedId.toString().substring(speedLength - 3, speedLength));
                } else {
                    $scope.rates[i].actualSpeedId = $scope.rates[i].speedId;
                }
            }

            var shortestIndex = -1;
            var shortestDuration = 10000000;

            for (i in $scope.rates) { //Finds top rate to default select that is not direct
                if (($scope.rates[i].duration < shortestDuration && (!$scope.rates[i].serviceName.includes("DIRECT")) && $scope.rates[i].duration !== 0)
                    || $scope.rates.length === 1) {
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
                    if ($scope.booking.selectedRate) {
                        $scope.getAccessorialCharges();
                    }
                } else {
                    $scope.matchAndApplySelectedRate(shortestIndex, $scope.booking.presetSpeed);
                    if ($scope.booking.selectedRate) {
                        $scope.getAccessorialCharges();
                    }
                }
            }

            //Get price breakdown on auto-speed select
            if ($scope.booking.selectedRate) {
                //Change schedule speed id to normal speed id e.g. 449096 -> 96
                $scope.trimmedSpeedId = $scope.booking.selectedRate.actualSpeedId;

                if ($scope.countryCode == "NZ") {
                    $scope.checkEconomyRun($scope.booking.selectedRate);
                };

                if ($scope.checkIfSpeedIdAllowed($scope.booking.selectedRate.actualSpeedId)) {
                    var speed = $scope.speeds.find(x => x.id === $scope.booking.selectedRate.actualSpeedId);
                    if ($scope.countryCode != "NZ" || (speed && speed.groupingName && speed.groupingName.includes("US"))) {
                        $scope.getPricingBreakdown();
                    } else {
                        $scope.prepareRerateObject();
                    };
                };
            };
        };

        $scope.checkIfSpeedIdAllowed = function (speedId) {
            return (typeof $scope.allowedSpeeds.find(x => x.id === speedId) != 'undefined');
        };

        $scope.matchAndApplySelectedRate = function (shortestIndex, speedId) {
            var foundSpeed = $scope.rates
                .filter(x => x.actualSpeedId === speedId)
                .sort((a, b) => new Date(a.bookDate) - new Date(b.bookDate))[0];

            if (typeof foundSpeed !== 'undefined') {
                foundSpeed.selected = true;
                $scope.booking.selectedRate = foundSpeed;
            } else {
                if (shortestIndex !== -1) {
                    // Find matching rates and get the one with earliest bookDate
                    var selectedRate = $scope.rates
                        .filter(x => x.actualSpeedId === $scope.rates[shortestIndex].actualSpeedId)
                        .sort((a, b) => new Date(a.bookDate) - new Date(b.bookDate))[0];

                    selectedRate.selected = true;
                    $scope.booking.selectedRate = selectedRate;
                }
            }
            if ($scope.booking.selectedRate && $scope.speeds.find(x => x.id === $scope.booking.selectedRate.actualSpeedId).groupingName.includes("Flight")) {
                $scope.updateFlightRouteLine($scope.booking.selectedRate);
            }
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
                        if (($scope.rates[i].speedId == 79 || $scope.rates[i].speedId == 10) && $scope.rates[i].hidden != true) {
                            $scope.rates[i].hidden = true;
                            hiddenCount += 1
                        };
                    };
                };
                //Hide speeds for ACTRA (address book only logic)
                if ($scope.booking.client.addressBookOnly) {
                    if ($scope.booking.searchType !== "Google") {
                        for (i in $scope.rates) {
                            if (($scope.rates[i].speedId !== 85 && $scope.rates[i].speedId !== 86) && $scope.rates[i].hidden != true) {
                                $scope.rates[i].hidden = true;
                                hiddenCount += 1
                            };
                        };
                    } else {
                        for (i in $scope.rates) {
                            if (($scope.rates[i].speedId === 85 || $scope.rates[i].speedId === 86) && $scope.rates[i].hidden != true) {
                                $scope.rates[i].hidden = true;
                                hiddenCount += 1
                            };
                        };
                    };
                };

                if (ratesCount == hiddenCount) {
                    $scope.rates = null;
                    $scope.noRates = true;
                };
            };
        };

        $scope.splitDescription = function () {
            if (!$scope.speedDescription || !$scope.speedDescription.description) {
                return;
            }

            $scope.speedDescription.descriptions = $scope.speedDescription.description.split("\r");
            for (i in $scope.speedDescription.descriptions) {
                var parts = $scope.speedDescription.descriptions[i].split("=");
                var lastTildaPosition = parts[1].lastIndexOf('~');
                if (lastTildaPosition !== -1) {
                    parts[1] = parts[1].substring(0, lastTildaPosition);
                }
                $scope.speedDescription.descriptions[i] = parts;
            };

            if ($scope.accessorialCharges != null && $scope.accessorialCharges.length > 0) {
                $scope.addAccessorialChargesToPricingBreakdown();
            };
        };

        $scope.addAccessorialChargesToPricingBreakdown = function () {
            if (!$scope.speedDescription || !$scope.accessorialCharges) {
                return;
            }

            // Get selected charges
            var selectedCharges = $scope.accessorialCharges.filter(c => c.selected && !c.requiresQuote);

            // Add each selected charge to the descriptions array
            selectedCharges.forEach(function (charge) {
                var chargeDescription = [
                    charge.name,
                    " $" + charge.calculatedAmount.toFixed(2)
                ];
                $scope.speedDescription.descriptions.push(chargeDescription);
            });
        };

        $scope.fixedDecimal = function (x) {
            if (!x.includes('$')) {
                return Number.parseFloat(x).toFixed(2);
            } else {
                return Number.parseFloat(x.slice(2)).toFixed(2);
            }
        };

        $scope.prepareRerateObject = function () {
            $scope.rerateObject = {
                speedId: $scope.trimmedSpeedId,
                sizeId: $scope.booking.truck === true ? 4 : ($scope.booking.van ? 3 : ($scope.booking.bike && $scope.validBike ? 1 : 2)),
                From: {
                    streetAddress: $scope.booking.fromStreetAddress,
                    suburb: $scope.booking.fromCity,
                    suburbId: 0, //suburb name and postcode used to get suburbId unless cbd
                    postCode: $scope.booking.fromZipCode, //postcode passed to get more accurate suburb
                    city: $scope.booking.fromState,
                    latitude: $scope.booking.fromLat,
                    longitude: $scope.booking.fromLong
                },
                To: {
                    streetAddress: $scope.booking.toStreetAddress,
                    suburb: $scope.booking.toCity,
                    suburbId: 0, //suburb name and postcode used to get suburbId unless cbd
                    postCode: $scope.booking.toZipCode, //postcode passed to get more accurate suburb
                    city: $scope.booking.toState,
                    latitude: $scope.booking.toLat,
                    longitude: $scope.booking.toLong
                },
                Packages: $scope.booking.packageList,
                weight: ($scope.booking.totalBasicWeight > 0 ? $scope.booking.totalBasicWeight : $scope.getTotalWeightBoth()),
                quantity: $scope.isManualQuantity ? $scope.getTotalQuantityBoth() : $scope.getTotalQuantity(),
                isDangerousGoods: (typeof $scope.booking.dangerousGoods !== 'undefined' && $scope.booking.dangerousGoods == true),
                isPrebook: !$scope.checkIfCurrentDateTime(),
                dateTime: $scope.combineDateTime(),
                van: $scope.booking.van ?? false,
                bike: $scope.booking.bike ?? false,
                Truck: $scope.booking.truck == true ? {
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

            $scope.getRerateAmount();
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
            $scope.booking.podEmail = $scope.booking.clientContact.email;
            $scope.booking.podMobile = $scope.booking.clientContact.mobile;
            $scope.booking.sigNotRequired = $scope.booking.client.sigRequiredDefault;
        };

        $scope.clearExtraContact = function () {
            $scope.booking.pickupContact = null;
            $scope.booking.pickupPhone = null;
            $scope.booking.deliveryContact = null;
            $scope.booking.deliveryPhone = null;
            $scope.booking.pickupNotes = null;
            $scope.booking.deliveryNotes = null;
        };

        $scope.clearExtraReference = function () {
            $scope.booking.clientRefA = null;
            $scope.booking.clientRefB = null;
            $scope.booking.clientNotes = null;
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

        $scope.openReferenceModal = function (letter) {
            if (letter === 'A') {
                if (!$scope.referencesA) {
                    $scope.getReferences('A');
                }
                $('.referenceA-modal').modal();
            } else {
                if (!$scope.referencesB) {
                    $scope.getReferences('B');
                }
                $('.referenceB-modal').modal();
            }
        };

        $scope.addReference = function (letter) {
            if (letter === 'A') {
                $scope.referencesA.splice(0, 0, { id: null, name: null });
            } else {
                $scope.referencesB.splice(0, 0, { id: null, name: null });
            }

            // Focus the first input after DOM updates
            $timeout(function () {
                var modalClass = letter === 'A' ? '.referenceA-modal' : '.referenceB-modal';
                var inputs = document.querySelectorAll(modalClass + ' input[ng-model="reference.name"]');
                if (inputs.length > 0) {
                    inputs[0].focus();
                }
            });
        };

        $scope.removeReference = function (letter, referenceId) {
            var removeIndex = null;
            if (letter === 'A') {
                removeIndex = $scope.referencesA.map(item => item.id).indexOf(referenceId);
                $scope.referencesA.splice(removeIndex, 1);
            } else {
                removeIndex = $scope.referencesB.map(item => item.id).indexOf(referenceId);
                $scope.referencesB.splice(removeIndex, 1);
            }
        };

        $scope.revertReferenceChanges = function (letter) {
            if (letter === 'A') {
                $scope.referencesA = $scope.referencesAOriginal;
            } else {
                $scope.referencesB = $scope.referencesBOriginal;
            }
        };

        $scope.setReferenceDetails = function (reference, letter) {
            if (letter == "A") {
                $scope.booking.clientRefA = reference.name;
            } else if (letter == "B") {
                $scope.booking.clientRefB = reference.name;
            };
        };

        $scope.getReferenceSuggestions = function (searchText, letter) {
            searchText = searchText.toLowerCase();
            if (letter == "A") {
                $scope.referencesASuggestions = $scope.referencesA.filter(reference => reference.name.toLowerCase().includes(searchText));
            } else if (letter == "B") {
                $scope.referencesBSuggestions = $scope.referencesB.filter(reference => reference.name.toLowerCase().includes(searchText));
            }
        };

        $scope.openAccessorialChargeModal = function () {
            $('.accessorialCharge-modal').modal();
        };

        $scope.confirmAccessorialCharges = function () {
            $scope.jobLoading = true;
            $scope.getJobData();
        };

        $scope.processAccessorialCharges = function (preserveSelections, previousSelections, previousInputValues) {
            if (!$scope.accessorialCharges || $scope.accessorialCharges.length === 0) {
                return;
            }

            preserveSelections = preserveSelections || false;
            previousSelections = previousSelections || {};
            previousInputValues = previousInputValues || {};

            // Sort charges by CalculationOrder (lower numbers calculate first)
            $scope.accessorialCharges.sort((a, b) => {
                var orderA = a.calculationOrder || 0;
                var orderB = b.calculationOrder || 0;
                return orderA - orderB;
            });

            $scope.accessorialCharges.forEach(charge => {
                // Determine if charge is applicable to this job
                charge.applicable = $scope.isChargeApplicable(charge);

                // Restore previous input value if preserving, otherwise get default
                if (preserveSelections && previousInputValues.hasOwnProperty(charge.accessorialChargeId)) {
                    charge.inputValue = previousInputValues[charge.accessorialChargeId];
                } else {
                    charge.inputValue = $scope.getDefaultInputValue(charge);
                }
                charge.itemCount = 1; //$scope.getDefaultItemCount(charge);

                charge.isAutoPopulated = $scope.isInputAutoPopulated(charge);

                // Calculate the charge amount (will handle calculation order in separate function)
                charge.calculatedAmount = 0; // Initialize, will calculate after all are processed

                // Initialize manuallyToggled flag
                charge.manuallyToggled = false;

                // Auto-select certain charges based on job details
                charge.autoSelected = $scope.shouldAutoSelectCharge(charge);
                charge.selected = charge.autoSelected;
            });

            // Calculate amounts in order (important for percentage charges)
            $scope.calculateAllChargeAmounts();

            // Group by category for better UI organization after adding db field
        };

        // Determine if charge applies to this job
        $scope.isChargeApplicable = function (charge) {
            // Example: Only show van-specific charges for van jobs
            if (charge.name.toLowerCase().includes('van') && !$scope.booking.van) {
                return false;
            }

            // Only show truck-specific charges for truck jobs
            if (charge.name.toLowerCase().includes('truck') && !$scope.booking.truck) {
                return false;
            }

            return true;
        };

        // Get default input value based on charge type
        $scope.getDefaultInputValue = function (charge) {
            if (!charge.unitTypeName) return 0;

            var defaultValue = 0

            switch (charge.unitTypeName.toLowerCase()) {
                case 'pounds':
                    defaultValue = ($scope.booking.totalBasicWeight > 0 ? $scope.booking.totalBasicWeight : $scope.getTotalWeightBoth());
                    break;
                case 'kilograms':
                    defaultValue = ($scope.booking.totalBasicWeight > 0 ? $scope.booking.totalBasicWeight : $scope.getTotalWeightBoth());
                    break;
                case 'piece':
                    defaultValue = ($scope.isManualQuantity ? $scope.getTotalQuantityBoth() : $scope.getTotalQuantity());
                    break;
                case 'hour':
                case 'minute':
                case 'day':
                case 'flight':
                default:
                    defaultValue = 0;
            }

            if (charge.minimumQuantity && defaultValue < charge.minimumQuantity) {
                return charge.minimumQuantity;
            }

            return parseInt(defaultValue);
        };

        $scope.isInputAutoPopulated = function (charge) {
            if (!charge.unitTypeName) return false;

            switch (charge.unitTypeName.toLowerCase()) {
                case 'pounds':
                    return true;
                case 'kilograms':
                    return true;
                case 'piece':
                    return true;
                case 'hour':
                    return false;
                case 'minute':
                    return false;
                case 'day':
                    return false;
                case 'flight':
                    return false;
                default:
                    return false;
            }
        };

        /*$scope.getDefaultItemCount = function (charge) {
            // For per-piece charges that apply to each item
            if (charge.unitType === 'piece' || charge.chargeType === 'per_unit') {
                return 1; // Will multiply by inputValue
            }
            return 1;
        };*/

        $scope.calculateChargeAmount = function (charge, runningTotal) {
            if (!charge) return 0;

            let amount = 0;
            let billableUnits = 0;

            switch (charge.chargeType) {
                case 'flat':
                    amount = charge.baseRate || 0;
                    break;

                case 'per_unit':
                case 'hourly':
                    billableUnits = parseFloat(charge.inputValue) || 0;

                    // Apply free allowance
                    if (charge.freeAllowance && charge.freeAllowance > 0) {
                        let freeAllowanceConverted = charge.freeAllowance;

                        // Convert units if needed (e.g., minutes to hours)
                        if (charge.unitType === 'hour' && charge.freeAllowanceUnit === 'minute') {
                            freeAllowanceConverted = charge.freeAllowance / 60.0;
                        }

                        billableUnits = Math.max(0, billableUnits - freeAllowanceConverted);
                    }

                    // Apply minimum quantity
                    if (charge.minimumQuantity && billableUnits > 0 && billableUnits < charge.minimumQuantity) {
                        billableUnits = charge.minimumQuantity;
                    }

                    // Calculate amount
                    amount = billableUnits * (charge.itemCount || 1) * (charge.ratePerUnit || 0);
                    break;

                case 'percentage':
                    // Use runningTotal if provided (for high calculation order charges)
                    // Otherwise use base rate (for low calculation order charges)
                    var baseAmount = runningTotal || ($scope.booking.selectedRate ? $scope.booking.selectedRate.amount : 0);
                    amount = baseAmount * ((charge.percentageRate || 0) / 100);
                    break;

                case 'quote_based':
                    amount = 0;
                    charge.requiresQuote = true;
                    break;

                default:
                    amount = 0;
            }

            // Apply min/max constraints
            if (charge.minimumCharge && amount < charge.minimumCharge) {
                amount = charge.minimumCharge;
            }

            if (charge.maximumCharge && amount > charge.maximumCharge) {
                amount = charge.maximumCharge;
            }

            return parseFloat(amount.toFixed(2));
        };

        $scope.calculateAllChargeAmounts = function () {
            if (!$scope.accessorialCharges || !$scope.booking.selectedRate) {
                return;
            }

            // Start with base rate
            var runningTotal = $scope.booking.selectedRate.amount;

            // Calculate each charge in order
            $scope.accessorialCharges.forEach(charge => {
                if (charge.selected && !charge.requiresQuote) {
                    charge.calculatedAmount = $scope.calculateChargeAmount(charge, runningTotal);
                    runningTotal += charge.calculatedAmount;
                } else {
                    charge.calculatedAmount = $scope.calculateChargeAmount(charge, runningTotal);
                }
            });
        };

        $scope.shouldAutoSelectCharge = function (charge) {
            const name = charge.name.toLowerCase();

            // Lift gate - auto-select if truck with tail lift
            if (name.includes('lift gate') || name.includes('liftgate')) {
                if (name.includes('pickup') && $scope.booking.tailLiftPickup) {
                    return true;
                }
                if (name.includes('delivery') || name.includes('dropoff') && $scope.booking.tailLiftDropoff) {
                    return true;
                }
            }

            // Residential - auto-select if delivering to residential
            if (name.includes('residential') && $scope.booking.deliverTo === 'Residential') {
                return true;
            }

            // Dangerous goods fee - auto-select if DG
            if (name.includes('hazmat') && $scope.booking.dangerousGoods) {
                return true;
            }

            return false;
        };

        $scope.accessorialChargeToggled = function (charge) {
            // Mark that this was manually toggled by user
            charge.manuallyToggled = true;

            // Recalculate ALL charges in order (because selection affects percentage charges)
            $scope.calculateAllChargeAmounts();

            // Refresh pricing breakdown if it's displayed
            if ($scope.speedDescription) {
                $scope.splitDescription();
            }
        };

        $scope.recalculateCharge = function (charge) {
            // Enforce minimum quantity
            if (charge.minimumQuantity && charge.inputValue < charge.minimumQuantity) {
                charge.inputValue = charge.minimumQuantity;
            }

            // Recalculate ALL charges in order (because one change affects percentage charges)
            $scope.calculateAllChargeAmounts();

            // Refresh pricing breakdown if displayed
            if ($scope.speedDescription) {
                $scope.splitDescription();
            }
        };

        $scope.getSelectedAccessorialChargesTotal = function () {
            if (!$scope.accessorialCharges) return 0;

            return $scope.accessorialCharges
                .filter(c => c.selected && !c.requiresQuote)
                .reduce((sum, c) => sum + (c.calculatedAmount || 0), 0);
        };

        $scope.getSelectedAccessorialCharges = function () {
            if (!$scope.accessorialCharges) return [];

            return $scope.accessorialCharges.filter(c => c.selected && !c.requiresQuote);
        };

        $scope.hasAutoSelectedCharges = function () {
            if (!$scope.accessorialCharges) return false;
            return $scope.accessorialCharges.some(c => c.autoSelected);
        };

        $scope.updateAutoPopulatedChargeValues = function () {
            if (!$scope.accessorialCharges || !$scope.accessorialChargesInitialized) {
                return;
            }

            var hasChanges = false;

            $scope.accessorialCharges.forEach(charge => {
                // Update auto-populated field values
                if (charge.isAutoPopulated) {
                    var newValue = $scope.getDefaultInputValue(charge);
                    if (charge.inputValue !== newValue) {
                        charge.inputValue = newValue;
                        hasChanges = true;
                    }
                }

                // Re-check if charge should be auto-selected based on current job state
                // But only if it's not manually selected by user
                if (!charge.manuallyToggled) {
                    var shouldBeAutoSelected = $scope.shouldAutoSelectCharge(charge);
                    if (shouldBeAutoSelected !== charge.selected) {
                        charge.selected = shouldBeAutoSelected;
                        charge.autoSelected = shouldBeAutoSelected;
                    }
                }

                // Recalculate all charges in order
                $scope.calculateAllChargeAmounts();
            });

            // Force digest if changes were made
            if (hasChanges && !$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPercentageDescription = function (charge) {
            if (!charge || charge.chargeType !== 'percentage' || !$scope.accessorialCharges) {
                return 'of base rate';
            }

            var orders = $scope.accessorialCharges.map(c => c.calculationOrder || 0);
            var minOrder = Math.min(...orders);
            var maxOrder = Math.max(...orders);
            var currentOrder = charge.calculationOrder || 0;

            if (currentOrder === maxOrder && currentOrder !== minOrder) {
                return 'of total charges';
            } else if (currentOrder === minOrder && currentOrder !== maxOrder) {
                return 'of base rate';
            } else if (currentOrder === minOrder && currentOrder === maxOrder) {
                // Only one percentage charge or all have same order
                return 'of base rate';
            } else {
                // Middle calculation order
                return 'of subtotal (base + some charges)';
            }
        };

        $scope.getPercentageCalculationNote = function (charge) {
            if (!charge || charge.chargeType !== 'percentage' || !$scope.accessorialCharges) {
                return null;
            }

            var orders = $scope.accessorialCharges.map(c => c.calculationOrder || 0);
            var minOrder = Math.min(...orders);
            var maxOrder = Math.max(...orders);
            var currentOrder = charge.calculationOrder || 0;

            if (currentOrder === maxOrder && currentOrder !== minOrder) {
                return 'Applied after all other charges';
            } else if (currentOrder === minOrder && currentOrder !== maxOrder) {
                return 'Applied before other percentage charges';
            } else if (currentOrder !== minOrder && currentOrder !== maxOrder) {
                return 'Applied after charges with lower calculation order';
            }

            return null;
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
                    notes: ($scope.booking.deliveryNotes ?? "") + ($scope.booking.sigNotRequired != null && $scope.booking.sigNotRequired != "Other (add to 'Delivery Notes')" ? " " + $scope.booking.sigNotRequired : ""), //append leave location.
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
                //Ensures always sends the weight in LBS to the server
                dryIceWeight: $scope.booking.dangerousGoods === true ? ($scope.booking.dryIceWeightUnit === 'KG' ?parseFloat(($scope.booking.dryIceWeight * 2.20462262).toFixed(2)) : $scope.booking.dryIceWeight) :null,
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
                sourceId: 1, //desktop new booking page
                pickupReadyDateTime: $scope.booking.selectedRate.speedId.toString().length > 3 ? $scope.combineDateTime() : null,
                pickupTimeZone: $scope.booking.pickupTimeZone.displayName,
                loggedInContactId: $scope.booking.client.loggedInContactId,
                accessorialChargeGroupId: $scope.booking.selectedRate.accessorialChargeGroupId,
                deliverByDateTime: $scope.combineDeliverByDateTime(),
                deliverByTimeZone: $scope.booking.deliverByTimeZone.displayName,
                recurring: $scope.booking.recurring == true ? {
                    name: $scope.booking.recurringName,
                    days: $scope.getRecurranceDays(),
                    frequency: $scope.booking.recurringFrequency,
                    holidayBehaviour: $scope.booking.recurringHolidays ?? 0,
                    initialDays: $scope.booking.recurringInitialDays
                } : null,
                accessorialCharges: $scope.getSelectedAccessorialCharges().map(charge => ({
                    accessorialChargeId: charge.accessorialChargeId,
                    inputValue: charge.chargeType != 'percentage' ? charge.inputValue : (charge.calculationOrder == 0 ? $scope.booking.selectedRate.amount : $scope.booking.selectedRate.amount + $scope.getSelectedAccessorialChargesTotal() - charge.calculatedAmount),
                    itemCount: charge.itemCount || 1,
                    notes: null,
                    calculationOrder: charge.calculationOrder || 0
                }))
            };

            $scope.bookJob();
        };

        /* --- Confirmation Scheiße --- */

        $scope.getConfirmationAddress = function (direction) {
            if (direction == "from") {
                return ($scope.booking.pickupContact ? $scope.booking.pickupContact + ($scope.booking.pickupPhone ? " - " + $scope.booking.pickupPhone : "") + ",\n" : "") +
                    ($scope.booking.fromCompanyName ? $scope.booking.fromCompanyName + ",\n" : ($scope.getCompanyName("from") ? $scope.getCompanyName("from") + ",\n" : "")) +
                    ($scope.booking.fromExtra != null ? $scope.booking.fromExtra + ",\n" : "") +
                    ($scope.getStreetAddress("from") ? $scope.getStreetAddress("from") + ",\n" : "") + ($scope.booking.fromCity ? $scope.booking.fromCity + ",\n" : "") +
                    ($scope.booking.fromState ? $scope.booking.fromState + ($scope.booking.fromZipCode ? " " + $scope.booking.fromZipCode : "") : "");
            } else {
                return ($scope.booking.deliveryContact ? $scope.booking.deliveryContact + ($scope.booking.deliveryPhone ? " - " + $scope.booking.deliveryPhone : "") + ",\n" : "") +
                    ($scope.booking.toCompanyName ? $scope.booking.toCompanyName + ",\n" : ($scope.getCompanyName("to") ? $scope.getCompanyName("to") + ",\n" : "")) +
                    ($scope.booking.toExtra != null ? $scope.booking.toExtra + ",\n" : "") +
                    ($scope.getStreetAddress("to") ? $scope.getStreetAddress("to") + ",\n" : "") + ($scope.booking.toCity ? $scope.booking.toCity + ",\n" : "") + 
                    ($scope.booking.toState ? $scope.booking.toState + ($scope.booking.toZipCode ? " " + $scope.booking.toZipCode : "") : "");
            };
        };

        $scope.openLabelModal = function () {
            $('.printLabel-modal').modal();
        };

        $scope.createReturnBooking = function () {
            $scope.swapToFromAddress();
            $scope.addMinutes($scope.speeds.find(x => x.id === $scope.booking.selectedRate.actualSpeedId).minutes);
            $scope.timeSaved = true;
            $scope.returnJob = true;
            $scope.firstJobId = $scope.jobData.jobID;
            $scope.firstJobNumber = $scope.jobData.jobNumber;

            $scope.setStep('address');
        };

        $scope.isP2PSpeedGrouping = function () {
            var speed = $scope.speeds.find(x => x.id === $scope.booking.selectedRate.actualSpeedId);
            return speed.groupingName.includes("P2P");
        };

        $scope.getNewReturnChildJobNumber = function () {
            var speed = $scope.speeds.find(x => x.id === $scope.booking.selectedRate.actualSpeedId);
            var cleaned = $scope.firstJobNumber.replace(/[^0-9]+$/, '');
            return cleaned + speed.jobLetter + '2';
        }

        /* --- Intercom Scheiße --- */

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
            $scope.fromAddressBookCompanySaved = false;
            $scope.toAddressBookCompanySaved = false;
            $scope.setCurrentTime();
            $scope.booking.deliverTo = "Business";
            $scope.booking.searchType = "Google";
            $scope.booking.fromAddressBookSuggestions = [];
            $scope.booking.toAddressBookSuggestions = [];
            $scope.booking.quantity = 1;
            $scope.basicWeightSaved = false;
            $scope.booking.manualQuantity = [];
            $scope.booking.basicQuantity = [];
            $scope.isManualQuantity = false;
            $scope.addManualQuantityRow();
            $scope.booking.proofOfDelivery = "EMAILANDTEXT";
            $scope.validBike = false;
            $scope.economyRun = false;
            $scope.showFromCompany = false;
            $scope.showToCompany = false;
            $scope.timeZone = $scope.getTimeZoneInfo(Intl.DateTimeFormat().resolvedOptions().timeZone);
            $scope.booking.recurring = false;
            $scope.booking.dimensionsType = 1; // Default to Per Item
            $scope.booking.dryIceWeightUnit = 'LBS'; 
            $scope.returnJob = false;
            $scope.fromGeocodingUnderway = false;
            $scope.toGeocodingUnderway = false;
            $scope.manualGeocodingUnderway = false;
            $scope.currentAccessorialChargeGroupId = null;
            $scope.accessorialChargesInitialized = false;
        };

        $scope.retrieveAll = function () {
            $scope.getCountryCode();
            $scope.getClients(); //Also sets up intercom for nz after retrieving clients
            $scope.getTimeZones();
            $scope.getAllClients();
            $scope.getSuburbs();
            $scope.getAllowedSpeeds();
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
