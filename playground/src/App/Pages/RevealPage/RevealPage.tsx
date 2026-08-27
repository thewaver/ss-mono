import { createMemo, createSignal } from "solid-js";

import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { FrostedExample } from "./Examples/Frosted";
import { PromptExample } from "./Examples/Prompt";
import { TorchExample } from "./Examples/Torch";

const EXAMPLES_ROOT = "/src/App/Pages/RevealPage/Examples";
const CIRCLE = "circle";
const SHAPES = [CIRCLE, ...ShapeConst.DEFAULT_SHAPES] as const;

type RevealShape = (typeof SHAPES)[number];

const MIN_RADIUS = 20;
const MAX_RADIUS = 220;
const RADIUS_STEP = 10;
const MIN_JOIN_RADIUS = 0;
const MAX_JOIN_RADIUS = 120;
const JOIN_RADIUS_STEP = 5;
const MIN_LAME_EXPONENT = -5;
const MAX_LAME_EXPONENT = 5;
const LAME_EXPONENT_STEP = 0.5;
const MIN_SOFTNESS = 0;
const MAX_SOFTNESS = 1;
const SOFTNESS_STEP = 0.05;
const STARTING_RADIUS = 90;
const STARTING_SHAPE: RevealShape = CIRCLE;
const STARTING_JOIN_RADIUS = 0;
const STARTING_LAME_EXPONENT = 1;
const STARTING_SOFTNESS = 0.45;
const FIELD_WIDTH = 110;
const SHAPE_FIELD_WIDTH = 170;

export const RevealPage = () => {
    const [getRadius, setRadius] = createSignal(STARTING_RADIUS);
    const [getShape, setShape] = createSignal<RevealShape>(STARTING_SHAPE);
    const [getJoinRadius, setJoinRadius] = createSignal(STARTING_JOIN_RADIUS);
    const [getLameExponent, setLameExponent] = createSignal(STARTING_LAME_EXPONENT);
    const [getSoftness, setSoftness] = createSignal(STARTING_SOFTNESS);
    const [getIsDisabled, setIsDisabled] = createSignal(false);

    const getIsCircle = createMemo(() => getShape() === CIRCLE);

    const getComputePoints = createMemo(() => {
        const shape = getShape();

        if (shape === CIRCLE) return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    });

    const getExamples = createMemo(() => {
        const commonProps = {
            radius: getRadius,
            softness: getSoftness,
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
                <PageProp key={"radius"} label={"Radius (px)"}>
                    <PageNumberField
                        value={getRadius}
                        min={() => MIN_RADIUS}
                        max={() => MAX_RADIUS}
                        step={() => RADIUS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp key={"computePoints"} label={"Shape"}>
                    <PageSelectField
                        value={getShape}
                        values={() => SHAPES}
                        width={() => SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp key={"joinRadii"} label={"Corner radius (px)"}>
                    <PageNumberField
                        value={getJoinRadius}
                        min={() => MIN_JOIN_RADIUS}
                        max={() => MAX_JOIN_RADIUS}
                        step={() => JOIN_RADIUS_STEP}
                        width={() => FIELD_WIDTH}
                        isDisabled={getIsCircle}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>

                <PageProp key={"lameExponents"} label={"Lamé Exponent"}>
                    <PageNumberField
                        value={getLameExponent}
                        min={() => MIN_LAME_EXPONENT}
                        max={() => MAX_LAME_EXPONENT}
                        step={() => LAME_EXPONENT_STEP}
                        width={() => FIELD_WIDTH}
                        isDisabled={getIsCircle}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp key={"softness"} label={"Softness"}>
                    <PageNumberField
                        value={getSoftness}
                        min={() => MIN_SOFTNESS}
                        max={() => MAX_SOFTNESS}
                        step={() => SOFTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Clear fraction"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp key={"isDisabled"} label={"Disabled"}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
