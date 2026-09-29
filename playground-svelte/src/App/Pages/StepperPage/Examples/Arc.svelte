<script lang="ts">
    import { PlacementLayoutUtils, Stepper } from "@thewaver/ss-components-svelte";
    import type { ArcDefs } from "@thewaver/ss-components-svelte";
    import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

    import PageStepArcCell from "../../../StyledComponents/StepContent/PageStepArcCell.svelte";
    import PageStepArcConnector from "../../../StyledComponents/StepContent/PageStepArcConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import type { StepperExampleProps } from "../StepperPage.types";

    const ARC_DEFS: ArcDefs = {
        curveHeightRatio: 1,
        spreadDegrees: 135,
        itemWidthRatio: 0.302,
        itemHeightRatio: 0.418,
    };

    const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

    type Props = StepperExampleProps;

    let props: Props = $props();
</script>

<Stepper
    steps={props.steps}
    currentValue={props.currentValue}
    ariaLabel={"Checkout, on an arc"}
    computeLayout={ARC_LAYOUT}
    computeStepAriaLabel={props.computeStepAriaLabel}
    onCurrentChange={props.onCurrentChange}
>
    {#snippet renderStep(step, flags)}
        <PageStepArcCell>
            <PageStepContent
                {flags}
                state={step.state}
                ordinal={ORDER.indexOf(step.value) + 1}
                orientation={"horizontal"}
            >
                {LABELS[step.value]}
            </PageStepContent>
        </PageStepArcCell>
    {/snippet}

    {#snippet renderConnector(defs)}
        <PageStepArcConnector {defs} />
    {/snippet}
</Stepper>
