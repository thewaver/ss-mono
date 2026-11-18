import { For, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { DEFAULT_GLASS_DEFS, SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-solid";
import { GlassSurfaceKnobs } from "@thewaver/ss-playground/App/Knobs/GlassSurfaces.const";
import { TrackedGradientKnobs } from "@thewaver/ss-playground/App/Knobs/TrackedGradients.const";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import {
    DEFAULT_EXAMPLE_PATH,
    EXAMPLE_NAMES,
    GROUPPED_GRADIENTS,
} from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageColorField, PageGroupedSelectField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import type { GlassSurfaceExampleProps } from "./GlassSurfacePageSolid.types";

export const GlassSurfacePage = () => {
    const [getBorderRadius, setBorderRadius] = createSignal(BORDER_RADIUS_FULL);
    const [getBorderWidth, setBorderWidth] = createSignal(GlassSurfaceKnobs.STARTING_BORDER_WIDTH);
    const [getStrokeConfigKey, setStrokeConfigKey] = createSignal<
        WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>
    >(GlassSurfaceKnobs.STARTING_STROKE_CONFIG_KEY);
    const [strokeConfigDefs, setStrokeConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getStrokeKnobs = () => {
        const key = getStrokeConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TrackedGradientKnobs.KNOBS_BY_FAMILY[key] as Record<string, Knob>);
    };
    const getStrokeDefaults = () => {
        const key = getStrokeConfigKey();

        return key === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>);
    };
    const getStrokeConfigDefs = () => strokeConfigDefs[getStrokeConfigKey()] ?? {};
    const [getBlurWidth, setBlurWidth] = createSignal(GlassSurfaceKnobs.STARTING_BLUR_WIDTH);
    const [getBlurRadius, setBlurRadius] = createSignal(DEFAULT_GLASS_DEFS.backdrop.blurRadius);
    const [getRippleScale, setRippleScale] = createSignal(DEFAULT_GLASS_DEFS.ripple.scale);
    const [getNoiseFrequency, setNoiseFrequency] = createSignal(DEFAULT_GLASS_DEFS.noise.frequency);
    const [getNoiseOctaves, setNoiseOctaves] = createSignal(DEFAULT_GLASS_DEFS.noise.octaves);
    const [getLightHeight, setLightHeight] = createSignal(DEFAULT_GLASS_DEFS.sheen.lightHeight);
    const [getSurfaceScale, setSurfaceScale] = createSignal(DEFAULT_GLASS_DEFS.sheen.surfaceScale);
    const [getSpecularConstant, setSpecularConstant] = createSignal(DEFAULT_GLASS_DEFS.sheen.specularConstant);
    const [getSpecularExponent, setSpecularExponent] = createSignal(DEFAULT_GLASS_DEFS.sheen.specularExponent);
    const [getTintColor, setTintColor] = createSignal(DEFAULT_GLASS_DEFS.tint.color);
    const [getTintOpacity, setTintOpacity] = createSignal(DEFAULT_GLASS_DEFS.tint.opacity);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS_MONO });

    const getExamples = createMemo(() => {
        const commonProps: GlassSurfaceExampleProps = {
            borderRadius: getBorderRadius,
            borderWidth: getBorderWidth,
            strokeConfigKey: getStrokeConfigKey,
            strokeConfigDefs: getStrokeConfigDefs,
            colors: () => colors,
            blurWidth: getBlurWidth,
            blurRadius: getBlurRadius,
            rippleScale: getRippleScale,
            noiseFrequency: getNoiseFrequency,
            noiseOctaves: getNoiseOctaves,
            lightHeight: getLightHeight,
            surfaceScale: getSurfaceScale,
            specularConstant: getSpecularConstant,
            specularExponent: getSpecularExponent,
            tintColor: getTintColor,
            tintOpacity: getTintOpacity,
        };

        return [
            {
                key: "default",
                name: EXAMPLE_NAMES.default,
                component: () => <DefaultExample {...commonProps} />,
                path: DEFAULT_EXAMPLE_PATH,
            },
        ];
    });

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp key={"strokeConfigKey"} {...GlassSurfaceKnobs.STROKE_CONFIG_KEY_TEXT}>
                        <PageGroupedSelectField
                            value={getStrokeConfigKey}
                            groups={() => toGroupEntriesWithNoSample(GROUPPED_GRADIENTS)}
                            ariaLabel={"Border pattern"}
                            onChange={(config) => setStrokeConfigKey(() => config)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getStrokeKnobs}
                        defaults={() => getStrokeDefaults()}
                        values={getStrokeConfigDefs}
                        onInput={(key, value) =>
                            setStrokeConfigDefs(getStrokeConfigKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp key={"borderRadius"} {...GlassSurfaceKnobs.BORDER_RADIUS_TEXT}>
                        <PageNumberField
                            value={getBorderRadius}
                            min={GlassSurfaceKnobs.MIN_BORDER_RADIUS}
                            max={GlassSurfaceKnobs.MAX_BORDER_RADIUS}
                            step={GlassSurfaceKnobs.BORDER_RADIUS_STEP}
                            ariaLabel={"Corner radius"}
                            onInput={setBorderRadius}
                        />
                    </PageProp>

                    <PageProp key={"borderWidth"} {...GlassSurfaceKnobs.BORDER_WIDTH_TEXT}>
                        <PageNumberField
                            value={getBorderWidth}
                            min={GlassSurfaceKnobs.MIN_BORDER_WIDTH}
                            max={GlassSurfaceKnobs.MAX_BORDER_WIDTH}
                            step={GlassSurfaceKnobs.BORDER_WIDTH_STEP}
                            ariaLabel={"Border width"}
                            onInput={setBorderWidth}
                        />
                    </PageProp>

                    <PageProp key={"colors"} {...GlassSurfaceKnobs.COLORS_TEXT}>
                        <div class={styles.colorList}>
                            <For each={Object.keys(colors)}>
                                {(key) => (
                                    <PageColorField
                                        value={() => colors[key as keyof typeof colors]}
                                        ariaLabel={() => key}
                                        onInput={(value) => setColors(key as keyof typeof colors, value)}
                                    />
                                )}
                            </For>
                        </div>
                    </PageProp>

                    <PageProp key={"blurWidth"} {...GlassSurfaceKnobs.BLUR_WIDTH_TEXT}>
                        <PageNumberField
                            value={getBlurWidth}
                            min={GlassSurfaceKnobs.MIN_BLUR_WIDTH}
                            max={GlassSurfaceKnobs.MAX_BLUR_WIDTH}
                            step={GlassSurfaceKnobs.BLUR_WIDTH_STEP}
                            ariaLabel={"Border blur"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    <PageProp key={"blurRadius"} {...GlassSurfaceKnobs.BLUR_RADIUS_TEXT}>
                        <PageNumberField
                            value={getBlurRadius}
                            min={GlassSurfaceKnobs.MIN_BLUR_RADIUS}
                            max={GlassSurfaceKnobs.MAX_BLUR_RADIUS}
                            step={GlassSurfaceKnobs.BLUR_RADIUS_STEP}
                            ariaLabel={"Backdrop blur"}
                            onInput={setBlurRadius}
                        />
                    </PageProp>

                    <PageProp key={"noiseFrequency"} {...GlassSurfaceKnobs.NOISE_FREQUENCY_TEXT}>
                        <PageNumberField
                            value={getNoiseFrequency}
                            min={GlassSurfaceKnobs.MIN_GRAIN_FREQUENCY}
                            max={GlassSurfaceKnobs.MAX_GRAIN_FREQUENCY}
                            step={GlassSurfaceKnobs.GRAIN_FREQUENCY_STEP}
                            ariaLabel={"Noise scale"}
                            onInput={setNoiseFrequency}
                        />
                    </PageProp>

                    <PageProp key={"noiseOctaves"} {...GlassSurfaceKnobs.NOISE_OCTAVES_TEXT}>
                        <PageNumberField
                            value={getNoiseOctaves}
                            min={GlassSurfaceKnobs.MIN_GRAIN_OCTAVES}
                            max={GlassSurfaceKnobs.MAX_GRAIN_OCTAVES}
                            step={GlassSurfaceKnobs.GRAIN_OCTAVES_STEP}
                            ariaLabel={"Noise octaves"}
                            onInput={setNoiseOctaves}
                        />
                    </PageProp>

                    <PageProp key={"rippleScale"} {...GlassSurfaceKnobs.RIPPLE_SCALE_TEXT}>
                        <PageNumberField
                            value={getRippleScale}
                            min={GlassSurfaceKnobs.MIN_RIPPLE_SCALE}
                            max={GlassSurfaceKnobs.MAX_RIPPLE_SCALE}
                            step={GlassSurfaceKnobs.RIPPLE_SCALE_STEP}
                            ariaLabel={"Ripple bend"}
                            onInput={setRippleScale}
                        />
                    </PageProp>

                    <PageProp key={"lightHeight"} {...GlassSurfaceKnobs.LIGHT_HEIGHT_TEXT}>
                        <PageNumberField
                            value={getLightHeight}
                            min={GlassSurfaceKnobs.MIN_LIGHT_HEIGHT}
                            max={GlassSurfaceKnobs.MAX_LIGHT_HEIGHT}
                            step={GlassSurfaceKnobs.LIGHT_HEIGHT_STEP}
                            ariaLabel={"Light height"}
                            onInput={setLightHeight}
                        />
                    </PageProp>

                    <PageProp key={"surfaceScale"} {...GlassSurfaceKnobs.SURFACE_SCALE_TEXT}>
                        <PageNumberField
                            value={getSurfaceScale}
                            min={GlassSurfaceKnobs.MIN_SURFACE_SCALE}
                            max={GlassSurfaceKnobs.MAX_SURFACE_SCALE}
                            step={GlassSurfaceKnobs.SURFACE_SCALE_STEP}
                            ariaLabel={"Sheen relief"}
                            onInput={setSurfaceScale}
                        />
                    </PageProp>

                    <PageProp key={"specularConstant"} {...GlassSurfaceKnobs.SPECULAR_CONSTANT_TEXT}>
                        <PageNumberField
                            value={getSpecularConstant}
                            min={GlassSurfaceKnobs.MIN_SPECULAR_CONSTANT}
                            max={GlassSurfaceKnobs.MAX_SPECULAR_CONSTANT}
                            step={GlassSurfaceKnobs.SPECULAR_CONSTANT_STEP}
                            ariaLabel={"Sheen brightness"}
                            onInput={setSpecularConstant}
                        />
                    </PageProp>

                    <PageProp key={"specularExponent"} {...GlassSurfaceKnobs.SPECULAR_EXPONENT_TEXT}>
                        <PageNumberField
                            value={getSpecularExponent}
                            min={GlassSurfaceKnobs.MIN_SPECULAR_EXPONENT}
                            max={GlassSurfaceKnobs.MAX_SPECULAR_EXPONENT}
                            step={GlassSurfaceKnobs.SPECULAR_EXPONENT_STEP}
                            ariaLabel={"Shininess"}
                            onInput={setSpecularExponent}
                        />
                    </PageProp>

                    <PageProp key={"tintOpacity"} {...GlassSurfaceKnobs.TINT_OPACITY_TEXT}>
                        <PageNumberField
                            value={getTintOpacity}
                            min={GlassSurfaceKnobs.MIN_TINT_OPACITY}
                            max={GlassSurfaceKnobs.MAX_TINT_OPACITY}
                            step={GlassSurfaceKnobs.TINT_OPACITY_STEP}
                            ariaLabel={"Tint opacity"}
                            onInput={setTintOpacity}
                        />
                    </PageProp>

                    <PageProp key={"tintColor"} {...GlassSurfaceKnobs.TINT_COLOR_TEXT}>
                        <PageColorField value={getTintColor} ariaLabel={"Tint color"} onInput={setTintColor} />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
