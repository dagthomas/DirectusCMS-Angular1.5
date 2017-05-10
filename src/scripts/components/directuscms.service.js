// GraphCMS Endpoint
var endpoint = 'http://blog.theaxe.men/api/1/tables/';
var readToken = 'NDHzJOScwykq9MP7';

export default class GetDirectusData {
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  // Service for getting data from GraphCMS
  directusCMSQuery(type, id) {
    if (id) {
      id = '/' + id;
    } else {
      id = '';
    }
    var promise = this.$http.get(endpoint + type + '/rows' + id + '?access_token=' + readToken),
      deferObject = deferObject || this.$q.defer();
    promise.then(
      function (answer) {
        deferObject.resolve(answer);
      },
      function (reason) {
        deferObject.reject(reason);
      });

    return deferObject.promise;
  }
}

GetDirectusData.$inject = ['$http', '$q'];
