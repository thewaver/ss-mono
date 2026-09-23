import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../../StyledComponents/Field/Field";
import { PanelExample } from "./Examples/Panel";
import { RowExample } from "./Examples/Row";
import type { LightCatcherExampleProps } from "./LightCatcherPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/LightCatcherPage/Examples";

const MIN_ACTIVE_RANGE_PX = 40;
const MAX_ACTIVE_RANGE_PX = 1200;
const ACTIVE_RANGE_STEP_PX = 20;
const STARTING_ACTIVE_RANGE_PX = 1200;

const MIN_LIGHT_RANGE_PX = 40;
const MAX_LIGHT_RANGE_PX = 1200;
const LIGHT_RANGE_STEP_PX = 20;
const STARTING_LIGHT_RANGE_PX = 400;

const MIN_BRIGHTNESS = 0;
const MAX_BRIGHTNESS = 5;
const BRIGHTNESS_STEP = 0.05;
const STARTING_MAX_BRIGHTNESS = 2;
const STARTING_RESTING_BRIGHTNESS = 1;

const FIELD_WIDTH = 110;
const BOX_HEIGHT = 200;
const ROW_SPAN = 2;

export const LightCatcherPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getActiveRangePx, setActiveRangePx] = createSignal(STARTING_ACTIVE_RANGE_PX);
    const [getLightRangePx, setLightRangePx] = createSignal(STARTING_LIGHT_RANGE_PX);
    const [getMaxBrightness, setMaxBrightness] = createSignal(STARTING_MAX_BRIGHTNESS);
    const [getRestingBrightness, setRestingBrightness] = createSignal(STARTING_RESTING_BRIGHTNESS);

    const getExamples = createMemo(() => {
        const commonProps: LightCatcherExampleProps = {
            isDisabled: getIsDisabled,
            activeRangePx: getActiveRangePx,
            lightRangePx: getLightRangePx,
            maxBrightness: getMaxBrightness,
            restingBrightness: getRestingBrightness,
        };

        return [
            {
                key: "panel",
                name: "One panel",
                readout: () => "brightest with the pointer on it, fading back to resting as the pointer walks out",
                component: () => (
                    <PageMeasureBox isFilling height={() => BOX_HEIGHT}>
                        <PanelExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Panel.tsx`,
            },
            {
                key: "row",
                name: "A row of them",
                span: ROW_SPAN,
                readout: () =>
                    "five of them side by side, each reading the pointer against its own box — drop the resting brightness below 1 and the row becomes a spotlight",
                component: () => (
                    <PageMeasureBox isFilling height={() => BOX_HEIGHT}>
                        <RowExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Row.tsx`,
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
                        "Stops the surface answering the pointer and leaves it at its resting brightness. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"activeRangePx"}
                    label={"Active range (px)"}
                    hint={
                        "How near the pointer has to be before the surface answers it at all, measured from its center. Outside it the surface sits at resting."
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
                    key={"lightRangePx"}
                    label={"Light range (px)"}
                    hint={"How far the light reaches. Full brightness at the surface's own edge, resting out here."}
                >
                    <PageNumberField
                        value={getLightRangePx}
                        min={() => MIN_LIGHT_RANGE_PX}
                        max={() => MAX_LIGHT_RANGE_PX}
                        step={() => LIGHT_RANGE_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Light range in pixels"}
                        onInput={setLightRangePx}
                    />
                </PageProp>

                <PageProp
                    key={"maxBrightness"}
                    label={"Max brightness"}
                    hint={"How bright the surface is with the pointer on it. 1 is the content exactly as painted."}
                >
                    <PageNumberField
                        value={getMaxBrightness}
                        min={() => MIN_BRIGHTNESS}
                        max={() => MAX_BRIGHTNESS}
                        step={() => BRIGHTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Maximum brightness"}
                        onInput={setMaxBrightness}
                    />
                </PageProp>

                <PageProp
                    key={"restingBrightness"}
                    label={"Resting brightness"}
                    hint={
                        "How bright the surface is with nothing near it. Below 1 it dims, which turns a row into a spotlight."
                    }
                >
                    <PageNumberField
                        value={getRestingBrightness}
                        min={() => MIN_BRIGHTNESS}
                        max={() => MAX_BRIGHTNESS}
                        step={() => BRIGHTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Resting brightness"}
                        onInput={setRestingBrightness}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
