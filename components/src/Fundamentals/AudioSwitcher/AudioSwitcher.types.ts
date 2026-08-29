import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type AudioSwitcherController = {
    reset: () => boolean;
};

export type AudioSwitcherProps = AccessorProps<{
    src: string;
    crossfadeMs?: number;
    volume?: number;
    playbackSignal?: SignalSource<boolean>;
    onMount?: (controller: AudioSwitcherController) => void;
}>;
