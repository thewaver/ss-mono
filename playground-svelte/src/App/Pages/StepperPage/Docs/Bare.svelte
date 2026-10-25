<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    import { STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
    import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
    import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
    import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import type { StepperDocsExampleProps } from "../StepperPageSvelte.types";

    type Props = StepperDocsExampleProps;

    let props: Props = $props();

    let current = $state<StepValue>(STARTING_LINEAR);
</script>

<Stepper
    steps={StepperPageUtils.buildSteps("bare", current, props.isFreeNavigation)}
    currentValue={current}
    gap={STEPPER_GAP}
    ariaLabel={"Checkout without connectors"}
    computeStepAriaLabel={StepperPageUtils.describeStep}
    onCurrentChange={(value) => {
        current = value;
    }}
>
    {#snippet renderStep(step, flags)}
        <PageStepContent {flags} state={step.state} ordinal={ORDER.indexOf(step.value) + 1} orientation={"horizontal"}>
            {LABELS[step.value]}
        </PageStepContent>
    {/snippet}
</Stepper>
