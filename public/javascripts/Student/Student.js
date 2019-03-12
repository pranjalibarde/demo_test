app.controller("Studentcontroller", function($scope,$http,$window,$cookies){
	console.log("______Studentcontroller _--");
	$scope.logout_fun = function()
  {
    window.location.href= "#!/"
  }
	console.log("cookies is",$cookies.get('user'));
	console.log("cookies is",$cookies.get('type'));
	if ($cookies.get('type') !== "admin") {
		$window.location.href = '#!/';
	}

	//
	$scope.fetch_students = function()
	{
				$http({
					url : api_address+"/fetch_user",
					method: "POST",
					header :{"content-type":"application/json"},
					data :{}
				}).then(function(response){
						console.log("+ ++++ response ++++",response);
						if (response.data.data.length === 0) {

						}else{
								$scope.users = response.data.data
						}
				},function(error){
	// 				console.log("___________ error ______-",error;);
				})
	}
	$scope.fetch_students()


});
