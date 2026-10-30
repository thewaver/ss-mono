import { computed, defineComponent, onScopeDispose, shallowRef, watch } from "vue";

import {
    CellAnimationUtils,
    ElementObserverUtils,
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnIterationPattern,
    type ParticleSpawnerController,
    type ParticleSpawnerFrame,
    ParticleSpawnerStyles,
    ParticleSpawnerUtils,
    type ParticleTravelDefs,
    SliceAnimationUtils,
    type SliceRendererSlice,
    SliceRendererStyles,
    SliceRendererUtils,
    type SliceStop,
} from "@thewaver/ss-components";
import { ParticleSpawnerConst } from "@thewaver/ss-components/internal";
import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars, setElementVars } from "@vanilla-extract/dynamic";

import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { MediaQueryMonitorVueUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { SliceRendererVueUtils } from "../../../Abstracts/SliceRenderer/SliceRendererVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawner.types";

const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_AREA: Rect = { x: 0, y: 0, width: 1, height: 1 };
const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const UNUSED_SIZE: Size2d = { width: 1, height: 1 };
const NO_TABLES: SliceStop[][] = [];

type Placed = { defs: ParticleTravelDefs; pos: Point2d; t: number };

export const ParticleSpawner = defineComponent(
    (props: ParticleSpawnerProps) => {
        const getTravelDurationMs = () => props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs;
        const getRestDurationMs = () => props.restDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs;
        const getSpawnDelayMs = () => props.spawnDelayMs ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs;
        const getParticleCount = () => ParticleSpawnerUtils.toParticleCount(props.particleCount);

        const patternsKey = computed(() =>
            JSON.stringify(props.spawnIterationPatterns ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns),
        );
        const patterns = computed(() => JSON.parse(patternsKey.value) as ParticleSpawnIterationPattern[]);

        const rootRef = shallowRef<HTMLDivElement>();
        const canvasRef = shallowRef<HTMLCanvasElement>();
        const elements = new Map<number, HTMLElement>();
        const bodies = new Map<number, HTMLElement>();
        const pictures = new Map<number, HTMLElement>();
        const placed = new Map<number, Placed>();
        const tints = new Map<number, string | undefined>();

        let drawnArea: Rect | undefined;

        const isPlaying = useTwoWay(props, "playback", true);
        const stage = shallowRef({ index: ParticleSpawnerConst.FIRST_STAGE });
        const shownRect = shallowRef<Rect>(NO_RECT);

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();
        const isWindowVisible = computed(() => !isPageHidden.value);
        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

        const viewportContext = useViewportContext();

        const renderer = computed(() => props.renderer ?? PARTICLE_SPAWNER_DEFAULTS.renderer);

        const isElementsOnly = computed(() => renderer.value === "elements");

        const isAvailable = SliceRendererVueUtils.useIsAvailable(isElementsOnly);

        const picture = SliceRendererVueUtils.usePicture(() => props.src);

        const particleSize = computed<Size2d>((previous) => {
            const next = picture.value?.size ?? UNUSED_SIZE;

            return previous && Size2d.isSame(previous, next) ? previous : next;
        });

        const isOnGraphicsCard = computed(
            () => isAvailable.value && SliceRendererUtils.getCanDraw(renderer.value, picture.value),
        );

        const item = SliceRendererVueUtils.useItem(canvasRef, isAvailable);

        const getTint = (defs: ParticleTravelDefs) => {
            if (!tints.has(defs.id)) tints.set(defs.id, props.computeParticleTint?.(defs));

            return tints.get(defs.id);
        };

        const canSpawn = computed(() => !!rootRef.value && isWindowVisible.value && props.targets.length > 0);

        const measureFrame = (): ParticleSpawnerFrame => {
            const root = rootRef.value;

            return {
                rootRect: root ? ElementObserverUtils.measureViewportRect(root, viewportContext) : undefined,
                targetRects: ElementObserverUtils.measureViewportRects(props.targets, viewportContext),
                prefersReducedMotion: prefersReducedMotion.value,
            };
        };

        const applyTint = (id: number, entry: Placed) => {
            const element = pictures.get(id);

            if (!element || element.dataset.tinted) return;

            const tint = getTint(entry.defs);

            element.dataset.tinted = "true";

            if (tint === undefined) return;

            const tintStyle = SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));

            setElementVars(element, { [SliceRendererStyles.pictureTintVar]: tintStyle.color });
            element.classList.add(SliceRendererStyles.sliceRendererPictureTinted);
            element.style.opacity = `${tintStyle.opacity}`;
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
            const currentItem = item.value;

            if (!currentItem) return;

            const size = particleSize.value;
            const slices: SliceRendererSlice[] = [];

            let grown = drawnArea;

            for (const particle of particles.value) {
                const entry = placed.get(particle.id);

                if (!entry) continue;

                const direct = ParticleSpawnerUtils.toDirectValues(
                    props.computeParticleAnimation?.(entry.defs, entry.t) ?? {},
                    size,
                );
                const center = { x: entry.pos.x + direct.shiftX, y: entry.pos.y + direct.shiftY };
                const tint = getTint(entry.defs);

                grown = ParticleSpawnerUtils.growArea(grown, center, size, direct);
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

            drawnArea = slices.length === 0 ? undefined : grown;

            const scale = window.devicePixelRatio * viewportContext.getScale();
            currentItem.draw(
                {
                    mode: "direct",
                    src: props.src,
                    tables: NO_TABLES,
                    easing: LINEAR,
                    slices,
                    size: UNUSED_SIZE,
                    area: drawnArea ?? NO_AREA,
                    scale,
                    timeline: 0,
                    half: 0,
                    isDescending: false,
                    isShown: slices.length > 0,
                    hasPerspective: false,
                },
                (next) => {
                    if (!Rect.isSame(shownRect.value, next)) shownRect.value = next;
                },
            );
        };

        const engine = ParticleSpawnerUtils.createEngine({
            getTargetCount: () => props.targets.length,
            computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
            getElement: (id) => elements.get(id),
            getIsDrawingElements: () => !isOnGraphicsCard.value,
            getFrame: measureFrame,
            getTiming: () => ({
                spawnDelayMs: getSpawnDelayMs(),
                travelDurationMs: getTravelDurationMs(),
                restDurationMs: getRestDurationMs(),
            }),
            getCanSpawn: () => canSpawn.value,
            computeParticlePos: (travel, t) => {
                const pos = props.computeParticlePos(travel, t);

                placed.set(travel.id, { defs: travel, pos, t });

                return pos;
            },
            onParticleT: (id) => {
                if (!isOnGraphicsCard.value) applyParticle(id);
            },
            onParticleArrive: (index) => props.onParticleArrive?.(index),
            onTick: () => {
                if (isOnGraphicsCard.value) drawOnGraphicsCard();
            },
        });

        const particles = useStore(engine.particles);

        watch(particles, (list) => {
            const ids = new Set(list.map((particle) => particle.id));

            for (const id of [...placed.keys()]) {
                if (!ids.has(id)) {
                    placed.delete(id);
                    tints.delete(id);
                }
            }

            if (list.length === 0 && isOnGraphicsCard.value) drawOnGraphicsCard();
        });

        const controller: ParticleSpawnerController = { emit: engine.emit };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        onScopeDispose(() => {
            engine.stop();
            elements.clear();
            bodies.clear();
            pictures.clear();
            placed.clear();
            tints.clear();
        });

        watchAfterRender([getParticleCount, getSpawnDelayMs, patterns], () => {
            stage.value = { index: ParticleSpawnerConst.FIRST_STAGE };
        });

        const pattern = computed(() => patterns.value[stage.value.index]);

        watchAfterRender(
            [
                canSpawn,
                isPlaying,
                getParticleCount,
                pattern,
                stage,
                getTravelDurationMs,
                getRestDurationMs,
                getSpawnDelayMs,
            ],
            ([isSpawnable, isOn, particleCount, current]) => {
                if (!isSpawnable || !isOn || particleCount <= 0 || !current) return;

                return engine.playPattern(current, particleCount, {
                    onIterationEnd: () => props.onIterationEnd?.(),
                    onAnimationEnd: () => props.onAnimationEnd?.(),
                    onNextStage: (index) => {
                        stage.value = { index };
                    },
                });
            },
        );

        return () => {
            const size = particleSize.value;

            return (
                <div
                    ref={rootRef}
                    class={[
                        ParticleSpawnerStyles.particleSpawnerRoot,
                        !isOnGraphicsCard.value &&
                            particles.value.length > 0 &&
                            ParticleSpawnerStyles.particleSpawnerRootMoving,
                    ]}
                    role="presentation"
                    aria-hidden="true"
                >
                    {isOnGraphicsCard.value ? (
                        <canvas
                            ref={canvasRef}
                            class={SliceRendererStyles.sliceRendererCanvas}
                            style={{
                                left: `${shownRect.value.x}px`,
                                top: `${shownRect.value.y}px`,
                                width: `${shownRect.value.width}px`,
                                height: `${shownRect.value.height}px`,
                            }}
                            aria-hidden="true"
                        />
                    ) : (
                        particles.value.map((particle) => (
                            <div
                                key={particle.id}
                                class={ParticleSpawnerStyles.particleSpawnerItem}
                                ref={(target) => {
                                    const element = toElement(target);

                                    if (!element) {
                                        elements.delete(particle.id);

                                        return;
                                    }

                                    elements.set(particle.id, element);
                                    engine.drawParticle(particle.id, element);
                                    applyParticle(particle.id);
                                }}
                            >
                                <div
                                    class={ParticleSpawnerStyles.particleSpawnerBody}
                                    style={{ width: `${size.width}px`, height: `${size.height}px` }}
                                    ref={(target) => {
                                        const element = toElement(target);

                                        if (element) bodies.set(particle.id, element);
                                        else bodies.delete(particle.id);
                                    }}
                                >
                                    <div
                                        ref={(target) => {
                                            const element = toElement(target);

                                            if (element) pictures.set(particle.id, element);
                                            else pictures.delete(particle.id);
                                        }}
                                        class={SliceRendererStyles.sliceRendererPicture}
                                        style={assignInlineVars({
                                            [SliceRendererStyles.pictureSrcVar]: CellAnimationUtils.toSourceImage(
                                                props.src,
                                            ),
                                        })}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        };
    },
    {
        name: "ParticleSpawner",
        props: declareProps<ParticleSpawnerProps>({
            "src": null,
            "targets": null,
            "particleCount": null,
            "travelDurationMs": null,
            "restDurationMs": null,
            "spawnDelayMs": null,
            "spawnIterationPatterns": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "renderer": null,
            "computeTarget": null,
            "computeParticlePos": null,
            "computeParticleAnimation": null,
            "computeParticleTint": null,
            "onParticleArrive": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
            "onMount": null,
        }),
    },
);
