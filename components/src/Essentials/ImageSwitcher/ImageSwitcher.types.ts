import type { AccessorProps } from "../../Utils/typeUtils";

export type ImageSwitcherProps = AccessorProps<{
    /** The picture to show. Changing it is what the switcher crossfades between. */
    src: string | undefined;
    /** How long the crossfade from one picture to the next takes. */
    transitionDurationMs?: number;
    /** Runs once the picture has loaded, which is when the crossfade can start rather than when it was asked for. */
    onLoad?: GlobalEventHandlers["onload"];
}>;
