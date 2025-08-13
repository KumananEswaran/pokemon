// Import the function to define a new Pinia store
import { defineStore } from 'pinia';

// Key name to use for saving and loading Pokemon data in the browser's local storage
const STORAGE_KEY = 'pokemon_data';

// Define a Pinia store named 'pokemon' to manage Pokemon data globally
export const usePokemonStore = defineStore('pokemon', {
	// State holds the reactive data for this store
	state: () => ({
		// Try to load saved Pokemon data from local storage, if none found, use an empty array
		pokemons: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
	}),

	// Actions are functions that can modify the state or perform other tasks
	actions: {
		// Save the whole list of pokemons to the state and local storage
		setPokemons(pokemons) {
			this.pokemons = pokemons; // update state
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pokemons)); // save to browser storage
		},

		// Update a specific Pokemon by its id with new data
		updatePokemon(id, updatedData) {
			// Find the index of the Pokemon with the given id
			const index = this.pokemons.findIndex((p) => p.id === id);
			if (index !== -1) {
				// Merge existing data with updated data
				this.pokemons[index] = { ...this.pokemons[index], ...updatedData };
				// Save the updated list to local storage
				localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pokemons));
			}
		},

		// Add a new Pokemon or replace an existing one by id
		addOrUpdatePokemon(pokemon) {
			// Check if the Pokemon already exists in the list
			const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
			if (index !== -1) {
				// Replace the existing Pokemon data
				this.pokemons[index] = pokemon;
			} else {
				// Add the new Pokemon to the list
				this.pokemons.push(pokemon);
			}
			// Save the updated list to local storage
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pokemons));
		},
	},
});
