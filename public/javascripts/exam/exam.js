	app.controller("examcontroller", function($scope,$http,$window,$cookies,$interval){

		console.log("cookies is",$cookies.get('user'));
		console.log("cookies is",$cookies.get('type'));
		var exam_ids ;
		$scope.show_test  = true
		$scope.countDown = 10;



		$scope.store_answer = function(questionid,studentans)
		{
					$http({
						url: api_address+"/submit_answer",
						method : "POST",
						header :{"content-type":"application/json"},
						data :{ exam_id:exam_ids,question_id:questionid,answer:studentans}
					}).then(function(response){
						console.log("++++++ response +++++",response);
					},function(error){

					})
		}

		$scope.fetch_result = function()
		{
				$http({
					url: api_address+"/fetch_result",
					method : "POST",
					header :{"content-type":"application/json"},
					data :{ exam_id:exam_ids}
				}).then(function(response){
					console.log("++++++ fetch_result +++++",response.data.data[0].false_answer);
					$scope.true_answer = response.data.data[0].true_answer
					$scope.total_question = response.data.data[0].questions.length
					$scope.show_test  = false

				},function(error){

				})
		}




		$scope.gotopage = function(pageis)
		{
					window.location.href = pageis
		}



				console.log("+++++++ exam controller ++++++++++");
				var start_test = function(){
					var user_id =$cookies.get('user')

					$http({
						url: api_address+"/start_test",
						method : "POST",
						header :{"content-type":"application/json"},
						data :{ user_id:user_id}
					}).then(function(response){
						console.log("++++++ response +++++",response.data.remainigtime);
						if (response.data.remainigtime>0) {
							$scope.countDown = response.data.remainigtime;
						}else if (response.data.remainigtime <= 0 ) {
							$scope.finished_exam()
						}
						$scope.student_name = response.data.data[0].student_name
						exam_ids = response.data.data[0]._id
						$scope.exam_questions = response.data.data[0].questions
					},function(error){

					})
				}
				if ($cookies.get('type') === "student") {
						start_test()
				}else {
					window.location.herf = "#!/"
				}


				$scope.finished_exam = function()
				{
								$http({
									url: api_address+"/exam_finished",
									method : "POST",
									header :{"content-type":"application/json"},
									data :{ exam_id:exam_ids}
								}).then(function(response){
									console.log("++++++ response +++++",response);
									$scope.fetch_result()
									$interval.cancel(timer);

								},function(error){

								})
				}

		var timer = $interval(function(){
				$scope.countDown--;
				console.log($scope.countDown)
				if ($scope.countDown === 0) {
					$scope.finished_exam()
					$interval.cancel(timer);
				}

		},1000);


});
