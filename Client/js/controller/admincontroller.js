(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('adminloginCtrl', adminloginCtrl)
        .controller('adminCtrl', adminCtrl);

    adminloginCtrl.$inject = ['$http', '$scope', '$window', '$location', 'maintaindata', 'runnodet'];
    adminCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'maintaindata', 'runnodet'];

    function adminloginCtrl($http, $scope, $window, $location, maintaindata, runnodet) {
      //  console.log("location = " + JSON.stringify($location.search()))
        if ($location.search().loginty == "C") {
            $scope.lgtype = "Client"
        } else {
            $scope.lgtype = "Staff"
            $http.post('/getfilecnt', { fltyp: "Staffdb" })
                .then(function success(response) {
                 //   console.log("response = " + JSON.stringify(response))
                    if (response.data == 0) {
                        $window.location.href = "/register";
                    }
                })
        }

    }
    function adminCtrl($scope, $http, $location, $window, $filter, maintaindata, runnodet) {
        $scope.temp = ""
        // console.log($location.search() + "      wssmode = " + $scope.wssmode)
        $scope.wssmode = $location.search().wssmode;
        if ($scope.wssmode == undefined) {
            $scope.wssmode = "Add"
            $scope.staffdet = {}
        }
        //  console.log("doing mantain")
        //  $scope.txtpdffile = [];
        $http.post('/getfile', { fltyp: "Staffdb" })
            .then(function success(response) {
                $scope.stafflist = response.data
                //        console.log("  $scope.stafflist = " + JSON.stringify($scope.stafflist))
            })

        $http.post('/getfile', { fltyp: "occupationdb" })
            .then(function success(response) {
                $scope.occlist = response.data
                //                  console.log("  $scope.occlist = " + JSON.stringify($scope.occlist))
            })
        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //    console.log("doing modify")
            $scope.nsdisp = "0";
            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "Staffdb"
            }).then(function success(response) {
                $scope.staffdet = response.data[0];
                //   $scope.txtpdffile.name= $scope.staffdet.Newspdf
                // $scope.staffdet.Newsdate = $filter('date')(new Date($scope.staffdet.Newsdate), 'd MMM yyyy')
                // console.log("date = " + $scope.staffdet.Newsdate)

                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("staffdet = " + JSON.stringify($scope.staffdet))
            })

        } else {
            $scope.isDisabled = true;
            $scope.temp = {};
        }

        $scope.searchdet = function (txtsrch) {
            //   console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //   console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "Staffdb"
            }).then(function success(response) {
                $scope.stafflist = response.data
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
                //  console.log("teamr = " + JSON.stringify($scope.teamrc))
            })
            //}
            // }

        }
        $scope.edit = function (id) {
            //   console.log("DOing Edit newsrc   -   " + id);
            var wssid = id;
            //$scope.staffdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/Register#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.del = function (id) {
            //     console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.staffdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/Register#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function (verpword) {
            //  $scope.wssurl = "/addfldtype#?wssmode=Modify" + "&id=" + id
            if ($scope.wssmode == "Add") {
               // console.log("    $scope.password2 = " + $scope.temp.password2)
                $scope.wsscompare = "UsPassword*" + $scope.temp.password2;
             //   console.log("$scope.wsscompare = " + $scope.wsscompare)
                $scope.chkitms = "UsStaffname,USStaffAddress,Usemail,UsHphone,Uslevel,UsDesignation,UsPassword"
                $scope.itmsdesc = "Name  cannot be blank "
                $scope.itmsdesc += ",Address  cannot be blank"
                $scope.itmsdesc += ",Email Address  cannot be blank "
                $scope.itmsdesc += ",Telephone/mobile Number cannot be blank "
                $scope.itmsdesc += ",Access level cannot be blank "
                $scope.itmsdesc += ",Designation  cannot be blank "
                $scope.itmsdesc += ",Password cannot be blank "
                // $scope.itmsdesc += ",verify Password cannot be blank "
                $scope.itmsdesc += ",Pasword and verify password do not match ..... "
                $scope.itmstype = "1,1,1,1,1,1,1,3"
            } else {
                $scope.chkitms = "UsStaffname,USStaffAddress,Usemail,UsHphone,Uslevel,UsDesignation"
                $scope.itmsdesc += "Name  cannot be blank "
                $scope.itmsdesc = ",Address  cannot be blank"
                $scope.itmsdesc += ",Email Address  cannot be blank "
                $scope.itmsdesc += ",Telephone/mobile Number cannot be blank "
                $scope.itmsdesc += ",Access level cannot be blank "
                $scope.itmsdesc += ",Designation  cannot be blank "
                // $scope.itmsdesc += ",Password cannot be blank "
                $scope.itmstype = "1,1,1,1,1,1"
            }

            maintaindata.maintrec($scope.staffdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype, $scope.wsscompare).success(function (data) {
                if (data == "ok") {
                  //  console.log("doing update....")
                    if ($scope.wssmode == "Add") {
                        runnodet.getrundet("runoccno").then(function (data1) {
                            $scope.staffdet.UsStaffcd = $filter('uppercase')("ERST" + data1)
                            //   console.log("$scope.staffdet = " + $scope.staffdet.chempcode)
                            $scope.staffdet.UsPassword = "encryptPassword('" + $scope.staffdet.UsPassword + "')"
                            $scope.staffdet.resetPasswordToken = null;
                            $scope.staffdet.resetPasswordExpires = null;
                          //  var datarc = $scope.staffdet
                            runnodet.addrec($scope.staffdet, "Staffdb", "/register#?wssmode=Add")
                        })
                    } else if ($scope.wssmode == "Modify") {
                        runnodet.modrec($scope.staffdet, "Staffdb", "/dispadmin#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.staffdet, "Staffdb", "/dispadmin#?wssmode=Maintain")
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

