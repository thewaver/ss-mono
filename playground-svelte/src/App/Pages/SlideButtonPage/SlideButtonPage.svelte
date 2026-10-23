<script lang="ts">
    import { SLIDE_BUTTON_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { SlideButtonKnobs } from "@thewaver/ss-playground/App/Knobs/SlideButtons.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.css";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DescribedExample from "./Examples/Described.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import HeldExample from "./Examples/Held.svelte";
    import HoldOnlyExample from "./Examples/HoldOnly.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import SlideOnlyExample from "./Examples/SlideOnly.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

    let sends = $state(0);
    let progress = $state(0);
    let completionRatio = $state(SLIDE_BUTTON_DEFAULTS.completionRatio);
    let isArmed = $state(false);
    let describedSends = $state(0);
    let disabledSends = $state(0);
    let reachableSends = $state(0);
    let hasError = $state(true);
    let slideOnlySends = $state(0);
    let holdOnlySends = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `activations: ${sends} — progress ${Math.round(progress * PERCENT)}%, which the owner reads while the gesture is still running`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "described",
            name: EXAMPLE_NAMES.described,
            readout: () =>
                `activations: ${describedSends} — the hint under the control is what a screen reader reads after its name, so the gesture is stated before anyone has to guess it`,
            component: describedExample,
            path: `${EXAMPLES_ROOT}/Described.svelte`,
        },
        {
            key: "slideOnly",
            name: EXAMPLE_NAMES.slideOnly,
            readout: () =>
                `activations: ${slideOnlySends} — a held press does nothing here, so carrying the thumb is the only pointer route, and a held Enter still confirms`,
            component: slideOnlyExample,
            path: `${EXAMPLES_ROOT}/SlideOnly.svelte`,
        },
        {
            key: "holdOnly",
            name: EXAMPLE_NAMES.holdOnly,
            readout: () =>
                `activations: ${holdOnlySends} — dragging the thumb does nothing here, so a stray drag cannot reach the action, and a held press or a held Enter both can`,
            component: holdOnlyExample,
            path: `${EXAMPLES_ROOT}/HoldOnly.svelte`,
        },
        {
            key: "held",
            name: EXAMPLE_NAMES.held,
            readout: () => `armed: ${isArmed}`,
            component: heldExample,
            path: `${EXAMPLES_ROOT}/Held.svelte`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `activations: ${disabledSends}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `activations: ${reachableSends}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `hasError: ${hasError}`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <div class={styles.stage}>
        <DefaultExample
            bind:progress
            {completionRatio}
            onActivate={() => {
                sends += 1;
            }}
        />
    </div>
{/snippet}

{#snippet describedExample()}
    <DescribedExample
        onActivate={() => {
            describedSends += 1;
        }}
    />
{/snippet}

{#snippet slideOnlyExample()}
    <div class={styles.stage}>
        <SlideOnlyExample
            onActivate={() => {
                slideOnlySends += 1;
            }}
        />
    </div>
{/snippet}

{#snippet holdOnlyExample()}
    <div class={styles.stage}>
        <HoldOnlyExample
            onActivate={() => {
                holdOnlySends += 1;
            }}
        />
    </div>
{/snippet}

{#snippet heldExample()}
    <div class={styles.stage}>
        <HeldExample
            {isArmed}
            onActivate={() => {
                isArmed = true;
            }}
            onReset={() => {
                isArmed = false;
            }}
        />
    </div>
{/snippet}

{#snippet disabledExample()}
    <div class={styles.stage}>
        <DisabledExample
            onActivate={() => {
                disabledSends += 1;
            }}
        />
    </div>
{/snippet}

{#snippet reachableExample()}
    <div class={styles.stage}>
        <ReachableExample
            onActivate={() => {
                reachableSends += 1;
            }}
        />
    </div>
{/snippet}

{#snippet erroredExample()}
    <div class={styles.stage}>
        <ErroredExample
            {hasError}
            onActivate={() => {
                hasError = !hasError;
            }}
        />
    </div>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"completionRatio"}
        controls={"Sets SlideButtonProps.completionRatio on the default example"}
        label={"Completion ratio"}
        hint={
            "How far along the track the thumb has to be when let go for the slide to complete. At 1 it has to reach the end; short of it, it springs back."
        }
    >
        <PageNumberField
            value={completionRatio}
            min={SlideButtonKnobs.MIN_COMPLETION_RATIO}
            max={SlideButtonKnobs.MAX_COMPLETION_RATIO}
            step={SlideButtonKnobs.COMPLETION_RATIO_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Completion ratio"}
            onInput={(value) => {
                completionRatio = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
