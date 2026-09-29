<script lang="ts">
    import { Stepper } from "@thewaver/ss-components-svelte";
    import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

    import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { StepperExampleProps } from "../StepperPage.types";

    const FAILURE_REASON = "The card was declined, so this step has to be repeated before the order can be reviewed.";
    const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

    const REASONS = { failed: failedReason, ahead: lockedReason };

    type Props = StepperExampleProps;

    let props: Props = $props();
</script>

{#snippet failedReason(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>{FAILURE_REASON}</PageTooltipContent>
{/snippet}

{#snippet lockedReason(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>{LOCKED_REASON}</PageTooltipContent>
{/snippet}

<Stepper
    steps={props.steps}
    currentValue={props.currentValue}
    gap={STEPPER_GAP}
    ariaLabel={"Checkout with a failure"}
    computeStepAriaLabel={props.computeStepAriaLabel}
    computeTooltipDefs={(step) => {
        const reason = step.state === "failed" || step.state === "ahead" ? REASONS[step.state] : undefined;

        if (!reason) return undefined;

        return {
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            hoverShowDelayMs: 0,
            renderContent: reason,
        };
    }}
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
