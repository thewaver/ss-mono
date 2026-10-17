import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

const MS_PER_SECOND = 1000;
const FULL_TURN = 360;

export const createSpinDegrees = (getDegreesPerSecond: Accessor<number>, getIsRunning: Accessor<boolean>) => {
    const [getSpinDegrees, setSpinDegrees] = createSignal(0);

    createEffect(() => {
        const degreesPerSecond = getDegreesPerSecond();

        if (!getIsRunning() || degreesPerSecond === 0) return;

        let frameId: number;
        let lastMs = performance.now();

        const spin = () => {
            const nowMs = performance.now();

            setSpinDegrees((degrees) => (degrees + ((nowMs - lastMs) / MS_PER_SECOND) * degreesPerSecond) % FULL_TURN);
            lastMs = nowMs;
            frameId = requestAnimationFrame(spin);
        };

        frameId = requestAnimationFrame(spin);

        onCleanup(() => cancelAnimationFrame(frameId));
    });

    return getSpinDegrees;
};
