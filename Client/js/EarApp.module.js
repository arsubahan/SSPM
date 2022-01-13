
(function () {
  'use strict';
  // angular.module('kapp', ['Main', 'public', 'ngStorage', 'angularUtils.directives.dirPagination'])
  angular.module('ermsapp', ['ui.bootstrap', 'ngStorage', 'angularUtils.directives.dirPagination',
    'ui.bootstrap.datepicker', 'ngPrint', "ngSanitize", 'textAngular', 'toaster']) //,'ngAnimate'])
    .controller('myfirstcontroller', myfirstcontroller)
    .controller('dashCtrl', dashCtrl)
    .controller('AppCtrl', AppCtrl);
  // .config(config);

  myfirstcontroller.$inject = ['$scope', '$timeout', '$rootScope', '$window'];
  dashCtrl.$inject = ['$scope', 'logdet'];
  AppCtrl.$inject = ['$scope', '$window','$timeout', 'toaster'];
  // config.$inject = ['$urlRouterProvider'];

  /*  function config($urlRouterProvider) {
     // If user goes to a path that doesn't exist, redirect to public root
     $urlRouterProvider.otherwise('/home');
   } */

  function myfirstcontroller($scope, $timeout, $rootScope, $window) {
    $scope.wssdate = new Date();
    /* if ($window.sessionStorage.getItem("trcode") != undefined) {
      $window.sessionStorage.clear();
    } */

    $rootScope.datePickerOpen = function (id) {
      $timeout(function () {
        $("#" + id).focus();
      });
    };
    //} 
  };

  function dashCtrl($scope, logdet) {
    logdet.getlog().success(function (data) {
      // console.log("data = " + JSON.stringify(data.UsLoginid))
      $scope.usname = data.UsStaffname;
      $scope.uslogin = data.UsStaffcd;
      $scope.uslevel = data.Uslevel.split("-")
      // $scope.uslvlstr = 
    }) // end of logdet
  } // end of dashctrl

  function AppCtrl($scope, $window, $timeout, toaster) {
    console.log("doing app cvrl")
   // var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    $scope.startdw =  function(){
    toaster.success('success', "Downloading Your App....please wait ");
    $timeout(function () {
      //  $window.location.href = '/clienthome'
      $window.location.href =  '/download/sspm.apk'
    }, 2000);
  }
  // $window.location.href = '/download/erms.apk'
    
    // if (isMobile) {
    //   /* your code here */
    //   console.log("isMobile = " + isMobile)
    //   fileUpload.uploadFileToUrl($scope.txtnewspic, '/uploadnews');
    // } else {
    //   console.log("not mobilr")
    // }
   /*  $scope.uploadFile = function () {
      console.log("path = " + $scope.myFile.filename)
      var file = $scope.myFile;
      console.log($scope.myFile)
      // var uploadUrl = "/savedata";
      fileUpload.uploadFileToUrl(file, "/savedata", "wssurl");

    }; */





  }



})();