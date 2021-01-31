# Structure

## Overview

TODO - Explain the strict necessary

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

TODO - Explain client part
