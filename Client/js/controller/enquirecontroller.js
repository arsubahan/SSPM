(function () {
    'use strict';
    angular.module('ermsapp')
        .controller('enquireCtrl', enquireCtrl)    //for enquiry form
        .controller('solutionCtrl', solutionCtrl);  // for proposal form


    enquireCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'getfldesc', 'maintaindata', 'runnodet'];
    solutionCtrl.$inject = ['$scope', '$http', '$location', '$window', '$filter', 'mailservice', 'maintaindata', 'runnodet'];

    function enquireCtrl($scope, $http, $location, $window, $filter, getfldesc, maintaindata, runnodet) {


var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}




        //       console.log("starting qnquire...." + JSON.stringify($location.search()))
        $scope.enqdet = {};
        $scope.pestype = [];
        $scope.pestsollist = [];
        var txtsrch = ""
        $scope.txtsearch = {}
        $scope.txtsearch.enqpropstatus = "P"
        if ($location.search().mainid != undefined) {
           // console.log("$location.search().mainid =  " + JSON.stringify($location.search().mainid))

            $http.post('/getonerec', {
                id: { clcode: $location.search().mainid },
                fltyp: "clientdb"
            }).then(function success(response) {
              //  console.log("client detail = " + JSON.stringify(response.data.clcontactperson))
                $scope.enqdet.clcode = $location.search().mainid
                $scope.enqdet.enqcontactperson = response.data[0].clcontactperson
                $scope.enqdet.enqconame = response.data[0].clconame
                $scope.enqdet.enqaddress = response.data[0].claddress
                $scope.enqdet.enqcontactno = response.data[0].clcontactno
                $scope.enqdet.enqemail = response.data[0].clemail
                //$scope.enqdet.
              //.log("$scope.enqdet = " + JSON.stringify($scope.enqdet))

            })
        }
        // get Enquiry list
        if ($location.search().id != undefined) {
            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "enquirydb"
            }).then(function success(response) {
                $scope.enqlist = response.data[0];
                //                  console.log("$scope.enqlist = " + JSON.stringify(response.data.enqproblemtype))
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                var txtsrch = {};
                var wssrch = []
                // wssrch =  "$or : ["
                //  console.log("$scope.enqlist.enqproblemtype = " + JSON.stringify($scope.enqlist.enqproblemtype))
                var servicearr = $scope.enqlist.enqproblemtype.split("*");

                if (servicearr.length > 0) {
                    angular.forEach(servicearr, function (servicereq) {
                        //                       console.log("servicereq = " + JSON.stringify(servicereq))
                        if (servicereq != "") {
                            $http.post('/getonerec', {
                                id: { pestcd: servicereq },
                                fltyp: "pestcodefl"
                            }).then(function success(response) {
                                //$scope.pestlist = response.data
                                $scope.pestype.push(response.data[0])   //.pestdesc)
                                //          console.log("servicereq  = " + JSON.stringify(response.data[0].pestcd) + " \n\n ")
                            })
                        }
                    })

                    angular.forEach(servicearr, function (servicereq) {
                        if (servicereq != "") {
                            wssrch.push({ solpestcd: { $eq: servicereq } },)
                        }
                    })
                    txtsrch = { $or: wssrch }
                    $http.post('/getsolfilecrit', {
                        txtsrch,
                        fltyp: "pestsoldb"
                    }).then(function success(response) {
                        //  console.log("\n response = " + JSON.stringify(response) + "\n")

                        $scope.pestsollist = response.data
                        if ($scope.enqlist.propsolution != undefined && $scope.enqlist.propsolution != "") {
                            var chkboxarr = $scope.enqlist.propsolution.split("*")
                            //  }
                            angular.forEach($scope.pestsollist, function (value, key) {
                                //       console.log("$scope.enqlist.propsolution = " + JSON.stringify(chkboxarr) + "    value = " + JSON.stringify(value.soltrnsno))
                                if (chkboxarr.lastIndexOf(value.soltrnsno) == -1) {
                                    //      console.log("value = " + chkboxarr.lastIndexOf(value.soltrnsno) + "     key = " + value.soltrnsno)
                                    value.isSelected = '0'
                                } else {
                                    value.isSelected = '1'
                                }
                            })
                        }
                        // .push(JSON.stringify(response.data))
                        $scope.isDisabled = true;
                        //  $scope.cont = 'ok';

                        //  console.log("\n$scope.pestsolution = " + JSON.stringify(response.data[0]) + "\n\n")
                        //  $scope.pestsolution.push(response.data)
                        //                            console.log(" '\n'  $scope.pestsollist = " + JSON.stringify($scope.pestsollist) + "'\n'")

                    })
                    //}

                }

                // check quotation if done
                $scope.quoteind = "";
                $scope.wsscrit = {
                    crit:
                    {
                        quoenqno: $scope.enqlist.enqtrnsno
                    }, selfld: "$quotrnsno",
                    fltyp: "quotationdb"
                }
                getfldesc.getfld($scope.wsscrit)
                    .success(function (data) {
                        if (data.length > 0) {
                            $scope.quoteind = true
                            //      alert("OK quotation file..." + JSON.stringify(data))
                        } else {
                            $scope.quoteind = false
                            //    alert("No quotation file..." + JSON.stringify(data))
                        }
                    }).error(function (data, status) {
                        //                      console.error('Repos error', status, data);
                    })
                //end of check quotation

            })

        } else {
         //   console.log("doing enauire controle...")
            txtsrch = {
                enqpropstatus: "P"
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

            // get pest list
            $http.post('/getfile', { fltyp: "pestcodefl" })
                .then(function success(response) {
                    $scope.pestlist = response.data
                })

        }

        // get pest list
        $http.post('/getfile', { fltyp: "durationdb" })
            .then(function success(response) {
                $scope.durlist = response.data
            })

        $scope.searchdet = function (txtsrch) {
         //   console.log("txtsech = " + JSON.stringify(txtsrch))
            // if (txtsrch == undefined) {
            //     txtsrch = { enqpropstatus: "P" }
            // } else {
            //     txtsrch += {enqpropstatus: "A" }
            // }
       //     console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getfilecrit', {
                txtsrch,
                fltyp: "enquirydb"
            }).then(function success(response) {
                $scope.enqlist = response.data
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
         //       console.log("response.data = " + JSON.stringify(response.data))
            })
            //}
            // }

        }

        $scope.edit = function (id) {
            //       console.log("DOing Edit newsrc   -   " + id);
            var wssid = id;
            //$scope.enqdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/proposal#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.del = function (id) {
         //   console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.enqdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/proposal#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitdat = function () {
            //    console.log("enqproptype = " + JSON.stringify($scope.enqdet.enqproptype))
            $scope.enqdet.enqproblemtype = ""
            angular.forEach($scope.pestlist, function (pestype) {
                if (pestype.isSelected) {
                    $scope.enqdet.enqproblemtype += pestype.pestcd + "*"
                }
            })
            //    console.log("\n$scope.enqdet.pestdesc = " + JSON.stringify($scope.enqdet.enqproblemtype) + "\n")

            $scope.itmsdesc = "Please select One of Property Type to Enquire"
            // if ($scope.enqdet.enqproptype == "R") {
            $scope.chkitms = "enqproptype,enqcontactperson,enqaddress,enqcontactno,enqemail,enqpremises,enqproblemtype"
            $scope.itmsdesc += ",Please Enter Your Name "

            $scope.itmstype = "1,1,1,1,1,1,1"
            /* } else { 
                 $scope.chkitms = "enqproptype,enqconame,enqcontactperson,enqaddress,enqcontactno,enqemail,enqpremises,enqproblemtype"
                 $scope.itmsdesc += ",Please Enter Your Company Name "
                 $scope.itmsdesc += ",Please Enter Your Contact person "
 
                 $scope.itmstype = "1,1,1,1,1,1,1,1"
           //  } */

            $scope.itmsdesc += ",Please Enter Your Address "
            $scope.itmsdesc += ",Please Enter Your contact Number "
            $scope.itmsdesc += ",Please Enter Your Email Address "
            $scope.itmsdesc += ",Please Enter Your premises that you want to service "
            $scope.itmsdesc += ",Please Select at least 1 Service type to Enquire  "

            maintaindata.maintrec($scope.enqdet, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                 //   console.log("doing update....")
                    if ($location.search().mainid != undefined) {
                        $scope.enqdet.clcode = $location.search().mainid
                    }
                    $scope.enqdet.enqregdate = new Date()
                    $scope.enqdet.enqpropstatus = "P"
                    runnodet.getrundet("runenqno").then(function (data1) {
                        $scope.enqdet.enqtrnsno = $filter('uppercase')("ENQ" + data1)
                    //    console.log("$scope.enqdet = " + $scope.enqdet.chempcode)
                        runnodet.addrec($scope.enqdet, "enquirydb", "")
                    })

                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }
            }) //  end of mainaindata
        } // end of maincontact
    } //end ofg enquireCtrl

    function solutionCtrl($scope, $http, $location, $window, $filter, mailservice, maintaindata, runnodet) {

        $scope.wssmode = $location.search().wssmode;
        $scope.soldet = {};

        $http.post('/getfile', { fltyp: "durationdb" })
            .then(function success(response) {
                $scope.durlist = response.data
                // get selected pest for proposal
            });

        if ($scope.wssmode == "Modify" || $scope.wssmode == "Delete") {
            //     console.log("doing modify")

            var id = $location.search().id
            $http.post('/getonerec', {
                id: { _id: id },
                fltyp: "durationdb"
            }).then(function success(response) {
                $scope.soldet = response.data[0];
                $scope.isDisabled = true;
                $scope.cont = 'ok';
                //  console.log("durdet = " + JSON.stringify($scope.durdet))
            })

        } else {
            $scope.durdet = {}
            $scope.isDisabled = true
        }

        $scope.solsearchdet = function (txtsrch) {
            //        console.log("txtsech = " + JSON.stringify(txtsrch))

            // txtsrch = txtsrch.replace("\"","");   
            //        console.log("col = " + JSON.stringify(txtsrch))
            $http.post('/getsolfilecrit', {
                txtsrch,
                fltyp: "durationdb"
            }).then(function success(response) {
                $scope.dursollist = response.data
                $scope.isDisabled = true;
                //  $scope.cont = 'ok';
                //  console.log("teamr = " + JSON.stringify($scope.teamrc))
            })

        }

        $scope.soledit = function (id) {
            //      console.log("DOing Edit newsrc   -   " + id);
            // var wssid = id;
            //$scope.durdet = id;
            // console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addsolution#?wssmode=Modify" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };
        $scope.soldel = function (id) {
            //        console.log("DOing Delete newsrc   -   " + id);
            var wssid = id;
            //$scope.durdet = id;
            //   console.log("response = " + wssid.ItemCd + "       id = " + JSON.stringify(id.ItemCd));
            $window.location.href = "/addsolution#?wssmode=Delete" + "&id=" + id;
            //sessionStorage.setItem("wsstype", "Modify");
            // $scope.wssmode = sessionStorage.getItem("wsstype");
        };

        $scope.submitsoldat = function () {
            //     console.log("doing subnitdat........" + id)
          //  console.log("_id  =" + JSON.stringify($location.search()));
            $scope.enqlist.propsolution = "";
            //          console.log("enqlist..propsolution = " + JSON.stringify($scope.enqlist.propsolution))
            angular.forEach($scope.pestsollist, function (soltype) {
                if (soltype.isSelected == "1") {
                    //                   console.log("Islect = " + soltype.isSelected)
                    if ($scope.enqlist.propsolution == "") {
                        $scope.enqlist.propsolution = soltype.soltrnsno
                    } else {
                        $scope.enqlist.propsolution += "*" + soltype.soltrnsno
                    }
                }
            })

            //            console.log("enqlist..propsolution after = " + JSON.stringify($scope.enqlist))
            $scope.chkitms = "proptitle,propduration,propsolution"
            $scope.itmsdesc = "Solution Title Code cannot  be blank "
            $scope.itmsdesc += ",duration Code cannot  be blank "
            // $scope.itmsdesc += ",Description cannot be blank "
            $scope.itmsdesc += ",Proposed Solution cannot be blank "
            $scope.itmstype = "1,1,1"

            maintaindata.maintrec($scope.enqlist, $scope.chkitms, $scope.itmsdesc, $scope.itmstype).success(function (data) {
                if (data == "ok") {
                    if ($scope.wssmode == "Modify") {
                        $scope.enqlist.enqpropstatus = "P"
                        runnodet.modrec($scope.enqlist, "enquirydb", "/dispenquire#?wssmode=Maintain")
                    } else if ($scope.wssmode == "Delete") {
                        runnodet.delrec($scope.enqlist, "enquirydb", "/dispenquire#?wssmode=Maintain")
                    }
                } else { //if not ok
                    $scope.success = false;
                    $scope.errors = true
                    $scope.errmsg = data[1]
                }
            }) //  end of mainaindata
        } // end of submitsoldat


        $scope.accproposal = function () {
          //  console.log("accept [proposal")
            $scope.projdet = {}
            $scope.clientdet = {};
            addclient();
            runnodet.getrundet("runclno").then(function (data1) {
                $scope.projdet._id = $scope.enqlist._id
                $scope.projdet.projtrnsno = $filter('uppercase')("PROJ" + data1)
                $scope.projdet.enqpropstatus = "A" // P- Proposal A - Project c-Close
                $scope.projdet.enqclientcd = $scope.clientdet.clcode;
                runnodet.modrec($scope.projdet, "enquirydb", "/dashboard")
                alert("Proposal Accepted Successfully....Project No. :  " + $scope.projdet.projtrnsno)
            })
        }

        function addclient() {
       //     console.log("DOing add client")
            runnodet.getrundet("runclno").then(function (data1) {
                $scope.clientdet.clcode = $filter('uppercase')("CL" + data1)
                $scope.clientdet.clconame = $scope.enqlist.enqconame
                $scope.clientdet.claddress = $scope.enqlist.enqaddress
                $scope.clientdet.clcontactperson = $scope.enqlist.enqcontactperson
                $scope.clientdet.clcontactno = $scope.enqlist.enqcontactno
                $scope.clientdet.clemail = $scope.enqlist.enqemail
                $scope.clientdet.cldatereg = new Date()
                // $scope.clientdet.clstaff = $scope.enqlist.enqemail
                $scope.clientdet.clpassword = "encryptPassword('erms123')";
                $scope.clientdet.resetPasswordToken = null
                $scope.clientdet.resetPasswordExpires = null
                //   datarc = $scope.clientdet

                //  var datarc = $scope.staffdet
                runnodet.addrec($scope.clientdet, "clientdb", "")
                prepmail($scope.clientdet, "client")
            })
        }


        function prepmail(wssdet, chktype) {
            var wssname = "";
            var wssemail = "";
            var wssbody = getbody(wssdet)
            var smsdata = ({
                contactName: wssdet.clcontactperson,
                contactEmail: wssdet.clemail,
                contactMsg: wssbody
            }) // end of var data

            mailservice(smsdata)
        }

        function getbody(wsspres, wsstype) {

            var wssbody = this;
            wssbody = "Dear " + wsspres.clcontactperson + ",<BR> Thank you for giving the opportunity to service you. "
            wssbody += "You can login to your page to view the status. "
            wssbody += "Plaese change your password...Your presenmt login detailsare as follows: <BR>"
            wssbody += "  Client ID : &nbsp;&nbsp;" + wsspres.clcode + "<BR>"
            wssbody += "  Passsword  : &nbsp;&nbsp;" + "erms123" + "<BR>"
            wssbody += "  <BR><br>"
            wssbody += "  Warmest Regards<BR>"
            wssbody += "  Staff of Earth Resources Management Services<BR>"
            return (wssbody)

        } // response != null
        //   } // end of getbod


        //  } // end of customer reset - wsstype = cust



    } // end of soilutionctrl

})();





