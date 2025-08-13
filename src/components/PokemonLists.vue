<template>
	<TransitionGroup name="list" tag="div" class="row g-4 p-3">
		<div
			v-for="pokemon in pokemons"
			:key="pokemon.id"
			class="col-12 col-sm-6 col-md-4 col-lg-3"
			@click="goToDetails(pokemon.id)"
			style="cursor: pointer">
			<div
				class="card h-100 border-0 shadow-sm transition-all"
				style="transition: transform 0.2s ease">
				<div
					class="card-body"
					@mouseover="hover = pokemon.id"
					@mouseleave="hover = null"
					:style="{
						transform: hover === pokemon.id ? 'scale(1.05)' : 'scale(1)',
					}">
					<slot :pokemon="pokemon"></slot>
				</div>
			</div>
		</div>
	</TransitionGroup>
</template>

<script setup>
// Import Vue APIs and router
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '../stores/pokemonStore';

// Declare a prop to receive the list of Pokemon
defineProps({ pokemons: Array });

// Reactive state to track which card is hovered
const hover = ref(null);
// Get router instance to navigate programmatically
const router = useRouter();
// Get the Pokemon store
const store = usePokemonStore();

// Function to navigate to Pokemon details page by ID
function goToDetails(id) {
	router.push(`/pokemon/${id}`);
}
</script>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.3s ease-in-out;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateY(20px);
}
</style>
