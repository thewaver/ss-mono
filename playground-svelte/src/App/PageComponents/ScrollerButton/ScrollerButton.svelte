<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageScrollerButtonContent from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent.svelte";
    import type { ScrollerButtonProps } from "./ScrollerButton.types";

    let props: ScrollerButtonProps = $props();

    const isPrevious = $derived(props.step === "previous");
</script>

<Button
    isDisabled={isPrevious ? props.stepper.getIsAtStart() : props.stepper.getIsAtEnd()}
    ariaLabel={isPrevious ? "Scroll back" : "Scroll forward"}
    onClick={() => void (isPrevious ? props.stepper.stepToPrevious() : props.stepper.stepToNext())}
>
    {#snippet renderContent(flags)}
        <PageScrollerButtonContent {flags} step={props.step} />
    {/snippet}
</Button>
