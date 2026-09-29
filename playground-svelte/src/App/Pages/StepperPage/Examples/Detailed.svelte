<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    import {
        BODIES,
        LABELS,
        ORDER,
        STEPPER_GAP,
    } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

    import PageStepBody from "../../../StyledComponents/StepContent/PageStepBody.svelte";
    import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import type { StepperExampleProps } from "../StepperPage.types";

    type Props = StepperExampleProps;

    let props: Props = $props();
</script>

<Stepper
    steps={props.steps}
    currentValue={props.currentValue}
    orientation={"vertical"}
    gap={STEPPER_GAP}
    ariaLabel={"Checkout with notes"}
    computeStepAriaLabel={props.computeStepAriaLabel}
    onCurrentChange={props.onCurrentChange}
>
    {#snippet renderStep(step, flags)}
        <PageStepContent {flags} state={step.state} ordinal={ORDER.indexOf(step.value) + 1} orientation={"vertical"}>
            {LABELS[step.value]}
        </PageStepContent>
    {/snippet}

    {#snippet renderBody(step)}
        <PageStepBody>{BODIES[step.value]}</PageStepBody>
    {/snippet}

    {#snippet renderConnector()}
        <PageStepConnector orientation={"vertical"} isRail={true} />
    {/snippet}
</Stepper>
