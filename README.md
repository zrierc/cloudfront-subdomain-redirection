# CloudFront Subdomain Redirection

## Overview

This is CloudFront Function that maps subdomain and redirects it into a specific path. For example, if the user access `https://about.mysite.com` it will automatically redirect to `https://mysite.com/about`.

Here's another example that this function support:

- `contact.mysite.com -> mysite.com/contact`
- `career.mysite.com/latest -> mysite.com/career/latest`
- `skills.mysite.com/programming?sort=name&foo=bar -> mysite.com/skills/programming?sort=name&foo=bar`

## How It Works

> **Note**: The function associated with a CloudFront distribution with `viewer request` as the **event type**.

This function will look up at [request object](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html#functions-event-structure-request). Get all necesarry properties such as uri, query string, and host headers. Manipulate them into new URL and return HTTP status code `301` which will redirect to the new URL.

## Setup / Installation

1. Compile `index.ts` in this repository to `js` or you can copy [this `index.js`](https://github.com/zrierc/cloudfront-subdomain-redirection/blob/index.js) that ready to use.

2. Create CloudFront function. Paste `index.js` that you copied before in function code section.

   > Follow [this guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/create-function.html) to create CloudFront Functions.

3. Associate and publish CloudFront function that you create before with the following settings:

   - Distribution: \<select distribution that you want to associate with the function\>

   - Event Type: `Viewer request`

     > **Note** Make sure you choose `Viewer request` or the function won't work.

   - Cache behavior: \<select a cache behaviour that you use or you can use `Default (*)` instead\>

     > For more detail step how to associate function please visit [this guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/associate-function.html).

## FAQ

#### Can I customize the code?

Yes, you can. Make sure you use `ECMAScript (ES) v5.1` because when this code was written, CloudFront Functions [had many limitations](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html).

#### The example above only uses the root domain. Is it possible to use `www` as the main/base domain?

Yes. It is possible use `www` as main/base domain (for example: `www.mysite.com`). Simply change variable `baseUrl` inside `handler` function:

```js
function handler(event) {
  ...
  var baseUrl =
    'www.' + fullDomainName.slice(fullDomainName.length - 2).join('.');
  ...
}
```

#### Does this support fourth level domains (e.g. `foo.bar.mysite.com`)?

No. This functions only support third level domain.

#### Nooo. ES5 sucks. I only write JS using ES6 or above

Use what can be used and supported.

![](https://tenor.com/bOnH7.gif)

## Contribution

If you have any ideas/questions/found any problem or want to improve this code let me know by opening PR/issue - your feedback and contributions are welcome!
