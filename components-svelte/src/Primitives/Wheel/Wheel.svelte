<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import {
        ProximityUtils,
        WHEEL_DEFAULTS,
        type WheelFace,
        WheelUtils,
        type WheelWedgeState,
        WheelStyles as styles,
    } from "@thewaver/ss-components";

    import { MediaQueryMonitorSvelteUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import { PointerTrackerSvelteUtils } from "../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { RotatorSvelteUtils } from "../../Abstracts/Rotator/RotatorSvelte.utils.svelte.js";
    import Barrel from "../Barrel/Barrel.svelte";
    import type { WheelController, WheelProps } from "./Wheel.types.js";

    const FIRST_WEDGE = 0;

    let { targetIndex = $bindable(0), autoSpin = $bindable(true), ...props }: WheelProps<T> = $props();

    const wedgeCount = $derived(props.wedges.length);
    const isDisabled = $derived(props.isDisabled ?? false);
    const axis = $derived(props.axis ?? WHEEL_DEFAULTS.axis);
    const wedgeSize = $derived(props.wedgeSize ?? WHEEL_DEFAULTS.wedgeSize);
    const roleDescription = $derived(props.roleDescription ?? WHEEL_DEFAULTS.roleDescription);
    const wedgeRoleDescription = $derived(props.wedgeRoleDescription ?? WHEEL_DEFAULTS.wedgeRoleDescription);

    const rotation = RotatorSvelteUtils.createRotator(() => isDisabled, {
        getStepCount: () => wedgeCount,
        targetIndex: [
            () => targetIndex,
            (value) => {
                targetIndex = value;
            },
        ],
        getIsAutoSpinEnabled: () => autoSpin,
        getSpinDurationMs: () => props.spinDurationMs,
        getSettleDurationMs: () => props.settleDurationMs,
        getRestDurationMs: () => props.restDurationMs,
        getIdleDelayMs: () => props.idleDelayMs,
        computeSpinTarget: () => props.computeSpinTarget(),
        get computeSpinDefs() {
            return props.computeSpinDefs;
        },
        computeStepLabel: (index, count) => props.computeWedgeLabel(index, count),
        onStepChange: (index) => props.onSelectedWedgeChange?.(index),
        onSpinEnd: (index) => props.onSpinEnd?.(index),
    });

    const getWedgeLabel = (index: number) => props.computeWedgeLabel(index, wedgeCount);

    const selectedIndex = $derived(WheelUtils.getSelectedIndex(rotation.getPhase(), rotation.getCurrentIndex()));

    const layout = $derived(WheelUtils.computeLayout(props.computeLayout, wedgeCount));

    const markerCorrection = $derived(
        WheelUtils.getMarkerCorrection(layout, props.markerDegrees ?? WHEEL_DEFAULTS.markerDegrees),
    );

    const getWedgeAngle = (index: number) =>
        WheelUtils.getWedgeAngle(markerCorrection, index, rotation.getStepAngle(), rotation.getAngle());

    let wheel = $state<HTMLDivElement>();

    const isEffectless = $derived(props.computeEffect === undefined);

    const pointer = PointerTrackerSvelteUtils.create(
        () => wheel,
        () => isEffectless,
    );

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion(() => isEffectless);

    const arrangement = $derived(isEffectless || !layout ? undefined : ProximityUtils.toArrangement(layout));

    const pointerPoint = $derived(
        isEffectless
            ? undefined
            : WheelUtils.getPointerPoint(layout, pointer.getReading().boxRatio, pointer.getIsPointerPresent()),
    );

    const overreach = $derived(WheelUtils.getOverreach(layout, pointerPoint));

    const getWedgeEffect = (index: number) =>
        WheelUtils.computeWedgeEffect({
            computeEffect: props.computeEffect,
            layout,
            arrangement,
            angle: getWedgeAngle(index),
            point: pointerPoint,
            overreach,
            prefersReducedMotion: getPrefersReducedMotion(),
        });

    const getWedgeState = (index: number, face: WheelFace): WheelWedgeState => ({
        index,
        wedgeCount,
        face,
        isSelected: index === selectedIndex,
        angle: getWedgeAngle(index),
        placement: layout?.placements[FIRST_WEDGE],
    });

    const controller: WheelController = {
        getCurrentIndex: rotation.getCurrentIndex,
        getPhase: rotation.getPhase,
        getIsSpinnable: rotation.getIsSpinnable,
        getIsAutoSpinning: () => rotation.getPhase() === "idling",
        getIsUserSpinning: () => WheelUtils.getIsUserSpinning(rotation.getIsAwaitingTarget(), rotation.getPhase()),
        spin: rotation.spin,
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });
</script>

{#snippet wedgeFace(wedge: T, index: number, face: WheelFace)}
    {#if face === "back"}
        {@render props.renderWedgeBack?.(wedge, getWedgeState(index, face))}
    {:else}
        {@render props.renderWedge(wedge, getWedgeState(index, face))}
    {/if}
{/snippet}

{#if props.variant !== "overhead"}
    <div
        class={styles.drumWheelRoot}
        role="group"
        aria-roledescription={roleDescription}
        aria-label={props.ariaLabel}
    >
        <Barrel
            faces={props.wedges}
            {axis}
            faceSize={wedgeSize}
            angle={rotation.getAngle()}
            faceRoleDescription={wedgeRoleDescription}
            computeFaceDefs={(index, face) => ({
                ariaLabel: getWedgeLabel(index),
                isHidden: face === "back" || index !== rotation.getTargetIndex(),
            })}
            renderFace={wedgeFace}
        />
    </div>
{:else}
    <div
        bind:this={wheel}
        class={styles.overheadWheelRoot}
        role="group"
        aria-roledescription={roleDescription}
        aria-label={props.ariaLabel}
    >
        {#each props.wedges as wedge, index (index)}
            {@const wedgeEffect = getWedgeEffect(index)}
            <div
                class={styles.overheadWheelWedge}
                style:transform={WheelUtils.getWedgeTransform(getWedgeAngle(index), wedgeEffect)}
                style:filter={wedgeEffect?.filter || undefined}
                role="group"
                aria-roledescription={wedgeRoleDescription}
                aria-label={getWedgeLabel(index)}
            >
                {@render wedgeFace(wedge, index, "front")}
            </div>
        {/each}
    </div>
{/if}
