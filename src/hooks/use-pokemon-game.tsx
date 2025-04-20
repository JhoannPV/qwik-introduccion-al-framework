import { $, type ReadonlySignal, useComputed$, useContext } from "@builder.io/qwik";
import { PokemonGameContext } from "~/context";

export const usePokemonGame = () => {
    const pokemonGame = useContext(PokemonGameContext);

    const changePokemonId = $((value: number) => {
        if (pokemonGame.pokemonId + value < 1) return;
        if (pokemonGame.pokemonId + value > 1025) return;
        pokemonGame.pokemonId += value;
    });

    const toggleFromBack = $(() => {
        pokemonGame.showBackImage = !pokemonGame.showBackImage;
    });

    const toggleVisible = $(() => {
        pokemonGame.isPokemonVisible = !pokemonGame.isPokemonVisible;
    });

    return {
        pokemonId: useComputed$(() => pokemonGame.pokemonId) as ReadonlySignal<number>,
        showBackImage: useComputed$(() => pokemonGame.showBackImage) as ReadonlySignal<boolean>,
        isPokemonVisible: useComputed$(() => pokemonGame.isPokemonVisible) as ReadonlySignal<boolean>,
        nextPokemon: $(() => changePokemonId(1)),
        prevPokemon: $(() => changePokemonId(-1)),
        toggleFromBack: toggleFromBack,
        toggleVisible: toggleVisible,
    }
}