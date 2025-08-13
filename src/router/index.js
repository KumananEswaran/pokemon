// Import functions to create a router and use browser history mode from Vue Router
import { createRouter, createWebHistory } from 'vue-router';
// Import the page components to be used for different routes
import Home from '../pages/Home.vue';
import PokemonDetails from '../pages/PokemonDetails.vue';

// Define the routes array with objects for each route in the app
const routes = [
	{
		path: '/', // URL path for the home page
		name: 'Home', // Name of the route
		component: Home, // Component to render when visiting this rout
	},
	{
		path: '/pokemon/:id', // URL path with dynamic segment ':id' for Pokemon details page
		name: 'PokemonDetails', // Route name
		component: PokemonDetails, // Component to render for this route
		props: true, // Pass route parameters (id) as props to the component
	},
];

// Create the router instance with history mode and the routes defined
const router = createRouter({
	history: createWebHistory(), // Use browser's history API to handle navigation
	routes, // Routes array we defined above
});

// Export the router instance so it can be used in the main app
export default router;
