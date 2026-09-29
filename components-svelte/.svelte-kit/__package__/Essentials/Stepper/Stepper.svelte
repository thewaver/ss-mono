<script lang="ts" generics="TValue, TState">
    import type { Snippet } from "svelte";

    import {
        type InteractionFlags,
        type InteractionSizing,
        STEPPER_DEFAULTS,
        type Step,
        type StepperFlags,
        StepperUtils,
        StepperStyles as styles,
    } from "@thewaver/ss-components";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import type { StepperProps } from "./Stepper.types.js";
    import StepperItem from "./StepperItem.svelte";

    const ROW_SIZING: InteractionSizing = "fit-content";
    const PLACED_SIZING: InteractionSizing = "fill";

    let props: StepperProps<TValue, TState> = $props();

    const hasLayout = $derived(props.computeLayout !== undefined);
    const hasBody = $derived(props.renderBody !== undefined);

    $effect(() => StepperUtils.warnIfBodyIgnored(hasLayout, hasBody));

    const orientation = $derived(props.orientation ?? STEPPER_DEFAULTS.orientation);
    const flexDirection = $derived(orientation === "horizontal" ? "row" : "column");
    const itemCount = $derived(props.steps.length);
    const lastIndex = $derived(itemCount - 1);

    const layout = $derived(props.computeLayout?.({ itemCount }));

    const getHasConnector = (index: number) => props.renderConnector !== undefined && index !== lastIndex;
</script>

{#snippet connector(index: number)}
    {@render props.renderConnector?.(StepperUtils.computeConnectorDefs(index, layout))}
{/snippet}

{#snippet control(step: Step<TValue, TState>, index: number)}
    {@const tooltipDefs = props.computeTooltipDefs?.(step, index)}
    <InteractionWrapper
        sizing={layout?.placements[index] === undefined ? ROW_SIZING : PLACED_SIZING}
        isDisabled={!(step.isNavigable ?? false)}
        isReachableWhenDisabled={tooltipDefs !== undefined}
        isFocusableWhenDisabled={step.isReachableWhenDisabled ?? false}
        {tooltipDefs}
        extraFlags={{ isCurrent: step.value === props.currentValue }}
    >
        {#snippet renderControl(attachElement, flags)}
            {#snippet stepContent(itemFlags: InteractionFlags<StepperFlags>)}
                {@render props.renderStep(step, itemFlags)}
            {/snippet}

            <StepperItem
                {attachElement}
                {step}
                {flags}
                ariaLabel={props.computeStepAriaLabel(step, index)}
                renderContent={stepContent}
                onSelect={(value) => props.onCurrentChange?.(value)}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet list(children: Snippet)}
    <ol
        class={[styles.stepperList, layout !== undefined && styles.stepperPlacedList]}
        style:flex-direction={layout === undefined ? flexDirection : undefined}
        style:flex-wrap={layout === undefined && orientation === "horizontal" ? "wrap" : undefined}
        style:gap={layout === undefined ? `${props.gap ?? STEPPER_DEFAULTS.gap}px` : undefined}
        aria-label={props.ariaLabel}
    >
        {@render children()}
    </ol>
{/snippet}

{#snippet entries()}
    {#each props.steps as step, index (index)}
        {#if layout === undefined}
            <li class={styles.stepperEntry} style:flex-direction={flexDirection}>
                {@render control(step, index)}

                {#if props.renderBody}
                    <div class={styles.stepperTail}>
                        {#if getHasConnector(index)}
                            <span class={[styles.stepperConnector, styles.stepperTailConnector]} aria-hidden="true">
                                {@render connector(index)}
                            </span>
                        {/if}

                        <div class={styles.stepperBody}>{@render props.renderBody(step, index)}</div>
                    </div>
                {:else if getHasConnector(index)}
                    <span class={styles.stepperConnector} aria-hidden="true">
                        {@render connector(index)}
                    </span>
                {/if}
            </li>
        {:else}
            {@const placement = layout.placements[index]}
            <li class={styles.stepperLayer}>
                {#if getHasConnector(index)}
                    <span class={styles.stepperLayerConnector} aria-hidden="true">
                        {@render connector(index)}
                    </span>
                {/if}

                {#if placement}
                    <PlacementItem {placement}>{@render control(step, index)}</PlacementItem>
                {/if}
            </li>
        {/if}
    {/each}
{/snippet}

{#if layout}
    <PlacementBox {layout} computeEffect={props.computeEffect}>
        {@render list(entries)}
    </PlacementBox>
{:else}
    {@render list(entries)}
{/if}
