import { createMemo, createSignal } from "solid-js";

import { SHADOW_CASTER_DEFAULTS } from "@thewaver/ss-components-solid";
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
import type { ShadowCasterExampleProps } from "./ShadowCasterPageSolid.types";

export const ShadowCasterPage = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(ShadowCasterKnobs.STARTING_IS_DISABLED);
    const [getSmoothingMs, setSmoothingMs] = createSignal(SHADOW_CASTER_DEFAULTS.smoothingMs);
    const [getActiveRangePx, setActiveRangePx] = createSignal(ShadowCasterKnobs.STARTING_ACTIVE_RANGE_PX);
    const [getLightRangePx, setLightRangePx] = createSignal(SHADOW_CASTER_DEFAULTS.lightRangePx);
    const [getMaxThrowPx, setMaxThrowPx] = createSignal(SHADOW_CASTER_DEFAULTS.maxThrowPx);
    const [getMinBlurPx, setMinBlurPx] = createSignal(SHADOW_CASTER_DEFAULTS.minBlurPx);
    const [getMaxBlurPx, setMaxBlurPx] = createSignal(SHADOW_CASTER_DEFAULTS.maxBlurPx);
    const [getMaxOpacity, setMaxOpacity] = createSignal(SHADOW_CASTER_DEFAULTS.maxOpacity);
    const [getMinOpacity, setMinOpacity] = createSignal(SHADOW_CASTER_DEFAULTS.minOpacity);
    const [getRestingOpacity, setRestingOpacity] = createSignal(SHADOW_CASTER_DEFAULTS.restingOpacity);
    const [getColor, setColor] = createSignal(SHADOW_CASTER_DEFAULTS.color);

    const getExamples = createMemo(() => {
        const commonProps: ShadowCasterExampleProps = {
            isDisabled: getIsDisabled,
            activeRangePx: getActiveRangePx,
            smoothingMs: getSmoothingMs,
            lightRangePx: getLightRangePx,
            maxThrowPx: getMaxThrowPx,
            minBlurPx: getMinBlurPx,
            maxBlurPx: getMaxBlurPx,
            maxOpacity: getMaxOpacity,
            minOpacity: getMinOpacity,
            restingOpacity: getRestingOpacity,
            color: getColor,
        };

        return [
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
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"isDisabled"} {...ShadowCasterKnobs.IS_DISABLED_TEXT}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp key={"smoothingMs"} {...ShadowCasterKnobs.SMOOTHING_MS_TEXT}>
                    <PageNumberField
                        value={getSmoothingMs}
                        min={ShadowCasterKnobs.MIN_SMOOTHING_MS}
                        max={ShadowCasterKnobs.MAX_SMOOTHING_MS}
                        step={ShadowCasterKnobs.SMOOTHING_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Smoothing in milliseconds"}
                        onInput={setSmoothingMs}
                    />
                </PageProp>

                <PageProp key={"activeRangePx"} {...ShadowCasterKnobs.ACTIVE_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={getActiveRangePx}
                        min={ShadowCasterKnobs.MIN_ACTIVE_RANGE_PX}
                        max={ShadowCasterKnobs.MAX_ACTIVE_RANGE_PX}
                        step={ShadowCasterKnobs.ACTIVE_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Active range in pixels"}
                        onInput={setActiveRangePx}
                    />
                </PageProp>

                <PageProp key={"lightRangePx"} {...ShadowCasterKnobs.LIGHT_RANGE_PX_TEXT}>
                    <PageNumberField
                        value={getLightRangePx}
                        min={ShadowCasterKnobs.MIN_LIGHT_RANGE_PX}
                        max={ShadowCasterKnobs.MAX_LIGHT_RANGE_PX}
                        step={ShadowCasterKnobs.LIGHT_RANGE_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Light range in pixels"}
                        onInput={setLightRangePx}
                    />
                </PageProp>

                <PageProp key={"maxThrowPx"} {...ShadowCasterKnobs.MAX_THROW_PX_TEXT}>
                    <PageNumberField
                        value={getMaxThrowPx}
                        min={ShadowCasterKnobs.MIN_THROW_PX}
                        max={ShadowCasterKnobs.MAX_THROW_PX}
                        step={ShadowCasterKnobs.THROW_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Maximum throw in pixels"}
                        onInput={setMaxThrowPx}
                    />
                </PageProp>

                <PageProp key={"minBlurPx"} {...ShadowCasterKnobs.MIN_BLUR_PX_TEXT}>
                    <PageNumberField
                        value={getMinBlurPx}
                        min={ShadowCasterKnobs.MIN_BLUR_PX}
                        max={ShadowCasterKnobs.MAX_BLUR_PX}
                        step={ShadowCasterKnobs.BLUR_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Near blur in pixels"}
                        onInput={setMinBlurPx}
                    />
                </PageProp>

                <PageProp key={"maxBlurPx"} {...ShadowCasterKnobs.MAX_BLUR_PX_TEXT}>
                    <PageNumberField
                        value={getMaxBlurPx}
                        min={ShadowCasterKnobs.MIN_BLUR_PX}
                        max={ShadowCasterKnobs.MAX_BLUR_PX}
                        step={ShadowCasterKnobs.BLUR_STEP_PX}
                        width={FIELD_WIDTH}
                        ariaLabel={"Far blur in pixels"}
                        onInput={setMaxBlurPx}
                    />
                </PageProp>

                <PageProp key={"maxOpacity"} {...ShadowCasterKnobs.MAX_OPACITY_TEXT}>
                    <PageNumberField
                        value={getMaxOpacity}
                        min={ShadowCasterKnobs.MIN_OPACITY}
                        max={ShadowCasterKnobs.MAX_OPACITY}
                        step={ShadowCasterKnobs.OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Near opacity"}
                        onInput={setMaxOpacity}
                    />
                </PageProp>

                <PageProp key={"minOpacity"} {...ShadowCasterKnobs.MIN_OPACITY_TEXT}>
                    <PageNumberField
                        value={getMinOpacity}
                        min={ShadowCasterKnobs.MIN_OPACITY}
                        max={ShadowCasterKnobs.MAX_OPACITY}
                        step={ShadowCasterKnobs.OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Far opacity"}
                        onInput={setMinOpacity}
                    />
                </PageProp>

                <PageProp key={"restingOpacity"} {...ShadowCasterKnobs.RESTING_OPACITY_TEXT}>
                    <PageNumberField
                        value={getRestingOpacity}
                        min={ShadowCasterKnobs.MIN_OPACITY}
                        max={ShadowCasterKnobs.MAX_OPACITY}
                        step={ShadowCasterKnobs.OPACITY_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Resting opacity"}
                        onInput={setRestingOpacity}
                    />
                </PageProp>

                <PageProp key={"color"} {...ShadowCasterKnobs.COLOR_TEXT}>
                    <PageColorField value={getColor} ariaLabel={"Color"} onInput={setColor} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
