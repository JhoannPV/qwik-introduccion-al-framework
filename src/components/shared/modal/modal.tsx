import { component$, type PropFunction, Slot, useStylesScoped$ } from '@builder.io/qwik';

import ModalStyles from './modal.css?inline';

export type SizeModal = 'sm' | 'md' | 'lg';

interface Props {
    showModal: boolean;
    persistent?: boolean;
    size?: SizeModal,
    closeFn: PropFunction<() => void>;
}

export const Modal = component$(({
    showModal,
    closeFn,
    size = 'md',
    persistent = false,
}: Props) => {

    useStylesScoped$(ModalStyles);

    return (
        // hidden https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/
        <div
            id="modal-content"
            onClick$={(event) => {
                const elementID = (event.target as HTMLDivElement).id;
                if (elementID === "modal-content" && !persistent) closeFn();
            }}
            class={showModal ? 'modal-background' : 'hidden'}>

            <div class={['modal-content', `modal-${size}`]}>

                <div class="mt-3 text-center">

                    <h3 class="modal-title">
                        <Slot name="title" />
                    </h3>

                    <div class="mt-2 px-7 py-3">
                        <div class="modal-content-text">
                            <Slot name="content" />
                        </div>
                    </div>


                    {/* Botton */}
                    <div class="items-center px-4 py-3">
                        <button
                            onClick$={closeFn}
                            id="ok-btn"
                            class="modal-button"
                        >
                            Cerrar
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
});