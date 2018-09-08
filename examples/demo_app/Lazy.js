import React, { Component } from 'react';

class Lazy extends Component {

  lazyLoadCss() {
    import('./Lazy.css')
  }

  render() {
    return (
      <div className="Lazy">
        <h2>Hi!! This component is dynamically loaded.</h2>
        <button onClick={this.lazyLoadCss}>Dynamically Style Component</button>
      </div>
    );
  }
}

export default Lazy;
