import {
    type CSSAnimationValues,
    MathUtils,
    type Point2d,
    type Rect,
    type Size2d,
    type Store,
    StoreUtils,
} from "@thewaver/ss-utils";

import type {
    ParticleModifier,
    ParticleRouteStop,
    ParticleSpawnIterationPattern,
    ParticleSpawnerDirectValues,
    ParticleSpawnerFrame,
    ParticleSpawnerParticle,
    ParticleSpawnerPlacement,
    ParticleSpawnerTiming,
    ParticleTravelDefs,
} from "./ParticleSpawner.types";

const NO_DELAY_MS = 0;
const PERCENT = 100;
const AREA_STEP_PX = 64;
const FIRST_STAGE = 0;
const NO_PROGRESS = 0;
const FULL_PROGRESS = 1;

const toValue = (value: number | number[] | undefined, idx: number) =>
    Array.isArray(value) ? value[idx] : idx === 0 ? value : undefined;

const snapOut = (value: number) => Math.floor(value / AREA_STEP_PX) * AREA_STEP_PX;

const snapIn = (value: number) => Math.ceil(value / AREA_STEP_PX) * AREA_STEP_PX;

let nextId = 0;

type Round = ParticleSpawnerTiming & {
    durationMs: number;
    startMs: number;
    elapsedMs: number;
    particles: RoundParticle[];
};

type RoundParticle = ParticleSpawnerParticle & { round: Round };

type FrameParticipant = {
    read: () => void;
    write: (nowMs: number) => void;
};

const NO_PARTICLES: RoundParticle[] = [];

const NO_MODIFIERS: ParticleModifier[] = [];

const NO_RECTS: (Rect | undefined)[] = [];

type Leg = { legIndex: number; t: number; elapsedMs: number };

const participants = new Set<FrameParticipant>();

let sharedFrameId: ReturnType<typeof requestAnimationFrame> | undefined;

const runSharedFrame = (nowMs: number) => {
    sharedFrameId = undefined;

    const current = [...participants];

    for (const participant of current) {
        if (participants.has(participant)) participant.read();
    }

    for (const participant of current) {
        if (participants.has(participant)) participant.write(nowMs);
    }

    if (participants.size > 0 && sharedFrameId === undefined) sharedFrameId = requestAnimationFrame(runSharedFrame);
};

const joinSharedFrame = (participant: FrameParticipant) => {
    participants.add(participant);

    if (sharedFrameId === undefined) sharedFrameId = requestAnimationFrame(runSharedFrame);
};

const leaveSharedFrame = (participant: FrameParticipant) => {
    participants.delete(participant);

    if (participants.size > 0 || sharedFrameId === undefined) return;

    cancelAnimationFrame(sharedFrameId);
    sharedFrameId = undefined;
};

const toLegMs = (timing: ParticleSpawnerTiming) => timing.travelDurationMs + timing.restDurationMs;

const toEndMs = (particle: RoundParticle) => particle.startsAtMs + particle.route.length * toLegMs(particle.round);

const isLiveAt = (particle: RoundParticle, elapsedMs: number) =>
    elapsedMs >= particle.startsAtMs && elapsedMs < toEndMs(particle);

const toLeg = (particle: RoundParticle): Leg => {
    const { round } = particle;
    const elapsedMs = Math.max(round.elapsedMs - particle.startsAtMs, 0);
    const legMs = toLegMs(round);
    const lastLeg = particle.route.length - 1;
    const legIndex = legMs <= 0 ? lastLeg : Math.min(Math.floor(elapsedMs / legMs), lastLeg);
    const legElapsedMs = elapsedMs - legIndex * legMs;
    const t = round.travelDurationMs <= 0 ? FULL_PROGRESS : MathUtils.clamp01(legElapsedMs / round.travelDurationMs);

    return { legIndex, t, elapsedMs };
};

const isSameList = <T>(a: readonly T[], b: readonly T[]) =>
    a.length === b.length && a.every((item, idx) => item === b[idx]);

/**
 * The pieces of a particle's motion that are not the caller's own evaluator: settling how many a
 * round sends, picking a target when none is asked for, measuring where that target actually is,
 * writing the answer onto the particle's element without going through a framework, and the engine
 * that sends rounds and walks every live particle on animation frames.
 */
export namespace ParticleSpawnerUtils {
    /**
     * Turns a requested particle count into one a round can send.
     *
     * A fractional count is rounded rather than truncated, and a negative one is treated as none, so a caller
     * handing over a computed number never asks for an impossible round.
     *
     * @param count The count asked for.
     * @returns A whole number, `0` or more.
     */
    export const toParticleCount = (count: number): number => Math.max(0, Math.round(count));

    /**
     * Picks a random target index, used when a spawner is given no `computeTarget` of its own.
     *
     * @param targetCount How many targets are available.
     * @returns An index from `0` up to but excluding `targetCount`, or `undefined` when there are none
     * to pick from.
     */
    export const pickRandomTarget = (targetCount: number): number | undefined =>
        targetCount <= 0 ? undefined : Math.floor(Math.random() * targetCount);

    /**
     * The center of an element's box, relative to another element's box, in pixels.
     *
     * Both boxes are expected in viewport content coordinates — `ElementObserverUtils`'s rect
     * observers, never a raw `getBoundingClientRect` — so the target need not be a descendant of the
     * root, or share any ancestor with it beyond the document itself, and the answer stays correct
     * inside a scaled `Viewport`.
     *
     * @param rect The box being measured.
     * @param rootRect The box positions are being measured relative to.
     * @returns The first box's center, in the second box's own coordinate space.
     */
    export const toRelativeCenter = (rect: Rect, rootRect: Rect): Point2d => ({
        x: rect.x + rect.width * 0.5 - rootRect.x,
        y: rect.y + rect.height * 0.5 - rootRect.y,
    });

    /**
     * The part of a particle's look the graphics card draws: its scale, its turn, its fade and how far it is shifted
     * off its path, from the values `computeParticleAnimation` returns. Every other value is left out.
     *
     * @param values The particle's values at this point along its path.
     * @param size The particle's size, which a shift in percent is measured against.
     */
    export const toDirectValues = (values: CSSAnimationValues, size: Size2d): ParticleSpawnerDirectValues => ({
        scaleX: ((toValue(values.scale, 0) ?? PERCENT) * (toValue(values.scaleX, 0) ?? PERCENT)) / (PERCENT * PERCENT),
        scaleY:
            ((toValue(values.scale, 1) ?? toValue(values.scale, 0) ?? PERCENT) *
                (toValue(values.scaleY, 0) ?? PERCENT)) /
            (PERCENT * PERCENT),
        rotate: Number(values.rotate ?? 0) || 0,
        opacity: (Number(values.opacity ?? PERCENT) || 0) / PERCENT,
        shiftX: (((toValue(values.translate, 0) ?? 0) + (Number(values.translateX) || 0)) * size.width) / PERCENT,
        shiftY: (((toValue(values.translate, 1) ?? 0) + (Number(values.translateY) || 0)) * size.height) / PERCENT,
    });

    /**
     * The area a spawner's canvas covers, grown to take in one more particle.
     *
     * It grows in steps of whole blocks rather than to the pixel, and never shrinks, so the canvas is not made again
     * on every frame as particles move; a spawner starts again from nothing once no particle is left.
     *
     * @param area The area so far, or `undefined` for the first particle of a frame with none before it.
     * @param center Where the particle is centered, relative to the spawner's root.
     * @param size The particle's size.
     * @param direct Its scale and turn, from {@link toDirectValues}, which can carry it past its size.
     */
    export const growArea = (
        area: Rect | undefined,
        center: Point2d,
        size: Size2d,
        direct: ParticleSpawnerDirectValues,
    ): Rect => {
        const reach = Math.max(direct.scaleX, direct.scaleY, 1) * Math.hypot(size.width, size.height) * 0.5;
        const left = Math.min(area ? area.x : Infinity, snapOut(center.x - reach));
        const top = Math.min(area ? area.y : Infinity, snapOut(center.y - reach));
        const right = Math.max(area ? area.x + area.width : -Infinity, snapIn(center.x + reach));
        const bottom = Math.max(area ? area.y + area.height : -Infinity, snapIn(center.y + reach));

        return { x: left, y: top, width: right - left, height: bottom - top };
    };

    /**
     * The area a spawner's canvas starts a round with, taking in every place its particles are headed for: the
     * spawner's own box and every target and modifier marker, each with room for a particle around it.
     *
     * Starting from it, the area stays the same size while the round's particles fly between those places, and
     * {@link growArea} grows it only for a particle carried further — scaled up past its size, or pushed away by a
     * modifier. Snapped to the same blocks as {@link growArea}, with one block more on every side.
     *
     * @param placement Where the spawner, its targets and its markers are, from the engine's `getPlacement`;
     * `undefined` before anything was measured.
     * @param size The particle's size.
     * @returns The area, relative to the spawner's box, or `undefined` when `placement` is, so the area starts from the
     * first particle alone.
     */
    export const settleArea = (placement: ParticleSpawnerPlacement | undefined, size: Size2d): Rect | undefined => {
        if (!placement) return undefined;

        const reach = Math.hypot(size.width, size.height) * 0.5 + AREA_STEP_PX;
        const { origin, rootSize } = placement;

        let left = snapOut(origin.x - rootSize.width * 0.5 - reach);
        let top = snapOut(origin.y - rootSize.height * 0.5 - reach);
        let right = snapIn(origin.x + rootSize.width * 0.5 + reach);
        let bottom = snapIn(origin.y + rootSize.height * 0.5 + reach);

        for (const point of [...placement.targets, ...placement.modMarkers]) {
            if (!point) continue;

            left = Math.min(left, snapOut(point.x - reach));
            top = Math.min(top, snapOut(point.y - reach));
            right = Math.max(right, snapIn(point.x + reach));
            bottom = Math.max(bottom, snapIn(point.y + reach));
        }

        return { x: left, y: top, width: right - left, height: bottom - top };
    };

    /**
     * Writes a particle's position onto its element, centering the element on the point.
     *
     * Set directly on the style rather than through a signal, because this runs for every live
     * particle on every frame and the reactive round trip is not affordable at that rate.
     *
     * @param el The particle's own element.
     * @param pos Where to center it, relative to the spawner's root.
     */
    export const assignParticlePos = (el: HTMLElement, pos: Point2d) => {
        el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    };

    /**
     * The machinery of a spawner: rounds of particles worked out from a clock, so a round can be paused where it stands
     * and drawn at any point of it.
     *
     * A round makes every particle it will send as it starts — each one's id, route and the moment it sets off — and
     * from then on where every particle is, and whether it is out yet, follows from how far the round has run alone.
     * The rounds of `spawnIterationPatterns` run on `progress`, which the engine advances while running and a consumer
     * may write to move the round; a sent round (`emit`) runs on its own clock, playing or not. The engine keeps the
     * particles that are out in a store, which is what a view draws its elements from, and writes each one's position
     * straight onto its element. It reads everything that can change through `defs` at the moment it needs it, so it
     * is made once and never rebuilt.
     *
     * Every engine on the page shares one animation frame, and takes part in it only while something of its own moves.
     * In that frame each engine first asks where its spawner and targets are, and only then does any of them move a
     * particle, so the engines' measuring forces at most one layout a frame however many spawners there are.
     *
     * @param defs.getTargetCount How many targets there are now.
     * @param defs.computeTarget Which target one particle is aimed at. `undefined` picks one at random. Not asked when
     * `computeRoute` answers.
     * @param defs.computeRoute The stops one particle visits in order, each leg one travel and one rest. `undefined`
     * gives it the one stop `computeTarget` picks; an empty route sends nothing.
     * @param defs.getElement A particle's element, once the view has drawn it. A particle without one is not moved. Not
     * asked while `getIsDrawingElements` says no.
     * @param defs.getIsDrawingElements Whether the view draws particles as page elements. While it does not, the engine
     * asks for no element and writes no position.
     * @param defs.getFrame Where the spawner, its targets and its `modMarkers` are now. Called once a frame while anything moves, before
     * any engine moves anything, so it may measure the page directly; and once for each draw while nothing moves.
     * @param defs.getTiming The stagger, the travel and the rest a new round is made with.
     * @param defs.getParticleCount How many particles a played round sends.
     * @param defs.getPatterns The stages of rounds to play.
     * @param defs.getCanSpawn Whether anything can be sent now: on the page, visible, with somewhere to go.
     * @param defs.getProgress How far through the played round, `0`–`1`.
     * @param defs.setProgress Writes it, as the round runs and when a new one starts.
     * @param defs.computeParticlePos Where one particle is at a point along one leg. The same particle on the same leg
     * at the same point must give the same answer.
     * @param defs.getModifiers Functions applied in order to that point, each with the leg, how far along it and the
     * milliseconds since the particle set off. Read at every placement, so a change shows on the next draw.
     * @param defs.onParticlePlace Hands on where each placed particle is and how far along its path, every draw.
     * @param defs.onParticleArrive Runs as a particle is taken away at its last stop, with its place in its round. Only
     * while the round runs, never for a written `progress`.
     * @param defs.onIterationEnd Runs at the end of each played round.
     * @param defs.onAnimationEnd Runs after the last played round of a stage that names no next one.
     * @param defs.onTick Runs after each draw that placed any particle.
     * @returns `particles`, the particles that are out, as a store; `setIsRunning`, `restart`, `render`, `scrub`, `emit`,
     * `drawParticle`, `getPlacement`, `getHasEnded` and `stop`.
     */
    export const createEngine = (defs: {
        getTargetCount: () => number;
        computeTarget: (index: number, targetCount: number) => number | undefined;
        computeRoute: (index: number, targetCount: number) => ParticleRouteStop[] | undefined;
        getElement: (id: number) => HTMLElement | undefined;
        getIsDrawingElements: () => boolean;
        getFrame: () => ParticleSpawnerFrame;
        getTiming: () => ParticleSpawnerTiming;
        getParticleCount: () => number;
        getPatterns: () => ParticleSpawnIterationPattern[];
        getCanSpawn: () => boolean;
        getProgress: () => number;
        setProgress: (progress: number) => void;
        computeParticlePos: (travel: ParticleTravelDefs, t: number) => Point2d;
        getModifiers: () => ParticleModifier[] | undefined;
        onParticlePlace?: (travel: ParticleTravelDefs, pos: Point2d, t: number) => void;
        onParticleArrive?: (index: number) => void;
        onIterationEnd?: () => void;
        onAnimationEnd?: () => void;
        onTick?: () => void;
    }) => {
        const particles = StoreUtils.create(NO_PARTICLES);
        const emitted = new Set<Round>();

        let played: Round | undefined;
        let stageIndex = FIRST_STAGE;
        let repeatIndex = 0;
        let hasEnded = false;
        let isRunning = false;
        let isWriting = false;
        let lastMs = 0;
        let ownProgress = NO_PROGRESS;
        let lastPlacement: ParticleSpawnerPlacement | undefined;
        let pendingStage: number | undefined;
        let waitMs = 0;
        let waitStartMs = 0;
        let waitTimer: ReturnType<typeof setTimeout> | undefined;

        const toRoute = (index: number, targetCount: number): ParticleRouteStop[] => {
            const route = defs.computeRoute(index, targetCount);

            if (route) return route;

            const targetIndex = defs.computeTarget(index, targetCount) ?? pickRandomTarget(targetCount);

            return targetIndex === undefined ? [] : [targetIndex];
        };

        const createRound = (count: number, timing: ParticleSpawnerTiming, startMs: number): Round => {
            const targetCount = defs.getTargetCount();
            const round: Round = { ...timing, durationMs: 0, startMs, elapsedMs: 0, particles: [] };

            for (let index = 0; index < count; index++) {
                const route = toRoute(index, targetCount);

                if (route.length === 0) continue;

                const particle: RoundParticle = {
                    id: nextId++,
                    index,
                    route: [...route],
                    startsAtMs: index * timing.spawnDelayMs,
                    round,
                };

                round.particles.push(particle);
                round.durationMs = Math.max(round.durationMs, toEndMs(particle));
            }

            return round;
        };

        const writeProgress = (progress: number) => {
            ownProgress = progress;
            defs.setProgress(progress);
        };

        const createPlayed = () => {
            const count = defs.getParticleCount();

            return count > 0 && defs.getPatterns()[stageIndex] ? createRound(count, defs.getTiming(), 0) : undefined;
        };

        const toPlacement = (frame: ParticleSpawnerFrame): ParticleSpawnerPlacement | undefined => {
            const rootRect = frame.rootRect;

            if (!rootRect) return undefined;

            return {
                origin: { x: rootRect.width * 0.5, y: rootRect.height * 0.5 },
                rootSize: { width: rootRect.width, height: rootRect.height },
                targets: frame.targetRects.map((rect) => (rect ? toRelativeCenter(rect, rootRect) : undefined)),
                modMarkers: (frame.modMarkerRects ?? NO_RECTS).map((rect) =>
                    rect ? toRelativeCenter(rect, rootRect) : undefined,
                ),
                prefersReducedMotion: frame.prefersReducedMotion,
            };
        };

        const toStopPos = (stop: ParticleRouteStop | undefined, placement: ParticleSpawnerPlacement) =>
            (stop === undefined || stop === "spawner" ? undefined : placement.targets[stop]) ?? placement.origin;

        const toTravel = (
            particle: RoundParticle,
            legIndex: number,
            placement: ParticleSpawnerPlacement,
        ): ParticleTravelDefs => ({
            id: particle.id,
            index: particle.index,
            stop: particle.route[legIndex],
            legIndex,
            legCount: particle.route.length,
            origin: placement.origin,
            from: toStopPos(particle.route[legIndex - 1], placement),
            to: toStopPos(particle.route[legIndex], placement),
            modMarkers: placement.modMarkers,
            prefersReducedMotion: placement.prefersReducedMotion,
        });

        const place = (particle: RoundParticle, el: HTMLElement | undefined, placement: ParticleSpawnerPlacement) => {
            const { legIndex, t, elapsedMs } = toLeg(particle);
            const travel = toTravel(particle, legIndex, placement);
            const pos = (defs.getModifiers() ?? NO_MODIFIERS).reduce(
                (moved, modify) => modify(moved, travel, t, elapsedMs),
                defs.computeParticlePos(travel, t),
            );

            if (el) assignParticlePos(el, pos);

            defs.onParticlePlace?.(travel, pos, t);
        };

        const arriveBetween = (round: Round, fromMs: number, toMs: number) => {
            for (const particle of round.particles) {
                const endMs = toEndMs(particle);

                if (endMs > fromMs && endMs <= toMs) defs.onParticleArrive?.(particle.index);
            }
        };

        const getNeedsFrames = () =>
            (isRunning && !!played && !hasEnded && pendingStage === undefined) || emitted.size > 0;

        const syncFrame = () => {
            if (getNeedsFrames()) {
                joinSharedFrame(participant);
            } else {
                leaveSharedFrame(participant);
            }
        };

        const armWait = () => {
            if (pendingStage === undefined || !isRunning || waitTimer !== undefined) return;

            waitStartMs = performance.now();
            waitTimer = setTimeout(() => {
                waitTimer = undefined;
                stageIndex = pendingStage ?? FIRST_STAGE;
                pendingStage = undefined;
                repeatIndex = 0;
                played = createPlayed();
                writeProgress(NO_PROGRESS);
                lastMs = performance.now();
                syncFrame();
            }, waitMs);
        };

        const settleWait = () => {
            if (waitTimer === undefined) return;

            clearTimeout(waitTimer);
            waitTimer = undefined;
            waitMs = Math.max(waitMs - (performance.now() - waitStartMs), NO_DELAY_MS);
        };

        const endPlayedRound = () => {
            const pattern = defs.getPatterns()[stageIndex];

            repeatIndex++;
            defs.onIterationEnd?.();

            if (pattern && repeatIndex < pattern.count) {
                played = createPlayed();
                writeProgress(NO_PROGRESS);

                return;
            }

            const nextIndex = pattern?.nextIndex;

            if (nextIndex === undefined) {
                hasEnded = true;
                defs.onAnimationEnd?.();

                return;
            }

            pendingStage = nextIndex;
            waitMs = pattern?.beginDelayMs ?? NO_DELAY_MS;
            armWait();
        };

        const advancePlayed = (nowMs: number) => {
            const elapsedMs = Math.max(nowMs - lastMs, 0);

            lastMs = nowMs;

            if (!played || !isRunning || hasEnded || pendingStage !== undefined) return;

            const durationMs = played.durationMs;
            const from = MathUtils.clamp01(defs.getProgress());
            const next = durationMs > 0 ? Math.min(from + elapsedMs / durationMs, FULL_PROGRESS) : FULL_PROGRESS;

            arriveBetween(played, from * durationMs, next * durationMs);
            writeProgress(next);

            if (next >= FULL_PROGRESS) endPlayedRound();
        };

        const advanceEmitted = (nowMs: number) => {
            for (const round of emitted) {
                const elapsedMs = Math.min(Math.max(nowMs - round.startMs, 0), round.durationMs);

                arriveBetween(round, round.elapsedMs, elapsedMs);
                round.elapsedMs = elapsedMs;

                if (elapsedMs >= round.durationMs) {
                    emitted.delete(round);
                }
            }
        };

        const draw = (placement: ParticleSpawnerPlacement | undefined) => {
            const isDrawingElements = defs.getIsDrawingElements();
            const live: RoundParticle[] = [];
            const rounds = played ? [played, ...emitted] : [...emitted];

            if (played) played.elapsedMs = MathUtils.clamp01(defs.getProgress()) * played.durationMs;

            for (const round of rounds) {
                for (const particle of round.particles) {
                    if (isLiveAt(particle, round.elapsedMs)) live.push(particle);
                }
            }

            if (!isSameList(live, particles.get())) particles.set(live);

            if (!placement) return;

            let hasPlaced = false;

            for (const particle of live) {
                const el = isDrawingElements ? defs.getElement(particle.id) : undefined;

                if (isDrawingElements && !el) continue;

                place(particle, el, placement);
                hasPlaced = true;
            }

            if (hasPlaced) defs.onTick?.();
        };

        const read = () => {
            lastPlacement = toPlacement(defs.getFrame());
        };

        const write = (nowMs: number) => {
            isWriting = true;
            advancePlayed(nowMs);
            advanceEmitted(nowMs);
            draw(lastPlacement);
            isWriting = false;
            syncFrame();
        };

        const participant: FrameParticipant = { read, write };

        const render = () => {
            if (isWriting) return;

            lastPlacement = toPlacement(defs.getFrame());
            draw(lastPlacement);
        };

        return {
            /** The particles that are out, in the order their rounds began and they set off. */
            particles: { get: particles.get, subscribe: particles.subscribe } as Store<ParticleSpawnerParticle[]>,
            /**
             * Runs or pauses the played rounds. Paused, the round stays where it stands and running again carries on
             * from there; a round sent with `emit` runs either way. Asking for the state it is already in does nothing.
             *
             * @param next Whether the played rounds run.
             */
            setIsRunning: (next: boolean) => {
                if (next === isRunning) return;

                isRunning = next;

                if (next) {
                    if (!played && !hasEnded) played = createPlayed();

                    lastMs = performance.now();
                    armWait();
                } else {
                    settleWait();
                }

                syncFrame();
            },
            /**
             * Starts the played rounds over from the first stage, at `0`. Running, the new round starts at once; paused,
             * nothing is drawn until running starts it or {@link scrub} asks for it.
             */
            restart: () => {
                clearTimeout(waitTimer);
                waitTimer = undefined;
                pendingStage = undefined;
                stageIndex = FIRST_STAGE;
                repeatIndex = 0;
                hasEnded = false;
                played = isRunning ? createPlayed() : undefined;
                lastMs = performance.now();
                writeProgress(NO_PROGRESS);
                syncFrame();

                if (!isRunning) render();
            },
            /**
             * Draws every particle where it is now, measuring the page itself — for a spawner that has just paused.
             * Draws only rounds already made. Does nothing during the engine's own frame, which draws anyway.
             */
            render,
            /**
             * Draws the played round at `progress` after something other than the engine wrote it, making the round
             * first if there is none yet — so a spawner that has never played shows nothing until it is played or
             * scrubbed. A value the engine wrote itself only redraws. While the engine is running, its next frame
             * draws the written value instead, so nothing is measured or drawn twice.
             */
            scrub: () => {
                if (isWriting || getNeedsFrames()) return;

                const isWrittenFromOutside = MathUtils.clamp01(defs.getProgress()) !== ownProgress;

                if (isWrittenFromOutside && !played && !hasEnded && defs.getCanSpawn()) played = createPlayed();

                render();
            },
            /**
             * Sends one round now, outside any stage, on its own clock.
             *
             * @param count How many particles, rounded by {@link toParticleCount}.
             * @returns `false` when nothing was sent, as `ParticleSpawnerController.emit` describes.
             */
            emit: (count: number) => {
                const particleCount = toParticleCount(count);

                if (particleCount <= 0 || !defs.getCanSpawn()) return false;

                emitted.add(createRound(particleCount, defs.getTiming(), performance.now()));
                syncFrame();

                return true;
            },
            /**
             * Puts a particle where it is now, for a view whose element arrives between frames — so it is never
             * painted at the spawner's corner before the next frame moves it. It places the particle against the
             * boxes the last draw read, and measures them itself only before any draw has.
             *
             * @param id The particle.
             * @param el Its element.
             */
            drawParticle: (id: number, el: HTMLElement) => {
                const particle = particles.get().find((live) => live.id === id);
                const placement = lastPlacement ?? toPlacement(defs.getFrame());

                if (particle && placement) place(particle, el, placement);
            },
            /**
             * Where the spawner, its targets and its markers were at the last draw, relative to the spawner's box —
             * what {@link settleArea} takes. Measures them itself only before any draw has, and answers `undefined`
             * while the spawner is not on the page.
             */
            getPlacement: () => lastPlacement ?? toPlacement(defs.getFrame()),
            /** Whether the last played round of the last stage is done. `restart` plays them again. */
            getHasEnded: () => hasEnded,
            /** Stops the frames and forgets every round and particle. The engine can be run again. */
            stop: () => {
                leaveSharedFrame(participant);
                clearTimeout(waitTimer);
                waitTimer = undefined;
                pendingStage = undefined;
                isRunning = false;
                played = undefined;
                emitted.clear();
                particles.set(NO_PARTICLES);
            },
        };
    };
}
