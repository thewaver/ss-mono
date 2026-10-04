import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { ProximityEffect } from "../../Abstracts/Proximity/Proximity.types";
import type { BarrelAxis, BarrelFace } from "../../Primitives/Barrel/Barrel.types";

export type CarouselOrientation = "horizontal" | "vertical";

export type CarouselAxis = BarrelAxis;

export type CarouselFace = BarrelFace;

export type CarouselStep = "previous" | "next";

export type CarouselSlideState = {
    /** Which slide this is, counting from zero. */
    index: number;
    /** How many slides there are. */
    count: number;
    /**
     * How far this slide is from the one showing, in slides: `0` for the slide showing, `1` for the next, `-1` for
     * the one before, and fractions while the carousel moves. On a looping carousel it is measured the short way
     * round, so the first slide sits beside the last.
     */
    distance: number;
    /** Which side of the slide is being drawn, for a placement that turns slides over. */
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

export type CarouselPlacementDefs = {
    /**
     * How far the slide is from the one showing, in slides, fractional while the carousel moves and measured the
     * short way round when it loops — see {@link CarouselSlideState.distance}.
     */
    distance: number;
    /** Which slide is being placed, counting from zero. */
    index: number;
    /** How many slides there are. */
    count: number;
    /** The carousel's own box, in pixels, which every slide fills before it is placed. */
    size: Size2d;
    /** Which way the carousel runs, which is the way it is swiped. */
    orientation: CarouselOrientation;
    /** Whether the carousel comes round from its last slide to its first. */
    isLooping: boolean;
};

export type CarouselPlacement = {
    /**
     * Where the slide is drawn and how it looks there, as transform and filter values: a slide is moved, turned,
     * scaled, faded or blurred by its distance. A translation along x or y is a percentage of the carousel's box; a
     * `perspective` puts the slide under a viewer that many pixels away, and since every slide sits in the same box
     * before it is placed, slides given the same `perspective` share one vanishing point.
     */
    effect: ProximityEffect;
    /**
     * Where the slide turns and scales about, as a fraction across its box: `{ x: 0.5, y: 1 }` for its bottom edge.
     * Left out, its center.
     */
    origin?: Point2d;
    /** Which slide is drawn over which: higher is nearer the viewer. Left out, nearer the one showing is higher. */
    layer?: number;
    /**
     * What the slide turns over about, so its back is drawn the right way up: `row` about the upright axis, as a
     * page in a book, `column` about the level one, as a card flipped down. Left out, `row` for a carousel running
     * across and `column` for one running up and down.
     */
    axis?: CarouselAxis;
};

export type CarouselPlacementFn = (defs: CarouselPlacementDefs) => CarouselPlacement;

export type CarouselRotationFlags = {
    isPlaying: boolean;
    isHeld: boolean;
};

export type CarouselState = {
    /** How long a slide is held before the carousel moves on by itself. */
    autoplayDelayMs?: number;
    /** How long the move from one slide to the next takes. */
    transitionDurationMs?: number;
    /** The space between the slides and the controls the consumer draws beside them. */
    gap?: number;
    /** Turns the carousel off, so neither its controls nor its swipes do anything. */
    isDisabled?: boolean;
    /**
     * Whether stepping past the last slide comes round to the first, and back from the first to the last.
     * Defaults to `true`. When off, the Previous control on the first slide and the Next control on the last
     * are disabled and refuse, a swipe past either end springs back, and automatic rotation stops on the last
     * slide by writing `false` to `playback`. With looping off, distances are counted straight rather than the
     * short way round, so a placement that closes into a ring — the drum — shows a seam where the ends meet.
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
