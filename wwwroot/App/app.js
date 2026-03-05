angular
    .module('urgentOnePageBooking', [
        'ui.router',
        'ui.select',
        "angularUtils.directives.dirPagination",
        'ngSanitize',
        'ngMap',
        'ngMapAutocomplete',
        'ui.bootstrap'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider','uibTimepickerConfig', function ($urlRouterProvider, $stateProvider, $locationProvider, uibTimepickerConfig) {
        // Magic sauce, immediate so the value is stored and we don't need to lookup every check
        // Force desktop view for testbed (all fields on one page)
        var _isNotMobile = true;

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: (_isNotMobile) ? 'App/Components/Home/desktopHomeView.html' : 'App/Components/Home/homeView.html',
                controller: (_isNotMobile) ? 'desktopHomeControl' : 'homeControl',
                data: { pageTitle: "Home", pageID: "home", pageMenu: "home", background: ((_isNotMobile) ? "background" : "mobile") }
            })
            .state('desktop', {
                url: '/desktop',
                templateUrl: 'App/Components/Home/desktopHomeView.html',
                controller: 'desktopHomeControl',
                data: { pageTitle: "Home", pageID: "home", pageMenu: "home", background: "background" }
            })
            .state('mobile', {
                url: '/mobile',
                templateUrl: 'App/Components/Home/homeView.html',
                controller: 'homeControl',
                data: { pageTitle: "Home", pageID: "home", pageMenu: "home", background: "mobile" }
            })
            .state('addressBook', {
                url: '/addressBook',
                templateUrl: 'App/Components/AddressBook/addressBookView.html',
                controller: 'addressBookControl',
                data: { pageTitle: "Address Book", pageID: "addressBook", pageMenu: "addressBook", background: "background" }
            })
            .state('asure', {
                url: '/asure',
                templateUrl: 'App/Components/AsureQuality/desktopAsureView.html',
                controller: 'desktopAsureControl',
                data: { pageTitle: "Asure", pageID: "asure", pageMenu: "asure", background: "background" }
            })
            .state('client', {
                url: '/client',
                templateUrl: 'App/Components/Client/clientView.html',
                controller: 'clientControl',
                data: { pageTitle: "Client", pageID: "client", pageMenu: "client", background: "background" }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'App/Components/Contact/contactView.html',
                controller: 'contactControl',
                data: { pageTitle: "Contact", pageID: "contact", pageMenu: "contact", background: "background" }
            })
            .state('confirmation', {
                url: '/confirmation/:jobId/:isBulk/:prebook/:email',
                templateUrl: 'App/Components/StripeConfirmation/stripeConfirmationView.html',
                controller: 'stripeConfirmationControl',
                data: { pageTitle: "Confirmation", pageID: "confirmation", pageMenu: "confirmation", background: "background" }
            })
            .state('mobileConfirmation', {
                url: '/mobileConfirmation/:jobId/:isBulk/:prebook/:email',
                templateUrl: 'App/Components/StripeConfirmation/mobileStripeConfirmationView.html',
                controller: 'stripeConfirmationControl',
                data: { pageTitle: "Confirmation", pageID: "confirmation", pageMenu: "confirmation", background: "background" }
            })
            .state('dimension', {
                url: '/dimension',
                templateUrl: 'App/Components/Dimension/dimensionView.html',
                controller: 'dimensionControl',
                data: { pageTitle: "Dimension", pageID: "dimension", pageMenu: "dimension", background: "background" }
            })
            .state('invoice', {
                url: '/invoice',
                templateUrl: 'App/Components/Invoice/invoiceView.html',
                controller: 'invoiceControl',
                data: { pageTitle: "Invoice", pageID: "invoice", pageMenu: "invoice", background: "background" }
            })
            .state('jobList', {
                url: '/jobList',
                templateUrl: 'App/Components/JobList/jobListView.html',
                controller: 'jobListControl',
                data: { pageTitle: "Job List", pageID: "jobList", pageMenu: "jobList", background: "background" }
            })
            .state('report', {
                url: '/report',
                templateUrl: 'App/Components/Report/reportView.html',
                controller: 'reportControl',
                data: { pageTitle: "Report", pageID: "report", pageMenu: "report", background: "background" }
            })
            .state('savedBooking', {
                url: '/savedBooking',
                templateUrl: 'App/Components/SavedBooking/savedBookingView.html',
                controller: 'savedBookingControl',
                data: { pageTitle: "SavedBooking", pageID: "savedBooking", pageMenu: "savedBooking", background: "background" }
            })
            .state('setting', {
                url: '/setting',
                templateUrl: 'App/Components/Setting/settingView.html',
                controller: 'settingControl',
                data: { pageTitle: "Setting", pageID: "setting", pageMenu: "setting", background: "background" }
            })
            .state('stripe', {
                url: '/stripe',
                templateUrl: 'App/Components/Stripe/stripeView.html',
                controller: 'stripeControl',
                data: { pageTitle: "Credit Card", pageID: "creditCard", pageMenu: "creditCard", background: "background" }
            })
            .state('terms', {
                url: '/terms',
                templateUrl: 'App/Components/Terms/termsView.html',
                controller: 'termsControl',
                data: { pageTitle: "Terms", pageID: "terms", pageMenu: "terms", background: "background" }
            });

        // Configure UI Bootstrap timepicker to use 24-hour format globally
        uibTimepickerConfig.showSpinners = false;
        uibTimepickerConfig.showMeridian = false;
        uibTimepickerConfig.hourStep = 1;
        uibTimepickerConfig.minuteStep = 1;
        uibTimepickerConfig.readonlyInput = false;
    }])
    .run(["$rootScope", "$state", "$stateParams",

        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on("$stateChangeStart",
                function (event, toState, toParams, fromState, fromParams) {
                    $("#ui-view").html("");
                    $(".page-loading").stop().show();
                });

            $rootScope.notificationText = "";
            $rootScope.notificationIcon = "";

            $rootScope.showNotification = function (text, icon) {
                $rootScope.notificationText = text;
                $rootScope.notificationIcon = icon;

                $(".notification").fadeIn(function () {
                    setTimeout(function () {
                        $(".notification").fadeOut();
                    }, 5000);
                });
            };

            $rootScope.promptTitle = "";
            $rootScope.promptText = "";
            $rootScope.promptCallback = null;
            $rootScope.promptCallbackParams = null;

            $rootScope.showPrompt = function (title, text, callback, params, cancelCallback, cancelCallbackParams) {
                $rootScope.promptTitle = title;
                $rootScope.promptText = text;
                $rootScope.promptCallback = callback;
                $rootScope.promptCallbackParams = params;
                $rootScope.promptCancelCallback = cancelCallback;
                $rootScope.promptCancelCallbackParams = cancelCallbackParams;

                $(".prompt").modal();
            };

            $rootScope.promptConfirm = function () {
                if ($rootScope.promptCallback)
                    $rootScope.promptCallback($rootScope.promptCallbackParams);
            };

            $rootScope.promptCancel = function () {
                if ($rootScope.promptCancelCallback)
                    $rootScope.promptCancelCallback($rootScope.promptCancelCallbackParams);
            };

            $rootScope.navigateToHub = function () {
                window.location.href = LoggedInPath;
            };

            $rootScope.navigateToOldBooking = function () {
                window.open("http://www.urgent.co.nz/Mercury/Common/Redirect.aspx?Destination=Internet&Value=" + $state.current.data.contactId);
            };

            $rootScope.navigateToMFV = function () {
                window.open("https://fast.urgent.co.nz/mfv/");
            };
        }

    ]);