import { useState } from "react";

import { PROXIMITY_TEXT_DEFAULTS } from "@thewaver/ss-components-react";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PaintedExample } from "./Examples/Painted";
import { PointerExample } from "./Examples/Pointer";
import { WaveExample } from "./Examples/Wave";
import type { ProximityTextExampleProps } from "./ProximityTextPageReact.types";

const EXAMPLES_ROOT = "/src/App/Pages/ProximityTextPage/Examples";
const BOX_WIDTH = 360;
const WIDE_SPAN = 2;

export const ProximityTextPage = () => {
    const [reachPx, setReachPx] = useState(PROXIMITY_TEXT_DEFAULTS.reachPx);
    const [isDisabled, setIsDisabled] = useState(ProximityTextKnobs.STARTING_IS_DISABLED);

    const commonProps: ProximityTextExampleProps = { reachPx, isDisabled };

    const examples = [
        {
            key: "pointer",
            name: "Following the pointer",
            span: WIDE_SPAN,
            readout: () =>
                "each letter plays its keyframes held at how near the pointer is; the lines were wrapped for every letter at its heaviest, so the spare room sits at the end of each line while they rest",
            component: () => (
                <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                    <PointerExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Pointer.tsx`,
        },
        {
            key: "wave",
            name: "A weight wave",
            span: WIDE_SPAN,
            readout: () =>
                "a point supplied in place of the pointer, moved across the line on a clock; Stop is the way to halt it that a motion running on its own owes the reader",
            component: () => (
                <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                    <WaveExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Wave.tsx`,
        },
        {
            key: "painted",
            name: "Painted",
            span: WIDE_SPAN,
            readout: () =>
                "PaintedText inside draws the letters; each grows and pushes the rest of its line along, as plain text does, while the line breaks stay put",
            component: () => (
                <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                    <PaintedExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Painted.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"reachPx"}
                    label={"Reach (px)"}
                    hint={"How far from a letter's middle the point still reaches it. Past it, the letter rests."}
                >
                    <PageNumberField
                        value={reachPx}
                        min={ProximityTextKnobs.MIN_REACH_PX}
                        max={ProximityTextKnobs.MAX_REACH_PX}
                        step={ProximityTextKnobs.REACH_STEP_PX}
                        ariaLabel={"Reach in pixels"}
                        onInput={setReachPx}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Rests every letter and stops following the point. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
