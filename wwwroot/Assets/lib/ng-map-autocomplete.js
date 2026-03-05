/**
 * Nominatim-based replacement for ng-map-autocomplete (Google Places).
 * Drop-in replacement: sets scope.details in the same shape as Google Places result.
 */
angular.module("ngMapAutocomplete", [])
  .directive('ngMapAutocomplete', ['$timeout', '$http', function ($timeout, $http) {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=ngModel',
        options: '=?',
        details: '=?'
      },
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) return;

        var dropdown = null;
        var debounceTimer = null;
        var results = [];

        // Create dropdown element
        function ensureDropdown() {
          if (dropdown) return;
          dropdown = document.createElement('div');
          dropdown.style.cssText = 'position:absolute;z-index:10000;background:#fff;border:1px solid #ccc;max-height:220px;overflow-y:auto;width:' + element[0].offsetWidth + 'px;box-shadow:0 2px 6px rgba(0,0,0,.2);border-radius:4px;';
          element[0].parentNode.style.position = 'relative';
          element[0].parentNode.appendChild(dropdown);
        }

        function hideDropdown() {
          if (dropdown) dropdown.style.display = 'none';
        }

        function showDropdown() {
          if (dropdown) dropdown.style.display = 'block';
        }

        // Convert Nominatim result to Google Places-like details object
        function toGoogleDetails(item) {
          var addr = item.address || {};
          var components = [];

          if (addr.house_number) components.push({ long_name: addr.house_number, short_name: addr.house_number, types: ['street_number'] });
          if (addr.road) components.push({ long_name: addr.road, short_name: addr.road, types: ['route'] });
          if (addr.suburb) components.push({ long_name: addr.suburb, short_name: addr.suburb, types: ['sublocality', 'sublocality_level_1'] });
          if (addr.city || addr.town || addr.village) {
            var locality = addr.city || addr.town || addr.village;
            components.push({ long_name: locality, short_name: locality, types: ['locality'] });
          }
          if (addr.state) components.push({ long_name: addr.state, short_name: addr.state, types: ['administrative_area_level_1'] });
          if (addr.postcode) components.push({ long_name: addr.postcode, short_name: addr.postcode, types: ['postal_code'] });
          if (addr.country) components.push({ long_name: addr.country, short_name: addr.country_code ? addr.country_code.toUpperCase() : '', types: ['country'] });

          return {
            formatted_address: item.display_name,
            name: item.display_name,
            geometry: {
              location: {
                lat: function() { return parseFloat(item.lat); },
                lng: function() { return parseFloat(item.lon); }
              }
            },
            address_components: components,
            place_id: 'nominatim_' + item.place_id
          };
        }

        function search(query) {
          if (!query || query.length < 3) { hideDropdown(); return; }

          var country = '';
          if (scope.options && scope.options.country) {
            country = '&countrycodes=' + scope.options.country.replace(',', ',');
          }

          $http.get('https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=' + encodeURIComponent(query) + country)
            .then(function (resp) {
              results = resp.data || [];
              if (results.length === 0) { hideDropdown(); return; }

              ensureDropdown();
              dropdown.innerHTML = '';

              results.forEach(function (item, idx) {
                var row = document.createElement('div');
                row.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid #eee;';
                row.textContent = item.display_name;
                row.onmouseenter = function () { row.style.background = '#f0f7ff'; };
                row.onmouseleave = function () { row.style.background = '#fff'; };
                row.onmousedown = function (e) {
                  e.preventDefault();
                  selectResult(item);
                };
                row.ontouchstart = function (e) {
                  e.preventDefault();
                  selectResult(item);
                };
                dropdown.appendChild(row);
              });
              showDropdown();
            });
        }

        function selectResult(item) {
          var details = toGoogleDetails(item);
          scope.$apply(function () {
            scope.details = details;
            ngModel.$setViewValue(item.display_name);
            element.val(item.display_name);
            scope.$emit('mapentrySelected', details);
          });
          hideDropdown();
        }

        // Input handler with debounce
        element.on('input', function () {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function () {
            search(element.val());
          }, 400);
        });

        // Enter key: select first result
        element.on('keydown', function (e) {
          if (e.which === 13) {
            e.preventDefault();
            if (results.length > 0) {
              selectResult(results[0]);
            }
          }
        });

        element.on('focusout', function () {
          $timeout(function () { hideDropdown(); }, 400);
        });

        element.on('focus', function () {
          if (results.length > 0 && dropdown) showDropdown();
        });

        ngModel.$render = function () {
          element.val(ngModel.$viewValue);
        };
      }
    };
  }]);
