import { useState } from "react";

import { Button, SPLIT_PANE_DEFAULTS } from "@thewaver/ss-components-react";
import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { BoundedExample } from "./Examples/Bounded";
import { CompareExample } from "./Examples/Compare";
import { CrampedExample } from "./Examples/Cramped";
import { PairExample } from "./Examples/Pair";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { StackedExample } from "./Examples/Stacked";
import { TripleExample } from "./Examples/Triple";
import type { SplitPaneExampleProps } from "./SplitPanePage.types";

const GUTTER_FIELD_WIDTH = 90;
const PERCENT = 100;
const EXAMPLES_ROOT = "/src/App/Pages/SplitPanePage/Examples";

const STARTING_PAIR = [0.3, 0.7];
const STARTING_RIGHT_TO_LEFT = [0.3, 0.7];
const STARTING_BOUNDED = [0.3, 0.7];
const STARTING_CRAMPED = [0.5, 0.5];
const STARTING_TRIPLE = [0.25, 0.5, 0.25];
const STARTING_COLUMN = [0.4, 0.6];
const STARTING_COMPARE = [0.5, 0.5];

const percent = (ratios: number[]) => ratios.map((ratio) => `${Math.round(ratio * PERCENT)}%`).join(" / ");

export const SplitPanePage = () => {
    const [gutterSize, setGutterSize] = useState(SPLIT_PANE_DEFAULTS.gutterSize);
    const [isDisabled, setIsDisabled] = useState(SplitPaneKnobs.STARTING_IS_DISABLED);

    const pairState = useState(STARTING_PAIR);
    const rightToLeftState = useState(STARTING_RIGHT_TO_LEFT);
    const boundedState = useState(STARTING_BOUNDED);
    const crampedState = useState(STARTING_CRAMPED);
    const tripleState = useState(STARTING_TRIPLE);
    const columnState = useState(STARTING_COLUMN);
    const compareState = useState(STARTING_COMPARE);

    const reset = () => {
        pairState[1](STARTING_PAIR);
        rightToLeftState[1](STARTING_RIGHT_TO_LEFT);
        boundedState[1](STARTING_BOUNDED);
        crampedState[1](STARTING_CRAMPED);
        tripleState[1](STARTING_TRIPLE);
        columnState[1](STARTING_COLUMN);
        compareState[1](STARTING_COMPARE);
    };

    const commonProps: Omit<SplitPaneExampleProps, "ratiosState"> = {
        gutterSize,
        isDisabled,
    };

    const examples = [
        {
            key: "pair",
            name: "Two panes",
            readout: () => `ratios: ${percent(pairState[0])} — drag the gutter or arrow it with the keyboard`,
            component: () => <PairExample {...commonProps} ratiosState={pairState} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `ratios: ${percent(rightToLeftState[0])} — the box around the panes sets dir="rtl", so the first pane sits on the right and the gutter follows the pointer and the arrow keys from that side`,
            component: () => <RightToLeftExample {...commonProps} ratiosState={rightToLeftState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded panes",
            readout: () =>
                `ratios: ${percent(boundedState[0])} — the first pane is held between 120px and 220px whatever the ratio says`,
            component: () => <BoundedExample {...commonProps} ratiosState={boundedState} />,
            path: `${EXAMPLES_ROOT}/Bounded.tsx`,
        },
        {
            key: "triple",
            name: "Three panes",
            readout: () => `ratios: ${percent(tripleState[0])} — a gutter moves its two neighbors and nothing else`,
            component: () => <TripleExample {...commonProps} ratiosState={tripleState} />,
            path: `${EXAMPLES_ROOT}/Triple.tsx`,
        },
        {
            key: "stacked",
            name: "Stacked",
            readout: () => `ratios: ${percent(columnState[0])} — the same control on the other axis`,
            component: () => <StackedExample {...commonProps} ratiosState={columnState} />,
            path: `${EXAMPLES_ROOT}/Stacked.tsx`,
        },
        {
            key: "compare",
            name: "Two pictures",
            readout: () =>
                `ratios: ${percent(compareState[0])} — both pictures are drawn at the full width of the frame, so the gutter wipes between them instead of squeezing them`,
            component: () => <CompareExample {...commonProps} ratiosState={compareState} />,
            path: `${EXAMPLES_ROOT}/Compare.tsx`,
        },
        {
            key: "cramped",
            name: "Minimums that do not fit",
            readout: () =>
                `minimums of 250px and 400px in a box too narrow for both — grid honors the floors and lets the row overflow, which is the behavior this control inherits rather than fights`,
            component: () => <CrampedExample {...commonProps} ratiosState={crampedState} />,
            path: `${EXAMPLES_ROOT}/Cramped.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"gutterSize"}
                    label={"Gutter size (px)"}
                    hint={"How wide the draggable divider between two panes is."}
                >
                    <PageNumberField
                        value={gutterSize}
                        min={SplitPaneKnobs.MIN_GUTTER}
                        max={SplitPaneKnobs.MAX_GUTTER}
                        step={SplitPaneKnobs.GUTTER_STEP}
                        width={GUTTER_FIELD_WIDTH}
                        ariaLabel={"Gutter size in pixels"}
                        onInput={setGutterSize}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the dividers off, so the panes keep the sizes they have."}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"ratios"}
                    label={"Ratios"}
                    hint={"Puts the panes back to the sizes they started at."}
                >
                    <Button
                        renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={400} />
        </>
    );
};
