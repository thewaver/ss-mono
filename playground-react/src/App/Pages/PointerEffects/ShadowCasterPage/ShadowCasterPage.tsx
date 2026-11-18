import { useState } from "react";

import { SHADOW_CASTER_DEFAULTS } from "@thewaver/ss-components-react";
import { ShadowCasterKnobs } from "@thewaver/ss-playground/App/Knobs/ShadowCasters.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { BadgeExample } from "./Examples/Badge";
import { CardExample } from "./Examples/Card";
import type { ShadowCasterExampleProps } from "./ShadowCasterPageReact.types";

export const ShadowCasterPage = () => {
    const [isDisabled, setIsDisabled] = useState(ShadowCasterKnobs.STARTING_IS_DISABLED);
    const [smoothingMs, setSmoothingMs] = useState(SHADOW_CASTER_DEFAULTS.smoothingMs);
    const [activeRangePx, setActiveRangePx] = useState(ShadowCasterKnobs.STARTING_ACTIVE_RANGE_PX);
    const [lightRangePx, setLightRangePx] = useState(SHADOW_CASTER_DEFAULTS.lightRangePx);
    const [maxThrowPx, setMaxThrowPx] = useState(SHADOW_CASTER_DEFAULTS.maxThrowPx);
    const [minBlurPx, setMinBlurPx] = useState(SHADOW_CASTER_DEFAULTS.minBlurPx);
    const [maxBlurPx, setMaxBlurPx] = useState(SHADOW_CASTER_DEFAULTS.maxBlurPx);
    const [maxOpacity, setMaxOpacity] = useState(SHADOW_CASTER_DEFAULTS.maxOpacity);
    const [minOpacity, setMinOpacity] = useState(SHADOW_CASTER_DEFAULTS.minOpacity);
    const [restingOpacity, setRestingOpacity] = useState(SHADOW_CASTER_DEFAULTS.restingOpacity);
    const [color, setColor] = useState(SHADOW_CASTER_DEFAULTS.color);

    const commonProps: ShadowCasterExampleProps = {
        isDisabled,
        activeRangePx,
        smoothingMs,
        lightRangePx,
        maxThrowPx,
        minBlurPx,
        maxBlurPx,
        maxOpacity,
        minOpacity,
        restingOpacity,
        color,
    };

    const examples = [
        {
            key: "card",
            name: EXAMPLE_NAMES.card,
            readout: () =>
                "the shadow is thrown away from the pointer, and lengthens and softens as the pointer retreats",
            component: () => <CardExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Card.tsx`,
        },
        {
            key: "badge",
            name: EXAMPLE_NAMES.badge,
            readout: () =>
                "the same wrapper over a clipped star — the shadow traces the shape rather than the box around it",
            component: () => <BadgeExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Badge.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"isDisabled"} {...ShadowCasterKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp itemKey={"smoothingMs"} {...ShadowCasterKnobs.SMOOTHING_MS_TEXT}>
                    <PageNumberField
                        value={smoothingMs}
                        min={ShadowCasterKnobs.MIN_SMOOTHING_MS}
                        max={ShadowCasterKnobs.MAX_SMOOTHING_MS}
                        step={ShadowCasterKnobs.SMOOTHING_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
                </PageProp>

                <PageProp itemKey={"activeRangePx"} {...ShadowCasterKnobs.ACTIVE_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={activeRangePx}
                        min={ShadowCasterKnobs.MIN_ACTIVE_RANGE_PX}
                        max={ShadowCasterKnobs.MAX_ACTIVE_RANGE_PX}
                        step={ShadowCasterKnobs.ACTIVE_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp itemKey={"lightRangePx"} {...ShadowCasterKnobs.LIGHT_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={lightRangePx}
                        min={ShadowCasterKnobs.MIN_LIGHT_RANGE_PX}
                        max={ShadowCasterKnobs.MAX_LIGHT_RANGE_PX}
                        step={ShadowCasterKnobs.LIGHT_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Light range in pixels"}
                        onInput={setLightRangePx}
                    />
                </PageProp>

                <PageProp itemKey={"maxThrowPx"} {...ShadowCasterKnobs.MAX_THROW_PX_TEXT}>
                    <PageNumberField
                        value={maxThrowPx}
                        min={ShadowCasterKnobs.MIN_THROW_PX}
                        max={ShadowCasterKnobs.MAX_THROW_PX}
                        step={ShadowCasterKnobs.THROW_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum throw in pixels"}
                        onInput={setMaxThrowPx}
                    />
                </PageProp>

                <PageProp itemKey={"minBlurPx"} {...ShadowCasterKnobs.MIN_BLUR_PX_TEXT}>
                    <PageNumberField
                        value={minBlurPx}
                        min={ShadowCasterKnobs.MIN_BLUR_PX}
                        max={ShadowCasterKnobs.MAX_BLUR_PX}
                        step={ShadowCasterKnobs.BLUR_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Near blur in pixels"}
                        onInput={setMinBlurPx}
                    />
                </PageProp>

                <PageProp itemKey={"maxBlurPx"} {...ShadowCasterKnobs.MAX_BLUR_PX_TEXT}>
                    <PageNumberField
                        value={maxBlurPx}
                        min={ShadowCasterKnobs.MIN_BLUR_PX}
                        max={ShadowCasterKnobs.MAX_BLUR_PX}
                        step={ShadowCasterKnobs.BLUR_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Far blur in pixels"}
                        onInput={setMaxBlurPx}
                    />
                </PageProp>

                <PageProp itemKey={"maxOpacity"} {...ShadowCasterKnobs.MAX_OPACITY_TEXT}>
                    <PageNumberField
                        value={maxOpacity}
                        min={ShadowCasterKnobs.MIN_OPACITY}
                        max={ShadowCasterKnobs.MAX_OPACITY}
                        step={ShadowCasterKnobs.OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Near opacity"}
                        onInput={setMaxOpacity}
                    />
                </PageProp>

                <PageProp itemKey={"minOpacity"} {...ShadowCasterKnobs.MIN_OPACITY_TEXT}>
                    <PageNumberField
                        value={minOpacity}
                        min={ShadowCasterKnobs.MIN_OPACITY}
                        max={ShadowCasterKnobs.MAX_OPACITY}
                        step={ShadowCasterKnobs.OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Far opacity"}
                        onInput={setMinOpacity}
                    />
                </PageProp>

                <PageProp itemKey={"restingOpacity"} {...ShadowCasterKnobs.RESTING_OPACITY_TEXT}>
                    <PageNumberField
                        value={restingOpacity}
                        min={ShadowCasterKnobs.MIN_OPACITY}
                        max={ShadowCasterKnobs.MAX_OPACITY}
                        step={ShadowCasterKnobs.OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Resting opacity"}
                        onInput={setRestingOpacity}
                    />
                </PageProp>

                <PageProp itemKey={"color"} {...ShadowCasterKnobs.COLOR_TEXT}>
                    <PageColorField value={color} ariaLabel={"Color"} onInput={setColor} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
