angular
    .module("urgentOnePageBooking")
    .controller("stripeControl", ["$rootScope", "$scope", "$state", "stripesService", function ($rootScope, $scope, $state, stripesService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            stripesService.getClients()
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
            stripesService.getAllClients()
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
            stripesService.getThisClient($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedClient = data.client;

                        $scope.clients[$scope.clients.findIndex(e => e.id === $scope.user.selectedClient.id)] = $scope.user.selectedClient;
                    } else {
                        $rootScope.showNotification("Error getting this client", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this client", "fa-exclamation");
                });
        };

        $scope.getManualAPIData = function () {
            $scope.formats = [{ name: "PDF" }, { name: "EXCEL" }];
        };

        $scope.getStripePortal = function () {
            if ($scope.stripePortalCreateInProgress)
                return;

            $scope.stripePortalCreateInProgress = true;

            stripesService.getStripePortal($scope.user.selectedClient.stripeClientId)
                .then(function (data) {
                    if (data) {
                        window.open(data, "_blank");
                    } else {
                        $rootScope.showNotification("There was a problem retrieving your Credit Card portal. Please try again or get in contact with DFRNT.", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    $rootScope.showNotification("There was a problem retrieving your Credit Card portal. Please try again or get in contact with DFRNT.", "fa-exclamation");
                })
                .finally(() => $scope.stripePortalCreateInProgress = false);
        };

        /* --- General Functions --- */

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
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

        $scope.redirectCreditCard = function () {
            if ($scope.clients[0].id == 9196) {
                window.history.back();
            }
        };

        /* --- Init program --- */

        $scope.retrieveAll = function () {
            $scope.getClients();
            $scope.getAllClients();
            $scope.getManualAPIData();
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Credit Card";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);