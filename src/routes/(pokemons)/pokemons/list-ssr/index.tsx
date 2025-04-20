/* eslint-disable qwik/no-use-visible-task */
import { $, component$, useComputed$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { routeLoader$, useLocation, useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { PokemonImage } from '~/components/pokemons/pokemon-image';

import { Modal, type SizeModal } from '~/components/shared';
import { getFunFactAboutPokemon } from '~/helpers/get-chat-gpt-response';
import { getSmallPokemons } from '~/helpers/get-small-pokemons';
import type { SmallPokemon } from '~/interfaces';

export const usePokemonList = routeLoader$<SmallPokemon[]>(async ({ query, redirect, pathname }) => {
    const offset = Number(query.get('offset') || '0');
    if (isNaN(offset)) throw redirect(301, pathname);
    if (offset < 0) throw redirect(301, pathname);
    if (offset > 1300) throw redirect(301, `${pathname}?offset=3100`);

    return await getSmallPokemons(offset);
});

export default component$(() => {
    const pokemons = usePokemonList();
    const nav = useNavigate();
    const location = useLocation();

    const modalVisible = useSignal(false);
    const modalPokemon = useStore({
        id: '',
        name: ''
    });
    const modalSize = useSignal('md');

    const chatGptPokemonFact = useSignal('');

    // Modal functions

    const showModal = $((id: string, name: string) => {
        modalPokemon.id = id;
        modalPokemon.name = name;
        modalVisible.value = true;
    });

    const closeModal = $(() => {
        modalVisible.value = false;
    });

    useVisibleTask$(({ track }) => {
        track(() => window.innerWidth);
        if (window.innerWidth < 640) {
            modalSize.value = 'sm';
        } else if (window.innerWidth < 1024) {
            modalSize.value = 'md';
        } else {
            modalSize.value = 'lg';
        }
    })

    useVisibleTask$(({ track }) => {
        track(() => modalPokemon.name);

        chatGptPokemonFact.value = '';

        if (modalPokemon.name.length > 0) {
            getFunFactAboutPokemon(modalPokemon.name)
                .then(resp => chatGptPokemonFact.value = resp);
        }
    });

    const currentOffset = useComputed$<number>(() => {
        // const offsetString = location.url.searchParams.get('offset');
        const offsetString = new URLSearchParams(location.url.search);

        return Number(offsetString.get('offset') || '0');
    });

    return (
        <>
            <div class="flex flex-col">
                <span class="my-5 text-5xl">Status</span>
                <span>Offset: {currentOffset}</span>
                <span>Está cargando la página: {location.isNavigating ? 'Sí' : 'No'}</span>
            </div>

            <div class="mt-10">
                <button onClick$={() => nav(`/pokemons/list-ssr?offset=${currentOffset.value - 10}`)}
                    disabled={currentOffset.value === 0}
                    class="btn btn-primary mr-2">
                    Anteriores
                </button>
                <button onClick$={() => nav(`/pokemons/list-ssr?offset=${currentOffset.value + 10}`)}
                    disabled={currentOffset.value === 1300}
                    class="btn btn-primary mr-2">
                    Siguientes
                </button>
            </div>

            <div class="grid sm:grid-cols-2 md:grid-cols-5 xl:grid-cols-7 mt-5">
                {pokemons.value.map(({ name, id }) => (
                    <div key={name}
                        onClick$={() => showModal(id, name)}
                        class="m-5 flex flex-col justify-center items-center cursor-pointer">
                        <PokemonImage id={id} />
                        <span class="capitalize">{name}</span>
                    </div>
                ))}
            </div>

            <Modal
                size={modalSize.value as SizeModal}
                persistent
                showModal={modalVisible.value} closeFn={closeModal}>
                <div q:slot='title'>{modalPokemon.name}</div>
                <div q:slot='content' class="flex flex-col justify-center items-center">
                    <PokemonImage id={modalPokemon.id} />
                    <span>
                        {
                            chatGptPokemonFact.value === ''
                                ? 'Preguntando a ChatGPT...'
                                : chatGptPokemonFact.value
                        }
                    </span>
                </div>
            </Modal>
        </>
    );
});

export const head: DocumentHead = {
    title: 'List SSR',
};