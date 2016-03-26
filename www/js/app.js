var Utils = Utils || {};

Utils.Random = {
   next: function(min, max) {
      return Math.floor(Math.random() * (max-min+1) + min);
   },
   shuffle: function(a){
      var j, x, i;
      for (i = a.length; i; i -= 1) {
         j = Math.floor(Math.random() * i);
         x = a[i - 1];
         a[i - 1] = a[j];
         a[j] = x;
      }
      return a;
   }
};

Utils.File = {
   setLocalStorageData: function(key, value) {
      localStorage.setItem(key, value);
   },

   getLocalStorageData: function(key) {
      return localStorage.getItem(key);
   }
}




// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller("expression", function($scope){
    
   var iLength = Utils.Random.next(1,3);

   $scope.buildExpression = function(){
      
      $scope.getXP();
      
      var level      = $scope.xp;
    
      $scope.options = new Array(5);
      
      $scope.expression = "";
      
      $scope.result  = 0;
      
      var matrix = new Array();
      
      //Build matrix of expressions
      for (var i = 1; i <= iLength; i++)
      {
         var jLength   = Utils.Random.next(1,3);
         var exprValue = 0;
         var exprText  = "(";
         var exprArray = new Array();
         
         console.log("(");
         
         for (var j = 1; j <= jLength; j++)
         {
               var value = Utils.Random.next(1,level);
               
               
               switch(Utils.Random.next(1,2))
               {
                  case 1:
                     exprValue += value;
                     exprText  += " + " + value;
                     console.log("+");
                     exprArray.push(value);
                     break;
                  case 2:
                     exprValue -= value;
                     exprText  += " - " + value;
                     console.log("-");
                     exprArray.push(value * -1);
                     break;
               } 
               
               console.log(value);
         }
         
         matrix.push(exprArray);
         
         exprText += ")";
         console.log(")");
         
         switch(Utils.Random.next(1,2))
         {
               case 1:
                  $scope.expression += (" + " + exprText);
                  $scope.result += exprValue;
                  console.log("+");
                  break;
               case 2:
                  $scope.expression += (" - " + exprText);
                  $scope.result -= exprValue;
                  console.log("-");
                  break;
         }
         
      }
      
      var possibleOptions = new Array();
      
      possibleOptions.push($scope.result);
      
      for(var i = 1; i <= 4; i++)
      {
         var falseResult = 0;
         
         //Do a calc with the same values but diffent signals
         for(var index = 0; index < matrix.length; index++)
         {
               var jResult = 0;
               
               for(var jIndex = 0; jIndex < matrix[index].length; jIndex++)
               {
                  switch(Utils.Random.next(1,2))
                  {
                     case 1:
                           jResult += matrix[index][jIndex];
                           break;
                     case 2:
                           jResult -= matrix[index][jIndex];
                           break;
                  }
               }
               
               switch(Utils.Random.next(1,2))
               {
                  case 1:
                     falseResult += jResult;
                     break;
                  case 2:
                     falseResult -= jResult;
                     break;
               }
         }
         
         while(true)
         {
            if (possibleOptions.indexOf(falseResult) >= 0)
            {
               switch(Utils.Random.next(1,3))
               {
                  case 1:
                     falseResult++;
                     break;
                  case 2:
                     falseResult--;
                     break;
                  case 3:
                     falseResult * -1;
                     break;
               }
            }
            else
            {
               break;
            }
         }
         
         possibleOptions.push(falseResult);
         
      }
      
      $scope.options = Utils.Random.shuffle(possibleOptions);
    
    }
    
    $scope.selectOption = function(index){
      if ($scope.options[index] == $scope.result)
      {
         document.getElementById("imgWrong").style = "display: none";
         document.getElementById("imgRight").style = "display: block";
         $scope.updateXP(+1);
         $scope.buildExpression();
         
         setTimeout(function(){
            document.getElementById("imgRight").style = "display: none";
         }, 2000);
      }
      else
      {
         document.getElementById("imgRight").style = "display: none";
         document.getElementById("imgWrong").style = "display: block";
         $scope.rightanswer = "Right Answer was " + $scope.result;
         $scope.updateXP(-1);
         $scope.buildExpression();
            
         setTimeout(function(){
            document.getElementById("imgWrong").style = "display: none";
            document.getElementById("divRightAnswer").style = "display: none";
         }, 2000);
      }
    };
    
    $scope.updateXP = function(value){
       
       $scope.getXP();
         
       $scope.xp += value;
       
       if ($scope.xp < 1)
         $scope.xp = 1;
       
       Utils.File.setLocalStorageData("xp",$scope.xp);
       
    }  
    
    $scope.getXP = function(){
       
       $scope.xp = Utils.File.getLocalStorageData("xp");
       
       if ($scope.xp == undefined || $scope.xp == null)
         $scope.xp = 1;
       else
         $scope.xp = parseInt($scope.xp);
         
    }
    
    $scope.buildExpression();
    $scope.updateXP(0);
    
})
