<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageNumberInputStepperContent from "../../StyledComponents/NumberInputStepperContent/PageNumberInputStepperContent.svelte";
    import PageNumberInputStepperFrame from "../../StyledComponents/NumberInputStepperContent/PageNumberInputStepperFrame.svelte";
    import type { NumberInputStepperProps } from "./NumberInputStepper.types";

    let props: NumberInputStepperProps = $props();
</script>

<PageNumberInputStepperFrame>
    <Button
        isDisabled={props.flags.isDisabled || props.flags.isReadOnly || props.stepper.getIsAtMax()}
        onPointerDown={props.stepper.startSteppingUp}
        onPointerUp={props.stepper.stopStepping}
        onMouseLeave={props.stepper.stopStepping}
    >
        {#snippet renderContent(flags)}
            <PageNumberInputStepperContent {flags} direction={"up"}>Increase</PageNumberInputStepperContent>
        {/snippet}
    </Button>

    <Button
        isDisabled={props.flags.isDisabled || props.flags.isReadOnly || props.stepper.getIsAtMin()}
        onPointerDown={props.stepper.startSteppingDown}
        onPointerUp={props.stepper.stopStepping}
        onMouseLeave={props.stepper.stopStepping}
    >
        {#snippet renderContent(flags)}
            <PageNumberInputStepperContent {flags} direction={"down"}>Decrease</PageNumberInputStepperContent>
        {/snippet}
    </Button>
</PageNumberInputStepperFrame>
