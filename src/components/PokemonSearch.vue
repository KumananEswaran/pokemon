<script setup>
// Import Vue ref for reactive data
import { ref } from 'vue';
// Create a reactive variable to store the search input
const query = ref('');
// Define the search event that this component will emit
const emit = defineEmits(['search']);

// Function to emit the search event with the current input value
const emitSearch = () => {
	emit('search', query.value);
};
</script>

<template>
	<div class="w-100 position-relative">
		<Transition name="slide">
			<input
				type="text"
				@input="emitSearch"
				placeholder="Search for a pokemon"
				class="form-control mb-3 py-3 px-3 border border-secondary rounded shadow-sm" />
		</Transition>
	</div>
</template>

<style>
.slide-enter-active {
	transition: all 0.4s ease-in-out;
}

.slide-leave-active {
	transition: all 0.3s ease-in-out;
}

.slide-enter-from {
	transform: translateY(-20px);
	opacity: 0;
}

.slide-leave-from {
	transform: translateY(-20px);
	opacity: 0;
}
</style>
