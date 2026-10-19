import { useMemo, useState } from "react";

import { REVEAL_DEFAULTS } from "@thewaver/ss-components-react";
import { RevealKnobs } from "@thewaver/ss-playground/App/Knobs/Reveals.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    SHAPE_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.const";
import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { FrostedExample } from "./Examples/Frosted";
import { PromptExample } from "./Examples/Prompt";
import { TorchExample } from "./Examples/Torch";
import type { RevealExampleProps } from "./RevealExample.types";

export const RevealPage = () => {
    const [radius, setRadius] = useState(REVEAL_DEFAULTS.radius);
    const [shape, setShape] = useState<RevealShape>(RevealKnobs.STARTING_SHAPE);
    const [joinRadius, setJoinRadius] = useState(RevealKnobs.STARTING_JOIN_RADIUS);
    const [lameExponent, setLameExponent] = useState(RevealKnobs.STARTING_LAME_EXPONENT);
    const [softness, setSoftness] = useState(REVEAL_DEFAULTS.softness);
    const [stepSize, setStepSize] = useState(REVEAL_DEFAULTS.stepSize);
    const [isDisabled, setIsDisabled] = useState(RevealKnobs.STARTING_IS_DISABLED);

    const computePoints = useMemo(() => {
        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    }, [shape]);

    const joinRadii = useMemo(() => [joinRadius], [joinRadius]);
    const lameExponents = useMemo(() => [lameExponent], [lameExponent]);

    const commonProps: RevealExampleProps = {
        radius,
        softness,
        stepSize,
        joinRadii,
        lameExponents,
        isDisabled,
        computePoints,
    };

    const examples = [
        {
            key: "torch",
            name: EXAMPLE_NAMES.torch,
            readout: () => "an opaque cover with a hole cut where the pointer is",
            component: () => <TorchExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Torch.tsx`,
        },
        {
            key: "frosted",
            name: EXAMPLE_NAMES.frosted,
            readout: () => "the cover blurs rather than hides, so the hole sharpens instead of uncovering",
            component: () => <FrostedExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Frosted.tsx`,
        },
        {
            key: "prompt",
            name: EXAMPLE_NAMES.prompt,
            readout: () => "the cover is told whether a reveal is happening, and says something different",
            component: () => <PromptExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Prompt.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"radius"}
                    label={"Radius (px)"}
                    hint={"How large the window that follows the pointer is."}
                    controls={"Sets RevealProps.radius"}
                >
                    <PageNumberField
                        value={radius}
                        min={RevealKnobs.MIN_RADIUS}
                        max={RevealKnobs.MAX_RADIUS}
                        step={RevealKnobs.RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp
                    itemKey={"computePoints"}
                    label={"Shape"}
                    hint={"The contour of the window that follows the pointer."}
                    controls={"Picks the example contour sent to RevealProps.computePoints"}
                >
                    <PageSelectField
                        value={shape}
                        values={RevealKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={setShape}
                    />
                </PageProp>

                <PageProp
                    itemKey={"joinRadii"}
                    label={"Corner radius (px)"}
                    hint={
                        "How far the window's corners are rounded. A circular window has no corners, so it is off then."
                    }
                    controls={"Sets every corner of RevealProps.joinRadii"}
                >
                    <PageNumberField
                        value={joinRadius}
                        min={RevealKnobs.MIN_JOIN_RADIUS}
                        max={RevealKnobs.MAX_JOIN_RADIUS}
                        step={RevealKnobs.JOIN_RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>

                <PageProp
                    itemKey={"lameExponents"}
                    label={"Lamé Exponent"}
                    hint={
                        "How square or how pinched the window's rounded corners are: 2 is a circular round, higher is squarer."
                    }
                    controls={"Sets every corner of RevealProps.lameExponents"}
                >
                    <PageNumberField
                        value={lameExponent}
                        min={RevealKnobs.MIN_LAME_EXPONENT}
                        max={RevealKnobs.MAX_LAME_EXPONENT}
                        step={RevealKnobs.LAME_EXPONENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp
                    itemKey={"softness"}
                    label={"Softness"}
                    hint={"How gradually the window fades into what is still covered. 0 gives a hard edge."}
                    controls={"Sets RevealProps.softness"}
                >
                    <PageNumberField
                        value={softness}
                        min={RevealKnobs.MIN_SOFTNESS}
                        max={RevealKnobs.MAX_SOFTNESS}
                        step={RevealKnobs.SOFTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"stepSize"}
                    label={"Step size (px)"}
                    hint={
                        "How far one press of an arrow key moves the window. Tab to a reveal and it opens at the center; the arrow keys move it from there."
                    }
                    controls={"Sets RevealProps.stepSize"}
                >
                    <PageNumberField
                        value={stepSize}
                        min={RevealKnobs.MIN_STEP_SIZE}
                        max={RevealKnobs.MAX_STEP_SIZE}
                        step={RevealKnobs.STEP_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Step size in pixels"}
                        onInput={setStepSize}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the window following the pointer or the keyboard, leaving whatever is underneath covered."
                    }
                    controls={"Sets RevealProps.isDisabled"}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
