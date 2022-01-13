(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('genpropCtrl', genpropCtrl)

    genpropCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet'];

    function genpropCtrl($scope, $http, $location, $window, $filter, logdet) {

        if ($location.search().id != undefined) {
            $scope.pestype = [];
            $scope.chemuse = []
            $scope.chempest = [];
            var id = $location.search().id

            //get enquiry details
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "enquirydb"
            }).then(function success(response) {
                $scope.enqlist = response.data[0];
                //              console.log("$scope.enqlist = " + JSON.stringify($scope.enqlist.enqconame))
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                $scope.solutionlist = [];
                var txtsrch = {};
                var wssrch = []

                // wssrch =  "$or : ["

                // get pest details
                var servicearr = $scope.enqlist.enqproblemtype.split("*");

                if (servicearr.length > 0) {
                    angular.forEach(servicearr, function (servicereq) {
                        if (servicereq != "") {
                            // console.log("servicereq = " + JSON.stringify(servicereq))
                            $http.post('/getonerec', {
                                id: { pestcd: servicereq },
                                fltyp: "pestcodefl"
                            }).then(function success(response) {
                                //$scope.pestlist = response.data
                                //  console.log("servicereq  = " + JSON.stringify(response.data[0].pestdesc) + " \n\n ")
                                $scope.pestype.push(response.data[0])   //.pestdesc)

                            })

                        }
                    })

                    // get pest solution details
                    servicearr = $scope.enqlist.propsolution.split("*");
                    angular.forEach(servicearr, function (servicereq) {
                        if (servicereq != "") {
                            wssrch.push({ soltrnsno: { $eq: servicereq } },)
                        }
                    })
                    txtsrch = { $or: wssrch }
                    //     console.log("\ncol = " + JSON.stringify(txtsrch) + '\n\n')
                    $http.post('/getsolfilecrit', {
                        txtsrch,
                        fltyp: "pestsoldb"
                    }).then(function success(response) {

                        // $scope.pestsollist = response.data
                        //       console.log("\n response.data = " + JSON.stringify(response.data) + "\n")

                        if ($scope.enqlist.propsolution != undefined && $scope.enqlist.propsolution != "") {
                            var chkboxarr = $scope.enqlist.propsolution.split("*")

                            angular.forEach(response.data, function (value) {
                                //                                      console.log("$scope.solution = " + JSON.stringify(value) + "    value = " + JSON.stringify(value.soltrnsno))
                                $scope.solutionlist.push(value)
                            })
                        }

                        //get quotation
                        txtsrch = {
                            quoenqno: $scope.enqlist.enqtrnsno
                        }
                        //                     console.log("")
                        $http.post('/getfilecrit', {
                            txtsrch,
                            fltyp: "quotationdb"
                        }).then(function success(response) {
                            $scope.quolist = response.data
                            //                          console.log("$scope.quolist = " + JSON.stringify($scope.quolist))

                        })

                         $http.post('/getfile', { fltyp: "chemproductdb" })
                            .then(function success(response) {
                                $scope.chemuse = response.data
                                
                            })
                        $scope.isDisabled = true;

                        //get duration list
                        $http.post('/getfile', { fltyp: "durationdb" })
                            .then(function success(response) {
                                $scope.durlist = response.data
                            })
                        $scope.isDisabled = true;
                    })

                }
            })
        }

    } // end of genpropctrl
})();