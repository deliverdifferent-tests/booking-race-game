angular
    .module("urgentOnePageBooking")
    .controller("savedBookingControl", ["$rootScope", "$scope", "$state", "savedBookingsService", function ($rootScope, $scope, $state, savedBookingsService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            savedBookingsService.getClients()
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
            savedBookingsService.getAllClients()
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

        $scope.getContacts = function (clientId) {
            savedBookingsService.getContacts(clientId)
                .then(function (data) {
                    if (data.success) {
                        $scope.contacts = data.contacts;
                    } else {
                        $rootScope.showNotification("Error getting contacts", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting contacts", "fa-exclamation");
                });
        };

        $scope.getSuburbs = function () {
            savedBookingsService.getSuburbs()
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
            savedBookingsService.getSpeeds($scope.user.selectedClient.id)
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

        $scope.getVehicleSizes = function () {
            savedBookingsService.getVehicleSizes($scope.user.selectedClient.id)
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

        $scope.getManualAPIData = function () {
            $scope.dangerousGoodsClasses = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }];
            $scope.proofOfDeliveries = [{ value: "EMAIL", name: "Email" }, { value: "TEXT", name: "Text" }, { value: "EMAILANDTEXT", name: "Email & Text" }]; //Null is "WEBSITE"
            $scope.signatureNotRequireds = [{ value: "Letter Box" }, { value: "Front Door" }, { value: "Back Door" }, { value: "Safe Place" }, { value: "Other (add to 'Delivery Notes')" }];
            $scope.trackings = [{ value: "Do Not Send Tracking" }];
        };

        $scope.getSavedJobs = function () {
            if ($scope.user.selectedClient.id === 9673) {
                $scope.getContacts($scope.user.selectedClient.id); //asure only
            }

            savedBookingsService.getJobSaveds($scope.user.selectedClient.id)
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
            if ($scope.saveInProgress)
                return;

            $scope.saveInProgress = true;

            $scope.user.selectedSavedBooking.dgDocument = $scope.user.dg && $scope.user.selectedSavedBooking.dgDocument == true ? 1 : null;
            $scope.user.selectedSavedBooking.proofOfDelivery = $scope.getProofOfDelivery();
            $scope.user.selectedSavedBooking.fromSuburb = $scope.getSuburbName($scope.user.selectedSavedBooking.fromSuburbId);
            $scope.user.selectedSavedBooking.toSuburb = $scope.getSuburbName($scope.user.selectedSavedBooking.toSuburbId);
            $scope.formatBookingTimeForBackend();

            var created = $scope.user.selectedSavedBooking.id === null;

            var promise = $scope.user.selectedSavedBooking.id
                ? savedBookingsService.updateSavedBooking($scope.user.selectedClient.id, $scope.user.selectedSavedBooking)
                : savedBookingsService.createSavedBooking($scope.user.selectedClient.id, $scope.user.selectedSavedBooking)

            promise
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedSavedBooking = data.jobSaved;
                        $scope.setSavedBooking();
                        $scope.copy = false;
                        $rootScope.showNotification("Your saved booking '" + data.jobSaved.name + "' has been successfully " + (created ? "created!" : "updated!"), "fa-check");
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
                .finally(() => $scope.saveInProgress = false);
        };

        $scope.deleteSavedBooking = function () {
            if ($scope.deleteInProgress)
                return;

            $rootScope.showPrompt("Confirm Saved Booking Deletion", "Permanently delete " + $scope.user.selectedSavedBooking.name + "?", function (params) {

                $scope.deleteInProgress = true;

                savedBookingsService.deleteSavedBooking($scope.user.selectedSavedBooking.id)
                    .then(function (data) {
                        if (data.success) {
                            $rootScope.showNotification("Saved Booking deleted successfully", "fa-check");
                            $scope.savedBookingBack();
                        } else {
                            $rootScope.showNotification("Error deleting saved booking", "fa-exclamation");
                        }
                    })
                    .catch(function (response) {
                        if (response.status === 400 && response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        } else {
                            $rootScope.showNotification("Error deleting saved booking", "fa-exclamation");
                        }
                    })
                    .finally(() => $scope.deleteInProgress = false)
            });
        };

        $scope.getCountryCode = function () {
            savedBookingsService.getCountryCode()
                .then(function (data) {
                    if (data) {
                        $scope.countryCode = data;
                    } else {
                        $rootScope.showNotification("Error getting country code", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting country code", "fa-exclamation");
                });
        };

        /* --- Error Checking --- */

        $scope.checkFormData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.user.errors = [];

                if (!$scope.user.selectedSavedBooking) {
                    $scope.user.errors.push("You cannot save a fully empty saved booking.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedSavedBooking.name) {
                    $scope.user.errors.push("This saved booking must be given a name.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.updateSavedBooking();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.user.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        /* --- General Functions --- */

        $scope.getProofOfDelivery = function () {
            if ($scope.user.selectedSavedBooking.proofOfDelivery == null) {
                return 0;
            } else if ($scope.user.selectedSavedBooking.proofOfDelivery == 'EMAIL') {
                return 1;
            } else if ($scope.user.selectedSavedBooking.proofOfDelivery == 'TEXT') {
                return 2;
            } else if ($scope.user.selectedSavedBooking.proofOfDelivery == 'EMAILANDTEXT') {
                return 3;
            } else {
                return 0;
            }
        };

        $scope.setProofOfDelivery = function () {
            if ($scope.user.selectedSavedBooking.proofOfDelivery == 0) {
                return null;
            } else if ($scope.user.selectedSavedBooking.proofOfDelivery == 1) {
                return 'EMAIL';
            } else if ($scope.user.selectedSavedBooking.proofOfDelivery == 2) {
                return 'TEXT';
            } else if ($scope.user.selectedSavedBooking.proofOfDelivery == 3) {
                return 'EMAILANDTEXT';
            } else {
                return null;
            }
        };

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                $scope.getSavedJobs();
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

        $scope.editSavedBooking = function () {
            $scope.setStep('edit');
            $scope.getVehicleSizes();
            $scope.getSpeeds();
            $scope.setSavedBooking();
        };

        $scope.setSavedBooking = function () {
            $scope.user.selectedSavedBooking.dgDocument = $scope.user.selectedSavedBooking.dgDocument == 1 ? true : false;
            $scope.user.dg = $scope.user.selectedSavedBooking.dgClass != null && $scope.user.selectedSavedBooking.dgDocument == true;
            $scope.user.selectedSavedBooking.proofOfDelivery = $scope.setProofOfDelivery();
            $scope.formatBookingTimeForFrontend();
        };

        $scope.intQuantity = function () {
            if (typeof $scope.user.selectedSavedBooking.quantity === 'string') {
                $scope.user.selectedSavedBooking.quantity = parseInt($scope.user.selectedSavedBooking.quantity);

                if ($scope.user.selectedSavedBooking.quantity >= 20) {
                    $scope.user.selectedSavedBooking.quantity = 20;
                } else if ($scope.user.selectedSavedBooking.quantity <= 1) {
                    $scope.user.selectedSavedBooking.quantity = 1;
                }
            };
        };

        $scope.getSuburbName = function (suburbId) {
            if (!suburbId) {
                return null;
            } else {
                return $scope.suburbs.find(x => x.id === suburbId).name;
            }
        };

        $scope.savedBookingBack = function () {
            $scope.setStep('select');
            $scope.setPage('address');
            $scope.getSavedJobs();
            $scope.user.selectedSavedBooking = null;
            $scope.user.errors = null;
            $scope.copy = false;
        };

        $scope.copySavedBooking = function () {
            $scope.user.selectedSavedBooking.id = null;
            $scope.copy = true;
            $scope.setStep('edit');
        };

        $scope.redirectCreditCard = function () {
            if ($scope.clients[0].id == 9196) {
                window.history.back();
            }
        };

        $scope.formatBookingTimeForBackend = function () {
            if ($scope.user.selectedSavedBooking.bookingTime != null) {
                var hours = String($scope.user.selectedSavedBooking.bookingTime.getHours()).padStart(2, '0');
                var minutes = String($scope.user.selectedSavedBooking.bookingTime.getMinutes()).padStart(2, '0');

                $scope.user.selectedSavedBooking.bookingTime = "1970-01-01T" + hours + ":" + minutes + ":00";
            }
        };

        $scope.formatBookingTimeForFrontend = function () {
            if ($scope.user.selectedSavedBooking.bookingTime != null) {
                $scope.user.selectedSavedBooking.bookingTime = new Date($scope.user.selectedSavedBooking.bookingTime);
            }
        };

        /* --- Init program --- */

        $scope.retrieveAll = function () {
            $scope.getCountryCode();
            $scope.getClients();
            $scope.getAllClients();
            $scope.getSuburbs();
            $scope.getManualAPIData();
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.page = 'address';
            $scope.copy = false;
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Saved Bookings";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);