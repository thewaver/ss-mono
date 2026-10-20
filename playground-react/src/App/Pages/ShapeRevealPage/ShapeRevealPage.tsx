import { useMemo, useState } from "react";

import { SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-react";
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
import { useAppliedTheme } from "../../PageComponents/Theme/ThemeReact.const";
import { ThemeCycleExample } from "./Examples/ThemeCycle";
import type { ShapeRevealExampleProps } from "./ShapeRevealExample.types";

export const ShapeRevealPage = () => {
    const [durationMs, setDurationMs] = useState(SHAPE_REVEAL_DEFAULTS.durationMs);
    const [delayMs, setDelayMs] = useState(ShapeRevealKnobs.STARTING_DELAY_MS);
    const [shape, setShape] = useState<ShapeRevealShape>(ShapeRevealKnobs.STARTING_SHAPE);
    const [softness, setSoftness] = useState(SHAPE_REVEAL_DEFAULTS.softness);
    const [startDegrees, setStartDegrees] = useState(SHAPE_REVEAL_DEFAULTS.startDegrees);
    const [endDegrees, setEndDegrees] = useState(ShapeRevealKnobs.STARTING_END_DEGREES);

    const appliedTheme = useAppliedTheme();

    const computePoints = useMemo(() => {
        if (shape === "circle") return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);
    }, [shape]);

    const commonProps: ShapeRevealExampleProps = {
        durationMs,
        delayMs,
        computePoints,
        softness,
        startDegrees,
        endDegrees,
    };

    const themeLabel = THEME_OPTIONS.find((option) => option.value === appliedTheme)?.label ?? appliedTheme;

    const examples = [
        {
            key: "themeCycle",
            name: EXAMPLE_NAMES.themeCycle,
            readout: () => `showing the ${themeLabel} theme`,
            component: () => <ThemeCycleExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/ThemeCycle.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"durationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long the circle takes to grow over the whole window. 0 switches the theme at once, as does the system's reduced-motion setting."
                    }
                    controls={"Sets ShapeRevealOpts.durationMs"}
                >
                    <PageNumberField
                        value={durationMs}
                        min={ShapeRevealKnobs.MIN_DURATION_MS}
                        max={ShapeRevealKnobs.MAX_DURATION_MS}
                        step={ShapeRevealKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"delayMs"}
                    label={"Delay (ms)"}
                    hint={"How long the new theme stays on screen, once the circle has covered it, before the next."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={delayMs}
                        min={ShapeRevealKnobs.MIN_DELAY_MS}
                        max={ShapeRevealKnobs.MAX_DELAY_MS}
                        step={ShapeRevealKnobs.DELAY_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Delay in milliseconds"}
                        onInput={setDelayMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"computePoints"}
                    label={"Shape"}
                    hint={
                        "The contour that grows over the window. A circle is what the reveal draws when none is given."
                    }
                    controls={"Picks the example contour sent to ShapeRevealOpts.computePoints"}
                >
                    <PageSelectField
                        value={shape}
                        values={ShapeRevealKnobs.SHAPES}
                        width={SHAPE_FIELD_WIDTH}
                        ariaLabel={"Shape"}
                        onChange={setShape}
                    />
                </PageProp>

                <PageProp
                    itemKey={"softness"}
                    label={"Softness"}
                    hint={
                        "How gradually the growing shape's edge fades, as a share of the distance it grows. 0 gives a hard edge."
                    }
                    controls={"Sets ShapeRevealOpts.softness"}
                >
                    <PageNumberField
                        value={softness}
                        min={ShapeRevealKnobs.MIN_SOFTNESS}
                        max={ShapeRevealKnobs.MAX_SOFTNESS}
                        step={ShapeRevealKnobs.SOFTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Softness"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"startDegrees"}
                    label={"Start angle (°)"}
                    hint={
                        "The shape's angle as it starts to grow, clockwise. With the end angle the same, the shape is only tilted. A circle looks the same at any angle."
                    }
                    controls={"Sets ShapeRevealOpts.startDegrees"}
                >
                    <PageNumberField
                        value={startDegrees}
                        min={ShapeRevealKnobs.MIN_DEGREES}
                        max={ShapeRevealKnobs.MAX_DEGREES}
                        step={ShapeRevealKnobs.DEGREES_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Start angle in degrees"}
                        onInput={setStartDegrees}
                    />
                </PageProp>

                <PageProp
                    itemKey={"endDegrees"}
                    label={"End angle (°)"}
                    hint={
                        "The shape's angle once it covers the window. It turns from the start angle to this one as it grows, on the reveal's own timing."
                    }
                    controls={"Sets ShapeRevealOpts.endDegrees"}
                >
                    <PageNumberField
                        value={endDegrees}
                        min={ShapeRevealKnobs.MIN_DEGREES}
                        max={ShapeRevealKnobs.MAX_DEGREES}
                        step={ShapeRevealKnobs.DEGREES_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"End angle in degrees"}
                        onInput={setEndDegrees}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
