import { useState } from "react";

import { FITTED_TEXT_DEFAULTS } from "@thewaver/ss-components-react";
import { FittedTextKnobs } from "@thewaver/ss-playground/App/Knobs/FittedTexts.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PosterExample } from "./Examples/Poster";
import { StackExample } from "./Examples/Stack";

const EXAMPLES_ROOT = "/src/App/Pages/FittedTextPage/Examples";

const WIDE_SPAN = 2;

export const FittedTextPage = () => {
    const [lineHeightRatio, setLineHeightRatio] = useState(FITTED_TEXT_DEFAULTS.lineHeightRatio);

    const examples = [
        {
            key: "poster",
            name: "A poster",
            span: WIDE_SPAN,
            readout: () =>
                "every line is scaled to the full width, then the stack shrinks as one until it fits the height, so the shortest line comes out the largest; resize the window and it fits again",
            component: () => <PosterExample lineHeightRatio={lineHeightRatio} />,
            path: `${EXAMPLES_ROOT}/Poster.tsx`,
        },
        {
            key: "stack",
            name: "A narrow box",
            readout: () =>
                "in a box this narrow the width runs out before the height does, so nothing has to shrink to fit and the lines keep their full-width sizes",
            component: () => <StackExample lineHeightRatio={lineHeightRatio} />,
            path: `${EXAMPLES_ROOT}/Stack.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"lineHeightRatio"}
                    label={"Line height"}
                    hint={
                        "Each line's height as a multiple of its own font size, which is the room the stack is fitted with."
                    }
                >
                    <PageNumberField
                        value={lineHeightRatio}
                        min={FittedTextKnobs.MIN_LINE_HEIGHT_RATIO}
                        max={FittedTextKnobs.MAX_LINE_HEIGHT_RATIO}
                        step={FittedTextKnobs.LINE_HEIGHT_RATIO_STEP}
                        ariaLabel={"Line height"}
                        onInput={setLineHeightRatio}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
