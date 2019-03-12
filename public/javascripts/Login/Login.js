	app.controller("Logincontroller", function($scope,$http,$window,$cookies){
	$scope.Logincontrol ={Email:'',Password:'',Message:''};
	$scope.Logincontrol.Login = function(){
		var req = {url:'/login_api',method:"POST",headers:{"content-Type": "application/json",},data:{Data:$scope.Logincontrol}}
		$http(req).then(function(res) {
			if(res.data.status==200){
					console.log(" ++ ++++++++ ++",res.data.results[0]);
					$cookies.put('user',res.data.results[0]._id);
					$cookies.put('type',res.data.results[0].type);
					if (res.data.results[0].type === "student") {
						$window.location.href = '#!/Exam';
					}else {
						$window.location.href = '#!/Qustions';
					}
			}else{
				$scope.Logincontrol.Message=res.data.message;
			}
	    },function(err){
	  	 $scope.Logincontrol.Message='Please Check Internet Connection';
	   });
	}
});
