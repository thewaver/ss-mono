import type { CSSAnimationValues, Point2d, Rect } from "@thewaver/ss-utils";

import type { SliceAnimationRenderer } from "../../../Abstracts/SliceAnimation/SliceAnimation.types";

/** One stop of a particle's route: a target's index, or `"spawner"` for its own spawner. */
export type ParticleRouteStop = number | "spawner";

export type ParticleTravelDefs = {
    /** Unique across every spawner on the page, for as long as the particle lives. */
    id: number;
    /** Its place in its round, from `0`. */
    index: number;
    /** The stop this leg heads for: a target's index, or `"spawner"`. */
    stop: ParticleRouteStop;
    /** Which leg of its route the particle is on, from `0`. */
    legIndex: number;
    /** How many legs its route has. */
    legCount: number;
    /** The spawner's center, relative to the spawner's box — where the first leg starts. */
    origin: Point2d;
    /** Where this leg starts: the spawner's center for the first leg, the stop before it for any other. */
    from: Point2d;
    /** Where this leg ends. */
    to: Point2d;
    /**
     * The center of each of `modMarkers`, relative to the spawner's box and measured this frame, or `undefined` for
     * one not on the page — where a modifier acting from a place finds that place.
     */
    modMarkers: (Point2d | undefined)[];
    /** Whether the reader asked for reduced motion. */
    prefersReducedMotion: boolean;
};

/**
 * Moves one particle off its path: takes the point so far, the leg, how far along the leg the particle is (`0`–`1`)
 * and how many milliseconds since it set off, and returns the new point.
 */
export type ParticleModifier = (pos: Point2d, travel: ParticleTravelDefs, t: number, elapsedMs: number) => Point2d;

export type ParticleSpawnerDirectValues = {
    scaleX: number;
    scaleY: number;
    rotate: number;
    opacity: number;
    shiftX: number;
    shiftY: number;
};

export type ParticleSpawnIterationPattern = {
    count: number;
    beginDelayMs?: number;
    nextIndex?: number;
};

export type ParticleSpawnerParticle = {
    /** Unique across every spawner on the page, for as long as the particle lives. */
    id: number;
    /** Its place in its round, from `0`. */
    index: number;
    /** The stops it visits in order: target indices, and `"spawner"` for its own spawner. */
    route: ParticleRouteStop[];
    /** When it sets off, in milliseconds from the start of its round. */
    startsAtMs: number;
};

export type ParticleSpawnerTiming = {
    /** How long each particle waits after the one before it sets off. */
    spawnDelayMs: number;
    /** How long one particle takes to walk each leg of its route. */
    travelDurationMs: number;
    /** How long a particle stays put at the end of each leg. */
    restDurationMs: number;
};

export type ParticleSpawnerFrame = {
    /** The spawner's box, in viewport content coordinates, or `undefined` while the spawner is not on the page. */
    rootRect: Rect | undefined;
    /** Each target's box, in the same coordinates. A missing one sends its particles nowhere but the spawner. */
    targetRects: (Rect | undefined)[];
    /** Each of `modMarkers`' boxes, in the same coordinates. Left out when there are none. */
    modMarkerRects?: (Rect | undefined)[];
    /** Whether the reader asked for reduced motion, handed on to `computeParticlePos`. */
    prefersReducedMotion: boolean;
};

export type ParticleSpawnerController = {
    /**
     * Sends one round of particles now, from the spawner's own position, alongside anything already playing.
     *
     * The round is staggered by `spawnDelayMs` and aimed through `computeTarget` exactly as a played round is, and
     * each particle reports through `onParticleArrive`. It is not a round of `spawnIterationPatterns`, so it never
     * calls `onIterationEnd` or `onAnimationEnd`, runs whether playback is on or paused, and is not moved by
     * `progress`.
     *
     * @param count How many particles to send, rounded to a whole number.
     * @returns `false` when nothing was sent: the count rounds to nothing, there are no targets, the spawner is not
     * on the page yet, or the page is hidden.
     */
    emit: (count: number) => boolean;
};

export type BaseParticleSpawnerValues = {
    /**
     * The picture every particle is drawn with, at the picture's own size — so an SVG gives itself a `width` and a
     * `height`, or it is drawn at 300 × 150. A white picture takes any color through `computeParticleTint`.
     */
    src: string;
    /** The elements particles travel to. A missing one is skipped rather than aimed at. */
    targets: (HTMLElement | undefined)[];
    /**
     * Elements the spawner measures every frame, as it does its targets, and hands to `particleModifiers` as
     * `modMarkers` — the place a modifier acts from, such as what `ParticleModifierUtils.createAttraction` pulls
     * toward. No particle is aimed at one. Left out, nothing extra is measured.
     */
    modMarkers?: (HTMLElement | undefined)[];
    /** How many particles are sent on each round. */
    particleCount: number;
    /** How long one particle takes to walk its path — each leg of it, when `computeRoute` gives it several. */
    travelDurationMs?: number;
    /**
     * How long a particle stays put at the end of its path before it disappears — at the end of each leg, when
     * `computeRoute` gives it several, before it sets off on the next.
     */
    restDurationMs?: number;
    /** How long each particle waits after the one before it sets off, which is what staggers them. */
    spawnDelayMs?: number;
    /** How the rounds follow each other — in bursts, one at a time, or without a pause. */
    spawnIterationPatterns?: ParticleSpawnIterationPattern[];
    /**
     * What draws the particles. `"graphics_card"` draws them into one canvas and falls back to page elements by itself
     * wherever it cannot: no WebGL 2, a
     * picture whose server gives no cross-origin permission, or a moment the browser has taken the graphics card away.
     * `"elements"` always draws each particle as an element of its own, which keeps an animated picture playing — the
     * graphics card draws only its first frame.
     */
    renderer?: SliceAnimationRenderer;
};

export type BaseParticleSpawnerCbs = {
    /** Which target one particle is aimed at. Not asked when `computeRoute` is given; left out, a target is picked at random. */
    computeTarget?: (index: number, targetCount: number) => number;
    /**
     * The stops one particle visits in order, each leg walked with `travelDurationMs` and rested with
     * `restDurationMs`: a target's index, or `"spawner"` to come back to its own spawner. `[0, "spawner"]` is a round
     * trip to the first target. An index with no target behind it sends that leg to the spawner, and an empty route
     * sends nothing. Left out, every particle has one stop, from `computeTarget`.
     */
    computeRoute?: (index: number, targetCount: number) => ParticleRouteStop[];
    /**
     * Where one particle is at a given point along one leg of its route, which is what makes the path a curve rather
     * than a straight line; `defs.from` and `defs.to` are that leg's ends. It must give the same point whenever it is
     * asked about the same particle on the same leg at the same `t`, since a scrub asks about any point again.
     * Anything random is drawn once per particle `id` and kept.
     */
    computeParticlePos: (defs: ParticleTravelDefs, t: number) => Point2d;
    /**
     * Functions that move a particle off its path, applied in order to the point `computeParticlePos` gives — wind,
     * attraction, anything that acts on every path alike. Each receives the point so far, the leg, how far along the
     * leg the particle is, and how long since it set off, and returns the new point. Like `computeParticlePos`, each
     * must give the same point for the same arguments, since a scrub asks again. `ParticleModifierUtils` makes some.
     */
    particleModifiers?: ParticleModifier[];
    /**
     * What one particle looks like at a given point along its path — a glow as it nears its target, a fade as it
     * arrives — in the same values `CellAnimation` takes for a cell. Worked out every frame alongside its position.
     * The graphics card draws only its scale, its turn, its fade and its travel; a filter, such as a blur or a change of
     * brightness, shows only with `renderer` set to `"elements"`.
     */
    computeParticleAnimation?: (defs: ParticleTravelDefs, t: number) => CSSAnimationValues;
    /**
     * The color one particle is multiplied by, as CSS writes it, asked as it sets off on each leg of its route and
     * again if a scrub brings it back — so a route can change color at a stop. A picture tinted red stays the same
     * picture, only redder; left out, the picture is drawn as it is.
     */
    computeParticleTint?: (defs: ParticleTravelDefs) => string;
    /**
     * Runs when one particle reaches the last stop of its route and has rested there, while playing; a scrub past it
     * runs nothing.
     */
    onParticleArrive?: (index: number) => void;
    /** Runs at the end of each round, while playing. */
    onIterationEnd?: () => void;
    /** Runs once every round is done, while playing. */
    onAnimationEnd?: () => void;
    /** Hands the consumer a controller once the spawner is up, for sending particles on demand. */
    onMount?: (controller: ParticleSpawnerController) => void;
};

export type BaseParticleSpawnerProps = BaseParticleSpawnerValues & BaseParticleSpawnerCbs;
