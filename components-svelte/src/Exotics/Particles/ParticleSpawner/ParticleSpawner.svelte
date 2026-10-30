<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import {
        CellAnimationUtils,
        ElementObserverUtils,
        PARTICLE_SPAWNER_DEFAULTS,
        type ParticleSpawnIterationPattern,
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
    import { ParticleSpawnerConst } from "@thewaver/ss-components/internal";
    import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";
    import { setElementVars } from "@vanilla-extract/dynamic";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { MediaQueryMonitorSvelteUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import { SliceRendererSvelteUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { ParticleSpawnerProps } from "./ParticleSpawner.types.js";

    type Placed = { defs: ParticleTravelDefs; pos: Point2d; t: number };

    let { playback = $bindable(true), ...props }: ParticleSpawnerProps = $props();

    const LINEAR = SliceRendererUtils.computeEasing(undefined);
    const NO_AREA: Rect = { x: 0, y: 0, width: 1, height: 1 };
    const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
    const UNUSED_SIZE: Size2d = { width: 1, height: 1 };

    const travelDurationMs = $derived(props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    const restDurationMs = $derived(props.restDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
    const spawnDelayMs = $derived(props.spawnDelayMs ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs);
    const particleCount = $derived(ParticleSpawnerUtils.toParticleCount(props.particleCount));
    const renderer = $derived(props.renderer ?? PARTICLE_SPAWNER_DEFAULTS.renderer);

    const patternsKey = $derived(
        JSON.stringify(props.spawnIterationPatterns ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns),
    );
    const patterns = $derived(JSON.parse(patternsKey) as ParticleSpawnIterationPattern[]);

    let root = $state<HTMLDivElement>();
    let canvas = $state<HTMLCanvasElement>();
    let stage = $state.raw({ index: ParticleSpawnerConst.FIRST_STAGE });
    let drawnArea: Rect | undefined;
    let shownRect = $state.raw<Rect>(NO_RECT);

    const elements = new Map<number, HTMLElement>();
    const bodies = new Map<number, HTMLElement>();
    const pictures = new Map<number, HTMLElement>();
    const stand = new Map<number, HTMLElement>();
    const placed = new Map<number, Placed>();
    const tints = new Map<number, string | undefined>();

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();
    const isWindowVisible = $derived(!getIsPageHidden());
    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const viewportContext = getViewportContext();

    const isElementsOnly = $derived(renderer === "elements");

    const getIsAvailable = SliceRendererSvelteUtils.createIsAvailable(() => isElementsOnly);

    const getPicture = SliceRendererSvelteUtils.createPicture(
        () => props.src,
        () => false,
    );

    let lastParticleSize = UNUSED_SIZE;

    const particleSize = $derived.by(() => {
        const next = getPicture()?.size ?? UNUSED_SIZE;

        if (Size2d.isSame(lastParticleSize, next)) return lastParticleSize;

        lastParticleSize = next;

        return next;
    });

    const isOnGraphicsCard = $derived(getIsAvailable() && SliceRendererUtils.getCanDraw(renderer, getPicture()));

    const getItem = SliceRendererSvelteUtils.createItem(() => canvas ?? undefined, getIsAvailable);

    const canSpawn = $derived(!!root && isWindowVisible && props.targets.length > 0);

    const getTint = (defs: ParticleTravelDefs) => {
        if (!tints.has(defs.id)) tints.set(defs.id, props.computeParticleTint?.(defs));

        return tints.get(defs.id);
    };

    const measureFrame = (): ParticleSpawnerFrame => ({
        rootRect: root ? ElementObserverUtils.measureViewportRect(root, viewportContext) : undefined,
        targetRects: ElementObserverUtils.measureViewportRects(props.targets, viewportContext),
        prefersReducedMotion: getPrefersReducedMotion(),
    });

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

        const size = particleSize;
        const slices: SliceRendererSlice[] = [];

        let nextArea = drawnArea;

        for (const particle of getParticles()) {
            const entry = placed.get(particle.id);

            if (!entry) continue;

            const direct = ParticleSpawnerUtils.toDirectValues(
                props.computeParticleAnimation?.(entry.defs, entry.t) ?? {},
                size,
            );
            const center = { x: entry.pos.x + direct.shiftX, y: entry.pos.y + direct.shiftY };
            const tint = getTint(entry.defs);

            nextArea = ParticleSpawnerUtils.growArea(nextArea, center, size, direct);
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

        drawnArea = slices.length === 0 ? undefined : nextArea;

        const scale = window.devicePixelRatio * viewportContext.getScale();
        item.draw({
            mode: "direct",
            src: props.src,
            tables: [],
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
        }, (next) => {
            if (!Rect.isSame(shownRect, next)) shownRect = next;
        });
    };

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => props.targets.length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => {
            if (!untrack(() => isOnGraphicsCard)) return elements.get(id);

            const existing = stand.get(id);

            if (existing) return existing;

            const next = { style: {} } as HTMLElement;

            stand.set(id, next);

            return next;
        },
        getFrame: measureFrame,
        getTiming: () => ({ spawnDelayMs, travelDurationMs, restDurationMs }),
        getCanSpawn: () => canSpawn,
        computeParticlePos: (travel, t) => {
            const pos = props.computeParticlePos(travel, t);

            placed.set(travel.id, { defs: travel, pos, t });

            return pos;
        },
        onParticleT: (id) => {
            if (!untrack(() => isOnGraphicsCard)) untrack(() => applyParticle(id));
        },
        onParticleArrive: (index) => props.onParticleArrive?.(index),
        onTick: () => {
            if (untrack(() => isOnGraphicsCard)) untrack(drawOnGraphicsCard);
        },
    });

    const getParticles = readStore(engine.particles);

    const controller: ParticleSpawnerController = { emit: (count) => untrack(() => engine.emit(count)) };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });

    $effect(() => () => {
        engine.stop();
        elements.clear();
        bodies.clear();
        pictures.clear();
        stand.clear();
        placed.clear();
        tints.clear();
    });

    $effect(() => {
        const particles = getParticles();

        untrack(() => {
            const ids = new Set(particles.map((particle) => particle.id));

            for (const id of [...placed.keys()]) {
                if (!ids.has(id)) {
                    placed.delete(id);
                    stand.delete(id);
                    tints.delete(id);
                }
            }

            if (particles.length === 0 && isOnGraphicsCard) drawOnGraphicsCard();
        });
    });

    $effect(() => {
        void particleCount;
        void spawnDelayMs;
        void patterns;

        untrack(() => {
            stage = { index: ParticleSpawnerConst.FIRST_STAGE };
        });
    });

    const pattern = $derived(patterns[stage.index]);

    $effect(() => {
        const currentPattern = pattern;
        const count = particleCount;

        void stage;
        void travelDurationMs;
        void restDurationMs;
        void spawnDelayMs;

        if (!canSpawn || !playback || count <= 0 || !currentPattern) return;

        return untrack(() =>
            engine.playPattern(currentPattern, count, {
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
                onNextStage: (index) => {
                    stage = { index };
                },
            }),
        );
    });

    const attachParticle =
        (id: number): Attachment<HTMLElement> =>
        (element) => {
            elements.set(id, element);
            untrack(() => engine.drawParticle(id, element));

            return () => {
                elements.delete(id);
            };
        };

    const attachBody =
        (id: number): Attachment<HTMLElement> =>
        (element) => {
            bodies.set(id, element);

            return () => {
                bodies.delete(id);
            };
        };

    const attachSource: Attachment<HTMLElement> = (element) => {
        setElementVars(element, { [SliceRendererStyles.pictureSrcVar]: CellAnimationUtils.toSourceImage(props.src) });
    };

    const attachPicture =
        (id: number): Attachment<HTMLElement> =>
        (element) => {
            pictures.set(id, element);
            untrack(() => applyParticle(id));

            return () => {
                pictures.delete(id);
            };
        };
</script>

<div
    bind:this={root}
    class={[
        styles.particleSpawnerRoot,
        !isOnGraphicsCard && getParticles().length > 0 && styles.particleSpawnerRootMoving,
    ]}
    role="presentation"
    aria-hidden="true"
>
    {#if isOnGraphicsCard}
        <canvas
            bind:this={canvas}
            class={SliceRendererStyles.sliceRendererCanvas}
            style:left={`${shownRect.x}px`}
            style:top={`${shownRect.y}px`}
            style:width={`${shownRect.width}px`}
            style:height={`${shownRect.height}px`}
            aria-hidden="true"
        ></canvas>
    {:else}
        {#each getParticles() as particle (particle.id)}
            <div class={styles.particleSpawnerItem} {@attach attachParticle(particle.id)}>
                <div
                    class={styles.particleSpawnerBody}
                    style:width={`${particleSize.width}px`}
                    style:height={`${particleSize.height}px`}
                    {@attach attachBody(particle.id)}
                >
                    <div
                        class={SliceRendererStyles.sliceRendererPicture}
                        {@attach attachSource}
                        {@attach attachPicture(particle.id)}
                    ></div>
                </div>
            </div>
        {/each}
    {/if}
</div>
