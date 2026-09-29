<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CutoutUtils,
        FocusManagerUtils,
        LiveAnnouncerUtils,
        SPOTLIGHT_DEFAULTS,
        SpotlightUtils,
        SpotlightStyles as styles,
    } from "@thewaver/ss-components";
    import { Rect } from "@thewaver/ss-utils";

    import { AnchorSvelteUtils } from "../../Abstracts/Anchor/AnchorSvelte.utils.svelte.js";
    import { ElementFaderSvelteUtils } from "../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { ElevationSvelteUtils } from "../../Abstracts/Elevation/ElevationSvelte.utils.svelte.js";
    import { FocusManagerSvelteUtils } from "../../Abstracts/FocusManager/FocusManagerSvelte.utils.svelte.js";
    import { getViewportContext } from "../../Abstracts/Viewport/Viewport.context.js";
    import { attachPortal } from "../../Utils/portalUtils.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { SpotlightProps } from "./Spotlight.types.js";

    let { visibility = $bindable(), ...props }: SpotlightProps = $props();

    const viewportContext = getViewportContext();

    let rect = $state.raw<Rect>();
    let portal = $state<HTMLDivElement>();
    let popup = $state<HTMLDivElement>();

    const transitionDurationMs = $derived(props.transitionDurationMs ?? SPOTLIGHT_DEFAULTS.transitionDurationMs);
    const padding = $derived(props.padding ?? SPOTLIGHT_DEFAULTS.padding);
    const hasPopup = $derived(props.mode === "guide" && props.renderPopup !== undefined);

    const fader = ElementFaderSvelteUtils.createFader(() => visibility, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => portal ?? undefined,
        onShow: () => props.onShow?.(),
        onHide: () => props.onHide?.(),
    });

    ElementObserverSvelteUtils.createViewportRectObserver(() => props.elementRef, fader.getIsVisible, {
        setElementRect: (next) => {
            if (!rect || !Rect.isSame(rect, next)) rect = next;
        },
        getPadding: () => padding,
    });

    ElevationSvelteUtils.createElevation(
        () => props.elementRef,
        fader.getIsVisible,
        () => styles.SPOTLIGHT_Z_INDEX,
    );

    $effect(() => {
        const element = props.elementRef;

        if (!fader.getIsVisible() || !element) return;

        untrack(() => element.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });

    const position = AnchorSvelteUtils.createPortalPosition(
        () => props.elementRef,
        () => fader.getIsVisible() && hasPopup,
        {
            getPlacement: () => props.popupPlacement ?? SPOTLIGHT_DEFAULTS.popupPlacement,
            getOffset: () => props.popupOffset ?? SPOTLIGHT_DEFAULTS.popupOffset,
            getAnchorRect: () => rect,
        },
    );

    const maskStyle = $derived(rect ? toStyle(CutoutUtils.getMaskStyle([rect])) : "");

    const clipPath = $derived(rect ? SpotlightUtils.getHoleClipPath(rect) : undefined);

    const dismiss = () => {
        visibility = false;
    };

    $effect(() => {
        if (!fader.getIsVisible()) return;

        return untrack(() => SpotlightUtils.observeDismissKeys(() => props.mode, dismiss));
    });

    $effect(() => {
        const element = props.elementRef;

        if (!fader.getIsVisible() || props.mode !== "prompt" || !element) return;

        return untrack(() => SpotlightUtils.holdFocus(element));
    });

    $effect(() => {
        const element = portal;

        if (!fader.getIsVisible() || props.mode !== "guide" || !element) return;

        return untrack(() => FocusManagerUtils.sealAround(element));
    });

    $effect(() => {
        if (props.announcement === undefined) return;

        untrack(() => LiveAnnouncerUtils.reserve("polite"));
    });

    let announced: string | undefined;

    $effect(() => {
        const announcement = props.announcement;

        if (!fader.getIsVisible()) return;

        untrack(() => {
            if (SpotlightUtils.getIsAnnouncementDue(announced, announcement)) {
                LiveAnnouncerUtils.announce(announcement!);
            }
        });

        announced = announcement;
    });

    let hasPlaced = $state(false);

    $effect.pre(() => {
        if (!fader.getIsVisible() || !hasPopup) {
            hasPlaced = false;

            return;
        }

        if (position.getPosition()) hasPlaced = true;
    });

    FocusManagerSvelteUtils.autoFocus(
        () => popup ?? undefined,
        () => hasPlaced,
    );
</script>

{#if fader.getIsVisible() && rect}
    {@const shownRect = rect}
    <div bind:this={portal} {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}>
        <div class={styles.spotlightOverlay}>
            {@render props.renderOverlay(fader.getTransitionTarget(), transitionDurationMs, maskStyle)}
        </div>

        <div
            {@attach (element) =>
                on(element, "click", () => {
                    if (props.mode === "hint") dismiss();
                })}
            class={styles.spotlightBlocker}
            style:clip-path={clipPath}
        ></div>

        {#if props.renderHighlight}
            <div
                class={styles.spotlightDecoration}
                style:top={`${shownRect.y}px`}
                style:left={`${shownRect.x}px`}
                style:width={`${shownRect.width}px`}
                style:height={`${shownRect.height}px`}
            >
                {@render props.renderHighlight(fader.getTransitionTarget(), transitionDurationMs)}
            </div>
        {/if}

        {#if hasPopup}
            <div
                bind:this={popup}
                {@attach position.attachContent}
                class={styles.spotlightPopup}
                style:visibility={position.getPosition() ? "visible" : "hidden"}
                style:transform={`translate(${position.getPosition()?.x ?? 0}px, ${position.getPosition()?.y ?? 0}px)`}
                tabindex="-1"
                role="dialog"
                aria-modal="true"
                aria-label={props.ariaLabel}
                onkeydown={(e) =>
                    FocusManagerUtils.focusTrapKeyDown(
                        e as Parameters<typeof FocusManagerUtils.focusTrapKeyDown>[0],
                        popup ?? undefined,
                    )}
            >
                {@render props.renderPopup?.(
                    fader.getTransitionTarget(),
                    transitionDurationMs,
                    position.getPlacement(),
                )}
            </div>
        {/if}
    </div>
{/if}
