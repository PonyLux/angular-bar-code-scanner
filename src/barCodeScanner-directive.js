/**
 * @ngdoc object
 * @name barCodeScanner.BarCodeScannerConfigProvider
 * @description
 * This provider allow to configure the bar code scan.
 *
 */
angular.module('barCodeScanner').provider('BarCodeScannerConfig', function() {
    'use strict';

    var broadcastEventName = 'bar-code-scan-event',
        numberOfCharOfBarCode = 10;

    /**
     * @ngdoc function
     * @name setBroadcastEventName
     * @methodOf barCodeScanner.BarCodeScannerConfigProvider
     *
     * @description
     * This method allow to set the event name that will be broadcast when a scan is detected.
     * Default event name is 'bar-code-scan-event'.
     *
     * @param {string} eventName The event name to set
     */
    this.setBroadcastEventName = function(eventName) {
        broadcastEventName = eventName;
    };

    /**
     * @ngdoc function
     * @name setNumberOfCharOfBarCode
     * @methodOf barCodeScanner.BarCodeScannerConfigProvider
     *
     * @description
     * This method allow to set the limit until we consider that a scan is trigger.
     * Default limit is 10.
     *
     * @param {number} charLengthLimit The number of min char entry for detect a scan
     */
    this.setNumberOfCharOfBarCode = function(charLengthLimit) {
        numberOfCharOfBarCode = charLengthLimit;
    };

    this.$get = function() {
        var barCodeScannerConfig = {};

        barCodeScannerConfig.getNumberOfCharOfBarCode = function() {
            return numberOfCharOfBarCode;
        };

        barCodeScannerConfig.getBroadcastEventName = function() {
            return broadcastEventName;
        };

        return barCodeScannerConfig;
    };

});

/**
 * @ngdoc directive
 * @name barCodeScanner.directive:barCodeScanner
 * @restrict A
 * @scope
 *
 * @description
 * By using this directive, you will be able to detect the scan of bar code.
 * You can set this directive on input on anything else (body, div, ...).
 * When a scan is detected, an event 'bar-code-scan-event' (or else if redefine @see config part) is broadcast on $rootscope.
 * The broadcast contain { barCodeValue : number }.
 *
 * Note: it seems to be ugly <u>but</u> we need to set a timeout of 0.5 sec. The scan work like a keyboard.
 * It send numeric char every x ms.
 *
 * @example
 *  <pre>
 *     <!-- in template -->
 *     <body data-ng-bar-code-scanner>
 *         ....
 *     </body>
 *
 *     // in controller
 *     $scope.$on('bar-code-scan-event',function(event, parameters){
 *           console.info('Scan detected, bar code is : ' , parameters.barCodeValue);
 *     }
 *   </pre>
 *
 *
 */
angular.module('barCodeScanner').directive('barCodeScanner', ['$rootScope', '$timeout', 'BarCodeScannerConfig',
    function ($rootScope, $timeout, BarCodeScannerConfig) {
    "use strict";

    return {
        restrict: 'A',
        link: function($scope, element) {
            // Ensure the element is fully load until we add the "keypress" listener
            element.ready(function(){
                var pressed = false;
                var chars = [];
                var charLimit = BarCodeScannerConfig.getNumberOfCharOfBarCode();
                var eventName = BarCodeScannerConfig.getBroadcastEventName();
                element.bind("keypress", function (event) {
                    // check the keys pressed are numbers
                    if (event.which >= 48 && event.which <= 57) {
                        // if a number is pressed we add it to the chars array
                        chars.push(String.fromCharCode(event.which));
                        // Pressed is initially set to false so we enter - this variable is here to stop us setting a
                        // timeout everytime a key is pressed. It is easy to see here that this timeout is set to give
                        // us 1 second before it resets everything back to normal. If the keypresses have not matched
                        // the checks in the readBarcodeScanner function below then this is not a barcode
                        if (pressed === false) {
                            // we set a timeout function that expires after 1 sec, once it does it clears out a list
                            // of characters
                            $timeout(function(){
                                // check we have a long length e.g. it is a barcode
                                if (chars.length >= charLimit) {
                                    // join the chars array to make a string of the barcode scanned
                                    var barcode = chars.join("");
                                    $rootScope.$broadcast(eventName,{barCodeValue:barcode});
                                }
                                chars = [];
                                pressed = false;
                            }, 500);
                        }
                        // set press to true so we do not reenter the timeout function above
                        pressed = true;
                    }
                });
            });
        }
    };
}]);
