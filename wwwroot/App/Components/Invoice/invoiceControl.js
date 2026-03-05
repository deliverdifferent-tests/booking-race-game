angular
    .module("urgentOnePageBooking")
    .controller("invoiceControl", ["$rootScope", "$scope", "$state", "invoicesService", function ($rootScope, $scope, $state, invoicesService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            invoicesService.getClients()
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
            invoicesService.getAllClients()
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

        $scope.getInvoices = function () {
            if ($scope.invoicesLoading)
                return;

            $scope.invoicesLoading = true;

            invoicesService.getInvoices($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.invoices = data.invoices;
                        $scope.setDownloadType();
                    } else {
                        $rootScope.showNotification("Error getting invoices", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting invoices", "fa-exclamation");
                })
                .finally(() => $scope.invoicesLoading = false);
        };

        $scope.getInvoiceJobs = function (invoiceId) {
            if ($scope.invoiceJobsLoading)
                return;

            $scope.invoiceJobsLoading = true;

            invoicesService.getInvoiceJobs(invoiceId, $scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.invoiceJobs = data.jobs;
                        $scope.downloadJobs($scope.user.invoiceJobs, invoiceId);
                    } else {
                        $rootScope.showNotification("Error getting invoice jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting invoice jobs", "fa-exclamation");
                })
                .finally(() => $scope.invoiceJobsLoading = false);
        };

        $scope.getSpeeds = function () {
            invoicesService.getSpeeds($scope.user.selectedClient.id)
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

        $scope.getSpeedName = function (speedId) {
            var index = $scope.speeds.findIndex(function (item, i) {
                return item.id === speedId
            });
            return $scope.speeds[index].name;
        };

        $scope.getSizeName = function (sizeId) {
            var index = $scope.vehicleSizes.findIndex(function (item, i) {
                return item.id === sizeId
            });
            return $scope.vehicleSizes[index].name;
        };

        $scope.getVehicleSizes = function () {
            invoicesService.getVehicleSizes($scope.user.selectedClient.id)
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

        $scope.getThisInvoice = function (invoice) {
            if ($scope.thisInvoiceLoading)
                return;

            $scope.thisInvoiceLoading = true;

            var promise = null;

            switch (invoice.downloadType) {
                case 1:
                    promise = invoicesService.getInvoice(invoice.invoice, invoice.statementId);
                    break;
                case 2:
                    $scope.getInvoiceJobs(invoice.invoice);
                    break;
                case 3:
                    //window.open(`Default/1//${invoice.invoice}${$scope.user.selectedClient.id}`); //1 for ref A
                    break;
                case 4:
                    //window.open(`Default/2//${invoice.invoice}${$scope.user.selectedClient.id}`); //2 for ref B
                    break;
                case 5:
                    //window.open(`Default/1/1/${invoice.invoice}${$scope.user.selectedClient.id}`); //1 for ref A, 1 for summary
                    break;
                case 6:
                    //window.open(`Default/2/1/${invoice.invoice}${$scope.user.selectedClient.id}`); //2 for ref B, 1 for summary
                    break;
                case 7:
                    //window.open(`Signature/${invoice.invoice}/Signature`);
                    break;
                case 8:
                    promise = invoicesService.getClientMonthlyReport($scope.user.selectedClient.id, (invoice.date.substring(5, 7) + "-" + invoice.date.substring(0, 4)));
                    break;
            };

            if (promise != null) {
                promise
                    .then(function (data) {
                        if (data) {
                            $scope.invoice = data;
                            // Remove data URL prefix if present
                            const base64 = $scope.invoice.replace(/^data:application\/pdf;base64,/, '');

                            // Decode base64 to binary
                            const binaryStr = atob(base64);

                            // Convert binary to Uint8Array
                            const bytes = new Uint8Array(binaryStr.length);
                            for (let i = 0; i < binaryStr.length; i++) {
                                bytes[i] = binaryStr.charCodeAt(i);
                            }
                            const blob = new Blob([bytes], { type: invoice.downloadType != 8 ? 'application/pdf' : 'application/vnd.ms-excel' });
                            const url = URL.createObjectURL(blob);
                            window.open(url);
                        } else {
                            $rootScope.showNotification("Error getting invoice", "fa-exclamation");
                        }
                    })
                    .catch(function () {
                        $rootScope.showNotification("Error getting invoice", "fa-exclamation");
                    })
                    .finally(() => $scope.thisInvoiceLoading = false);
            } else {
                $scope.thisInvoiceLoading = false;
            }
        };

        $scope.downloadJobs = function (jobs, invoiceId) {
            if (!jobs || jobs.length == 0)
                return;

            var formattedData = [];

            var titleString = ["All jobs for Invoice " + invoiceId + "."]

            formattedData.push(titleString);

            var titleKeys = ["Date", "Time", "Contact", "Job No", "Reference A", "Reference B", "Our Ref", "From", ($scope.countryCode === "NZ" ? "FromSuburb" : "FromCity"), "To", ($scope.countryCode === "NZ" ? "ToSuburb" : "ToCity"), "ToPostCode", "Service", "Quantity", "Weight", "Vehicle", "Amount", "SubTotal", "Notes"];

            formattedData.push(titleKeys);

            jobs.forEach(item => {
                var itemArray = [
                    new Date(item.date).toLocaleDateString(($scope.countryCode === "NZ" ? 'en-NZ' : 'en-US'), { year: 'numeric', month: 'long', day: 'numeric' }),
                    item.timeHours,
                    item.bookedBy && (item.bookedBy.includes(",") || item.bookedBy.includes("\n") || item.bookedBy.includes("\r")) ? '"' + item.bookedBy.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.bookedBy,
                    item.jobNumber,
                    item.clientRefA && (item.clientRefA.includes(",") || item.clientRefA.includes("\n") || item.clientRefA.includes("\r")) ? '"' + item.clientRefA.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.clientRefA,
                    item.clientRefB && (item.clientRefB.includes(",") || item.clientRefB.includes("\n") || item.clientRefB.includes("\r")) ? '"' + item.clientRefB.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.clientRefB,
                    item.ourRef && (item.ourRef.includes(",") || item.ourRef.includes("\n") || item.ourRef.includes("\r")) ? '"' + item.ourRef.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.ourRef,
                    item.fromAddress && (item.fromAddress.includes(",") || item.fromAddress.includes("\n") || item.fromAddress.includes("\r")) ? '"' + item.fromAddress.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.fromAddress,
                    item.americanFromCity,
                    item.toAddress && (item.toAddress.includes(",") || item.toAddress.includes("\n") || item.toAddress.includes("\r")) ? '"' + item.toAddress.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.toAddress,
                    item.americanToCity,
                    item.americanToZip,
                    item.speedId != null ? $scope.getSpeedName(item.speedId) : null,
                    item.quantity,
                    item.weight,
                    item.vehicleSize != null ? $scope.getSizeName(item.vehicleSize) : null,
                    item.amount,
                    null, //subtotal
                    item.notes ? '"' + item.notes.replace(/\n/g, ', ').replace(/\r/g, '').replace(/,\s*$/, "").replace(/,\s*$/, "").replace(/(^, )/, "") + '"' : null
                ];

                formattedData.push(itemArray);
            });

            var emptyLine = [""];

            formattedData.push(emptyLine);

            var totalString = ["Total", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", jobs.reduce((sum, job) => sum + job.amount, 0)];

            formattedData.push(totalString);
            formattedData.push(emptyLine);

            var footerString = ["Amounts exclude GST."];

            formattedData.push(footerString);

            var csvContent = "";

            formattedData.forEach(row => {
                csvContent += row.join(",") + "\n";
            });

            var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
            var objUrl = URL.createObjectURL(blob);

            //Special way to set filename instead of just windows.open() random filename
            var link = document.createElement("a");
            link.href = objUrl;
            link.setAttribute("download", "Chronological-" + invoiceId + ".csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        };

        $scope.getManualAPIData = function () {
            $scope.downloadTypes = [{ id: 1, name: "Copy of Invoice (PDF)" }, { id: 2, name: "Chronological (Excel)" }, /*{ id: 3, name: "Group by Ref A (Excel)" }, { id: 4, name: "Group by Ref B (Excel)" },
                { id: 5, name: "Summary of Ref A (Excel)" }, { id: 6, name: "Summary of Ref B (Excel)" }, { id: 7, name: "Signature Report (PDF)" },*/ { id: 8, name: "Monthly Report (Excel)" }];
        };

        $scope.getCountryCode = function () {
            invoicesService.getCountryCode()
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

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                if (!$scope.user.internal) {
                    $scope.viewInvoices();
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

        $scope.viewInvoices = function () {
            $scope.getInvoices();
            $scope.getSpeeds();
            $scope.getVehicleSizes();
            $scope.setStep('edit');
        };

        $scope.invoicesBack = function () {
            if ($scope.clients.length === 1 && !$scope.user.internal) {
                $state.go("setting");
            } else {
                $scope.setStep('select');
            }
        };

        $scope.setDownloadType = function () {
            for (i in $scope.user.invoices) {
                $scope.user.invoices[i].downloadType = 1;
            };
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
            $scope.getManualAPIData();
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.user = {};
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Invoices";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);