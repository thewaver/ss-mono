<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    
    import { ARC_LAYOUT, ARC_WIDTH, STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
    import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
    import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
    import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

    import PageStepArcCell from "../../../StyledComponents/StepContent/PageStepArcCell.svelte";
    import PageStepArcConnector from "../../../StyledComponents/StepContent/PageStepArcConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import type { StepperDocsExampleProps } from "../StepperPageSvelte.types";

    type Props = StepperDocsExampleProps;

    let props: Props = $props();

    let current = $state<StepValue>(STARTING_LINEAR);
</script>

<div style:width={ARC_WIDTH}>
    <Stepper
        steps={StepperPageUtils.buildSteps("arc", current, props.isFreeNavigation)}
        currentValue={current}
        ariaLabel={"Checkout, on an arc"}
        computeLayout={ARC_LAYOUT}
        computeStepAriaLabel={StepperPageUtils.describeStep}
        onCurrentChange={(value) => {
            current = value;
        }}
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
</div>
