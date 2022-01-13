(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('clientCtrl', clientCtrl)   //for enquiry form
        .controller('getSrc', getSrc)
        .controller('schDet', schDet)
        .controller('pastprojCtrl', pastprojCtrl);   //for enquiry form

    clientCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'memlogdet', '$timeout', 'toaster', 'maintaindata', 'runnodet'];
    getSrc.$inject = ['$scope', '$sce', '$timeout'];
    schDet.$inject = ['$scope', '$http'];
    pastprojCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'memlogdet', '$timeout', 'toaster', 'maintaindata', 'runnodet'];


    function clientCtrl($scope, $http, $location, $window, $filter, memlogdet, $timeout, toaster, maintaindata, runnodet) {
        //       console.log("doing clientctrel....")
        $scope.clname = "";
        $scope.clID = "";
        $scope.pestype = [];
        $scope.pestsollist = [];
        $scope.solutionarr = []
        var stffarr = []

        memlogdet.memgetlog().success(function (data) {
            //            console.log("data = " + JSON.stringify(data))
            $scope.clname = data.clcontactperson;
            $scope.clID = data.clcode;

            var txtsrch = {
                clcode: $scope.clID
            }

            //  console.log("txtsech = " + JSON.stringify(txtsrch))

            $http.post('/getclientcrit', {
                txtsrch,
                fltyp: "clientdb"
            }).then(function success(response) {
                $scope.cllist = response.data[0]
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';

              //  console.log("teamr = " + JSON.stringify($scope.cllist.enqdet[0].enqpropstatus))
                //              console.log("enqproblemtype = " + $scope.cllist.enqdet[0].enqproblemtype)

                var servicearr = $scope.cllist.enqdet[0].enqproblemtype.split("*");
                var solarr = $scope.cllist.enqdet[0].propsolution.split("*")
                if ($scope.cllist.enqdet[0].propsolution.split("*").length > 0) {
                    stffarr = $scope.cllist.enqdet[0].propsolution.split("*")
                } else {
                    stffarr[0] = $scope.cllist.enqdet[0].propsolution
                }
            //    console.log("propsolution = " + JSON.stringify(solarr))
                if (servicearr.length > 0) {
                    //get pest code details
                    angular.forEach(servicearr, function (servicereq) {
                        //                       console.log("servicereq = " + JSON.stringify(servicereq))
                        if (servicereq != "") {
                            $http.post('/getonerec', {
                                id: { pestcd: servicereq },
                                fltyp: "pestcodefl"
                            }).then(function success(response) {
                                //$scope.pestlist = response.data
                                //                              console.log("servicereq  = " + JSON.stringify(response.data[0]) + " \n\n ")

                                $scope.pestype.push(response.data[0])   //.pestdesc)
                            })
                        }
                    })

                    //get solution details
                    var wssrch = []
                    angular.forEach(servicearr, function (servicereq) {
                        if (servicereq != "") {
                            wssrch.push({ solpestcd: { $eq: servicereq } },)
                        }
                    })
                    //                  console.log("wssrch =  " + JSON.stringify(wssrch))
                    txtsrch = { $or: wssrch }
                    $http.post('/getsolfilecrit', {
                        txtsrch,
                        fltyp: "pestsoldb"
                    }).then(function success(response) {
                        //                         console.log("\n response pestsoldb = " + JSON.stringify(response) + "\n")

                        $scope.pestsollist = response.data
                        /*                        if ($scope.enqlist.propsolution != undefined && $scope.enqlist.propsolution != "") {
                                                   var chkboxarr = $scope.enqlist.propsolution.split("*")
                                                   //  } */
                        angular.forEach(solarr, function (value, key) {
                            //  console.log("solarr = " + JSON.stringify(value))// + "    value = " + JSON.stringify(value.soltrnsno))

                            angular.forEach($scope.pestsollist, function (solvalue) {
                                //  console.log("$scope.pestsollist = " + JSON.stringify(solvalue.soltrnsno) + "    value = " + JSON.stringify(value))
                                if (JSON.stringify(value) == JSON.stringify(solvalue.soltrnsno)) {
                                    $scope.solutionarr.push(solvalue)
                                }
                            })
                        })

                        //get staff details
                        $http.post('/getfile', { fltyp: "Staffdb" })
                            .then(function success(response) {
                                $scope.stafflist = response.data
                              //  console.log("Staff = " + JSON.stringify($scope.stafflist))
                            })
                      //  })

                        // } 
                        // .push(JSON.stringify(response.data))
                        $scope.isDisabled = true;

                        //  $scope.cont = 'ok';

                        //  console.log("\n$scope.pestsolution = " + JSON.stringify(response.data[0]) + "\n\n")
                        //  $scope.pestsolution.push(response.data)
                        //                            console.log(" '\n'  $scope.pestsollist = " + JSON.stringify($scope.pestsollist) + "'\n'")

                    }) // end of /getsolfilecrit'



                }

            })

        }) // end of logdet




   // } // end of clientctrl
 
        $scope.submitdat = function () {
            $scope.clientdet = {}
         //   console.log("$scope.cllist =  " + JSON.stringify($scope.cllist))

            $scope.chkitms = "clcontactperson,claddress,clcontactno,clemail"
            $scope.itmsdesc = "Please Enter Your Name "
            $scope.itmsdesc += ",Please Enter Your Address "
            $scope.itmsdesc += ",Please Enter Your contact Number "
            $scope.itmsdesc += ",Please Enter Your Email Address "

            $scope.itmstype = "1,1,1,1"

            $scope.clientdet._id = $scope.cllist._id
            $scope.clientdet.clconame = $scope.cllist.clconame
            $scope.clientdet.claddress = $scope.cllist.claddress
            $scope.clientdet.clcontactperson = $scope.cllist.clcontactperson
            $scope.clientdet.clcontactno = $scope.cllist.clcontactno
            $scope.clientdet.clemail = $scope.cllist.clemail
         //   console.log("$scope.clientdet =  " + JSON.stringify($scope.clientdet))

            maintaindata.maintrec($scope.cllist, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                    runnodet.modrec($scope.clientdet, "clientdb", "/clienthome")

                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }
            }) //  end of mainaindata
        }
    } // end of clientctrl
    function getSrc($scope, $sce, $timeout) {

        $scope.getschframe = function (transno) {
            // schService.setCde(transno);
            // sessionStorage.setItem("schcode", transno);
            //;   $scope.schcode = sessionStorage.getItem("schcode")
        //    console.log("tansno = " + transno)
            $scope.broadcast = function () {
                $scope.$broadcast('schiiframe', transno);
            };

            $timeout(function () {
                $scope.$broadcast('schiiframe', transno);
            }, 1000);

            /* $scope.schdethtml = { src: "/public/sch/schiframe.html" };
            //  $scope.schdethtml = { src: "/public/sch/schiframe.html#?index=" + $scope.schcode };
            // $scope.schdethtml = "/public/sch/schiframe.html#?index=" + $scope.schcode ;
            //  console.log(" $scope.schdethtml = " + JSON.stringify( $scope.schdethtml));
            document.getElementById("schframe").src = $sce.trustAsResourceUrl($scope.schdethtml.src);
            document.getElementById("schframe").contentWindow.location.reload(true); */

            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            }
            //  console.log(" $scope.gtrcode from tleague = " + $stateParams.mainid);
            $scope.schdethtml = { src: "/schiframe" };

        }

    }

    function schDet($scope, $http) {

        //  console.log("doingf schdet......")

        $scope.$parentOn('schiiframe', function (e, message) {
            //  $scope.fldcd.push(message);\

            $scope.fldcd = message
            //});
            $http.post('/getonerec', {
                id: { _id: $scope.fldcd },
                fltyp: "scheduledb"
            }).then(function success(response) {
                //     schtransno: $scope.fldcd
                // }).success(function (response) {
                $scope.schdet = response.data[0]
             //   console.log("schdet = " + JSON.stringify($scope.schdet));
                var txtsrch = {}
                $scope.staffarr = []
                if ($scope.schdet.schpersonnel != undefined) {
                    var personarr = $scope.schdet.schpersonnel.split("*")
                    //   console.log("personarr  = " + personarr.length)
                    if (personarr.length > 0) {
                        //    console.log("personarr  = " + personarr.count)
                        angular.forEach(personarr, function (staffrec) {
                            txtsrch = {
                                UsStaffcd: staffrec,
                            }
                         //   console.log("txtsrch = " + JSON.stringify(txtsrch))
                            $http.post('/getfilecrit', {
                                txtsrch,
                                fltyp: "Staffdb"
                            }).then(function success(response) {
                                $scope.stafflist = response.data
                                $scope.isDisabled = true;
                                //  $scope.cont = 'ok';
                                $scope.staffarr.push($scope.stafflist[0].UsStaffname)
                             //   console.log("$scope.staffarr = " + JSON.stringify($scope.staffarr) + "       $scope.stafflist.UsStaffname = " + JSON.stringify($scope.stafflist[0].UsStaffname))

                            })
                            //                            console.log("$scope.staffarr = " + JSON.stringify($scope.staffarr))



                        })
                    } else {
                     //   console.log("personarr less 1  = " + personarr.count + "       $scope.schdet.schpersonnel = " + JSON.stringify($scope.schdet.schpersonnel))
                        txtsrch = {
                            UsStaffcd: $scope.schdet.schpersonnel
                        }
                        $http.post('/getfilecrit', {
                            txtsrch,
                            fltyp: "Staffdb"
                        }).then(function success(response) {
                            $scope.stafflist = response.data
                            $scope.isDisabled = true;
                            //  $scope.cont = 'ok';
                          //  console.log("$scope.stafflist = " + JSON.stringify($scope.stafflist))
                            $scope.staffarr.push($scope.stafflist.UsStaffname)
                           // console.log("$scope.staffarr for 1 = " + JSON.stringify($scope.staffarr) + "       $scope.stafflist.UsStaffname = " + JSON.stringify($scope.stafflist.UsStaffname))

                        })
                    }
                }
                // forEach

                // }).error(function (ermsg) {
                //     //           console.log("error ")
            })
            // }
            //$scope.messages.push(message);
            // console.log("iframe =  " + JSON.stringify(message))
        });



    }


    function pastprojCtrl($scope, $http, $location, $window, $filter, memlogdet, $timeout, toaster, maintaindata, runnodet) {
        //       console.log("doing clientctrel....")
        $scope.clname = "";
        $scope.clID = "";
        $scope.pestype = [];
        $scope.pestsollist = [];
        $scope.solutionarr = []
        var stffarr = []
        memlogdet.memgetlog().success(function (data) {
            //            console.log("data = " + JSON.stringify(data))
            $scope.clname = data.clcontactperson;
            $scope.clID = data.clcode;
            // $scope.pastlist = {};
            var txtsrch = {
                enqclientcd: $scope.clID,
                enqpropstatus: "C"
            }

            //  console.log("txtsech = " + JSON.stringify(txtsrch))

            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "enquirydb"
            }).then(function success(response) {
                $scope.pastlist = response.data

                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
              //  console.log("$scope.pastlist = " + JSON.stringify($scope.pastlist))
            }) // end of /getsolfilecrit'

        }) // end of logdet


    }; // end of past proj ctrl


})();


