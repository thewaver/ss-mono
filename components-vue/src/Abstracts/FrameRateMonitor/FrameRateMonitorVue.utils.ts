import { type MaybeRefOrGetter, toValue } from "vue";

import { FrameRateMonitorUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";
import { InteractionTrackerVueUtils } from "../InteractionTracker/InteractionTrackerVue.utils";

/** The Vue side of `FrameRateMonitorUtils`: the frame rate as a ref, paused with the tab. */
export namespace FrameRateMonitorVueUtils {
    /**
     * Counts frames and reports the rate, both recent and since counting started.
     *
     * `FrameRateMonitorUtils.create`, counting while mounted, not disabled and in the foreground, and reset to zero
     * whenever it stops.
     *
     * Must run inside a component's `setup`.
     *
     * @param isDisabled Pass `true` to stop counting.
     * @param opts.startupTimeMs How long to wait before counting, so mounting does not drag the average down. Read
     * when the monitor is made.
     * @returns A ref of `current` for the last sample and `average` since counting began. Both are zero until the
     * first sample completes.
     */
    export const useFrameRate = (isDisabled: MaybeRefOrGetter<boolean> = false, opts?: { startupTimeMs?: number }) => {
        const monitor = FrameRateMonitorUtils.create(opts);
        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        watchAfterRender([isPageHidden, () => toValue(isDisabled)], ([isHidden, isOff]) =>
            isHidden || isOff ? undefined : monitor.observe(),
        );

        return useStore(monitor);
    };
}
