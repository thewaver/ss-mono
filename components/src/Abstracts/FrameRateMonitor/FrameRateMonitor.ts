import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";

const SAMPLE_INTERVAL_MS = 1000;

export namespace FrameRateMonitor {
    export const create = (
        getIsDisabled: Accessor<boolean>,
        opts?: {
            startupTimeMs?: number;
        },
    ) => {
        const [getFrameRate, setFrameRate] = createSignal({ current: 0, average: 0 });
        const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);

        createEffect(() => {
            let cycleFrameCount = 0;
            let totalFrameCount = 0;
            let lastTime: number;
            let firstTime: number;
            let rafId: ReturnType<typeof requestAnimationFrame>;
            let timeoutHandle: ReturnType<typeof setTimeout>;

            onCleanup(() => {
                clearTimeout(timeoutHandle);
                cancelAnimationFrame(rafId);
                setFrameRate({ current: 0, average: 0 });
            });

            const isVisible = getIsWindowVisible();
            const isDisabled = getIsDisabled();

            if (!isVisible || isDisabled) return;

            const updateFrameRate = () => {
                const now = performance.now();

                cycleFrameCount++;
                totalFrameCount++;

                if (now - lastTime >= SAMPLE_INTERVAL_MS) {
                    const current = (cycleFrameCount * SAMPLE_INTERVAL_MS) / (now - lastTime);
                    const average = (totalFrameCount * SAMPLE_INTERVAL_MS) / (now - firstTime);

                    cycleFrameCount = 0;
                    lastTime = now;

                    setFrameRate({ current, average });
                }

                rafId = requestAnimationFrame(updateFrameRate);
            };

            timeoutHandle = setTimeout(() => {
                lastTime = performance.now();
                firstTime = lastTime;

                rafId = requestAnimationFrame(updateFrameRate);
            }, opts?.startupTimeMs ?? 0);
        });

        onMount(() => {
            const handleVisibilityChange = () => {
                setIsWindowVisible(document.visibilityState === "visible");
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);

            onCleanup(() => {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            });
        });

        return { getFrameRate };
    };
}
