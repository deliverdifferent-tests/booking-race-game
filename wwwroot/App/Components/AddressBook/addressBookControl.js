angular
    .module("urgentOnePageBooking")
    .controller("addressBookControl", ["$rootScope", "$scope", "$state", "addressBooksService", function ($rootScope, $scope, $state, addressBooksService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            addressBooksService.getClients()
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
            addressBooksService.getAllClients()
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

        $scope.getSuburbs = function () {
            addressBooksService.getSuburbs()
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

        $scope.getAddressBook = function () {
            addressBooksService.getAddressBook($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.addressBooks = data.addressBook;
                    } else {
                        $rootScope.showNotification("Error getting address books", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting address books", "fa-exclamation");
                });
        };

        $scope.updateAddressBook = function () {
            if ($scope.saveInProgress)
                return;

            $scope.saveInProgress = true;

            var created = $scope.user.selectedAddressBook.id === null || (typeof $scope.user.selectedAddressBook.id === 'undefined');

            var promise = $scope.user.selectedAddressBook.id
                ? addressBooksService.updateAddressBook($scope.user.selectedClient.id, $scope.user.selectedAddressBook)
                : addressBooksService.createAddressBook($scope.user.selectedClient.id, $scope.user.selectedAddressBook)

            promise
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedAddressBook = data.addressBook;
                        $scope.copy = false;
                        $rootScope.showNotification("Your address has been successfully " + (created ? "created!" : "updated!"), "fa-check");
                    } else {
                        $rootScope.showNotification("Error updating your address", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data) {
                        if (response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error updating your address", "fa-exclamation");
                    }
                })
                .finally(() => $scope.saveInProgress = false);
        };

        $scope.deleteAddressBook = function () {
            if ($scope.deleteInProgress)
                return;

            $rootScope.showPrompt("Confirm Address Deletion", "Permanently delete this address?", function (params) {

                $scope.deleteInProgress = true;

                addressBooksService.deleteAddressBook($scope.user.selectedAddressBook.id)
                    .then(function (data) {
                        if (data.success) {
                            $rootScope.showNotification("Address deleted successfully", "fa-check");
                            $scope.addressBookBack();
                        } else {
                            $rootScope.showNotification("Error deleting address", "fa-exclamation");
                        }
                    })
                    .catch(function (response) {
                        if (response.status === 400 && response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        } else {
                            $rootScope.showNotification("Error deleting address", "fa-exclamation");
                        }
                    })
                    .finally(() => $scope.deleteInProgress = false)
            });
        };

        $scope.getCountryCode = function () {
            addressBooksService.getCountryCode()
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
        }

        /* --- Error Checking --- */

        $scope.checkFormData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.user.errors = [];

                if (!$scope.user.selectedAddressBook) {
                    $scope.user.errors.push("You cannot save an empty address.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.updateAddressBook();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.user.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        /* --- Google Maps Functions --- */

        $scope.$watch('user.selectedAddressBook.addressDetails', function (newValue, oldValue, scope) {
            setTimeout(function () {
                if ($scope.user.selectedAddressBook && $scope.user.selectedAddressBook.address && $scope.user.selectedAddressBook.addressDetails) {
                    if ($scope.user.selectedAddressBook.addressDetails.geometry && $scope.user.selectedAddressBook.addressDetails.address_components) {
                        if ($scope.user.selectedAddressBook.addressDetails.geometry.location) {
                            $scope.user.selectedAddressBook.lat = $scope.user.selectedAddressBook.addressDetails.geometry.location.lat();
                            $scope.user.selectedAddressBook.lng = $scope.user.selectedAddressBook.addressDetails.geometry.location.lng();
                        }

                        if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("postal_code"))) {
                            $scope.user.selectedAddressBook.postCode = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.user.selectedAddressBook.postCode = null;
                        }

                        if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("street_number"))) {
                            $scope.user.selectedAddressBook.streetNumber = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("street_number")).long_name;
                        } else {
                            $scope.user.selectedAddressBook.streetNumber = null;
                        }

                        if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("route"))) {
                            $scope.user.selectedAddressBook.streetName = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("route")).long_name;
                        } else {
                            $scope.user.selectedAddressBook.streetName = null;
                        }

                        if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("sublocality"))) {
                            $scope.user.selectedAddressBook.suburbName = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.user.selectedAddressBook.suburbName = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.user.selectedAddressBook.suburbName = null;
                        }

                        if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality"))) {
                            $scope.user.selectedAddressBook.state = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality")).long_name;
                        } else {
                            $scope.user.selectedAddressBook.state = null;
                        }

                        if ($scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("subpremise"))) {
                            $scope.user.selectedAddressBook.addressExtras = $scope.user.selectedAddressBook.addressDetails.address_components.find(x => x.types.includes("subpremise")).long_name;
                        } else {
                            $scope.user.selectedAddressBook.addressExtras = null;
                        }

                        if ($scope.countryCode == "NZ") {
                            $scope.user.selectedAddressBook.suburbName = $scope.user.selectedAddressBook.suburbName.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); //E.g. Ōtāhuhu -> Otahuhu for comparison

                            $scope.user.selectedAddressBook.toSuburbId = $scope.matchSuburbName($scope.user.selectedAddressBook.suburbName);
                        }

                        $scope.user.selectedAddressBook.addressStreetName = ($scope.user.selectedAddressBook.streetNumber ? $scope.user.selectedAddressBook.streetNumber : "") + " "
                            + ($scope.user.selectedAddressBook.streetName ? $scope.user.selectedAddressBook.streetName : "");

                        $scope.user.selectedAddressBook.address = ($scope.user.selectedAddressBook.americanToExtra ? $scope.user.selectedAddressBook.americanToExtra + "/" : "") + $scope.user.selectedAddressBook.addressStreetName;

                        if ($scope.checkCompanyNameMatch($scope.user.selectedAddressBook.address, $scope.user.selectedAddressBook.addressDetails.name)) {
                            $scope.user.selectedAddressBook.address = $scope.user.selectedAddressBook.addressDetails.name + ", " + $scope.user.selectedAddressBook.address;
                            $scope.user.selectedAddressBook.addressCompanyName = $scope.user.selectedAddressBook.addressDetails.name;
                        }
                    }
                }

                $scope.$apply();
            }, 1000);
        });

        $scope.checkCompanyNameMatch = function (bookingName, companyName) {
            var splitBookingName = bookingName.split(" ");
            var splitCompanyName = companyName.split(" ");

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

        $scope.checkEmpty = function () {
            if ($scope.user.selectedAddressBook.address.length === 0) {
                $scope.user.selectedAddressBook.address = null;
                $scope.user.selectedAddressBook.addressDetails = null;
                $scope.user.selectedAddressBook.lat = null;
                $scope.user.selectedAddressBook.long = null;
            }
        };

        /* --- General Functions --- */

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                $scope.getAddressBook();
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

        $scope.editAddressBook = function () {
            $scope.setStep('edit');
        };

        $scope.getSuburbName = function (suburbId) {
            if (!suburbId) {
                return null;
            } else {
                return $scope.suburbs.find(x => x.id === suburbId).name;
            }
        };

        $scope.addressBookBack = function () {
            $scope.setStep('select');
            $scope.setPage('address');
            $scope.getAddressBook();
            $scope.user.selectedAddressBook = null;
            $scope.user.errors = null;
            $scope.copy = false;
        };

        $scope.copyAddressBook = function () {
            $scope.user.selectedAddressBook.id = null;
            $scope.copy = true;
            $scope.setStep('edit');
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
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.page = 'address';
            $scope.copy = false;
            $scope.user = { entryType: 1 };
            $scope.addressBooks = null;
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Address Book";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);