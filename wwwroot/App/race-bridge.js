/**
 * Race Bridge — injected into booking page when loaded in /race iframe
 * Posts step-completion messages to parent window for game detection
 * Runs INSIDE Angular's context for 100% reliable detection
 */
(function() {
  'use strict';
  
  // Only activate when in an iframe (race mode)
  if (window === window.top) return;
  
  var BRIDGE_VERSION = '3.0';
  var lastState = {};
  var stepsFired = {};
  
  function post(type, data) {
    data = data || {};
    data.type = 'race-bridge';
    data.event = type;
    data.ts = Date.now();
    data.v = BRIDGE_VERSION;
    window.parent.postMessage(data, '*');
    console.log('[RaceBridge]', type, data);
  }
  
  post('bridge-loaded');
  
  // Wait for Angular to bootstrap
  var bootCheck = setInterval(function() {
    try {
      var ngApp = angular.element(document.body);
      if (!ngApp || !ngApp.injector) return;
      var injector = ngApp.injector();
      if (!injector) return;
      
      clearInterval(bootCheck);
      post('angular-ready');
      hookAngular(injector, ngApp);
    } catch(e) {
      // Angular not ready yet
    }
  }, 200);
  
  // Timeout after 30s
  setTimeout(function() { clearInterval(bootCheck); }, 30000);
  
  function hookAngular(injector, ngApp) {
    var $rootScope = injector.get('$rootScope');
    
    // ─── STATE CHANGE DETECTION ───
    // This catches ALL navigation: client select → booking form → confirmation
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
      post('state-change', { to: toState.name, from: fromState ? fromState.name : null });
      
      // If we landed on the booking/desktop state, the form is ready
      if (toState.name && toState.name.match(/desktop|booking/i)) {
        post('booking-form-ready');
      }
    });
    
    // ─── WATCH: Client selected ───
    $rootScope.$watch(function() {
      var scope = ngApp.scope();
      return scope && scope.clientId ? scope.clientId : null;
    }, function(newVal, oldVal) {
      if (newVal && newVal !== oldVal && !stepsFired['client']) {
        stepsFired['client'] = true;
        post('step-complete', { step: 'clientSelected', value: newVal });
      }
    });
    
    // ─── POLLING for booking model (more reliable than deep watches) ───
    var pollInterval = setInterval(function() {
      try {
        // Find the booking scope — could be on various elements
        var bookingScope = null;
        var candidates = [
          '#toBookingGpsSearch',
          '#fromBookingGpsSearch',
          '[ng-controller="desktopHomeControl"]',
          '[ng-controller="homeControl"]',
          '.booking-container',
          '#bookingForm'
        ];
        
        for (var i = 0; i < candidates.length; i++) {
          var el = document.querySelector(candidates[i]);
          if (el) {
            var s = angular.element(el).scope();
            if (s && s.booking) {
              bookingScope = s;
              break;
            }
          }
        }
        
        if (!bookingScope || !bookingScope.booking) return;
        var b = bookingScope.booking;
        
        // Step 1: Address typed (toSearch — delivery address)
        if (b.toSearch && b.toSearch.length > 3 && !stepsFired['address']) {
          stepsFired['address'] = true;
          post('step-complete', { step: 'addressTyped', value: b.toSearch });
        }
        
        // Step 2: Autocomplete selected (toDetails — delivery address populated)
        if (b.toDetails && b.toDetails.formatted_address && !stepsFired['autocomplete']) {
          stepsFired['autocomplete'] = true;
          post('step-complete', { step: 'autocompleteSelected', value: b.toDetails.formatted_address });
        }
        
        // Step 3: Parcel selected (stockSize set)
        if (b.stockSize && b.stockSize.name && !stepsFired['parcel']) {
          stepsFired['parcel'] = true;
          post('step-complete', { step: 'parcelSelected', value: b.stockSize.name });
        }
        
        // Step 4: Speed selected (selectedRate set)  
        if (b.selectedRate && b.selectedRate.serviceName && !stepsFired['speed']) {
          stepsFired['speed'] = true;
          post('step-complete', { step: 'speedSelected', value: b.selectedRate.serviceName });
        }
        
        // Step 5: Job booked (check scope.step or confirmation)
        var rootStep = bookingScope.step || bookingScope.$parent.step;
        if (rootStep === 'jobBooked' && !stepsFired['booked']) {
          stepsFired['booked'] = true;
          post('step-complete', { step: 'jobBooked' });
        }
        
        // Also check by confirmation text
        if (!stepsFired['booked'] && document.body.innerText.match(/Confirmation Details|Job Number/)) {
          stepsFired['booked'] = true;
          post('step-complete', { step: 'jobBooked' });
        }
        
      } catch(e) {
        // Silent fail
      }
    }, 300);
    
    // ─── DOM EVENT LISTENERS (backup) ───
    document.addEventListener('click', function(e) {
      var target = e.target;
      
      // Speed button click
      if (target.classList && target.classList.contains('speed-button')) {
        setTimeout(function() {
          if (target.classList.contains('selected-border') && !stepsFired['speed']) {
            stepsFired['speed'] = true;
            post('step-complete', { step: 'speedSelected', value: target.innerText });
          }
        }, 100);
      }
      
      // Book button click
      if (target.innerText && target.innerText.match(/Book\s*(Job|Now|It)/i)) {
        post('book-clicked');
      }
      
      // Client confirm button
      if (target.innerText && target.innerText.match(/Confirm\s*Client/i)) {
        post('client-confirmed');
      }
    }, true);
    
    // Input events for address typing
    document.addEventListener('input', function(e) {
      if (e.target.id === 'fromBookingGpsSearch' || e.target.id === 'toBookingGpsSearch') {
        post('address-typing', { field: e.target.id, length: e.target.value.length });
      }
    }, true);
    
    // Select change for parcel
    document.addEventListener('change', function(e) {
      if (e.target.tagName === 'SELECT') {
        var opt = e.target.options[e.target.selectedIndex];
        if (opt && opt.text.match(/satchel|box|banana|small|medium|large/i)) {
          if (!stepsFired['parcel']) {
            stepsFired['parcel'] = true;
            post('step-complete', { step: 'parcelSelected', value: opt.text });
          }
        }
      }
    }, true);
    
    post('hooks-installed');
  }
  
  // ─── RESET (called from parent when restarting race) ───
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'race-reset') {
      stepsFired = {};
      lastState = {};
      post('reset-complete');
    }
  });
  
})();
