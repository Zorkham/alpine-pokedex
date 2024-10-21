document.addEventListener("alpine:init", () => {
  Alpine.data("pokedex", () => ({
    search: Alpine.$persist(""),
    pokemonList: [],
    loading: false,
    offset: 0,
    limit: 25,
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
    activeType: "",

    init() {
      this.fetchPokemon();
    },

    fetchPokemon() {
      this.loading = true;
      console.log(this.offset);
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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
          this.offset += this.limit;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.loading = false;
        });
    },

    searchPokemon() {
      this.offset = 0;
      this.pokemonList = [];
      this.fetchPokemon();
    },

    filterByType(type) {
      this.activeType = type;
    },

    clearFilter() {
      this.search = "";
      this.activeType = "";
    },

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

    checkScroll() {
      const listHeight = this.$refs.pokemonList.scrollHeight;
      const scrollHeight = window.innerHeight + window.scrollY;
      if (scrollHeight >= listHeight - 50 && !this.loading) {
        this.fetchPokemon();
      }
    },

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
      return typeClasses[type] || "bg-gray-300 text-gray-800"; // Classe par défaut
    },
  }));
});
