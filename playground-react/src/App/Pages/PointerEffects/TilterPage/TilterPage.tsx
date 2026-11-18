import { useState } from "react";

import { TILTER_DEFAULTS } from "@thewaver/ss-components-react";
import { TilterKnobs } from "@thewaver/ss-playground/App/Knobs/Tilters.const";
import {
    BOX_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { CardExample } from "./Examples/Card";
import { PhotoExample } from "./Examples/Photo";
import type { TilterExampleProps } from "./TilterPageReact.types";

export const TilterPage = () => {
    const [isDisabled, setIsDisabled] = useState(TilterKnobs.STARTING_IS_DISABLED);
    const [smoothingMs, setSmoothingMs] = useState(TILTER_DEFAULTS.smoothingMs);
    const [activeRangePx, setActiveRangePx] = useState(TilterKnobs.STARTING_ACTIVE_RANGE_PX);
    const [tiltRangePx, setTiltRangePx] = useState(TILTER_DEFAULTS.tiltRangePx);
    const [maxTiltDegrees, setMaxTiltDegrees] = useState(TILTER_DEFAULTS.maxTiltDegrees);
    const [perspectivePx, setPerspectivePx] = useState(TILTER_DEFAULTS.perspectivePx);
    const [sheenOpacity, setSheenOpacity] = useState(TilterKnobs.STARTING_SHEEN_OPACITY);
    const [sheenSpreadPercent, setSheenSpreadPercent] = useState(TilterKnobs.STARTING_SHEEN_SPREAD);

    const commonProps: TilterExampleProps = {
        isDisabled,
        activeRangePx,
        smoothingMs,
        tiltRangePx,
        maxTiltDegrees,
        perspectivePx,
        sheenOpacity,
        sheenSpreadPercent,
    };

    const examples = [
        {
            key: "card",
            name: EXAMPLE_NAMES.card,
            readout: () =>
                "the surface leans away from the pointer and the highlight runs the other way, which is what reads as a reflection",
            component: () => (
                <PageMeasureBox isFilling height={BOX_HEIGHT}>
                    <CardExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Card.tsx`,
        },
        {
            key: "photo",
            name: EXAMPLE_NAMES.photo,
            readout: () => "the same wrapper with the sheen slot left out — nothing is painted over the content",
            component: () => (
                <PageMeasureBox isFilling height={BOX_HEIGHT}>
                    <PhotoExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Photo.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"isDisabled"} {...TilterKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp itemKey={"smoothingMs"} {...TilterKnobs.SMOOTHING_MS_TEXT}>
                    <PageNumberField
                        value={smoothingMs}
                        min={TilterKnobs.MIN_SMOOTHING_MS}
                        max={TilterKnobs.MAX_SMOOTHING_MS}
                        step={TilterKnobs.SMOOTHING_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
                </PageProp>

                <PageProp itemKey={"activeRangePx"} {...TilterKnobs.ACTIVE_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={activeRangePx}
                        min={TilterKnobs.MIN_ACTIVE_RANGE_PX}
                        max={TilterKnobs.MAX_ACTIVE_RANGE_PX}
                        step={TilterKnobs.ACTIVE_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp itemKey={"tiltRangePx"} {...TilterKnobs.TILT_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={tiltRangePx}
                        min={TilterKnobs.MIN_TILT_RANGE_PX}
                        max={TilterKnobs.MAX_TILT_RANGE_PX}
                        step={TilterKnobs.TILT_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Tilt range in pixels"}
                        onInput={setTiltRangePx}
                    />
                </PageProp>

                <PageProp itemKey={"maxTiltDegrees"} {...TilterKnobs.MAX_TILT_DEGREES_TEXT}>
                    <PageNumberField
                        value={maxTiltDegrees}
                        min={TilterKnobs.MIN_TILT_DEGREES}
                        max={TilterKnobs.MAX_TILT_DEGREES}
                        step={TilterKnobs.TILT_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum tilt in degrees"}
                        onInput={setMaxTiltDegrees}
                    />
                </PageProp>

                <PageProp itemKey={"perspectivePx"} {...TilterKnobs.PERSPECTIVE_PX_TEXT}>
                    <PageNumberField
                        value={perspectivePx}
                        min={TilterKnobs.MIN_PERSPECTIVE_PX}
                        max={TilterKnobs.MAX_PERSPECTIVE_PX}
                        step={TilterKnobs.PERSPECTIVE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Perspective in pixels"}
                        onInput={setPerspectivePx}
                    />
                </PageProp>

                <PageProp itemKey={"sheenOpacity"} {...TilterKnobs.SHEEN_OPACITY_TEXT}>
                    <PageNumberField
                        value={sheenOpacity}
                        min={TilterKnobs.MIN_SHEEN_OPACITY}
                        max={TilterKnobs.MAX_SHEEN_OPACITY}
                        step={TilterKnobs.SHEEN_OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Sheen opacity"}
                        onInput={setSheenOpacity}
                    />
                </PageProp>

                <PageProp itemKey={"sheenSpreadPercent"} {...TilterKnobs.SHEEN_SPREAD_PERCENT_TEXT}>
                    <PageNumberField
                        value={sheenSpreadPercent}
                        min={TilterKnobs.MIN_SHEEN_SPREAD}
                        max={TilterKnobs.MAX_SHEEN_SPREAD}
                        step={TilterKnobs.SHEEN_SPREAD_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Sheen spread in percent"}
                        onInput={setSheenSpreadPercent}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
