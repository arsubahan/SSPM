(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('chempCtrl', chempCtrl)

    chempCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'logdet', '$timeout', 'toaster', 'maintaindata', 'runnodet'];

    function chempCtrl($scope, $http, $location, $window, $filter, logdet, $timeout, toaster, maintaindata, runnodet) {

        logdet.getlog().success(function (data) {
            $scope.usname = data.name;
        }) // end of logde
        //    console.log('logdet.getlog()[1] = ' + logdet.getlog())
        //   console.log($location.search())
        $scope.wssmode = $location.search().wssmode;
        //   console.log("doing mantain")
        //  $scope.txtpdffile = [];
        $scope.chemplist
        $http.post('/getfile', { fltyp: "chemproductdb" })
            .then(function success(response) {
                $scope.chemplist = response.data
            })

        // get pest list
        $http.post('/getfile', { fltyp: "pestcodefl" })
            .then(function success(response) {
                $scope.pestlist = response.data


            })

        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")
            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "chemproductdb"
            }).then(function success(response) {
                $scope.chempdet = response.data[0];
                $scope.isDisabled = true;
                $scope.cont = 'ok';

              //  console.log("$scope.chempdet = " + JSON.stringify($scope.chempdet))

                if ($location.search().id != undefined) {
                    if ($scope.chempdet.chempusein != undefined || $scope.chempdet.chempusein != "") {
                        var chkboxarr = $scope.chempdet.chempusein.split("*")
                    }
                  //  console.log("$scope.chemplist.chempusein = " + JSON.stringify($scope.chempdet.chempusein))
    
                    angular.forEach($scope.pestlist, function (value, key) {
                    //    console.log("chkboxarr = " + JSON.stringify(chkboxarr) + "    value = " + JSON.stringify(value.pestcd))
                        if (chkboxarr.lastIndexOf(value.pestcd) == -1) {
                            //     console.log("value = " + chkboxarr.lastIndexOf(value.pestcd) + "     key = " + value.pestcd)
                            value.isSelected = '0'
                        } else {
                     //       console.log("value = " + chkboxarr.lastIndexOf(value.pestcd) + "     key = " + value.pestcd)
                            value.isSelected = '1'
                        }
                    })
                }
            })
 
        } else {
            $scope.chempdet = {}
            $scope.isDisabled = true
        }

        $scope.searchdet = function (txtsrch) {
            //      console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //     console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "chemproductdb"
            }).then(function success(response) {
                $scope.chemplist = response.data
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
            //$scope.chempdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addchemp#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.del = function (id) {
          //  console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.chempdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addchemp#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function () {
            // console.log("doing subnitdat........" + id)
            // console.log("$scope.txtpdffile  =" + JSON.stringify($scope.txtpdffile)  + "    wsspfile =" +wsspfile);
            // $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id

            //update chemical use in pest
            $scope.chempdet.chempusein = ""
            angular.forEach($scope.pestlist, function (pestype) {
                if (pestype.isSelected == "1") {
                    $scope.chempdet.chempusein += pestype.pestcd + "*"
                }

            })


           //  console.log("\n$scope.chempdet.chempusein = " + JSON.stringify($scope.chempdet.chempusein) )


            $scope.chkitms = "chempname,chempacting,chempuom,chempinstock,chempcost,chempdesc,chempusein"
            $scope.itmsdesc = "Chemical Name cannot be blank "
            $scope.itmsdesc += ",Active Ingredient cannot be blank "
            $scope.itmsdesc += ",Unit Of Measure (UOM) cannot be blank "
            $scope.itmsdesc += ",Stock quantity cannot be blank "
            $scope.itmsdesc += ",Cost cannot be blank "
            $scope.itmsdesc += ",Profile cannot be blank "
            $scope.itmsdesc += ",Chemical use in pest  cannot be blank "

            $scope.itmstype = "1,1,1,1,1,1,1"


            maintaindata.maintrec($scope.chempdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                    console.log("doing update....")
                    if ($scope.wssmode == "Add") {
                        runnodet.getrundet("runchemno").then(function (data1) {
                            $scope.chempdet.chempcode = $filter('uppercase')("CHEM" + data1)
                          //  console.log("$scope.chempdet = " + $scope.chempdet.chempcode)
                            runnodet.addrec($scope.chempdet, "chemproductdb", "/addchemp#?wssmode=Add")
                        })
                    } else if ($scope.wssmode == "Modify") {
                        runnodet.modrec($scope.chempdet, "chemproductdb", "/dispchemp#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.chempdet, "chemproductdb", "/dispchemp#?wssmode=Maintain")
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