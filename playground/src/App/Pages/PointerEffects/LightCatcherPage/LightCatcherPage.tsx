import { createMemo, createSignal } from "solid-js";

import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components";

import { LightCatcherKnobs } from "../../../Knobs/LightCatchers.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PanelExample } from "./Examples/Panel";
import { RowExample } from "./Examples/Row";
import type { LightCatcherExampleProps } from "./LightCatcherPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/LightCatcherPage/Examples";

const FIELD_WIDTH = 110;
const BOX_HEIGHT = 200;
const ROW_SPAN = 2;

export const LightCatcherPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(LightCatcherKnobs.STARTING_IS_DISABLED);
    const [getSmoothingMs, setSmoothingMs] = createSignal(LIGHT_CATCHER_DEFAULTS.smoothingMs);
    const [getActiveRangePx, setActiveRangePx] = createSignal(LightCatcherKnobs.STARTING_ACTIVE_RANGE_PX);
    const [getLightRangePx, setLightRangePx] = createSignal(LIGHT_CATCHER_DEFAULTS.lightRangePx);
    const [getMaxBrightness, setMaxBrightness] = createSignal(LIGHT_CATCHER_DEFAULTS.maxBrightness);
    const [getRestingBrightness, setRestingBrightness] = createSignal(LIGHT_CATCHER_DEFAULTS.restingBrightness);
    const [getMaxLightness, setMaxLightness] = createSignal(LIGHT_CATCHER_DEFAULTS.maxLightness);
    const [getRestingLightness, setRestingLightness] = createSignal(LIGHT_CATCHER_DEFAULTS.restingLightness);

    const getExamples = createMemo(() => {
        const commonProps: LightCatcherExampleProps = {
            isDisabled: getIsDisabled,
            activeRangePx: getActiveRangePx,
            smoothingMs: getSmoothingMs,
            lightRangePx: getLightRangePx,
            maxBrightness: getMaxBrightness,
            restingBrightness: getRestingBrightness,
            maxLightness: getMaxLightness,
            restingLightness: getRestingLightness,
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
                        "Stops the surface answering the pointer and leaves it at its resting brightness and lightness. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"smoothingMs"}
                    label={"Smoothing (ms)"}
                    hint={
                        "How long the light takes to catch up with the pointer. At 0 it follows exactly; raised, it glows on after the pointer and fades behind it."
                    }
                >
                    <PageNumberField
                        value={getSmoothingMs}
                        min={() => LightCatcherKnobs.MIN_SMOOTHING_MS}
                        max={() => LightCatcherKnobs.MAX_SMOOTHING_MS}
                        step={() => LightCatcherKnobs.SMOOTHING_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
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
                        min={() => LightCatcherKnobs.MIN_ACTIVE_RANGE_PX}
                        max={() => LightCatcherKnobs.MAX_ACTIVE_RANGE_PX}
                        step={() => LightCatcherKnobs.ACTIVE_RANGE_STEP_PX}
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
                        min={() => LightCatcherKnobs.MIN_LIGHT_RANGE_PX}
                        max={() => LightCatcherKnobs.MAX_LIGHT_RANGE_PX}
                        step={() => LightCatcherKnobs.LIGHT_RANGE_STEP_PX}
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
                        min={() => LightCatcherKnobs.MIN_BRIGHTNESS}
                        max={() => LightCatcherKnobs.MAX_BRIGHTNESS}
                        step={() => LightCatcherKnobs.BRIGHTNESS_STEP}
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
                        min={() => LightCatcherKnobs.MIN_BRIGHTNESS}
                        max={() => LightCatcherKnobs.MAX_BRIGHTNESS}
                        step={() => LightCatcherKnobs.BRIGHTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Resting brightness"}
                        onInput={setRestingBrightness}
                    />
                </PageProp>

                <PageProp
                    key={"maxLightness"}
                    label={"Max lightness"}
                    hint={
                        "How far the surface fades toward white with the pointer on it. 0 is untouched. Unlike brightness it lifts the dark parts most, and the two stack."
                    }
                >
                    <PageNumberField
                        value={getMaxLightness}
                        min={() => LightCatcherKnobs.MIN_LIGHTNESS}
                        max={() => LightCatcherKnobs.MAX_LIGHTNESS}
                        step={() => LightCatcherKnobs.LIGHTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Maximum lightness"}
                        onInput={setMaxLightness}
                    />
                </PageProp>

                <PageProp
                    key={"restingLightness"}
                    label={"Resting lightness"}
                    hint={"How far the surface fades toward white with nothing near it. 0 is untouched."}
                >
                    <PageNumberField
                        value={getRestingLightness}
                        min={() => LightCatcherKnobs.MIN_LIGHTNESS}
                        max={() => LightCatcherKnobs.MAX_LIGHTNESS}
                        step={() => LightCatcherKnobs.LIGHTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Resting lightness"}
                        onInput={setRestingLightness}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
