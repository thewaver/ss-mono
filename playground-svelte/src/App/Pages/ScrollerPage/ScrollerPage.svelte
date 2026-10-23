<script lang="ts">
    import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-svelte";
    import type { ScrollerOverflow, ScrollerProgress, Tab } from "@thewaver/ss-components-svelte";
    import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import ArchedExample from "./Examples/Arched.svelte";
    import BothWaysExample from "./Examples/BothWays.svelte";
    import ChipsExample from "./Examples/Chips.svelte";
    import FocusableChildrenExample from "./Examples/FocusableChildren.svelte";
    import ShortTrackExample from "./Examples/ShortTrack.svelte";
    import TabbedExample from "./Examples/Tabbed.svelte";
    import VerticalStripExample from "./Examples/VerticalStrip.svelte";
    import {
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        MONTHS,
        PERCENT,
        getMonthPanelId,
        getMonthTabId,
    } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";

    let itemCount = $state(ScrollerKnobs.STARTING_ITEM_COUNT);
    let selectedMonth = $state(MONTHS[0]);
    let overlapCount = $state(SCROLLER_DEFAULTS.overlapCount);
    let overflowX = $state<ScrollerOverflow>(SCROLLER_DEFAULTS.overflowX);
    let overflowY = $state<ScrollerOverflow>("auto");
    let isAutoHiding = $state(SCROLLER_DEFAULTS.isAutoHiding);
    let isBarOverlaid = $state(SCROLLER_DEFAULTS.isBarOverlaid);
    let hideDelayMs = $state(SCROLLER_DEFAULTS.hideDelayMs);
    let progress = $state<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);

    const labels = $derived(Array.from({ length: itemCount }, (_, index) => `Item ${index + 1}`));

    const monthTabs = $derived<Tab<string>[]>(
        MONTHS.slice(0, itemCount).map((month) => ({
            value: month,
            id: getMonthTabId(month),
            panelId: getMonthPanelId(month),
        })),
    );

    const examples: ExampleDefs[] = [
        {
            key: "split",
            name: EXAMPLE_NAMES.split,
            readout: () =>
                `${itemCount} items, ${Math.round(progress.x * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
            component: splitExample,
            path: `${EXAMPLES_ROOT}/Chips.svelte`,
        },
        {
            key: "bothButtonsEnd",
            name: EXAMPLE_NAMES.bothButtonsEnd,
            readout: () => "the same control with its buttons together instead of split",
            component: bothButtonsEndExample,
            path: `${EXAMPLES_ROOT}/Chips.svelte`,
        },
        {
            key: "bothButtonsStart",
            name: EXAMPLE_NAMES.bothButtonsStart,
            readout: () => "and the same pair on the other side",
            component: bothButtonsStartExample,
            path: `${EXAMPLES_ROOT}/Chips.svelte`,
        },
        {
            key: "tabbed",
            name: EXAMPLE_NAMES.tabbed,
            readout: () =>
                `selected: ${selectedMonth} — a tab already fully in view does not move the strip, and one cut off by the edge scrolls into view whole`,
            component: tabbedExample,
            path: `${EXAMPLES_ROOT}/Tabbed.svelte`,
        },
        {
            key: "focusableChildren",
            name: EXAMPLE_NAMES.focusableChildren,
            readout: () => "the track holds whatever it is given, and tabbing through pulls the strip along",
            component: focusableChildrenExample,
            path: `${EXAMPLES_ROOT}/FocusableChildren.svelte`,
        },
        {
            key: "verticalStrip",
            name: EXAMPLE_NAMES.verticalStrip,
            readout: () =>
                "scrolls down only, so the children stack in a column, the step buttons sit above and below, and the drawn bar keeps a strip of its own on the inline end",
            component: verticalStripExample,
            path: `${EXAMPLES_ROOT}/VerticalStrip.svelte`,
        },
        {
            key: "bothWays",
            name: EXAMPLE_NAMES.bothWays,
            readout: () =>
                `across: ${overflowX}, down: ${overflowY} — one pair of step buttons and one bar per direction, with the corner where the bars meet left empty`,
            component: bothWaysExample,
            path: `${EXAMPLES_ROOT}/BothWays.svelte`,
        },
        {
            key: "overlaidAutoHiding",
            name: EXAMPLE_NAMES.overlaidAutoHiding,
            readout: () =>
                `the bar floats over the content's edge and fades ${hideDelayMs}ms after scrolling stops, coming back while the pointer moves over the box`,
            component: overlaidAutoHidingExample,
            path: `${EXAMPLES_ROOT}/VerticalStrip.svelte`,
        },
        {
            key: "shortTrack",
            name: EXAMPLE_NAMES.shortTrack,
            readout: () =>
                "the painter draws a short track; a press on it pages towards the press and keeps paging while held, and with Alt (Option on a Mac) it jumps there instead",
            component: shortTrackExample,
            path: `${EXAMPLES_ROOT}/ShortTrack.svelte`,
        },
        {
            key: "arched",
            name: EXAMPLE_NAMES.arched,
            readout: () =>
                "the track is an arc, and computeProgressAtPoint reads the pointer by its angle, so the thumb follows the pointer round the curve",
            component: archedExample,
            path: `${EXAMPLES_ROOT}/Arched.svelte`,
        },
    ];
</script>

{#snippet splitExample()}
    <ChipsExample {labels} {overlapCount} bind:progress />
{/snippet}

{#snippet bothButtonsEndExample()}
    <ChipsExample {labels} {overlapCount} buttonPlacement={"end"} />
{/snippet}

{#snippet bothButtonsStartExample()}
    <ChipsExample {labels} {overlapCount} buttonPlacement={"start"} />
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
    <FocusableChildrenExample {labels} {overlapCount} />
{/snippet}

{#snippet verticalStripExample()}
    <VerticalStripExample {labels} {overlapCount} />
{/snippet}

{#snippet bothWaysExample()}
    <BothWaysExample {labels} {overflowX} {overflowY} {isAutoHiding} {hideDelayMs} {isBarOverlaid} />
{/snippet}

{#snippet overlaidAutoHidingExample()}
    <VerticalStripExample {labels} {overlapCount} isAutoHiding={true} {hideDelayMs} isBarOverlaid={true} />
{/snippet}

{#snippet shortTrackExample()}
    <ShortTrackExample {labels} {overlapCount} />
{/snippet}

{#snippet archedExample()}
    <ArchedExample {labels} {overlapCount} />
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp itemKey={"itemCount"} controls={"Sets the number of example items sent as Scroller's children"} label={"Item count"} hint={"How many items sit in the scrolling strip."}>
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
            itemKey={"overlapCount"}
            controls={"Sets ScrollerProps.overlapCount"}
            label={"Overlap count"}
            hint={
                "How many of the items in view stay in view after a press of a step button. At 0 a press moves on by as much as fits; a press always moves by at least one item."
            }
        >
            <PageNumberField
                value={overlapCount}
                min={ScrollerKnobs.MIN_OVERLAP_COUNT}
                max={ScrollerKnobs.MAX_OVERLAP_COUNT}
                step={ScrollerKnobs.OVERLAP_COUNT_STEP}
                ariaLabel={"Overlap count"}
                onInput={(value) => {
                    overlapCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"position"}
            controls={"Sets ScrollerProps.progress, shown as a percentage"}
            label={"First strip (%)"}
            hint={"How far through its run the first strip is scrolled, as a percentage."}
        >
            <PageNumberField
                value={Math.round(progress.x * PERCENT)}
                min={ScrollerKnobs.MIN_POSITION}
                max={PERCENT}
                step={ScrollerKnobs.POSITION_STEP}
                ariaLabel={"First strip position"}
                onInput={(value) => {
                    progress = { ...progress, x: value / PERCENT };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"overflowX"}
            controls={ScrollerKnobs.OVERFLOW_X.controls}
            label={ScrollerKnobs.OVERFLOW_X.label}
            hint={ScrollerKnobs.OVERFLOW_X.hint}
        >
            <PageSelectField
                value={overflowX}
                values={SCROLLER_OVERFLOWS}
                ariaLabel={ScrollerKnobs.OVERFLOW_X.label}
                onChange={(value) => {
                    overflowX = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"overflowY"}
            controls={ScrollerKnobs.OVERFLOW_Y.controls}
            label={ScrollerKnobs.OVERFLOW_Y.label}
            hint={ScrollerKnobs.OVERFLOW_Y.hint}
        >
            <PageSelectField
                value={overflowY}
                values={SCROLLER_OVERFLOWS}
                ariaLabel={ScrollerKnobs.OVERFLOW_Y.label}
                onChange={(value) => {
                    overflowY = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isAutoHiding"}
            controls={ScrollerKnobs.IS_AUTO_HIDING.controls}
            label={ScrollerKnobs.IS_AUTO_HIDING.label}
            hint={ScrollerKnobs.IS_AUTO_HIDING.hint}
        >
            <PageCheckField
                value={isAutoHiding}
                ariaLabel={ScrollerKnobs.IS_AUTO_HIDING.label}
                onChange={(value) => {
                    isAutoHiding = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isBarOverlaid"}
            controls={ScrollerKnobs.IS_BAR_OVERLAID.controls}
            label={ScrollerKnobs.IS_BAR_OVERLAID.label}
            hint={ScrollerKnobs.IS_BAR_OVERLAID.hint}
        >
            <PageCheckField
                value={isBarOverlaid}
                ariaLabel={ScrollerKnobs.IS_BAR_OVERLAID.label}
                onChange={(value) => {
                    isBarOverlaid = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hideDelayMs"}
            controls={ScrollerKnobs.HIDE_DELAY_MS.controls}
            label={ScrollerKnobs.HIDE_DELAY_MS.label}
            hint={ScrollerKnobs.HIDE_DELAY_MS.hint}
        >
            <PageNumberField
                value={hideDelayMs}
                min={ScrollerKnobs.HIDE_DELAY_MS.min}
                max={ScrollerKnobs.HIDE_DELAY_MS.max}
                step={ScrollerKnobs.HIDE_DELAY_MS.step}
                ariaLabel={ScrollerKnobs.HIDE_DELAY_MS.label}
                onInput={(value) => {
                    hideDelayMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} minColumnWidth={400} />
</div>
