import { createMemo, createSignal } from "solid-js";

import { TILTER_DEFAULTS } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../../StyledComponents/Field/Field";
import { CardExample } from "./Examples/Card";
import { PhotoExample } from "./Examples/Photo";
import type { TilterExampleProps } from "./TilterPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/TilterPage/Examples";

const MIN_TILT_DEGREES = 0;
const MAX_TILT_DEGREES = 45;
const TILT_STEP_DEGREES = 1;

const MIN_PERSPECTIVE_PX = 200;
const MAX_PERSPECTIVE_PX = 3000;
const PERSPECTIVE_STEP_PX = 50;

const MIN_SHEEN_OPACITY = 0;
const MAX_SHEEN_OPACITY = 1;
const SHEEN_OPACITY_STEP = 0.05;
const STARTING_SHEEN_OPACITY = 0.8;

const MIN_SHEEN_SPREAD = 1;
const MAX_SHEEN_SPREAD = 50;
const SHEEN_SPREAD_STEP = 1;
const STARTING_SHEEN_SPREAD = 15;

const MIN_ACTIVE_RANGE_PX = 40;
const MAX_ACTIVE_RANGE_PX = 1200;
const ACTIVE_RANGE_STEP_PX = 20;
const STARTING_ACTIVE_RANGE_PX = 400;

const MIN_TILT_RANGE_PX = 40;
const MAX_TILT_RANGE_PX = 1200;
const TILT_RANGE_STEP_PX = 20;

const FIELD_WIDTH = 110;
const BOX_HEIGHT = 240;

export const TilterPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getActiveRangePx, setActiveRangePx] = createSignal(STARTING_ACTIVE_RANGE_PX);
    const [getTiltRangePx, setTiltRangePx] = createSignal(TILTER_DEFAULTS.tiltRangePx);
    const [getMaxTiltDegrees, setMaxTiltDegrees] = createSignal(TILTER_DEFAULTS.maxTiltDegrees);
    const [getPerspectivePx, setPerspectivePx] = createSignal(TILTER_DEFAULTS.perspectivePx);
    const [getSheenOpacity, setSheenOpacity] = createSignal(STARTING_SHEEN_OPACITY);
    const [getSheenSpreadPercent, setSheenSpreadPercent] = createSignal(STARTING_SHEEN_SPREAD);

    const getExamples = createMemo(() => {
        const commonProps: TilterExampleProps = {
            isDisabled: getIsDisabled,
            activeRangePx: getActiveRangePx,
            tiltRangePx: getTiltRangePx,
            maxTiltDegrees: getMaxTiltDegrees,
            perspectivePx: getPerspectivePx,
            sheenOpacity: getSheenOpacity,
            sheenSpreadPercent: getSheenSpreadPercent,
        };

        return [
            {
                key: "card",
                name: "Card with a sheen",
                readout: () =>
                    "the surface leans away from the pointer and the highlight runs the other way, which is what reads as a reflection",
                component: () => (
                    <PageMeasureBox isFilling height={() => BOX_HEIGHT}>
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
                    <PageMeasureBox isFilling height={() => BOX_HEIGHT}>
                        <PhotoExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Photo.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the surface following the pointer and leaves it flat. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"activeRangePx"}
                    label={"Active range (px)"}
                    hint={
                        "How near the pointer has to be before the surface answers it at all, measured from the area's center. Outside it the surface lies flat."
                    }
                >
                    <PageNumberField
                        value={getActiveRangePx}
                        min={() => MIN_ACTIVE_RANGE_PX}
                        max={() => MAX_ACTIVE_RANGE_PX}
                        step={() => ACTIVE_RANGE_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp
                    key={"tiltRangePx"}
                    label={"Tilt range (px)"}
                    hint={
                        "How far from the center the pointer starts to tip the surface. The turn is strongest at the surface's own edge and fades to nothing out at this distance."
                    }
                >
                    <PageNumberField
                        value={getTiltRangePx}
                        min={() => MIN_TILT_RANGE_PX}
                        max={() => MAX_TILT_RANGE_PX}
                        step={() => TILT_RANGE_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tilt range in pixels"}
                        onInput={setTiltRangePx}
                    />
                </PageProp>

                <PageProp
                    key={"maxTiltDegrees"}
                    label={"Max tilt (deg)"}
                    hint={"How far the surface turns when the pointer is at the very edge of the tilted area."}
                >
                    <PageNumberField
                        value={getMaxTiltDegrees}
                        min={() => MIN_TILT_DEGREES}
                        max={() => MAX_TILT_DEGREES}
                        step={() => TILT_STEP_DEGREES}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Maximum tilt in degrees"}
                        onInput={setMaxTiltDegrees}
                    />
                </PageProp>

                <PageProp
                    key={"perspectivePx"}
                    label={"Perspective (px)"}
                    hint={"How near the viewer sits. Smaller is a more violent perspective; larger flattens the turn."}
                >
                    <PageNumberField
                        value={getPerspectivePx}
                        min={() => MIN_PERSPECTIVE_PX}
                        max={() => MAX_PERSPECTIVE_PX}
                        step={() => PERSPECTIVE_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Perspective in pixels"}
                        onInput={setPerspectivePx}
                    />
                </PageProp>

                <PageProp
                    key={"sheenOpacity"}
                    label={"Sheen opacity"}
                    hint={"How strong the highlight is. It belongs to the page rather than to the component."}
                >
                    <PageNumberField
                        value={getSheenOpacity}
                        min={() => MIN_SHEEN_OPACITY}
                        max={() => MAX_SHEEN_OPACITY}
                        step={() => SHEEN_OPACITY_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Sheen opacity"}
                        onInput={setSheenOpacity}
                    />
                </PageProp>

                <PageProp
                    key={"sheenSpreadPercent"}
                    label={"Sheen spread (%)"}
                    hint={"How wide the band of highlight is across the surface."}
                >
                    <PageNumberField
                        value={getSheenSpreadPercent}
                        min={() => MIN_SHEEN_SPREAD}
                        max={() => MAX_SHEEN_SPREAD}
                        step={() => SHEEN_SPREAD_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Sheen spread in percent"}
                        onInput={setSheenSpreadPercent}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
