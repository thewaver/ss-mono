<script lang="ts">
    import { untrack } from "svelte";

    import { BarrelUtils, DIE_DEFAULTS, DieUtils, DieStyles as styles } from "@thewaver/ss-components";

    import { RollerSvelteUtils } from "../../../Abstracts/Roller/RollerSvelte.utils.svelte.js";
    import type { DieController, DieProps } from "./Die.types.js";

    const HALF = 0.5;
    const FIRST_FACE = 0;

    let { face = $bindable(FIRST_FACE), autoSpin = $bindable(true), ...props }: DieProps = $props();

    let root = $state<HTMLDivElement>();

    const size = $derived(props.size);
    const reservedSize = $derived(DieUtils.getReservedSize(size));
    const geometry = $derived(DieUtils.computeFaceGeometry(props.shape, size * HALF));
    const isMovable = $derived(props.isMovable ?? DIE_DEFAULTS.isMovable);
    const isSeeThrough = $derived(props.isSeeThrough ?? DIE_DEFAULTS.isSeeThrough);

    const roller = RollerSvelteUtils.createRoller(
        () => root,
        () => false,
        {
            getFaces: () => geometry,
            getRadius: () => size * HALF,
            getRollDurationMs: () => props.rollDurationMs,
            getSettleDurationMs: () => props.settleDurationMs,
            getRestDurationMs: () => props.restDurationMs,
            getTumbleCount: () => props.tumbleCount,
            getMomentumMs: () => props.momentumMs,
            getIdleDelayMs: () => props.idleDelayMs,
            getDriftAxis: () => props.driftAxis,
            getIsMovable: () => isMovable,
            getIsAutoSpinEnabled: () => autoSpin,
            targetFace: [
                () => face,
                (value) => {
                    face = value;
                },
            ],
            get computeRollTarget() {
                return props.computeRollTarget;
            },
            computeFaceLabel: (index) => props.computeFaceLabel(index),
            onRollEnd: (index) => props.onRollEnd?.(index),
        },
    );

    const controller: DieController = {
        getCurrentFace: roller.getCurrentFace,
        getPhase: roller.getPhase,
        getIsRollable: roller.getIsRollable,
        getIsRolling: () => roller.getIsAwaitingTarget() || roller.getPhase() === "rolling",
        getIsAutoSpinning: () => roller.getPhase() === "idling",
        roll: roller.roll,
        step: roller.step,
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });

    const faceRoleDescription = $derived(props.faceRoleDescription ?? DIE_DEFAULTS.faceRoleDescription);
</script>

<div
    bind:this={root}
    class={[styles.dieRoot, isMovable && styles.dieRootMovable]}
    style:width={`${reservedSize.width}px`}
    style:height={`${reservedSize.height}px`}
    role="group"
    tabindex={isMovable ? 0 : undefined}
    aria-roledescription={props.roleDescription ?? DIE_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
    aria-busy={roller.getIsBusy() ? "true" : undefined}
>
    <div
        class={styles.diePerspective}
        style:width={`${size}px`}
        style:height={`${size}px`}
        style:perspective={`${BarrelUtils.PERSPECTIVE_PX}px`}
    >
        <div class={styles.dieBody} style:transform={DieUtils.getBodyTransform(roller.getOrientation(), size)}>
            {#each geometry as faceGeometry, index (index)}
                {@const isTarget = index === roller.getTargetFace()}
                {@const faceBox = DieUtils.getFaceBox(faceGeometry, size)}
                <div
                    class={[styles.dieFace, isSeeThrough && styles.dieFaceSeeThrough]}
                    style:width={`${faceGeometry.size.width}px`}
                    style:height={`${faceGeometry.size.height}px`}
                    style:left={`${faceBox.left}px`}
                    style:top={`${faceBox.top}px`}
                    style:transform={DieUtils.computeFaceTransform(faceGeometry)}
                    style:clip-path={faceBox.clipPath}
                    role="group"
                    aria-roledescription={faceRoleDescription}
                    aria-label={props.computeFaceLabel(index)}
                    aria-hidden={isTarget ? undefined : "true"}
                    inert={!isTarget}
                >
                    {@render props.renderFace(index, DieUtils.getFaceState(geometry, index, roller.getRestingFace()))}
                </div>
            {/each}
        </div>
    </div>
</div>
