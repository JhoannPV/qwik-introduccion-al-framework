import { $, type ReadonlySignal, useComputed$, useSignal } from "@builder.io/qwik";

export const useCounter = (initialValue: number) => {

    const counter = useSignal(initialValue);

    const increaseCounter = $(() => {
        counter.value++;
    });

    const decreaseCounter = $(() => {
        counter.value--;
    });

    return {
        counter: useComputed$(() => counter.value) as ReadonlySignal<number>,
        increase: increaseCounter,
        decrease: decreaseCounter,
    };
}
