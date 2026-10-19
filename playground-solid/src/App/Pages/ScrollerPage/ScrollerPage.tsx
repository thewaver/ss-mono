import { createMemo, createSignal } from "solid-js";

import type { Tab } from "@thewaver/ss-components-solid";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    MONTHS,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ChipsExample } from "./Examples/Chips";
import { FocusableChildrenExample } from "./Examples/FocusableChildren";
import { TabbedExample } from "./Examples/Tabbed";

export const ScrollerPage = () => {
    const [getItemCount, setItemCount] = createSignal(ScrollerKnobs.STARTING_ITEM_COUNT);
    const [getSelectedMonth, setSelectedMonth] = createSignal(MONTHS[0]);
    const progressSignal = createSignal(0);

    const getLabels = createMemo(() => Array.from({ length: getItemCount() }, (_, index) => `Item ${index + 1}`));

    const getMonthTabs = createMemo((): Tab<string>[] =>
        MONTHS.slice(0, getItemCount()).map((month) => ({ value: month })),
    );

    const getExamples = createMemo(() => [
        {
            key: "split",
            name: EXAMPLE_NAMES.split,
            readout: () =>
                `${getItemCount()} items, ${Math.round(progressSignal[0]() * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
            component: () => <ChipsExample labels={getLabels} progress={progressSignal} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "bothButtonsEnd",
            name: EXAMPLE_NAMES.bothButtonsEnd,
            readout: () => "the same control with its buttons together instead of split",
            component: () => <ChipsExample labels={getLabels} buttonPlacement={"end"} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "bothButtonsStart",
            name: EXAMPLE_NAMES.bothButtonsStart,
            readout: () => "and the same pair on the other side",
            component: () => <ChipsExample labels={getLabels} buttonPlacement={"start"} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "tabbed",
            name: EXAMPLE_NAMES.tabbed,
            readout: () =>
                `selected: ${getSelectedMonth()} — a tab already fully in view does not move the strip, and one cut off by the edge scrolls into view whole`,
            component: () => (
                <TabbedExample
                    tabs={getMonthTabs}
                    selectedValue={getSelectedMonth}
                    onSelectionChange={setSelectedMonth}
                />
            ),
            path: `${EXAMPLES_ROOT}/Tabbed.tsx`,
        },
        {
            key: "focusableChildren",
            name: EXAMPLE_NAMES.focusableChildren,
            readout: () => "the track holds whatever it is given, and tabbing through pulls the strip along",
            component: () => <FocusableChildrenExample labels={getLabels} />,
            path: `${EXAMPLES_ROOT}/FocusableChildren.tsx`,
        },
    ]);

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"itemCount"}
                    label={"Item count"}
                    hint={"How many items sit in the scrolling strip."}
                    controls={"Sets the number of example items sent as Scroller's children"}
                >
                    <PageNumberField
                        value={getItemCount}
                        min={ScrollerKnobs.MIN_ITEM_COUNT}
                        max={ScrollerKnobs.MAX_ITEM_COUNT}
                        step={ScrollerKnobs.ITEM_COUNT_STEP}
                        ariaLabel={"Item count"}
                        onInput={setItemCount}
                    />
                </PageProp>

                <PageProp
                    key={"position"}
                    label={"First strip (%)"}
                    hint={"How far through its run the first strip is scrolled, as a percentage."}
                    controls={"Sets ScrollerProps.progress, shown as a percentage"}
                >
                    <PageNumberField
                        value={() => Math.round(progressSignal[0]() * PERCENT)}
                        min={ScrollerKnobs.MIN_POSITION}
                        max={PERCENT}
                        step={ScrollerKnobs.POSITION_STEP}
                        ariaLabel={"First strip position"}
                        onInput={(value) => progressSignal[1](value / PERCENT)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={400} />
        </div>
    );
};
