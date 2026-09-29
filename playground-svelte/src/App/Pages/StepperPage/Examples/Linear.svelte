<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

    import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import type { StepperExampleProps } from "../StepperPage.types";

    type Props = StepperExampleProps;

    let props: Props = $props();
</script>

<Stepper
    steps={props.steps}
    currentValue={props.currentValue}
    gap={STEPPER_GAP}
    ariaLabel={"Checkout"}
    computeStepAriaLabel={props.computeStepAriaLabel}
    onCurrentChange={props.onCurrentChange}
>
    {#snippet renderStep(step, flags)}
        <PageStepContent {flags} state={step.state} ordinal={ORDER.indexOf(step.value) + 1} orientation={"horizontal"}>
            {LABELS[step.value]}
        </PageStepContent>
    {/snippet}

    {#snippet renderConnector()}
        <PageStepConnector orientation={"horizontal"} />
    {/snippet}
</Stepper>
