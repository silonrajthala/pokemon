import React, { Component } from 'react';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
    this.props.onSearch(e.target.value); // Pass the search term to parent component
  };

  render() {
    return (
      <div id='nav'>
        <div><img src='./images/pokemon.png ' alt=''/></div>
        <div>
          <input
            type='text'
            placeholder='Search by name or type'
            value={this.state.searchTerm}
            onChange={this.handleSearch}
          />
        </div>
      </div>
    );
  }
}

export default Nav;
