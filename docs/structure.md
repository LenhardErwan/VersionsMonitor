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

On the client side of our application, we use four different npm package to render the user interface, React, Uniforms, Material-UI and Reach Router.

### React

[React](https://reactjs.org/) is the main rendering library of this project. With it we can create interactive components and easily fetch and render data. We chose React because of it's simplicity and because we've been using it for all our latest JS projects.

The entry points for this project are **client/main.html** and **client/main.jsx**. **main.html** contains the following HTML element:

```html
<div id="react-target"></div>
```

This is where React will inject our first component `<App />` by following the **main.jsx** script:

```js
Meteor.startup(() => {
	render(<App />, document.getElementById('react-target'));
});
```

We then inject into `<App />` other React components by following the Route provided by Reach Router.

### Reach Router

To navigate between pages in our app, we use [Reach Router](https://reach.tech/router/) which is a simple router for React. We decided to choose this package over React-Router because the documentation is easy to understand and we just need to use the given `<Router>` component. Then we set the path props on some of our own components and we are good to go.

```
imports/ui/App.jsx

<Router>
    <HomeContainer path='/' ... />
    <LoginContainer path='/login' ... />
    <AdminContainer path='/admin' ... />
</Router>
```

Here you can see that our `<HomeContainer />` will be mounted when the route is `/`.

### Uniforms

Uniforms is a powerfull react library capable of generating and validating forms. It is also compatible with SimpleSchema-2 and Material-UI which are also used in this project.

Using the `<AutoForm />` component is super simple, we inject the component in our render method and we provide the schema and the model (The object which contains our default values):

```
imports/ui/modal/ModalEditMonitor.jsx

<AutoForm
	schema={bridge}
	model={this.props.monitor}
	ref={(ref) => (formRef = ref)}
	onSubmit={this.onSubmit}>
	<AutoFields omitFields={['versions', 'error']} />
	<ErrorsField />
</AutoForm>
```

Then we create an **onSubmit** method and fetch the validated object, eg:

```
onSubmit(monitor) {
    console.log('This is my monitor !');
    console.log(monitor);
}
```

### Material-UI

First of all, Material-UI was not the initial design system we tryed to use. Semantic-UI was supposed to endorse this position, but we really wanted to get a dark theme on this app. And the Semantic-UI theme is really hard to work with. We also found out that Semantic-UI didn't get any update in the last 2 years. There is a community fork called Fomantic-UI which aims to continue active development but it is also not really active (and again, creating themes with Semantic-UI is really hard).

So we decided to remove Semantic and go with Material. To setup the dark theme we created a new theme and used the `<ThemeProvider />` component:

```
imports/ui/App.jsx

const darkTheme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			light: '#a6d4fa',
			main: '#90caf9',
			dark: '#648dae',
		},
	},
});

...

<ThemeProvider theme={darkTheme}>
    ...
</ThemeProvider>
```

Of course, because Material is now our main design system, we use it's components in every part of our application, we even installed the `uniforms-material` package to render our forms with Material.
