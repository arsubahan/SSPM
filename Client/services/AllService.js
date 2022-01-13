
(function () {
   'use strict';
   angular.module('ermsapp')

      .service('getfldesc', ['$http', function ($http) {
         /*
         to include in controller in getfldesc:
   
         $scope.memID = $scope.txtmembid
         $scope.wsscrit = {
                          crit:
                          {
                             memberID: $scope.memID
                          }, selfld: {
                            _id: "$memberName"
                          },
                            fltyp: "memberfl"
                          }
         */
         var getfldesc = {};
         getfldesc.getfld = function (wssdata) {
            //           console.log("wssdata = " + JSON.stringify(wssdata))

            return $http.post("/lookup", {
               wssdata
            }).success(function (response) {
               //             console.log("from allse response = " + JSON.stringify(response.test))
            });
         };
         return getfldesc;


      }])

      .service('logdet', ['$http', function ($http) {
         var logdet = {};
         logdet.getlog = function () {
            return $http.get('/stouser').success(function (response) {
               //  //console.log("response = " + JSON.stringify(response))
               // logdet.setlog(response.username, response.name)
               // $scope.usname = response.username
            }) // end of /test
         };
         return logdet
      }])

      .service('memlogdet', ['$http', function ($http) {
         //   console.log("doing mwemlogert")
         var memlogdet = {};
         memlogdet.memgetlog = function () {
            return $http.get('/stocluser').success(function (response) {
               // console.log("response mem = " + JSON.stringify(response))
               // logdet.setlog(response.username, response.name)
               // $scope.usname = response.username
            }, function (error) {
               //      console.log(error, 'can not get data.' + + JSON.stringify(response)) ;
            }); // end of /test

         };
         return memlogdet
      }])

      .directive('myDatePicker', function () {

         function link(scope, element, attrs) {
         }

         function controller($scope) {
            $scope.init = function () {
               alert($scope.myDatePickerModel)
               $scope.dt = $scope.myDatePickerModel;
            };
            $scope.init();

            $scope.clear = function () {
               $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
               return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.toggleMin = function () {
               $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
               $event.preventDefault();
               $event.stopPropagation();

               $scope.opened = true;
            };

            $scope.dateOptions = {
               formatYear: 'yy',
               startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.$watch('dt', function (newVal, oldVal) {
               $scope.myDatePickerModel = newVal;
            });

         }

         return {
            restrict: 'A',
            // templateUrl: 'trplayers.handlebars',
            link: link,
            controller: controller,
            scope: {
               myDatePickerModel: '='
            }
         }
      })

      .service('seldatepick', ['$http', '$filter', function ($http, $filter) {
         var seldatepick = {}
         seldatepick.getdt = function (wssdate) {
            //console.log("get seldate[pic = " + wssdate)

         } // end of seldatepick.getdt
         return seldatepick;
      }])

      .service('shareDataService', function () {
         var myList = "";

         var addList = function (newObj) {
            console.log("\nnewObj = " + newObj)
            myList = newObj;
         }

         var getList = function () {
            console.log("gettin data " + myList)
            return myList;
         }

         return {
            addList: addList,
            getList: getList
         };

      })

      .service("memService", function () {
         var memid = "";
         var memname = "";
         return {
            getmemb: function () {
               console.log("memberc = " + memid);
               return [memid, memname]; //, wsstrtype; 
            },
            setmemb: function (wssid, wssname) {
               console.log("setcode value = " + JSON.stringify(wssid));
               memid = wssid;
               memname = wssname
               console.log("setcode memid = " + JSON.stringify(memid) + "      setcode memname = " + memname);
            }
         }
      })

      .directive('fileModel', ['$parse', function ($parse) {
         return {
            restrict: 'A',
            link: function (scope, element, attrs) {
               var model = $parse(attrs.fileModel);
               var modelSetter = model.assign;
               element.bind('change', function () {
                  scope.$apply(function () {
                     modelSetter(scope, element[0].files[0]);
                  });
               });
            }
         };
      }])

      .service('fileUpload', ['$http', function ($http) {
         this.uploadFileToUrl = function (file, uploadUrl, wssdestination) {

            var fd = new FormData();
            fd.append('file', file);
            console.log("fd = " +JSON.stringify( fd))
            $http.post(uploadUrl, fd, {
               transformRequest: angular.identity,
               headers: { 'Content-Type': undefined }
            })
               .success(function () {
               })
               .error(function () {
               });
         }
      }])

      .service("tourService", function () {
         var wsstrcode;
         var wsstrtype;
         var wsstrteam;
         return {
            getCde: function () {
               //  console.log("getcode wsstrcode = " + wsstrcode + "      getcode wsstrtype = " + wsstrtype);
               return [wsstrcode, wsstrtype]; //, wsstrtype;
            },
            getTeam: function () {
               //  //console.log("getcode wsstrcode = " + wsstrcode + "      getcode wsstrtype = " + wsstrtype);
               return wsstrteam; //, wsstrtype;
            },
            setCde: function (value, value1) {
               //                 console.log("setcode value = " + value + "      setcode value1 = " + value1);
               wsstrcode = value;
               wsstrtype = value1;
               //     //console.log("setcode wsstrcode = " + wsstrcode + "      setcode wsstrtype = " + wsstrtype);
            },
            setTeam: function (tmvalue) {
               //  //console.log("setcode value = " + tmvalue );
               wsstrteam = tmvalue;
               //     //console.log("setcode wsstrcode = " + wsstrcode + "      setcode wsstrtype = " + wsstrtype);
            }
         }
      })

      .directive("slide", function ($timeout) {
         return {
            restrict: 'AE',
            templateUrl: 'slide.html',
            scope: {
               images: '=',

            },

            link: function (scope, elem, attrs) {

               scope.currentIndex = 0;
               scope.next = function () {
                  scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                  var video = angular.element(elem).find("video");


                  video["0"].pause();

               }
               scope.prev = function () {
                  scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1
                  var video = angular.element(elem).find("video");
                  video["0"].pause();

               }
               scope.$watch('currentIndex', function () {
                  scope.images.forEach(function (image) {
                     image.visible = false;
                  })
                  scope.images[scope.currentIndex].visible = true;
               })
               // var timer;
               // var sliderFunc = function(){
               //   timer = $timeout(function(){
               //     scope.next();
               //     timer = $timeout(sliderFunc,2000);
               //   },2000)
               // }
               // sliderFunc();
               // scope.$on('$destroy',function(){
               //   $timeout.cancel(timer);
               // })
            }
         }
      })

      .run(function ($rootScope, $window) {
         var parentAngular = $window.parent.angular;
         var iframeScope = parentAngular.element($window.frameElement).scope();

         $rootScope.$parentEmit = function () {
            iframeScope.$emit.apply(iframeScope, arguments);
            iframeScope.$apply();
         };

         $rootScope.$parentOn = function (name, callback) {
            iframeScope.$on(name, function () {
               //     console.log("run name = " + name)
               callback.apply(null, arguments);
               $rootScope.$apply();
            });
         };
      })

      .service("mailservice", ['$http', '$window', function ($http, $window) {
         var sendmail = function (wssdata, wssmsg) {
            //send sms here
            //if token taken send sms
            //    console.log(wssdata)

            $http.post('/contact-form', wssdata)
               .then(function onSuccess(wssdata, status, headers, config) {
                  // this callback will be called asynchronously
                  // when the response is available
                  //    console.log("wssdata = " + JSON.stringify(wssdata))
                  if (wssdata.data.contactName != undefined) {
                     $window.alert(wssmsg);
                  } else {
                     $window.alert('Hi ' + wssdata.data.user.UsContactPerson + ', Your reset password is sent to your email .... Please check your email');
                  }

                  //               console.log("from mmsapp httpost data =" + JSON.stringify(wssdata.data.user.contactName));

                  ///  $http.get("/home")
               }).catch(function onError(wssdata, status, headers, config) {
                  alert("email not sent")
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
               });  // end of send email to change of password
         }
         return sendmail;

      }]) // end of send sms

      .service("maintaindata", ['$http', '$window', function ($http, $window) {
         var maintaindata = {};
         maintaindata.maintrec = function (recdet, chkitms, itmsdesc, itmstype, wsscompare) {
            return $http.post('/checkitem', [recdet, chkitms, itmsdesc, itmstype, wsscompare],
               { withCredentials: true }).success(function (req, res) {
                  //                 console.log("   REQ = " + JSON.stringify(req) + "   REs = " + JSON.stringify(res));
                  // wssok = JSON.stringify(req)
               })
         }
         return maintaindata

      }])

      .service('runnodet', ['$http', '$timeout', 'toaster', '$window', '$filter', function ($http, $timeout, toaster, $window, $filter) {
         return {
            getrundet: function (runoitm) {
               var runno = {};
               var dCol;
               var dRow;
               //GET RUNNing number 
               return $http.post('/getfile', { fltyp: "runnofl" })
                  .then(function (response) { //$http.get('/runno').then(function (response) {
                     var runnrc = response.data[0]
                     angular.forEach(runnrc, function (value, key) {
                        if (key == runoitm) {
                           dRow = key;
                           runno = value
                           runnrc[key] = parseInt(value) + 1
                           // var datarc = {}
                            //   console.log("runnrc = " + JSON.stringify( runnrc) + "       runoitm = " + runoitm + "        key = " + key + "     value = " + value)
                           // $http.put('/updrecord/' + runnrc._id, { datarc })
                           $http.put('/updrecord/' + runnrc._id, { fltyp: "runnofl", datarc: runnrc })
                              .then(function (response) {
                                 //    console.log("r3esponse from runnoflk = " + JSON.stringify(response.data))
                              })
                        }
                     })
                     //     console.log("runno 3 = " + + JSON.stringify(runno))
                     return runno
                  })

            },
            addrec: function (recdet, wssfile, retnavigate) {
               var datarc = recdet
//console.log("\n datarc = " + JSON.stringify(datarc) + "\n")

               // add the news details 
               $http.post('/addrecord', { datarc, fltyp: wssfile })
                  .then(function (response) {
                     //   $scope.success = true;
                     //   $scope.errors = false;
                     //  $scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                     recdet = {};
                     if (retnavigate != "") {
                        toaster.success('success', "Record Saved Successfully ");
                     }
                     if (retnavigate != "N" || retnavigate != "") {
                        $timeout(function () {
                           $window.location.href = retnavigate;
                        }, 2000);
                     }
                  });
            },
            modrec: function (recdet, wssfile, retnavigate) {
               // console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.pestdet))

               $http.put('/updrecord/' + recdet._id, { fltyp: wssfile, datarc: recdet })
                  .success(function (response) {
                     // $scope.success = true;
                     //  $scope.errors = false;
                     //$scope.errmsg = [{ "param": "successmsg", "msg": "Record Saved Successfully " }]
                     if (retnavigate != "N") {
                        toaster.success('success', "Record Saved Successfully ");
                     }
                     if (retnavigate != "N" && retnavigate != "") {
                        $timeout(function () {
                           $window.location.href = retnavigate
                        }, 2000);
                     }
                     /////////raz $window.location.href = "/dispfldcd#?wssmode=Maintain"
                  })
            },
            delrec: function (recdet, wssfile, retnavigate) {
               //    console.log("mode...." + $scope.wssmode + "     str = " + JSON.stringify($scope.pestdet))
               if (confirm("Are you sure you want to delete?")) {
                  // todo code for deletion
                  $http.post('/delrecord/' + recdet._id, { fltyp: wssfile, datarc: recdet })
                     .success(function (response) {
                        //   console.log("response = " + JSON.stringify(response))
                        // $scope.success = true;
                        // $scope.errors = false;
                        // $scope.errmsg = [{ "param": "successmsg", "msg": "Record Deleted Successfully " }]

                        console.log("doing deleteing")
                        if (retnavigate != "N") {
                           toaster.success('success', "Record Deleted Successfully ");
                        }
                        if (retnavigate != "N" && retnavigate != "") {
                           $timeout(function () {
                              $window.location.href = retnavigate
                           }, 2000);
                        }
                     })

               } // end of delete confirmation

            },
         }
      }])

})();


