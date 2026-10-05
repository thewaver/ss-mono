import { createMemo, createSignal } from "solid-js";

import { PROXIMITY_TEXT_DEFAULTS } from "@thewaver/ss-components-solid";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import type { ProximityTextExampleProps } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.types";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BarrelExample } from "./Examples/Barrel";
import { PaintedExample } from "./Examples/Painted";
import { PointerExample } from "./Examples/Pointer";
import { WaveExample } from "./Examples/Wave";

const EXAMPLES_ROOT = "/src/App/Pages/ProximityTextPage/Examples";
const WIDE_SPAN = 2;

export const ProximityTextPage = () => {
    const [getReachPx, setReachPx] = createSignal(PROXIMITY_TEXT_DEFAULTS.reachPx);
    const [getIsDisabled, setIsDisabled] = createSignal(ProximityTextKnobs.STARTING_IS_DISABLED);

    const getExamples = createMemo(() => {
        const commonProps: ProximityTextExampleProps = { reachPx: getReachPx, isDisabled: getIsDisabled };

        return [
            {
                key: "pointer",
                name: "Following the pointer",
                span: WIDE_SPAN,
                readout: () =>
                    "each letter plays its keyframes held at how near the pointer is; the lines were wrapped for every letter at its heaviest, so the spare room sits at the end of each line while they rest",
                component: () => (
                    <PageMeasureBox width={() => ProximityTextKnobs.BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
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
                component: () => <WaveExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Wave.tsx`,
            },
            {
                key: "painted",
                name: "Painted",
                span: WIDE_SPAN,
                readout: () =>
                    "PaintedText inside draws the letters; each grows and pushes the rest of its line along, as plain text does, while the line breaks stay put",
                component: () => (
                    <PageMeasureBox width={() => ProximityTextKnobs.BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <PaintedExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Painted.tsx`,
            },
            {
                key: "barrel",
                name: "Inside a barrel",
                span: WIDE_SPAN,
                readout: () =>
                    "a point fixed to the middle of the box and measured up and down only, so every letter on a line answers it alike: a line closes up as it reaches the middle and spreads apart again towards either edge, its keyframes running from spread to closed; the lines were wrapped with every letter at its widest, which here is the first frame, so no word jumps from one line to the next as they spread",
                component: () => (
                    <PageMeasureBox width={() => ProximityTextKnobs.BOX_WIDTH}>
                        <BarrelExample isDisabled={getIsDisabled} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Barrel.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"reachPx"}
                    label={"Reach (px)"}
                    hint={"How far from a letter's middle the point still reaches it. Past it, the letter rests."}
                >
                    <PageNumberField
                        value={getReachPx}
                        min={() => ProximityTextKnobs.MIN_REACH_PX}
                        max={() => ProximityTextKnobs.MAX_REACH_PX}
                        step={() => ProximityTextKnobs.REACH_STEP_PX}
                        ariaLabel={"Reach in pixels"}
                        onInput={setReachPx}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Rests every letter and stops following the point. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
