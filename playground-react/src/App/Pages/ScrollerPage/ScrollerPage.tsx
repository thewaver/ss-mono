import { useMemo, useState } from "react";

import type { Tab } from "@thewaver/ss-components-react";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ChipsExample } from "./Examples/Chips";
import { FocusableChildrenExample } from "./Examples/FocusableChildren";
import { TabbedExample } from "./Examples/Tabbed";

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

export const ScrollerPage = () => {
    const [itemCount, setItemCount] = useState(ScrollerKnobs.STARTING_ITEM_COUNT);
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
    const progressState = useState(0);

    const labels = useMemo(() => Array.from({ length: itemCount }, (_, index) => `Item ${index + 1}`), [itemCount]);

    const monthTabs = useMemo(
        (): Tab<string>[] => MONTHS.slice(0, itemCount).map((month) => ({ value: month })),
        [itemCount],
    );

    const examples = [
        {
            key: "split",
            name: "One button at each end",
            readout: () =>
                `${itemCount} items, ${Math.round(progressState[0] * PERCENT)}% along — the buttons stop at the ends rather than wrapping round, and leave altogether once everything fits`,
            component: () => <ChipsExample labels={labels} progressState={progressState} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "bothButtonsEnd",
            name: "Both buttons at the end",
            readout: () => "the same control with its buttons together instead of split",
            component: () => <ChipsExample labels={labels} buttonPlacement={"end"} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "bothButtonsStart",
            name: "Both buttons at the start",
            readout: () => "and the same pair on the other side",
            component: () => <ChipsExample labels={labels} buttonPlacement={"start"} />,
            path: `${EXAMPLES_ROOT}/Chips.tsx`,
        },
        {
            key: "tabbed",
            name: "Focus reveals what it lands on",
            readout: () =>
                `selected: ${selectedMonth} — a tab already fully in view does not move the strip, and one cut off by the edge scrolls into view whole`,
            component: () => (
                <TabbedExample tabs={monthTabs} selectedValue={selectedMonth} onSelectionChange={setSelectedMonth} />
            ),
            path: `${EXAMPLES_ROOT}/Tabbed.tsx`,
        },
        {
            key: "focusableChildren",
            name: "Focusable children of any kind",
            readout: () => "the track holds whatever it is given, and tabbing through pulls the strip along",
            component: () => <FocusableChildrenExample labels={labels} />,
            path: `${EXAMPLES_ROOT}/FocusableChildren.tsx`,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"itemCount"}
                    label={"Item count"}
                    hint={"How many items sit in the scrolling strip."}
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
                    itemKey={"position"}
                    label={"First strip (%)"}
                    hint={"How far through its run the first strip is scrolled, as a percentage."}
                >
                    <PageNumberField
                        value={Math.round(progressState[0] * PERCENT)}
                        min={ScrollerKnobs.MIN_POSITION}
                        max={PERCENT}
                        step={ScrollerKnobs.POSITION_STEP}
                        ariaLabel={"First strip position"}
                        onInput={(value) => progressState[1](value / PERCENT)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={400} />
        </div>
    );
};
