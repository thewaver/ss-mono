<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import { FocusManagerUtils, MODAL_DEFAULTS, ModalUtils, ModalStyles as styles } from "@thewaver/ss-components";
    import { CSSUtils, GestureUtils } from "@thewaver/ss-utils";

    import { DismisserSvelteUtils } from "../../../Abstracts/Dismisser/DismisserSvelte.utils.svelte.js";
    import { ElementFaderSvelteUtils } from "../../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { FocusManagerSvelteUtils } from "../../../Abstracts/FocusManager/FocusManagerSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { attachPortal } from "../../../Utils/portalUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { ModalProps } from "./Modal.types.js";

    const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

    let { visibility = $bindable(), ...props }: ModalProps = $props();

    const viewportContext = getViewportContext();

    let root = $state<HTMLDivElement>();
    let container = $state<HTMLDivElement>();
    let swipeOffsetRatio = $state(0);

    const transitionDurationMs = $derived(props.transitionDurationMs ?? MODAL_DEFAULTS.transitionDurationMs);
    const alignment = $derived(props.alignment ?? MODAL_DEFAULTS.alignment);
    const margins = $derived(props.margins ?? DEFAULT_MARGINS);
    const isDismissableOnOverlayClick = $derived(
        props.isDismissableOnOverlayClick ?? MODAL_DEFAULTS.isDismissableOnOverlayClick,
    );

    const fader = ElementFaderSvelteUtils.createFader(() => visibility, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => root ?? undefined,
        onShow: () => props.onShow?.(),
        onHide: () => props.onHide?.(),
    });

    $effect(() => {
        const element = root;

        if (!fader.getIsVisible() || !element) return;

        const unseal = FocusManagerUtils.sealAround(element);
        const unlock = FocusManagerUtils.lockScroll();

        return () => {
            unlock();
            unseal();
        };
    });

    FocusManagerSvelteUtils.autoFocus(() => container ?? undefined, fader.getIsVisible, {
        getInitialRef: () => props.initialFocusRef,
    });

    const handleDismiss = () => {
        visibility = false;
    };

    const handleOverlayClick = () => {
        if (!isDismissableOnOverlayClick) return;

        handleDismiss();
    };

    const { getIsSwiping } = InteractionTrackerSvelteUtils.trackAxialSwipe(
        () => container ?? undefined,
        () => ModalUtils.getIsSwipeDisabled(alignment, isDismissableOnOverlayClick),
        {
            getAxis: () => ModalUtils.getSwipeAxis(alignment),
            getCommitRatio: () => ModalUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                const direction = ModalUtils.getSwipeDirection(alignment);

                if (!direction) return;

                swipeOffsetRatio = GestureUtils.computeSwipeOffset(progressRatio, direction);
            },
            onSwipeEnd: (direction) => {
                if (ModalUtils.getIsSwipeDismissal(direction, alignment)) {
                    handleDismiss();

                    return;
                }

                swipeOffsetRatio = 0;
            },
        },
    );

    $effect(() => {
        if (fader.getIsVisible()) return;

        swipeOffsetRatio = 0;
    });

    DismisserSvelteUtils.createLayer(fader.getIsVisible, {
        getRoots: () => [container],
        onDismiss: (reason) => {
            const isDismissableOnEscape = props.isDismissableOnEscape ?? MODAL_DEFAULTS.isDismissableOnEscape;

            if (!ModalUtils.getIsDismissedBy(reason, isDismissableOnEscape)) return;

            handleDismiss();
        },
    });

    $effect(() => {
        const hasTransitionFinished = fader.getHasTransitionFinished();

        untrack(() => props.onTransitionStatusChange?.(hasTransitionFinished));
    });

    const containerStyle = $derived.by(() => {
        const maxSize = ModalUtils.computeMaxSize(margins);

        return toStyle({
            ...CSSUtils.spreadableToStyle(margins, (key) => key),
            maxWidth: maxSize.maxWidth,
            maxHeight: maxSize.maxHeight,
            transform: ModalUtils.computeSwipeTransform(alignment, swipeOffsetRatio),
            transitionProperty: "transform",
            transitionDuration: `${getIsSwiping() ? 0 : transitionDurationMs}ms`,
        });
    });
</script>

{#if fader.getIsVisible()}
    <div
        bind:this={root}
        {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}
        {@attach (element) =>
            on(element, "keydown", (e) =>
                FocusManagerUtils.focusTrapKeyDown(
                    e as Parameters<typeof FocusManagerUtils.focusTrapKeyDown>[0],
                    container ?? undefined,
                ),
            )}
        class={[styles.modalRoot, styles.modalAlignmentVariants[alignment]]}
    >
        <div {@attach (element) => on(element, "click", handleOverlayClick)} class={styles.modalOverlay}>
            {@render props.renderOverlay(fader.getTransitionTarget(), transitionDurationMs)}
        </div>
        <div
            bind:this={container}
            class={styles.modalContainer}
            style={containerStyle}
            tabindex="-1"
            role={props.role ?? MODAL_DEFAULTS.role}
            aria-modal="true"
            aria-label={props.ariaLabel}
            aria-labelledby={props.ariaLabelledBy}
            aria-describedby={props.ariaDescribedBy}
        >
            {@render props.renderContent(fader.getTransitionTarget(), transitionDurationMs)}
        </div>
    </div>
{/if}
