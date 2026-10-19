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
                <PageProp
                    key={"durationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long the circle takes to grow over the whole window. 0 switches the theme at once, as does the system's reduced-motion setting."
                    }
                    controls={"Sets ShapeRevealOpts.durationMs"}
                >
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

                <PageProp
                    key={"computePoints"}
                    label={"Shape"}
                    hint={
                        "The contour that grows over the window. A circle is what the reveal draws when none is given."
                    }
                    controls={"Picks the example contour sent to ShapeRevealOpts.computePoints"}
                >
                    <PageSelectField
                        value={getShape}
                        values={ShapeRevealKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={setShape}
                    />
                </PageProp>

                <PageProp
                    key={"softness"}
                    label={"Softness"}
                    hint={
                        "How gradually the growing shape's edge fades, as a share of the distance it grows. 0 gives a hard edge."
                    }
                    controls={"Sets ShapeRevealOpts.softness"}
                >
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
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
