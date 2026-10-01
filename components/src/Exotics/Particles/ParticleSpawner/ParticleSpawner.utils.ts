import { type Point2d, type Rect, type Store, StoreUtils } from "@thewaver/ss-utils";

import type {
    ParticleSpawnIterationPattern,
    ParticleSpawnerFrame,
    ParticleSpawnerParticle,
    ParticleSpawnerTiming,
    ParticleTravelDefs,
} from "./ParticleSpawner.types";

const NO_DELAY_MS = 0;

let nextId = 0;

type Round = ParticleSpawnerTiming & {
    count: number;
    startMs: number;
    spawnedCount: number;
    arrivedCount: number;
    onEnd?: () => void;
};

type LiveParticle = ParticleSpawnerParticle & { round: Round };

const NO_PARTICLES: LiveParticle[] = [];

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
     * The machinery of a spawner: rounds of particles sent out on a stagger, walked to their targets on animation
     * frames, and taken away once they have arrived and rested.
     *
     * The engine keeps the live particles in a store, which is what a view draws its elements from, and writes each
     * one's position straight onto its element every frame. It reads everything that can change — the targets, the
     * boxes, the timing — through `defs` at the moment it needs it, so it is made once and never rebuilt. Nothing is
     * disposed for good: `stop` leaves it ready to send again.
     *
     * @param defs.getTargetCount How many targets there are now.
     * @param defs.computeTarget Which target one particle is aimed at. `undefined` picks one at random.
     * @param defs.getElement A live particle's element, once the view has drawn it. A particle without one is not
     * moved, and cannot arrive, until it has one.
     * @param defs.getFrame Where the spawner and its targets are now.
     * @param defs.getTiming The stagger, the travel and the rest a new round is sent with.
     * @param defs.getCanSpawn Whether anything can be sent now: measured, visible, with somewhere to go.
     * @param defs.computeParticlePos Where one particle is at a point along its path.
     * @param defs.onParticleT Hands on how far along its path each moved particle is, every frame.
     * @param defs.onParticleArrive Runs as a particle is taken away at its target, with its place in its round.
     * @param defs.onTick Runs after each frame that moved any particle.
     * @returns `particles`, the live particles as a store; `playPattern`, `emit`, `drawParticle` and `stop`.
     */
    export const createEngine = (defs: {
        getTargetCount: () => number;
        computeTarget: (index: number, targetCount: number) => number | undefined;
        getElement: (id: number) => HTMLElement | undefined;
        getFrame: () => ParticleSpawnerFrame;
        getTiming: () => ParticleSpawnerTiming;
        getCanSpawn: () => boolean;
        computeParticlePos: (travel: ParticleTravelDefs, t: number) => Point2d;
        onParticleT?: (id: number, t: number) => void;
        onParticleArrive?: (index: number) => void;
        onTick?: () => void;
    }) => {
        const particles = StoreUtils.create(NO_PARTICLES);
        const rounds = new Set<Round>();

        let rafId: ReturnType<typeof requestAnimationFrame> | undefined;

        const spawnNext = (round: Round, targetCount: number): LiveParticle | undefined => {
            const index = round.spawnedCount;
            const targetIndex = defs.computeTarget(index, targetCount) ?? pickRandomTarget(targetCount);

            round.spawnedCount++;

            if (targetIndex === undefined) {
                round.arrivedCount++;

                return undefined;
            }

            return { id: nextId++, index, round, targetIndex, spawnedAtMs: round.startMs + index * round.spawnDelayMs };
        };

        const place = (particle: LiveParticle, el: HTMLElement, nowMs: number, frame: ParticleSpawnerFrame) => {
            const rootRect = frame.rootRect;

            if (!rootRect) return false;

            const from = { x: rootRect.width * 0.5, y: rootRect.height * 0.5 };
            const t = Math.min(1, (nowMs - particle.spawnedAtMs) / particle.round.travelDurationMs);
            const targetRect = frame.targetRects[particle.targetIndex];
            const to = targetRect ? toRelativeCenter(targetRect, rootRect) : from;

            defs.onParticleT?.(particle.id, t);

            assignParticlePos(
                el,
                defs.computeParticlePos(
                    {
                        id: particle.id,
                        index: particle.index,
                        targetIndex: particle.targetIndex,
                        from,
                        to,
                        prefersReducedMotion: frame.prefersReducedMotion,
                    },
                    t,
                ),
            );

            return true;
        };

        const tick = (nowMs: number) => {
            rafId = undefined;

            const targetCount = defs.getTargetCount();
            const spawned: LiveParticle[] = [];

            for (const round of rounds) {
                while (
                    round.spawnedCount < round.count &&
                    nowMs >= round.startMs + round.spawnedCount * round.spawnDelayMs
                ) {
                    const particle = spawnNext(round, targetCount);

                    if (particle) spawned.push(particle);
                }
            }

            if (spawned.length > 0) particles.update((list) => [...list, ...spawned]);

            const frame = defs.getFrame();
            const arrived: LiveParticle[] = [];

            let hasMoved = false;

            for (const particle of particles.get()) {
                const el = defs.getElement(particle.id);

                if (!el || !place(particle, el, nowMs, frame)) continue;

                hasMoved = true;

                const { travelDurationMs, retentionMs } = particle.round;

                if (nowMs >= particle.spawnedAtMs + travelDurationMs + retentionMs) arrived.push(particle);
            }

            if (arrived.length > 0) {
                particles.update((list) => list.filter((particle) => !arrived.includes(particle)));

                for (const particle of arrived) {
                    particle.round.arrivedCount++;
                    defs.onParticleArrive?.(particle.index);
                }
            }

            if (hasMoved) defs.onTick?.();

            const ended = [...rounds].filter(
                (round) => round.spawnedCount >= round.count && round.arrivedCount >= round.count,
            );

            for (const round of ended) {
                rounds.delete(round);
                round.onEnd?.();
            }

            if (rounds.size > 0 && rafId === undefined) rafId = requestAnimationFrame(tick);
        };

        const startRound = (count: number, onEnd?: () => void) => {
            const round: Round = {
                ...defs.getTiming(),
                count,
                startMs: performance.now(),
                spawnedCount: 0,
                arrivedCount: 0,
                onEnd,
            };

            rounds.add(round);

            if (rafId === undefined) rafId = requestAnimationFrame(tick);

            return round;
        };

        const dropRound = (round: Round) => {
            rounds.delete(round);
            particles.update((list) => list.filter((particle) => particle.round !== round));
        };

        return {
            /** The live particles, in the order they set off. */
            particles: { get: particles.get, subscribe: particles.subscribe } as Store<ParticleSpawnerParticle[]>,
            /**
             * Plays one stage of `spawnIterationPatterns`: its rounds one after another, each sent once the one before
             * has arrived.
             *
             * @param pattern The stage.
             * @param particleCount How many particles each round sends.
             * @param callbacks.onIterationEnd Runs at the end of each round.
             * @param callbacks.onAnimationEnd Runs after the last round of a stage that names no next one.
             * @param callbacks.onNextStage Runs after the stage's begin delay, for a stage that names a next one —
             * the view moves to that stage and plays it.
             * @returns Stops the stage: the round in flight is taken back and a pending move to the next stage is
             * called off.
             */
            playPattern: (
                pattern: ParticleSpawnIterationPattern,
                particleCount: number,
                callbacks: {
                    onIterationEnd?: () => void;
                    onAnimationEnd?: () => void;
                    onNextStage: (nextIndex: number) => void;
                },
            ) => {
                let round: Round | undefined;
                let repeatIndex = 0;
                let timeout: ReturnType<typeof setTimeout> | undefined;

                const handleRoundEnd = () => {
                    round = undefined;
                    repeatIndex++;
                    callbacks.onIterationEnd?.();

                    if (repeatIndex < pattern.count) {
                        round = startRound(particleCount, handleRoundEnd);

                        return;
                    }

                    const nextIndex = pattern.nextIndex;

                    if (nextIndex === undefined) {
                        callbacks.onAnimationEnd?.();

                        return;
                    }

                    timeout = setTimeout(() => callbacks.onNextStage(nextIndex), pattern.beginDelayMs ?? NO_DELAY_MS);
                };

                round = startRound(particleCount, handleRoundEnd);

                return () => {
                    clearTimeout(timeout);

                    if (round) dropRound(round);
                };
            },
            /**
             * Sends one round now, outside any stage.
             *
             * @param count How many particles, rounded by {@link toParticleCount}.
             * @returns `false` when nothing was sent, as `ParticleSpawnerController.emit` describes.
             */
            emit: (count: number) => {
                const particleCount = toParticleCount(count);

                if (particleCount <= 0 || !defs.getCanSpawn()) return false;

                startRound(particleCount);

                return true;
            },
            /**
             * Puts a particle where it is now, for a view whose element arrives between frames — so it is never
             * painted at the spawner's corner before the next frame moves it.
             *
             * @param id The particle.
             * @param el Its element.
             */
            drawParticle: (id: number, el: HTMLElement) => {
                const particle = particles.get().find((live) => live.id === id);

                if (particle) place(particle, el, performance.now(), defs.getFrame());
            },
            /** Stops the frames and forgets every round and particle. The engine can be played again. */
            stop: () => {
                if (rafId !== undefined) cancelAnimationFrame(rafId);

                rafId = undefined;
                rounds.clear();
                particles.set(NO_PARTICLES);
            },
        };
    };
}
