angular
    .module("urgentOnePageBooking")
    .controller("dimensionControl", ["$rootScope", "$scope", "$state", "dimensionsService", function ($rootScope, $scope, $state, dimensionsService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            dimensionsService.getClients()
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
            dimensionsService.getAllClients()
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

        $scope.getDimensions = function () {
            dimensionsService.getDimensions($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.dimensions = data.stockSizes;
                    } else {
                        $rootScope.showNotification("Error getting stock sizes", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting stock sizes", "fa-exclamation");
                });
        }

        $scope.updateDimensions = function () {
            if ($scope.updateInProgress)
                return;

            $scope.updateInProgress = true;

            var promises = [];
            for (i in $scope.user.dimensions) {
                if ($scope.user.dimensions[i].changed) {
                    promises.push($scope.user.dimensions[i].id
                        ? dimensionsService.updateDimension({ "data": $scope.user.dimensions[i] })
                        : dimensionsService.createDimension({ "clientId": $scope.user.selectedClient.id, "data": $scope.user.dimensions[i] }));
                    $scope.user.dimensions[i].changed = false;
                    $scope.user.dimensions[i].new = false;
                }
            };

            Promise.all(promises)
                .then(function (data) {
                    var successes = data.filter(item => item.success === true);
                    if (successes.length === data.length) {
                        $rootScope.showNotification("Your dimension changes have been successfully changed", "fa-check");
                        $scope.getDimensions();
                    } else {
                        $rootScope.showNotification("Error updating dimensions", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.status === 400 && response.data.messages && response.data.messages.length > 0) {
                        $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                    } else {
                        $rootScope.showNotification("Error updating dimensions", "fa-exclamation");
                    }
                })
                .finally(() => $scope.updateInProgress = false);
        };

        $scope.deleteDimension = function (index) {
            if ($scope.deleteInProgress)
                return;

            if ($scope.user.dimensions[index].new) {
                $scope.user.dimensions.splice(index, 1);
                return;
            }

            $rootScope.showPrompt("Confirm Dimension Deletion", "Permanently delete dimension?", function (params) {

                $scope.deleteInProgress = true;

                dimensionsService.deleteDimension({ "id": $scope.user.dimensions[index].id })
                    .then(function (data) {
                        if (data.success) {
                            $rootScope.showNotification("Dimension deleted successfully", "fa-check");
                            $scope.getDimensions();
                        } else {
                            $rootScope.showNotification("Error deleting dimensions", "fa-exclamation");
                        }
                    })
                    .catch(function (response) {
                        if (response.status === 400 && response.data.messages && response.data.messages.length > 0) {
                            $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                        } else {
                            $rootScope.showNotification("Error deleting dimensions", "fa-exclamation");
                        }
                    })
                    .finally(() => $scope.deleteInProgress = false)
            });
        };

        $scope.getCountryCode = function () {
            dimensionsService.getCountryCode()
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
            if ($scope.countryCode == 'US') {
                $scope.weightUnit = 'LB';
                $scope.dimsUnit = 'IN';
                $scope.cubicUnit = 'F³';
            } else {
                $scope.weightUnit = 'KG';
                $scope.dimsUnit = 'CM';
                $scope.cubicUnit = 'M³';
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

                if (!$scope.checkAllNames()) {
                    $scope.user.errors.push("Please check all names again. They must be changed from '-- Custom --'.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.checkAllRows()) {
                    $scope.user.errors.push("Please check all rows again. All dimensions should be greater than 0. Weight must be at least 1kg.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.updateDimensions();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.user.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkAllRows = function () {
            for (i in $scope.user.dimensions) {
                if ($scope.user.dimensions[i].length < 0.1) {
                    return false;
                } else if ($scope.user.dimensions[i].width < 0.1) {
                    return false;
                } else if ($scope.user.dimensions[i].height < 0.1) {
                    return false;
                } else if ($scope.user.dimensions[i].weight < 1) {
                    return false;
                }
            }
            return true;
        };

        $scope.checkAllNames = function () {
            for (i in $scope.user.dimensions) {
                if ($scope.user.dimensions[i].name === "-- Custom --") {
                    return false;
                }
            }
            return true;
        }

        /* --- General Functions --- */

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                if (!$scope.user.internal) {
                    $scope.editDimensions();
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

        $scope.editDimensions = function () {
            $scope.getDimensions();
            $scope.setStep('edit');
        };

        $scope.addDimensionRow = function () {
            $scope.user.dimensions.splice(0, 0, { id: null, ordering: 0, name: "-- Custom --", length: 0, width: 0, height: 0, volume: 0, weight: 0, isDefaultSize: 0, changed: true, new: true });
        };

        $scope.getVolume = function (dimension) {
            if (dimension.length > 0.1 && dimension.width > 0.1 && dimension.height > 0.1) {
                var baseValue = $scope.countryCode == 'NZ' ? ((dimension.length * 0.01) * (dimension.width * 0.01) * (dimension.height * 0.01)) :
                    (dimension.length * dimension.width * dimension.height / 1728);
                dimension.volume = Math.round(baseValue * 1000) / 1000;
            }
            dimension.changed = true;
        };

        $scope.dimensionsBack = function () {
            if ($scope.clients.length === 1 && !$scope.user.internal) {
                $state.go("setting");
            } else {
                $scope.user.errors = null;
                $scope.setStep('select');
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
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Dimensions";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);