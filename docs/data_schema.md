# Data Schema

## User

```js
'username': String,  // Username for the user (unique)
'password': String,  // Password of the user (Managed by Meteor)
'groups': {          // All group names for the user
  type: Array
  defaultValue: []
}
'groups.$': String   // the name of an existing group
```

## Group

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

## Monitor

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
