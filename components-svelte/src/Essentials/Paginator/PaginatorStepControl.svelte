<script lang="ts">
    import { untrack } from "svelte";

    import { type InteractionFlags, type PaginatorStepRenderProps, PaginatorUtils } from "@thewaver/ss-components";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import type { PaginatorStepControlProps } from "./Paginator.types.js";
    import PaginatorItem from "./PaginatorItem.svelte";
    import { PaginatorSvelteUtils } from "./PaginatorSvelte.utils.svelte.js";

    let props: PaginatorStepControlProps = $props();

    let element = $state<HTMLElement>();

    const placed = PaginatorSvelteUtils.createPlacedControl(untrack(() => props.context), () => element);

    const placement = $derived(placed.getPlacement());

    const stepState = $derived(
        PaginatorUtils.computeStepState(
            props.step,
            props.context.getPage(),
            props.context.getPageCount(),
            props.context.getIsDisabled(),
        ),
    );
</script>

{#snippet control()}
    <InteractionWrapper
        bind:ref={element}
        sizing={placed.getSizing()}
        isDisabled={stepState.isDisabled}
        extraFlags={{ step: props.step, targetPage: stepState.targetPage, placement }}
    >
        {#snippet renderControl(attachElement, renderProps)}
            {#snippet stepContent(itemFlags: InteractionFlags<PaginatorStepRenderProps>)}
                {@render props.renderStep(props.step, itemFlags)}
            {/snippet}

            <PaginatorItem
                {attachElement}
                href={stepState.isDisabled ? undefined : props.context.computeHref(stepState.targetPage)}
                isCurrent={false}
                ariaLabel={props.computeStepLabel(props.step, stepState.targetPage)}
                flags={renderProps}
                linkComponent={props.context.getLinkComponent()}
                renderContent={stepContent}
                onActivate={() => props.context.goTo(stepState.targetPage)}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#if placement}
    <PlacementItem {placement} stackAt={placed.getStackAt()}>
        {@render control()}
    </PlacementItem>
{:else}
    {@render control()}
{/if}
