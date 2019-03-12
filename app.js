var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dateFormat = require('dateformat');
var cors = require('cors')
var DateDiff = require('date-diff');

// var async = require('async');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var assert = require('assert');
var multer=require('multer')
var app = express();
var mongo=require('mongojs');
var ObjectID=mongo.ObjectID;
// var url = "mongodb://localhost:27017/Project1";
var db=mongo('localhost:27017/Exam',['user']);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors())



//  *********************** login api ***********************************

app.post("/login_api",function(req,res,next){
	var Data = req.body.Data;
	db.user.find({username:Data.Email,password:Data.Password}).toArray(function(err, result) {
		if(result.length){
			var responces = {status:200,message:'SucessFully hit api',results:result}
			res.send(responces);
		}else{
			var responces = {status:251,message:'Invalida UserName And Password'}
			res.send(responces);
		}
	});
});

//  *********************** login api ***********************************

//  *********************** user Registation ***********************************

app.post("/user_registation",function(req,res,next){
    console.log(" -- user_registation -- ",req.body);
    var firstname = req.body.user.firstname
    var mobileno = req.body.user.mobileno
    var email = req.body.user.email
    var password = req.body.user.password

    db.user.find({email:email}).toArray(function(error,resutsss){
      console.log("====",resutsss);
      if (resutsss.length === 0) {
          db.user.insert({firstname:firstname,mobileno:mobileno,username:email,email:email,password:password,type:"student"},function(err,user_registation){
            if (user_registation) {
              res.send({status:true,message:"Registation Successfull"})
            }else {
              res.send({status:false,message:"Registation fail"})
            }
          })

      }else {
        res.send({status:false,message:"Username Already exist"})
      }
    })

})

//  *********************** user Registation ***********************************


//  *********************** fetch questions ***********************************
app.post("/fetch_questions",function(req,res,next){
		db.question.find({}).toArray(function(error,question_result){
					res.send({status:"true",message:"all questions",data:question_result})
		})
})

//  *********************** fetch questions ***********************************

//  *********************** add  questions ***********************************

app.post("/add_questions",function(req,res,next){
	console.log("----------------------",req.body)
	var question = req.body.question.question
	var single = req.body.question.single
	var answer = req.body.question.answer
	var option1 = req.body.question.option1
	var option2 = req.body.question.option2
	var option3 = req.body.question.option3
	var option4 = req.body.question.option4

	db.question.insert({question:question,single:single,answer:answer,option1:option1,option2:option2,option3:option3,option4:option4},function(error,results){
		res.send({status:true,message:"Insert question Successfully"})
	})
})

//  *********************** add  questions ***********************************

//  *********************** edit questions ***********************************

app.post("/edit_question",function(req,res,next){
	console.log("_+_+_+",req.body);
	var id = req.body.question._id
	var question = req.body.question.question
	var single = req.body.question.single
	var answer = req.body.question.answer
	var option1 = req.body.question.option1
	var option2 = req.body.question.option2
	var option3 = req.body.question.option3
	var option4 = req.body.question.option4

	db.question.update({_id:ObjectID(id)},{$set:{question:question,single:single,answer:answer,option1:option1,option2:option2,option3:option3,option4:option4}},function(error,results){
		res.send({status:true,message:"Insert question Successfully"})
	})
})
//  *********************** edit questions ***********************************


//  *********************** delete questions ***********************************
app.post("/delete_question",function(req,res,next){

	var id = req.body.id
	db.question.remove({_id:ObjectID(id)},function(error,results){
		res.send({status:true,message:"Queston delete Successfully"})
	})

})
//  *********************** delete questions ***********************************


//  *********************** fetch user ***********************************
app.post("/fetch_user",function(req,res,next){
	console.log("++  fetch_user ++");
	db.user.find({type : "student"}).toArray(function(error,student_data){
			res.send({status:true,message:"Data Found",data:student_data})
	})
})
//  *********************** fetch user ***********************************


//  *********************** start test ***********************************
app.post("/start_test",function(req,res,next){
	console.log(" ================",req.body);
	var student_id = req.body.user_id;

	db.exams.find({student_id:student_id,status:false}).toArray(function(error,exam_results){
			if (exam_results.length !== 0) {
				var ex_startdate = new Date(exam_results[0].clean_Date)
				var curr_startdate = new Date()
				var diff = new DateDiff(ex_startdate, curr_startdate);
				console.log("---demotime ---- ",600+diff.seconds());
					res.send({status:true,message:"Old exam",remainigtime:parseInt(600+diff.seconds()),data:exam_results})
			}else {
				var date = dateFormat(new Date(),"yyyy-mm-dd")
				var time = dateFormat(new Date(),"hh:MM TT")
				var clean_Date = new Date()

				db.question.find({}).toArray(function(error,all_questoion){
					if (all_questoion.length == 0) {
							res.send({status:false,message:"Admin is add not question "})
					}else {
						db.user.find({_id:ObjectID(student_id)}).toArray(function(error,stude_data){
								db.exams.insert({status:false,clean_Date:clean_Date,student_name:stude_data[0].firstname,student_id:student_id,questions:all_questoion,date:date,time:time},function(error,exam_results){
									if (exam_results) {
										db.exams.find({_id:ObjectID(exam_results._id)}).toArray(function(error,start_exam_result){
											res.send({status:true,message:"start exam",remainigtime:600,data:start_exam_result})
										})
									}else {
										res.send({status:false,message:"Fail to start exam",data:[]})
									}

								})
						})

					}
				})
			}
	})
})
//  *********************** start test ***********************************


//  *********************** exam finished ***********************************
app.post("/exam_finished",function(req,res,next){
	var exam_id = req.body.exam_id;
		db.exams.update({_id:ObjectID(exam_id)},{$set:{status:true}},function(error,update_status){
					res.send({status:true,message:"Exam is finished Successfully"})
		})
})
//  *********************** exam finished ***********************************

// ********************* exam result fetch *******************************
app.post("/fetch_result",function(req,res,next){
	console.log("------- fetch_result -- ",req.body);
	var exam_id = req.body.exam_id;
	var true_answer = 0;
	var percents = 0;
	var false_answer = 0 ;
	db.exams.find({_id:ObjectID(exam_id)}).toArray(function(error,examresults){
		if (examresults.length === 0) {
				res.send({satus:false,message:"Exam id is not found"})
		}else{
			if (examresults[0].true_answer !== undefined) {
					res.send({status:true,message:"Data found",data:examresults})
			}else {
				console.log("------------ goning to calculate results ----");
				for (var i = 0; i < examresults[0].questions.length; i++) {
								if (examresults[0].questions[i].student_answer ===  examresults[0].questions[i].answer) {
											true_answer++;
								}else {
										false_answer++;
								}

								if (i === examresults[0].questions.length-1) {
									if (true_answer !== 0) {
										percents = (true_answer/examresults[0].questions.length)*100;
									}
									db.exams.update({_id:ObjectID(exam_id)},{$set:{true_answer:true_answer,false_answer:false_answer,percents:percents}},function(error,resultss){
										examresults[0].true_answer = true_answer
										examresults[0].false_answer = false_answer
										examresults[0].percents = percents
											res.send({status:true,message:"Data found",data:examresults})
									})
								}

				}

			}

		}



		// res.send({status:true,message:"Result found",data:examresults})
	})

})

// ********************* exam result fetch *******************************

app.post("/submit_answer",function(req,res,next){
			console.log(" +++ submit_answer +++++",req.body);

			var exam_id = req.body.exam_id;
			var question_id = req.body.question_id;
			var answer = req.body.answer

			db.exams.find({_id:ObjectID(exam_id)}).toArray(function(error,single_exam){
						if (single_exam.length === 0 ) {
									res.send({status:false,message:"Some thing gets wrong"})
						}else {
									for (var i = 0; i < single_exam[0].questions.length; i++) {
												if (single_exam[0].questions[i]._id.toString() === question_id) {
														single_exam[0].questions[i].student_answer = answer;
												}
												if (i === single_exam[0].questions.length-1) {
													db.exams.update({_id:ObjectID(exam_id)},{$set:{questions:single_exam[0].questions}},function(err,resss){
														res.send({status:true,message:"Answer store Successfully"})
													})
												}
									}
						}


			})

})
// ********************* fetch answer ************************

// *********************** fetch _report ***********
app.post("/fetch_report",function(feq,res,next){
		db.exams.find({}).toArray(function(error,reports){
			if (reports.length == 0) {
				res.send({status:false,message:"Data not found",reports:reports})
			}else {
				res.send({status:true,message:"Data found",reports:reports})
			}
		})

})

// *********************** fetch _report ***********



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen('5555',function(err){
	console.log('SERVER STARTED AT 5555');
});
