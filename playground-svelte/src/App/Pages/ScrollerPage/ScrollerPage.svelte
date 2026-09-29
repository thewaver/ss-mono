<script lang="ts">
    import type { Tab } from "@thewaver/ss-components-svelte";
    import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import ChipsExample from "./Examples/Chips.svelte";
    import FocusableChildrenExample from "./Examples/FocusableChildren.svelte";
    import TabbedExample from "./Examples/Tabbed.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ScrollerPage/Examples";
    const PERCENT = 100;

    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let itemCount = $state(ScrollerKnobs.STARTING_ITEM_COUNT);
    let selectedMonth = $state(MONTHS[0]);
    let progress = $state(0);

    const labels = $derived(Array.from({ length: itemCount }, (_, index) => `Item ${index + 1}`));

    const monthTabs = $derived<Tab<string>[]>(MONTHS.slice(0, itemCount).map((month) => ({ value: month })));

    const examples: ExampleDefs[] = [
        {
            key: "split",
            name: "One button at each end",
            readout: () =>
                `${itemCount} items, ${Math.round(progress * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
            component: splitExample,
            path: `${EXAMPLES_ROOT}/Chips.svelte`,
        },
        {
            key: "bothButtonsEnd",
            name: "Both buttons at the end",
            readout: () => "the same control with its buttons together instead of split",
            component: bothButtonsEndExample,
            path: `${EXAMPLES_ROOT}/Chips.svelte`,
        },
        {
            key: "bothButtonsStart",
            name: "Both buttons at the start",
            readout: () => "and the same pair on the other side",
            component: bothButtonsStartExample,
            path: `${EXAMPLES_ROOT}/Chips.svelte`,
        },
        {
            key: "tabbed",
            name: "Focus reveals what it lands on",
            readout: () =>
                `selected: ${selectedMonth} — a tab already fully in view does not move the strip, and one cut off by the edge scrolls into view whole`,
            component: tabbedExample,
            path: `${EXAMPLES_ROOT}/Tabbed.svelte`,
        },
        {
            key: "focusableChildren",
            name: "Focusable children of any kind",
            readout: () => "the track holds whatever it is given, and tabbing through pulls the strip along",
            component: focusableChildrenExample,
            path: `${EXAMPLES_ROOT}/FocusableChildren.svelte`,
        },
    ];
</script>

{#snippet splitExample()}
    <ChipsExample {labels} bind:progress />
{/snippet}

{#snippet bothButtonsEndExample()}
    <ChipsExample {labels} buttonPlacement={"end"} />
{/snippet}

{#snippet bothButtonsStartExample()}
    <ChipsExample {labels} buttonPlacement={"start"} />
{/snippet}

{#snippet tabbedExample()}
    <TabbedExample
        tabs={monthTabs}
        selectedValue={selectedMonth}
        onSelectionChange={(value) => {
            selectedMonth = value;
        }}
    />
{/snippet}

{#snippet focusableChildrenExample()}
    <FocusableChildrenExample {labels} />
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp itemKey={"itemCount"} label={"Item count"} hint={"How many items sit in the scrolling strip."}>
            <PageNumberField
                value={itemCount}
                min={ScrollerKnobs.MIN_ITEM_COUNT}
                max={ScrollerKnobs.MAX_ITEM_COUNT}
                step={ScrollerKnobs.ITEM_COUNT_STEP}
                ariaLabel={"Item count"}
                onInput={(value) => {
                    itemCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"position"}
            label={"First strip (%)"}
            hint={"How far through its run the first strip is scrolled, as a percentage."}
        >
            <PageNumberField
                value={Math.round(progress * PERCENT)}
                min={ScrollerKnobs.MIN_POSITION}
                max={PERCENT}
                step={ScrollerKnobs.POSITION_STEP}
                ariaLabel={"First strip position"}
                onInput={(value) => {
                    progress = value / PERCENT;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} minColumnWidth={400} />
</div>
