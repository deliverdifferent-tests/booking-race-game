angular
    .module("urgentOnePageBooking")
    .controller("termsControl", ["$rootScope", "$scope", "$state", function ($rootScope, $scope, $state) {

        /* --- Init program --- */

        $scope.initAll = function () {
            $scope.step = 'terms';
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Credit Card Terms";

            $state.current.data.hideOldPage = true;
            $state.current.data.hideForCreditCard = true;

            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);