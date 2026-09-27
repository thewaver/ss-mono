import { type Accessor, createEffect, onCleanup } from "solid-js";

import { FrameRateMonitorUtils } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";
import { InteractionTrackerSolidUtils } from "../InteractionTracker/InteractionTrackerSolid.utils";

/** The Solid side of {@link FrameRateMonitorUtils}: the frame rate as a signal, paused with the tab. */
export namespace FrameRateMonitorSolidUtils {
    /**
     * Counts frames and reports the rate, both recent and since the monitor started.
     *
     * {@link FrameRateMonitorUtils.create}, counting while the owner lives, is not disabled and the tab is in the
     * foreground, and reset to zero whenever it stops.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getIsDisabled Pass `true` to stop counting.
     * @param opts.startupTimeMs How long to wait before counting. Mounting and the first paint are
     * expensive and would drag the average down for the rest of the session, so a monitor watching a
     * heavy component should let it settle first.
     * @returns `getFrameRate`, giving `current` for the last sample and `average` since counting began.
     * Both are zero until the first sample completes.
     */
    export const create = (getIsDisabled: Accessor<boolean>, opts?: { startupTimeMs?: number }) => {
        const monitor = FrameRateMonitorUtils.create(opts);
        const getFrameRate = accessStore(monitor);
        const getIsPageHidden = InteractionTrackerSolidUtils.trackPageHidden();

        createEffect(() => {
            if (getIsPageHidden() || getIsDisabled()) return;

            onCleanup(monitor.observe());
        });

        return { getFrameRate };
    };
}
