export type ImageSwitcherState = {
    prevSrc: string | undefined;
    currentSrc: string | undefined;
    prevAlt: string | undefined;
    currentAlt: string | undefined;
    version: number;
};

export type ImageSwitcherLayer = {
    src: string | undefined;
    alt: string | undefined;
    isShown: boolean;
};

export type ImageSwitcherShowOpts = {
    alt?: string;
    onLoad?: GlobalEventHandlers["onload"];
    onError?: (e: Event) => void;
};

export type BaseImageSwitcherValues = {
    /** The picture to show. Changing it is what the switcher crossfades between. */
    src: string | undefined;
    /**
     * What the picture says, for anyone who cannot see it. Required but nullable, so the decision is stated
     * rather than defaulted: pass the text a meaningful picture carries, or `undefined` for one that is
     * decoration and should be skipped over. It belongs to the `src` it arrives with: while a new picture loads, or
     * after one fails, the picture on screen keeps its own text.
     */
    alt: string | undefined;
    /** How long the crossfade from one picture to the next takes. */
    transitionDurationMs?: number;
};

export type BaseImageSwitcherCbs = {
    /** Runs once the picture has loaded, which is when the crossfade can start rather than when it was asked for. */
    onLoad?: GlobalEventHandlers["onload"];
    /**
     * Runs when the picture fails to load. The switcher keeps showing the picture it had, so nothing broken is ever
     * drawn; this is where to say so, or to hand it a fallback `src`.
     */
    onError?: (e: Event) => void;
};

export type BaseImageSwitcherProps = BaseImageSwitcherValues & BaseImageSwitcherCbs;
