<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import CaptionFirstExample from "./Examples/CaptionFirst.svelte";
    import CheckboxLabelExample from "./Examples/CheckboxLabel.svelte";
    import ColumnExample from "./Examples/Column.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import LabelPerRadioExample from "./Examples/LabelPerRadio.svelte";
    import SuppressedExample from "./Examples/Suppressed.svelte";
    import type { PlanValue } from "./LabelPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/LabelPage/Examples";

    let checked = $state(false);
    let toggleChecked = $state(true);
    let columnChecked = $state(false);
    let disabledChecked = $state(true);
    let suppressedChecked = $state(false);
    let plan = $state<PlanValue>("free");

    const examples: ExampleDefs[] = [
        {
            key: "checkbox",
            name: "Checkbox",
            readout: () => `checked: ${checked}`,
            component: checkboxExample,
            path: `${EXAMPLES_ROOT}/CheckboxLabel.svelte`,
        },
        {
            key: "toggleCaptionFirst",
            name: "Toggle, caption first",
            readout: () => `on: ${toggleChecked}`,
            component: captionFirstExample,
            path: `${EXAMPLES_ROOT}/CaptionFirst.svelte`,
        },
        {
            key: "column",
            name: "Column",
            readout: () => `checked: ${columnChecked}`,
            component: columnExample,
            path: `${EXAMPLES_ROOT}/Column.svelte`,
        },
        {
            key: "labelPerRadio",
            name: "One label per radio",
            readout: () => `value: ${plan}`,
            component: labelPerRadioExample,
            path: `${EXAMPLES_ROOT}/LabelPerRadio.svelte`,
        },
        {
            key: "suppressed",
            name: "Suppressed aria-label",
            readout: () => `checked: ${suppressedChecked} — the caption wins, and the console says so`,
            component: suppressedExample,
            path: `${EXAMPLES_ROOT}/Suppressed.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `checked: ${disabledChecked}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
    ];
</script>

{#snippet checkboxExample()}
    <CheckboxLabelExample bind:checked />
{/snippet}

{#snippet captionFirstExample()}
    <CaptionFirstExample bind:checked={toggleChecked} />
{/snippet}

{#snippet columnExample()}
    <ColumnExample bind:checked={columnChecked} />
{/snippet}

{#snippet labelPerRadioExample()}
    <LabelPerRadioExample bind:value={plan} />
{/snippet}

{#snippet suppressedExample()}
    <SuppressedExample bind:checked={suppressedChecked} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:checked={disabledChecked} />
{/snippet}

<PageExamples items={examples} />
