import { createMemo, createSignal } from "solid-js";

import { SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-solid";
import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
import { THEME_OPTIONS } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    SHAPE_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
import type { ShapeRevealShape } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { getAppliedTheme } from "../../PageComponents/Theme/ThemeSolid.const";
import { ThemeCycleExample } from "./Examples/ThemeCycle";

const computeThemeLabel = () =>
    THEME_OPTIONS.find((option) => option.value === getAppliedTheme())?.label ?? getAppliedTheme();

export const ShapeRevealPage = () => {
    const [getDurationMs, setDurationMs] = createSignal(SHAPE_REVEAL_DEFAULTS.durationMs);
    const [getDelayMs, setDelayMs] = createSignal(ShapeRevealKnobs.STARTING_DELAY_MS);
    const [getShape, setShape] = createSignal<ShapeRevealShape>(ShapeRevealKnobs.STARTING_SHAPE);
    const [getSoftness, setSoftness] = createSignal(SHAPE_REVEAL_DEFAULTS.softness);
    const [getStartDegrees, setStartDegrees] = createSignal(SHAPE_REVEAL_DEFAULTS.startDegrees);
    const [getEndDegrees, setEndDegrees] = createSignal(ShapeRevealKnobs.STARTING_END_DEGREES);

    const getComputePoints = createMemo(() => {
        const shape = getShape();

        if (shape === "circle") return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    });

    const commonProps = {
        durationMs: getDurationMs,
        delayMs: getDelayMs,
        computePoints: getComputePoints,
        softness: getSoftness,
        startDegrees: getStartDegrees,
        endDegrees: getEndDegrees,
    };

    const getExamples = () => [
        {
            key: "themeCycle",
            name: EXAMPLE_NAMES.themeCycle,
            readout: () => `showing the ${computeThemeLabel()} theme`,
            component: () => <ThemeCycleExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/ThemeCycle.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"durationMs"} {...ShapeRevealKnobs.DURATION_MS_TEXT}>
                    <PageNumberField
                        value={getDurationMs}
                        min={ShapeRevealKnobs.MIN_DURATION_MS}
                        max={ShapeRevealKnobs.MAX_DURATION_MS}
                        step={ShapeRevealKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"delayMs"}
                    label={"Delay (ms)"}
                    hint={"How long the new theme stays on screen, once the circle has covered it, before the next."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={getDelayMs}
                        min={ShapeRevealKnobs.MIN_DELAY_MS}
                        max={ShapeRevealKnobs.MAX_DELAY_MS}
                        step={ShapeRevealKnobs.DELAY_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Delay in milliseconds"}
                        onInput={setDelayMs}
                    />
                </PageProp>

                <PageProp key={"computePoints"} {...ShapeRevealKnobs.COMPUTE_POINTS_TEXT}>
                    <PageSelectField
                        value={getShape}
                        values={ShapeRevealKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={setShape}
                    />
                </PageProp>

                <PageProp key={"softness"} {...ShapeRevealKnobs.SOFTNESS_TEXT}>
                    <PageNumberField
                        value={getSoftness}
                        min={ShapeRevealKnobs.MIN_SOFTNESS}
                        max={ShapeRevealKnobs.MAX_SOFTNESS}
                        step={ShapeRevealKnobs.SOFTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp key={"startDegrees"} {...ShapeRevealKnobs.START_DEGREES_TEXT}>
                    <PageNumberField
                        value={getStartDegrees}
                        min={ShapeRevealKnobs.MIN_DEGREES}
                        max={ShapeRevealKnobs.MAX_DEGREES}
                        step={ShapeRevealKnobs.DEGREES_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Start angle in degrees"}
                        onInput={setStartDegrees}
                    />
                </PageProp>

                <PageProp key={"endDegrees"} {...ShapeRevealKnobs.END_DEGREES_TEXT}>
                    <PageNumberField
                        value={getEndDegrees}
                        min={ShapeRevealKnobs.MIN_DEGREES}
                        max={ShapeRevealKnobs.MAX_DEGREES}
                        step={ShapeRevealKnobs.DEGREES_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"End angle in degrees"}
                        onInput={setEndDegrees}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
