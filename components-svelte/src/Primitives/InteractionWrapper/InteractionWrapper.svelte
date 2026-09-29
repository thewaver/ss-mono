<script lang="ts" generics="TExtra extends object = {}">
    import type { Attachment } from "svelte/attachments";

    import {
        INTERACTION_WRAPPER_DEFAULTS,
        type InteractionFlags,
        InteractionTrackerUtils,
        InteractionWrapperStyles as styles,
    } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import Tooltip from "../../Essentials/Tooltip/Tooltip.svelte";
    import type { InteractionWrapperProps } from "./InteractionWrapper.types.js";

    const NO_EXTRA_FLAGS = {};

    let { ref = $bindable(), ...props }: InteractionWrapperProps<TExtra> = $props();

    let element = $state<HTMLElement>();

    const sizing = $derived(props.sizing ?? INTERACTION_WRAPPER_DEFAULTS.sizing);
    const isDisabled = $derived(props.isDisabled ?? false);

    const isReachable = $derived(
        InteractionTrackerUtils.computeIsReachable(
            isDisabled,
            props.isReachableWhenDisabled ?? false,
            props.isFocusableWhenDisabled ?? false,
        ),
    );

    const { getFlags } = InteractionTrackerSvelteUtils.wrapElement(
        () => element,
        () => isDisabled,
        {
            getIsReachable: () => isReachable,
            getIsTabbable: () => props.isTabbable ?? true,
        },
    );

    InteractionTrackerSvelteUtils.trackActivation(
        () => element,
        () => isDisabled || props.onActivation === undefined,
        (activation) => props.onActivation?.(activation),
    );

    const flags = $derived({
        ...getFlags(),
        isDisabled,
        isPressed: props.isPressed,
        hasError: props.hasError,
        ...((props.extraFlags ?? NO_EXTRA_FLAGS) as TExtra),
    } as InteractionFlags<TExtra>);

    const attachElement: Attachment<HTMLElement> = (next) => {
        element = next;
        ref = next;

        return () => {
            if (element !== next) return;

            element = undefined;
            ref = undefined;
        };
    };
</script>

<div
    class={[
        styles.interactionRoot,
        styles.interactionSizingVariants[sizing],
        isDisabled && styles.interactionDisabled,
        props.hasError && styles.interactionError,
        props.isPressed && styles.interactionPressed,
    ]}
    role={props.role ?? INTERACTION_WRAPPER_DEFAULTS.role}
    style:min-width={props.minWidth ? `${props.minWidth}px` : undefined}
    style:min-height={props.minHeight ? `${props.minHeight}px` : undefined}
>
    {@render props.renderControl(attachElement, flags)}

    {#if props.renderDecoration}
        <div class={styles.interactionDecorationWrapper}>
            {@render props.renderDecoration(flags)}
        </div>
    {/if}

    {#if props.tooltipDefs}
        {@const { renderContent: renderTooltipContent, ...tooltipDefs } = props.tooltipDefs}
        <Tooltip {...tooltipDefs} anchorRef={element}>
            {#snippet renderContent(visibilityTarget, transitionDurationMs, placement)}
                {@render renderTooltipContent(visibilityTarget, transitionDurationMs, placement, flags)}
            {/snippet}
        </Tooltip>
    {/if}
</div>
