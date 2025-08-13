<template>
	<div class="container py-5">
		<!-- Search input centered at the top -->
		<div class="d-flex justify-content-center mb-4">
			<PokemonSearch @search="searchPokemon" />
		</div>

		<!-- Show loading spinner while data is being fetched -->
		<div v-if="loading" class="d-flex justify-content-center mb-4">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>

		<!-- Show message if no Pokemon found after searching -->
		<div
			v-if="!loading && filteredPokemons.length === 0"
			class="text-center py-4">
			<p class="fs-4 text-muted">No Pokemon found for your search</p>
		</div>

		<!-- Show the list of Pokemon cards with fade transition -->
		<Transition name="fade" mode="out-in">
			<PokemonLists
				v-if="!loading && filteredPokemons.length > 0"
				:pokemons="filteredPokemons">
				<!-- Scoped slot to render each Pokemon card -->
				<template #default="{ pokemon }">
					<PokemonCard :pokemon="pokemon" />
				</template>
			</PokemonLists>
		</Transition>
	</div>
</template>

<script setup>
// Import Vue reactive and lifecycle helpers
import { ref, onMounted, computed } from 'vue';
// Import axios to make HTTP requests
import axios from 'axios';
// Import child components used on this page
import PokemonLists from '../components/PokemonLists.vue';
import PokemonSearch from '../components/PokemonSearch.vue';
import PokemonCard from '../components/PokemonCard.vue';
// Import the Pinia store to manage Pokemon data globally
import { usePokemonStore } from '../stores/pokemonStore';

// Create a reference to the store instance
const store = usePokemonStore();

// Reactive variable to the user's search input
const searchQuery = ref('');
// Reactive variable to track if data is loading (show spinner)
const loading = ref(true);

// Fetch Pokemon data when the component is first added to the page
onMounted(async () => {
	// only fetch if the store does not have the Pokemon data
	if (store.pokemons.length === 0) {
		try {
			const { data: list } = await axios.get(
				'https://pokeapi.co/api/v2/pokemon?limit=100'
			);

			// For each Pokemon, fetch detailed info
			const pokemons = await Promise.all(
				list.results.map(async (p) => {
					const { data } = await axios.get(p.url);

					// Return a simplified object with relevant info
					return {
						id: data.id,
						// Capitalize the first letter of the Pokemon's name
						name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
						image: data.sprites.front_default,
						stats: {
							hp: data.stats.find((s) => s.stat.name === 'hp').base_stat,
							attack: data.stats.find((s) => s.stat.name === 'attack')
								.base_stat,
							defense: data.stats.find((s) => s.stat.name === 'defense')
								.base_stat,
							'special-attack':
								data.stats.find((s) => s.stat.name === 'special-attack')
									?.base_stat || 0,
							'special-defense':
								data.stats.find((s) => s.stat.name === 'special-defense')
									?.base_stat || 0,
							speed:
								data.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
						},
						height: data.height,
						weight: data.weight,
						base_experience: data.base_experience,
						abilities: data.abilities.map((a) => a.ability.name), // abilities as strings
						sprites: data.sprites,
					};
				})
			);

			// Save fetched Pokemon data in the store and local storage
			store.setPokemons(pokemons);
		} catch (error) {
			// If something goes wrong, log the error
			console.error('Error fetching data', error);
		} finally {
			// Hide the loading spinner after fetch attempt
			loading.value = false;
		}
	} else {
		// If data already exists, just hide loading spinner
		loading.value = false;
	}
});

// Compute a filtered list of Pokemon based on the search query
const filteredPokemons = computed(() => {
	// If search is empty, show all Pokemon
	if (!searchQuery.value) return store.pokemons;
	// Otherwise, filter Pokemon whose name includes the search text (case-insensitive)
	return store.pokemons.filter((p) =>
		p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

// Update the searchQuery when the user types in the search component
const searchPokemon = (query) => {
	searchQuery.value = query;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
