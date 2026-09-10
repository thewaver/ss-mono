import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";

/** How long each sample covers. A second is long enough to be steady and short enough to react. */
const SAMPLE_INTERVAL_MS = 1000;

/** Measures how many frames the browser is actually painting. */
export namespace FrameRateMonitorUtils {
    /**
     * Counts frames and reports the rate, both recent and since the monitor started.
     *
     * Two numbers, because they answer different questions: the current rate says whether the page is
     * struggling right now, and the average says whether it has been struggling all along. Counting
     * stops while the tab is in the background, where the browser throttles frames and any reading
     * would be meaningless, and the rate is reset to zero rather than frozen at its last value so a
     * consumer cannot mistake a stale number for a live one.
     *
     * @param getIsDisabled Pass `true` to stop counting.
     * @param opts.startupTimeMs How long to wait before counting. Mounting and the first paint are
     * expensive and would drag the average down for the rest of the session, so a monitor watching a
     * heavy component should let it settle first.
     * @returns `getFrameRate`, giving `current` for the last sample and `average` since counting began.
     * Both are zero until the first sample completes.
     */
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
