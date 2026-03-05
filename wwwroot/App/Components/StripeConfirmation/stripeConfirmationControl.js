angular
    .module("urgentOnePageBooking")
    .controller("stripeConfirmationControl", ["$rootScope", "$scope", "$state", "confirmationsService", function ($rootScope, $scope, $state, confirmationsService) {

        /* --- API Functions --- */

        $scope.getSpeeds = function () {
            confirmationsService.getSpeeds()
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

        $scope.getSuburbs = function () {
            confirmationsService.getSuburbs()
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

        $scope.getThisJob = function () {
            if ($scope.jobLoading)
                return;

            $scope.jobLoading = true;

            confirmationsService.getThisJob($state.params.jobId, $state.params.isBulk, $state.params.prebook)
                .then(function (data) {
                    if (data.success && data.job && (data.job.clientId == 9196 || data.job.clientId == 35957)) { //only show creditcard jobs on this page
                        $scope.thisJob = data.job;
                        $scope.thisJob.date = new Date($scope.thisJob.date);
                        $scope.thisJob.time = new Date($scope.thisJob.time);
                        if ($scope.thisJob.clientId == 9196) {
                            $scope.setPaymentIntent($scope.thisJob.id, $scope.thisJob.jobNumber);
                            $scope.toggleJobVoid($scope.thisJob.id, $scope.thisJob.jobNumber);
                        } else {
                            $scope.jobLoading = false;
                        }
                        //$scope.sendCashReceiptEmail();
                    } else {
                        $rootScope.showNotification("Error getting this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this job", "fa-exclamation");
                });
        };

        $scope.toggleJobVoid = function (jobId, jobNumber) {
            confirmationsService.toggleJobVoid(jobId, jobNumber, false)
                .then(function (data) {
                    if (data.success) {
                        //Need to do something here? Job is unvoided
                    } else {
                        $rootScope.showNotification("Error getting this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this job", "fa-exclamation");
                });
        };

        $scope.setPaymentIntent = function (jobId, jobNumber) {
            confirmationsService.setPaymentIntent(jobId, jobNumber)
                .then(function (data) {
                    if (data) {
                        //Shouldn't need to do anything. PI is set.
                    } else {
                        $rootScope.showNotification("Error getting this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this job", "fa-exclamation");
                })
                .finally(() => $scope.jobLoading = false);
        };

        /*$scope.sendCashReceiptEmail = function () {
            if ($scope.sendEmailInProgress)
                return;

            $scope.sendEmailInProgress = true;

            var emailRequest = { email: $state.params.email, body: "", title: "Cash Receipt " + $scope.thisJob.jobNumber, jobId: $scope.thisJob.id, customerName: $scope.thisJob.bookedBy, isBulk: $state.params.isBulk === "False" ? false : true, prebook: $state.params.prebook === "False" ? false : true };

            confirmationsService.sendEmail(emailRequest)
                .then(function (data) {
                    $rootScope.showNotification("An cash receipt for this job has been sent to " + $state.params.email + ".", "fa-check");
                })
                .catch(function (response) {
                    $rootScope.showNotification("Error sending cash receipt.", "fa-exclamation");
                })
                .finally(() => $scope.sendEmailInProgress = false);
        };*/

        $scope.getManualAPIData = function () {
            $scope.labelSizes = [{ value: 1, name: "Label (100 X 174mm)" }, { value: 3, name: "Label (100 X 150mm)" }, { value: 2, name: "Label (110 X 120mm)" }]; //Null is PDF
        };

        /* --- General Functions --- */

        $scope.getConfirmationAddress = function (direction) {
            if (direction == "from") {
                if ($state.params.isBulk != "True") {
                    return ($scope.thisJob.fromContactName ? $scope.thisJob.fromContactName + ($scope.thisJob.fromPhoneNumber ? " - " + $scope.thisJob.fromPhoneNumber : "") + ",\n" : "") +
                        /*($scope.booking.fromCompanyName ? $scope.booking.fromCompanyName + ",\n" : ($scope.getCompanyName("from") ? $scope.getCompanyName("from") + ",\n" : "")) +
                        ($scope.booking.fromExtra != null ? $scope.booking.fromExtra + ",\n" : "") +*/
                        $scope.thisJob.fromAddress + ",\n" + $scope.getSuburbName($scope.thisJob.fromAddressSuburbId); /*+ ",\n" +
                        ($scope.booking.fromCity ? $scope.booking.fromCity + ($scope.booking.fromPostCode ? " " + $scope.booking.fromPostCode : "") : "");*/
                } else {
                    return $scope.thisJob.fromAddress;
                }
            } else {
                if ($state.params.isBulk != "True") {
                    return ($scope.thisJob.toContactName ? $scope.thisJob.toContactName + ($scope.thisJob.toPhoneNumber ? " - " + $scope.thisJob.toPhoneNumber : "") + ",\n" : "") +
                        /*($scope.booking.toCompanyName ? $scope.booking.toCompanyName + ",\n" : ($scope.getCompanyName("to") ? $scope.getCompanyName("to") + ",\n" : "")) +
                        ($scope.booking.toExtra != null ? $scope.booking.toExtra + ",\n" : "") +*/
                        $scope.thisJob.toAddress + ",\n" + $scope.getSuburbName($scope.thisJob.toAddressSuburbId); /*+ ",\n" +
                        ($scope.booking.toCity ? $scope.booking.toCity + ($scope.booking.toPostCode ? " " + $scope.booking.toPostCode : "") : "");*/
                } else {
                    return $scope.thisJob.toAddress;
                }
            };
        };

        $scope.openNewTab = function (url) {
            window.open(url, '_blank');
        };

        $scope.openLabelModal = function () {
            $('.printLabel-modal').modal();
        };

        $scope.printLabel = function () {
            if ($scope.printLabelInProgress)
                return;

            $scope.printLabelInProgress = true;

            if ($scope.thisJob.isParentBulk === true) {
                window.open(`Labels/BulkJobs/${$scope.thisJob.parentId}`);
            } else if ($scope.thisJob.isBulk === true) {
                window.open(`Labels/BulkJobs/${$scope.thisJob.id}`);
            } else {
                window.open(`Labels/Jobs/${$scope.thisJob.jobID}/${$scope.thisJob.clientId}/${$state.params.prebook}/${$scope.thisJob.labelSize}`);
            }

            $scope.printLabelInProgress = false;
        };

        $scope.getTime = function () {
            var today = new Date();
            var roundedMins = Math.ceil(today.getMinutes() / 10) * 10;
            var hours = roundedMins != 60 ? String(today.getHours()).padStart(2, '0') : String(today.getHours() + 1).padStart(2, '0');
            var minutes = String(roundedMins != 60 ? roundedMins : 00).padStart(2, '0'); //Get mins rounded to nearest 10 (or 00 if 60)

            $scope.currTime = new Date($scope.minDate + "T" + hours + ":" + minutes + ":00");

            if (!$scope.booking.deliveryTime) {
                $scope.booking.deliveryTime = $scope.currTime;
            };
        };

        $scope.checkIfCurrentDateTime = function () {
            if ($scope.currTime.getTime() === $scope.booking.deliveryTime.getTime() && $scope.currDate.getTime() === $scope.booking.deliveryDate.getTime()) {
                return true;
            } else {
                return false;
            }
        };

        $scope.getSpeedName = function (speedId) {
            var index = $scope.speeds.findIndex(function (item, i) {
                return item.id === speedId
            });
            return $scope.speeds[index].name;
        };

        $scope.getSuburbName = function (suburbId) {
            var index = $scope.suburbs.findIndex(function (item, i) {
                return item.id === suburbId
            });
            return $scope.suburbs[index].name;
        };

        /* --- Init program --- */

        $scope.initAll = function () {
            $scope.thisJob = {};
            $scope.getSpeeds();
            $scope.getSuburbs();
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Confirmation";

            $state.current.data.hideOldPage = true;
            $state.current.data.hideForCreditCard = true;

            $scope.initAll();
            $scope.getThisJob();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);