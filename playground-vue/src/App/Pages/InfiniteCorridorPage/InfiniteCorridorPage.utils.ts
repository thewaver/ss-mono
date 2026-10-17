import { type MaybeRefOrGetter, shallowRef, toValue, watch } from "vue";

const MS_PER_SECOND = 1000;
const FULL_TURN = 360;

export const useSpinDegrees = (degreesPerSecond: MaybeRefOrGetter<number>, isRunning: MaybeRefOrGetter<boolean>) => {
    const spinDegrees = shallowRef(0);

    watch(
        [() => toValue(degreesPerSecond), () => toValue(isRunning)],
        ([perSecond, isOn], _previous, onCleanup) => {
            if (!isOn || perSecond === 0) return;

            let frameId: number;
            let lastMs = performance.now();

            const spin = () => {
                const nowMs = performance.now();

                spinDegrees.value = (spinDegrees.value + ((nowMs - lastMs) / MS_PER_SECOND) * perSecond) % FULL_TURN;
                lastMs = nowMs;
                frameId = requestAnimationFrame(spin);
            };

            frameId = requestAnimationFrame(spin);

            onCleanup(() => cancelAnimationFrame(frameId));
        },
        { immediate: true },
    );

    return spinDegrees;
};
