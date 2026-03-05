angular
    .module("urgentOnePageBooking")
    .controller("settingControl", ["$rootScope", "$scope", "$state", "homesService", function ($rootScope, $scope, $state, homesService) {

        /* --- API Functions --- */

        $scope.getCountryCode = function () {
            homesService.getCountryCode()
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

        /* --- General Functions --- */

        $scope.setStep = function (step) {
            $scope.step = step;
        };

        $scope.setPage = function (page) {
            $scope.page = page;
        };

        /* --- Init program --- */

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Settings";

            $state.current.data.hideOldPage = true;
            $state.current.data.hideForCreditCard = true;

            $scope.getCountryCode();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);