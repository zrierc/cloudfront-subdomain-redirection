import { CloudFrontFunctionsEvent } from 'aws-lambda';

function handler(event: CloudFrontFunctionsEvent) {
  const request = event.request;
  const headers = request.headers;
  let uri = '';
  if (request.uri) uri = request.uri;

  if (headers['host']) {
    const host = headers['host'].value;
    const fullDomainName = host.split('.');
    let newUrl = '';
    const baseUrl = fullDomainName.slice(1).join('.');

    if (fullDomainName.length === 3 && fullDomainName[0] !== 'www') {
      newUrl = 'https://' + baseUrl + '/' + fullDomainName[0] + uri;

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
