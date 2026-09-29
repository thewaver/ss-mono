<script lang="ts">
    import type { AnchorPlacement, DismisserReason } from "@thewaver/ss-components-svelte";
    import { InteractionWrapper, Popover, PopupTrigger } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/ExampleKnobs/ExampleKnobs.css";

    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import PageLayer from "../Layer/Layer.svelte";
    import PagePropsPanel from "../PropsPanel/PagePropsPanel.svelte";
    import type { PageExampleKnobsButtonProps } from "./ExampleKnobs.types";

    const KNOBS_PLACEMENT: AnchorPlacement = { x: "right-out", y: "top-in" };
    const KNOBS_OFFSET = { x: 10, y: 0 };
    const KNOBS_MARK = "⚙";
    const TOOLTIP_PLACEMENT: AnchorPlacement = { x: "center", y: "top-out" };
    const TOOLTIP_OFFSET = { x: 0, y: 10 };

    let props: PageExampleKnobsButtonProps = $props();

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
                <span aria-hidden="true">{KNOBS_MARK}</span>
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
            class={[styles.exampleKnobsSurface, visibilityTarget === 1 && styles.isVisible]}
            style:transition={`opacity ${transitionDurationMs}ms`}
        >
            <PageLayer level={2}>
                <PagePropsPanel scope={"local"}>{@render props.renderKnobs()}</PagePropsPanel>
            </PageLayer>
        </div>
    {/snippet}
</Popover>

{#snippet settingsTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Settings</PageTooltipContent>
{/snippet}
