(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('durCtrl', durCtrl);

        durCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet', 'maintaindata', 'runnodet'];

    function durCtrl($scope, $http, $location, $window, $filter, logdet, maintaindata, runnodet) {
        logdet.getlog().success(function (data) {
            $scope.usname = data.name;
        }) // end of logde
        //    console.log('logdet.getlog()[1] = ' + logdet.getlog())
        //   console.log($location.search())
        $scope.wssmode = $location.search().wssmode;
        //   console.log("doing mantain")
        //  $scope.txtpdffile = [];

        // $http.post('/getfile', { fltyp: "enquirydb" })
        //     .then(function success(response) {
        //         $scope.durlist = response.data
        //     })

            $http.post('/getfile', { fltyp: "durationdb" })
            .then(function success(response) {
                $scope.durlist = response.data
            })


        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")
 
            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "durationdb"
            }).then(function success(response) {
                $scope.durdet = response.data[0];
                 $scope.isDisabled = true;
                $scope.cont = 'ok';
                  console.log("durdet = " + JSON.stringify($scope.durdet))
            })


        } else {
            $scope.durdet = {}
            $scope.isDisabled = true
        }

        $scope.searchdet = function (txtsrch) {
            //      console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //     console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "durationdb"
            }).then(function success(response) {
                $scope.durlist = response.data
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
            //$scope.durdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/adduration#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.del = function (id) {
          //  console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.durdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/adduration#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function () {
            //     console.log("doing subnitdat........" + id)
            // console.log("$scope.txtpdffile  =" + JSON.stringify($scope.txtpdffile)  + "    wsspfile =" +wsspfile);
            // $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id
            $scope.chkitms = "durdesc,"

            $scope.itmsdesc = "Description cannot be blank "
            $scope.itmstype = "1,"

            maintaindata.maintrec($scope.durdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                    console.log("doing update....")
                    if ($scope.wssmode == "Add") {
                        runnodet.getrundet("rundurno").then(function (data1) {
                            $scope.durdet.durcd  = $filter('uppercase')("DUR" + data1)
                         //   console.log("$scope.durdet = " + $scope.durdet.chempcode)
                            runnodet.addrec($scope.durdet, "durationdb","/adduration#?wssmode=Add")
                        })
                    } else if ($scope.wssmode == "Modify") {
                        runnodet.modrec($scope.durdet, "durationdb", "/dispduration#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.durdet, "durationdb", "/dispduration#?wssmode=Maintain" )
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


