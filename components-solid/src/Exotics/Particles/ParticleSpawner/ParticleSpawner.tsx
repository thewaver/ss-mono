import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CellAnimationUtils,
    ElementObserverUtils,
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnerController,
    type ParticleSpawnerFrame,
    ParticleSpawnerUtils,
    type ParticleTravelDefs,
    SliceAnimationUtils,
    type SliceRendererSlice,
    SliceRendererStyles,
    SliceRendererUtils,
    ParticleSpawnerStyles as styles,
} from "@thewaver/ss-components";
import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars, setElementVars } from "@vanilla-extract/dynamic";

import { MediaQueryMonitorSolidUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { SliceRendererSolidUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawnerSolid.types";

const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_AREA: Rect = { x: 0, y: 0, width: 1, height: 1 };
const UNUSED_SIZE: Size2d = { width: 1, height: 1 };

type Placed = { defs: ParticleTravelDefs; pos: Point2d; t: number };

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const getTravelDurationMs = createMemo(
        () => access(props.travelDurationMs) ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs,
    );
    const getRestDurationMs = createMemo(
        () => access(props.restDurationMs) ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs,
    );
    const getSpawnDelayMs = createMemo(() => access(props.spawnDelayMs) ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs);

    const getSpawnIterationPatterns = createMemo(
        () => access(props.spawnIterationPatterns) ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns,
    );

    const getParticleCount = createMemo(() => ParticleSpawnerUtils.toParticleCount(access(props.particleCount)));
    const getTargets = createMemo(() => access(props.targets));

    const getSource = createMemo(() => access(props.src));

    const getRenderer = createMemo(() => access(props.renderer) ?? PARTICLE_SPAWNER_DEFAULTS.renderer);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getStageIndex, setStageIndex] = createSignal(0, { equals: false });
    const [getArea, setArea] = createSignal<Rect>(NO_AREA);
    const [getShownSize, setShownSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const viewportContext = useViewportContext();

    const getIsElementsOnly = createMemo(() => getRenderer() === "elements");

    const getIsAvailable = SliceRendererSolidUtils.createIsAvailable(getIsElementsOnly);

    const getPicture = SliceRendererSolidUtils.createPicture(getSource, () => false);

    const getParticleSize = createMemo(() => getPicture()?.size ?? UNUSED_SIZE, undefined, { equals: Size2d.isSame });

    const getIsOnGraphicsCard = createMemo(
        () => getIsAvailable() && SliceRendererUtils.getCanDraw(getRenderer(), getPicture()),
    );

    const getItem = SliceRendererSolidUtils.createItem(getCanvasRef, getIsAvailable);

    const refs = new Map<number, HTMLElement>();
    const bodies = new Map<number, HTMLElement>();
    const pictures = new Map<number, HTMLElement>();
    const stand = new Map<number, HTMLElement>();
    const placed = new Map<number, Placed>();
    const tints = new Map<number, string | undefined>();

    const getTint = (defs: ParticleTravelDefs) => {
        if (!tints.has(defs.id)) tints.set(defs.id, props.computeParticleTint?.(defs));

        return tints.get(defs.id);
    };

    const getCanSpawn = () => !!getRootRef() && getIsWindowVisible() && getTargets().length > 0;

    const measureFrame = (): ParticleSpawnerFrame => {
        const rootRef = getRootRef();

        return {
            rootRect: rootRef ? ElementObserverUtils.measureViewportRect(rootRef, viewportContext) : undefined,
            targetRects: ElementObserverUtils.measureViewportRects(getTargets(), viewportContext),
            prefersReducedMotion: getPrefersReducedMotion(),
        };
    };

    const applyTint = (id: number, entry: Placed) => {
        const picture = pictures.get(id);

        if (!picture || picture.dataset.tinted) return;

        const tint = getTint(entry.defs);

        picture.dataset.tinted = "true";

        if (tint === undefined) return;

        const tintStyle = SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));

        setElementVars(picture, { [SliceRendererStyles.pictureTintVar]: tintStyle.color });
        picture.classList.add(SliceRendererStyles.sliceRendererPictureTinted);
        picture.style.opacity = `${tintStyle.opacity}`;
    };

    const applyParticle = (id: number) => {
        const body = bodies.get(id);
        const entry = placed.get(id);

        if (!body || !entry) return;

        applyTint(id, entry);

        if (props.computeParticleAnimation) {
            SliceAnimationUtils.assignAnimationProps(body, props.computeParticleAnimation(entry.defs, entry.t));
        }
    };

    const drawOnGraphicsCard = () => {
        const item = getItem();

        if (!item) return;

        const size = getParticleSize();
        const current = untrack(getArea);
        const slices: SliceRendererSlice[] = [];

        let area: Rect | undefined = current === NO_AREA ? undefined : current;

        for (const particle of untrack(getLiveParticles)) {
            const entry = placed.get(particle.id);

            if (!entry) continue;

            const direct = ParticleSpawnerUtils.toDirectValues(
                props.computeParticleAnimation?.(entry.defs, entry.t) ?? {},
                size,
            );
            const center = { x: entry.pos.x + direct.shiftX, y: entry.pos.y + direct.shiftY };
            const tint = getTint(entry.defs);

            area = ParticleSpawnerUtils.growArea(area, center, size, direct);
            slices.push({
                left: center.x - size.width * 0.5,
                top: center.y - size.height * 0.5,
                width: size.width,
                height: size.height,
                weight: 0,
                table: 0,
                tint: tint === undefined ? undefined : SliceRendererUtils.toTint(tint),
                direct: [direct.scaleX, direct.scaleY, direct.rotate, direct.opacity],
            });
        }

        const shownArea = slices.length === 0 || !area ? NO_AREA : area;

        if (!Rect.isSame(shownArea, current)) setArea(shownArea);

        const scale = window.devicePixelRatio * viewportContext.getScale();
        const shown = item.draw({
            mode: "direct",
            src: getSource(),
            tables: [],
            easing: LINEAR,
            slices,
            size: UNUSED_SIZE,
            area: shownArea,
            scale,
            timeline: 0,
            half: 0,
            isDescending: false,
            isShown: slices.length > 0,
            hasPerspective: false,
        });

        setShownSize({ width: shown.width / scale, height: shown.height / scale });
    };

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => getTargets().length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => {
            if (!untrack(getIsOnGraphicsCard)) return refs.get(id);

            const existing = stand.get(id);

            if (existing) return existing;

            const next = { style: {} } as HTMLElement;

            stand.set(id, next);

            return next;
        },
        getFrame: measureFrame,
        getTiming: () => ({
            spawnDelayMs: getSpawnDelayMs(),
            travelDurationMs: getTravelDurationMs(),
            restDurationMs: getRestDurationMs(),
        }),
        getCanSpawn,
        computeParticlePos: (travel, t) => {
            const pos = props.computeParticlePos(travel, t);

            placed.set(travel.id, { defs: travel, pos, t });

            return pos;
        },
        onParticleT: (id) => {
            if (!untrack(getIsOnGraphicsCard)) applyParticle(id);
        },
        onParticleArrive: (index) => props.onParticleArrive?.(index),
        onTick: () => {
            if (untrack(getIsOnGraphicsCard)) drawOnGraphicsCard();
        },
    });

    const getLiveParticles = accessStore(engine.particles);

    const controller: ParticleSpawnerController = {
        emit: (count: number) => untrack(() => engine.emit(count)),
    };

    createEffect(
        on(getLiveParticles, (particles) => {
            const ids = new Set(particles.map((particle) => particle.id));

            for (const id of [...placed.keys()]) {
                if (!ids.has(id)) {
                    placed.delete(id);
                    stand.delete(id);
                    tints.delete(id);
                }
            }

            if (particles.length === 0 && untrack(getIsOnGraphicsCard)) untrack(drawOnGraphicsCard);
        }),
    );

    createEffect(on([getParticleCount, getSpawnDelayMs, getSpawnIterationPatterns], () => setStageIndex(0)));

    createEffect(() => {
        const particleCount = getParticleCount();
        const pattern = getSpawnIterationPatterns()[getStageIndex()];
        const isPlaying = getIsPlaying();
        const canSpawn = getCanSpawn();

        getTravelDurationMs();
        getRestDurationMs();
        getSpawnDelayMs();

        if (!canSpawn || !isPlaying || particleCount <= 0 || !pattern) return;

        onCleanup(
            untrack(() =>
                engine.playPattern(pattern, particleCount, {
                    onIterationEnd: () => props.onIterationEnd?.(),
                    onAnimationEnd: () => props.onAnimationEnd?.(),
                    onNextStage: setStageIndex,
                }),
            ),
        );
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    onMount(() => {
        props.onMount?.(controller);
    });

    onCleanup(() => {
        engine.stop();
        refs.clear();
        bodies.clear();
        pictures.clear();
        stand.clear();
        placed.clear();
        tints.clear();
    });

    return (
        <div
            ref={setRootRef}
            class={styles.particleSpawnerRoot}
            classList={{ [styles.particleSpawnerRootMoving]: !getIsOnGraphicsCard() && getLiveParticles().length > 0 }}
            role="presentation"
            aria-hidden="true"
        >
            <Show
                when={getIsOnGraphicsCard()}
                fallback={
                    <For each={getLiveParticles()}>
                        {(particle) => {
                            onCleanup(() => {
                                refs.delete(particle.id);
                                bodies.delete(particle.id);
                                pictures.delete(particle.id);
                            });

                            return (
                                <div class={styles.particleSpawnerItem} ref={(el) => refs.set(particle.id, el)}>
                                    <div
                                        class={styles.particleSpawnerBody}
                                        style={{
                                            width: `${getParticleSize().width}px`,
                                            height: `${getParticleSize().height}px`,
                                        }}
                                        ref={(el) => bodies.set(particle.id, el)}
                                    >
                                        <div
                                            ref={(el) => {
                                                pictures.set(particle.id, el);
                                                applyParticle(particle.id);
                                            }}
                                            class={SliceRendererStyles.sliceRendererPicture}
                                            style={assignInlineVars({
                                                [SliceRendererStyles.pictureSrcVar]:
                                                    CellAnimationUtils.toSourceImage(getSource()),
                                            })}
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                }
            >
                <canvas
                    ref={setCanvasRef}
                    class={SliceRendererStyles.sliceRendererCanvas}
                    style={{
                        left: `${getArea().x}px`,
                        top: `${getArea().y}px`,
                        width: `${getShownSize().width}px`,
                        height: `${getShownSize().height}px`,
                    }}
                    aria-hidden="true"
                />
            </Show>
        </div>
    );
};
