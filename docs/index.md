# Home

---

## Overview

**VersionsMonitor** is an application that allows you to follow the different **versions** of **any tool**, if it is **accessible on the web**.

### Host anywhere

**VersionsMonitor** is based on **JavaScript** and uses the [**Meteor**](https://www.meteor.com/) framework. So all you need is to install [**NodeJS**](https://nodejs.org) and [**Meteor**](https://www.meteor.com/developers/install) to run the application.

---

## Structure

The application is separated in 2 main parts, the FrontEnd side with the Client and the BackEnd side with the Server.

![Application structure](img/structure.png)

---

## How the application retrieves versions ?

To retrieve the version, the application needs the following parameters:

- URL → The url of the web page that contains the version
- Selector → The CSS selector that points to the HTML element that contains the
- Regex → A regex that allows to refine the result
- Headers → HTTP headers that allow to access a page by modifying the request headers

Once these parameters have been given to the application, the function follows the following logic:

![Get version - State Machine Diagram](img/getNewestVersion.png)
