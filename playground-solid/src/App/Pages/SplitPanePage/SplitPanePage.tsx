import { createMemo, createSignal } from "solid-js";

import { Button, SPLIT_PANE_DEFAULTS } from "@thewaver/ss-components-solid";
import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    GUTTER_FIELD_WIDTH,
    PERCENT,
    STARTING_BOUNDED,
    STARTING_COLUMN,
    STARTING_COMPARE,
    STARTING_CRAMPED,
    STARTING_PAIR,
    STARTING_RIGHT_TO_LEFT,
    STARTING_TRIPLE,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

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

const percent = (ratios: number[]) => ratios.map((ratio) => `${Math.round(ratio * PERCENT)}%`).join(" / ");

export const SplitPanePage = () => {
    const [getGutterSize, setGutterSize] = createSignal(SPLIT_PANE_DEFAULTS.gutterSize);
    const [getIsDisabled, setIsDisabled] = createSignal(SplitPaneKnobs.STARTING_IS_DISABLED);

    const pairSignal = createSignal(STARTING_PAIR);
    const rightToLeftSignal = createSignal(STARTING_RIGHT_TO_LEFT);
    const boundedSignal = createSignal(STARTING_BOUNDED);
    const crampedSignal = createSignal(STARTING_CRAMPED);
    const tripleSignal = createSignal(STARTING_TRIPLE);
    const columnSignal = createSignal(STARTING_COLUMN);
    const compareSignal = createSignal(STARTING_COMPARE);

    const reset = () => {
        pairSignal[1](STARTING_PAIR);
        rightToLeftSignal[1](STARTING_RIGHT_TO_LEFT);
        boundedSignal[1](STARTING_BOUNDED);
        crampedSignal[1](STARTING_CRAMPED);
        tripleSignal[1](STARTING_TRIPLE);
        columnSignal[1](STARTING_COLUMN);
        compareSignal[1](STARTING_COMPARE);
    };

    const getExamples = createMemo(() => {
        const commonProps: Omit<SplitPaneExampleProps, "ratios"> = {
            gutterSize: getGutterSize,
            isDisabled: getIsDisabled,
        };

        return [
            {
                key: "pair",
                name: EXAMPLE_NAMES.pair,
                readout: () => `ratios: ${percent(pairSignal[0]())} — drag the gutter or arrow it with the keyboard`,
                component: () => <PairExample {...commonProps} ratios={pairSignal} />,
                path: `${EXAMPLES_ROOT}/Pair.tsx`,
            },
            {
                key: "rightToLeft",
                name: EXAMPLE_NAMES.rightToLeft,
                readout: () =>
                    `ratios: ${percent(rightToLeftSignal[0]())} — the box around the panes sets dir="rtl", so the first pane sits on the right and the gutter follows the pointer and the arrow keys from that side`,
                component: () => <RightToLeftExample {...commonProps} ratios={rightToLeftSignal} />,
                path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
            },
            {
                key: "bounded",
                name: EXAMPLE_NAMES.bounded,
                readout: () =>
                    `ratios: ${percent(boundedSignal[0]())} — the first pane is held between 120px and 220px whatever the ratio says`,
                component: () => <BoundedExample {...commonProps} ratios={boundedSignal} />,
                path: `${EXAMPLES_ROOT}/Bounded.tsx`,
            },
            {
                key: "triple",
                name: EXAMPLE_NAMES.triple,
                readout: () =>
                    `ratios: ${percent(tripleSignal[0]())} — a gutter moves its two neighbors and nothing else`,
                component: () => <TripleExample {...commonProps} ratios={tripleSignal} />,
                path: `${EXAMPLES_ROOT}/Triple.tsx`,
            },
            {
                key: "stacked",
                name: EXAMPLE_NAMES.stacked,
                readout: () => `ratios: ${percent(columnSignal[0]())} — the same control on the other axis`,
                component: () => <StackedExample {...commonProps} ratios={columnSignal} />,
                path: `${EXAMPLES_ROOT}/Stacked.tsx`,
            },
            {
                key: "compare",
                name: EXAMPLE_NAMES.compare,
                readout: () =>
                    `ratios: ${percent(compareSignal[0]())} — both pictures are drawn at the full width of the frame, so the gutter wipes between them instead of squeezing them`,
                component: () => <CompareExample {...commonProps} ratios={compareSignal} />,
                path: `${EXAMPLES_ROOT}/Compare.tsx`,
            },
            {
                key: "cramped",
                name: EXAMPLE_NAMES.cramped,
                readout: () =>
                    `minimums of 250px and 400px in a box too narrow for both — grid honors the floors and lets the row overflow, which is the behavior this control inherits rather than fights`,
                component: () => <CrampedExample {...commonProps} ratios={crampedSignal} />,
                path: `${EXAMPLES_ROOT}/Cramped.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"gutterSize"}
                    label={"Gutter size (px)"}
                    hint={"How wide the draggable divider between two panes is."}
                >
                    <PageNumberField
                        value={getGutterSize}
                        min={() => SplitPaneKnobs.MIN_GUTTER}
                        max={() => SplitPaneKnobs.MAX_GUTTER}
                        step={() => SplitPaneKnobs.GUTTER_STEP}
                        width={() => GUTTER_FIELD_WIDTH}
                        ariaLabel={"Gutter size in pixels"}
                        onInput={setGutterSize}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the dividers off, so the panes keep the sizes they have."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp key={"ratios"} label={"Ratios"} hint={"Puts the panes back to the sizes they started at."}>
                    <Button
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={400} />
        </>
    );
};
