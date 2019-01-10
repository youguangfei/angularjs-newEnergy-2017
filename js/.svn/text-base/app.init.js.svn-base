var App = angular.module('angle', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'tmh.dynamicLocale',
    'ui.utils',
    'lightGrid',
    'angularBootstrapNavTree',
    'ngNotificationsBar',
    'ngSelectCustomModule',
    'customCaptchaModule',
    'ng-tree-selection',
    'datePickers',
//  'selectLink',
    'angular-drag' ,
    'pagination',
    'selectBlockModule',
    'fileUploadUI',
   	'ngRange',
   	"inputSearchModule"
  ]);

App.run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache','$cookieStore','notifications', function ($rootScope, $state, $stateParams, $window, $templateCache,$cookieStore,notifications) {
  // Set reference to access them from any scope
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$storage = $window.localStorage;


  // Scope Globals
  // ----------------------------------- 
  $rootScope.app = {
    name: '桑德新能源云平台',
    description: '',
    year: ((new Date()).getFullYear()),
    layout: {
      isFixed: true,
      isCollapsed: false,
      isBoxed: false,
      isRTL: false,
      horizontal: false,
      isFloat: false,
      asideHover: false,
      isCollapse: false,
      theme: null
    },
    useFullLayout: false,
    hiddenFooter: false,
  };
  $rootScope.user = {
    name: $cookieStore.get("name") 
  }; 
}]);
//故障等级
var faultRank = 2110633462051142;
var faultLevel = 2110633462051142;
//故障类型
var faultType= 1389363422344538;
//故障性质
var faultCharacter = 1291402041208984;
//生产批次号
var  CAR_DIC_PC = 10000;
//车辆型号
var CAR_DIC_MODEL = 10001;
// 驱动电机型号
var CAR_DIC_DRIVEMOTOR_TYPE = 10002;
//车载储能装置类型冷却方式
var CAR_DIC_EC_TYPE = 10003;
//驱动电机冷却方式
var CAR_DIC_DMC_TYPE = 10004;
//驱动电机部署形式
var CAR_DIC_DMA = 10005;
//车载储能类型
var CAR_DIC_EG_TYPE = 10006;
//车辆使用单位
var CAR_DIC_UNIT =10007;
//车辆使用方式
var CAR_DIC_USE_TYPE = 10008;
//故障统计
var FAULT_TYPE_LIST = 1572390747522350;
//服务网点类型
var SERVICE_TYPE = 1778446506965830;
//消息总数量
var messageNumber;