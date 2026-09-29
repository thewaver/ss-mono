<script lang="ts">
    import { SHADOW_CASTER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ShadowCasterKnobs } from "@thewaver/ss-playground/App/Knobs/ShadowCasters.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageColorField from "../../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BadgeExample from "./Examples/Badge.svelte";
    import CardExample from "./Examples/Card.svelte";
    import type { ShadowCasterExampleProps } from "./ShadowCasterPageSvelte.types";

    const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/ShadowCasterPage/Examples";

    const FIELD_WIDTH = 110;

    let isDisabled = $state(ShadowCasterKnobs.STARTING_IS_DISABLED);
    let smoothingMs = $state(SHADOW_CASTER_DEFAULTS.smoothingMs);
    let activeRangePx = $state(ShadowCasterKnobs.STARTING_ACTIVE_RANGE_PX);
    let lightRangePx = $state(SHADOW_CASTER_DEFAULTS.lightRangePx);
    let maxThrowPx = $state(SHADOW_CASTER_DEFAULTS.maxThrowPx);
    let minBlurPx = $state(SHADOW_CASTER_DEFAULTS.minBlurPx);
    let maxBlurPx = $state(SHADOW_CASTER_DEFAULTS.maxBlurPx);
    let maxOpacity = $state(SHADOW_CASTER_DEFAULTS.maxOpacity);
    let minOpacity = $state(SHADOW_CASTER_DEFAULTS.minOpacity);
    let restingOpacity = $state(SHADOW_CASTER_DEFAULTS.restingOpacity);
    let color = $state(SHADOW_CASTER_DEFAULTS.color);

    const commonProps: ShadowCasterExampleProps = $derived({
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
    });

    const examples: ExampleDefs[] = [
        {
            key: "card",
            name: "Card",
            readout: () =>
                "the shadow is thrown away from the pointer, and lengthens and softens as the pointer retreats",
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card.svelte`,
        },
        {
            key: "badge",
            name: "Cut shape",
            readout: () =>
                "the same wrapper over a clipped star — the shadow traces the shape rather than the box around it",
            component: badgeExample,
            path: `${EXAMPLES_ROOT}/Badge.svelte`,
        },
    ];
</script>

{#snippet cardExample()}
    <CardExample {...commonProps} />
{/snippet}

{#snippet badgeExample()}
    <BadgeExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Stops the shadow following the pointer and leaves it at rest. It is what a page honoring a reduced-motion preference passes."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>

    <PageProp
        itemKey={"smoothingMs"}
        label={"Smoothing (ms)"}
        hint={"How long the shadow takes to catch up with the pointer. At 0 it follows exactly; raised, it swings after a quick movement and eases back to rest."}
    >
        <PageNumberField
            value={smoothingMs}
            min={ShadowCasterKnobs.MIN_SMOOTHING_MS}
            max={ShadowCasterKnobs.MAX_SMOOTHING_MS}
            step={ShadowCasterKnobs.SMOOTHING_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Smoothing in milliseconds"}
            onInput={(value) => (smoothingMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"activeRangePx"}
        label={"Active range (px)"}
        hint={"How near the pointer has to be before the shadow answers it at all, measured from the content's center. Outside it the shadow rests."}
    >
        <PageNumberField
            value={activeRangePx}
            min={ShadowCasterKnobs.MIN_ACTIVE_RANGE_PX}
            max={ShadowCasterKnobs.MAX_ACTIVE_RANGE_PX}
            step={ShadowCasterKnobs.ACTIVE_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Active range in pixels"}
            onInput={(value) => (activeRangePx = value)}
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
            onInput={(value) => (lightRangePx = value)}
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
            onInput={(value) => (maxThrowPx = value)}
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
            onInput={(value) => (minBlurPx = value)}
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
            onInput={(value) => (maxBlurPx = value)}
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
            onInput={(value) => (maxOpacity = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"minOpacity"}
        label={"Far opacity"}
        hint={"How dark the shadow is once the pointer is out at the edge of the light. Nothing, by default."}
    >
        <PageNumberField
            value={minOpacity}
            min={ShadowCasterKnobs.MIN_OPACITY}
            max={ShadowCasterKnobs.MAX_OPACITY}
            step={ShadowCasterKnobs.OPACITY_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Far opacity"}
            onInput={(value) => (minOpacity = value)}
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
            onInput={(value) => (restingOpacity = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"color"}
        label={"Color"}
        hint={"What the shadow is made of. Whatever alpha it carries is replaced by the opacity ramp."}
    >
        <PageColorField value={color} ariaLabel={"Color"} onInput={(value) => (color = value)} />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
