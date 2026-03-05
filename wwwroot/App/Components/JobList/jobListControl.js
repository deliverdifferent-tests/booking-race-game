angular
    .module("urgentOnePageBooking")
    .controller("jobListControl", ["$rootScope", "$scope", "$state", "$filter", "jobListsService", "homesService", "NgMap", "GeoCoder", function ($rootScope, $scope, $state, $filter, jobListsService, homesService, NgMap, GeoCoder) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            jobListsService.getClients()
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
            jobListsService.getAllClients()
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
            jobListsService.getThisClient($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedClient = data.client;
                    } else {
                        $rootScope.showNotification("Error getting this client", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this client", "fa-exclamation");
                });
        };

        $scope.getSpeeds = function () {
            jobListsService.getSpeeds($scope.user.selectedClient.id)
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

        $scope.getAllowedSpeeds = function () {
            jobListsService.getAllowedSpeeds()
                .then(function (data) {
                    if (data.success) {
                        $scope.allowedSpeeds = data.speeds;
                    } else {
                        $rootScope.showNotification("Error getting allowed speeds", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting allowed speeds", "fa-exclamation");
                });
        };

        $scope.getVehicleSizes = function () {
            jobListsService.getVehicleSizes($scope.user.selectedClient.id)
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

        $scope.getCouriers = function () {
            jobListsService.getCouriers()
                .then(function (data) {
                    if (data.success) {
                        $scope.couriers = data.couriers;
                    } else {
                        $rootScope.showNotification("Error getting couriers", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting couriers", "fa-exclamation");
                });
        };

        $scope.getSuburbs = function () {
            jobListsService.getSuburbs()
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

        $scope.getSites = function () {
            jobListsService.getSites()
                .then(function (data) {
                    if (data.success) {
                        $scope.sites = data.sites;
                    } else {
                        $rootScope.showNotification("Error getting sites", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting sites", "fa-exclamation");
                });
        };

        $scope.getJobTypeStatuses = function () {
            jobListsService.getJobTypeStatuses()
                .then(function (data) {
                    if (data.success) {
                        $scope.jobTypeStatuses = data.jobTypeStatuses;
                    } else {
                        $rootScope.showNotification("Error getting job type statuses", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting job type statuses", "fa-exclamation");
                });
        };

        $scope.getUndeliverableLocations = function () {
            jobListsService.getUndeliverableLocations()
                .then(function (data) {
                    if (data.success) {
                        $scope.undeliverableLocations = data.undeliverableLocations;
                    } else {
                        $rootScope.showNotification("Error getting undeliverable locations", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting undeliverable locations", "fa-exclamation");
                });
        };

        $scope.getReferences = function (letter) {
            jobListsService.getReferences($scope.user.selectedClient.id, letter)
                .then(function (data) {
                    if (data.success) {
                        if (letter === "A") {
                            $scope.referencesA = data.references;
                        } else {
                            $scope.referencesB = data.references;
                        };
                    } else {
                        $rootScope.showNotification("Error getting references", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting references", "fa-exclamation");
                });
        };

        $scope.getHardCoded = function () {
            $scope.dangerousGoodsClasses = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }];
            $scope.dangerousGoodsDocs = [{ value: true, name: "Yes" }, { value: false, name: "No" }];
            $scope.proofOfDeliveries = [{ value: 1, name: "Email" }, { value: 2, name: "Text" }, { value: 3, name: "Email & Text" }]; //Null is "WEBSITE"
            $scope.labelSizes = [{ value: 1, name: "Label (100 X 174mm)" }, { value: 2, name: "Label (100 X 150mm)" }]; //Null is PDF
            $scope.feedbacks = [{ id: 110, value: "Update job details" }, { id: 134, value: "Cancel job" }, { id: 83, value: "Courier feedback" }, { id: 130, value: "Courier had awesome communication" },
            { id: 131, value: "Courier was helpful and friendly" }, { id: 133, value: "Courier needs to improve communication" }]
        };

        $scope.getTodaysJobs = function () {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            jobListsService.getTodaysJobs($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobs = data.jobs;
                    } else {
                        $rootScope.showNotification("Error getting today's jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting today's jobs", "fa-exclamation");
                })
                .finally(() => $scope.jobsLoading = false);
        };

        $scope.getFilteredJobs = function () {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            jobListsService.getFilteredJobs($scope.user.selectedClient.id, $scope.user.filters)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobs = data.jobs;
                    } else {
                        $rootScope.showNotification("Error getting filtered jobs", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting filtered jobs", "fa-exclamation");
                })
                .finally(() => $scope.jobsLoading = false);
        };

        $scope.getThisJob = function () {
            if ($scope.jobsLoading)
                return;

            $scope.jobsLoading = true;

            jobListsService.getThisJob($scope.selectedJob.id, $scope.selectedJob.isBulk, $scope.selectedJob.recurring)
                .then(function (data) {
                    if (data.success) {
                        $scope.selectedJob = data.job;
                        if ($scope.countryCode === 'NZ' && $scope.selectedJob.clientId === 17273) {
                            $scope.getJobStatusScans($scope.selectedJob.id);
                        } else {
                            $scope.jobStatusScans = null;
                        }
                        if ($scope.selectedJob.onHold !== true) {
                            $scope.getUpdatedPrices();
                            $scope.getPermissions();
                            $scope.job.errors = [];
                        } else {
                            $scope.setCurrentDateTime();
                        }
                        if ($scope.selectedJob.accessorialChargeGroupId) {
                            $scope.loadJobAccessorialCharges($scope.selectedJob.id).then(function () {
                                $scope.loadAvailableAccessorialCharges($scope.selectedJob);
                            });
                        }
                    } else {
                        $rootScope.showNotification("Error getting this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting this job", "fa-exclamation");
                })
                .finally(() => $scope.jobsLoading = false);
        };

        $scope.getAvailableSpeeds = function () {
            if ($scope.speedsLoading)
                return;

            $scope.speedsLoading = true;

            jobListsService.getThisSpeeds($scope.selectedJob)
                .then(function (data) {
                    if (data.success) {
                        $scope.selectedJobSpeeds = data.availableSpeeds;
                    } else {
                        $rootScope.showNotification("Error getting available services for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting available services for this job", "fa-exclamation");
                })
                .finally(() => $scope.speedsLoading = false);
        };

        $scope.getSpeedDescription = function () {
            if ($scope.speedDescriptionLoading)
                return;

            $scope.speedDescriptionLoading = true;

            jobListsService.getSpeedDescription($scope.selectedJob)
                .then(function (data) {
                    if (data.success) {
                        $scope.speedDescription = data.speedDescription;
                        $scope.splitDescription();
                        $scope.recalculatePercentageCharges(true);
                    } else {
                        $scope.speedDescription = null;
                        $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $scope.speedDescription = null;
                    $rootScope.showNotification("Error getting price breakdown for this job", "fa-exclamation");
                })
                .finally(() => $scope.speedDescriptionLoading = false);
        };

        $scope.getUrgentToken = function () {
            var loginObject = {
                username: $scope.user.selectedClient.code,
                password: $scope.user.selectedClient.webServicePassword,
                id: $scope.user.selectedClient.id
            };

            jobListsService.getUrgentToken(loginObject)
                .then(function (data) {
                    if (data.token) {
                        $scope.urgentToken = data.token;
                    } else {
                        $rootScope.showNotification("Error getting urgent token", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting urgent token", "fa-exclamation");
                });
        };

        $scope.getRerateAmount = function () {
            if ($scope.speedDescriptionLoading)
                return;

            $scope.speedDescriptionLoading = true;

            jobListsService.getRerateAmount($scope.rerateObject, $scope.urgentToken)
                .then(function (data) {
                    if (data.success) {
                        $scope.speedDescription = data.rerate;
                        $scope.splitDescription();
                        $scope.recalculatePercentageCharges(true);
                    } else {
                        $scope.speedDescription = null;
                        $rootScope.showNotification("Error getting rerate amount for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $scope.speedDescription = null;
                    $rootScope.showNotification("Error getting rerate amount for this job", "fa-exclamation");
                })
                .finally(() => $scope.speedDescriptionLoading = false);
        };

        $scope.getJobStatusScans = function () {
            if ($scope.jobStatusScansLoading)
                return;

            $scope.jobStatusScansLoading = true;

            jobListsService.getJobStatusScans($scope.selectedJob.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobStatusScans = data.jobStatusScans;
                    } else {
                        $rootScope.showNotification("Error getting job status scans for this job", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting job status scans for this job", "fa-exclamation");
                })
                .finally(() => $scope.jobStatusScansLoading = false);
        };

        $scope.updateJob = function () {
            if ($scope.updateJobInProgress)
                return;

            $scope.updateJobInProgress = true;

            function performUpdate() {
                var dirtyCharges = ($scope.jobAccessorialCharges || []).filter(function (c) { return c.dirty; });

                function doJobUpdate() {
                    if ($scope.permissions !== 'Min' && $scope.checkPriceDifference()) {
                        $scope.selectedJob.newAmount = $scope.speedDescription.rate + $scope.getJobAccessorialTotal();
                        $scope.selectedJob.pricingBreakdown = $scope.speedDescription.description;
                    } else {
                        $scope.selectedJob.newAmount = null;
                        $scope.selectedJob.pricingBreakdown = null;
                    };

                    jobListsService.updateJob($scope.selectedJob)
                        .then(function (data) {
                            if (data.success) {
                                if ($scope.selectedJob.onHold !== true) {
                                    $scope.selectedJob = data.job;
                                } else {
                                    $scope.readyNow();
                                };

                                $rootScope.showNotification("Job updated successfully", "fa-check");
                            } else {
                                $rootScope.showNotification("Error updating job", "fa-exclamation");
                            }
                        })
                        .catch(function (response) {
                            if (response.data.messages) {
                                for (error in response.data.messages) {
                                    $scope.job.errors = [];
                                    $scope.job.errors.push(response.data.messages[error].message);
                                    $rootScope.showNotification(response.data.messages[error].message, "fa-exclamation");
                                };
                            } else {
                                $rootScope.showNotification("Error updating job", "fa-exclamation");
                            }
                        })
                        .finally(() => $scope.updateJobInProgress = false);
                }

                function saveNextDirty(index) {
                    if (index >= dirtyCharges.length) {
                        doJobUpdate();
                        return;
                    }
                    $scope.saveJobAccessorialCharge(dirtyCharges[index]).then(function () {
                        saveNextDirty(index + 1);
                    });
                }

                if (dirtyCharges.length > 0) {
                    $rootScope.showNotification('Saving ' + dirtyCharges.length + ' updated accessorial charge' + (dirtyCharges.length > 1 ? 's' : '') + '...', 'fa-sync');
                    saveNextDirty(0);
                } else {
                    doJobUpdate();
                }
            }

            var pendingCharges = ($scope.availableAccessorialCharges || [])
                .filter(function (c) { return c.selected && c.chargeType !== 'quote_based'; });

            if (pendingCharges.length > 0) {
                var addPromise = $scope.addSelectedAccessorialCharges();
                if (addPromise) {
                    addPromise
                        .then(performUpdate)
                        .catch(function () { $scope.updateJobInProgress = false; });
                } else {
                    performUpdate();
                }
            } else {
                performUpdate();
            }
        };

        $scope.cancelJob = function () {
            if ($scope.cancelJobInProgress)
                return;

            $scope.cancelJobInProgress = true;

            jobListsService.cancelJob($scope.selectedJob.id, $scope.user.selectedClient.id, $scope.selectedJob.status)
                .then(function (data) {
                    if (data.success) {
                        $scope.removeJobFromList($scope.selectedJob.id);
                        $scope.selectedJob = null;
                        $rootScope.showNotification("Job cancelled successfully", "fa-check");
                        $scope.editBack();
                    } else {
                        $rootScope.showNotification("Error cancelling job", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data.messages.length > 0) {
                        for (error in response.data.messages) {
                            $scope.job.errors = [];
                            $scope.job.errors.push(response.data.messages[error].message);
                            $rootScope.showNotification(response.data.messages[error].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error cancelling job", "fa-exclamation");
                    }
                })
                .finally(() => $scope.cancelJobInProgress = false);
        };

        $scope.readyNow = function () {
            if ($scope.readyJobInProgress)
                return;

            $scope.readyJobInProgress = true;

            jobListsService.readyNow($scope.selectedJob.id)
                .then(function (data) {
                    if (data.success) {
                        if ($scope.selectedJob.onHold !== true) {
                            $scope.selectedJob = data.job;
                            $scope.setPage("address");
                        } else {
                            $scope.selectedJob = null;
                            $scope.getFilteredJobs();
                        }
                        $rootScope.showNotification("This job has been succesfully marked as ready", "fa-check");
                    } else {
                        $rootScope.showNotification("Error marking job ready", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data.messages) {
                        for (error in response.data.messages) {
                            $scope.job.errors = [];
                            $scope.job.errors.push(response.data.messages[error].message);
                            $rootScope.showNotification(response.data.messages[error].message, "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error marking job ready", "fa-exclamation");
                    }
                })
                .finally(() => $scope.readyJobInProgress = false);
        };

        $scope.printLabel = function () {
            if ($scope.printLabelInProgress)
                return;

            $scope.printLabelInProgress = true;

            var promise = $scope.selectedJob.isParentBulk
                ? homesService.getBulkLabel($scope.selectedJob.parentId)
                : ($scope.selectedJob.isBulk
                    ? homesService.getBulkLabel($scope.selectedJob.id)
                    : homesService.getAPILabel($scope.selectedJob.id, $scope.functions.printFormat, $scope.urgentToken)); //homesService.getLabel($scope.jobData.jobID, $scope.booking.client.id));

            promise
                .then(function (data) {
                    if (data) {
                        $scope.label = data;
                        // Remove data URL prefix if present
                        const base64 = $scope.label.replace(/^data:application\/pdf;base64,/, '');
                        // Decode base64 to binary
                        const binaryStr = atob(base64);
                        // Convert binary to Uint8Array
                        const bytes = new Uint8Array(binaryStr.length);
                        for (let i = 0; i < binaryStr.length; i++) {
                            bytes[i] = binaryStr.charCodeAt(i);
                        }
                        const blob = new Blob([bytes], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        window.open(url);
                    } else {
                        $rootScope.showNotification("Error getting label", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting label", "fa-exclamation");
                })
                .finally(() => $scope.printLabelInProgress = false);
        };

        $scope.sendFeedback = function () {
            if ($scope.sendFeedbackInProgress)
                return;

            $scope.sendFeedbackInProgress = true;

            var table = [110, 134].includes($scope.functions.feedbackType) ? "job" : "courier";
            var feedbackRequest = { typeId: $scope.functions.feedbackType, message: $scope.functions.feedback, table: table, jobId: $scope.selectedJob.id, courierId: $scope.selectedJob.courierId };

            if (table === "courier" && !$scope.selectedJob.courierId) {
                $rootScope.showNotification("You cannot send courier feedback before a courier has been assigned to this job.", "fa-exclamation");
                $scope.sendFeedbackInProgress = false;
                return;
            }

            jobListsService.sendFeedback(feedbackRequest)
                .then(function (data) {
                    if (data.success) {
                        $scope.functions.feedback = null;
                        $scope.functions.feedbackType = null;
                        $rootScope.showNotification("Thanks for your feedback, have a great day!", "fa-check");
                    } else {
                        $rootScope.showNotification("Error sending feedback", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.data.errors) {
                        for (error in response.data.errors) {
                            $rootScope.showNotification(error + " " + response.data.errors[error], "fa-exclamation");
                        };
                    } else {
                        $rootScope.showNotification("Error sending feedback", "fa-exclamation");
                    }
                })
                .finally(() => $scope.sendFeedbackInProgress = false);
        };

        $scope.sendEmail = function () {
            if ($scope.sendEmailInProgress)
                return;

            $scope.sendEmailInProgress = true;

            var emailRequest = { email: $scope.functions.emailJobTo, body: "Dog", title: "Cat: Job Details " + $scope.selectedJob.jobNumber, signature: $scope.selectedJob.deliverySignature };

            jobListsService.sendEmail(emailRequest)
                .then(function (data) {
                    $rootScope.showNotification("An email for this job has been sent to " + $scope.functions.emailJobTo + ".", "fa-check");
                })
                .catch(function (response) {
                    $rootScope.showNotification("Error sending email. Please check your email address has been entered correctly.", "fa-exclamation");
                })
                .finally(() => $scope.sendEmailInProgress = false);
        };

        $scope.getCountryCode = function () {
            homesService.getCountryCode()
                .then(function (data) {
                    if (data) {
                        $scope.countryCode = data;
                        if ($scope.countryCode == 'NZ') {
                            $scope.getSuburbs();
                            $scope.getSites();
                            $scope.getAllowedSpeeds();
                        };
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
                $scope.mapCenter = { lat: 40.711722, lng: -74.006513 };
                $scope.currencyCode = 'US';
                $scope.weightUnit = 'lb';
                $scope.dimsUnit = 'in';
                $scope.cubicUnit = 'F³';
            } else {
                $scope.mapCenter = { lat: -36.850657, lng: 174.764660 };
                $scope.currencyCode = 'NZ';
                $scope.weightUnit = 'kg';
                $scope.dimsUnit = 'cm';
                $scope.cubicUnit = 'M³';
            };
        };

        $scope.loadJobAccessorialCharges = function (jobId) {
            var dirtySnapshot = {};
            ($scope.jobAccessorialCharges || []).filter(function (c) { return c.dirty; }).forEach(function (c) {
                dirtySnapshot[c.jobAccessorialChargeId] = { inputValue: c.inputValue, notes: c.notes, previewAmount: c.previewAmount };
            });

            return jobListsService.getJobAccessorialCharges(jobId)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobAccessorialCharges = data.charges.map(function (c) {
                            var isAutoPopulated = $scope.autoPopulatedUnitTypes.includes(c.unitTypeName) || c.chargeType === 'percentage';
                            var prior = dirtySnapshot[c.jobAccessorialChargeId];
                            if (prior) {
                                return Object.assign({}, c, {
                                    dirty: true,
                                    isAutoPopulated: isAutoPopulated,
                                    inputValue: prior.inputValue,
                                    notes: prior.notes,
                                    previewAmount: prior.previewAmount
                                });
                            }
                            return Object.assign({}, c, { dirty: false, isAutoPopulated: isAutoPopulated });
                        });
                        $scope.recalculatePercentageCharges();
                    } else {
                        $rootScope.showNotification('Error loading accessorial charges', 'fa-exclamation');
                    }
                })
                .catch(function () {
                    $rootScope.showNotification('Error loading accessorial charges', 'fa-exclamation');
                });
        };

        $scope.loadAvailableAccessorialCharges = function (job) {
            homesService.getAccessorialCharges(job.accessorialChargeGroupId, job.clientId, job.speedId, job.vehicleSize)
                .then(function (data) {
                    if (data.success) {
                        var appliedIds = ($scope.jobAccessorialCharges || []).map(function (c) { return c.accessorialChargeId; });
                        $scope.availableAccessorialCharges = data.charges
                            .filter(function (c) { return !appliedIds.includes(c.accessorialChargeId); })
                            .map(function (c) {
                                var isAutoPopulated = $scope.autoPopulatedUnitTypes.includes(c.unitTypeName) || c.chargeType === 'percentage';
                                var inputValue = c.inputValue;
                                if (isAutoPopulated) {
                                    if (c.unitTypeName === 'Pounds' || c.unitTypeName === 'Kilograms')
                                        inputValue = $scope.selectedJob.weight || 0;
                                    else if (c.unitTypeName === 'Quantity')
                                        inputValue = $scope.selectedJob.quantity || 0;
                                }
                                var charge = Object.assign({}, c, { selected: false, notes: null, isAutoPopulated: isAutoPopulated, inputValue: inputValue, requiresQuote: c.chargeType === 'quote_based' });
                                charge.calculatedAmount = $scope.calculateChargeAmount(charge);
                                return charge;
                            });
                    } else {
                        $rootScope.showNotification('Error loading available accessorial charges', 'fa-exclamation');
                    }
                })
                .catch(function () {
                    $rootScope.showNotification('Error loading available accessorial charges', 'fa-exclamation');
                });
        };

        $scope.saveJobAccessorialCharge = function (charge) {
            var payload = {
                jobAccessorialChargeId: charge.jobAccessorialChargeId,
                inputValue: charge.inputValue,
                itemCount: charge.itemCount,
                notes: charge.notes
            };

            return jobListsService.updateJobAccessorialCharge(payload)
                .then(function (data) {
                    if (data.success) {
                        charge.calculatedAmount = data.calculatedAmount;
                        charge.dirty = false;
                        $scope.recalculatePercentageCharges();
                        if (charge.chargeType !== 'percentage') $scope.autoSavePercentageCharges();
                        if ($scope.speedDescription) $scope.splitDescription();
                        $rootScope.showNotification('Charge updated', 'fa-check');
                    } else {
                        $rootScope.showNotification('Error updating charge', 'fa-exclamation');
                    }
                })
                .catch(function () {
                    $rootScope.showNotification('Error updating charge', 'fa-exclamation');
                });
        };

        $scope.deleteJobAccessorialCharge = function (charge) {
            if (!confirm('Remove "' + charge.name + '" from this job?')) return;

            jobListsService.deleteJobAccessorialCharge(charge.jobAccessorialChargeId)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobAccessorialCharges = $scope.jobAccessorialCharges
                            .filter(function (c) { return c.jobAccessorialChargeId !== charge.jobAccessorialChargeId; });

                        // Return charge to available catalog
                        $scope.availableAccessorialCharges.push(
                            Object.assign({}, charge, { selected: false, dirty: false, notes: null })
                        );

                        $scope.recalculatePercentageCharges();
                        $scope.autoSavePercentageCharges();
                        if ($scope.speedDescription) $scope.splitDescription();
                        $rootScope.showNotification('Charge removed', 'fa-check');
                    } else {
                        $rootScope.showNotification('Error removing charge', 'fa-exclamation');
                    }
                })
                .catch(function () {
                    $rootScope.showNotification('Error removing charge', 'fa-exclamation');
                });
        };

        $scope.addSelectedAccessorialCharges = function () {
            if ($scope.addAccessorialsInProgress) return;
            $scope.addAccessorialsInProgress = true;

            var toAdd = $scope.availableAccessorialCharges
                .filter(function (c) { return c.selected && c.chargeType != 'quote_based'; })
                .sort(function (a, b) { return (a.calculationOrder || 0) - (b.calculationOrder || 0); });

            var payload = toAdd.map(function (c) {
                return {
                    accessorialChargeId: c.accessorialChargeId,
                    inputValue: c.inputValue || null,
                    itemCount: c.itemCount || 1,
                    addedAtStage: 'job_list',
                    notes: c.notes || null,
                    calculationOrder: c.calculationOrder || 0
                };
            });

            return jobListsService.addJobAccessorialCharges($scope.selectedJob.id, payload)
                .then(function (data) {
                    if (data.success) {
                        $rootScope.showNotification('Charges added', 'fa-check');
                        return $scope.loadJobAccessorialCharges($scope.selectedJob.id).then(function () {
                            if ($scope.speedDescription) $scope.splitDescription();
                            $scope.autoSavePercentageCharges();
                            $scope.loadAvailableAccessorialCharges($scope.selectedJob);
                        });
                    } else {
                        $rootScope.showNotification('Error adding charges', 'fa-exclamation');
                    }
                })
                .catch(function () {
                    $rootScope.showNotification('Error adding charges', 'fa-exclamation');
                })
                .finally(function () { $scope.addAccessorialsInProgress = false; });
        };

        /* --- Google Maps Address Functions --- */

        $scope.$watch('selectedJob.toDetails', function (newValue, oldValue, scope) {
            setTimeout(function () {
                if ($scope.selectedJob && $scope.selectedJob.toAddress && $scope.selectedJob.toDetails) {
                    if ($scope.selectedJob.toDetails.geometry && $scope.selectedJob.toDetails.address_components) {
                        if ($scope.selectedJob.toDetails.geometry.location) {
                            $scope.selectedJob.deliveryLat = $scope.selectedJob.toDetails.geometry.location.lat();
                            $scope.selectedJob.deliveryLong = $scope.selectedJob.toDetails.geometry.location.lng();
                        }

                        if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes("postal_code"))) {
                            $scope.selectedJob.americanToZip = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes("postal_code")).short_name;
                        } else {
                            $scope.selectedJob.americanToZip = null;
                        }

                        if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes("street_number"))) {
                            $scope.selectedJob.americanToStreetNumber = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes("street_number")).long_name;
                        } else {
                            $scope.selectedJob.americanToStreetNumber = null;
                        }

                        if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes("route"))) {
                            $scope.selectedJob.americanToStreetName = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes("route")).long_name;
                        } else {
                            $scope.selectedJob.americanToStreetName = null;
                        }

                        if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes("sublocality"))) {
                            $scope.selectedJob.americanToCity = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes("sublocality")).long_name;
                        } else if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes("locality"))) {
                            $scope.selectedJob.americanToCity = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes("locality")).long_name;
                        } else {
                            $scope.selectedJob.americanToCity = null;
                        }

                        if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality"))) {
                            $scope.selectedJob.americanToState = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes($scope.countryCode == "US" ? "administrative_area_level_1" : "locality")).long_name;
                        } else {
                            $scope.selectedJob.americanToState = null;
                        }

                        if ($scope.selectedJob.toDetails.address_components.find(x => x.types.includes("subpremise"))) {
                            $scope.selectedJob.americanToExtra = $scope.selectedJob.toDetails.address_components.find(x => x.types.includes("subpremise")).long_name;
                        } else {
                            $scope.selectedJob.americanToExtra = null;
                        }

                        if ($scope.countryCode == "NZ") {
                            $scope.selectedJob.americanToCity = $scope.selectedJob.americanToCity.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); //E.g. Ōtāhuhu -> Otahuhu for comparison

                            $scope.selectedJob.toAddressSuburbId = $scope.matchSuburbName($scope.selectedJob.americanToCity);
                        }

                        $scope.selectedJob.toAddress = ($scope.selectedJob.americanToExtra ? $scope.selectedJob.americanToExtra + "/" : "") + ($scope.selectedJob.americanToStreetNumber ? $scope.selectedJob.americanToStreetNumber : "") + " "
                            + ($scope.selectedJob.americanToStreetName ? $scope.selectedJob.americanToStreetName : "");

                        if ($scope.checkCompanyNameMatch($scope.selectedJob.toAddress, $scope.selectedJob.toDetails.name)) {
                            $scope.selectedJob.toAddress = $scope.selectedJob.toDetails.name + ", " + $scope.selectedJob.toAddress;
                            $scope.selectedJob.americanToCompany = $scope.selectedJob.toDetails.name;
                        } else if ($scope.selectedJob.toContactName) {
                            $scope.selectedJob.toAddress = $scope.selectedJob.toContactName + ", " + $scope.selectedJob.toAddress;
                            $scope.selectedJob.americanToCompany = $scope.selectedJob.toContactName;
                        }

                        $scope.selectedJob.toDeliveryAddress = $scope.selectedJob.toDetails.formatted_address;
                        $scope.getUpdatedPrices();
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

        /* --- Error Checking --- */

        $scope.checkFilters = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.user.errors = [];

                if (!$scope.user.filters.dateFrom) {
                    $scope.user.errors.push("You must enter a valid from date.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.filters.dateTo) {
                    $scope.user.errors.push("You must enter a valid to date.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.user.filters.dateFrom > $scope.user.filters.dateTo) {
                    $scope.user.errors.push("To date must be on or after the from date.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.user.filters.dateFrom.getFullYear() < 1999 || $scope.user.filters.dateTo.getFullYear() < 1999) {
                    $scope.user.errors.push("You must enter a date after 1998.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.getFilteredJobs();
                $('.filter-modal').modal('hide');
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.user.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        $scope.checkJob = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.job.errors = [];

                if (!$scope.selectedJob.toAddress) {
                    $scope.job.errors.push("You must enter a valid to address.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.selectedJob.toAddressSuburbId && $scope.countryCode == 'NZ') {
                    $scope.job.errors.push("You must enter a valid to suburb.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.selectedJob.americanToCity && $scope.countryCode != 'NZ') {
                    $scope.job.errors.push("You must enter a valid to city.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.selectedJob.americanToState && $scope.countryCode != 'NZ') {
                    $scope.job.errors.push("You must enter a valid to state.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.user.selectedClient.referenceAMandatory && !$scope.selectedJob.clientRefA) {
                    $scope.job.errors.push("You must enter a valid ref A.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.user.selectedClient.referenceBMandatory && !$scope.selectedJob.clientRefB) {
                    $scope.job.errors.push("You must enter a valid ref B.");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.selectedJob.proofOfDelivery !== 0 && $scope.selectedJob.proofOfDelivery !== null) {
                    if ($scope.selectedJob.proofOfDelivery !== 2 && !$scope.selectedJob.podEmail) {
                        $scope.job.errors.push("You must enter a valid proof of delivery email.");
                        $(".loading").fadeOut();
                        return;
                    } else if ($scope.selectedJob.proofOfDelivery !== 1 && !$scope.selectedJob.podMobile) {
                        $scope.job.errors.push("You must enter a valid proof of delivery mobile.");
                        $(".loading").fadeOut();
                        return;
                    }
                }

                if ($scope.selectedJob.weight === null || $scope.selectedJob.weight < 0) {
                    $scope.job.errors.push("You must enter a valid weight (greater or equal to 0).");
                    $(".loading").fadeOut();
                    return;
                }

                if ($scope.selectedJob.quantity === null || $scope.selectedJob.quantity <= 0) {
                    $scope.job.errors.push("You must enter a valid quantity (greater than 0).");
                    $(".loading").fadeOut();
                    return;
                }

                /*
                if ($scope.selectedJob.jobItems !== null && $scope.selectedJob.jobItems.length >= 1) {
                    if ($scope.checkJobItemsValidity() === false) {
                        $scope.job.errors.push("You must fill all of the necessary fields for the job item rows.");
                        $(".loading").fadeOut();
                        return;
                    }
                    if ($scope.selectedJob.weight !== $scope.selectedJob.jobItems.reduce((a, b) => a + (b.weight * b.items), 0)) {
                        $scope.job.errors.push("The weight (Additional Info) does not match the total weight from the job items.");
                        $(".loading").fadeOut();
                        return;
                    }
                    if ($scope.selectedJob.quantity !== $scope.selectedJob.jobItems.reduce((a, b) => a + b.items, 0)) {
                        $scope.job.errors.push("The number of items (Additional Info) does not match the total items from the job items.");
                        $(".loading").fadeOut();
                        return;
                    }
                } else if ($scope.selectedJob.jobItems !== null && $scope.selectedJob.jobItems.length === 0) {
                    $scope.job.errors.push("You must have at least 1 job item for this type of job.");
                    $(".loading").fadeOut();
                    return;
                }
                */

                if (($scope.selectedJob.dgClass !== null && $scope.selectedJob.dgClass !== 0) && $scope.selectedJob.dgDocs === false) {
                    $scope.job.errors.push("You must have DG docs if you are sending a dangerous goods delivery.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.getUpdatedPrices();
                $scope.openUpdateModal();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.job.errors.push("Error, please check all fields and try again.");
                $(".loading").fadeOut();
            }
        };

        /* --- General Functions --- */

        $scope.setClient = function () {
            if ($scope.clients.length > 1) {
                $scope.setInternal();
            } else {
                $scope.user.selectedClient = $scope.clients[0];
                $scope.user.internal = $scope.clients[0].internal;
                if (!$scope.user.internal) {
                    $scope.viewJobList();
                } else if ($scope.countryCode == 'NZ') {
                    $scope.getUrgentToken();
                };
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

        $scope.viewJobList = function () {
            $scope.getTodaysJobs();
            $scope.checkIfReferencesNeeded();
            $scope.getVehicleSizes();
            $scope.getSpeeds();
            if ($scope.countryCode == 'NZ') {
                $scope.getUrgentToken();
            };
            $scope.setStep('jobList');
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

        $scope.getSiteName = function (suburbId) {
            var index = $scope.suburbs.findIndex(function (item, i) {
                return item.id === suburbId
            });
            var siteId = $scope.suburbs[index].siteId;

            var index2 = $scope.sites.findIndex(function (item, i) {
                return item.id === siteId
            });
            return $scope.sites[index2].name;
        };

        $scope.getCourierName = function (courierId) {
            var index = $scope.couriers.findIndex(function (item, i) {
                return item.id === courierId
            });
            return $scope.couriers[index].name;
        };

        $scope.getSizeName = function (sizeId) {
            var index = $scope.vehicleSizes.findIndex(function (item, i) {
                return item.id === sizeId
            });
            return $scope.vehicleSizes[index].name;
        };

        $scope.checkAucklandSuburb = function (suburbId) {
            var index = $scope.suburbs.findIndex(function (item, i) {
                return item.id === suburbId
            });

            return $scope.suburbs[index].siteId === 1;
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

        $scope.getCourierString = function (courierId) {
            var index = $scope.couriers.findIndex(function (item, i) {
                return item.id === courierId
            });
            return "#" + $scope.couriers[index].code + " " + $scope.couriers[index].name;
        };

        $scope.getStatusName = function (statusId, speedId) {
            //Prebook
            if (statusId === 10000) {
                return "Recurring Prebook";
            };

            var index = $scope.jobTypeStatuses.findIndex(function (item, i) {
                return item.jobTypeId === speedId && item.jobStatusId === statusId
            });
            return index !== -1 ? $scope.jobTypeStatuses[index].name : null;
        };

        $scope.getLocationName = function (undeliverableLocationId) {
            var index = $scope.undeliverableLocations.findIndex(function (item, i) {
                return item.id === undeliverableLocationId
            });
            return index !== -1 ? $scope.undeliverableLocations[index].name : null;
        };

        $scope.openFilterModal = function () {
            $('.filter-modal').modal();
        };

        $scope.openCancelModal = function (job = null) {
            if (job !== null)
                $scope.selectedJob = job;

            $('.cancel-modal').modal();
        };

        $scope.openReadyModal = function (job = null) {
            if (job !== null) {
                $scope.selectedJob = job;
                $scope.getThisJob();
            }

            $('.ready-modal').modal();
        };

        $scope.openUpdateModal = function () {
            $('.update-modal').modal();
        };

        $scope.jobListBack = function () {
            if ($scope.clients.length === 1 && !$scope.user.internal) {
                $state.go("setting");
            } else {
                $scope.setStep('select');
                $scope.user.errors = null;
                $scope.clearFilters();
            }
        };

        $scope.clearFilters = function () {
            $scope.user.filters = {};
            $scope.user.filters.dateFrom = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.user.filters.dateFrom.setDate($scope.user.filters.dateFrom.getDate() - 1);
            $scope.user.filters.dateTo = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.user.filters.dateTo.setDate($scope.user.filters.dateTo.getDate() + 1);
        };

        $scope.clearAndGetFiltered = function () {
            $scope.clearFilters();
            $scope.getFilteredJobs();
        };

        $scope.editJob = function (job) {
            $scope.selectedJob = job;
            $scope.getThisJob();
            $scope.setStep('edit');
            $scope.setPage('address');
        };

        $scope.editBack = function () {
            $scope.selectedJob = null;
            $scope.functions = {};
            $scope.job.errors = null;
            $scope.setStep('jobList');
        };

        $scope.checkIfReferencesNeeded = function () {
            if ($scope.user.selectedClient.referenceADefineList === true) {
                $scope.getReferences("A");
            };

            if ($scope.user.selectedClient.referenceBDefineList === true) {
                $scope.getReferences("B");
            };
        };

        $scope.getAvailabilityColor = function (availabilityName) {
            if (availabilityName === 'Available') {
                return { 'background-color': 'rgb(0, 255, 0)' };
            } else if (availabilityName === 'Possible') {
                return { 'background-color': 'yellow' };
            } else if (availabilityName === 'Unlikely') {
                return { 'background-color': 'orange' };
            }
        };

        $scope.getPermissions = function () {
            //Prebook
            if ($scope.countryCode != "NZ" || $scope.checkIfSpeedIdAllowed($scope.selectedJob.speedId)) {
                if ($scope.selectedJob.status === 10000) {
                    $scope.permissions = "Max";
                    return;
                };

                var status = $scope.getStatusName($scope.selectedJob.status, $scope.selectedJob.speedId);

                if (($scope.selectedJob.status === 0 || status === "Booked" || status === "Assigned") && !$scope.selectedJob.archived && ([null, 1, 12].includes($scope.selectedJob.jobRelationshipId))) {
                    $scope.permissions = "Max";
                } else if (status === "Picked Up" && !$scope.selectedJob.archived && ($scope.selectedJob.jobRelationshipId === 1 || $scope.selectedJob.jobRelationshipId === null)) {
                    $scope.permissions = "Limited";
                } else {
                    $scope.permissions = "Min";
                };
            } else {
                $scope.permissions = "Min";
            }
        };

        $scope.checkIfSpeedIdAllowed = function (speedId) {
            return (typeof $scope.allowedSpeeds.find(x => x.id === speedId) != 'undefined');
        };

        $scope.hidePrice = function (value) {
            $scope.showPrice = value;
        };

        $scope.intQuantity = function () {
            if (typeof $scope.selectedJob.quantity === 'string') {
                if ($scope.selectedJob.quantity) {
                    $scope.selectedJob.quantity = parseInt($scope.selectedJob.quantity);
                } else {
                    $scope.selectedJob.quantity = 1;
                }
            };
            $scope.getUpdatedPrices();
        };

        $scope.nonNullWeight = function () {
            if (typeof $scope.selectedJob.weight === 'string') {
                if ($scope.selectedJob.weight) {
                    $scope.selectedJob.weight = parseFloat($scope.selectedJob.weight);
                } else {
                    $scope.selectedJob.weight = 0;
                }
            };
            $scope.getUpdatedPrices();
        };

        $scope.setDocsFalse = function () {
            if ($scope.selectedJob.dgClass === null) {
                $scope.selectedJob.dgDocs = false;
            };
        };

        $scope.checkPriceDifference = function () {
            if ($scope.selectedJob && $scope.selectedJob.amount && $scope.speedDescription && $scope.speedDescription.rate) {
                return Math.abs($scope.selectedJob.amount - ($scope.speedDescription.rate + $scope.getJobAccessorialTotal())) >= 0.01;
            };
        };

        $scope.removeJobFromList = function (deletedJobId) {
            var removeIndex = $scope.jobs.map(item => item.id).indexOf(deletedJobId);
            (removeIndex >= 0) && $scope.jobs.splice(removeIndex, 1);
        };

        $scope.getUpdatedPrices = function () {
            if ($scope.selectedJob.onHold) {
                $scope.setCurrentDateTime();
            }

            var speed = $scope.speeds.find(x => x.id === $scope.selectedJob.speedId);
            if ($scope.countryCode == "NZ" && !(speed && speed.groupingName && speed.groupingName.includes("US"))) {
                $scope.getAvailableSpeeds();
                $scope.prepareRerateObject();
            } else {
                $scope.getSpeedDescription();
            };
        };

        $scope.aucklandOnly = function (obj) {
            return obj.siteId === 1;
        };

        $scope.checkEmpty = function () {
            if ($scope.selectedJob.toAddress.length === 0) {
                $scope.selectedJob.toAddress = null;
                $scope.selectedJob.toDetails = null;
                $scope.selectedJob.toLat = null;
                $scope.selectedJob.toLong = null;
            }
        };

        $scope.splitDescription = function () {
            $scope.speedDescription.descriptions = $scope.speedDescription.description.split("\r");
            for (i in $scope.speedDescription.descriptions) {
                var parts = $scope.speedDescription.descriptions[i].split("=");
                var lastTildaPosition = parts[1].lastIndexOf('~');
                if (lastTildaPosition !== -1) {
                    parts[1] = parts[1].substring(0, lastTildaPosition);
                }
                $scope.speedDescription.descriptions[i] = parts;
            }
            if ($scope.jobAccessorialCharges && $scope.jobAccessorialCharges.length > 0) {
                $scope.addAccessorialChargesToPricingBreakdown();
            }
        };

        $scope.addAccessorialChargesToPricingBreakdown = function () {
            if (!$scope.speedDescription || !$scope.jobAccessorialCharges) return;
            $scope.jobAccessorialCharges.forEach(function (charge) {
                var amount = charge.dirty ? (charge.previewAmount || 0) : (charge.calculatedAmount || 0);
                $scope.speedDescription.descriptions.push([charge.name, ' $' + amount.toFixed(2)]);
            });
        };

        $scope.fixedDecimal = function (x) {
            if (!x.includes('$')) {
                return Number.parseFloat(x).toFixed(2);
            } else {
                return Number.parseFloat(x.slice(2)).toFixed(2);
            }
        };

        $scope.redirectCreditCard = function () {
            if ($scope.clients[0].id == 9196) {
                window.history.back();
            }
        };

        $scope.downloadJobs = function () {
            if (!$scope.jobs || $scope.jobs.length == 0)
                return;

            var formattedData = [];

            var titleString = ["All jobs from " + new Date($scope.user.filters.dateFrom).toLocaleDateString(($scope.countryCode === "NZ" ? 'en-NZ' : 'en-US'), { year: 'numeric', month: 'long', day: 'numeric' }) + " to "
                + new Date($scope.user.filters.dateTo).toLocaleDateString(($scope.countryCode === "NZ" ? 'en-NZ' : 'en-US'), { year: 'numeric', month: 'long', day: 'numeric' }) + "."]

            formattedData.push(titleString);

            var titleKeys = ["Date", "Time", "Contact", "Reference A", "Reference B", "Job No", "From", "FromCity", "To", "ToCity", "Service", "Quantity", "Weight", "Vehicle", "Amount", "Notes", "ClientNotes"];

            formattedData.push(titleKeys);

            $scope.jobs.forEach(item => {
                var itemArray = [new Date(item.date).toLocaleDateString(($scope.countryCode === "NZ" ? 'en-NZ' : 'en-US'), { year: 'numeric', month: 'long', day: 'numeric' }),
                item.timeHours,
                item.bookedBy && (item.bookedBy.includes(",") || item.bookedBy.includes("\n") || item.bookedBy.includes("\r")) ? '"' + item.bookedBy.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.bookedBy,
                item.clientRefA && (item.clientRefA.includes(",") || item.clientRefA.includes("\n") || item.clientRefA.includes("\r")) ? '"' + item.clientRefA.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.clientRefA,
                item.clientRefB && (item.clientRefB.includes(",") || item.clientRefB.includes("\n") || item.clientRefB.includes("\r")) ? '"' + item.clientRefB.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.clientRefB,
                item.jobNumber,
                item.fromAddress && (item.fromAddress.includes(",") || item.fromAddress.includes("\n") || item.fromAddress.includes("\r")) ? '"' + item.fromAddress.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.fromAddress,
                item.americanFromCity,
                item.toAddress && (item.toAddress.includes(",") || item.toAddress.includes("\n") || item.toAddress.includes("\r")) ? '"' + item.toAddress.replace(/\n/g, ', ').replace(/\r/g, '') + '"' : item.toAddress,
                item.americanToCity,
                item.speedId != null ? $scope.getSpeedName(item.speedId) : null,
                item.quantity,
                item.weight,
                item.vehicleSize != null ? $scope.getSizeName(item.vehicleSize) : null,
                item.amount,
                item.notes ? '"' + item.notes.replace(/\n/g, ', ').replace(/\r/g, '').replace(/,\s*$/, "").replace(/,\s*$/, "").replace(/(^, )/, "") + '"' : null,
                item.clientNotes ? '"' + item.clientNotes.replace(/\n/g, ', ').replace(/\r/g, '').replace(/,\s*$/, "").replace(/,\s*$/, "").replace(/(^, )/, "") + '"' : null];

                formattedData.push(itemArray);
            });

            var csvContent = "";

            formattedData.forEach(row => {
                csvContent += row.join(",") + "\n";
            });

            var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
            var objUrl = URL.createObjectURL(blob);

            //Special way to set filename instead of just windows.open() random filename
            var link = document.createElement("a");
            link.href = objUrl;
            link.setAttribute("download", "JobList" + $scope.user.selectedClient.name + ".csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        };

        $scope.openTracking = function () {
            window.open($scope.selectedJob.trackingUrl, '_blank');
        };

        $scope.setJobsPerPage = function () {
            if ($scope.user.tempJobsPerPage === $scope.user.jobsPerPage) {
                return;
            } else if ($scope.user.tempJobsPerPage > 1000) {
                $scope.user.tempJobsPerPage = 1000;
            } else if ($scope.user.tempJobsPerPage < 1) {
                $scope.user.tempJobsPerPage = 1
            };

            $scope.user.jobsPerPage = $scope.user.tempJobsPerPage;
        };

        $scope.onSearchKeyDown = function (event) {
            //Search when user has pressed enter on search input only
            if (event.which !== 13 && event.keyCode !== 13)
                return;

            $scope.setJobsPerPage();
        };

        $scope.readyJobNow = function () {
            if ($scope.selectedJob.onHold) {
                $scope.updateJob();
            } else {
                $scope.readyNow();
            }
        };

        $scope.setCurrentDateTime = function () {
            var now = new Date();
            $scope.selectedJob.date = now;
            var hours = now.getHours().toString().padStart(2, '0');
            var minutes = now.getMinutes().toString().padStart(2, '0');
            $scope.selectedJob.timeHours = hours + ':' + minutes;
        };

        $scope.checkIfPrebook = function () {
            var now = new Date();
            var today = new Date($scope.countryCode == "NZ" ? now : now.toLocaleString('en-US', { timeZone: $scope.selectedJob.timeZoneName }));
            var date = new Date($scope.selectedJob.date);
            var time = new Date($scope.selectedJob.time);
            if (date > today || (date.getDate() == today.getDate() && (time.getHours() > today.getHours() || (time.getHours() == today.getHours() && time.getMinutes() > today.getMinutes())))) {
                return true;
            };
            return false;
        };

        $scope.prepareRerateObject = function () {
            if ($scope.permissions === 'Min') {
                return;
            };

            var date = $filter('date')($scope.selectedJob.date, 'yyyy-MM-dd') + "T" + $scope.selectedJob.timeHours + ":00.000Z";

            /*for (i in $scope.selectedJob.jobItems) {
                packages.push({
                    "Length": $scope.selectedJob.jobItems[i].length,
                    "Width": $scope.selectedJob.jobItems[i].depth,
                    "Height": $scope.selectedJob.jobItems[i].height,
                    "Kg": $scope.selectedJob.jobItems[i].weight,
                    "Units": $scope.selectedJob.jobItems[i].items
                })
            };

            if (packages.length == 0) {
                packages = null;
            };*/

            $scope.rerateObject = {
                speedId: $scope.selectedJob.speedId,
                sizeId: $scope.selectedJob.vehicleSize,
                From: {
                    streetAddress: $scope.selectedJob.fromAddress,
                    suburb: $scope.getSuburbName($scope.selectedJob.fromAddressSuburbId),
                    suburbId: $scope.selectedJob.fromAddressSuburbId,
                    city: $scope.getSiteName($scope.selectedJob.fromAddressSuburbId),
                    latitude: $scope.selectedJob.pickupLat,
                    longitude: $scope.selectedJob.pickupLong
                },
                To: {
                    streetAddress: $scope.selectedJob.toAddress,
                    suburb: $scope.getSuburbName($scope.selectedJob.toAddressSuburbId),
                    suburbId: $scope.selectedJob.toAddressSuburbId,
                    city: $scope.getSiteName($scope.selectedJob.toAddressSuburbId),
                    latitude: $scope.selectedJob.deliveryLat,
                    longitude: $scope.selectedJob.deliveryLong
                },
                //Packages: packages,
                weight: $scope.selectedJob.weight,
                quantity: $scope.selectedJob.quantity,
                isDangerousGoods: (($scope.selectedJob.dgClass != null && $scope.selectedJob.dgClass != 0) || $scope.selectedJob.dgDocs) ?? false,
                isPrebook: $scope.checkIfPrebook(),
                dateTime: date,
                bike: $scope.selectedJob.vehicleSize === 1,
                van: $scope.selectedJob.vehicleSize === 3,
                Truck: $scope.selectedJob.vehicleSize === 4 ? {
                    pickupTailLift: $scope.selectedJob.vehicleSize === 4 && $scope.selectedJob.jobItems != null ? $scope.selectedJob.jobItems.some(x => x.pu === true) : null,
                    dropoffTailLift: $scope.selectedJob.vehicleSize === 4 && $scope.selectedJob.jobItems != null ? $scope.selectedJob.jobItems.some(x => x.do === true) : null,
                    privateRes: $scope.selectedJob.vehicleSize === 4 && $scope.selectedJob.jobItems != null ? $scope.selectedJob.jobItems.some(x => x.privateRes === true) : null,
                    hasDGDocuments: $scope.selectedJob.dgDocs,
                    truckStartTime: date,
                    truckHours: 0
                } : null,
                ourReference: $scope.selectedJob.ourRef ?? null,
                clientReferenceA: $scope.selectedJob.clientRefA,
                clientReferenceB: $scope.selectedJob.clientRefB
            };

            $scope.getRerateAmount();
        };

        /* --- Job Item Functions --- */

        $scope.setJobItemWeightQuantity = function () {
            var totalWeight = 0;
            var totalQuantity = 0;

            for (i in $scope.selectedJob.jobItems) {
                totalWeight += $scope.selectedJob.jobItems[i].weight * $scope.selectedJob.jobItems[i].items;
                totalQuantity += $scope.selectedJob.jobItems[i].items;
            };

            $scope.selectedJob.weight = totalWeight;
            $scope.selectedJob.quantity = totalQuantity;
        };

        $scope.addJobItemRow = function () {
            $scope.selectedJob.jobItems.push({ itemId: null, length: null, depth: null, height: null, weight: null, items: 1 });
            $scope.fixItemIds();
        };

        $scope.removeJobItemRow = function (rowItemId) {
            var index = $scope.selectedJob.jobItems.map(e => e.itemId).indexOf(rowItemId);
            $scope.selectedJob.jobItems.splice(index, 1);
            $scope.fixItemIds();
        };

        $scope.fixItemIds = function () {
            for (i in $scope.selectedJob.jobItems) {
                $scope.selectedJob.jobItems[i].itemId = parseInt(i);
            };
        };

        /* --- Photo Modal Functions --- */

        $scope.openPhotoModal = function (photo) {
            $scope.modalPhoto = photo;
            document.body.style.overflow = 'hidden';
        };

        $scope.closePhotoModal = function () {
            $scope.modalPhoto = null;
            // Restore body scrolling
            document.body.style.overflow = 'auto';
        };

        // Close modal on ESC key
        angular.element(document).on('keydown', function (event) {
            if (event.key === 'Escape' && $scope.modalPhoto) {
                $scope.$apply(function () {
                    $scope.closePhotoModal();
                });
            }
        });

        /* --- POD Report Functions --- */

        $scope.downloadPodPdf = function (job) {
            window.open('API/PodReport/' + job.id, '_blank');
        };

        $scope.downloadPodExcel = function (job) {
            window.open('API/PodReport/Spreadsheet/' + job.id, '_blank');
        };

        $scope.pod = { email: '', sending: false };

        $scope.openSendPodModal = function (job) {
            $scope.podModalJob = job;
            $scope.pod.email = '';
            $scope.pod.sending = false;
            $scope.showSendPodModal = true;
            document.body.style.overflow = 'hidden';
        };

        $scope.closeSendPodModal = function () {
            $scope.showSendPodModal = false;
            $scope.podModalJob = null;
            document.body.style.overflow = 'auto';
        };

        $scope.sendPodEmail = function () {
            if (!$scope.pod.email || $scope.pod.sending) return;
            $scope.pod.sending = true;

            var request = {
                jobId: $scope.podModalJob.id,
                recipients: [$scope.pod.email],
                subject: 'Proof of Delivery - ' + $scope.podModalJob.jobNumber,
                body: 'Please find attached the Proof of Delivery report for job ' + $scope.podModalJob.jobNumber + '.'
            };

            jobListsService.sendPodEmail(request).then(function () {
                $scope.pod.sending = false;
                $scope.closeSendPodModal();
                $rootScope.showNotification('POD email queued successfully', 'success');
            }, function (error) {
                $scope.pod.sending = false;
                $rootScope.showNotification('Failed to send POD email', 'error');
            });
        };

        // Close POD modal on ESC key
        angular.element(document).on('keydown', function (event) {
            if (event.key === 'Escape' && $scope.showSendPodModal) {
                $scope.$apply(function () {
                    $scope.closeSendPodModal();
                });
            }
        });

        /* --- Accessorial Functions --- */

        $scope.calculateChargeAmount = function (charge) {
            var amount = 0;
            if (charge.chargeType === 'flat') {
                amount = charge.baseRate || 0;
            } else if (charge.chargeType === 'per_unit' || charge.chargeType === 'hourly') {
                var billable = charge.inputValue || 0;
                if (charge.freeAllowance) billable = Math.max(0, billable - charge.freeAllowance);
                if (charge.minimumQuantity && billable < charge.minimumQuantity) billable = charge.minimumQuantity;
                amount = billable * (charge.itemCount || 1) * (charge.ratePerUnit || 0);
            } else if (charge.chargeType === 'percentage') {
                var jobAmount = ($scope.speedDescription && $scope.speedDescription.rate)
                    ? $scope.speedDescription.rate
                    : ($scope.selectedJob ? ($scope.selectedJob.amount || 0) : 0);
                var base;
                if (charge.calculationOrder === 0) {
                    base = jobAmount;
                } else if (charge.calculationOrder === 100) {
                    var otherTotal = ($scope.jobAccessorialCharges || [])
                        .filter(function (c) { return c !== charge && c.chargeType !== 'percentage'; })
                        .reduce(function (sum, c) { return sum + (c.dirty ? (c.previewAmount || 0) : (c.calculatedAmount || 0)); }, 0);
                    base = jobAmount + otherTotal;
                } else {
                    base = charge.inputValue || 0;
                }
                charge.inputValue = base;
                amount = base * ((charge.percentageRate || 0) / 100);
            } else if (charge.chargeType === 'quote_based') {
                amount = charge.inputValue || 0;
            }
            if (charge.minimumCharge && amount < charge.minimumCharge) amount = charge.minimumCharge;
            if (charge.maximumCharge && amount > charge.maximumCharge) amount = charge.maximumCharge;
            return amount;
        };

        $scope.recalculateCharge = function (charge) {
            charge.calculatedAmount = $scope.calculateChargeAmount(charge);
        };

        $scope.recalculatePercentageCharges = function (baseChanged) {
            if (!$scope.jobAccessorialCharges) return;
            $scope.jobAccessorialCharges.forEach(function (charge) {
                if (charge.chargeType !== 'percentage') return;
                if (!baseChanged && charge.calculationOrder !== 100) return;
                var newAmount = $scope.calculateChargeAmount(charge);
                charge.previewAmount = newAmount;
                charge.dirty = Math.abs((charge.calculatedAmount || 0) - newAmount) >= 0.01;
            });
        };

        $scope.autoSavePercentageCharges = function () {
            if (!$scope.jobAccessorialCharges) return;
            var charges = $scope.jobAccessorialCharges
                .filter(function (c) { return c.chargeType === 'percentage' && c.dirty; });
            function saveNext(index) {
                if (index >= charges.length) return;
                $scope.saveJobAccessorialCharge(charges[index]).then(function () {
                    saveNext(index + 1);
                });
            }
            saveNext(0);
        };

        $scope.markJobChargeDirty = function (charge) {
            charge.dirty = true;
            charge.previewAmount = $scope.calculateChargeAmount(charge);
            if (charge.chargeType !== 'percentage') $scope.recalculatePercentageCharges();
        };

        $scope.hasSelectedNewCharges = function () {
            return $scope.availableAccessorialCharges &&
                $scope.availableAccessorialCharges.some(function (c) { return c.selected && c.chargeType != 'quote_based'; });
        };

        $scope.getSelectedNewChargesTotal = function () {
            if (!$scope.availableAccessorialCharges) return 0;
            return $scope.availableAccessorialCharges
                .filter(function (c) { return c.selected && c.chargeType != 'quote_based'; })
                .reduce(function (sum, c) { return sum + (c.calculatedAmount || 0); }, 0);
        };

        $scope.getJobAccessorialTotal = function () {
            if (!$scope.jobAccessorialCharges) return 0;
            return $scope.jobAccessorialCharges.reduce(function (sum, c) {
                return sum + (c.dirty ? (c.previewAmount || 0) : (c.calculatedAmount || 0));
            }, 0);
        };

        $scope.getPercentageDescription = function (charge) {
            if (!charge || charge.chargeType !== 'percentage' || !$scope.availableAccessorialCharges) {
                return 'of base rate';
            }
            var orders = $scope.availableAccessorialCharges.map(function (c) { return c.calculationOrder || 0; });
            var minOrder = Math.min.apply(null, orders);
            var maxOrder = Math.max.apply(null, orders);
            var currentOrder = charge.calculationOrder || 0;
            if (currentOrder === maxOrder && currentOrder !== minOrder) return 'of total charges';
            if (currentOrder === minOrder && currentOrder !== maxOrder) return 'of base rate';
            if (currentOrder === minOrder && currentOrder === maxOrder) return 'of base rate';
            return 'of subtotal (base + some charges)';
        };

        $scope.getPercentageCalculationNote = function (charge) {
            if (!charge || charge.chargeType !== 'percentage' || !$scope.availableAccessorialCharges) return null;
            var orders = $scope.availableAccessorialCharges.map(function (c) { return c.calculationOrder || 0; });
            var minOrder = Math.min.apply(null, orders);
            var maxOrder = Math.max.apply(null, orders);
            var currentOrder = charge.calculationOrder || 0;
            if (currentOrder === maxOrder && currentOrder !== minOrder) return 'Applied after all other charges';
            if (currentOrder === minOrder && currentOrder !== maxOrder) return 'Applied before all other charges';
            if (currentOrder !== minOrder && currentOrder !== maxOrder) return 'Applied after charges with lower calculation order';
            return null;
        };

        $scope.updateAutoPopulatedJobChargeValues = function () {
            var anyChanged = false;

            ($scope.jobAccessorialCharges || []).forEach(function (charge) {
                if (!charge.isAutoPopulated) return;
                var newValue = null;
                if (charge.unitTypeName === 'Pounds' || charge.unitTypeName === 'Kilograms') {
                    newValue = $scope.selectedJob.weight || 0;
                } else if (charge.unitTypeName === 'Quantity') {
                    newValue = $scope.selectedJob.quantity || 0;
                }
                if (newValue !== null && charge.inputValue !== newValue) {
                    charge.inputValue = newValue;
                    charge.dirty = true;
                    charge.previewAmount = $scope.calculateChargeAmount(charge);
                    anyChanged = true;
                }
            });

            ($scope.availableAccessorialCharges || []).forEach(function (charge) {
                if (!charge.isAutoPopulated) return;
                var newValue = null;
                if (charge.unitTypeName === 'Pounds' || charge.unitTypeName === 'Kilograms') {
                    newValue = $scope.selectedJob.weight || 0;
                } else if (charge.unitTypeName === 'Quantity') {
                    newValue = $scope.selectedJob.quantity || 0;
                }
                if (newValue !== null && charge.inputValue !== newValue) {
                    charge.inputValue = newValue;
                    charge.calculatedAmount = $scope.calculateChargeAmount(charge);
                }
            });

            if (anyChanged) {
                $scope.recalculatePercentageCharges();
            }
        };

        $scope.$watch('selectedJob.weight', function (newVal, oldVal) {
            if (newVal !== oldVal)
                $scope.updateAutoPopulatedJobChargeValues();
        });

        $scope.$watch('selectedJob.quantity', function (newVal, oldVal) {
            if (newVal !== oldVal)
                $scope.updateAutoPopulatedJobChargeValues();
        });

        /* --- Init program --- */

        $scope.retrieveAll = function () {
            $scope.getCountryCode();
            $scope.getClients();
            $scope.getAllClients();
            $scope.getCouriers();
            $scope.getJobTypeStatuses();
            $scope.getUndeliverableLocations();
            $scope.getHardCoded();
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.user = {};
            $scope.job = {};
            $scope.user.filters = {};
            $scope.user.filters.dateFrom = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.user.filters.dateFrom.setDate($scope.user.filters.dateFrom.getDate() - 1);
            $scope.user.filters.dateTo = new Date(new Date().setHours(0, 0, 0, 0));
            $scope.user.filters.dateTo.setDate($scope.user.filters.dateTo.getDate() + 1);
            $scope.user.entryType = 1;
            $scope.user.tempJobsPerPage = 50;
            $scope.setJobsPerPage();
            $scope.functions = {};
            $scope.showPrice = true;
            $scope.autoPopulatedUnitTypes = ['Pounds', 'Kilograms', 'Quantity'];
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Job List";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }])
    .filter("accessorialChargeTypeLabel", function () {
        return function (type) {
            var labels = {
                flat: "Flat fee",
                per_unit: "Per unit",
                hourly: "Hourly",
                percentage: "Percentage",
                quote_based: "Quote required"
            };
            return labels[type] || type;
        };
    });