(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('projectCtrl', projectCtrl)    //for enquiry form
        .controller('projscheduleCtrl', projscheduleCtrl);  // for proposal form


    projectCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'getfldesc', 'logdet', '$timeout', 'toaster'];
    projscheduleCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet', '$timeout', 'toaster'];
 
    function projectCtrl($scope, $http, $location, $window, $filter, getfldesc, logdet, $timeout, toaster) {
      //.log("$location.search() getschdispcrit = " + JSON.stringify($location.search()))
        $scope.stcode = ""

        $scope.wssmode = $location.search().wssmode;
        if ($location.search().wssmode == 'wv') {

            logdet.getlog().success(function (data) {
                $scope.stcode = data.UsStaffcd
              //  console.log("D$scope.stcode =  " + $scope.stcode)
                var txtsrch = {

                   schpersonnel: { $regex: $scope.stcode, $options: 'i'}
                }

                $http.post('/getschdispcrit', {
                    txtsrch,
                    fltyp: "scheduledb"
                }).then(function success(response) {
                    $scope.schlist = response.data
                    $scope.isDisabled = true;
                    //  $scope.cont = 'ok';
                 //   console.log("teamr = " + JSON.stringify($scope.schlist))
                })
            })
        } else {
            var txtsrch = {
                enqpropstatus: "A"
            }

            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "enquirydb"
            }).then(function success(response) {
                $scope.enqlist = response.data
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
                //  console.log("teamr = " + JSON.stringify($scope.teamrc))
            })
        }

        $http.post('/getfile', { fltyp: "scheduledb" })
            .then(function success(response) {
                $scope.schedulelist = response.data
            });

        $scope.Scheadd = function (id) {
            $window.location.href = "/addschedule#?wssmode=Add" + "&id=" + id;
        }

        $scope.Scheclose = function (id) {
            $scope.enqdet = {}
            $scope.enqdet._id = id
            $scope.enqdet.enqpropsdatcompl = new Date()
            $scope.enqdet.enqpropstatus = "C"

        //    console.log("$scope.enqlist = " + JSON.stringify($scope.enqdet) )

            $http.put('/updrecord/' + $scope.enqdet._id, { fltyp: "enquirydb", datarc: $scope.enqdet })
                                .success(function (response) {
                                    $scope.success = true;
                                    $scope.errors = false;
                                    $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                                    toaster.success('success', "Project Closed successful");

                                    $timeout(function () {
                                        $window.location.href = "/dispschedule#?wssmode=Maintain"
                                    }, 2000);


                                })
           // $window.location.href = "/addschedule#?wssmode=Add" + "&id=" + id;
        }

        $scope.schsearchdet = function (txtsrch) {
            //  console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //        console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "enquirydb"
            }).then(function success(response) {
                $scope.enqlist = response.data
                $scope.isDisabled = true;
                txtsrch = {}
                //  $scope.cont = 'ok';
                //  console.log("teamr = " + JSON.stringify($scope.teamrc))
            })

        }

        $scope.schedit = function (id) {
            //      console.log("DOing Edit newsrc   -   " + id);
            // var wssid = id;
            //$scope.durdet = id;
            // console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addschedule#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.schupdate = function (id,wvtype) {
               //   console.log("DOing Edit wvtype  -   " + wvtype);
            // var wssid = id;
            //$scope.durdet = id;
            // console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            if (wvtype !== undefined){
            $window.location.href = "/wvupdschedule#?wssmode=Modify" + "&id=" + id +"&wvtype=wv";
            }else{
                $window.location.href = "/updschedule#?wssmode=Modify" + "&id=" + id 
            }
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.schdel = function (id) {
            //        console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.durdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addschedule#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
    } //end ofg projectCtrl


    function projscheduleCtrl($scope, $http, $location, $window, $filter, logdet, $timeout, toaster) {
      //  console.log("$location.search() getschdispcrit = " + JSON.stringify($location.search()))
        $scope.wssmode = $location.search().wssmode;
        $scope.wvtype  = $location.search().wvtype
        $scope.schdet = {};
        $scope.staffsel = []
        $scope.staffselname = []
        var txtsrch = ""

        var id = $location.search().id

        $http.post('/getfile', { fltyp: "Staffdb" })
            .then(function success(response) {
                $scope.stafflist = response.data
                // get selected pest for proposal
            });

        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {

            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "scheduledb"
            }).then(function success(response) {
                $scope.schdet = response.data[0];
                $scope.isDisabled = true;
                $scope.cont = 'ok';

                txtsrch = {
                    id: { projtrnsno: $scope.schdet.schprojno },
                    fltyp: "enquirydb"
                }
                getenquirydet(txtsrch)
                $scope.staffsel = []
                $scope.staffselname = []
             //   console.log("$scope.schdet.schpersonnel = " + $scope.schdet.schpersonnel)
                if ($scope.schdet.schpersonnel != undefined && $scope.schdet.schpersonnel != "") {
                    $scope.staffsel = $scope.schdet.schpersonnel.split("*")
                    // $scope.staffsel = $scope.staffsel.pop()
                    console.log("$scope.staffsel = " + $scope.staffsel[0])

                }
              //  console.log("$scope.staffsel = " + $scope.staffsel + "       $scope.staffsel.length = " + $scope.staffsel.length)

                /*  if ($scope.schdet.schpersonnel != undefined && $scope.schdet.schpersonnel != "" && $scope.staffsel.length == 1) {
                     console.log("$scope.schdet.schpersonnel = " + $scope.schdet.schpersonnel)
                     $scope.staffsel.push($scope.schdet.schpersonnel)
                 } */ /* else { */
                for (var i = 0; i < $scope.staffsel.length; i++) {
                    angular.forEach($scope.stafflist, function (key, value) {
                        //  console.log("key = " + JSON.stringify($scope.stafflist[value].UsStaffcd) + "     $scope.staffsel[" + i + "] = " + $scope.staffsel[i])
                        if ($scope.stafflist[value].UsStaffcd == $scope.staffsel[i]) {
                            $scope.staffselname.push($scope.stafflist[value].UsStaffname)
                        }
                    })
                    /* } */
                }
                //  console.log("$scope.staffsel = " + JSON.stringify($scope.staffsel) + "     \n $scope.staffselname = " + JSON.stringify($scope.staffselname))

            })

        } else {
            txtsrch = {
                id: { _id: $location.search().id },
                fltyp: "enquirydb"
            }
            getenquirydet(txtsrch);
        }

        function getenquirydet(wsscrit) {
            //     console.log(" wsscrit = " + JSON.stringify(wsscrit))
            $scope.enqlist = {}
            $scope.isDisabled = true
            $http.post('/getonerec', wsscrit
            ).then(function success(response) {
                $scope.enqlist = response.data[0];
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("\n $scope.enqlist = " + JSON.stringify($scope.enqlist) + "\n")

                //get solution details
                //  console.log("\n $scope.enqlist = " + JSON.stringify($scope.enqlist) + "\n")
                var servicearr = $scope.enqlist.propsolution.split("*");
                var wssrch = [];
                var txtsrch
                angular.forEach(servicearr, function (servicereq) {
                    if (servicereq != "") {
                        wssrch.push({ soltrnsno: { $eq: servicereq } },)
                    }
                })
                txtsrch = { $or: wssrch }
                //     console.log(" txtsrch = " + JSON.stringify(txtsrch))
                $http.post('/getsolfilecrit', {
                    txtsrch,
                    fltyp: "pestsoldb"
                }).then(function success(response) {
                    //       console.log("\n response = " + JSON.stringify(response) + "\n")

                    $scope.pestsollist = response.data
                    $scope.isDisabled = true;

                })
                // end of get solution details
            })

        } // end of get enquiry detail

        $scope.addperson = function () {
            //  console.log("$scope.schdet.schpersonnel = " + JSON.stringify($scope.schdet.schpersonnel))
            if ($scope.schdet.schpersonnel != undefined) {
                //     $scope.schdet.schpersonnel.UsStaffcd = []
                //     $scope.schdet.schpersonnel.UsStaffname = []
                // }
              //  console.log("index of  " + JSON.stringify($scope.staffsel) + " - " + JSON.stringify($scope.schdet.schpersonnel.UsStaffcd) + "  = " + $scope.staffsel.indexOf($scope.schdet.schpersonnel.UsStaffcd))
                if ($scope.staffsel.indexOf($scope.schdet.schpersonnel.UsStaffcd) == -1) {
                    // $scope.staffsel != []) {
                    // if ($scope.bdays.indexOf($scope.quodet))
                    $scope.staffsel.push($scope.schdet.schpersonnel.UsStaffcd)
                    $scope.staffselname.push($scope.schdet.schpersonnel.UsStaffname)

                  //  console.log(" $scope.staffselname = " + JSON.stringify($scope.staffselname))

                } else {
                    //   $scope.staffsel.push($scope.schdet.schpersonnel)
                    alert("Already exist" + $scope.schdet.schpersonnel.UsStaffname)
                }


            }
        }
        $scope.delperson = function (wssperson) {
            var index = $scope.staffselname.indexOf(wssperson);
            $scope.staffsel.splice(index, 1);
            $scope.staffselname.splice(index, 1);

          //  console.log("       \nwssperson = " + wssperson + JSON.stringify($scope.staffsel) + "       \nwsspersonname = " + JSON.stringify($scope.staffselname))
        }

        $scope.submitdat = function () {
            //   console.log("doing subnitdat........" + id)
            //    console.log("_id  =" + JSON.stringify($location.search()));
            //  $scope.enqlist.propprojschedule = "";

            $scope.schdet.schpersonnel = "";
            console.log("$scope.staffsel.length = " + $scope.staffsel.length)
            for (var i = 0; i < $scope.staffsel.length; i++) {
                $scope.schdet.schpersonnel += $scope.staffsel[i] + "*"
            }
            $scope.schdet.schpersonnel = $scope.schdet.schpersonnel.slice(0, $scope.schdet.schpersonnel.length - 1)


            //    console.log("schdet. after = " + JSON.stringify($scope.schdet))

          //  console.log("$scope.schdet = " + JSON.stringify($scope.schdet.schpersonnel) + "   -  " + JSON.stringify($scope.staffsel))

            $scope.chkitms = "schdatest,schcompldate,schdesc,schpersonnel"

            $scope.itmsdesc = "start date cannot  be blank "
            $scope.itmsdesc += ",completed date cannot be blank "
            $scope.itmsdesc += ",Description of work to do cannot  be blank "
            $scope.itmsdesc += ",personnel  cannot be blank "

            $scope.itmstype = "1,1,1,1"

            $http.post('/checkitem', [$scope.schdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype],
                { withCredentials: true }).success(function (req, res) {
                    //  console.log("enqlist.projtrnsno =" + JSON.stringify($scope.enqlist.projtrnsno)); // + "   REQ = " + JSON.stringify(req) + "   REs = " + JSON.stringify(res));
                    if (req == 'ok') {
                        if ($scope.wssmode == "Add") {
                            var datarc
                            //GET RUNNing number for staff code
                            $http.get('/runno')
                                .then(function (response) {
                                    $scope.runnrc = response.data[0]
                                    $scope.schdet.schtrnsno = "SCH" + $scope.runnrc.runschno
                                    $scope.runnrc.runschno = $scope.runnrc.runschno + 1
                                    datarc = $scope.runnrc;
                                    $http.put('/updrunno/' + $scope.runnrc._id, { datarc })
                                        .success(function (response) {
                                            //   console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.schdet))
                                            $scope.schdet.schtrnsno = $filter('uppercase')($scope.schdet.schtrnsno)
                                            $scope.schdet.schprojno = $scope.enqlist.projtrnsno
                                            datarc = $scope.schdet
                                            // add the news details 
                                            $http.post('/addrecord', { datarc, fltyp: "scheduledb" })
                                                .then(function (response) {
                                                    $scope.success = true;
                                                    $scope.errors = false;
                                                    $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                                                    $scope.schdet = {};
                                                    toaster.success('success', "Job Schedule Added successful");

                                                    $timeout(function () {
                                                        $window.location.href = "/addschedule#?wssmode=Add";
                                                    }, 2000);
                                                });
                                        });
                                });

                        } else if ($scope.wssmode == "Modify") {
                            //  console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.schdet))

                            $http.put('/updrecord/' + $scope.schdet._id, { fltyp: "scheduledb", datarc: $scope.schdet })
                                .success(function (response) {
                                    $scope.success = true;
                                    $scope.errors = false;
                                    $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                                    toaster.success('success', "Record Updated successful");

                                    $timeout(function () {
                                        $window.location.href = "/dispschedule#?wssmode=Maintain"
                                    }, 2000);


                                })
                            //end of save record /memb/
                            /* } else {
                                //      console.log("after check = " + $scope.wssmode);
                                sessionStorage.setItem("wsstype", $scope.wssmode);
                            }// end of response == ok */

                            //} // end of maincontact

                        } else if ($scope.wssmode == "Delete") {
                            //    console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.schdet))
                            if (confirm("Are you sure you want to delete?")) {
                                // todo code for deletion
                                $http.post('/delrecord/' + $scope.schdet._id, { fltyp: "scheduledb", datarc: $scope.schdet })
                                    .success(function (response) {
                                        //   console.log("response = " + JSON.stringify(response))
                                        $scope.success = true;
                                        $scope.errors = false;
                                        $scope.errmsg = [{ "param": "successmsg", "msg": "Record Deleted Successfully " }]

                                        //  +.log("doing deleteing")
                                        toaster.success('success', "Record Deleted successful");

                                        // $timeout(function () {
                                        //     $window.location.href = "/dispschedule#?wssmode=Maintain"
                                        // }, 2000);

                                    })

                            }
                        } // end opf check item
                    } else { //if not ok
                        //var wssmsg = req[1];
                        //alert("error with modify")
                        $scope.success = false;
                        $scope.errors = true
                        $scope.errmsg = req[1]
                        //  console.log("if npot ok = " + JSON.stringify(id) + "   REQ = " + JSON.stringify($scope.errmsg))

                        //  $window.location.href = "/addfldtype#?wssmode=Add" + "&id=" + id;
                    }
                }) // end of checkitem
        } // end of maincontact

        $scope.submitrptdat = function () {
            logdet.getlog().success(function (data) {
                console.log("data = " + JSON.stringify(data.UsStaffcd))
                $scope.schdet.schrptby = data.UsStaffcd;

                console.log("$scope.schdet.schrptby = " + $scope.schdet.schrptby)
                $scope.schdet.schrptdt = new Date()

                $http.put('/updrecord/' + $scope.schdet._id, { fltyp: "scheduledb", datarc: $scope.schdet })
                    .success(function (response) {
                        $scope.success = true;
                        $scope.errors = false;
                        $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                        toaster.success('success', "Record Updated successful");

                        //  $timeout(function () {
                        //      $window.location.href = "/dispschedule#?wssmode=Update"
                        //  }, 2000);


                    })
            })


        }



    }

     //  }


})();





