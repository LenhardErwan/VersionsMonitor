# VersionsMonitor

**Monitoring interface for the latest versions of any software or applications**

***

[![MadeWithReactJS](https://img.shields.io/badge/made_with-ReactJS-323330?style=for-the-badge&logo=React)](https://reactjs.org/)
[![MadeWithWebpack](https://img.shields.io/badge/made_with-Webpack-323330?style=for-the-badge&logo=webpack)](https://webpack.js.org/)
[![MadeWithJavaScript](https://img.shields.io/badge/made_with-JavaScript-323330?style=for-the-badge&logo=Javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MadeWithNodeJS](https://img.shields.io/badge/made_with-NodeJS-323330?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](http://perso.crans.org/besson/LICENSE.html)

## Required

- This project requires a version of NodeJS >= 12.18.3 (not tested with earlier versions).
- This project requires a connection to a PostgreSQL database in version 12.4 (not tested with earlier versions).

## Build

This project is divided into two parts, a client part and a server part. You must first build the client part before you can start the server. Here is the list of commands to be executed:

Install dependencies:

```shell
npm install
```

Build production app:

```shell
npm run build-prod
```

Results of build are in `server/public`

## Development

Run client and server tools development (one server for client part and an other for the server part):

```shell
npm run dev
```

There are other scripts in the `package.json` file to help you with development. They are explicit enough for you to understand them.

## Run

Before running a command in the console you have to create 2 files from the 2 `.example` files at the root of the project.
So at the root you should have `.env`, `.env.example`, `dev.env` and finally `dev.env.example`.
Once the 2 new files created modify them with the parameters you wanted.

Once the build (dev or prod) is done you just have to launch the server, for that you just have to type the following commands (Run only HTTP server):

```shell
npm run start OR npm start
```

To use the HTTPS server please use the following command (To avoid certificate problems set your own certificates in `server/ressources/`):

```shell
npm run start-https
```

## How It Works

To retrieve the version of an application or software, the application needs 2 properties:

- **URL**: that will allow to retrieve the HTML code where the version is located
- **Selector**: the CSS selector that points to the element that contains the version.

With these parameters a request is sent to the server. The server is in charge of fetching the HTML code of the page. Then using the CSS selector it retrieves the element that contains the version. Then if a Regex is passed, the result is refined (only takes into consideration the first parenthesis block). Once the processing is finished the application receives the response from the server containing the version number.
You will have noticed that there is an advanced button that allows you to put particular headers, it is especially useful when the page you want to retrieve is generated depending on the OS with which the user accesses it.<br/>
When the application detects a new version you will see a popup appear to let you know.

## How To Use It

- Open create menu with the "+";
- Give a name;
- Copy the URL of the page on which the version number is located;
- Copy CSS Selector. To do this, on Firefox, you have to right click -> 'inspect element' on the version number. Right click on the tag in the development tool, drag the mouse on 'Copy' and click on 'CSS Selector'. On Chrome: 'inspect', 'Copy' -> 'Copy selector'; <br/>
<img src="./client/src/images/inspect.png" height="300px" style="margin-right: 4rem"/> <img src="./client/src/images/selector.png" height="300px"/>
- Can add a regex. This on is very usefull: `([\d\.]+)` (keep only numbers and .)
- Can add your version number 
- Can set URL to the application's logo
- Click on 'ADVANCED' to be able to put custom headers
