(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('respasswrdCtrl', respasswrdCtrl);


    respasswrdCtrl.$inject = ['$scope', '$http', '$window', '$location', 'maintaindata', 'runnodet', '$timeout', 'toaster'];

    function respasswrdCtrl($scope, $http, $window, $location, maintaindata, runnodet, $timeout, toaster) {
        // Reset  PAssword from  email
        $scope.resetrc = {}
        $scope.wsstype = {};
        $scope.name = "";
        $scope.email = "";
        $scope.loginid = "";
        $scope.email = ""
        //   console.log("$location.search())  = " + JSON.stringify($location.search()));
        if (JSON.stringify($location.search()) != {} || $location.search() != null) {
            if ($location.search().wsstype == "Reset_Admin") {
                $scope.wsstype = { wsstype: 'Admin' }
                $scope.type = "Admin"
                $scope.id = ""
            } else if ($location.search().maintype == "reset") {
                $scope.wsstype = { wsstype: 'client' }
                $scope.type = "client"
                var txtsrch = {
                    clcode: $location.search().mainid
                }
                $http.post('/getfilecrit', {
                    txtsrch,
                    fltyp: "clientdb"
                }).then(function success(response) {
                    $scope.disinput = true;
                    $scope.loginid = response.data[0].clcode
                    $scope.name = response.data[0].clcontactperson
                    $scope.email = response.data[0].clemail
                    $scope.id = response.data[0]._id
                    //    console.log("$scope.name = " + JSON.stringify(response.data[0].clcontactperson))
                })

            } else {
                $scope.wsstype = { wsstype: 'client' }
                $scope.type = "client"
            }
            //   console.log("$scope.resetPasswordToken =" + $location.search().resetPasswordToken + "     wsstype = " + JSON.stringify($scope.wsstype));

            if ($location.search().resetPasswordToken != undefined) {
                $scope.resetPasswordToken = $location.search().resetPasswordToken
                $http.post('/resetpword/' + $scope.resetPasswordToken, $scope.wsstype)
                    .then(function onSuccess(response) {
                        if ($scope.type == "Admin") {
                            $scope.loginid = response.data.UsStaffcd;
                            $scope.name = response.data.UsStaffname;
                            $scope.email = response.data.Usemail
                            //  console.log("at reset name = " + JSON.stringify(response.data) + "   = " + $scope.name)
                        } else {
                            $scope.name = response.data.clcontactperson;
                            $scope.loginid = response.data.clcode
                            $scope.email = response.data.clemail
                            //      console.log("at reset name = " + response.data.clcontactperson)
                        }
                        $scope.id = response.data._id
                        //   console.log("name = " + $scope.name + "    $scope.type  = " + $scope.type) // JSON.stringify(response));
                        if (response.data == 'nok') {
                            $scope.resetPasswordToken = null;
                            $scope.disinput = false;
                        } else {
                            //  $scope.resetPasswordToken = response.data.resetPasswordresetPasswordToken
                            $scope.resetrc = {};
                            $scope.user = response.data;
                            $scope.resetrc.resetPasswordToken = $scope.resetPasswordToken
                            //       console.log("doing Reset _admin = " + JSON.stringify($scope.resetrc) + "    resetPasswordToken = " + $scope.resetPasswordToken);
                            $scope.disinput = true;
                        } // response.data == 'nok'
                    }) // $http.post('/resetcust/' 
                // } //$location.search().wsstype == "Reset_Admin"

            } // end of JSON.stringify($location.search()) != {}
        } //end iof  location.search().resetPasswordToken != undefined


        $scope.butreset = function (resetrc) {

            //     console.log("doing butreset" + $scope.type + "       resetrc = " + JSON.stringify($scope.resetrc));

            $scope.wsscompare = "newpword*" + $scope.resetrc.verpword;

            $scope.chkitms = "newpword,verpword"
            $scope.itmsdesc = "New Password cannot be blank"
            $scope.itmsdesc += ",verify password cannot be blank "
            $scope.itmsdesc += ",New Password and verify password not the same "
            $scope.itmstype = "1,1,3"

            maintaindata.maintrec($scope.resetrc, $scope.chkitms, $scope.itmsdesc, $scope.itmstype, $scope.wsscompare).success(function (data) {
                if (data == "ok") {
                    //.log("doing update...." + $scope.type)
                    if ($scope.type == "Admin") {
                        var selcrit = [$scope.resetrc.newpword, "Admin"];
                    } else {
                        var selcrit = [$scope.resetrc.newpword, "client"];
                    }

                    $http.put('/updresetpword/' + $scope.id, selcrit)
                        .then(function (req, res) {
                            //   console.log("response = " + JSON.stringify(req.data));
                            if (req.data) {
                                getemail($scope.resetrc, req.data[2]);
                                toaster.success('success', "Password Reset Successfully ");
                                $timeout(function () {
                                    $window.location.href = '/clienthome'
                                }, 2000);
                            }
                        }) //end of save record /cust/ 

                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }


            }) //  end of mainaindata



        }; // end of butreset

        function getemail(wssresetrc, wsspword) {

            //  console.log("custrstpword response = " + JSON.stringify(wssresetrc) + "       $scope.type = " + $scope.type +
           // "     Dear " + $scope.name + "        $scope.loginid =" + $scope.loginid;
            var wssbody = this;
            wssbody = "Dear " + $scope.name + ",<BR> You have change your password  Details are as follows:<BR>"
            wssbody += "  Login ID : &nbsp;&nbsp;" + $scope.loginid + "<BR>"
            wssbody += "  Passsword  : &nbsp;&nbsp;" + wssresetrc.verpword + "<BR>"
            wssbody += "  <BR><br>"
            wssbody += "  Warmest Regards<BR>"
            wssbody += "  Staff of Earth Resources Management Services<BR>"
            //   console.log("wssbody = " + wssbody);

            var data = ({
                contactName: $scope.name,
                contactEmail: $scope.email,
                contactMsg: wssbody
            })
            //.error(function (response) {
            //    alert("error response" + response);
            //});
            // console.log("data from mmsapp=" + JSON.stringify(data));

            //   Simple POST request example (passing data) :
            $http.post('/contact-form', data)
                .success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //   console.log("from mmsapp httpost data =" + data.contactName);
                    $window.alert('hi ' + data.contactName + ', Your new password is sent to your email .... Please keep you details confidential');
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });  // end of send email to change of password

        } // end getemail

    } // end of forrespasswrdCtrl
})();

