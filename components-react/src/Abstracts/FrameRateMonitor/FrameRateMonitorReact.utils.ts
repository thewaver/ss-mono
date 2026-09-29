import { useEffect, useState } from "react";

import { FrameRateMonitorUtils } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";
import { InteractionTrackerReactUtils } from "../InteractionTracker/InteractionTrackerReact.utils";

/** The React side of `FrameRateMonitorUtils`: the frame rate as state, paused with the tab. */
export namespace FrameRateMonitorReactUtils {
    /**
     * Counts frames and reports the rate, both recent and since counting started.
     *
     * `FrameRateMonitorUtils.create`, counting while mounted, not disabled and in the foreground, and reset to zero
     * whenever it stops.
     *
     * @param isDisabled Pass `true` to stop counting.
     * @param opts.startupTimeMs How long to wait before counting, so mounting does not drag the average down. Read
     * when the monitor is made.
     * @returns `current` for the last sample and `average` since counting began. Both are zero until the first
     * sample completes.
     */
    export const useFrameRate = (isDisabled = false, opts?: { startupTimeMs?: number }) => {
        const [monitor] = useState(() => FrameRateMonitorUtils.create(opts));
        const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

        useEffect(
            () => (isPageHidden || isDisabled ? undefined : monitor.observe()),
            [monitor, isPageHidden, isDisabled],
        );

        return useStore(monitor);
    };
}
