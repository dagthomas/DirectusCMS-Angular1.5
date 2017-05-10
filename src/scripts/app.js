// Import Angular and Angular Modules
import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import ngSanitize from "angular-sanitize";

// Import our filters, services, controllers, etc..
import GetDirectusData from './components/directuscms.service.js';
import TrustFilter from './components/trustedhtml.filter.js';

// Import our partials into .js
import newArticle from '../partials/new.html';
import newsSingle from '../partials/news.html';
import newsList from '../partials/newslist.html';

// Import our .css classes
import "angular-material/angular-material.css";
import "../styles/app.scss";

(function () {
  'use strict';
  angular.module("dtoApp", [ngMaterial, ngSanitize, uiRouter])
    .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$compileProvider', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $compileProvider, $sceDelegateProvider) {

      // Set default route to /newslist
      $urlRouterProvider.otherwise("/newslist");

      // Managing states with Angular UI Router 
      $stateProvider
        .state('newslist', {
          url: "/newslist",
          template: newsList,
          controller: "DirectusCMS"
        })
        .state('news', {
          url: "/news/:id/:title",
          template: newsSingle,
          controller: "DirectusCMS"
        })
        .state('new', {
          url: "/new",
          template: newArticle,
          controller: "DirectusCMS"
        });
    }])
    .controller("DirectusCMS", ['$scope', 'getDirectusData', '$stateParams', '$mdDialog', function ($scope, getDirectusData, $stateParams, $mdDialog) {

      // Just a function to lowercase, underline the titles in the url 
      $scope.replaceTitle = function (string) {
        return string.replace(/ /g, "_").toLowerCase();
      }

      // Sending an item to the GraphCMS
      $scope.sendItem = function (item) {
        var missing = {};
        if (item.title && item.body) {
          $scope.directusCMSQuery('mutation { createNews(title:"' + item.title + '", body:"' + item.body + '") { id title body } }', 'newsCreated', 'createNews')
        } else {
          $scope.showAlert('You have to fill out all the fields', 'Error');
        }
      }
      $scope.showAlert = function (message, type) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(type)
          .textContent(message)
          .ariaLabel(type + ' dialog')
          .ok('Got it!')
        );
      };
      // Create a dynamic function for callbacks from GraphCMS
      $scope.directusCMSQuery = function (scopename, type, id) {
        getDirectusData.directusCMSQuery(type, id).then(
          function (answer) {
            if (answer.Active) {
              $scope[scopename] = answer.data;
            } else {
              $scope[scopename] = answer.data;
            }
          },
          function (reason) {
            $scope.error = reason.errors;
          }
        );
      }

      // Posts Query, Container (Scope name) and CMS Objects
      $scope.directusCMSQuery('nyheter', 'Nyheter');

      // If there is a stateparameter called id, get specific news object
      if ($stateParams.id) {
        $scope.directusCMSQuery('nyhet', 'Nyheter', $stateParams.id);
      }
    }])
    // Load our filters, services, controllers, etc..
    .service('getDirectusData', GetDirectusData)
    .filter('trustFilter', TrustFilter);
})();
