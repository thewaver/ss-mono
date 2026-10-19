<script lang="ts">
    import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import FilledExample from "./Examples/Filled.svelte";
    import PanelExample from "./Examples/Panel.svelte";
    import SidewaysExample from "./Examples/Sideways.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

    let transitionDurationMs = $state(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

    let panelExpanded = $state(false);
    let filledExpanded = $state(false);
    let sidewaysExpanded = $state(false);

    const examples: ExampleDefs[] = [
        {
            key: "panel",
            name: EXAMPLE_NAMES.panel,
            readout: () =>
                `expanded: ${panelExpanded} — one trigger and one panel, with none of the group behavior an accordion adds`,
            component: panelExample,
            path: `${EXAMPLES_ROOT}/Panel.svelte`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
            component: unheldExample,
            path: `${EXAMPLES_ROOT}/Panel.svelte`,
        },
        {
            key: "filled",
            name: EXAMPLE_NAMES.filled,
            readout: () =>
                `expanded: ${filledExpanded} — the panel's contents are not built until it is opened, and are kept once they are`,
            component: filledExample,
            path: `${EXAMPLES_ROOT}/Filled.svelte`,
        },
        {
            key: "sideways",
            name: EXAMPLE_NAMES.sideways,
            readout: () =>
                `expanded: ${sidewaysExpanded} — the panel grows its width instead of its height, and its contents keep theirs`,
            component: sidewaysExample,
            path: `${EXAMPLES_ROOT}/Sideways.svelte`,
        },
    ];
</script>

{#snippet panelExample()}
    <PanelExample {transitionDurationMs} bind:expanded={panelExpanded} />
{/snippet}

{#snippet unheldExample()}
    <PanelExample {transitionDurationMs} />
{/snippet}

{#snippet filledExample()}
    <FilledExample {transitionDurationMs} bind:expanded={filledExpanded} />
{/snippet}

{#snippet sidewaysExample()}
    <SidewaysExample {transitionDurationMs} bind:expanded={sidewaysExpanded} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"transitionDurationMs"}
        controls={"Sets CollapsibleProps.transitionDurationMs"}
        label={"Transition duration (ms)"}
        hint={"How long the panel takes to open and close. At 0 it opens and closes at once."}
    >
        <PageNumberField
            value={transitionDurationMs}
            min={AccordionKnobs.MIN_TRANSITION_MS}
            max={AccordionKnobs.MAX_TRANSITION_MS}
            step={AccordionKnobs.TRANSITION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Transition duration in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
