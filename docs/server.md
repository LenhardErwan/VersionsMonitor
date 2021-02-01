# Server

## Meteor

The application uses the Meteor framework that allows to quickly create an HTTP server. In addition, Meteor also manages a MongoDB database, and generates a websocket with each client to ensure data consistency between the client and the server. Meteor provides a set of methods to establish a secure and high-performance application :

### [Collections](https://docs.meteor.com/api/collections.html) (Publish / Subscirbe)

In our application we use 3 different Collections :

- Users ([provided by Meteor](https://docs.meteor.com/api/accounts.html))
- Groups
- Monitors

We use Meteor's Accounts package that allows us to manage users very easily, however we add to each User a `groups` attribute that contains the names of all the groups to which it belongs. (see [User Schema](#user))

The `Groups` Collection allows you to group users together to apply a set of permissions, over multiple users, more simply. (see [Groups Schema](#group))

The latest Collection, `Monitors` allows you to interact with all version monitors of the application. (see [Monitor Schema](#monitor))  

The application uses permissions to provide to the client only what he can see. Permissions are managed in the `Groups` Collection and monitors are in the `Monitor` Collection. Therefore it is necessary to create and publish a collection directly from the code (and not directly publish the `Monitors` Collection), otherwise the client will not be able to have both a Hook on `Groups` and `Monitors` at the same time ([Doc](https://docs.meteor.com/api/pubsub.html#Meteor-publish)).  
To do this it is necessary to not return any value in the publish. And define with the functions added, changed and removed, a Collection.

```js
const userMonitors = new Map();

const groups = GroupsCollection.find({ name: { $in: group_names } });

for (const group of groups) {
  if (group.monitorPerms) {
    for (const perm of group.monitorPerms) {
      if (perm.canView) {
        const monitor = MonitorsCollection.findOne({ _id: perm.monitor_id });
        if (monitor) {
          this.added('monitors', monitor._id, monitor);
          userMonitors.set(monitor._id, monitor);
        }
      }
    }
  }
}
```

The code above allows to initialize the collection (here `monitors`) according to the user's permissions. The `userMonitors` variable is a Map, that will allow us to store locally all the user's monitors to make it easier for us to add, modify and remove monitors.

```js
const handleMonitor = MonitorsCollection.find().observeChanges({
  changed: (id, monitor) => {
    if (userMonitors.has(id)) {
      this.changed('monitors', id, monitor);
    }
  },
});
```

The preceding code allows you to observe any modification on the `Monitors` Collection. If a monitor, on which the user has viewing permissions, is modified, it will be detected and we modify the local Collection `monitors` accordingly.

```js
const handleGroups = groups.observe({
  changed: (newGroup, oldGroup) => {
    if (newGroup.monitorPerms && oldGroup.monitorPerms) {
      // Get differences
      const added = newGroup.monitorPerms.filter(
        (x) =>
          !oldGroup.monitorPerms.some((y) => y.monitor_id === x.monitor_id)
      );
      const removed = oldGroup.monitorPerms.filter(
        (x) =>
          !newGroup.monitorPerms.some((y) => y.monitor_id === x.monitor_id)
      );
      const newPerms = newGroup.monitorPerms.filter((x) =>
        oldGroup.monitorPerms.some(
          (y) => y.monitor_id === x.monitor_id && y.canView !== x.canView
        )
      );

      if (added.length > 0) {
        for (const perms of added) {
          if (perms.canView) {
            const monitor = MonitorsCollection.findOne({
              _id: perms.monitor_id,
            });
            if (monitor) {
              this.added('monitors', monitor._id, monitor);
              userMonitors.set(monitor._id, monitor);
            }
          }
        }
      }
      if (removed.length > 0) {
        for (const perms of removed) {
          this.removed('monitors', perms.monitor_id);
          userMonitors.delete(perms.monitor_id);
        }
      }
      if (newPerms.length > 0) {
        for (const perms of newPerms) {
          if (perms.canView) {
            const monitor = MonitorsCollection.findOne({
              _id: perms.monitor_id,
            });
            if (monitor) {
              this.added('monitors', monitor._id, monitor);
              userMonitors.set(monitor._id, monitor);
            }
          } else {
            this.removed('monitors', perms.monitor_id);
            userMonitors.delete(perms.monitor_id);
          }
        }
      }
    }
  },
});
```

Here it is the same but for the `Groups` Collection. We just have to get the added, modified and removed differently because the permissions are within a list.

```js
this.ready();
this.onStop(() => {
  handleGroups.stop();
  handleMonitor.stop();
});
```

This last code snippet simply allows to tell that the Local Collection is ready and that in case of a stop of the subscribe, we stop looking at the modifications on the Collections.

And voilà, we have created a 'Monitors' Collection that adapts to the user's rights.

---

### [Methods](https://docs.meteor.com/api/methods.html)

In our application we have many methods that can be divided into 3 main families :

- Users
- Groups
- Monitors

If you are an observer you will have noticed that these are the methods for each collection.

- **Users**
- **Groups**
- **Monitors**

If you are an observer you will have noticed that these are the methods for each collection.

For the **Users** methods we have :

- `users.insert(user)` : Create a new user
- `users.update(userId, user)` : Update a user
- `users.delete(userId)` : Delete a user
- `user.groups.add(username, group_names)` : Add a list of groups to a user
- `user.groups.remove(username, group_name)` : Delete a list of groups to a user
- `user.isAdmin(userId)` : User has administrator permissions
- `user.canManage(userId, group)` : User has permissions to manage the group.
- `user.canCreate.nomulti(userId)` : User has permissions to create the monitor in his personal group.
- `user.canCreate.multi(userId, group)` : User has permissions to create a monitor in the group
- `user.canView(idMonitor, userId)` : User has permissions to view the monitor
- `user.canEdit(idMonitor, userId)` : User has permissions to edit the monitor
- `user.canDelete(idMonitor, userId)` : User has permissions to delete the monitor

For the **Groups** methods we have :

- `groups.insert(group)` : Create a new group
- `groups.update(groupId, groupParams)` : Update a group
- `groups.delete(groupId)` : Delete a group
- `groups.delete.usergroup(userId)` :  Delete a user group

And For the **Monitors** methods we have :

- `monitors.insert(monitor)` : Create a new monitor
- `monitors.update(monitorId, monitor)` : Update a monitor
- `monitors.delete(monitorId)` : Delete a monitor
- `monitors.preview(preview)` : Get a preview of what the version looks like

Each method for **groups** and **monitors** verifies that the user invoking it has the required permissions.

---

### Startup

When the application starts we define 1 default user (admin), 2 groups (everyone and admin) and 1 monitor (this application).  
Default behaviors are also specified. This is the case for the onCreateUser method which is as follows

```js
  Accounts.onCreateUser((options, user) => {
    user._id = Random.id();

    GroupsCollection.insert({
      name: user._id,
      priority: 0,
      multi: false,
      canCreate: true,
    });
    user.groups = [user._id, 'everyone'];

    if (options.profile) {
      user.profile = options.profile;
    }

    return user;
  });
```

As you can see we create a personal group (user group) for each user and automatically add it to the everyone group.  
the other behavior that we define is this one:

```js
const app = new App();

const cursor = MonitorsCollection.find();
cursor.observe({
  added: function (monitor) {
    app.check(monitor);
  },
  changed: function (monitor) {
    app.check(monitor);
  },
});
```

It allows each addition or change to the `Monitors` Collection to retrieve the latest version number of the monitor(s) concerned.  
You can also see that an app variable is created from the class `App`. The interest of this class is to get the versions of all monitors in case of modification or addition as we have seen but also to do it all 12h (for the moment this parameter is not changeable).  
We have already explained how version recovery works [here](/#how-the-application-retrieves-versions) but here is the code of this function:

```js
async function getNewestVersion(monitor) {
  const headers = new Headers();
  for (const header of monitor.headers) {
    headers.append(header.name, header.value);
  }

  const test = new URL(monitor.url); // Test URL
  if (test.protocol !== 'http:' && test.protocol !== 'https:')
    throw 'URL is not a valid HTTP URL'; // Test HTTP URL

  const response = await fetch(monitor.url, { headers: headers }); // Fetch page
  if (!response.ok)
    throw `Error with given URL! status code: ${response.status}`;
  const data = await response.text(); // Get text in this page
  const dom = new JSDOM(data); // Convert Text into DOM page
  const selected = dom.window.document.querySelector(monitor.selector); // Use selector in DOM
  if (selected == undefined || selected == null)
    throw 'Error with given selector, if you are sure about it, think about Headers parameters.';
  let newest = selected.textContent; // Text in selector

  const regex_white_space = /^\s*([^\n\r\f]*)\s*$/gm; // Delete all white spaces before and after the text, if any
  newest = regex_white_space.exec(newest)[1]; // Regex match (1 is for between brackets)

  if (monitor.regex) {
    const regex_obj = new RegExp(monitor.regex);
    const result = regex_obj.exec(newest); // Refine the result with the regex
    if (result && result[1]) newest = result[1]; // If regex as a match (1 is for between first brackets)
  }

  return newest;
}
```

---

## Treeview

Here is the tree structure that the server uses

```shell
├── imports
│   ├── api
│   │   ├── groupsMethods.js
│   │   ├── groupsPublications.js
│   │   ├── monitorsMethods.js
│   │   ├── monitorsPublications.js
│   │   ├── usersMethods.js
│   │   └── usersPublications.js
│   └── db
│       ├── GroupsCollection.js
│       ├── MonitorsCollection.js
│       └── schemas
│           ├── group.js
│           ├── header.js
│           ├── monitor.js
│           ├── monitorPerms.js
│           ├── user.js
│           └── version.js
└── server
    ├── app.js
    └── main.js
```

---

## Data Schema

### User

```js
'username': String,  // Username for the user (unique)
'password': String,  // Password of the user (Managed by Meteor)
'groups': {          // All group names for the user
  type: Array
  defaultValue: []
}
'groups.$': String   // the name of an existing group
```

### Group

```js
'name': String,           // Name of the monitor
'priority': Number,       // Priority of group | -1 everyone, 0 user groups, 1..* others | The lowest priority is the highest
'multi': {                // false : user group | true : public group
  type: Boolean,
  defaultValue: true,
},
'administrator': {        // Permission: Administrator
  type: Boolean,
  defaultValue: false,
},
'manageGroups': {         // Permission: can manage group with higher priority
  type: Boolean,
  defaultValue: false,
},
'canCreate': {            // Permission: can create/add monitors in this group
  type: Boolean,
  defaultValue: false,
},
'monitorPerms': {         // All permisions of monitors in this group
  type: Array,
  defaultValue: [],
},
'monitorPerms.$': {       // Monitor permissions
  'monitor_id': String,   // Id of the monitor
  'canView': {            // Permission: View this monitor
    type: Boolean,
    defaultValue: false,
   },
  'canEdit': {            // Permission: Edit this monitor
    type: Boolean,
    defaultValue: false,
  },
  'canDelete': {          // Permission: Delete this monitor
    type: Boolean,
    defaultValue: false,
  }
}
```

### Monitor

```js
'name': String,            // Name of the monitor
'url': String,             // Url of the monitor - fetch web page
'selector': String,        // Selector of the monitor - select node
'regex': {                 // Regex of the monitor - refine node text
  type: String,
  optional: true,
  defaultValue: undefined,
},
'icon_url': {              // icon url of the monitor - show icon on UI
  type: String,
  optional: true,
  defaultValue: undefined,
},
'headers': {               // HTTP headers of the monitor - fetch web page with custom headers
  type: Array,
  optional: true,
  defaultValue: [],
},
'headers.$': {             // HTTP headers parameter
  'name': String,          // Name of the header parameter
  'value': String,         // Value of the header parameter
},
'versions': {              // All retrieved versions
  type: Array,
  optional: true,
  defaultValue: [],
},
'versions.$': {            // Version object
  'label': String,         // Retrieved text
  'date': Date,            // Date when the text was retrieved
},
'error': {                 // Monitor error
  type: String,
  optional: true,
  defaultValue: undefined,
}
```
