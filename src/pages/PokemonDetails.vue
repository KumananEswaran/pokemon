<template>
	<div class="container py-4">
		<!-- Button to navigate back to home -->
		<button class="btn btn-secondary mb-3" @click="goBack">
			← Back to Home
		</button>

		<!-- Main card showing Pokemon details -->
		<div class="card mx-auto p-4 pokemon-card" v-if="pokemon">
			<div class="text-center mb-4">
				<h1 class="card-title text-capitalize mb-1">{{ pokemon.name }}</h1>
				<img
					v-if="pokemon.sprites?.front_default"
					:src="pokemon.sprites.front_default"
					alt="pokemon"
					class="pokemon-image" />
			</div>

			<!-- Description section-->
			<section class="description-section">
				<h4>Pokemon Entry</h4>
				<p class="description-text">{{ pokemon?.description }}</p>
			</section>

			<!-- Height, Weight, Base Exp -->
			<section class="hwbe-section">
				<div class="hwbe-box">
					<h4>Height</h4>
					<p>{{ pokemon.height }}</p>
				</div>
				<div class="hwbe-box">
					<h4>Weight</h4>
					<p>{{ pokemon.weight }}</p>
				</div>
				<div class="hwbe-box">
					<h4>Base Experience</h4>
					<p>{{ pokemon.base_experience }}</p>
				</div>
			</section>

			<!-- Abilities -->
			<section class="abilities-section">
				<h4>Abilities</h4>
				<div class="abilities-list">
					<span
						v-for="(ab, idx) in pokemon.abilities"
						:key="idx"
						class="ability-badge">
						{{ ab }}
					</span>
				</div>
			</section>

			<!-- Stats grid-->
			<section class="stats-section">
				<h4>Stats</h4>
				<div class="row justify-content-center g-3">
					<div class="col-6 col-sm-4 col-md-2">
						<div class="stat-box hp text-center">
							HP: {{ pokemon.stats?.hp ?? 0 }}
						</div>
					</div>
					<div class="col-6 col-sm-4 col-md-2">
						<div class="stat-box atk text-center">
							ATK: {{ pokemon.stats?.attack ?? 0 }}
						</div>
					</div>
					<div class="col-6 col-sm-4 col-md-2">
						<div class="stat-box def text-center">
							DEF: {{ pokemon.stats?.defense ?? 0 }}
						</div>
					</div>
					<div class="col-6 col-sm-4 col-md-2">
						<div class="stat-box spa text-center">
							SpA: {{ pokemon.stats?.['special-attack'] ?? 0 }}
						</div>
					</div>
					<div class="col-6 col-sm-4 col-md-2">
						<div class="stat-box spd text-center">
							SpD: {{ pokemon.stats?.['special-defense'] ?? 0 }}
						</div>
					</div>
					<div class="col-6 col-sm-4 col-md-2">
						<div class="stat-box spe text-center">
							SPD: {{ pokemon.stats?.speed ?? 0 }}
						</div>
					</div>
				</div>

				<!-- Total stats display -->
				<div class="d-flex justify-content-center mt-3">
					<div class="stats-row total px-4 py-2">
						Total Stats: {{ totalStats }}
					</div>
				</div>
			</section>

			<!-- Evolution Chain -->
			<section v-if="evolutionChain.length" class="evolution-section">
				<h4 class="mb-4">Evolution Chain</h4>
				<div class="evolution-row">
					<div
						v-for="(evo, i) in evolutionChain"
						:key="evo.id ?? i"
						class="evolution-box">
						<img
							:src="evo.sprite"
							:alt="evo.name"
							class="evolution-image"
							v-if="evo.sprite" />
						<div class="evolution-name">{{ evo.name }}</div>
						<div class="evolution-level" v-if="evo.level !== null">
							Lv. {{ evo.level }}
						</div>
					</div>
				</div>
			</section>

			<button class="btn btn-primary w-100 mt-4" @click="openModal">
				Edit Pokemon Info
			</button>
		</div>

		<!-- Edit modal component -->
		<EditPokemonModal
			:show="showModal"
			:pokemonData="pokemon || {}"
			:description="description"
			@close="closeModal"
			@save="handleSave" />
	</div>
</template>

<script setup>
// Import Vue reactive helpers and lifecycle hooks
import { ref, onMounted, computed } from 'vue';
// Import Vue Router hooks to get current route info and navigate programmatically
import { useRoute, useRouter } from 'vue-router';
// Import the global store for managing Pokemon data
import { usePokemonStore } from '../stores/pokemonStore';
// Import modal component to edit Pokemon info
import EditPokemonModal from '../components/EditPokemonModal.vue';
// Import toast notification composable to show messages
import { useToast } from 'vue-toastification';

// Create toast instance for showing notifications
const toast = useToast();
// Get current route info (for reading URL params)
const route = useRoute();
// Get router instance (to navigate programmatically)
const router = useRouter();
// Access the Pokemon store
const store = usePokemonStore();
// Reactive variable to hold the current Pokemon's data
const pokemon = ref(null);
// Reactive variable to hold the Pokemon's evolution chain data
const evolutionChain = ref([]);
// Reactive variable to control modal visibility
const showModal = ref(false);
// Reactive variable for Pokemon description text
const description = ref('');
// Computed property to calculate total stats
const totalStats = computed(() => {
	if (!pokemon.value?.stats) return 0;
	return Object.values(pokemon.value.stats).reduce((a, b) => a + b, 0);
});

// Function to navigate back to the home page
function goBack() {
	router.push('/');
}

// Function to fetch and process evolution chain data from given URL
async function fetchEvolutionChain(url) {
	try {
		const res = await fetch(url);
		const data = await res.json();

		const evoChain = [];
		let evoData = data.chain;
		while (evoData) {
			evoChain.push({
				name: evoData.species?.name ?? '',
				url: evoData.species?.url ?? '',
				level: evoData.evolution_details?.[0]?.min_level ?? null,
			});
			evoData = evoData.evolves_to?.[0];
		}

		const evoWithSprites = await Promise.all(
			evoChain.map(async (evo) => {
				const id = evo.url.split('/').filter(Boolean).pop();
				const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
				const pokeData = await pokeRes.json();
				return {
					...evo,
					sprite: pokeData?.sprites?.front_default ?? '',
					id: pokeData?.id ?? null,
				};
			})
		);

		evolutionChain.value = evoWithSprites;
	} catch (err) {
		console.error('Error fetching evolution chain:', err);
		evolutionChain.value = [];
	}
}

// Fetch Pokemon details and related data when component mounts
onMounted(async () => {
	const id = parseInt(route.params.id);
	let stored = store.pokemons.find((p) => p.id === id);

	if (stored) {
		// Use stored Pokemon data if available
		pokemon.value = stored;
		description.value = stored.description || 'No description available.';
	} else {
		// Fetch Pokemon data from API
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
		const data = await res.json();

		// Build Pokemon object with relevant fields
		pokemon.value = {
			id: data.id,
			name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
			height: data.height,
			weight: data.weight,
			base_experience: data.base_experience,
			sprites: data.sprites,
			abilities: data.abilities.map((a) => a.ability.name),
			stats: {
				hp: data.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
				attack:
					data.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
				defense:
					data.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
				'special-attack':
					data.stats.find((s) => s.stat.name === 'special-attack')?.base_stat ||
					0,
				'special-defense':
					data.stats.find((s) => s.stat.name === 'special-defense')
						?.base_stat || 0,
				speed: data.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
			},
			description: '',
		};
		// Save the new Pokemon data in the store
		store.addOrUpdatePokemon(pokemon.value);
	}

	try {
		// Fetch species data to get description and evolution info
		const speciesRes = await fetch(
			`https://pokeapi.co/api/v2/pokemon-species/${id}`
		);
		const speciesData = await speciesRes.json();

		// Find English description text entry
		const flavorEntry = speciesData.flavor_text_entries.find(
			(entry) => entry.language.name === 'en'
		);

		// Clean up formatting characters from description
		const desc = flavorEntry
			? flavorEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
			: 'No description available.';

		// Only update description if there's no stored description
		if (!pokemon.value.description || pokemon.value.description === '') {
			description.value = desc;
			if (pokemon.value) {
				pokemon.value.description = desc;
				store.addOrUpdatePokemon(pokemon.value);
			}
		} else {
			// Use stored description
			description.value = pokemon.value.description;
		}

		// If evolution chain URL exists, fetch evolution data
		if (speciesData.evolution_chain?.url) {
			await fetchEvolutionChain(speciesData.evolution_chain.url);
		}
	} catch (error) {
		console.error('Error fetching species or evolution data:', error);
		description.value = 'No description available.';
		evolutionChain.value = [];
	}
});

// Show the edit modal
function openModal() {
	showModal.value = true;
}

// Hide the edit modal
function closeModal() {
	showModal.value = false;
}

// Handle saving updates from the modal
function handleSave(updatedData) {
	// Update local Pokemon data with new values
	pokemon.value = { ...pokemon.value, ...updatedData };
	// Save updated Pokemon in the store
	store.addOrUpdatePokemon(pokemon.value);
	// Close modal after saving
	closeModal();
	// Show success toast notification
	toast.success('Changes saved successfully!', {
		timeout: 3000,
		closeOnClick: true,
		pauseOnHover: true,
	});
}
</script>

<style scoped>
.container {
	max-width: 740px;
	margin: 0 auto;
}

.pokemon-card {
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
	border-radius: 10px;
}

.pokemon-image {
	width: 160px;
	height: 160px;
	object-fit: contain;
}

.description-section {
	margin-bottom: 20px;
	font-style: italic;
	color: #555;
}

.hwbe-section {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	font-weight: 600;
}

.hwbe-box {
	flex: 1;
	text-align: center;
	border: 1px solid #ddd;
	padding: 10px 0;
	border-radius: 8px;
	margin: 0 5px;
	background: #fafafa;
}

.abilities-section {
	margin-bottom: 20px;
}

.abilities-list {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.ability-badge {
	background-color: #4caf50;
	color: white;
	padding: 5px 12px;
	border-radius: 15px;
	font-weight: 600;
	font-size: 0.9rem;
	text-transform: capitalize;
}

.stats-section {
	margin-bottom: 20px;
}

.stats-row.total {
	font-weight: 700;
	font-size: 1.1rem;
	background-color: #88aaea;
	border-radius: 20px;
	color: white;
	max-width: 200px;
	text-align: center;
}

.stat-box {
	border-radius: 6px;
	color: white;
	font-weight: 700;
	padding: 10px 15px;
	min-width: 90px;
	text-align: center;
	font-size: 1rem;
	white-space: nowrap;
}

.stat-box.hp {
	background-color: #df2140;
}
.stat-box.atk {
	background-color: #ff994d;
}
.stat-box.def {
	background-color: #eecd3d;
	color: black;
}
.stat-box.spa {
	background-color: #85ddff;
	color: black;
}
.stat-box.spd {
	background-color: #96da83;
	color: black;
}
.stat-box.spe {
	background-color: #fb94a8;
	color: black;
}

/* Evolution */
.evolution-section {
	margin-top: 30px;
}

.evolution-row {
	display: flex;
	justify-content: center;
	gap: 20px;
	flex-wrap: wrap;
}

.evolution-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100px;
}

.evolution-image {
	width: 80px;
	height: 80px;
	object-fit: contain;
	border-radius: 10px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.evolution-name {
	margin-top: 8px;
	text-transform: capitalize;
	font-weight: 600;
	font-size: 1rem;
}

.evolution-level {
	font-size: 0.85rem;
	font-weight: 700;
	margin-top: 4px;
	color: #333;
}
</style>
