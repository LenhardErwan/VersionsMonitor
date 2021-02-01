# Structure

## Overview

The application is separated in 2 main parts, the FrontEnd side with the Client and the BackEnd side with the Server.

![Application structure](img/structure.svg)

---

## Server

### Meteor

The application uses the Meteor framework that allows to quickly create an HTTP server. In addition, Meteor also manages a MongoDB database, and generates a websocket with each client to ensure data consistency between the client and the server. Meteor provides a set of methods to establish a secure and high-performance application :

#### [Collections](https://docs.meteor.com/api/collections.html) (Publish / Subscirbe)

In our application we use 3 different Collections :

- Users ([provided by Meteor](https://docs.meteor.com/api/accounts.html))
- Groups
- Monitors

We use Meteor's Accounts package that allows us to manage users very easily, however we add to each User a `groups` attribute that contains the names of all the groups to which it belongs. (see [User Schema](/data_schema/#user))

The `Groups` Collection allows you to group users together to apply a set of permissions, over multiple users, more simply. (see [Groups Schema](/data_schema/#groups))

The latest Collection, `Monitors` allows you to interact with all version monitors of the application. (see [Monitor Schema](/data_schema/#monitors))  
TODO - Explain in more details how monitorsPublication.js works

#### [Methods](https://docs.meteor.com/api/methods.html)

In our application we have many methods that can be divided into 3 main families :

- Users
- Groups
- Monitors

If you are an observer you will have noticed that these are the methods for each collection.

TODO - to be continued

---

## Client

On the client side of our application, we use four different node packages to render the user interface, React, Uniforms, Material-UI and Reach Router.

React is the main rendering library of this project. With it we can create interactive components and easily fetch and render data. We chose React because of it's simplicity, also we've been using it for all our latest JS project and we really like the way it works.

Uniforms is a powerfull react library able to generate and validate forms. It is also compatible with SimpleSchema-2 and Material-UI which are also used in this project.

TODO - Material-UI vs Semantic-UI, Reach Router
