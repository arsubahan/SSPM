(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('emailCtrl', emailCtrl)
        
    emailCtrl.$inject = ['$scope', '$http', '$window', '$location', '$parse'];
 
    function emailCtrl($scope, $http, $window, $location, $parse) {

//   Simple POST request example (passing data) :
    $http.post('/contact-form', data).
        success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
           // console.log("from mmsapp httpost data =" + data.contactName);
            $window.alert('Thanks for your message ' + data.contactName + ' we will get back to you soon'); 
            //    $Toast.simple('Thanks for your message ' + data.contactName + ' You Rock!')
            //        .content('Thanks for your message ' + data.contactName + ' You Rock!')
            //        .position($scope.getToastPosition())
            //        .hideDelay(5000)
            //);

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

})();