import React, { Component } from 'react';
import ReactDom from 'react-dom';
import * as Toastr from 'toastr';

import Model from './Model.js';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  render () {
    return (
      <div>
        <strong>I AM</strong>
      </div>
    )
  }
}

ReactDom.render(
  <App />,
  document.querySelector('.app')
)
