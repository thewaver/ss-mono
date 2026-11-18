import { useState } from "react";

import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components-react";
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
import type { LightCatcherExampleProps } from "./LightCatcherPageReact.types";

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

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"isDisabled"} {...LightCatcherKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp itemKey={"smoothingMs"} {...LightCatcherKnobs.SMOOTHING_MS_TEXT}>
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

                <PageProp itemKey={"activeRangePx"} {...LightCatcherKnobs.ACTIVE_RANGE_PX_TEXT}>
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

                <PageProp itemKey={"lightRangePx"} {...LightCatcherKnobs.LIGHT_RANGE_PX_TEXT}>
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

                <PageProp itemKey={"maxBrightness"} {...LightCatcherKnobs.MAX_BRIGHTNESS_TEXT}>
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

                <PageProp itemKey={"restingBrightness"} {...LightCatcherKnobs.RESTING_BRIGHTNESS_TEXT}>
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

                <PageProp itemKey={"maxLightness"} {...LightCatcherKnobs.MAX_LIGHTNESS_TEXT}>
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

                <PageProp itemKey={"restingLightness"} {...LightCatcherKnobs.RESTING_LIGHTNESS_TEXT}>
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
