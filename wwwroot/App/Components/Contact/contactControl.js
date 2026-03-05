angular
    .module("urgentOnePageBooking")
    .controller("contactControl", ["$rootScope", "$scope", "$state", "contactsService", function ($rootScope, $scope, $state, contactsService) {

        /* --- API Jawnz --- */

        $scope.getClients = function () {
            contactsService.getClients()
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
            contactsService.getAllClients()
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

        $scope.getContacts = function () {
            contactsService.getContacts($scope.user.selectedClient.id)
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

        $scope.getSubscriptions = function () {
            contactsService.getSubscriptions()
                .then(function (data) {
                    if (data.success) {
                        $scope.subscriptions = data.subscriptions;
                    } else {
                        $rootScope.showNotification("Error getting subscriptions", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting subscriptions", "fa-exclamation");
                });
        };

        $scope.getSpeeds = function () {
            contactsService.getSpeeds($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobSpeeds = data.speeds;
                    } else {
                        $rootScope.showNotification("Error getting services", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting services", "fa-exclamation");
                });
        };

        $scope.getVehicleSizes = function () {
            contactsService.getVehicleSizes($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.jobSizes = data.vehicleSizes;
                    } else {
                        $rootScope.showNotification("Error getting vehicle sizes", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting vehicle sizes", "fa-exclamation");
                });
        };

        $scope.getStockSizes = function () {
            if ($scope.user.selectedClient.stockSizes != null && $scope.user.selectedClient.stockSizes.length > 0) {
                return;
            }

            contactsService.getStockSizes($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.user.selectedClient.stockSizes = data.stockSizes;
                    } else {
                        $rootScope.showNotification("Error getting package sizes", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting package sizes", "fa-exclamation");
                });
        };

        $scope.getClientContactSubscriptions = function () {
            contactsService.getContactSubscriptions($scope.user.selectedContact.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.contactSubscriptions = data.contactSubscriptions;
                        $scope.setSelectedSubscription();
                    } else {
                        $rootScope.showNotification("Error getting contact subscriptions", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting contact subscriptions", "fa-exclamation");
                });
        };

        $scope.getAllInternetPermissions = function () {
            contactsService.getAllInternetPermissions()
                .then(function (data) {
                    if (data.success) {
                        $scope.allInternetPermissions = data.internetPermissions;
                    } else {
                        $rootScope.showNotification("Error getting internet permissions", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting internet permissions", "fa-exclamation");
                });
        };

        $scope.getClientInternetPermissions = function () {
            contactsService.getInternetPermissions($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.clientInternetPermissions = data.internetPermissions;
                        $scope.amalgamateInternetPermissions();
                    } else {
                        $rootScope.showNotification("Error getting internet permissions", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting internet permissions", "fa-exclamation");
                });
        };

        $scope.getClientContactInternetPermissions = function () {
            contactsService.getClientContactInternetPermissions($scope.user.selectedContact.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.clientContactInternetPermissions = data.clientContactInternetPermissions;
                        $scope.amalgamateInternetPermissions();
                    } else {
                        $rootScope.showNotification("Error getting internet permissions", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting internet permissions", "fa-exclamation");
                });
        };

        $scope.getClientContact = function () {
            contactsService.getClientContact($scope.user.selectedContact.id, $scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.clientContact = data.clientContact;
                    } else {
                        $rootScope.showNotification("Error getting client contact", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting client contact", "fa-exclamation");
                });
        };

        $scope.getAddressBook = function () {
            contactsService.getAddressBook($scope.user.selectedClient.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.addressBooks = data.addressBook;
                    } else {
                        $rootScope.showNotification("Error getting address book", "fa-exclamation");
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting address book", "fa-exclamation");
                });
        };

        $scope.getHardCoded = function () {
            $scope.relWithUrgents = [{ id: 3, name: "Accounts" }, { id: 1, name: "Decision Maker" }, { id: 2, name: "Main Contact" }, { id: 4, name: "User" }];
            $scope.trackingMethods = [{ id: 0, name: "Web Site" }, { id: 1, name: "Email" }, { id: 2, name: "Text" }, { id: 3, name: "Email & Text" }];
            $scope.jobTypes = [{ id: 1, name: "Pick up from us" }, { id: 2, name: "Deliver to us" }, { id: 3, name: "3rd party" }];
        };

        $scope.saveContact = function () {
            if ($scope.saveInProgress)
                return;

            $scope.saveInProgress = true;

            $scope.user.selectedContact.clientId = $scope.user.selectedClient.id;

            var promise = $scope.user.selectedContact.id
                ? contactsService.updateContact({ "id": $scope.user.selectedContact.id, "data": $scope.user.selectedContact })
                : contactsService.createContact({ "data": $scope.user.selectedContact });

            promise
                .then(function (data) {
                    if (data.success) {
                        if (!$scope.user.selectedContact.id) {
                            $scope.assignSubscriptionsToNewContact(data);
                            $scope.assignClientContactToNewContact(data);
                        } else {
                            $scope.saveSubscriptionChanges();
                            $scope.saveInternetPermissionChanges();
                            $scope.updateClientContact();
                        }
                        $rootScope.showNotification(`Successfully ${$scope.user.selectedContact.id ? "updated" : "added"} this user`, "fa-check");
                        $scope.user.selectedContact = data.contact;
                    } else if (data.messages.length > 0) {
                        $rootScope.showNotification(data.messages[0].message, "fa-exclamation");
                    } else {
                        $rootScope.showNotification(`Error ${$scope.user.selectedContact.id ? "updating" : "adding new"} contact`, "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.status === 400 && response.data.messages && response.data.messages.length > 0)
                        $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                    else
                        $rootScope.showNotification(`Error ${$scope.user.selectedContact.id ? "updating" : "adding new"} contact`, "fa-exclamation");
                })
                .finally(() => $scope.saveInProgress = false);
        };

        $scope.deleteContact = function () {
            if ($scope.deleteInProgress)
                return;

            $scope.deleteInProgress = true;

            contactsService.deleteContact($scope.user.selectedContact.id)
                .then(function (data) {
                    if (data.success) {
                        $scope.contactBack();
                        $rootScope.showNotification("User deleted successfully", "fa-check");
                    } else {
                        $rootScope.showNotification("Error deleting user", "fa-exclamation");
                    }
                })
                .catch(function (response) {
                    if (response.status === 400 && response.data.messages && response.data.messages.length > 0) {
                        $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                    } else {
                        $rootScope.showNotification("Error deleting user", "fa-exclamation");
                    }
                })
                .finally(() => $scope.deleteInProgress = false)
        };

        $scope.assignSubscriptionsToNewContact = function (contactData) {
            for (i in $scope.subscriptions) {
                if ($scope.subscriptions[i].assignToNewContacts === true) {
                    info = { "id": contactData.contact.id, "subId": $scope.subscriptions[i].id };
                    contactsService.createContactSubscription({ "data": info });
                }
            }
        };

        $scope.saveSubscriptionChanges = function (contactData) {
            if ($scope.subChangeInProgress)
                return;
            $scope.subChangeInProgress = true;

            var oldSubs = [];
            for (let i = 0; i < $scope.contactSubscriptions.length; i++) {
                oldSubs.push($scope.contactSubscriptions[i].id);
            }
            var newSubs = [];
            for (let i = 0; i < $scope.subscriptions.length; i++) {
                if ($scope.subscriptions[i].selected === true) {
                    newSubs.push($scope.subscriptions[i].id);
                }
            }
            subSubDiff = oldSubs.filter(x => !newSubs.includes(x));
            subAddDiff = newSubs.filter(x => !oldSubs.includes(x));

            if (subAddDiff.length !== 0 || subSubDiff.length !== 0) {
                var deletePromises = [];
                for (i in subSubDiff) {
                    deletePromises.push(contactsService.deleteContactSubscription({ "id": $scope.user.selectedContact.id, "subId": subSubDiff[i] }));
                }
                Promise.all(deletePromises)
                    .then(function (data) {
                        var createPromises = [];
                        for (i in subAddDiff) {
                            data = { "id": $scope.user.selectedContact.id, "subId": subAddDiff[i] };
                            createPromises.push(contactsService.createContactSubscription({ "data": data }));
                        }
                        Promise.all(createPromises)
                            .then(function (data) {
                                $scope.getClientContactSubscriptions();
                            })
                            .catch(function () {
                                $rootScope.showNotification("Error adding new subscriptions", "fa-exclamation");
                            })
                            .finally(() => $scope.subChangeInProgress = false);
                    })
                    .catch(function () {
                        $rootScope.showNotification("Error removing old subsciptions", "fa-exclamation");
                        $scope.subChangeInProgress = false;
                    });
            } else {
                $scope.subChangeInProgress = false;
            }
        };

        $scope.deleteContactSubscriptions = function () {
            if ($scope.contactSubscriptionDeleteInProgress)
                return;

            $scope.contactSubscriptionDeleteInProgress = true;

            contactsService.getContactSubscriptions($scope.user.selectedContact.id) //Get current contact subscriptions
                .then(function (data) {
                    if (data.success) {
                        var deletePromises = [];
                        for (i in data.contactSubscriptions) {
                            deletePromises.push(contactsService.deleteContactSubscription({ "id": $scope.user.selectedContact.id, "subId": data.contactSubscriptions[i].id }));
                        };
                        Promise.all(deletePromises) //Make sure all internet permissions are deleted successfully before deleting clientContact
                            .then(function () {
                                $rootScope.showNotification("User deleted successfully", "fa-check");
                            })
                            .catch(function () {
                                $rootScope.showNotification("Error deleting contact subscriptions", "fa-exclamation");
                            })
                            .finally(() => $scope.contactSubscriptionDeleteInProgress = false);
                    } else {
                        $rootScope.showNotification("Error getting contact subscriptions", "fa-exclamation");
                        $scope.contactSubscriptionDeleteInProgress = false;
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting contact subscriptions", "fa-exclamation");
                    $scope.contactSubscriptionDeleteInProgress = false;
                });
        };

        $scope.assignClientContactToNewContact = function (contactData) {
            var newClientContact = { clientId: $scope.user.selectedClient.id, default: true, contactId: contactData.contact.id };
            contactsService.createClientContact({ data: newClientContact })
                .then(function (data) {
                    if (data.success) {
                        $scope.clientContact = data.clientContact;
                        $scope.setDefaultPermissionsJobTypes(data.clientContact.id);
                    }
                });
        };

        $scope.updateClientContact = function () {
            if ($scope.clientContactSaveInProgress)
                return;

            $scope.clientContactSaveInProgress = true;

            contactsService.updateClientContact({ id: $scope.clientContact.id, data: $scope.clientContact })
                .then(function (data) {
                    if (data.success) {
                        $scope.clientContact = data.clientContact;
                    }
                    else if (data.messages.length > 0) {
                        $rootScope.showNotification(data.messages[0].message, "fa-exclamation");
                    } else {
                        $rootScope.showNotification("Error updating client contact", "fa-exclamation");
                    };
                })
                .catch(function (response) {
                    if (response.status === 400 && response.data.messages && response.data.messages.length > 0)
                        $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                    else
                        $rootScope.showNotification("Error updating client contact", "fa-exclamation");
                })
                .finally(() => $scope.clientContactSaveInProgress = false);
        };

        $scope.deleteClientContact = function () {
            if ($scope.clientContactDeleteInProgress)
                return;

            $scope.clientContactDeleteInProgress = true;

            contactsService.getClientContactInternetPermissions($scope.user.selectedContact.id) //Get current internet permissions
                .then(function (data) {
                    if (data.success) {
                        var deletePromises = [];
                        for (i in data.clientContactInternetPermissions) {
                            deletePromises.push(contactsService.deleteClientContactInternetPermission({ "id": $scope.clientContact.id, "subId": data.clientContactInternetPermissions[i].id }));
                        };
                        Promise.all(deletePromises) //Make sure all internet permissions are deleted successfully before deleting clientContact
                            .then(function () {
                                contactsService.getClientContactJobTypes({ "id": $scope.clientContact.id }) //Get current job types
                                    .then(function (data) {
                                        if (data.success) {
                                            var deleteJobTypePromises = [];
                                            for (i in data.clientContactJobTypes) {
                                                deleteJobTypePromises.push(contactsService.deleteClientContactJobType({ "id": $scope.clientContact.id, "clientContactJobTypeId": data.clientContactJobTypes[i].id }));
                                            };
                                            Promise.all(deleteJobTypePromises) //Make sure all job types are deleted successfully before deleting clientContact
                                                .then(function () {
                                                    contactsService.deleteClientContact({ "id": $scope.clientContact.id }) //Delete clientContact
                                                        .then(function (data) {
                                                            if (data.success) {
                                                                $scope.deleteContact();
                                                                $rootScope.showNotification("User deleted successfully", "fa-check");
                                                            } else if (data.messages.length > 0) {
                                                                $rootScope.showNotification(data.messages[0].message, "fa-exclamation");
                                                            } else {
                                                                $rootScope.showNotification("Error deleting user", "fa-exclamation");
                                                            }
                                                        })
                                                        .catch(function (response) {
                                                            if (response.status === 400 && response.data.messages && response.data.messages.length > 0)
                                                                $rootScope.showNotification(response.data.messages[0].message, "fa-exclamation");
                                                            else
                                                                $rootScope.showNotification("Error deleting user", "fa-exclamation");
                                                        })
                                                        .finally(() => $scope.clientContactDeleteInProgress = false);
                                                })
                                                .catch(function () {
                                                    $rootScope.showNotification("Error deleting old job types", "fa-exclamation");
                                                    $scope.clientContactDeleteInProgress = false
                                                });
                                        } else {
                                            $rootScope.showNotification("Error getting old job types", "fa-exclamation");
                                            $scope.clientContactDeleteInProgress = false;
                                        }
                                    })
                                    .catch(function () {
                                        $rootScope.showNotification("Error getting old job types", "fa-exclamation");
                                        $scope.clientContactDeleteInProgress = false
                                    });
                            })
                            .catch(function () {
                                $rootScope.showNotification("Error deleting old internet permissions", "fa-exclamation");
                                $scope.clientContactDeleteInProgress = false
                            });
                    } else {
                        $rootScope.showNotification("Error getting old internet permissions", "fa-exclamation");
                        $scope.clientContactDeleteInProgress = false;
                    }
                })
                .catch(function () {
                    $rootScope.showNotification("Error getting old internet permissions", "fa-exclamation");
                    $scope.clientContactDeleteInProgress = false;
                });
        };

        $scope.setDefaultPermissionsJobTypes = function (clientContactId) {
            defaultInternetPermissions = [];
            for (i in $scope.allInternetPermissions) {
                if ($scope.allInternetPermissions[i].assignToNewContacts === true) {
                    defaultInternetPermissions.push($scope.allInternetPermissions[i].id);
                }
            };

            clientInternetPermissions = [];
            for (i in $scope.clientInternetPermissions) {
                clientInternetPermissions.push($scope.clientInternetPermissions[i].id);
            };

            for (i in defaultInternetPermissions) {
                //Don't auto set permissions they don't have under any contacts under this client
                if (clientInternetPermissions.includes(defaultInternetPermissions[i])) {
                    info = { "id": clientContactId, "subId": defaultInternetPermissions[i] };
                    contactsService.createClientContactInternetPermission({ "data": info });
                }
            }
            defaultJobTypeIDs = [1, 2, 3, 4, 20, 24, 25, 29, 35, 36, 37, 38, 41, 42, 43, 44, 46, 51, 52, 64];
            defaultJobTypePUPs = [20, 10, 7, 90, 15, 30, 60, 25, 60, 120, 120, 90, 60, 90, 120, 90, 90, 240, 300, 90];
            for (i in defaultJobTypeIDs) {
                info = { "id": clientContactId, "jobTypeId": defaultJobTypeIDs[i], "pickupTime": defaultJobTypePUPs[i] };
                contactsService.createClientContactJobType({ "data": info });
            }
            //Last thing created so get the new data
            $scope.getClientContactInternetPermissions();
            $scope.getClientContactSubscriptions();
        };

        $scope.saveInternetPermissionChanges = function () {
            if ($scope.ipChangeInProgress)
                return;

            $scope.ipChangeInProgress = true;

            var oldIps = [];
            for (let i = 0; i < $scope.clientContactInternetPermissions.length; i++) {
                oldIps.push($scope.clientContactInternetPermissions[i].id);
            }
            var newIps = [];
            for (let i = 0; i < $scope.allInternetPermissions.length; i++) {
                if ($scope.allInternetPermissions[i].selected === true) {
                    newIps.push($scope.allInternetPermissions[i].id);
                }
            }

            ipSubDiff = oldIps.filter(x => !newIps.includes(x));
            ipAddDiff = newIps.filter(x => !oldIps.includes(x));

            if (ipSubDiff.length !== 0 || ipAddDiff.length !== 0) {
                var deletePromises = [];
                for (i in ipSubDiff) {
                    deletePromises.push(contactsService.deleteClientContactInternetPermission({ "id": $scope.clientContact.id, "subId": ipSubDiff[i] }));
                }
                Promise.all(deletePromises)
                    .then(function (data) {
                        var createPromises = [];
                        for (i in ipAddDiff) {
                            data = { "id": $scope.clientContact.id, "subId": ipAddDiff[i] };
                            createPromises.push(contactsService.createClientContactInternetPermission({ "data": data }));
                        }
                        Promise.all(createPromises)
                            .then(function (data) {
                                $scope.getClientContactInternetPermissions();
                            })
                            .catch(function () {
                                $rootScope.showNotification("Error adding new internet permissions", "fa-exclamation");
                            })
                            .finally(() => $scope.ipChangeInProgress = false);
                    })
                    .catch(function () {
                        $rootScope.showNotification("Error removing old internet permissions", "fa-exclamation");
                        $scope.ipChangeInProgress = false;
                    });
            } else {
                $scope.ipChangeInProgress = false;
            }
        };

        /* --- Error Checking --- */

        $scope.checkFormData = function () {
            try {
                $scope.loadingMessage = "Processing...please don't refresh or close this page while processing.";
                $(".loading").show();

                $scope.user.errors = [];

                if (!$scope.user.selectedContact.firstName) {
                    $scope.user.errors.push("You must enter your first name.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedContact.lastName) {
                    $scope.user.errors.push("You must enter your last name.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedContact.id && !$scope.user.selectedContact.password) {
                    $scope.user.errors.push("You must enter a valid password.");
                    $(".loading").fadeOut();
                    return;
                }

                if (!$scope.user.selectedContact.email) {
                    $scope.user.errors.push("You must enter a valid email address.");
                    $(".loading").fadeOut();
                    return;
                }

                $scope.saveContact();
                $(".loading").fadeOut();

            } catch (e) {
                console.log(e);
                $scope.user.errors.push("Error, please check all fields and try again.");
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
                $scope.getContacts();
            }
            //Hides old booking if stripe
            $scope.setStripeState();
        };

        $scope.setInternal = function () {
            for (i in $scope.clients) {
                if ($scope.clients[i].baseClient == true) {
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

        $scope.editContact = function () {
            $scope.setStep('edit');
            $scope.getStockSizes();
            $scope.getClientInternetPermissions();
            $scope.getClientContactInternetPermissions();
            $scope.getClientContactSubscriptions();
            $scope.getClientContact();
            $scope.getAddressBook();
            $scope.getVehicleSizes();
            $scope.getSpeeds();
        };

        $scope.createContact = function () {
            $scope.setStep('edit');
            $scope.setPage('contact');
            $scope.getClientInternetPermissions();
        };

        $scope.togglePassword = function () {
            $scope.showPassword = !$scope.showPassword;
        };

        $scope.amalgamateInternetPermissions = function () {
            if ($scope.allInternetPermissions && $scope.clientContactInternetPermissions && $scope.clientInternetPermissions) {
                for (let j = 0; j < $scope.allInternetPermissions.length; j++) {
                    $scope.allInternetPermissions[j].selected = false;
                    $scope.allInternetPermissions[j].disabled = true;
                    for (let i = 0; i < $scope.clientContactInternetPermissions.length; i++) {
                        if ($scope.clientContactInternetPermissions[i].id === $scope.allInternetPermissions[j].id) {
                            $scope.allInternetPermissions[j].selected = true;
                        }
                    }
                    for (let i = 0; i < $scope.clientInternetPermissions.length; i++) {
                        if ($scope.clientInternetPermissions[i].id === $scope.allInternetPermissions[j].id) {
                            $scope.allInternetPermissions[j].disabled = false;
                        }
                    }
                }
            }
        };

        $scope.setSelectedSubscription = function () {
            for (let i = 0; i < $scope.contactSubscriptions.length; i++) {
                for (let j = 0; j < $scope.subscriptions.length; j++) {
                    if ($scope.contactSubscriptions[i].id === $scope.subscriptions[j].id) {
                        $scope.subscriptions[j].selected = true;
                    }
                }
            }
        };

        $scope.contactBack = function () {
            $scope.step = 'select';
            $scope.page = 'contact';
            $scope.getContacts();
            $scope.user.selectedContact = null;
            $scope.user.errors = null;
        };

        $scope.deleteContactAll = function () {
            $rootScope.showPrompt("Confirm user Deletion", "Permanently delete user?", function (params) {
                $scope.deleteContactSubscriptions();
                $scope.deleteClientContact(); //When this is done it deletes contact
            });
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
            $scope.getSubscriptions();
            $scope.getAllInternetPermissions();
            $scope.getHardCoded();
        };

        $scope.initAll = function () {
            $scope.step = 'select';
            $scope.page = 'contact';
            $scope.user = {};
            $scope.showPassword = false;
        };

        $scope.init = function () {
            $state.current.data.backButton = 0;
            $state.current.data.pageTitle = "Contacts";

            $scope.retrieveAll();
            $scope.initAll();

            $(".page-loading").stop().fadeOut(100);
        }();

    }]);