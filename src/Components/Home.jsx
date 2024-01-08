import React, { Component } from 'react';
import Nav from './Nav';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemonData: [],
      filteredPokemon: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    try {
      const cachedData = localStorage.getItem('cachedPokemonData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const currentTime = new Date().getTime();
        const isCacheValid = currentTime - parsedData.timestamp < 3600000; 

        if (isCacheValid) {
          this.setState({
            pokemonData: parsedData.data,
            filteredPokemon: parsedData.data,
            isLoading: false,
          });
          return;
        }
      }

      const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const results = data.results;

      const pokemonDetails = await Promise.all(
        results.map(async (pokemon) => {
          const detailsResponse = await fetch(pokemon.url);
          if (!detailsResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const detailsData = await detailsResponse.json();
          return {
            name: detailsData.name,
            image: detailsData.sprites.front_default,
            type: detailsData.types.map((type) => type.type.name).join(', '),
          };
        })
      );

      const dataToCache = {
        data: pokemonDetails,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem('cachedPokemonData', JSON.stringify(dataToCache));

      this.setState({
        pokemonData: pokemonDetails,
        filteredPokemon: pokemonDetails,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  handleSearch = (searchTerm) => {
    const { pokemonData } = this.state;
    const results = pokemonData.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.setState({ filteredPokemon: results });
  };

  render() {
    const { filteredPokemon, isLoading } = this.state;

    return (
      <div id='home'>
        <Nav onSearch={this.handleSearch} />
        <div className='grid-container'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            filteredPokemon.map((pokemon, index) => (
              <div className='grid-item' key={index}>
                <h3>{pokemon.name}</h3>
                <img src={pokemon.image} alt={pokemon.name} />
                <p>Type: {pokemon.type}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Home;
