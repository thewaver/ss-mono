<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import {
        CellAnimationUtils,
        PARTICLE_FIELD_DEFAULTS,
        type ParticleFieldCellDefs,
        type ParticleFieldParticle,
        ParticleFieldUtils,
        type SliceAnimationSlice,
        SliceAnimationUtils,
        type SliceRendererSlice,
        SliceRendererStyles,
        SliceRendererUtils,
        ParticleFieldStyles as styles,
    } from "@thewaver/ss-components";
    import { ParticleFieldConst } from "@thewaver/ss-components/internal";
    import { type Index2d, MathUtils, Size2d } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { SliceRendererSvelteUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { ParticleFieldProps } from "./ParticleField.types.js";

    let { playback = $bindable(true), progress = $bindable(ParticleFieldConst.NO_PROGRESS), ...props }: ParticleFieldProps = $props();

    const LINEAR = SliceRendererUtils.computeEasing(undefined);
    const NO_TABLES = { tables: [[]], tableIndices: [] };

    const viewportContext = getViewportContext();

    const spawnChance = $derived(props.spawnChance ?? PARTICLE_FIELD_DEFAULTS.spawnChance);
    const durationMs = $derived(props.animationDurationMs ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs);
    const iterationCount = $derived(props.animationIterationCount ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount);
    const iterationDelayMs = $derived(
        props.animationIterationDelayMs ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs,
    );
    const lifetimeMs = $derived(
        Math.min(props.particleLifetimeMs ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, durationMs),
    );
    const origin = $derived(props.origin ?? PARTICLE_FIELD_DEFAULTS.origin);
    const renderer = $derived(props.renderer ?? PARTICLE_FIELD_DEFAULTS.renderer);

    let root = $state<HTMLDivElement>();
    let canvas = $state<HTMLCanvasElement>();
    let currentIteration = $state(ParticleFieldConst.FIRST_ITERATION);
    let shownSize = $state.raw<Size2d>({ width: 0, height: 0 });

    const bodies = new Map<number, HTMLElement>();
    const tints = new Map<number, string | undefined>();

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);

    let lastCellCount: Index2d | undefined;

    const cellCount = $derived.by(() => {
        const next = CellAnimationUtils.computeCellCount(props.cellCount, getRootSize());

        if (lastCellCount && CellAnimationUtils.getIsSameCount(lastCellCount, next)) return lastCellCount;

        lastCellCount = next;

        return next;
    });

    const contour = $derived(
        ParticleFieldUtils.computeContour(
            props.computeShapePoints?.(getRootSize()),
            props.shapeJoinRadii,
            props.shapeLameExponents,
        ),
    );

    const cells = $derived(
        ParticleFieldUtils.computeCells(
            cellCount,
            getRootSize(),
            props.computeCellWeights?.(cellCount) ?? ParticleFieldConst.NO_WEIGHTS,
            contour,
        ),
    );

    const slices = $derived(
        new Map<ParticleFieldCellDefs, SliceAnimationSlice>(cells.map((cell) => [cell, { ...cell, origin }])),
    );

    const isElementsOnly = $derived(renderer === "elements");

    const getIsAvailable = SliceRendererSvelteUtils.createIsAvailable(() => isElementsOnly);

    const getPicture = SliceRendererSvelteUtils.createPicture(
        () => props.src,
        () => isElementsOnly,
    );

    const tables = $derived.by(() => {
        if (isElementsOnly) return undefined;

        const animation = props.computeParticleAnimation;

        return animation ? SliceAnimationUtils.resolveTables(animation, [...slices.values()]) : NO_TABLES;
    });

    const tableByCell = $derived.by(() => {
        const tableIndices = tables?.tableIndices ?? [];

        return new Map(cells.map((cell, idx) => [cell, tableIndices[idx] ?? 0]));
    });

    const isOnGraphicsCard = $derived(
        getIsAvailable() && SliceRendererUtils.getCanDraw(renderer, getPicture()) && !!tables,
    );

    const getItem = SliceRendererSvelteUtils.createItem(() => canvas ?? undefined, getIsAvailable);

    const area = $derived.by(() => {
        const size = getRootSize();
        const largest = cells.reduce(
            (most, cell) => ({
                width: Math.max(most.width, cell.size.width),
                height: Math.max(most.height, cell.size.height),
            }),
            { width: 0, height: 0 },
        );
        const reach = SliceRendererUtils.computeReach(tables?.tables ?? [], largest, undefined);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
    });

    const hasEnded = $derived(currentIteration >= iterationCount);

    const isRunning = $derived(
        playback && !getIsPageHidden() && !hasEnded && getRootSize().width > 0 && getRootSize().height > 0,
    );

    const clockMs = $derived(MathUtils.clamp01(progress) * durationMs);

    const roster = ParticleFieldUtils.createRoster();

    const particles = $derived(
        roster.refresh({
            count: cellCount,
            cells,
            clockMs,
            durationMs,
            lifetimeMs,
            spawnChance,
            pass: currentIteration,
            hasEnded,
            computeParticlePos: untrack(() => props.computeParticlePos),
        }).particles,
    );

    const getTint = (particle: ParticleFieldParticle) => {
        if (!tints.has(particle.id)) tints.set(particle.id, untrack(() => props.computeParticleTint?.(particle.cell)));

        return tints.get(particle.id);
    };

    const toRendererSlice = (particle: ParticleFieldParticle, tableIndices: Map<ParticleFieldCellDefs, number>) => {
        const tint = getTint(particle);

        return {
            left: particle.pos.x - particle.cell.size.width * 0.5,
            top: particle.pos.y - particle.cell.size.height * 0.5,
            width: particle.cell.size.width,
            height: particle.cell.size.height,
            weight: particle.spawnMs,
            table: tableIndices.get(particle.cell) ?? 0,
            tint: tint === undefined ? undefined : SliceRendererUtils.toTint(tint),
        } satisfies SliceRendererSlice;
    };

    const rendererSlices = $derived.by(() => {
        const list = particles;
        const tableIndices = tableByCell;

        return isOnGraphicsCard ? list.map((particle) => toRendererSlice(particle, tableIndices)) : [];
    });

    const computeTintStyle = (particle: ParticleFieldParticle) => {
        const tint = getTint(particle);

        return tint === undefined ? undefined : SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));
    };

    const applyParticle = (particle: ParticleFieldParticle, body: HTMLElement | undefined) => {
        const animation = props.computeParticleAnimation;
        const slice = slices.get(particle.cell);

        if (!body || !animation || !slice) return;

        SliceAnimationUtils.assignAnimationProps(
            body,
            animation(ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, lifetimeMs), slice),
        );
    };

    watchChange(
        () => cellCount,
        () => {
            tints.clear();
            currentIteration = ParticleFieldConst.FIRST_ITERATION;
            progress = ParticleFieldConst.NO_PROGRESS;
        },
    );

    $effect(() => {
        const list = particles;

        untrack(() => {
            const ids = new Set(list.map((particle) => particle.id));

            for (const id of [...tints.keys()]) {
                if (!ids.has(id)) tints.delete(id);
            }
        });
    });

    $effect(() => {
        const list = particles;
        const onGraphicsCard = isOnGraphicsCard;

        clockMs;
        lifetimeMs;
        slices;
        props.computeParticleAnimation;

        if (onGraphicsCard) return;

        untrack(() => {
            for (const particle of list) applyParticle(particle, bodies.get(particle.id));
        });
    });

    $effect(() => {
        const item = getItem();
        const onGraphicsCard = isOnGraphicsCard;
        const currentSlices = rendererSlices;
        const currentTables = tables?.tables ?? [];
        const currentArea = area;
        const size = getRootSize();
        const clock = clockMs;
        const lifetime = lifetimeMs;
        const src = props.src;

        getPicture();

        if (!item || !onGraphicsCard) return;

        untrack(() => {
            const scale = window.devicePixelRatio * viewportContext.getScale();
            const shown = item.draw({
                mode: "particles",
                src,
                tables: currentTables,
                easing: LINEAR,
                slices: currentSlices,
                size,
                area: currentArea,
                scale,
                timeline: 0,
                half: 0,
                isDescending: false,
                isShown: true,
                hasPerspective: false,
                clockMs: clock,
                lifetimeMs: lifetime,
            });
            const next = { width: shown.width / scale, height: shown.height / scale };

            if (!Size2d.isSame(shownSize, next)) shownSize = next;
        });
    });

    $effect(() => {
        if (!isRunning) return;

        return untrack(() =>
            SliceAnimationUtils.runPasses({
                getProgress: () => progress,
                setProgress: (value) => {
                    progress = value;
                },
                getCurrentIteration: () => currentIteration,
                setCurrentIteration: (value) => {
                    currentIteration = value;
                },
                getDurationMs: () => durationMs,
                getIterationCount: () => iterationCount,
                getIterationDelayMs: () => iterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    const attachBody =
        (particle: ParticleFieldParticle): Attachment<HTMLElement> =>
        (element) => {
            bodies.set(particle.id, element);

            untrack(() => applyParticle(particle, element));

            return () => {
                bodies.delete(particle.id);
            };
        };
</script>

<div
    bind:this={root}
    class={[styles.particleFieldRoot, !isOnGraphicsCard && particles.length > 0 && styles.particleFieldRootMoving]}
    role="presentation"
    aria-hidden="true"
>
    {#if isOnGraphicsCard}
        <canvas
            bind:this={canvas}
            class={SliceRendererStyles.sliceRendererCanvas}
            style:left={`${area.x}px`}
            style:top={`${area.y}px`}
            style:width={`${shownSize.width}px`}
            style:height={`${shownSize.height}px`}
            aria-hidden="true"
        ></canvas>
    {:else}
        {#each particles as particle (particle.id)}
            {@const tintStyle = computeTintStyle(particle)}
            <div class={styles.particleFieldItem} style:left={`${particle.pos.x}px`} style:top={`${particle.pos.y}px`}>
                <div
                    class={styles.particleFieldBody}
                    style:width={`${particle.cell.size.width}px`}
                    style:height={`${particle.cell.size.height}px`}
                    {@attach attachBody(particle)}
                >
                    <div
                        class={[
                            SliceRendererStyles.sliceRendererPicture,
                            tintStyle && SliceRendererStyles.sliceRendererPictureTinted,
                        ]}
                        style={toStyle(
                            assignInlineVars({
                                [SliceRendererStyles.pictureSrcVar]: CellAnimationUtils.toSourceImage(props.src),
                                [SliceRendererStyles.pictureTintVar]: tintStyle?.color ?? "",
                            }),
                            { opacity: tintStyle ? `${tintStyle.opacity}` : undefined },
                        )}
                    ></div>
                </div>
            </div>
        {/each}
    {/if}
</div>
