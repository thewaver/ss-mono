import { untrack } from "svelte";

import { FrameRateMonitorUtils } from "@thewaver/ss-components";

import { readStore } from "../../Utils/storeUtils.js";
import { InteractionTrackerSvelteUtils } from "../InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";

/** The Svelte side of {@link FrameRateMonitorUtils}: the frame rate as a getter, paused with the tab. */
export namespace FrameRateMonitorSvelteUtils {
    /**
     * Counts frames and reports the rate, both recent and since the monitor started.
     *
     * {@link FrameRateMonitorUtils.create}, counting while the component lives, is not disabled and the tab is in the
     * foreground, and reset to zero whenever it stops.
     *
     * Must run while a component is being set up.
     *
     * @param getIsDisabled Pass `true` to stop counting.
     * @param opts.startupTimeMs How long to wait before counting. Mounting and the first paint are expensive and
     * would drag the average down for the rest of the session, so a monitor watching a heavy component should let it
     * settle first. Read when the monitor is made.
     * @returns `getFrameRate`, giving `current` for the last sample and `average` since counting began. Both are
     * zero until the first sample completes.
     */
    export const create = (getIsDisabled: () => boolean, opts?: { startupTimeMs?: number }) => {
        const monitor = FrameRateMonitorUtils.create(opts);
        const getFrameRate = readStore(monitor);
        const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

        $effect(() => {
            if (getIsPageHidden() || getIsDisabled()) return;

            return untrack(() => monitor.observe());
        });

        return { getFrameRate };
    };
}
