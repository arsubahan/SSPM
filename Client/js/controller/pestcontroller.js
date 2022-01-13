(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('pestCtrl', pestCtrl)
        .controller('pestsolCtrl', pestsolCtrl);

    pestCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet', '$timeout', 'toaster', 'maintaindata', 'runnodet'];
    pestsolCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet', '$timeout', 'toaster', 'maintaindata', 'runnodet'];

    function pestCtrl($scope, $http, $location, $window, $filter, logdet, $timeout, toaster, maintaindata, runnodet) {
        logdet.getlog().success(function (data) {
            $scope.usname = data.name;
        }) // end of logde
        //    console.log('logdet.getlog()[1] = ' + logdet.getlog())
        //   console.log($location.search())
        $scope.wssmode = $location.search().wssmode;
        //   console.log("doing mantain")
        //  $scope.txtpdffile = [];

        $http.post('/getfile', { fltyp: "pestcodefl" })
            .then(function success(response) {
                $scope.pestlist = response.data
            })

        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")

            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "pestcodefl"
            }).then(function success(response) {
                $scope.pestdet = response.data[0];
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("pestdet = " + JSON.stringify($scope.pestdet))
            })


        } else {
            $scope.pestdet = {}
            $scope.isDisabled = true
        }

        $scope.searchdet = function (txtsrch) {
            //      console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //     console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "pestcodefl"
            }).then(function success(response) {
                $scope.pestlist = response.data
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
            //$scope.pestdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addpestcode#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.del = function (id) {
          //  console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.pestdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addpestcode#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function () {
            //     console.log("doing subnitdat........" + id)
            // console.log("$scope.txtpdffile  =" + JSON.stringify($scope.txtpdffile)  + "    wsspfile =" +wsspfile);
            // $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id
            $scope.chkitms = "pestdesc,"

            $scope.itmsdesc = "Description cannot be blank "
            $scope.itmstype = "1,"

            maintaindata.maintrec($scope.pestdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                   // console.log("doing update....")
                    if ($scope.wssmode == "Add") {
                        runnodet.getrundet("runpestno").then(function (data1) {
                            $scope.pestdet.pestcd = $filter('uppercase')( "PEST" + data1)
                          //  console.log("$scope.pestdet.pestcd = " + $scope.pestdet.pestcd)
                            runnodet.addrec($scope.pestdet, "pestcodefl","/addpestcode#?wssmode=Add")
                        })
                    } else if ($scope.wssmode == "Modify") {
                        runnodet.modrec($scope.pestdet, "pestcodefl","/disppestcode#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.pestdet, "pestcodefl","/disppestcode#?wssmode=Maintain")
                    }
                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }
            }) //  end of mainaindata
 
        } // end of maincontact

    }

    function pestsolCtrl($scope, $http, $location, $window, $filter, logdet, $timeout, toaster, maintaindata, runnodet) {
        $scope.wssmode = $location.search().wssmode;
        $scope.soldet = {};

        $http.post("/getpestsol")
            .then(function success(response) {
                $scope.pestsollist = response.data
                //  console.log("$scope.pestsollist = " + JSON.stringify($scope.pestsollist))
            })

        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")

            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "pestsoldb"
            }).then(function success(response) {
                $scope.soldet = response.data[0];
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("pestdet = " + JSON.stringify($scope.pestdet))
            })


        } else {
            $scope.pestdet = {}
            $scope.isDisabled = true
        }

        $scope.solsearchdet = function (txtsrch) {
         //   console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
         //   console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getsolfilecrit', {
                txtsrch,
                fltyp: "pestsoldb"
            }).then(function success(response) {
                $scope.pestsollist = response.data
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
                //  console.log("teamr = " + JSON.stringify($scope.teamrc))
            })

        }

        $scope.soledit = function (id) {
           // console.log("DOing Edit newsrc   -   " + id);
            // var wssid = id;
            //$scope.pestdet = id;
            // console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addsolution#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.soldel = function (id) {
          //  console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.pestdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addsolution#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitsoldat = function () {
            //     console.log("doing subnitdat........" + id)
            // console.log("$scope.txtpdffile  =" + JSON.stringify($scope.txtpdffile)  + "    wsspfile =" +wsspfile);
            // $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id
          //  console.log("soldet = " + JSON.stringify($scope.soldet))
            $scope.chkitms = "solpestcd,soldesc"

            $scope.itmsdesc = "Pest Code cannot  be blank "
            $scope.itmsdesc += ",Description cannot be blank "
            $scope.itmstype = "1,1"

            maintaindata.maintrec($scope.soldet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                  //  console.log("doing update....")
                    if ($scope.wssmode == "Add") {
                        runnodet.getrundet("runsolno").then(function (data1) {
                            $scope.soldet.soltrnsno = $filter('uppercase')("PESOL" + data1) 
                         //   console.log("$scope.pestdet.pestcd = " + $scope.soldet.soltrnsno)
                            runnodet.addrec($scope.pestdet,"pestsoldb","/addsolution#?wssmode=Add")
                        })
                    } else if ($scope.wssmode == "Modify") {
                        runnodet.modrec($scope.soldet, "pestsoldb","/dispsolution#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.soldet, "pestsoldb","/dispsolution#?wssmode=Maintain")
                    }
                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }
            }) //  end of mainaindata
 
        }
    }


})();