import { createMemo, createSignal } from "solid-js";

import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components-solid";
import { LightCatcherKnobs } from "@thewaver/ss-playground/App/Knobs/LightCatchers.const";
import {
    BOX_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    ROW_SPAN,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PanelExample } from "./Examples/Panel";
import { PlacedLightExample } from "./Examples/PlacedLight";
import { RowExample } from "./Examples/Row";
import type { LightCatcherExampleProps } from "./LightCatcherPageSolid.types";

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
                name: EXAMPLE_NAMES.panel,
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
                name: EXAMPLE_NAMES.row,
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
                name: EXAMPLE_NAMES.placed,
                span: ROW_SPAN,
                readout: () =>
                    "the slider puts one light across the whole row and every lamp answers to that same spot — the pointer is ignored, since a supplied point replaces it",
                component: () => <PlacedLightExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/PlacedLight.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"isDisabled"} {...LightCatcherKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp key={"smoothingMs"} {...LightCatcherKnobs.SMOOTHING_MS_TEXT}>
                    <PageNumberField
                        value={getSmoothingMs}
                        min={LightCatcherKnobs.MIN_SMOOTHING_MS}
                        max={LightCatcherKnobs.MAX_SMOOTHING_MS}
                        step={LightCatcherKnobs.SMOOTHING_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
                </PageProp>

                <PageProp key={"activeRangePx"} {...LightCatcherKnobs.ACTIVE_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={getActiveRangePx}
                        min={LightCatcherKnobs.MIN_ACTIVE_RANGE_PX}
                        max={LightCatcherKnobs.MAX_ACTIVE_RANGE_PX}
                        step={LightCatcherKnobs.ACTIVE_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp key={"lightRangePx"} {...LightCatcherKnobs.LIGHT_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={getLightRangePx}
                        min={LightCatcherKnobs.MIN_LIGHT_RANGE_PX}
                        max={LightCatcherKnobs.MAX_LIGHT_RANGE_PX}
                        step={LightCatcherKnobs.LIGHT_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Light range in pixels"}
                        onInput={setLightRangePx}
                    />
                </PageProp>

                <PageProp key={"maxBrightness"} {...LightCatcherKnobs.MAX_BRIGHTNESS_TEXT}>
                    <PageNumberField
                        value={getMaxBrightness}
                        min={LightCatcherKnobs.MIN_BRIGHTNESS}
                        max={LightCatcherKnobs.MAX_BRIGHTNESS}
                        step={LightCatcherKnobs.BRIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum brightness"}
                        onInput={setMaxBrightness}
                    />
                </PageProp>

                <PageProp key={"restingBrightness"} {...LightCatcherKnobs.RESTING_BRIGHTNESS_TEXT}>
                    <PageNumberField
                        value={getRestingBrightness}
                        min={LightCatcherKnobs.MIN_BRIGHTNESS}
                        max={LightCatcherKnobs.MAX_BRIGHTNESS}
                        step={LightCatcherKnobs.BRIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Resting brightness"}
                        onInput={setRestingBrightness}
                    />
                </PageProp>

                <PageProp key={"maxLightness"} {...LightCatcherKnobs.MAX_LIGHTNESS_TEXT}>
                    <PageNumberField
                        value={getMaxLightness}
                        min={LightCatcherKnobs.MIN_LIGHTNESS}
                        max={LightCatcherKnobs.MAX_LIGHTNESS}
                        step={LightCatcherKnobs.LIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum lightness"}
                        onInput={setMaxLightness}
                    />
                </PageProp>

                <PageProp key={"restingLightness"} {...LightCatcherKnobs.RESTING_LIGHTNESS_TEXT}>
                    <PageNumberField
                        value={getRestingLightness}
                        min={LightCatcherKnobs.MIN_LIGHTNESS}
                        max={LightCatcherKnobs.MAX_LIGHTNESS}
                        step={LightCatcherKnobs.LIGHTNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Resting lightness"}
                        onInput={setRestingLightness}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
