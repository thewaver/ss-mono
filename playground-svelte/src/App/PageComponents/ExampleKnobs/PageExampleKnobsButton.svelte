<script lang="ts">
    import type { ShapeArrowAim } from "@thewaver/ss-utils";
    import type { DismisserReason } from "@thewaver/ss-components-svelte";
    import { InteractionWrapper, Popover, PopupTrigger } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/ExampleKnobs/ExampleKnobs.css";
    import * as examplesStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import PageLayer from "../Layer/Layer.svelte";
    import { getNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
    import PagePropsPanel from "../PropsPanel/PagePropsPanel.svelte";
    import type { PageExampleKnobsButtonProps } from "./ExampleKnobs.types";
    import {
        KNOBS_MARK,
        KNOBS_OFFSET,
        KNOBS_PLACEMENT,
        TOOLTIP_OFFSET,
        TOOLTIP_PLACEMENT,
    } from "@thewaver/ss-playground/App/PageComponents/ExampleKnobs/ExampleKnobs.const";

    let props: PageExampleKnobsButtonProps = $props();

    const getNextLayerClassName = getNextLayerClass();

    const popupId = $props.id();

    let triggerRef = $state<HTMLElement>();
    let isOpen = $state(false);

    const label = $derived(`${props.exampleName} settings`);

    const handleDismiss = (reason: DismisserReason) => {
        isOpen = false;

        if (reason === "escape") triggerRef?.querySelector("button")?.focus({ preventScroll: true });
    };
</script>

<InteractionWrapper
    bind:ref={triggerRef}
    extraFlags={{ isOpen }}
    tooltipDefs={{ placement: TOOLTIP_PLACEMENT, offset: TOOLTIP_OFFSET, renderContent: settingsTooltip }}
>
    {#snippet renderControl(attachElement, flags)}
        <PopupTrigger
            {attachElement}
            id={`${props.exampleKey}Knobs`}
            ariaLabel={label}
            {popupId}
            {isOpen}
            {flags}
            onToggle={() => {
                isOpen = !isOpen;
            }}
        >
            {#snippet renderContent()}
                <span class={examplesStyles.exampleActionMark} aria-hidden="true">{KNOBS_MARK}</span>
            {/snippet}
        </PopupTrigger>
    {/snippet}
</InteractionWrapper>

<Popover
    id={popupId}
    role={"dialog"}
    ariaAttributes={{ "aria-label": label }}
    {isOpen}
    anchorRef={triggerRef}
    placement={KNOBS_PLACEMENT}
    offset={KNOBS_OFFSET}
    hasAutoFocus={true}
    onDismiss={handleDismiss}
>
    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <div
            class={[styles.exampleKnobsSurface, getNextLayerClassName(), visibilityTarget === 1 && styles.isVisible]}
            style:transition={`opacity ${transitionDurationMs}ms`}
        >
            <PageLayer>
                <PagePropsPanel scope={"local"}>{@render props.renderKnobs()}</PagePropsPanel>
            </PageLayer>
        </div>
    {/snippet}
</Popover>

{#snippet settingsTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>Settings</PageTooltipContent>
{/snippet}
