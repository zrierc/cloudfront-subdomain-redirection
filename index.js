function getURLSearchParamsString(querystring) {
  var str = [];
  for (var param in querystring) {
    var query = querystring[param];
    var multiValue = query.multiValue;

    if (multiValue) {
      str.push(multiValue.map(item => param + '=' + item.value).join('&'));
    } else if (query.value === '') {
      str.push(param);
    } else {
      str.push(param + '=' + query.value);
    }
  }

  return str.join('&');
}

function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var uri = '';
  if (request.uri) uri = request.uri;

  if (headers['host']) {
    var host = headers['host'].value;
    var fullDomainName = host.split('.');
    var newUrl = '';
    var baseUrl = 'www.' + fullDomainName.slice(fullDomainName.length - 2).join('.');

    if (fullDomainName.length === 3 && fullDomainName[0] !== 'www') {
      if (Object.keys(request['querystring']).length === 0) {
        newUrl = 'https://' + baseUrl + '/' + fullDomainName[0] + uri;
      } else {
        newUrl = 'https://' + baseUrl + '/' + fullDomainName[0] + uri + '?' + getURLSearchParamsString(request.querystring);
      }

      var response = {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: { location: { value: newUrl } },
      };

      return response;
    }
  }
  return request;
}
