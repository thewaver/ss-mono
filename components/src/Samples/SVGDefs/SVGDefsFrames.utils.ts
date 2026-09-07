import { createSignal, onCleanup } from "solid-js";

const NO_CONSUMERS = 0;

export namespace SVGDefsFrames {
    export const createClock = (graceMs: number) => {
        const [getFrameMs, setFrameMs] = createSignal(performance.now());

        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let lastWakeMs = 0;
        let consumerCount = NO_CONSUMERS;

        const advance = () => {
            const nowMs = performance.now();

            setFrameMs(nowMs);

            if (consumerCount === NO_CONSUMERS || nowMs - lastWakeMs > graceMs) {
                frameId = undefined;

                return;
            }

            frameId = requestAnimationFrame(advance);
        };

        return {
            getFrameMs,
            keepAwake: () => {
                lastWakeMs = performance.now();

                if (frameId !== undefined) return;

                frameId = requestAnimationFrame(advance);
            },
            subscribe: () => {
                consumerCount += 1;

                onCleanup(() => {
                    consumerCount -= 1;
                });
            },
        };
    };
}
