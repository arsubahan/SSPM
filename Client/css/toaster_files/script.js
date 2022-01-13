angular.module('main', ['toaster'])

.controller('myController', function($scope, toaster) {

    $scope.pop = function(){
        toaster.pop('success', "success", "text");
        toaster.pop('error', "error", "text");
        toaster.pop('warning', "warning", "text");
        toaster.pop('note', "note", "text");
    };
});
 
