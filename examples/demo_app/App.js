import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {LazyComponent: null}
    this.lazyLoadComponent = this.lazyLoadComponent.bind(this)
  }

  lazyLoadComponent() {
      import('./Lazy.js').then(function (Lazy) {
          this.setState({ LazyComponent: Lazy.default})
      }.bind(this))
  }

  render() {
    let {LazyComponent} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Packer is working</h1>
        </header>
        <button onClick={this.lazyLoadComponent}>
          Dynamically load a new component
        </button>
        {LazyComponent && <LazyComponent />}
      </div>
    );
  }
}

export default App;
