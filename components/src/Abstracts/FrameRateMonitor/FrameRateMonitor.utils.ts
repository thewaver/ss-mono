import { StoreUtils } from "@thewaver/ss-utils";

import type { FrameRate, FrameRateMonitor } from "./FrameRateMonitor.types";

/** How long each sample covers. A second is long enough to be steady and short enough to react. */
const SAMPLE_INTERVAL_MS = 1000;

/** Nothing counted yet. */
const NO_FRAME_RATE: FrameRate = { current: 0, average: 0 };

/** Measures how many frames the browser is actually painting. */
export namespace FrameRateMonitorUtils {
    /**
     * Counts frames and reports the rate, both recent and since counting started.
     *
     * Two numbers, because they answer different questions: the current rate says whether the page is
     * struggling right now, and the average says whether it has been struggling all along. The monitor is a
     * store of both, counted between `observe` and the function it returns; stopping resets them to zero rather
     * than freezing them, so a consumer cannot mistake a stale number for a live one. Stop it while the tab is in
     * the background, where the browser throttles frames and any reading would be meaningless.
     *
     * @param opts.startupTimeMs How long each `observe` waits before counting. Mounting and the first paint are
     * expensive and would drag the average down for the rest of the session, so a monitor watching a
     * heavy component should let it settle first.
     * @returns The monitor. Both numbers are zero until the first sample completes.
     */
    export const create = (opts?: { startupTimeMs?: number }): FrameRateMonitor => {
        const store = StoreUtils.create(NO_FRAME_RATE);

        const observe = () => {
            let cycleFrameCount = 0;
            let totalFrameCount = 0;
            let lastTime: number;
            let firstTime: number;
            let rafId: ReturnType<typeof requestAnimationFrame>;

            const updateFrameRate = () => {
                const now = performance.now();

                cycleFrameCount++;
                totalFrameCount++;

                if (now - lastTime >= SAMPLE_INTERVAL_MS) {
                    const current = (cycleFrameCount * SAMPLE_INTERVAL_MS) / (now - lastTime);
                    const average = (totalFrameCount * SAMPLE_INTERVAL_MS) / (now - firstTime);

                    cycleFrameCount = 0;
                    lastTime = now;

                    store.set({ current, average });
                }

                rafId = requestAnimationFrame(updateFrameRate);
            };

            const timeoutHandle = setTimeout(() => {
                lastTime = performance.now();
                firstTime = lastTime;

                rafId = requestAnimationFrame(updateFrameRate);
            }, opts?.startupTimeMs ?? 0);

            return () => {
                clearTimeout(timeoutHandle);
                cancelAnimationFrame(rafId);
                store.set(NO_FRAME_RATE);
            };
        };

        return { get: store.get, subscribe: store.subscribe, observe };
    };
}
