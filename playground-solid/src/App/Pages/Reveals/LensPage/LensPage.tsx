import { createMemo, createSignal } from "solid-js";

import { LENS_DEFAULTS } from "@thewaver/ss-components-solid";
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

export const LensPage = () => {
    const [getZoom, setZoom] = createSignal(LENS_DEFAULTS.zoom);
    const [getRadius, setRadius] = createSignal(LENS_DEFAULTS.radius);
    const [getShape, setShape] = createSignal<RevealShape>(LensKnobs.STARTING_SHAPE);
    const [getJoinRadius, setJoinRadius] = createSignal(LensKnobs.STARTING_JOIN_RADIUS);
    const [getLameExponent, setLameExponent] = createSignal(LensKnobs.STARTING_LAME_EXPONENT);
    const [getSoftness, setSoftness] = createSignal(LENS_DEFAULTS.softness);
    const [getStepSize, setStepSize] = createSignal(LENS_DEFAULTS.stepSize);
    const [getIsDisabled, setIsDisabled] = createSignal(LensKnobs.STARTING_IS_DISABLED);

    const getComputePoints = createMemo(() => {
        const shape = getShape();

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    });

    const getExamples = createMemo(() => {
        const commonProps = {
            zoom: getZoom,
            radius: getRadius,
            softness: getSoftness,
            stepSize: getStepSize,
            joinRadii: () => [getJoinRadius()],
            lameExponents: () => [getLameExponent()],
            isDisabled: getIsDisabled,
        };

        return [
            {
                key: "photo",
                name: EXAMPLE_NAMES.photo,
                readout: () => "a picture drawn larger inside a window that follows the pointer",
                component: () => <PhotoExample {...commonProps} computePoints={getComputePoints()} />,
                path: `${EXAMPLES_ROOT}/Photo.tsx`,
            },
            {
                key: "print",
                name: EXAMPLE_NAMES.print,
                readout: () => "the word under the middle of the lens is the word under the pointer",
                component: () => <PrintExample {...commonProps} computePoints={getComputePoints()} />,
                path: `${EXAMPLES_ROOT}/Print.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"zoom"} {...LensKnobs.ZOOM_TEXT}>
                    <PageNumberField
                        value={getZoom}
                        min={LensKnobs.MIN_ZOOM}
                        max={LensKnobs.MAX_ZOOM}
                        step={LensKnobs.ZOOM_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Zoom"}
                        onInput={setZoom}
                    />
                </PageProp>

                <PageProp key={"radius"} {...LensKnobs.RADIUS_TEXT}>
                    <PageNumberField
                        value={getRadius}
                        min={LensKnobs.MIN_RADIUS}
                        max={LensKnobs.MAX_RADIUS}
                        step={LensKnobs.RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp key={"computePoints"} {...LensKnobs.COMPUTE_POINTS_TEXT}>
                    <PageSelectField
                        value={getShape}
                        values={LensKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp key={"joinRadii"} {...LensKnobs.JOIN_RADII_TEXT}>
                    <PageNumberField
                        value={getJoinRadius}
                        min={LensKnobs.MIN_JOIN_RADIUS}
                        max={LensKnobs.MAX_JOIN_RADIUS}
                        step={LensKnobs.JOIN_RADIUS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>

                <PageProp key={"lameExponents"} {...LensKnobs.LAME_EXPONENTS_TEXT}>
                    <PageNumberField
                        value={getLameExponent}
                        min={LensKnobs.MIN_LAME_EXPONENT}
                        max={LensKnobs.MAX_LAME_EXPONENT}
                        step={LensKnobs.LAME_EXPONENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp key={"softness"} {...LensKnobs.SOFTNESS_TEXT}>
                    <PageNumberField
                        value={getSoftness}
                        min={LensKnobs.MIN_SOFTNESS}
                        max={LensKnobs.MAX_SOFTNESS}
                        step={LensKnobs.SOFTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp key={"stepSize"} {...LensKnobs.STEP_SIZE_TEXT}>
                    <PageNumberField
                        value={getStepSize}
                        min={LensKnobs.MIN_STEP_SIZE}
                        max={LensKnobs.MAX_STEP_SIZE}
                        step={LensKnobs.STEP_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Step size in pixels"}
                        onInput={setStepSize}
                    />
                </PageProp>

                <PageProp key={"isDisabled"} {...LensKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
