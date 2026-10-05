import { useState } from "react";

import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components-react";
import { LightCatcherKnobs } from "@thewaver/ss-playground/App/Knobs/LightCatchers.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PanelExample } from "./Examples/Panel";
import { PlacedLightExample } from "./Examples/PlacedLight";
import { RowExample } from "./Examples/Row";
import type { LightCatcherExampleProps } from "./LightCatcherPageReact.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/LightCatcherPage/Examples";

const FIELD_WIDTH = 110;
const BOX_HEIGHT = 200;
const ROW_SPAN = 2;

export const LightCatcherPage = () => {
    const [isDisabled, setIsDisabled] = useState(LightCatcherKnobs.STARTING_IS_DISABLED);
    const [smoothingMs, setSmoothingMs] = useState(LIGHT_CATCHER_DEFAULTS.smoothingMs);
    const [activeRangePx, setActiveRangePx] = useState(LightCatcherKnobs.STARTING_ACTIVE_RANGE_PX);
    const [lightRangePx, setLightRangePx] = useState(LIGHT_CATCHER_DEFAULTS.lightRangePx);
    const [maxBrightness, setMaxBrightness] = useState(LIGHT_CATCHER_DEFAULTS.maxBrightness);
    const [restingBrightness, setRestingBrightness] = useState(LIGHT_CATCHER_DEFAULTS.restingBrightness);
    const [maxLightness, setMaxLightness] = useState(LIGHT_CATCHER_DEFAULTS.maxLightness);
    const [restingLightness, setRestingLightness] = useState(LIGHT_CATCHER_DEFAULTS.restingLightness);

    const commonProps: LightCatcherExampleProps = {
        isDisabled,
        activeRangePx,
        smoothingMs,
        lightRangePx,
        maxBrightness,
        restingBrightness,
        maxLightness,
        restingLightness,
    };

    const examples = [
        {
            key: "panel",
            name: "One panel",
            readout: () => "brightest with the pointer on it, fading back to resting as the pointer walks out",
            component: () => (
                <PageMeasureBox isFilling height={BOX_HEIGHT}>
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
                <PageMeasureBox isFilling height={BOX_HEIGHT}>
                    <RowExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
        {
            key: "placed",
            name: "A light placed by hand",
            span: ROW_SPAN,
            readout: () =>
                "the slider puts one light across the whole row and every lamp answers to that same spot — the pointer is ignored, since a supplied point replaces it",
            component: () => <PlacedLightExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/PlacedLight.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the surface answering the pointer and leaves it at its resting brightness and lightness. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"smoothingMs"}
                    label={"Smoothing (ms)"}
                    hint={
                        "How long the light takes to catch up with the pointer. At 0 it follows exactly; raised, it glows on after the pointer and fades behind it."
                    }
                >
                    <PageNumberField
                        value={smoothingMs}
                        min={LightCatcherKnobs.MIN_SMOOTHING_MS}
                        max={LightCatcherKnobs.MAX_SMOOTHING_MS}
                        step={LightCatcherKnobs.SMOOTHING_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"activeRangePx"}
                    label={"Active range (px)"}
                    hint={
                        "How near the pointer has to be before the surface answers it at all, measured from its center. Outside it the surface sits at resting."
                    }
                >
                    <PageNumberField
                        value={activeRangePx}
                        min={LightCatcherKnobs.MIN_ACTIVE_RANGE_PX}
                        max={LightCatcherKnobs.MAX_ACTIVE_RANGE_PX}
                        step={LightCatcherKnobs.ACTIVE_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp
                    itemKey={"lightRangePx"}
                    label={"Light range (px)"}
                    hint={"How far the light reaches. Full brightness at the surface's own edge, resting out here."}
                >
                    <PageNumberField
                        value={lightRangePx}
                        min={LightCatcherKnobs.MIN_LIGHT_RANGE_PX}
                        max={LightCatcherKnobs.MAX_LIGHT_RANGE_PX}
                        step={LightCatcherKnobs.LIGHT_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Light range in pixels"}
                        onInput={setLightRangePx}
                    />
                </PageProp>

                <PageProp
                    itemKey={"maxBrightness"}
                    label={"Max brightness"}
                    hint={"How bright the surface is with the pointer on it. 1 is the content exactly as painted."}
                >
                    <PageNumberField
                        value={maxBrightness}
                        min={LightCatcherKnobs.MIN_BRIGHTNESS}
                        max={LightCatcherKnobs.MAX_BRIGHTNESS}
                        step={LightCatcherKnobs.BRIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum brightness"}
                        onInput={setMaxBrightness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"restingBrightness"}
                    label={"Resting brightness"}
                    hint={
                        "How bright the surface is with nothing near it. Below 1 it dims, which turns a row into a spotlight."
                    }
                >
                    <PageNumberField
                        value={restingBrightness}
                        min={LightCatcherKnobs.MIN_BRIGHTNESS}
                        max={LightCatcherKnobs.MAX_BRIGHTNESS}
                        step={LightCatcherKnobs.BRIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Resting brightness"}
                        onInput={setRestingBrightness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"maxLightness"}
                    label={"Max lightness"}
                    hint={
                        "How far the surface fades toward white with the pointer on it. 0 is untouched. Unlike brightness it lifts the dark parts most, and the two stack."
                    }
                >
                    <PageNumberField
                        value={maxLightness}
                        min={LightCatcherKnobs.MIN_LIGHTNESS}
                        max={LightCatcherKnobs.MAX_LIGHTNESS}
                        step={LightCatcherKnobs.LIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum lightness"}
                        onInput={setMaxLightness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"restingLightness"}
                    label={"Resting lightness"}
                    hint={"How far the surface fades toward white with nothing near it. 0 is untouched."}
                >
                    <PageNumberField
                        value={restingLightness}
                        min={LightCatcherKnobs.MIN_LIGHTNESS}
                        max={LightCatcherKnobs.MAX_LIGHTNESS}
                        step={LightCatcherKnobs.LIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Resting lightness"}
                        onInput={setRestingLightness}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
