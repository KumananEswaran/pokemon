<template>
	<div
		class="card text-center border rounded shadow-sm p-3 bg-white transition">
		<img
			:src="pokemon.image"
			:alt="pokemon.name"
			class="card-img-top mx-auto d-block"
			style="width: 96px; height: 96px; transition: transform 0.5s"
			@mouseover="hoverImg = true"
			@mouseleave="hoverImg = false"
			:style="hoverImg ? 'transform: rotate(3deg) scale(1.1);' : ''" />

		<div class="card-body p-2">
			<h2 class="h5 fw-bold text-dark mt-2">{{ pokemon.name }}</h2>

			<div class="mt-2">
				<p
					class="text-secondary mb-1"
					@mouseover="hoverStat = 'hp'"
					@mouseleave="hoverStat = ''"
					:class="hoverStat === 'hp' ? 'text-primary' : ''">
					❤️ HP: {{ pokemon.stats.hp }}
				</p>
				<p
					class="text-secondary mb-1"
					@mouseover="hoverStat = 'attack'"
					@mouseleave="hoverStat = ''"
					:class="hoverStat === 'attack' ? 'text-danger' : ''">
					⚔ Attack: {{ pokemon.stats.attack }}
				</p>
				<p
					class="text-secondary mb-0"
					@mouseover="hoverStat = 'defense'"
					@mouseleave="hoverStat = ''"
					:class="hoverStat === 'defense' ? 'text-success' : ''">
					🛡 Defense: {{ pokemon.stats.defense }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
// Import Vue reactive reference
import { ref } from 'vue';
// Declare the prop "pokemon" to receive the Pokemon object
defineProps({
	pokemon: Object,
});

// State to track if the image is hovered (true/false)
const hoverImg = ref(false);
// State to track which stat is hovered (hp, attack, defense, or empty)
const hoverStat = ref('');
</script>

<style scoped>
.card {
	transition: all 0.3s ease;
}
.card:hover {
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	border-color: #0d6efd;
}
</style>
