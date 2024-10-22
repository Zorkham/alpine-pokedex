document.addEventListener("alpine:init", () => {
  Alpine.data("pokedex", () => ({
    // Persist the search using Alpine.js Persist Plugin
    search: Alpine.$persist(""),
    pokemonList: [],
    loading: false,
    types: [
      "normal",
      "fire",
      "water",
      "grass",
      "electric",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "steel",
      "fairy",
    ],
    activeType: Alpine.$persist(""),

    // Initialize by fetching pokemon automatically on page load
    init() {
      this.fetchPokemon();
    },

    // Fetch Pokémon data from pokeapi.co
    fetchPokemon() {
      this.loading = true;
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
        .then((response) => response.json())
        .then((data) => {
          return Promise.all(
            data.results.map((pokemon) =>
              fetch(pokemon.url)
                .then((res) => res.json())
                .then(({ id, name, sprites, types }) => ({ id, name, sprites, types }))
            )
          );
        })
        .then((pokemons) => {
          this.pokemonList.push(...pokemons);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.loading = false;
        });
    },

    // Search Pokémon based on the search
    searchPokemon() {
      this.pokemonList = [];
      this.fetchPokemon();
    },

    // Set the active type for filtering
    filterByType(type) {
      this.activeType = type;
    },

    // Clear the search and filter
    clearFilter() {
      this.search = "";
      this.activeType = "";
    },

    // Computed property to return filtered Pokemon list
    get filteredPokemon() {
      let filtered = this.pokemonList;

      if (this.activeType) {
        filtered = filtered.filter((pokemon) =>
          pokemon.types.some((t) => t.type.name === this.activeType)
        );
      }

      if (this.search !== "") {
        filtered = filtered.filter((pokemon) => pokemon.name.includes(this.search.toLowerCase()));
      }

      return filtered;
    },

    // Get CSS classes depends on types
    getTypeClass(type) {
      const typeClasses = {
        normal: "bg-gray-300 text-gray-800",
        fire: "bg-red-300 text-red-800",
        water: "bg-blue-300 text-blue-800",
        grass: "bg-green-300 text-green-800",
        electric: "bg-yellow-300 text-yellow-800",
        ice: "bg-blue-200 text-blue-800",
        fighting: "bg-pink-300 text-pink-800",
        poison: "bg-purple-300 text-purple-800",
        ground: "bg-emerald-300 text-emerald-800",
        flying: "bg-indigo-300 text-indigo-800",
        psychic: "bg-purple-200 text-purple-800",
        bug: "bg-green-200 text-green-800",
        rock: "bg-amber-200 text-amber-800",
        ghost: "bg-indigo-200 text-indigo-800",
        dragon: "bg-red-200 text-red-800",
        dark: "bg-gray-600 text-gray-200",
        steel: "bg-gray-400 text-gray-800",
        fairy: "bg-pink-200 text-pink-800",
      };
      return typeClasses[type] || "bg-gray-300 text-gray-800";
    },
  }));
});
