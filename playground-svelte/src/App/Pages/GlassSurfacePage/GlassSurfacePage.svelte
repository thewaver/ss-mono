<script lang="ts">
    import type { SVGDefsColors } from "@thewaver/ss-components-svelte";
    import { DEFAULT_GLASS_DEFS, SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-svelte";
    import { GlassSurfaceKnobs } from "@thewaver/ss-playground/App/Knobs/GlassSurfaces.const";
    import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
    import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
    import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";

    import { TrackedGradientKnobs } from "@thewaver/ss-playground/App/Knobs/TrackedGradients.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { GlassSurfaceExampleProps } from "./GlassSurfacePageSvelte.types";
    import {
    EXAMPLE_NAMES,
    STROKE_GROUPS,
} from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.const";

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/GlassSurfacePage/Examples/Default.svelte";

    let borderRadius = $state(BORDER_RADIUS_FULL);
    let borderWidth = $state(GlassSurfaceKnobs.STARTING_BORDER_WIDTH);
    let strokeConfigKey = $state<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
        GlassSurfaceKnobs.STARTING_STROKE_CONFIG_KEY,
    );
    let strokeConfigDefsByKey = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const strokeKnobs = $derived(
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientKnobs.KNOBS_BY_FAMILY[strokeConfigKey] as Record<string, Knob>),
    );
    const strokeDefaults = $derived(
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[strokeConfigKey] as Record<string, unknown>),
    );
    const strokeConfigDefs = $derived(strokeConfigDefsByKey[strokeConfigKey] ?? {});
    let blurWidth = $state(GlassSurfaceKnobs.STARTING_BLUR_WIDTH);
    let blurRadius = $state(DEFAULT_GLASS_DEFS.backdrop.blurRadius);
    let rippleScale = $state(DEFAULT_GLASS_DEFS.ripple.scale);
    let noiseFrequency = $state(DEFAULT_GLASS_DEFS.noise.frequency);
    let noiseOctaves = $state(DEFAULT_GLASS_DEFS.noise.octaves);
    let lightHeight = $state(DEFAULT_GLASS_DEFS.sheen.lightHeight);
    let surfaceScale = $state(DEFAULT_GLASS_DEFS.sheen.surfaceScale);
    let specularConstant = $state(DEFAULT_GLASS_DEFS.sheen.specularConstant);
    let specularExponent = $state(DEFAULT_GLASS_DEFS.sheen.specularExponent);
    let tintColor = $state(DEFAULT_GLASS_DEFS.tint.color);
    let tintOpacity = $state(DEFAULT_GLASS_DEFS.tint.opacity);
    let colors = $state.raw<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS_MONO });

    const colorKeys = $derived(Object.keys(colors) as (keyof SVGDefsColors)[]);

    const commonProps: GlassSurfaceExampleProps = $derived({
        borderRadius,
        borderWidth,
        strokeConfigKey,
        strokeConfigDefs,
        colors,
        blurWidth,
        blurRadius,
        rippleScale,
        noiseFrequency,
        noiseOctaves,
        lightHeight,
        surfaceScale,
        specularConstant,
        specularExponent,
        tintColor,
        tintOpacity,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            component: defaultExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} />
{/snippet}

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"strokeConfigKey"}
            {...GlassSurfaceKnobs.STROKE_CONFIG_KEY_TEXT}
        >
            <PageGroupedSelectField
                value={strokeConfigKey}
                groups={STROKE_GROUPS}
                ariaLabel={"Border pattern"}
                onChange={(value) => {
                    strokeConfigKey = value;
                }}
            />
        </PageProp>

        <PageKnobs
            knobs={strokeKnobs}
            defaults={strokeDefaults}
            values={strokeConfigDefs}
            onInput={(key, value) => {
                strokeConfigDefsByKey = {
                    ...strokeConfigDefsByKey,
                    [strokeConfigKey]: { ...strokeConfigDefsByKey[strokeConfigKey], [key]: value },
                };
            }}
        />
    </PagePropsPanel>

    <PagePropsDivider />

    <PagePropsPanel scope={"global"}>
        <PageProp itemKey={"borderRadius"} {...GlassSurfaceKnobs.BORDER_RADIUS_TEXT}>
            <PageNumberField
                value={borderRadius}
                min={GlassSurfaceKnobs.MIN_BORDER_RADIUS}
                max={GlassSurfaceKnobs.MAX_BORDER_RADIUS}
                step={GlassSurfaceKnobs.BORDER_RADIUS_STEP}
                ariaLabel={"Corner radius"}
                onInput={(value) => {
                    borderRadius = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"borderWidth"}
            {...GlassSurfaceKnobs.BORDER_WIDTH_TEXT}
        >
            <PageNumberField
                value={borderWidth}
                min={GlassSurfaceKnobs.MIN_BORDER_WIDTH}
                max={GlassSurfaceKnobs.MAX_BORDER_WIDTH}
                step={GlassSurfaceKnobs.BORDER_WIDTH_STEP}
                ariaLabel={"Border width"}
                onInput={(value) => {
                    borderWidth = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"colors"} {...GlassSurfaceKnobs.COLORS_TEXT}>
            <div class={styles.colorList}>
                {#each colorKeys as key (key)}
                    <PageColorField
                        value={colors[key]}
                        ariaLabel={key}
                        onInput={(value) => {
                            colors = { ...colors, [key]: value };
                        }}
                    />
                {/each}
            </div>
        </PageProp>

        <PageProp
            itemKey={"blurWidth"}
            {...GlassSurfaceKnobs.BLUR_WIDTH_TEXT}
        >
            <PageNumberField
                value={blurWidth}
                min={GlassSurfaceKnobs.MIN_BLUR_WIDTH}
                max={GlassSurfaceKnobs.MAX_BLUR_WIDTH}
                step={GlassSurfaceKnobs.BLUR_WIDTH_STEP}
                ariaLabel={"Border blur"}
                onInput={(value) => {
                    blurWidth = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"blurRadius"}
            {...GlassSurfaceKnobs.BLUR_RADIUS_TEXT}
        >
            <PageNumberField
                value={blurRadius}
                min={GlassSurfaceKnobs.MIN_BLUR_RADIUS}
                max={GlassSurfaceKnobs.MAX_BLUR_RADIUS}
                step={GlassSurfaceKnobs.BLUR_RADIUS_STEP}
                ariaLabel={"Backdrop blur"}
                onInput={(value) => {
                    blurRadius = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"noiseFrequency"}
            {...GlassSurfaceKnobs.NOISE_FREQUENCY_TEXT}
        >
            <PageNumberField
                value={noiseFrequency}
                min={GlassSurfaceKnobs.MIN_GRAIN_FREQUENCY}
                max={GlassSurfaceKnobs.MAX_GRAIN_FREQUENCY}
                step={GlassSurfaceKnobs.GRAIN_FREQUENCY_STEP}
                ariaLabel={"Noise scale"}
                onInput={(value) => {
                    noiseFrequency = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"noiseOctaves"}
            {...GlassSurfaceKnobs.NOISE_OCTAVES_TEXT}
        >
            <PageNumberField
                value={noiseOctaves}
                min={GlassSurfaceKnobs.MIN_GRAIN_OCTAVES}
                max={GlassSurfaceKnobs.MAX_GRAIN_OCTAVES}
                step={GlassSurfaceKnobs.GRAIN_OCTAVES_STEP}
                ariaLabel={"Noise octaves"}
                onInput={(value) => {
                    noiseOctaves = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"rippleScale"}
            {...GlassSurfaceKnobs.RIPPLE_SCALE_TEXT}
        >
            <PageNumberField
                value={rippleScale}
                min={GlassSurfaceKnobs.MIN_RIPPLE_SCALE}
                max={GlassSurfaceKnobs.MAX_RIPPLE_SCALE}
                step={GlassSurfaceKnobs.RIPPLE_SCALE_STEP}
                ariaLabel={"Ripple bend"}
                onInput={(value) => {
                    rippleScale = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"lightHeight"}
            {...GlassSurfaceKnobs.LIGHT_HEIGHT_TEXT}
        >
            <PageNumberField
                value={lightHeight}
                min={GlassSurfaceKnobs.MIN_LIGHT_HEIGHT}
                max={GlassSurfaceKnobs.MAX_LIGHT_HEIGHT}
                step={GlassSurfaceKnobs.LIGHT_HEIGHT_STEP}
                ariaLabel={"Light height"}
                onInput={(value) => {
                    lightHeight = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"surfaceScale"}
            {...GlassSurfaceKnobs.SURFACE_SCALE_TEXT}
        >
            <PageNumberField
                value={surfaceScale}
                min={GlassSurfaceKnobs.MIN_SURFACE_SCALE}
                max={GlassSurfaceKnobs.MAX_SURFACE_SCALE}
                step={GlassSurfaceKnobs.SURFACE_SCALE_STEP}
                ariaLabel={"Sheen relief"}
                onInput={(value) => {
                    surfaceScale = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"specularConstant"}
            {...GlassSurfaceKnobs.SPECULAR_CONSTANT_TEXT}
        >
            <PageNumberField
                value={specularConstant}
                min={GlassSurfaceKnobs.MIN_SPECULAR_CONSTANT}
                max={GlassSurfaceKnobs.MAX_SPECULAR_CONSTANT}
                step={GlassSurfaceKnobs.SPECULAR_CONSTANT_STEP}
                ariaLabel={"Sheen brightness"}
                onInput={(value) => {
                    specularConstant = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"specularExponent"}
            {...GlassSurfaceKnobs.SPECULAR_EXPONENT_TEXT}
        >
            <PageNumberField
                value={specularExponent}
                min={GlassSurfaceKnobs.MIN_SPECULAR_EXPONENT}
                max={GlassSurfaceKnobs.MAX_SPECULAR_EXPONENT}
                step={GlassSurfaceKnobs.SPECULAR_EXPONENT_STEP}
                ariaLabel={"Shininess"}
                onInput={(value) => {
                    specularExponent = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"tintOpacity"}
            {...GlassSurfaceKnobs.TINT_OPACITY_TEXT}
        >
            <PageNumberField
                value={tintOpacity}
                min={GlassSurfaceKnobs.MIN_TINT_OPACITY}
                max={GlassSurfaceKnobs.MAX_TINT_OPACITY}
                step={GlassSurfaceKnobs.TINT_OPACITY_STEP}
                ariaLabel={"Tint opacity"}
                onInput={(value) => {
                    tintOpacity = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"tintColor"} {...GlassSurfaceKnobs.TINT_COLOR_TEXT}>
            <PageColorField
                value={tintColor}
                ariaLabel={"Tint color"}
                onInput={(value) => {
                    tintColor = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
