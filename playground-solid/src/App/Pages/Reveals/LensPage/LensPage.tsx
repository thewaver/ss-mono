import { createMemo, createSignal } from "solid-js";

import { LENS_DEFAULTS } from "@thewaver/ss-components-solid";
import { LensKnobs } from "@thewaver/ss-playground/App/Knobs/Lenses.const";
import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PhotoExample } from "./Examples/Photo";
import { PrintExample } from "./Examples/Print";

const EXAMPLES_ROOT = "/src/App/Pages/Reveals/LensPage/Examples";
const FIELD_WIDTH = 110;
const SHAPE_FIELD_WIDTH = 170;

export const LensPage = () => {
    const [getZoom, setZoom] = createSignal(LENS_DEFAULTS.zoom);
    const [getRadius, setRadius] = createSignal(LENS_DEFAULTS.radius);
    const [getShape, setShape] = createSignal<RevealShape>(LensKnobs.STARTING_SHAPE);
    const [getJoinRadius, setJoinRadius] = createSignal(LensKnobs.STARTING_JOIN_RADIUS);
    const [getLameExponent, setLameExponent] = createSignal(LensKnobs.STARTING_LAME_EXPONENT);
    const [getSoftness, setSoftness] = createSignal(LENS_DEFAULTS.softness);
    const [getStepSize, setStepSize] = createSignal(LENS_DEFAULTS.stepSize);
    const [getIsDisabled, setIsDisabled] = createSignal(LensKnobs.STARTING_IS_DISABLED);

    const getIsCircle = createMemo(() => getShape() === LensKnobs.CIRCLE);

    const getComputePoints = createMemo(() => {
        const shape = getShape();

        if (shape === LensKnobs.CIRCLE) return undefined;

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
                name: "Photo",
                readout: () => "a picture drawn larger inside a window that follows the pointer",
                component: () => <PhotoExample {...commonProps} computePoints={getComputePoints()} />,
                path: `${EXAMPLES_ROOT}/Photo.tsx`,
            },
            {
                key: "print",
                name: "Small print",
                readout: () => "the word under the middle of the lens is the word under the pointer",
                component: () => <PrintExample {...commonProps} computePoints={getComputePoints()} />,
                path: `${EXAMPLES_ROOT}/Print.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"zoom"}
                    label={"Zoom"}
                    hint={"How many times larger the content is drawn inside the lens. 1 draws it at its own size."}
                >
                    <PageNumberField
                        value={getZoom}
                        min={() => LensKnobs.MIN_ZOOM}
                        max={() => LensKnobs.MAX_ZOOM}
                        step={() => LensKnobs.ZOOM_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Zoom"}
                        onInput={setZoom}
                    />
                </PageProp>

                <PageProp key={"radius"} label={"Radius (px)"} hint={"How large the lens that follows the pointer is."}>
                    <PageNumberField
                        value={getRadius}
                        min={() => LensKnobs.MIN_RADIUS}
                        max={() => LensKnobs.MAX_RADIUS}
                        step={() => LensKnobs.RADIUS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp key={"computePoints"} label={"Shape"} hint={"The contour of the lens."}>
                    <PageSelectField
                        value={getShape}
                        values={() => LensKnobs.SHAPES}
                        width={() => SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp
                    key={"joinRadii"}
                    label={"Corner radius (px)"}
                    hint={"How far the lens's corners are rounded. A circular lens has no corners, so it is off then."}
                >
                    <PageNumberField
                        value={getJoinRadius}
                        min={() => LensKnobs.MIN_JOIN_RADIUS}
                        max={() => LensKnobs.MAX_JOIN_RADIUS}
                        step={() => LensKnobs.JOIN_RADIUS_STEP}
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
                        "How square or how pinched the lens's rounded corners are: 2 is a circular round, higher is squarer."
                    }
                >
                    <PageNumberField
                        value={getLameExponent}
                        min={() => LensKnobs.MIN_LAME_EXPONENT}
                        max={() => LensKnobs.MAX_LAME_EXPONENT}
                        step={() => LensKnobs.LAME_EXPONENT_STEP}
                        width={() => FIELD_WIDTH}
                        isDisabled={getIsCircle}
                        ariaLabel={"Corner style"}
                        onInput={setLameExponent}
                    />
                </PageProp>

                <PageProp
                    key={"softness"}
                    label={"Softness"}
                    hint={"How gradually the lens's edge fades into the content around it. 1 gives a hard edge."}
                >
                    <PageNumberField
                        value={getSoftness}
                        min={() => LensKnobs.MIN_SOFTNESS}
                        max={() => LensKnobs.MAX_SOFTNESS}
                        step={() => LensKnobs.SOFTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp
                    key={"stepSize"}
                    label={"Step size (px)"}
                    hint={
                        "How far one press of an arrow key moves the lens. Tab to a lens and it opens at the center; the arrow keys move it from there."
                    }
                >
                    <PageNumberField
                        value={getStepSize}
                        min={() => LensKnobs.MIN_STEP_SIZE}
                        max={() => LensKnobs.MAX_STEP_SIZE}
                        step={() => LensKnobs.STEP_SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Step size in pixels"}
                        onInput={setStepSize}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Stops the lens following the pointer or the keyboard, leaving the content as it is."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
