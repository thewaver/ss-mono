import { createMemo, createSignal } from "solid-js";

import { REVEAL_DEFAULTS } from "@thewaver/ss-components-solid";
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

export const RevealPage = () => {
    const [getRadius, setRadius] = createSignal(REVEAL_DEFAULTS.radius);
    const [getShape, setShape] = createSignal<RevealShape>(RevealKnobs.STARTING_SHAPE);
    const [getJoinRadius, setJoinRadius] = createSignal(RevealKnobs.STARTING_JOIN_RADIUS);
    const [getLameExponent, setLameExponent] = createSignal(RevealKnobs.STARTING_LAME_EXPONENT);
    const [getSoftness, setSoftness] = createSignal(REVEAL_DEFAULTS.softness);
    const [getStepSize, setStepSize] = createSignal(REVEAL_DEFAULTS.stepSize);
    const [getIsDisabled, setIsDisabled] = createSignal(RevealKnobs.STARTING_IS_DISABLED);

    const getComputePoints = createMemo(() => {
        const shape = getShape();

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
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"radius"} {...RevealKnobs.RADIUS_TEXT}>
                    <PageNumberField
                        value={getRadius}
                        min={RevealKnobs.MIN_RADIUS}
                        max={RevealKnobs.MAX_RADIUS}
                        step={RevealKnobs.RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp key={"computePoints"} {...RevealKnobs.COMPUTE_POINTS_TEXT}>
                    <PageSelectField
                        value={getShape}
                        values={RevealKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp key={"joinRadii"} {...RevealKnobs.JOIN_RADII_TEXT}>
                    <PageNumberField
                        value={getJoinRadius}
                        min={RevealKnobs.MIN_JOIN_RADIUS}
                        max={RevealKnobs.MAX_JOIN_RADIUS}
                        step={RevealKnobs.JOIN_RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>

                <PageProp key={"lameExponents"} {...RevealKnobs.LAME_EXPONENTS_TEXT}>
                    <PageNumberField
                        value={getLameExponent}
                        min={RevealKnobs.MIN_LAME_EXPONENT}
                        max={RevealKnobs.MAX_LAME_EXPONENT}
                        step={RevealKnobs.LAME_EXPONENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp key={"softness"} {...RevealKnobs.SOFTNESS_TEXT}>
                    <PageNumberField
                        value={getSoftness}
                        min={RevealKnobs.MIN_SOFTNESS}
                        max={RevealKnobs.MAX_SOFTNESS}
                        step={RevealKnobs.SOFTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp key={"stepSize"} {...RevealKnobs.STEP_SIZE_TEXT}>
                    <PageNumberField
                        value={getStepSize}
                        min={RevealKnobs.MIN_STEP_SIZE}
                        max={RevealKnobs.MAX_STEP_SIZE}
                        step={RevealKnobs.STEP_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Step size in pixels"}
                        onInput={setStepSize}
                    />
                </PageProp>

                <PageProp key={"isDisabled"} {...RevealKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
