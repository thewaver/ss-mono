<script lang="ts">
    import { on } from "svelte/events";

    import { REVEAL_DEFAULTS, RevealUtils, RevealStyles as styles } from "@thewaver/ss-components";
    import { MathUtils, type Point2d } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { RevealProps } from "./Reveal.types.js";

    let props: RevealProps = $props();

    let root = $state<HTMLDivElement>();
    let keyboardPoint = $state<Point2d>();

    const isDisabled = $derived(props.isDisabled === true);

    const pointer = PointerTrackerSvelteUtils.create(
        () => root ?? undefined,
        () => isDisabled,
    );

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => root ?? undefined,
        () => isDisabled,
    );

    const radius = $derived(props.radius ?? REVEAL_DEFAULTS.radius);

    const isPointerInside = $derived(
        RevealUtils.getIsPointerInside(pointer.getIsPointerPresent(), pointer.getReading()),
    );

    const isKeyboardDriven = $derived(!isDisabled && keyboardPoint !== undefined);

    const isRevealing = $derived(RevealUtils.getIsRevealing(isDisabled, isKeyboardDriven, isPointerInside));

    const hasHole = $derived(
        RevealUtils.getHasHole(isDisabled, isKeyboardDriven, pointer.getIsPointerPresent(), radius),
    );

    const pointerPoint = $derived(RevealUtils.toPointerPoint(pointer.getReading(), getSize()));

    const holeCenter = $derived(
        RevealUtils.computeHoleCenter(isKeyboardDriven ? keyboardPoint : undefined, pointerPoint, getSize()),
    );

    const softness = $derived(MathUtils.clamp01(props.softness ?? REVEAL_DEFAULTS.softness));

    const holeImage = $derived(
        RevealUtils.buildHoleImage(radius, softness, props.computePoints, props.joinRadii, props.lameExponents),
    );

    const maskStyle = $derived(toStyle(RevealUtils.computeMaskStyle(hasHole, holeCenter, radius, holeImage)));

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
            ? holeCenter
            : isPointerInside
              ? pointerPoint
              : RevealUtils.toCenter(getSize());

        keyboardPoint = RevealUtils.computeNudgedPoint(
            from,
            nudge,
            props.stepSize ?? REVEAL_DEFAULTS.stepSize,
            getSize(),
        );
    };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.revealRoot}
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

    <div class={styles.revealCover}>{@render props.renderCover(isRevealing, maskStyle)}</div>
</div>
