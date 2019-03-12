app.controller("Reportcontroller", function($scope,$http,$window,$cookies){
	console.log("+++++++++ vvvvvv++++++++++==");
	$scope.logout_fun = function()
  {
    window.location.href= "#!/"
  }
	console.log("cookies is",$cookies.get('user'));
	console.log("cookies is",$cookies.get('type'));
	if ($cookies.get('type') !== "admin") {
		$window.location.href = '#!/';
	}

	$scope.fetch_reports = function()
	{
				$http({
					url : api_address+"/fetch_report",
					method: "POST",
					header :{"content-type":"application/json"},
					data :{}
				}).then(function(response){
						console.log("+ ++++ response ++++",response);
						$scope.report_data = response.data.reports
				},function(error){
	// 				console.log("___________ error ______-",error;);
				})
	}
	$scope.fetch_reports()

});
