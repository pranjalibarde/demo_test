var app = angular.module("MainApp",["ngRoute",'ngMaterial', 'ngMessages', 'material.svgAssetsCache',"ngCookies"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "html/Login/Login.html",
        controller : "Logincontroller"
    })
    .when("/Signup", {
        templateUrl : "html/Signup/Signup.html",
        controller : "signupcontroller"
    })
    .when("/Qustions", {
        templateUrl : "html/Qustions/Qustions.html",
        controller : "Qustioncontroller"
    })
    .when("/Students", {
        templateUrl : "html/Students/Students.html",
        controller : "Studentcontroller"
    })
    .when("/Report", {
        templateUrl : "html/Report/Report.html",
        controller : "Reportcontroller"
    })
    .when("/Exam", {
        templateUrl : "html/exam/exam.html",
        controller : "examcontroller"
    })
});
var api_address = "http://localhost:5555"
// var api_address = "http://192.168.43.117:5555"
app.controller("MainController",function($scope,$cookies){
    $scope.logout_fun = function()
    {
      window.location.href="#!/"
    }


});
