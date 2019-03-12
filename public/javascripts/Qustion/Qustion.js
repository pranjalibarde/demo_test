app.controller("Qustioncontroller", function($scope,$http,$window,$cookies){
	console.log("cookies is",$cookies.get('user'));
	console.log("cookies is",$cookies.get('type'));
	if ($cookies.get('type') !== "admin") {
		$window.location.href = '#!/';
	}

	$scope.Qustioncontrol ={};
	$scope.logout_fun = function()
  {
    window.location.href= "#!/"
  }

		$scope.showAdvanced = function(ev) {

	        $mdDialog.show({
	          controller: DialogController,
	          templateUrl: 'Add.html',
	          parent: angular.element(document.body),
	          targetEvent: ev,
	          clickOutsideToClose:true
	        })
	        .then(function(answer) {
	          $scope.status = 'You said the information was "' + answer + '".';
	        }, function() {
	          $scope.status = 'You cancelled the dialog.';
	        });
	      };
	      function DialogController($scope, $mdDialog) {
	        $scope.hide = function() {
	          $mdDialog.hide();
	        };

	        $scope.cancel = function() {
	          $mdDialog.cancel();
	        };

	        $scope.answer = function(answer) {
	          $mdDialog.hide(answer);
	        };
	      }

	    $scope.toggleMenu = function(){
      		$('.aside-menubar').toggleClass('collpase').toggleClass('expand')
      	}
      	$scope.hoverOpen = function(){
      		$('.aside-menubar').addClass('expand-hover')
      	}
      	$scope.hoverClose = function(){
      		$('.right-panel').hover(function(){
      			$('.aside-menubar').removeClass('expand-hover')
      		});
      		$('nav').hover(function(){
      			$('.aside-menubar').removeClass('expand-hover')
      		})
      	}

	  	 $scope.collapseAll = function(data) {
	        for (var i in $scope.accordianData) {
	          if ($scope.accordianData[i] != data) {
	            $scope.accordianData[i].expanded = false;
	          }
	        }
	        data.expanded = !data.expanded;
	      };

				$scope.going_to_add = function()
				{
					$scope.SingleMultiple = "Single";
					$scope.showSingle = true;
						$scope.question = undefined
				}

				function fetchQuestion()
				{
					var req = {url:api_address+'/fetch_questions',method:"POST",headers:{"content-Type": "application/json",}}
					$http(req).then(function(res) {
					console.log('data respponse=',res.data.data);
					$scope.accordianData=res.data.data;
						},function(err){
							console.log('in side error');
					 });
				}
				fetchQuestion();
				// $scope.accordianData = [{
				// 		"question": "What is your Name?",
				// 		"answare": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
				// 	}, {
				// 		"question": "What is your Last Name?",
				// 		"answare": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
				// 	}, {
				// 		"question": "What is your Sure Name?",
				// 		"answare": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
				// 	},{
				// 		"question": "What is your Sure Name?",
				// 		"answare": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
				// 	},{
				// 		"question": "What is your Sure Name?",
				// 		"answare": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
				// 	},{
				// 		"question": "What is your Sure Name?",
				// 		"answare": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
				// 	}];


					$scope.editQuestion = function(Qdata)
					{
						console.log('Qdata',Qdata);
						$scope.question = Qdata;
						$scope._id=Qdata._id;
						if ($scope.question.single === true) {
								$scope.SingleMultiple = "Single";
								$scope.showSingle = true;
						}else {
								$scope.SingleMultiple = "Multiple";
								$scope.showSingle = false;
						}
					}


				$scope.selctedOption = function(selected) {
						console.log('inside selctedOption',selected);
						if(selected === "Single")
						{
							$scope.showSingle = true;
						}
						else {
							$scope.showSingle = false;
						}
				}

				$scope.cancel_the_update = function()
				{
						$scope.question = undefined;
						fetchQuestion();
				}

$scope.saveQuestion = function()
{
	var questionData;
	if($scope.showSingle === true)
	{
			$scope.question.single=true;
			$scope.question.option1=undefined;
			$scope.question.option2=undefined;
			$scope.question.option3=undefined;
			$scope.question.option4=undefined;
	}
	else {
		$scope.question.single=false;
		$scope.question.singleAnswer=undefined;
	}
	console.log('$scope.question',$scope.question);
	if($scope._id)
	{
			$scope.question._id=$scope._id;
			var req = {url:api_address+'/edit_question',method:"POST",headers:{"content-Type": "application/json",},data:{question:$scope.question}}
			$http(req).then(function(res) {
			console.log('data respponse=',res);
			$scope.question = undefined;
			fetchQuestion();

				},function(err){
					console.log('in side error');
			 });
			 $scope._id='';
	}
	else {
		var req = {url:api_address+'/add_questions',method:"POST",headers:{"content-Type": "application/json",},data:{question:$scope.question}}
		$http(req).then(function(res) {
		console.log('data respponse=',res);
			$scope.question=undefined;
			fetchQuestion();

			},function(err){
				console.log('in side error');
		 });
		 $scope._id='';
	}
}

$scope.deleteQestion = function(deleteData)
{
	console.log('deleteQestion',deleteData);
		$scope.delete_id = deleteData._id;
}
$scope.deleteQestionData = function()
{
	var req = {url:api_address+'/delete_question',method:"POST",headers:{"content-Type": "application/json",},data:{id:$scope.delete_id}}
	$http(req).then(function(res) {
	console.log('data respponse=',res);
	fetchQuestion();
	$scope.question='';
		},function(err){
			console.log('in side error');
	 });
	 $scope.delete_id='';
	}


});
