<script setup>
// Import Vue APIs
import { defineProps, defineEmits, watch, ref } from 'vue';

// Define the props this component receives
const props = defineProps({
	show: Boolean, // whether modal is visible
	pokemonData: {
		type: Object,
		required: false,
		default: () => ({}), // default empty object
	},
	description: {
		type: String,
		default: '',
	},
});

// Define the events this component emits
const emit = defineEmits(['close', 'save']);

// Local reactive state for the editable fields
const editName = ref('');
const editHeight = ref(0);
const editWeight = ref(0);
const editBaseExp = ref(0);
const editDescription = ref('');

// Watch for changes in incoming pokemonData prop and update local state accordingly
watch(
	() => props.pokemonData,
	(newVal) => {
		editName.value = newVal.name || '';
		editHeight.value = newVal.height || 0;
		editWeight.value = newVal.weight || 0;
		editBaseExp.value = newVal.base_experience || 0;
		editDescription.value = newVal.description || '';
	},
	{ immediate: true }
);

// Watch for changes in description prop separately (in case it changes independently)
watch(
	() => props.description,
	(val) => {
		editDescription.value = val || '';
	},
	{ immediate: true }
);

// Called when the Save button is pressed
function save() {
	if (!editName.value.trim()) {
		alert('Name cannot be empty.');
		return;
	}

	// Prepare the updated Pokemon data object
	const updatedData = {
		name: editName.value,
		height: editHeight.value,
		weight: editWeight.value,
		base_experience: editBaseExp.value,
		description: editDescription.value,
	};

	// Emit save event with updated data to the parent component
	emit('save', updatedData);
}

// Called when the modal should be closed (cancel button or background click)
function close() {
	emit('close');
}
</script>

<template>
	<div
		class="modal fade"
		:class="{ show: show }"
		:style="{
			display: show ? 'block' : 'none',
			backgroundColor: 'rgba(0,0,0,0.5)',
		}"
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-hidden="!show"
		@click.self="close">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit Pokemon Info</h5>
					<button
						type="button"
						class="btn-close"
						aria-label="Close"
						@click="close" />
				</div>
				<form @submit.prevent="save">
					<div class="modal-body">
						<div class="mb-3">
							<label class="form-label">Name</label>
							<input v-model="editName" class="form-control" required />
						</div>
						<div class="mb-3">
							<label class="form-label">Description</label>
							<textarea
								v-model="editDescription"
								class="form-control"
								rows="3"
								placeholder="Pokedex Entry"></textarea>
						</div>
						<div class="mb-3">
							<label class="form-label">Height</label>
							<input
								type="number"
								v-model.number="editHeight"
								class="form-control" />
						</div>
						<div class="mb-3">
							<label class="form-label">Weight</label>
							<input
								type="number"
								v-model.number="editWeight"
								class="form-control" />
						</div>
						<div class="mb-3">
							<label class="form-label">Base Experience</label>
							<input
								type="number"
								v-model.number="editBaseExp"
								class="form-control" />
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-success">Save</button>
						<button type="button" class="btn btn-secondary" @click="close">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
