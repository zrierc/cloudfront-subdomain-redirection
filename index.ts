import {
  CloudFrontFunctionsEvent,
  CloudFrontFunctionsQuerystring,
} from 'aws-lambda';

function getURLSearchParamsString(querystring: CloudFrontFunctionsQuerystring) {
  let str = [];
  for (const param in querystring) {
    const query = querystring[param];
    const multiValue = query.multiValue;

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

function handler(event: CloudFrontFunctionsEvent) {
  const request = event.request;
  const headers = request.headers;
  let uri = '';
  if (request.uri) uri = request.uri;

  if (headers['host']) {
    const host = headers['host'].value;
    const fullDomainName = host.split('.');
    const baseUrl = fullDomainName.slice(fullDomainName.length - 2).join('.');
    let newUrl = '';

    if (fullDomainName.length === 3 && fullDomainName[0] !== 'www') {
      if (Object.keys(request['querystring']).length === 0) {
        newUrl = 'https://' + baseUrl + '/' + fullDomainName[0] + uri;
      } else {
        newUrl = 'https://' + baseUrl + '/' + fullDomainName[0] + uri + '?' + getURLSearchParamsString(request.querystring);
      }

      const response = {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: { location: { value: newUrl } },
      };

      return response;
    }
  }
  return request;
}
