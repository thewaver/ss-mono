import type { BarrelAxis, BarrelFace } from "../Barrel/Barrel.types";

export type CarouselVariant = "track" | "drum";

export type CarouselOrientation = "horizontal" | "vertical";

export type CarouselAxis = BarrelAxis;

export type CarouselFace = BarrelFace;

export type CarouselStep = "previous" | "next";

export type CarouselSlideState = {
    /** Which slide this is, counting from zero. */
    index: number;
    /** How many slides there are. */
    count: number;
    /** Which side of the slide is being drawn, for a carousel that turns rather than slides. */
    face: CarouselFace;
    /** Whether this is the slide currently shown. */
    isCurrent: boolean;
};

export type CarouselStepRenderProps = {
    /** Which way this control moves the carousel. */
    step: CarouselStep;
    /**
     * Which slide this control would move to, so a control at the end can tell it would wrap around. On a
     * carousel that does not loop, a control at the end is disabled and this is the slide already showing.
     */
    targetIndex: number;
};

export type CarouselPickRenderProps = {
    /** Which slide this picker stands for. */
    index: number;
    /** Whether this picker's slide is the one showing. */
    isCurrent: boolean;
};

export type CarouselRotationFlags = {
    isPlaying: boolean;
    isHeld: boolean;
};

export type CarouselState = {
    /** How long a slide is held before the carousel moves on by itself. */
    autoplayDelayMs?: number;
    /** How long the move from one slide to the next takes. */
    transitionDurationMs?: number;
    /** The space between slides. */
    gap?: number;
    /** Turns the carousel off, so neither its controls nor its swipes do anything. */
    isDisabled?: boolean;
    /**
     * Whether stepping past the last slide comes round to the first, and back from the first to the last.
     * Defaults to `true`. When off, the Previous control on the first slide and the Next control on the last
     * are disabled and refuse, a swipe past either end springs back, and automatic rotation stops on the last
     * slide by writing `false` to `playbackSignal`. A drum carousel is a closed ring whose last face sits
     * beside its first, so the default is the right one there: turned off, the drum stops against a seam
     * nothing on screen shows.
     */
    isLooping?: boolean;
    /** Names the carousel for assistive technology. */
    ariaLabel: string;
};

export type CarouselLabels = {
    /**
     * Names one slide for assistive technology, and is told how many there are so it can say third of five.
     * The index is zero-based, matching `renderSlide` and `renderPick`. It is also what is announced when a
     * different slide comes up, and what names each picker.
     */
    computeSlideLabel: (index: number, count: number) => string;
    /** Names one of the move controls. */
    computeStepLabel: (step: CarouselStep) => string;
    /** Names the play and pause control, told which state it is in. */
    computeRotationLabel: (isPlaying: boolean) => string;
    /**
     * What the carousel is called when it is announced, so a reader hears carousel rather than region. Defaults to
     * "carousel".
     */
    roleDescription?: string;
    /**
     * What one slide is called when it is announced, so a reader hears slide rather than group. Defaults to
     * "slide".
     */
    slideRoleDescription?: string;
};
