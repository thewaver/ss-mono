import { useState } from "react";

import { TILTER_DEFAULTS } from "@thewaver/ss-components-react";
import { TilterKnobs } from "@thewaver/ss-playground-core/App/Knobs/Tilters.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { CardExample } from "./Examples/Card";
import { PhotoExample } from "./Examples/Photo";
import type { TilterExampleProps } from "./TilterPageReact.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/TilterPage/Examples";

const FIELD_WIDTH = 110;
const BOX_HEIGHT = 240;

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
            name: "Card with a sheen",
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
            name: "Picture, no sheen",
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
                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the surface following the pointer and leaves it flat. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"smoothingMs"}
                    label={"Smoothing (ms)"}
                    hint={
                        "How long the surface takes to catch up with the pointer. At 0 it follows exactly; raised, it lags a quick movement and glides back flat when the pointer leaves."
                    }
                >
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

                <PageProp
                    itemKey={"activeRangePx"}
                    label={"Active range (px)"}
                    hint={
                        "How near the pointer has to be before the surface answers it at all, measured from the area's center. Outside it the surface lies flat."
                    }
                >
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

                <PageProp
                    itemKey={"tiltRangePx"}
                    label={"Tilt range (px)"}
                    hint={
                        "How far from the center the pointer starts to tip the surface. The turn is strongest at the surface's own edge and fades to nothing out at this distance."
                    }
                >
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

                <PageProp
                    itemKey={"maxTiltDegrees"}
                    label={"Max tilt (deg)"}
                    hint={"How far the surface turns when the pointer is at the very edge of the tilted area."}
                >
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

                <PageProp
                    itemKey={"perspectivePx"}
                    label={"Perspective (px)"}
                    hint={"How near the viewer sits. Smaller is a more violent perspective; larger flattens the turn."}
                >
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

                <PageProp
                    itemKey={"sheenOpacity"}
                    label={"Sheen opacity"}
                    hint={"How strong the highlight is. It belongs to the page rather than to the component."}
                >
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

                <PageProp
                    itemKey={"sheenSpreadPercent"}
                    label={"Sheen spread (%)"}
                    hint={"How wide the band of highlight is across the surface."}
                >
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
