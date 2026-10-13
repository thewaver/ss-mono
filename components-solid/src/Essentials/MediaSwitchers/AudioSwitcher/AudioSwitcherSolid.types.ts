import type { AudioSwitcherCbs, BaseAudioSwitcherValues } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type AudioSwitcherProps = AccessorValues<BaseAudioSwitcherValues> &
    AudioSwitcherCbs &
    AccessorProps<{
        /** Whether audio is playing. It is the only thing that starts or stops it. */
        playback?: SignalSource<boolean>;
    }>;
