(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('occCtrl', occCtrl)

    occCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet', '$timeout', 'toaster', 'maintaindata', 'runnodet'];

    function occCtrl($scope, $http, $location, $window, $filter, logdet, $timeout, toaster, maintaindata, runnodet) {

        logdet.getlog().success(function (data) {
            $scope.usname = data.name;
        }) // end of logde
        //    console.log('logdet.getlog()[1] = ' + logdet.getlog())
        //   console.log($location.search())
        $scope.wssmode = $location.search().wssmode;
        //   console.log("doing mantain")
        //  $scope.txtpdffile = [];

        $http.post('/getfile', { fltyp: "occupationdb" })
            .then(function success(response) {
                $scope.occlist = response.data
            })


        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")
            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "occupationdb"
            }).then(function success(response) {
                $scope.occdet = response.data[0];
                //   $scope.txtpdffile.name= $scope.occdet.Newspdf
                // $scope.occdet.Newsdate = $filter('date')(new Date($scope.occdet.Newsdate), 'd MMM yyyy')
                // console.log("date = " + $scope.occdet.Newsdate)

                // console.log("disp = " + $scope.occdet.fldcddisp + "        nsdisp = " + $scope.nsdisp)

                /*                 else{
                                    $scope.nsdisp.checked = false
                                }
                  */               //$scope.occdet.newstransno = $scope.occdet.newstransno
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("occdet = " + JSON.stringify($scope.occdet))
            })


        } else {
            $scope.occdet = {}
            $scope.isDisabled = true
        }

        $scope.searchdet = function (txtsrch) {
            //      console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //     console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "occupationdb"
            }).then(function success(response) {
                $scope.occlist = response.data
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
            //$scope.occdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addoccupation#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.del = function (id) {
            //console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.occdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addoccupation#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function () {
            //     console.log("doing subnitdat........" + id)
            // console.log("$scope.txtpdffile  =" + JSON.stringify($scope.txtpdffile)  + "    wsspfile =" +wsspfile);
            // $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id
            $scope.chkitms = "occupationDesc"

            $scope.itmsdesc = "Description cannot be blank "
            $scope.itmstype = "1"

            maintaindata.maintrec($scope.occdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                 //   console.log("doing update....")
                    if ($scope.wssmode == "Add") {
                        runnodet.getrundet("runoccno").then(function (data1) {
                            $scope.occdet.occupationcd  = $filter('uppercase')("OCC" + data1)
                         //   console.log("$scope.occdet = " + $scope.occdet.chempcode)
                            runnodet.addrec($scope.occdet, "occupationdb","/addoccupation#?wssmode=Add")
                        })
                    } else if ($scope.wssmode == "Modify") {
                        runnodet.modrec($scope.occdet, "occupationdb", "/dispoccupation#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.occdet, "occupationdb", "/dispoccupation#?wssmode=Maintain" )
                    }
                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }
            }) //  end of mainaindata
        } // end of maincontact
    }


})();