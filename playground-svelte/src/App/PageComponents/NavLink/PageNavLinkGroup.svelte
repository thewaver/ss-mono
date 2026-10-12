<script lang="ts">
    import type { Snippet } from "svelte";
    import { on } from "svelte/events";

    import {
        FloaterStyles,
        FloaterSvelteUtils,
        InteractionTrackerUtils,
        TREE_DEFAULTS,
        toStyle,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

    import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater.const.svelte";

    const LINK_SELECTOR = "a";

    const transitionDurationMs = TREE_DEFAULTS.floaterTransitionDurationMs;

    let props: { children?: Snippet } = $props();

    let root = $state<HTMLDivElement>();
    let hoveredLink = $state<HTMLElement>();
    let focusVisibleLink = $state<HTMLElement>();

    const findLink = (target: EventTarget | null) => {
        const link = target instanceof Element ? target.closest(LINK_SELECTOR) : null;

        return link instanceof HTMLElement && root?.contains(link) ? link : undefined;
    };

    const readFocusVisibleLink = (target: EventTarget | null) => {
        const link = findLink(target);

        return link && InteractionTrackerUtils.computeIsFocusVisible(link) ? link : undefined;
    };

    const floater = FloaterSvelteUtils.create({
        getIsEnabled: () => true,
        getContainer: () => root ?? undefined,
        getTarget: () => hoveredLink ?? focusVisibleLink,
        getTransitionDurationMs: () => transitionDurationMs,
    });
</script>

<div
    bind:this={root}
    class={styles.navLinkGroup}
    {@attach (element) =>
        on(element, "pointerover", (e) => {
            hoveredLink = findLink(e.target);
        })}
    {@attach (element) =>
        on(element, "pointerleave", () => {
            hoveredLink = undefined;
        })}
    onfocusin={(e) => {
        focusVisibleLink = readFocusVisibleLink(e.target);
    }}
    onfocusout={() => {
        focusVisibleLink = undefined;
    }}
>
    {#if floater.getIsRendered()}
        <div
            {@attach floater.attachRef}
            class={FloaterStyles.floater}
            style={toStyle(floater.getBounds(), { transitionDuration: `${transitionDurationMs}ms` })}
        >
            {@render renderPageHighlightFloater(floater.getVisibilityTarget(), transitionDurationMs)}
        </div>
    {/if}

    {@render props.children?.()}
</div>
