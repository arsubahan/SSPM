(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('quoteCtrl', quoteCtrl);  // for proposal form


    quoteCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'toaster', '$timeout', 'runnodet', 'maintaindata'];

    function quoteCtrl($scope, $http, $location, $window, $filter, toaster, $timeout, runnodet, maintaindata) {
        //   console.log("doing quotation")
        $scope.quodet = {}
        $scope.quotearr = []
        $scope.editype = "+ Add";
        var wsseq = 1
        //   var id = $location.search().id
        $http.post('/getonerec', {
            id: { _id: $location.search().id },
            fltyp: "enquirydb"
        }).then(function success(response) {
            $scope.enqlist = response.data[0];
            // console.log("$scope.quolist = " + JSON.stringify(response.data))

            // get quotation file for existing quotes
            //get quotation
            var txtsrch = {
                quoenqno: $scope.enqlist.enqtrnsno
            }
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "quotationdb"
            }).then(function success(response) {
                $scope.quotearr = response.data
                wsseq = $scope.quotearr.length
                //   console.log("$scope.quolist = " + JSON.stringify( $scope.quotearr))
            }) //end of get quotataion
        })

        // get pest list
        $http.post('/getfile', { fltyp: "durationdb" })
            .then(function success(response) {
                $scope.durlist = response.data
            })

        $scope.editquote = function (wssid) {
          //  console.log("wssid = " + JSON.stringify(wssid))
            $scope.quodet = wssid
            $scope.editype = "Edit"
        }

        $scope.delquote = function (wssid) {
         //   console.log("delquote $scope.quodet= " + JSON.stringify($scope.quodet))
            $scope.quodet = wssid
            if (confirm("Are you sure you want to delete?")) {
                // todo code for deletion
                if ($scope.quodet._id != undefined)
                    $http.post('/delrecord/' + $scope.quodet._id, { fltyp: "quotationdb", datarc: $scope.quodet })
                        .success(function (response) {
                            //   console.log("response = " + JSON.stringify(response))
                            $scope.success = true;
                            $scope.errors = false;
                            $scope.errmsg = [{ "param": "successmsg", "msg": "Record Deleted Successfully " }]
                        })
                var index = $scope.quotearr.indexOf($scope.quodet);
                $scope.quotearr.splice(index, 1);

                $scope.quodet = {};
                //   console.log("doing deleteing")

                // $window.location.href = "/dispenquire#?wssmode=Maintain

            }
        }

        $scope.updquote = function () {
            if ($scope.quodet.quodesc != "") {
                if ($scope.quodet.quodesc != undefined && $scope.editype != "Edit") {    //$scope.quodet._id == undefined &&
                    // alert(JSON.stringify($scope.quodet.quoseq + "  push   -   " + $scope.quodet._id + "     -   " + $scope.quodet.quodesc))
                    $scope.quotearr.push($scope.quodet)
                }
                $scope.quodet = {};
                $scope.editype = "+ Add";
            } //console.log("quotearr = " + JSON.stringify($scope.quotearr))
        }

        $scope.submitdat = function () {
          //  console.log("$scope.quotearr  = " + JSON.stringify($scope.quotearr ))
            if ($scope.quotearr != []) {
                //GET RUNNing number for staff code
             //   console.log("doing update....")
                runnodet.getrundet("runquono").then(function (data1) {
                    $scope.quodet.quotrnsno = $filter('uppercase')("QUO" + data1)
                    console.log("$scope.quodet.quotrnsno = " + $scope.quodet.quotrnsno)
                    angular.forEach($scope.quotearr, function (wssquotedet) {
                        if (wssquotedet._id == undefined) {
                            wssquotedet.quoenqno = $scope.enqlist.enqtrnsno
                            wssquotedet.quotrnsno = $scope.quodet.quotrnsno
                            wssquotedet.quodate = new Date()
                            wssquotedet.quoseq = wsseq
                            wsseq += 1

                            // datarc = wssquotedet

                         //   console.log("\nquotedet = " + JSON.stringify(wssquotedet) + "/n     wssquotedet._id = ") // + wssquotedet._id)

                            runnodet.addrec(wssquotedet, "quotationdb", "")

                        } else {
                            runnodet.modrec(wssquotedet, "quotationdb", "/dispchemp#?wssmode=Maintain")
                        }
                        toaster.success('success', "Record Updated successful");
                        $timeout(function () {
                            $window.location.href = "/proposal#?wssmode=Modify" + "&id=" + $scope.enqlist._id;
                        }, 2000);


                    }) // end of for each

                }) // getrundet

            }
        }

    } // end of quotectrl


})();
