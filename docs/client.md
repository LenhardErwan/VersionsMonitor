# Client

## Dependencies

On the client side of our application, we use four different npm packages to create the user interface:

- [React](https://reactjs.org/)
- [Reach Router](https://reach.tech/router/)
- [Uniforms](https://uniforms.tools/)
- [Material-UI](https://material-ui.com/)

We also use `meteor/react-meteor-data` to fetch data from meteor and `react-toastify` to display toaster on the interface.

### React

---

**React** is our main library to create and render UI components. With it we can create interactive components and easily fetch and render data. We chose React because of it's simplicity and because we've been using it for all our latest JS projects.

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

---

### Reach Router

To navigate between pages in our app, we use **Reach Router** which is a simple router for React. We chose this package over React-Router because the documentation is easy to understand and we just need to use the given `<Router>` component. Then we set the path props on some of our own components and we are good to go.

```jsx
imports/ui/App.jsx

<Router>
  <HomeContainer path='/' ... />
  <LoginContainer path='/login' ... />
  <AdminContainer path='/admin' ... />
</Router>
```

Here you can see that our `<HomeContainer />` will be mounted when the route is `/`.

### Uniforms

---

**Uniforms** is a powerfull react library capable of generating and validating forms. It is compatible with SimpleSchema-2 and Material-UI which are also used in this project.

Using the `<AutoForm />` component is super simple, we inject the component in our render method and we provide the schema and the model (The object which contains our default values):

```jsx
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

```js
onSubmit(monitor) {
  console.log('This is my monitor !');
  console.log(monitor);
}
```

### Material-UI

---

First of all, **Material-UI** was not the initial design system we tryed to use. Semantic-UI was supposed to endorse this position, but we really wanted to get a dark theme on this app. And the Semantic-UI theme is really hard to work with. We also found out that Semantic-UI didn't get any update in the last 2 years. There is a community fork called Fomantic-UI which aims to continue active development but it is also not really active (and again, creating themes with Semantic-UI is really hard).

So we decided to remove Semantic and go with Material. To setup the dark theme we created a new theme and used the `<ThemeProvider />` component:

```jsx
imports / ui / App.jsx;

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

<ThemeProvider theme={darkTheme}></ThemeProvider>;
```

Of course, because Material is now our main design system, we use it's components in every part of our application, we even installed the `uniforms-material` package to render our forms with Material.

## Directory

Inside the client source directory aka **./imports/ui**, we group files and folders according to their route or feature. This is why we have four different directories, home for the `/` path, login for the `/login` path, admin for the `/admin` and finally modal which contains every dialog displayed by the app.

```shell
ui
├── admin
│   ├── AdminItemGroup.jsx
│   ├── AdminItemUser.jsx
│   ├── Admin.jsx
│   ├── AdminListGroup.jsx
│   └── AdminListUser.jsx
├── App.jsx
├── home
│   ├── HomeItemMonitor.jsx
│   ├── Home.jsx
│   ├── HomeListMonitor.jsx
│   └── HomeMenu.jsx
├── login
│   └── Login.jsx
└── modal
    ├── ModalContainer.jsx
    ├── ModalDeleteGroup.jsx
    ├── ModalDeleteMonitor.jsx
    ├── ModalDeleteUser.jsx
    ├── ModalEditGroup.jsx
    ├── ModalEditMonitor.jsx
    ├── ModalEditUser.jsx
    └── ModalViewMonitor.jsx
```

In each of this directory we then have a 'main' class (Admin, Home, Login, ModalContainer) and the components they will use.

## Dev Choice

This part will explain some decisions we took while developing the front end. Some of them are missing features we would like to implement in the future but didn't have the time to add.

### Why does ModalContainer exist

To create a simple UI, we chose to use modals, but because each modal is unique we needed to create a container. Without this container there would be multiple modals in different render method and the code would become confusing.

We also had an other idea in mind, like `react-toastify`, we wanted to create a container and then just call a method to display a certain modal in this container. (You can take a look a this [commit](https://github.com/LenhardErwan/VersionsMonitor/commit/3990e8614c6d0135444c6b7be8518567c5a39d49) which was supposed to implement this feature). But time is ticking and implementing this feature took longer than we thought.

### Group permissions - Add monitor permissions

On the administration page, when we want to manage the permissions for a monitor it asks us the ID of this monitor. We are aware that this is not very intuitive for the user. However due to our choice of modules (Uniforms) and lack of time, we could not elegantly implement a Selector that would have allowed a much better user experience.

### Warning when opening a form

If you try to create or edit a group or a monitor, you might encounter the following warning:
```Warning: React does not recognize the `autoValue` prop on a DOM element.```

This warning first appeared after we replaced Semantic-UI with Material-UI. We did some tests and found out that when there is a defaultValue set in a Schema used by `<AutoForm />` this warning is thrown. The problem is that removing defaultValue could create other bugs in the Mongo.Collections where some values would be null or undefined. A solution would be to remove defaultValue and set them when calling handleOpenModal (because this is where we create the default object passed to AutoForm).
