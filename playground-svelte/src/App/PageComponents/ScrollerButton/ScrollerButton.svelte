<script lang="ts">
    import { Button, type ScrollerAxis, type ScrollerStep } from "@thewaver/ss-components-svelte";

    import PageScrollerButtonContent from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent.svelte";
    import type { ScrollerButtonProps } from "./ScrollerButton.types";

    const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
        x: { previous: "Scroll back", next: "Scroll forward" },
        y: { previous: "Scroll up", next: "Scroll down" },
    };

    let props: ScrollerButtonProps = $props();

    const axis = $derived(props.axis ?? "x");
    const isPrevious = $derived(props.step === "previous");
</script>

{#if props.controller}
    {@const controller = props.controller}

    <Button
        id={props.id}
        isDisabled={isPrevious ? controller[axis].getIsAtStart() : controller[axis].getIsAtEnd()}
        ariaLabel={ARIA_LABELS[axis][props.step]}
        ariaControls={controller.getBoxId()}
        onClick={() => void (isPrevious ? controller[axis].stepToPrevious() : controller[axis].stepToNext())}
    >
        {#snippet renderContent(flags)}
            <PageScrollerButtonContent {flags} step={props.step} {axis} />
        {/snippet}
    </Button>
{/if}
