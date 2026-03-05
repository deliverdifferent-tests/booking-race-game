angular
    .module("urgentOnePageBooking")
    .controller("clientControl", ["$rootScope", "$scope", "$state", "clientsService", function ($rootScope, $scope, $state, clientsService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            clientsService.getClients()
                .then(function (data) {
                    if (data.success) {
                        $scope.clients = data.clients;

                        $scope.redirectCreditCard();

                        $state.current.data.contactId = $scope.clients[0].loggedInContactId;

                        $scope.setClient();
                    } else {
                        $rootScope.showNotification("Error getting clients", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting clients", "fa-exclamation");
                });
        };

        $scope.getAllClients = function () {
            clientsService.getAllClients()
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
            clientsService.getThisClient($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedClient = data.client;
                    } else {
                        $rootScope.showNotification("Error getting this client", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this client", "fa-exclamation");
                });
        };

        $scope.getSuburbs = function () {
            clientsService.getSuburbs()
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
            clientsService.getReferences($scope.user.selectedClient.id, letter)
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
                data = { "id": $scope.user.selectedClient.id, "refId": subDiffIds[i].id, "letter": letter };
                deletePromises.push(clientsService.deleteReference(data));
            };

            Promise.all(deletePromises)
                .then(function (data) {
                    var createPromises = [];
                    for (i in addDiff) {
                        data = { "id": $scope.user.selectedClient.id, "refName": addDiff[i], "letter": letter };
                        createPromises.push(clientsService.createReference(data));
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

        $scope.saveClient = function () {
            if ($scope.saveInProgress)
                return;

            $scope.saveInProgress = true;

            $scope.user.selectedClient.addressStreetName = $scope.user.selectedClient.address;

            clientsService.updateClient({ "id": $scope.user.selectedClient.id, "data": $scope.user.selectedClient })
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedClient = data.client;
                        $scope.user.selectedClient.address = $scope.user.selectedClient.addressStreetName;
                        $rootScope.showNotification("Client updated successfully", "fa-check");
                    } else if (data.messages.length > 0) {
                        $rootScope.showNotification(data.messages[0].message, "fa-exclamation");
                    } else {
                        $rootScope.showNotification("Error updating client", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.status === 400 && response.data.messages && response.data.messages.length > 0)
                        $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                    else
                        $rootScope.showNotification("Error updating client", "fa-exclamation");
                })
                .finally(() => $scope.saveInProgress = false);
        };

        $scope.getCountryCode = function () {
            clientsService.getCountryCode()
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

        $scope.setCountryCodeOptions = function () {
            $scope.autocompleteOptions = {
                watchEnter: true,
                country: $scope.countryCode
            };
            if ($scope.countryCode == 'US') {
                $scope.autocompleteOptions.country = 'US,CA';
            };
        };

        /* --- Error Checking --- */

        $scope.checkFormData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.user.errors = [];

                if (!$scope.user.selectedClient) {
                    $scope.user.errors.push("A client must be selected to save changes.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedClient.name) {
                    $scope.user.errors.push("You must enter your company's name.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedClient.legalName) {
                    $scope.user.errors.push("You must enter your company's legal name.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedClient.addressSearch && (!$scope.user.selectedClient.latitude || !$scope.user.selectedClient.longitude)) {
                    $scope.user.errors.push("You must search for and select an address from the 'Address Search' field.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedClient.address) {
                    $scope.user.errors.push("You must enter your company's street address and number.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedClient.americanCity) {
                    $scope.user.errors.push("You must enter your company's city.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.countryCode == "NZ" && !$scope.user.selectedClient.suburbId) {
                    $scope.user.errors.push("You must select a valid suburb from the suburb list.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.saveClient();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.user.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        /* --- Address Functions --- */

        $scope.$watch('user.addressDetails', function (newValue, oldValue, scope) {
            setTimeout(function () {
                if ($scope.user && $scope.user.selectedClient && $scope.user.selectedClient.addressSearch && $scope.user.addressDetails) {
                    if ($scope.user.addressDetails.geometry && $scope.user.addressDetails.address_components) {
                        //Google maps geocoding
                        if ($scope.user.addressDetails.geometry.location) {
                            $scope.user.selectedClient.latitude = $scope.user.addressDetails.geometry.location.lat();
                            $scope.user.selectedClient.longitude = $scope.user.addressDetails.geometry.location.lng();
                        }

                        if ($scope.user.addressDetails.address_components.find(x => x.types.includes("postal_code"))) { //Zip Code
                            $scope.user.selectedClient.americanZipCode = $scope.user.addressDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.user.selectedClient.americanZipCode = null;
                        }

                        if ($scope.user.addressDetails.address_components.find(x => x.types.includes("street_number"))) { //Street Number
                            $scope.user.selectedClient.americanStreetNumber = $scope.user.addressDetails.address_components.find(x => x.types.includes("street_number")).long_name;
                        } else {
                            $scope.user.selectedClient.americanStreetNumber = null;
                        }

                        if ($scope.user.addressDetails.address_components.find(x => x.types.includes("route"))) { //Street Name
                            $scope.user.selectedClient.americanStreetName = $scope.user.addressDetails.address_components.find(x => x.types.includes("route")).long_name;
                        } else {
                            $scope.user.selectedClient.americanStreetName = null;
                        }

                        if ($scope.user.addressDetails.address_components.find(x => x.types.includes("sublocality"))) { //City
                            $scope.user.selectedClient.americanCity = $scope.user.addressDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.user.addressDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.user.selectedClient.americanCity = $scope.user.addressDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.user.selectedClient.americanCity = null;
                        }

                        if ($scope.user.addressDetails.address_components.find(x => x.types.includes("administrative_area_level_1"))) { //State
                            $scope.user.selectedClient.americanState = $scope.user.addressDetails.address_components.find(x => x.types.includes("administrative_area_level_1")).long_name;
                        } else {
                            $scope.user.selectedClient.americanState = null;
                        }

                        $scope.user.selectedClient.address = ($scope.user.selectedClient.americanStreetNumber ? $scope.user.selectedClient.americanStreetNumber : "") + " "
                            + ($scope.user.selectedClient.americanStreetName ? $scope.user.selectedClient.americanStreetName : "");

                        $scope.user.selectedClient.suburbId = $scope.matchSuburbName($scope.user.selectedClient.americanCity);

                        $scope.user.selectedClient.addressSearch = $scope.user.addressDetails.name ? $scope.user.addressDetails.name + ", " + ($scope.user.selectedClient.americanCity ? $scope.user.selectedClient.americanCity : "") : // + city
                            $scope.user.selectedClient.address + ", " + ($scope.user.selectedClient.americanCity ? $scope.user.selectedClient.americanCity : ""); //city name

                        $scope.user.selectedClient.fromDeliveryAddress = $scope.user.addressDetails.formatted_address;
                    }
                }

                $scope.$apply();
            }, 1000);
        });

        $scope.matchSuburbName = function (suburbName) {
            suburbName = suburbName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            var suburb = $scope.suburbs.find(x => x.name === suburbName);
            if (typeof suburb !== 'undefined') {
                return suburb.id;
            } else {
                suburb = $scope.suburbs.find(x => x.alias !== null && x.alias.includes(suburbName));
                if (typeof suburb !== 'undefined') {
                    return suburb.id;
                } else {
                    return null;
                }
            };
        };

        /* --- General Functions --- */

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                if (!$scope.user.internal) {
                    $scope.editClient();
                }
            }
            //Hides old booking if stripe
            $scope.setStripeState();
        };

        $scope.setInternal = function () {
            for (i in $scope.clients) {
                if ($scope.clients[i].baseClient === true) {
                    $scope.user.internal = $scope.clients[i].internal;
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

        $scope.setStep = function (step) {
            $scope.step = step;
        };

        $scope.setPage = function (page) {
            $scope.page = page;
        };

        $scope.editClient = function () {
            $scope.getThisClient();
            $scope.getReferences("A");
            $scope.getReferences("B");
            $scope.setStep('edit');
        };

        $scope.checkEmpty = function () {
            if ($scope.user.selectedClient.addressSearch.length === 0) {
                $scope.clearAddressSearch();
            };
        };

        $scope.clearAddressSearch = function () {
            $scope.user.selectedClient.addressSearch = null;
            $scope.user.addressDetails = null;
        };

        $scope.openReferenceModal = function (letter) {
            if (letter === 'A') {
                $('.referenceA-modal').modal();
            } else {
                $('.referenceB-modal').modal();
            }
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

        $scope.addReference = function (letter) {
            if (letter === 'A') {
                $scope.referencesA.splice(0, 0, { id: null, name: null });
            } else {
                $scope.referencesB.splice(0, 0, { id: null, name: null });
            }
        };

        $scope.revertReferenceChanges = function (letter) {
            if (letter === 'A') {
                $scope.referencesA = $scope.referencesAOriginal;
            } else {
                $scope.referencesB = $scope.referencesBOriginal;
            }
        };

        $scope.clientBack = function () {
            if ($scope.clients.length === 1 && !$scope.user.internal) {
                $state.go("setting");
            } else {
                $scope.setStep('select');
                $scope.setPage('client');
                $scope.user.errors = null;
            }
        };

        $scope.redirectCreditCard = function () {
            if ($scope.clients[0].id == 9196) {
                window.history.back();
            }
        };

        /* --- Init program --- */

        $scope.retrieveAll = function () {
            $scope.getCountryCode();
            $scope.getClients();
            $scope.getAllClients();
            $scope.getSuburbs();
            $scope.sigNotRequireds = [{ value: "Letter Box" }, { value: "Front Door" }, { value: "Back Door" }, { value: "Safe Place" }, { value: "Other (add to 'Delivery Notes')" }]; //Null is sig required
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.page = 'client';
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Clients";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);