# VersionsMonitor

**Monitoring interface to track software version**

---

[![MadeWithMeteor](https://img.shields.io/badge/made_with-Meteor-323330?style=for-the-badge&logo=meteor)](https://meteor.com)
[![MadeWithReactJS](https://img.shields.io/badge/made_with-ReactJS-323330?style=for-the-badge&logo=React)](https://reactjs.org/)
[![MadeWithNodeJS](https://img.shields.io/badge/made_with-NodeJS-323330?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MadeWithJavaScript](https://img.shields.io/badge/made_with-JavaScript-323330?style=for-the-badge&logo=Javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](http://perso.crans.org/besson/LICENSE.html)

## Requirements

- VersionsMonitor was produced with NodeJs v10.19.0 and npm v6.14.9 (Not testesd with other versions)

## Build

```shell
meteor
```

## How It Works

To retrieve the version of an application or a software, 2 properties must be set:

- **URL**: the html page where the version is available.
- **Selector**: the CSS selector pointing to an html element containing the version number.

With these parameters a request is sent to the server. The server is in charge of fetching the HTML code and using the HTML selector to retrieve the version.

If needed you can also set a regex in case the html element contains text. For example : `[\d][\d.]+[\d]+`.

Once the processing is done the application receives the response from the server and displays the latest version number.

The advanced button allows you to set specific headers, useful to access pages usually inaccessible with your current OS.
