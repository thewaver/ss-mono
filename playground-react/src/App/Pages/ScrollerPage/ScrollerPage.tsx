import { useMemo, useState } from "react";

import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-react";
import type { ScrollerOverflow, ScrollerProgress, Tab } from "@thewaver/ss-components-react";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    MONTHS,
    PERCENT,
    getMonthPanelId,
    getMonthTabId,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ArchedExample } from "./Examples/Arched";
import { BothWaysExample } from "./Examples/BothWays";
import { ChipsExample } from "./Examples/Chips";
import { FocusableChildrenExample } from "./Examples/FocusableChildren";
import { ShortTrackExample } from "./Examples/ShortTrack";
import { TabbedExample } from "./Examples/Tabbed";
import { VerticalStripExample } from "./Examples/VerticalStrip";

export const ScrollerPage = () => {
    const [itemCount, setItemCount] = useState(ScrollerKnobs.STARTING_ITEM_COUNT);
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
    const [overlapCount, setOverlapCount] = useState(SCROLLER_DEFAULTS.overlapCount);
    const [overflowX, setOverflowX] = useState<ScrollerOverflow>(SCROLLER_DEFAULTS.overflowX);
    const [overflowY, setOverflowY] = useState<ScrollerOverflow>("auto");
    const [isAutoHiding, setIsAutoHiding] = useState(SCROLLER_DEFAULTS.isAutoHiding);
    const [isBarOverlaid, setIsBarOverlaid] = useState(SCROLLER_DEFAULTS.isBarOverlaid);
    const [hideDelayMs, setHideDelayMs] = useState(SCROLLER_DEFAULTS.hideDelayMs);
    const progressState = useState<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);

    const labels = useMemo(() => Array.from({ length: itemCount }, (_, index) => `Item ${index + 1}`), [itemCount]);

    const monthTabs = useMemo(
        (): Tab<string>[] =>
            MONTHS.slice(0, itemCount).map((month) => ({
                value: month,
                id: getMonthTabId(month),
                panelId: getMonthPanelId(month),
            })),
        [itemCount],
    );

    const examples = [
        {
            key: "split",
            name: EXAMPLE_NAMES.split,
            readout: () =>
                `${itemCount} items, ${Math.round(progressState[0].x * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
            component: () => <ChipsExample labels={labels} overlapCount={overlapCount} progress={progressState} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "bothButtonsEnd",
            name: EXAMPLE_NAMES.bothButtonsEnd,
            readout: () => "the same control with its buttons together instead of split",
            component: () => <ChipsExample labels={labels} overlapCount={overlapCount} buttonPlacement={"end"} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "bothButtonsStart",
            name: EXAMPLE_NAMES.bothButtonsStart,
            readout: () => "and the same pair on the other side",
            component: () => <ChipsExample labels={labels} overlapCount={overlapCount} buttonPlacement={"start"} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "tabbed",
            name: EXAMPLE_NAMES.tabbed,
            readout: () =>
                `selected: ${selectedMonth} — a tab already fully in view does not move the strip, and one cut off by the edge scrolls into view whole`,
            component: () => (
                <TabbedExample tabs={monthTabs} selectedValue={selectedMonth} onSelectionChange={setSelectedMonth} />
            ),
            path: `${EXAMPLES_ROOT}/Tabbed.tsx`,
        },
        {
            key: "focusableChildren",
            name: EXAMPLE_NAMES.focusableChildren,
            readout: () => "the track holds whatever it is given, and tabbing through pulls the strip along",
            component: () => <FocusableChildrenExample labels={labels} overlapCount={overlapCount} />,
            path: `${EXAMPLES_ROOT}/FocusableChildren.tsx`,
        },
        {
            key: "verticalStrip",
            name: EXAMPLE_NAMES.verticalStrip,
            readout: () =>
                "scrolls down only, so the children stack in a column, the step buttons sit above and below, and the drawn bar keeps a strip of its own on the inline end",
            component: () => <VerticalStripExample labels={labels} overlapCount={overlapCount} />,
            path: `${EXAMPLES_ROOT}/VerticalStrip.tsx`,
        },
        {
            key: "bothWays",
            name: EXAMPLE_NAMES.bothWays,
            readout: () =>
                `across: ${overflowX}, down: ${overflowY} — one pair of step buttons and one bar per direction, with the corner where the bars meet left empty`,
            component: () => (
                <BothWaysExample
                    labels={labels}
                    overflowX={overflowX}
                    overflowY={overflowY}
                    isAutoHiding={isAutoHiding}
                    hideDelayMs={hideDelayMs}
                    isBarOverlaid={isBarOverlaid}
                />
            ),
            path: `${EXAMPLES_ROOT}/BothWays.tsx`,
        },
        {
            key: "overlaidAutoHiding",
            name: EXAMPLE_NAMES.overlaidAutoHiding,
            readout: () =>
                `the bar floats over the content's edge and fades ${hideDelayMs}ms after scrolling stops, coming back while the pointer moves over the box`,
            component: () => (
                <VerticalStripExample
                    labels={labels}
                    overlapCount={overlapCount}
                    isAutoHiding={true}
                    hideDelayMs={hideDelayMs}
                    isBarOverlaid={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/VerticalStrip.tsx`,
        },
        {
            key: "shortTrack",
            name: EXAMPLE_NAMES.shortTrack,
            readout: () =>
                "the painter draws a short track; a press on it pages towards the press and keeps paging while held, and with Alt (Option on a Mac) it jumps there instead",
            component: () => <ShortTrackExample labels={labels} overlapCount={overlapCount} />,
            path: `${EXAMPLES_ROOT}/ShortTrack.tsx`,
        },
        {
            key: "arched",
            name: EXAMPLE_NAMES.arched,
            readout: () =>
                "the track is an arc, and computeProgressAtPoint reads the pointer by its angle, so the thumb follows the pointer round the curve",
            component: () => <ArchedExample labels={labels} overlapCount={overlapCount} />,
            path: `${EXAMPLES_ROOT}/Arched.tsx`,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"itemCount"}
                    label={"Item count"}
                    hint={"How many items sit in the scrolling strip."}
                    controls={"Sets the number of example items sent as Scroller's children"}
                >
                    <PageNumberField
                        value={itemCount}
                        min={ScrollerKnobs.MIN_ITEM_COUNT}
                        max={ScrollerKnobs.MAX_ITEM_COUNT}
                        step={ScrollerKnobs.ITEM_COUNT_STEP}
                        ariaLabel={"Item count"}
                        onInput={setItemCount}
                    />
                </PageProp>

                <PageProp
                    itemKey={"overlapCount"}
                    label={"Overlap count"}
                    hint={
                        "How many of the items in view stay in view after a press of a step button. At 0 a press moves on by as much as fits; a press always moves by at least one item."
                    }
                    controls={"Sets ScrollerProps.overlapCount"}
                >
                    <PageNumberField
                        value={overlapCount}
                        min={ScrollerKnobs.MIN_OVERLAP_COUNT}
                        max={ScrollerKnobs.MAX_OVERLAP_COUNT}
                        step={ScrollerKnobs.OVERLAP_COUNT_STEP}
                        ariaLabel={"Overlap count"}
                        onInput={setOverlapCount}
                    />
                </PageProp>

                <PageProp
                    itemKey={"position"}
                    label={"First strip (%)"}
                    hint={"How far through its run the first strip is scrolled, as a percentage."}
                    controls={"Sets ScrollerProps.progress, shown as a percentage"}
                >
                    <PageNumberField
                        value={Math.round(progressState[0].x * PERCENT)}
                        min={ScrollerKnobs.MIN_POSITION}
                        max={PERCENT}
                        step={ScrollerKnobs.POSITION_STEP}
                        ariaLabel={"First strip position"}
                        onInput={(value) => progressState[1]((current) => ({ ...current, x: value / PERCENT }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"overflowX"}
                    label={ScrollerKnobs.OVERFLOW_X.label}
                    hint={ScrollerKnobs.OVERFLOW_X.hint}
                    controls={ScrollerKnobs.OVERFLOW_X.controls}
                >
                    <PageSelectField
                        value={overflowX}
                        values={SCROLLER_OVERFLOWS}
                        ariaLabel={ScrollerKnobs.OVERFLOW_X.label}
                        onChange={setOverflowX}
                    />
                </PageProp>

                <PageProp
                    itemKey={"overflowY"}
                    label={ScrollerKnobs.OVERFLOW_Y.label}
                    hint={ScrollerKnobs.OVERFLOW_Y.hint}
                    controls={ScrollerKnobs.OVERFLOW_Y.controls}
                >
                    <PageSelectField
                        value={overflowY}
                        values={SCROLLER_OVERFLOWS}
                        ariaLabel={ScrollerKnobs.OVERFLOW_Y.label}
                        onChange={setOverflowY}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isAutoHiding"}
                    label={ScrollerKnobs.IS_AUTO_HIDING.label}
                    hint={ScrollerKnobs.IS_AUTO_HIDING.hint}
                    controls={ScrollerKnobs.IS_AUTO_HIDING.controls}
                >
                    <PageCheckField
                        value={isAutoHiding}
                        ariaLabel={ScrollerKnobs.IS_AUTO_HIDING.label}
                        onChange={setIsAutoHiding}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isBarOverlaid"}
                    label={ScrollerKnobs.IS_BAR_OVERLAID.label}
                    hint={ScrollerKnobs.IS_BAR_OVERLAID.hint}
                    controls={ScrollerKnobs.IS_BAR_OVERLAID.controls}
                >
                    <PageCheckField
                        value={isBarOverlaid}
                        ariaLabel={ScrollerKnobs.IS_BAR_OVERLAID.label}
                        onChange={setIsBarOverlaid}
                    />
                </PageProp>

                <PageProp
                    itemKey={"hideDelayMs"}
                    label={ScrollerKnobs.HIDE_DELAY_MS.label}
                    hint={ScrollerKnobs.HIDE_DELAY_MS.hint}
                    controls={ScrollerKnobs.HIDE_DELAY_MS.controls}
                >
                    <PageNumberField
                        value={hideDelayMs}
                        min={ScrollerKnobs.HIDE_DELAY_MS.min}
                        max={ScrollerKnobs.HIDE_DELAY_MS.max}
                        step={ScrollerKnobs.HIDE_DELAY_MS.step}
                        ariaLabel={ScrollerKnobs.HIDE_DELAY_MS.label}
                        onInput={setHideDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={400} />
        </div>
    );
};
