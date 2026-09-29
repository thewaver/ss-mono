<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";
    import type { Step } from "@thewaver/ss-components-svelte";
    import { StepperKnobs } from "@thewaver/ss-playground/App/Knobs/Steppers.const";
    import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
    import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
    import ArcExample from "./Examples/Arc.svelte";
    import BareExample from "./Examples/Bare.svelte";
    import DetailedExample from "./Examples/Detailed.svelte";
    import FailedExample from "./Examples/Failed.svelte";
    import LinearExample from "./Examples/Linear.svelte";
    import StackedExample from "./Examples/Stacked.svelte";
    import { STATE_WORDS } from "./StepperPage.const";

    const STARTING_LINEAR: StepValue = "address";
    const STARTING_FAILED: StepValue = "payment";
    const STARTING_STACKED: StepValue = "address";
    const STARTING_DETAILED: StepValue = "payment";
    const EXAMPLES_ROOT = "/src/App/Pages/StepperPage/Examples";

    let isFreeNavigation = $state(StepperKnobs.STARTING_IS_FREE_NAVIGATION);

    let linearCurrent = $state<StepValue>(STARTING_LINEAR);
    let failedCurrent = $state<StepValue>(STARTING_FAILED);
    let stackedCurrent = $state<StepValue>(STARTING_STACKED);
    let detailedCurrent = $state<StepValue>(STARTING_DETAILED);
    let arcCurrent = $state<StepValue>(STARTING_LINEAR);

    const reset = () => {
        linearCurrent = STARTING_LINEAR;
        failedCurrent = STARTING_FAILED;
        stackedCurrent = STARTING_STACKED;
        detailedCurrent = STARTING_DETAILED;
        arcCurrent = STARTING_LINEAR;
    };

    const computeState = (value: StepValue, current: StepValue): PageStepState => {
        if (value === current) return "current";

        return ORDER.indexOf(value) < ORDER.indexOf(current) ? "done" : "ahead";
    };

    const buildSteps = (
        current: StepValue,
        overrides: Partial<Record<StepValue, PageStepState>> = {},
    ): Step<StepValue, PageStepState>[] =>
        ORDER.map((value) => {
            const state = overrides[value] ?? computeState(value, current);

            return {
                value,
                state,
                isNavigable: isFreeNavigation || state === "done" || state === "failed",
            };
        });

    const describe = (step: Step<StepValue, PageStepState>, index: number) =>
        `Step ${index + 1} of ${ORDER.length}, ${LABELS[step.value]}, ${STATE_WORDS[step.state]}`;

    const examples: ExampleDefs[] = [
        {
            key: "linear",
            name: "Linear",
            readout: () =>
                `current: ${linearCurrent} — only the steps behind you can be pressed, unless free navigation is on`,
            component: linearExample,
            path: `${EXAMPLES_ROOT}/Linear.svelte`,
        },
        {
            key: "failed",
            name: "A step that failed",
            readout: () =>
                `current: ${failedCurrent} — the failed step is reachable by keyboard so its tooltip can be read, and its name carries the state as words`,
            component: failedExample,
            path: `${EXAMPLES_ROOT}/Failed.svelte`,
        },
        {
            key: "stacked",
            name: "Stacked",
            readout: () => `current: ${stackedCurrent} — the same steps down the page`,
            component: stackedExample,
            path: `${EXAMPLES_ROOT}/Stacked.svelte`,
        },
        {
            key: "detailed",
            name: "Steps that carry their own content",
            readout: () =>
                `current: ${detailedCurrent} — each step holds a body beside the connector, so the line runs past the content rather than stopping at it`,
            component: detailedExample,
            path: `${EXAMPLES_ROOT}/Detailed.svelte`,
        },
        {
            key: "arc",
            span: 2,
            name: "The same steps, bent along an arc",
            readout: () =>
                `current: ${arcCurrent} — one layout function, and the run between two steps follows the curve they sit on rather than cutting across it`,
            component: arcExample,
            path: `${EXAMPLES_ROOT}/Arc.svelte`,
        },
        {
            key: "bare",
            name: "No connector",
            readout: () => "the connector slot is optional, so a bare strip renders nothing between the steps",
            component: bareExample,
            path: `${EXAMPLES_ROOT}/Bare.svelte`,
        },
    ];
</script>

{#snippet linearExample()}
    <LinearExample
        steps={buildSteps(linearCurrent)}
        currentValue={linearCurrent}
        computeStepAriaLabel={describe}
        onCurrentChange={(value) => {
            linearCurrent = value;
        }}
    />
{/snippet}

{#snippet failedExample()}
    <FailedExample
        steps={buildSteps(failedCurrent, { address: "failed", details: "skipped" })}
        currentValue={failedCurrent}
        computeStepAriaLabel={describe}
        onCurrentChange={(value) => {
            failedCurrent = value;
        }}
    />
{/snippet}

{#snippet stackedExample()}
    <StackedExample
        steps={buildSteps(stackedCurrent)}
        currentValue={stackedCurrent}
        computeStepAriaLabel={describe}
        onCurrentChange={(value) => {
            stackedCurrent = value;
        }}
    />
{/snippet}

{#snippet detailedExample()}
    <DetailedExample
        steps={buildSteps(detailedCurrent)}
        currentValue={detailedCurrent}
        computeStepAriaLabel={describe}
        onCurrentChange={(value) => {
            detailedCurrent = value;
        }}
    />
{/snippet}

{#snippet arcExample()}
    <ArcExample
        steps={buildSteps(arcCurrent)}
        currentValue={arcCurrent}
        computeStepAriaLabel={describe}
        onCurrentChange={(value) => {
            arcCurrent = value;
        }}
    />
{/snippet}

{#snippet bareExample()}
    <BareExample
        steps={buildSteps(linearCurrent)}
        currentValue={linearCurrent}
        computeStepAriaLabel={describe}
        onCurrentChange={(value) => {
            linearCurrent = value;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isFreeNavigation"}
        label={"Free navigation"}
        hint={"Lets any step be jumped to directly, instead of making each one be reached in order."}
    >
        <PageCheckField
            value={isFreeNavigation}
            ariaLabel={"Free navigation"}
            onChange={(value) => {
                isFreeNavigation = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"currentStep"}
        label={"Current step"}
        hint={"Puts the examples back to the step they started on."}
    >
        <Button
            onClick={async () => {
                reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Reset</PageButtonContent>
            {/snippet}
        </Button>
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
