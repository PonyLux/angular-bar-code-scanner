# angular-bar-code-scanner
<p>Provide tool to detect bar code scan and pick back the value of the bar code</h4>

<hr/>

<h3> Basic Usage </h3>
In order to use the bar code scan, you will need to include the lib:
<pre>
// In your app.js
angular.module('myApp', ['barCodeScanner']);
</pre>

Then include the directive "barCodeScanner" in your template on element (we don't really care about the type of element):
```
    <body data-bar-code-scanner>
        ...
    </body>
```

Now your application is able to detect scan. Just catch the scan event by listen the event:
```
angular.module('myApp').controller('MyController', function($scope){
    $scope.$on('bar-code-scan-event',function(event, parameters){
        console.info('Scan detected, bar code is : ' , parameters.barCodeValue);
    }
});
```

<h3> Configuration </h3>
<p> You can configure two type of things:
    <ul>
        <li>The event name broadcast by directive</li>
        <li>The number of char we use to consider that its a scan</li>
    </ul>
</p>
<p>
Example : 
</p>
```
    angular.module('myApp').config(function(BarCodeScannerConfigProvider) {
        // Now you will need to listen event 'scan'
        BarCodeScannerConfigProvider.setBroadcastEventName('scan');
        // Now you consider that bar code are make of 20 numerical char
        BarCodeScannerConfigProvider.setNumberOfCharOfBarCode(20);
    })
```