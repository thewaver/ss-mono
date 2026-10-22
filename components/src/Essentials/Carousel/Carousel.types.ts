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

export type CarouselPlacementRule = {
    /** Where one slide is drawn, from its distance and the carousel's box. */
    place: CarouselPlacementFn;
    /**
     * The furthest distance, either side of the slide showing, at which the rule still draws anything.
     *
     * On a looping carousel with too few slides to fill that many places each side, the slides are repeated round
     * the ring until they do, so the slide furthest round never swaps from one end to the other in sight. The copies
     * show the same content, are as hidden from the keyboard and from screen readers as any slide that is not showing,
     * and pressing one brings up its original. Left out, the slides are drawn once each, whatever the count.
     */
    reach?: number;
};

export type CarouselState = {
    /** How long a slide is held before the carousel moves on by itself. */
    autoplayDelayMs?: number;
    /** How long the move from one slide to the next takes. */
    transitionDurationMs?: number;
    /** Turns the carousel off, so neither its controller nor its swipes do anything. */
    isDisabled?: boolean;
    /**
     * Whether stepping past the last slide comes round to the first, and back from the first to the last.
     * Defaults to `true`. When off, a step back from the first slide and on from the last is refused, and the
     * controller's `getCanStep` says so, a swipe past either end springs back, and automatic rotation stops on the last
     * slide by writing `false` to `playback`. With looping off, distances are counted straight rather than the
     * short way round, so a placement that closes into a ring — the drum — shows a seam where the ends meet.
     */
    isLooping?: boolean;
    /**
     * Whether only the slides the placement draws are built. Off by default, every slide is built from the first
     * render and kept, hidden and unreachable while it is away. On, a slide further from the one showing than the
     * placement's `reach` is not built at all, and is built again as it comes back within reach — so a hundred
     * expensive slides cost only the handful in sight. **A slide that leaves and comes back is a new one**: whatever
     * it held — text typed into it, a video's place — is gone, so keep that in the consumer's own data. A placement
     * with no `reach` cannot say which slides it draws, and every slide is built as though this were off.
     */
    isWindowed?: boolean;
    /** Names the carousel for assistive technology. */
    ariaLabel: string;
};

export type CarouselLabels = {
    /**
     * Names one slide for assistive technology, and is told how many there are so it can say third of five.
     * The index is zero-based, matching `renderSlide`. It is also what is announced when a different slide comes up.
     */
    computeSlideLabel: (index: number, count: number) => string;
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

export type BaseCarouselValues<T> = CarouselState &
    Pick<CarouselLabels, "roleDescription" | "slideRoleDescription"> & {
        /** Which way the slides run, which is the way the carousel is swiped. */
        orientation?: CarouselOrientation;
        /** The slides, in the order they are shown. */
        slides: T[];
    };

export type BaseCarouselCbs = Omit<CarouselLabels, "roleDescription" | "slideRoleDescription"> & {
    /**
     * Where each slide is drawn, from how far it is from the one showing. Its `place` is handed the slide's
     * distance — counted in slides, fractional while the carousel moves, and the short way round when it loops —
     * with the carousel's box, and answers with the transforms and filters that put the slide there, as a proximity
     * effect does; its `reach` says how far either side it draws, so too few slides on a looping carousel are
     * repeated to fill it. `CarouselPlacementUtils` ships the track, the drum, cover flow, a depth wave, a cylinder,
     * a stack of folders, a hinge, a concertina and a paddle wheel, each tunable; a rule of the consumer's own is any
     * object of the same shape. Every slide fills the carousel's box before it is placed, and the box clips them. A
     * press on a slide drawn beside the one showing brings it up, worked out from where the press landed rather than
     * from which slide is on top; the pickers stay the keyboard's way to do the same.
     */
    placement: CarouselPlacementRule;
    /** Runs when a different slide comes up. */
    onIndexChange?: (index: number) => void;
};

export type BaseCarouselProps<T> = BaseCarouselValues<T> & BaseCarouselCbs;
