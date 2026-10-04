<script lang="ts">
    import { on } from "svelte/events";

    import { LENS_DEFAULTS, LensUtils, RevealUtils, LensStyles as styles } from "@thewaver/ss-components";
    import { MathUtils, type Point2d } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { LensProps } from "./Lens.types.js";

    let props: LensProps = $props();

    let root = $state<HTMLDivElement>();
    let keyboardPoint = $state<Point2d>();

    const isDisabled = $derived(props.isDisabled === true);

    const pointer = PointerTrackerSvelteUtils.create(
        () => root ?? undefined,
        () => isDisabled,
        () => props.pointSource,
    );

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => root ?? undefined,
        () => isDisabled,
    );

    const radius = $derived(props.radius ?? LENS_DEFAULTS.radius);

    const zoom = $derived(props.zoom ?? LENS_DEFAULTS.zoom);

    const isPointerInside = $derived(
        RevealUtils.getIsPointerInside(pointer.getIsPointerPresent(), pointer.getReading()),
    );

    const isKeyboardDriven = $derived(!isDisabled && keyboardPoint !== undefined);

    const hasLens = $derived(
        RevealUtils.getHasHole(isDisabled, isKeyboardDriven, pointer.getIsPointerPresent(), radius),
    );

    const pointerPoint = $derived(RevealUtils.toPointerPoint(pointer.getReading(), getSize()));

    const lensCenter = $derived(
        RevealUtils.computeHoleCenter(isKeyboardDriven ? keyboardPoint : undefined, pointerPoint, getSize()),
    );

    const softness = $derived(MathUtils.clamp01(props.softness ?? LENS_DEFAULTS.softness));

    const lensImage = $derived(
        RevealUtils.buildHoleImage(radius, softness, props.computePoints, props.joinRadii, props.lameExponents),
    );

    const layerStyle = $derived(toStyle(LensUtils.computeLayerStyle(hasLens, lensCenter, radius, lensImage)));

    const copyStyle = $derived(toStyle(LensUtils.computeCopyStyle(lensCenter, zoom)));

    const handleFocus = () => {
        if (isDisabled || !root?.matches(":focus-visible")) return;

        keyboardPoint = RevealUtils.toCenter(getSize());
    };

    const handleBlur = (e: FocusEvent) => {
        if (e.target === e.currentTarget) keyboardPoint = undefined;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const nudge = RevealUtils.getNudge(e);

        if (isDisabled || !nudge) return;

        e.preventDefault();

        const from = isKeyboardDriven
            ? lensCenter
            : isPointerInside
              ? pointerPoint
              : RevealUtils.toCenter(getSize());

        keyboardPoint = RevealUtils.computeNudgedPoint(
            from,
            nudge,
            props.stepSize ?? LENS_DEFAULTS.stepSize,
            getSize(),
        );
    };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.lensRoot}
    role="group"
    tabindex={isDisabled ? undefined : 0}
    aria-label={props.ariaLabel}
    aria-disabled={isDisabled || undefined}
    onfocus={handleFocus}
    onblur={handleBlur}
    onpointermove={() => {
        keyboardPoint = undefined;
    }}
>
    {@render props.renderContent()}

    <div class={styles.lensLayer} style={layerStyle} aria-hidden="true" inert>
        <div class={styles.lensCopy} style={copyStyle}>{@render props.renderContent()}</div>
    </div>
</div>
