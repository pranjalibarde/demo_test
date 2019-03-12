	app.controller("signupcontroller", function($scope,fileReader,$http,$window){
						$scope.imageSrc = "";

				    $scope.$on("fileProgress", function(e, progress) {
				      $scope.progress = progress.loaded / progress.total;

						});

						$scope.registation_save = function()
						{
							console.log("-------------------",$scope.imageSrc);

								$scope.reg_msg_firstname = ""
								$scope.reg_msg_mobileno = ""
								$scope.reg_msg_email = ""
								$scope.reg_msg_password = ""
								$scope.reg_msg_repassword = ""
								$scope.not_match_password =  ""

								if ($scope.user === undefined) {
									$scope.reg_msg_firstname = "Enter the firstname"
									$scope.reg_msg_mobileno = "Enter the mobile no."
									$scope.reg_msg_email = "Enter the email"
									$scope.reg_msg_password = "Enter the password"
								}else {
										if ($scope.user.firstname === undefined || $scope.user.firstname.length === 0 ) {
												$scope.reg_msg_firstname = "Enter the firstname"
										}else {
												$scope.reg_msg_firstname = ""
										}
										console.log(("+++++++++++++++++++",$scope.user));
										if ($scope.user.mobileno === undefined || $scope.user.mobileno === null ) {
											$scope.reg_msg_mobileno = "Enter the mobile no."

										}else {
											$scope.reg_msg_mobileno = ""

										}

										if ($scope.user.email === undefined || $scope.user.email.length === 0 ) {
												$scope.reg_msg_email = "Enter the email"
										}else {
												$scope.reg_msg_email = ""
										}

										if ($scope.user.password === undefined || $scope.user.password.length === 0 ) {
												$scope.reg_msg_password = "Enter the passowrd"
										}else {
											$scope.reg_msg_password = ""
										}


										if ($scope.reg_msg_firstname === "" && $scope.reg_msg_mobileno === "" && $scope.reg_msg_email === "" && $scope.reg_msg_password === "") {
												console.log($scope.user );
												$http({
													url :api_address+"/user_registation",
													method:"POST",
													header :{"content-type":"applicaiton/json"},
													data : {user:$scope.user}
												}).then(function(res){
													console.log("-----",res);
													if (res.data.status == true) {
														window.location.href = "#!/"
														$scope.registration_ress = res.data.message
														$scope.user = undefined
													}else {
														$scope.registration_ress = res.data.message
													}

												},function(error){
														console.log("-----");
												})

										}

								}

						}

});


  		app.directive("ngFileSelect", function(fileReader, $timeout) {
	    return {
	      scope: {
	        ngModel: '='
	      },
	      link: function($scope, el) {
	        function getFile(file) {
	          fileReader.readAsDataUrl(file, $scope)
	            .then(function(result) {
	              $timeout(function() {
	                $scope.ngModel = result;
	              });
	            });
	        }

	        el.bind("change", function(e) {
	          var file = (e.srcElement || e.target).files[0];
	          getFile(file);
	        });
	      }
	    };
	  });

	app.factory("fileReader", function($q, $log) {
	  var onLoad = function(reader, deferred, scope) {
	    return function() {
	      scope.$apply(function() {
	        deferred.resolve(reader.result);
	      });
	    };
	  };

	  var onError = function(reader, deferred, scope) {
	    return function() {
	      scope.$apply(function() {
	        deferred.reject(reader.result);
	      });
	    };
	  };

	  var onProgress = function(reader, scope) {
	    return function(event) {
	      scope.$broadcast("fileProgress", {
	        total: event.total,
	        loaded: event.loaded
	      });
	    };
	  };

	  var getReader = function(deferred, scope) {
	    var reader = new FileReader();
	    reader.onload = onLoad(reader, deferred, scope);
	    reader.onerror = onError(reader, deferred, scope);
	    reader.onprogress = onProgress(reader, scope);
	    return reader;
	  };

	  var readAsDataURL = function(file, scope) {
	    var deferred = $q.defer();

	    var reader = getReader(deferred, scope);
	    reader.readAsDataURL(file);

	    return deferred.promise;
	  };

	  return {
	    readAsDataUrl: readAsDataURL
	  };
	});
