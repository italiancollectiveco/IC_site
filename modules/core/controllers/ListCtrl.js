'use strict';

angular
  .module('ic_co.controllers', [])
  .controller('ListCtrl', ['$rootScope', '$scope', '$http', '$state', '$stateParams', '$window', '$document', 
    function( $rootScope, $scope, $http, $state, $stateParams, $window, $document ) {
      $scope.number = [1,2,3,4,5,6,7];

      $scope.directionTracker;
      $scope.scrolling = false;
      $scope.humanScrolling = true;
      $scope.currentSection;

      $scope.initializeWindowSize = function() {
        $scope.windowHeight = $window.innerHeight;
        $scope.windowWidth = $window.innerWidth;
      };
      $scope.initializeWindowSize();

      angular.element($window).bind('resize', function() {
        $scope.initializeWindowSize();
        return $scope.$apply();
      });

      $scope.goToSection = function( section ) {
        console.log(' section loaded with section: ', section );
        clearTimeout( $scope.timeout );

        $scope.humanScrolling = false;

        var top = 0;
        var duration = 2000; //milliseconds

        var someElement = angular.element( document.getElementById( section ) );

        $document.scrollToElement( someElement, top, duration);
      };

      $scope.delay = 100; // delay before last scroll action
      $scope.timeout = null;

      $document.on('scroll', function() {
        // console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());

        var topPosition = $document.scrollTop();

        if ( !$scope.directionTracker ) {
          console.log('directionTracker was empty');
          $scope.directionTracker = topPosition;
        } else if ( topPosition === $scope.directionTracker ) {
           // same value so ignore
        } else if ( topPosition > $scope.directionTracker ) {

          if ( topPosition ) {

            console.log('going down');
            $scope.$apply();

            $scope.directionTracker = topPosition;

            if ( $scope.scrolling === false ) {
              // $scope.scrolling = true;
              clearTimeout( $scope.timeout );
              $scope.timeout = setTimeout(function(){
                // alert('scrolling stopped');
                console.log("lastscroll down");

                if ( $scope.humanScrolling ) {
                  $scope.goToSection('container-section-' + ( $scope.currentSection + 1) );
                } else {
                  $scope.timeout = setTimeout(function(){
                    $scope.humanScrolling = true;
                    clearTimeout( $scope.timeout );
                  }, 200 );
                }

              }, $scope.delay );
            }
          }

        } else if ( topPosition < $scope.directionTracker ) {

          if ( topPosition ) {

            console.log('going up');
            $scope.$apply();

            $scope.directionTracker = topPosition;

            if ( $scope.scrolling === false ) {
              // $scope.scrolling = true;
              clearTimeout( $scope.timeout );
              $scope.timeout = setTimeout(function(){
                // alert('scrolling stopped');
                console.log("lastscroll up");

                if ( $scope.humanScrolling ) {
                  $scope.goToSection('container-section-' + $scope.currentSection );
                } else {
                  $scope.timeout = setTimeout(function(){
                    $scope.humanScrolling = true;
                    clearTimeout( $scope.timeout );
                  }, 200 );
                }

              }, $scope.delay );
            }
          }

        }
      });

      // SECTION DECTECTION BY ID OF HYPERLINK
      $rootScope.$on('duScrollspy:becameActive', function($event, $element){
        console.log( $element[0].id );
        var currentID = JSON.parse( $element[0].id.split('-')[2] );
        console.log( currentID );
        $scope.currentSection = currentID;
      });
    }]);
