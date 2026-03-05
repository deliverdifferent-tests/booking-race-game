angular
    .module("urgentOnePageBooking")
    .controller("reportControl", ["$rootScope", "$scope", "$state", "reportsService", function ($rootScope, $scope, $state, reportsService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            reportsService.getClients()
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
            reportsService.getAllClients()
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
        $scope.getManualAPIData = function () {
            $scope.formats = [{ name: "PDF" }, { name: "EXCEL" }];
        };

        $scope.executeIngramReport = function () {
            if ($scope.getReportInProgress)
                return;

            $scope.getReportInProgress = true;

            var date = $scope.getFormattedDate($scope.user.report.date);

            var time = $scope.getFormattedTime($scope.user.report.time);

            var format = $scope.user.report.format ?? "PDF";

            reportsService.getIngramManifestReport(date, time, $scope.user.selectedClient.id, format, 'Ingram Manifest Report')
                .then(function (data) {
                    if (data) {
                        // data is already a Blob object, no Base64 decoding needed!
                        const url = URL.createObjectURL(data);
                        window.open(url, '_blank');
                        // Clean up the URL object after a short delay
                        setTimeout(() => URL.revokeObjectURL(url), 100);


                        //$scope.label = data;
                        //// Remove data URL prefix if present
                        //const base64 = $scope.label.replace(/^data:application\/pdf;base64,/, '');

                        //// Decode base64 to binary
                        //const binaryStr = atob(base64);

                        //// Convert binary to Uint8Array
                        //const bytes = new Uint8Array(binaryStr.length);
                        //for (let i = 0; i < binaryStr.length; i++) {
                        //    bytes[i] = binaryStr.charCodeAt(i);
                        //}
                        //const blob = new Blob([bytes], { type: 'application/pdf' });
                        //const url = URL.createObjectURL(blob);
                        //window.open(url);
                    } else {
                        $rootScope.showNotification("Error getting report", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting report", "fa-exclamation");
                })
                .finally(() => $scope.getReportInProgress = false);
        };

        /* --- General Functions --- */

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                if (!$scope.user.internal) {
                    $scope.viewReports();
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

        $scope.viewReports = function () {
            $scope.setStep('edit');
        };

        $scope.reportsBack = function () {
            if ($scope.clients.length === 1 && !$scope.user.internal) {
                $state.go("setting");
            } else {
                $scope.setStep('select');
            }
        };

        $scope.setDownloadType = function () {
            $scope.user.report.downloadType = 1;
        };

        $scope.getFormattedDate = function (thisDate) {
            var mm = thisDate.getMonth() + 1;
            var dd = thisDate.getDate();
            return thisDate.getFullYear() + "-" + (mm > 9 ? "" : "0") + mm + "-" + (dd > 9 ? "" : "0") + dd;
        };

        $scope.getFormattedTime = function (thisTime) {
            var hh = thisTime.getHours();
            var mm = thisTime.getMinutes();
            return (hh > 9 ? "" : "0") + hh + ":" + (mm > 9 ? "" : "0") + mm;
        };

        $scope.getNextWorkDay = function (date) {
            let day = date.getDay(), add = 1;
            if (day === 6) add = 2; else
                if (day === 5) add = 3;
            date.setDate(date.getDate() + add); // will correctly handle 31+1 > 32 > 1st next month
            return date;
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
            $scope.user.report = {};
            $scope.user.report.date = $scope.getNextWorkDay(new Date());
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Reports";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);