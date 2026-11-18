import { useMemo, useState } from "react";

import { LENS_DEFAULTS } from "@thewaver/ss-components-react";
import { LensKnobs } from "@thewaver/ss-playground/App/Knobs/Lenses.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    SHAPE_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.const";
import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PhotoExample } from "./Examples/Photo";
import { PrintExample } from "./Examples/Print";
import type { LensExampleProps } from "./LensPage.types";

export const LensPage = () => {
    const [zoom, setZoom] = useState(LENS_DEFAULTS.zoom);
    const [radius, setRadius] = useState(LENS_DEFAULTS.radius);
    const [shape, setShape] = useState<RevealShape>(LensKnobs.STARTING_SHAPE);
    const [joinRadius, setJoinRadius] = useState(LensKnobs.STARTING_JOIN_RADIUS);
    const [lameExponent, setLameExponent] = useState(LensKnobs.STARTING_LAME_EXPONENT);
    const [softness, setSoftness] = useState(LENS_DEFAULTS.softness);
    const [stepSize, setStepSize] = useState(LENS_DEFAULTS.stepSize);
    const [isDisabled, setIsDisabled] = useState(LensKnobs.STARTING_IS_DISABLED);

    const computePoints = useMemo(() => {
        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    }, [shape]);

    const joinRadii = useMemo(() => [joinRadius], [joinRadius]);
    const lameExponents = useMemo(() => [lameExponent], [lameExponent]);

    const commonProps: LensExampleProps = {
        zoom,
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
            key: "photo",
            name: EXAMPLE_NAMES.photo,
            readout: () => "a picture drawn larger inside a window that follows the pointer",
            component: () => <PhotoExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Photo.tsx`,
        },
        {
            key: "print",
            name: EXAMPLE_NAMES.print,
            readout: () => "the word under the middle of the lens is the word under the pointer",
            component: () => <PrintExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Print.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"zoom"} {...LensKnobs.ZOOM_TEXT}>
                    <PageNumberField
                        value={zoom}
                        min={LensKnobs.MIN_ZOOM}
                        max={LensKnobs.MAX_ZOOM}
                        step={LensKnobs.ZOOM_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Zoom"}
                        onInput={setZoom}
                    />
                </PageProp>

                <PageProp itemKey={"radius"} {...LensKnobs.RADIUS_TEXT}>
                    <PageNumberField
                        value={radius}
                        min={LensKnobs.MIN_RADIUS}
                        max={LensKnobs.MAX_RADIUS}
                        step={LensKnobs.RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp itemKey={"computePoints"} {...LensKnobs.COMPUTE_POINTS_TEXT}>
                    <PageSelectField
                        value={shape}
                        values={LensKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={setShape}
                    />
                </PageProp>

                <PageProp itemKey={"joinRadii"} {...LensKnobs.JOIN_RADII_TEXT}>
                    <PageNumberField
                        value={joinRadius}
                        min={LensKnobs.MIN_JOIN_RADIUS}
                        max={LensKnobs.MAX_JOIN_RADIUS}
                        step={LensKnobs.JOIN_RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>

                <PageProp itemKey={"lameExponents"} {...LensKnobs.LAME_EXPONENTS_TEXT}>
                    <PageNumberField
                        value={lameExponent}
                        min={LensKnobs.MIN_LAME_EXPONENT}
                        max={LensKnobs.MAX_LAME_EXPONENT}
                        step={LensKnobs.LAME_EXPONENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp itemKey={"softness"} {...LensKnobs.SOFTNESS_TEXT}>
                    <PageNumberField
                        value={softness}
                        min={LensKnobs.MIN_SOFTNESS}
                        max={LensKnobs.MAX_SOFTNESS}
                        step={LensKnobs.SOFTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp itemKey={"stepSize"} {...LensKnobs.STEP_SIZE_TEXT}>
                    <PageNumberField
                        value={stepSize}
                        min={LensKnobs.MIN_STEP_SIZE}
                        max={LensKnobs.MAX_STEP_SIZE}
                        step={LensKnobs.STEP_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Step size in pixels"}
                        onInput={setStepSize}
                    />
                </PageProp>

                <PageProp itemKey={"isDisabled"} {...LensKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
