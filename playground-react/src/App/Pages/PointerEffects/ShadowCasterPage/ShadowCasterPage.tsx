import { useState } from "react";

import { SHADOW_CASTER_DEFAULTS } from "@thewaver/ss-components-react";
import { ShadowCasterKnobs } from "@thewaver/ss-playground-core/App/Knobs/ShadowCasters.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { BadgeExample } from "./Examples/Badge";
import { CardExample } from "./Examples/Card";
import type { ShadowCasterExampleProps } from "./ShadowCasterPageReact.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/ShadowCasterPage/Examples";

const FIELD_WIDTH = 110;

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
            name: "Card",
            readout: () =>
                "the shadow is thrown away from the pointer, and lengthens and softens as the pointer retreats",
            component: () => <CardExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Card.tsx`,
        },
        {
            key: "badge",
            name: "Cut shape",
            readout: () =>
                "the same wrapper over a clipped star — the shadow traces the shape rather than the box around it",
            component: () => <BadgeExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Badge.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={
                        "Stops the shadow following the pointer and leaves it at rest. It is what a page honoring a reduced-motion preference passes."
                    }
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"smoothingMs"}
                    label={"Smoothing (ms)"}
                    hint={
                        "How long the shadow takes to catch up with the pointer. At 0 it follows exactly; raised, it swings after a quick movement and eases back to rest."
                    }
                >
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

                <PageProp
                    itemKey={"activeRangePx"}
                    label={"Active range (px)"}
                    hint={
                        "How near the pointer has to be before the shadow answers it at all, measured from the content's center. Outside it the shadow rests."
                    }
                >
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

                <PageProp
                    itemKey={"lightRangePx"}
                    label={"Light range (px)"}
                    hint={"How far the pointer's light reaches. Past it the shadow is at its longest and faintest."}
                >
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

                <PageProp
                    itemKey={"maxThrowPx"}
                    label={"Max throw (px)"}
                    hint={"How far the shadow is thrown once the pointer is out at the edge of the light."}
                >
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

                <PageProp
                    itemKey={"minBlurPx"}
                    label={"Near blur (px)"}
                    hint={"How soft the shadow is with the pointer on the content."}
                >
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

                <PageProp
                    itemKey={"maxBlurPx"}
                    label={"Far blur (px)"}
                    hint={"How soft the shadow is once the pointer is out at the edge of the light."}
                >
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

                <PageProp
                    itemKey={"maxOpacity"}
                    label={"Near opacity"}
                    hint={"How dark the shadow is with the pointer on the content. It fades as the pointer retreats."}
                >
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

                <PageProp
                    itemKey={"minOpacity"}
                    label={"Far opacity"}
                    hint={
                        "How dark the shadow is once the pointer is out at the edge of the light. Nothing, by default."
                    }
                >
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

                <PageProp
                    itemKey={"restingOpacity"}
                    label={"Resting opacity"}
                    hint={"How dark the shadow is with no pointer near it at all, or with the effect turned off."}
                >
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

                <PageProp
                    itemKey={"color"}
                    label={"Color"}
                    hint={"What the shadow is made of. Whatever alpha it carries is replaced by the opacity ramp."}
                >
                    <PageColorField value={color} ariaLabel={"Color"} onInput={setColor} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
