import { createMemo, createSignal } from "solid-js";

import { REVEAL_DEFAULTS } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { RevealKnobs } from "../../../Knobs/Reveals.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { FrostedExample } from "./Examples/Frosted";
import { PromptExample } from "./Examples/Prompt";
import { TorchExample } from "./Examples/Torch";
import type { RevealShape } from "./RevealPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/RevealPage/Examples";
const FIELD_WIDTH = 110;
const SHAPE_FIELD_WIDTH = 170;

export const RevealPage = () => {
    const [getRadius, setRadius] = createSignal(REVEAL_DEFAULTS.radius);
    const [getShape, setShape] = createSignal<RevealShape>(RevealKnobs.STARTING_SHAPE);
    const [getJoinRadius, setJoinRadius] = createSignal(RevealKnobs.STARTING_JOIN_RADIUS);
    const [getLameExponent, setLameExponent] = createSignal(RevealKnobs.STARTING_LAME_EXPONENT);
    const [getSoftness, setSoftness] = createSignal(REVEAL_DEFAULTS.softness);
    const [getStepSize, setStepSize] = createSignal(REVEAL_DEFAULTS.stepSize);
    const [getIsDisabled, setIsDisabled] = createSignal(RevealKnobs.STARTING_IS_DISABLED);

    const getIsCircle = createMemo(() => getShape() === RevealKnobs.CIRCLE);

    const getComputePoints = createMemo(() => {
        const shape = getShape();

        if (shape === RevealKnobs.CIRCLE) return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    });

    const getExamples = createMemo(() => {
        const commonProps = {
            radius: getRadius,
            softness: getSoftness,
            stepSize: getStepSize,
            joinRadii: () => [getJoinRadius()],
            lameExponents: () => [getLameExponent()],
            isDisabled: getIsDisabled,
            computePoints: getComputePoints,
        };

        return [
            {
                key: "torch",
                name: "Torch",
                readout: () => "an opaque cover with a hole cut where the pointer is",
                component: () => <TorchExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Torch.tsx`,
            },
            {
                key: "frosted",
                name: "Frosted",
                readout: () => "the cover blurs rather than hides, so the hole sharpens instead of uncovering",
                component: () => <FrostedExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Frosted.tsx`,
            },
            {
                key: "prompt",
                name: "Cover that knows",
                readout: () => "the cover is told whether a reveal is happening, and says something different",
                component: () => <PromptExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Prompt.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"radius"}
                    label={"Radius (px)"}
                    hint={"How large the window that follows the pointer is."}
                >
                    <PageNumberField
                        value={getRadius}
                        min={() => RevealKnobs.MIN_RADIUS}
                        max={() => RevealKnobs.MAX_RADIUS}
                        step={() => RevealKnobs.RADIUS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp
                    key={"computePoints"}
                    label={"Shape"}
                    hint={"The outline of the window that follows the pointer."}
                >
                    <PageSelectField
                        value={getShape}
                        values={() => RevealKnobs.SHAPES}
                        width={() => SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp
                    key={"joinRadii"}
                    label={"Corner radius (px)"}
                    hint={
                        "How far the window's corners are rounded. A circular window has no corners, so it is off then."
                    }
                >
                    <PageNumberField
                        value={getJoinRadius}
                        min={() => RevealKnobs.MIN_JOIN_RADIUS}
                        max={() => RevealKnobs.MAX_JOIN_RADIUS}
                        step={() => RevealKnobs.JOIN_RADIUS_STEP}
                        width={() => FIELD_WIDTH}
                        isDisabled={getIsCircle}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>

                <PageProp
                    key={"lameExponents"}
                    label={"Lamé Exponent"}
                    hint={
                        "How square or how pinched the window's rounded corners are: 2 is a circular round, higher is squarer."
                    }
                >
                    <PageNumberField
                        value={getLameExponent}
                        min={() => RevealKnobs.MIN_LAME_EXPONENT}
                        max={() => RevealKnobs.MAX_LAME_EXPONENT}
                        step={() => RevealKnobs.LAME_EXPONENT_STEP}
                        width={() => FIELD_WIDTH}
                        isDisabled={getIsCircle}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp
                    key={"softness"}
                    label={"Softness"}
                    hint={"How gradually the window fades into what is still covered. 0 gives a hard edge."}
                >
                    <PageNumberField
                        value={getSoftness}
                        min={() => RevealKnobs.MIN_SOFTNESS}
                        max={() => RevealKnobs.MAX_SOFTNESS}
                        step={() => RevealKnobs.SOFTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Clear fraction"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp
                    key={"stepSize"}
                    label={"Step size (px)"}
                    hint={
                        "How far one press of an arrow key moves the window. Tab to a reveal and it opens at the center; the arrow keys move it from there."
                    }
                >
                    <PageNumberField
                        value={getStepSize}
                        min={() => RevealKnobs.MIN_STEP_SIZE}
                        max={() => RevealKnobs.MAX_STEP_SIZE}
                        step={() => RevealKnobs.STEP_SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Step size in pixels"}
                        onInput={setStepSize}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the window following the pointer or the keyboard, leaving whatever is underneath covered."
                    }
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
