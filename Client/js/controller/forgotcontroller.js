(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('forgotCtrl', forgotCtrl);

    forgotCtrl.$inject = ['$scope', '$http', '$window', '$location'];
    // forgotCtrl.$inject = ['$scope', '$http', '$window',  '$location', '$rootScope'];

    function forgotCtrl($scope, $http, $window, $location) {
      //  console.log("doing forgot ....." + JSON.stringify($location.search()));
        if ($location.search().back == "Q") { //from client login 
            $scope.back = $location.search().back
        }
        $scope.wsstype = $location.search().wsstype;
        $scope.resetrc = {};
        var wssname = '';
        var wssemail = '';

        $scope.sendbut = function () {
            var wssbody = this;
            var smsdata = {};
        //    console.log("check email = " + $scope.resetrc.email + "     $scope.wsstype = " + $scope.wsstype);
            if ($scope.resetrc.email != "" && $scope.resetrc.email != undefined) {
                //do for Reset _clientomer password
                if ($scope.wsstype == "client") {
                    var wsscrit = [{ clemail: $scope.resetrc.email }, "client"]
                } else {
                    var wsscrit = [{ Usemail: $scope.resetrc.email }, "Admin"]
                }
                $http.post('/forgot', wsscrit)
                    .then(function onSuccess(response) {
                     //   console.log("custrstpword response = " + JSON.stringify(response.data.user.clcontactperson));
                        if (response.data == "nok") {
                            alert("Your Email not found in database");
                        } else {
                            if ($scope.wsstype == "client") {
                                wssname = JSON.stringify(response.data.user.clcontactperson);
                                wssemail = JSON.stringify(response.data.user.clemail);
                            } else {
                                wssname = JSON.stringify(response.data.user.UsStaffname);
                                wssemail = JSON.stringify(response.data.user.Usemail);
                            }
                            wssbody = getbody(response.data.user, $scope.wsstype)
                   //         console.log("wssbody = " + wssbody)
                            smsdata = ({
                                contactName: wssname,
                                contactEmail: wssemail,
                                contactMsg: wssbody
                            }) // end of var data

                            sendsms(smsdata)
                        }// if response == nok
                    }) // response to then
                    .catch(function onError(response) {
                        alert("Your Email not found in database");
                        return;
                    })
                    .finally(function () {
                        // razzzzaz $window.location.href = '/home'
                    })//end post('/forgot',
            } // end of customer reset - wsstype = cust
        } // end sendbut


        function sendsms(wssdata) {
            //send sms here
            //if token taken send sms
         //   console.log(wssdata)

            $http.post('/contact-form', wssdata)
                .then(function onSuccess(wssdata, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                  //  console.log("wssdata = " + JSON.stringify(wssdata))
                   // if (wssdata.data.contactName != undefined) {
                        $window.alert('Hi ' + wssdata.data.contactName + ', Your reset password is sent to your email .... Please check your email');
                  //  } else {
                  //      $window.alert('Hi ' + wssdata.data.user.UsContactPerson + ', Your reset password is sent to your email .... Please check your email');
                  //  }

                    //               console.log("from mmsapp httpost data =" + JSON.stringify(wssdata.data.user.contactName));

                    $http.get("/home")
                }).catch(function onError(wssdata, status, headers, config) {
                    alert("email not sent")
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });  // end of send email to change of password
        } // end of send sms

        function getbody(wspres, wsstype) {
         //   console.log("custrstpword response = " + JSON.stringify(wspres));
            if (wspres != null) {
              //  console.log("\n\nwspres = " + JSON.stringify( wspres) + "   \n\n  wspres.clientName = " + wsstype + "\n\n")
                //var wssname = "";
                if (wspres.clcontactperson != undefined) {
                    wssname = wspres.clcontactperson;
                } else {
                    wssname = wspres.UsStaffname;
                }
                var wssbody = this;
                wssbody = "Dear " + wssname + ",<BR>"
                wssbody += 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                wssbody += 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
                if (wspres.clcontactperson != undefined) {
                    // wssbody += 'http ://www.soccernetinc.com/respassword#?wsstype=Reset_clientomer&resetPasswordToken=' + wspres.data[0] + '\n\n'
                    wssbody += 'http://www.erms-solution.com/respassword#?wsstype=Reset_client&resetPasswordToken=' + wspres.resetPasswordToken + '\n\n'
                } else {
                    if (wsstype == 'Admin') {
                        // wssbody += 'http: //www.soccernetinc.com/respassword#?wsstype=Reset_Admin&resetPasswordToken=' + wspres.data[0] + '\n\n'
                        wssbody += 'http://www.erms-solution.com/respassword#?wsstype=Reset_Admin&resetPasswordToken=' + wspres.resetPasswordToken + '\n\n'
                    }
                }
                wssbody += 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

                // //wssbody += "  Name    : &nbsp;&nbsp;" + $scope.custrc.clientName + "<BR>"
                //wssbody += "  Country : &nbsp;&nbsp;" + $scope.custrc.txtcountry + "<BR>"
                // wssbody += "  Email Address : &nbsp;&nbsp;" + $scope.custrc.emailaddr + "<BR>"
                // wssbody += "  Passsword  : &nbsp;&nbsp;" + resetrc.custpword + "<BR>"
                wssbody += "  <BR><br>"
                wssbody += "  Warmest Regards<BR>"
                wssbody += "  Staff of Earth Resources Management Services<BR>"
              //  console.log("wssbody = " + wssbody);
                return (wssbody)
            } // response != null
        } // end of getbody

    } // end of forgotCtrl

})();



