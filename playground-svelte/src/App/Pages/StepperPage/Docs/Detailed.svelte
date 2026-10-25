<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    import { STARTING_DETAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
    import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
    import {
        BODIES,
        LABELS,
        ORDER,
        STEPPER_GAP,
    } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
    import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

    import PageStepBody from "../../../StyledComponents/StepContent/PageStepBody.svelte";
    import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import type { StepperDocsExampleProps } from "../StepperPageSvelte.types";

    type Props = StepperDocsExampleProps;

    let props: Props = $props();

    let current = $state<StepValue>(STARTING_DETAILED);
</script>

<Stepper
    steps={StepperPageUtils.buildSteps("detailed", current, props.isFreeNavigation)}
    currentValue={current}
    orientation={"vertical"}
    gap={STEPPER_GAP}
    ariaLabel={"Checkout with notes"}
    computeStepAriaLabel={StepperPageUtils.describeStep}
    onCurrentChange={(value) => {
        current = value;
    }}
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
