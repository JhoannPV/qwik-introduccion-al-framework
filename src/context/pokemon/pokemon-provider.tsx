/* eslint-disable qwik/no-use-visible-task */
import { component$, Slot, useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { PokemonGameContext, PokemonListContext } from '..';
import type { PokemonGameState, PokemonListState } from '..';


export const PokemonProvider = component$(() => {
    const pokemonGame = useStore<PokemonGameState>({
        pokemonId: 1,
        isPokemonVisible: true,
        showBackImage: false,
    });

    const pokemonList = useStore<PokemonListState>({
        currentPage: 0,
        isLoading: false,
        pokemons: [],
    });

    useContextProvider(PokemonGameContext, pokemonGame);
    useContextProvider(PokemonListContext, pokemonList);

    useVisibleTask$(() => {
        if (localStorage.getItem('pokemon-game')) {
            const {
                pokemonId = 1,
                isPokemonVisible = true,
                showBackImage = false,
            } = JSON.parse(localStorage.getItem('pokemon-game')!) as PokemonGameState;
            pokemonGame.pokemonId = pokemonId;
            pokemonGame.isPokemonVisible = isPokemonVisible;
            pokemonGame.showBackImage = showBackImage;
        }
    });

    useVisibleTask$(({ track }) => {
        track(() => [pokemonGame.pokemonId, pokemonGame.isPokemonVisible, pokemonGame.showBackImage]);

        localStorage.setItem('pokemon-game', JSON.stringify(pokemonGame))
    });

    return <Slot />;
});