import { createMemo, createSignal } from "solid-js";

import { CORNER_PIN_DEFAULTS } from "@thewaver/ss-components-solid";
import { CornerPinKnobs } from "@thewaver/ss-playground/App/Knobs/CornerPins.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import type { CornerPinExampleProps } from "./CornerPinPageSolid.types";
import { CardExample } from "./Examples/Card";

export const CornerPinPage = () => {
    const [getReachRatio, setReachRatio] = createSignal(CORNER_PIN_DEFAULTS.reachRatio);

    const getExamples = createMemo(() => {
        const commonProps: CornerPinExampleProps = {
            reachRatio: getReachRatio,
        };

        return [
            {
                key: "card",
                name: EXAMPLE_NAMES.card,
                readout: () =>
                    "drag a grip, or tap one and then tap where it should go; Tab reaches each corner as two sliders, across and down, moved with the arrow keys",
                component: () => <CardExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Card.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"reachRatio"}
                    label={"Reach"}
                    hint={
                        "How far past each edge of the box a corner may be taken, as a share of the box. At 0 every corner stays on or inside the box, so the content can only be squeezed; above it, the content can be stretched beyond its own size too."
                    }
                    controls={"Sets CornerPinProps.reachRatio"}
                >
                    <PageNumberField
                        value={getReachRatio}
                        min={CornerPinKnobs.MIN_REACH_RATIO}
                        max={CornerPinKnobs.MAX_REACH_RATIO}
                        step={CornerPinKnobs.REACH_STEP_RATIO}
                        width={FIELD_WIDTH}
                        ariaLabel={"Reach as a share of the box"}
                        onInput={setReachRatio}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
