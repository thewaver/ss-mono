import type { BaseCellAnimationCbs, BaseCellAnimationValues } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type CellAnimationProps = AccessorValues<BaseCellAnimationValues> &
    BaseCellAnimationCbs & {
        /** Whether the animation is running. It is the only thing that starts or pauses it. */
        playback?: SignalSource<boolean>;
        /**
         * How far through the current pass the grid is, `0`–`1`. The component writes it as the pass runs, and writing it
         * moves the pass there: while playing it carries on from the new point, and with playback paused it scrubs, the
         * grid drawn at whatever is written. It goes back to `0` at the start of each pass and when `src` changes.
         */
        progress?: SignalSource<number>;
    };
