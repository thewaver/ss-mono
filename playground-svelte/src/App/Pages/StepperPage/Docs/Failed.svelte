<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    import { FAILED_OVERRIDES, STARTING_FAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
    import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
    import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
    import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

    import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { StepperDocsExampleProps } from "../StepperPageSvelte.types";

    const FAILURE_REASON = "The card was declined, so this step has to be repeated before the order can be reviewed.";
    const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

    const REASONS = { failed: failedReason, ahead: lockedReason };

    type Props = StepperDocsExampleProps;

    let props: Props = $props();

    let current = $state<StepValue>(STARTING_FAILED);
</script>

{#snippet failedReason(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>{FAILURE_REASON}</PageTooltipContent>
{/snippet}

{#snippet lockedReason(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>{LOCKED_REASON}</PageTooltipContent>
{/snippet}

<Stepper
    steps={StepperPageUtils.buildSteps("failed", current, props.isFreeNavigation, FAILED_OVERRIDES)}
    currentValue={current}
    gap={STEPPER_GAP}
    ariaLabel={"Checkout with a failure"}
    computeStepAriaLabel={StepperPageUtils.describeStep}
    computeTooltipDefs={(step) => {
        const reason = step.state === "failed" || step.state === "ahead" ? REASONS[step.state] : undefined;

        if (!reason) return undefined;

        return {
            placement: { x: "center", y: "top_out" },
            offset: { x: 0, y: 10 },
            hoverShowDelayMs: 0,
            renderContent: reason,
        };
    }}
    onCurrentChange={(value) => {
        current = value;
    }}
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
