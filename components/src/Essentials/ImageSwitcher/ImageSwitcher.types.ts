import type { AccessorProps } from "../../Utils/typeUtils";

export type ImageSwitcherProps = AccessorProps<{
    /** The picture to show. Changing it is what the switcher crossfades between. */
    src: string | undefined;
    /**
     * What the picture says, for anyone who cannot see it. Required but nullable, so the decision is stated
     * rather than defaulted: pass the text a meaningful picture carries, or `undefined` for one that is
     * decoration and should be skipped over.
     */
    alt: string | undefined;
    /** How long the crossfade from one picture to the next takes. */
    transitionDurationMs?: number;
    /** Runs once the picture has loaded, which is when the crossfade can start rather than when it was asked for. */
    onLoad?: GlobalEventHandlers["onload"];
}>;
