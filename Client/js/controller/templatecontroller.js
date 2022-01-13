(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('templCtrl', templCtrl)

    templCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet'];

    function templCtrl($scope, $http, $location, $window, $filter, logdet) {
        logdet.getlog().success(function (data) {
            $scope.usname = data.name;
        }) // end of logde
        //    console.log('logdet.getlog()[1] = ' + logdet.getlog())
        //   console.log($location.search())
        $scope.wssmode = $location.search().wssmode;
        //   console.log("doing mantain")
        //  $scope.txtpdffile = [];

        $http.post('/getfile', { fltyp: "templatedb" })
            .then(function success(response) {
                $scope.templlist = response.data
            })


        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")
            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "templatedb"
            }).then(function success(response) {
                $scope.templdet = response.data[0];
                //   $scope.txtpdffile.name= $scope.templdet.Newspdf
                // $scope.templdet.Newsdate = $filter('date')(new Date($scope.templdet.Newsdate), 'd MMM yyyy')
                // console.log("date = " + $scope.templdet.Newsdate)

                // console.log("disp = " + $scope.templdet.fldcddisp + "        nsdisp = " + $scope.nsdisp)

                /*                 else{
                                    $scope.nsdisp.checked = false
                                }
                  */               //$scope.templdet.newstransno = $scope.templdet.newstransno
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("templdet = " + JSON.stringify($scope.templdet))
            })


        } else {
            $scope.templdet = {}
            $scope.isDisabled = true
        }

        $scope.searchdet = function (txtsrch) {
            //      console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //     console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "templatedb"
            }).then(function success(response) {
                $scope.templlist = response.data
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
                //  console.log("teamr = " + JSON.stringify($scope.teamrc))
            })
            //}
            // }

        }

        $scope.edit = function (id) {
            //       console.log("DOing Edit newsrc   -   " + id);
            var wssid = id;
            //$scope.templdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addtemplate#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.del = function (id) {
            console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.templdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addtemplate#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function () {
                 console.log("doing subnitdat........" + JSON.stringify($scope.templdet))
            // console.log("$scope.txtpdffile  =" + JSON.stringify($scope.txtpdffile)  + "    wsspfile =" +wsspfile);
            // $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id
            $scope.chkitms = "templatename,templatedesc"

            $scope.itmsdesc = "Template Name cannot be blank "
            $scope.itmsdesc += ",Template Details cannot be blank "
            $scope.itmstype = "1,1"
            $http.post('/checkitem', [$scope.templdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype],
                { withCredentials: true }).success(function (req, res) {
                    //      console.log("templdet=" + JSON.stringify($scope.templdet) + "   REQ = " + JSON.stringify(req) + "   REs = " + JSON.stringify(res));
                    if (req == 'ok') {
                        if ($scope.wssmode == "Add") {
                            var datarc
                            //GET RUNNing number for staff code
                            $http.get('/runno')
                                .then(function (response) {
                                    $scope.runnrc = response.data[0]
                                    $scope.templdet.templatecd = "templ" + $scope.runnrc.runtemplno
                                    $scope.runnrc.runtemplno = $scope.runnrc.runtemplno + 1
                                    console.log("$scope.runnrc = " + JSON.stringify($scope.templdet.templatecd));
                                    datarc = $scope.runnrc;
                                    $http.put('/updrunno/' + $scope.runnrc._id, {datarc})
                                        .success(function (response) {
                                            //   console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.templdet))
                                            $scope.templdet.templatecd = $filter('uppercase')($scope.templdet.templatecd)
                                            datarc = $scope.templdet
                                            // add the news details 
                                            $http.post('/addrecord', { datarc, fltyp: "templatedb" })
                                                .then(function (response) {
                                                    $scope.success = true;
                                                    $scope.errors = false;
                                                    $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                                                    $scope.templdet = {};
                                                    $window.location.href = "/addtemplate#?wssmode=Add";
                                                });
                                        });
                                });

                        } else if ($scope.wssmode == "Modify") {
                            // console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.templdet))

                            $http.put('/updrecord/' + $scope.templdet._id, { fltyp: "templatedb", datarc: $scope.templdet })
                                .success(function (response) {
                                    $scope.success = true;
                                    $scope.errors = false;
                                    $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                                    /////////raz $window.location.href = "/dispfldcd#?wssmode=Maintain"
                                })
                            //end of save record /memb/
                            /* } else {
                                //      console.log("after check = " + $scope.wssmode);
                                sessionStorage.setItem("wsstype", $scope.wssmode);
                            }// end of response == ok */

                            //} // end of maincontact

                        } else if ($scope.wssmode == "Delete") {
                            //    console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.templdet))
                            if (confirm("Are you sure you want to delete?")) {
                                // todo code for deletion
                                $http.post('/delrecord/' + $scope.templdet._id, { fltyp: "templatedb", datarc: $scope.templdet })
                                    .success(function (response) {
                                        //   console.log("response = " + JSON.stringify(response))
                                        $scope.success = true;
                                        $scope.errors = false;
                                        $scope.errmsg = [{ "param": "successmsg", "msg": "Record Deleted Successfully " }]

                                        console.log("doing deleteing")

                                        $window.location.href = "/disptemplate#?wssmode=Maintain"

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

    }


})();