<script lang="ts">
    import { Button, type ScrollerAxis, type ScrollerStep } from "@thewaver/ss-components-svelte";

    import PageScrollerButtonContent from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent.svelte";
    import type { ScrollerButtonProps } from "./ScrollerButton.types";

    const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
        x: { previous: "Scroll back", next: "Scroll forward" },
        y: { previous: "Scroll up", next: "Scroll down" },
    };

    let props: ScrollerButtonProps = $props();

    const isPrevious = $derived(props.step === "previous");
</script>

<Button
    isDisabled={isPrevious ? props.stepper.getIsAtStart() : props.stepper.getIsAtEnd()}
    ariaLabel={ARIA_LABELS[props.axis ?? "x"][props.step]}
    onClick={() => void (isPrevious ? props.stepper.stepToPrevious() : props.stepper.stepToNext())}
>
    {#snippet renderContent(flags)}
        <PageScrollerButtonContent {flags} step={props.step} axis={props.axis} />
    {/snippet}
</Button>
