<script lang="ts">
    import type { ShapeArrowAim } from "@thewaver/ss-utils";
    import { Stepper } from "@thewaver/ss-components-svelte";
    import { FAILED_OVERRIDES, STARTING_FAILED, LOCKED_REASON, FAILURE_REASON, CHECKOUT_FAILURE_LABEL } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
    import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
    import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
    import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

    import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.svelte";
    import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { StepperDocsExampleProps } from "../StepperPageSvelte.types";

    const REASONS = { failed: failedReason, ahead: lockedReason };

    type Props = StepperDocsExampleProps;

    let props: Props = $props();

    let current = $state<StepValue>(STARTING_FAILED);
</script>

{#snippet failedReason(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{FAILURE_REASON}</PageTooltipContent>
{/snippet}

{#snippet lockedReason(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{LOCKED_REASON}</PageTooltipContent>
{/snippet}

<Stepper
    steps={StepperPageUtils.buildSteps("failed", current, props.isFreeNavigation, FAILED_OVERRIDES)}
    currentValue={current}
    gap={STEPPER_GAP}
    ariaLabel={CHECKOUT_FAILURE_LABEL}
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
