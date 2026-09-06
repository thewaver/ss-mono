import { For, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { DEFAULT_GLASS_DEFS, SVGDefsSamples } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    type WithNoSample,
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "../../PageComponents/SampleGroups/SampleGroups.const";
import { PageColorField, PageGroupedSelectField, PageNumberField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import type { GlassSurfaceExampleProps } from "./GlassSurfacePage.types";

import { BORDER_RADIUS_FULL } from "../../Theme.css";
import * as styles from "./GlassSurfacePage.css";

const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_CONFIGS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/GlassSurfacePage/Examples/Default.tsx";

const MIN_BORDER_RADIUS = 0;
const MAX_BORDER_RADIUS = 160;
const BORDER_RADIUS_STEP = 10;
const MIN_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 12;
const BORDER_WIDTH_STEP = 1;
const MIN_BLUR_RADIUS = 0;
const MAX_BLUR_RADIUS = 20;
const BLUR_RADIUS_STEP = 1;
const MIN_RIPPLE_SCALE = 0;
const MAX_RIPPLE_SCALE = 80;
const RIPPLE_SCALE_STEP = 1;
const MIN_LIGHT_HEIGHT = 0;
const MAX_LIGHT_HEIGHT = 2000;
const LIGHT_HEIGHT_STEP = 20;
const MIN_SURFACE_SCALE = 0;
const MAX_SURFACE_SCALE = 8;
const SURFACE_SCALE_STEP = 0.05;
const MIN_SPECULAR_CONSTANT = 0;
const MAX_SPECULAR_CONSTANT = 4;
const SPECULAR_CONSTANT_STEP = 0.05;
const MIN_SPECULAR_EXPONENT = 1;
const MAX_SPECULAR_EXPONENT = 300;
const SPECULAR_EXPONENT_STEP = 1;
const MIN_GRAIN_FREQUENCY = 0.005;
const MAX_GRAIN_FREQUENCY = 0.3;
const GRAIN_FREQUENCY_STEP = 0.005;
const MIN_GRAIN_OCTAVES = 1;
const MAX_GRAIN_OCTAVES = 5;
const GRAIN_OCTAVES_STEP = 1;
const MIN_TINT_OPACITY = 0;
const MAX_TINT_OPACITY = 1;
const TINT_OPACITY_STEP = 0.05;
const MIN_BLUR_WIDTH = 0;
const MAX_BLUR_WIDTH = 40;
const BLUR_WIDTH_STEP = 1;

export const GlassSurfacePage = () => {
    const [getBorderRadius, setBorderRadius] = createSignal(BORDER_RADIUS_FULL);
    const [getBorderWidth, setBorderWidth] = createSignal(2);
    const [getStrokeConfigKey, setStrokeConfigKey] =
        createSignal<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>("sheen_flare_1");
    const [getBlurWidth, setBlurWidth] = createSignal(0);
    const [getBlurRadius, setBlurRadius] = createSignal(6);
    const [getRippleScale, setRippleScale] = createSignal(12);
    const [getNoiseFrequency, setNoiseFrequency] = createSignal(DEFAULT_GLASS_DEFS.noise.frequency);
    const [getNoiseOctaves, setNoiseOctaves] = createSignal(DEFAULT_GLASS_DEFS.noise.octaves);
    const [getLightHeight, setLightHeight] = createSignal(DEFAULT_GLASS_DEFS.sheen.lightHeight);
    const [getSurfaceScale, setSurfaceScale] = createSignal(DEFAULT_GLASS_DEFS.sheen.surfaceScale);
    const [getSpecularConstant, setSpecularConstant] = createSignal(DEFAULT_GLASS_DEFS.sheen.specularConstant);
    const [getSpecularExponent, setSpecularExponent] = createSignal(DEFAULT_GLASS_DEFS.sheen.specularExponent);
    const [getTintColor, setTintColor] = createSignal("#FFFFFF");
    const [getTintOpacity, setTintOpacity] = createSignal(0.2);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: GlassSurfaceExampleProps = {
            borderRadius: getBorderRadius,
            borderWidth: getBorderWidth,
            strokeConfigKey: getStrokeConfigKey,
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
                name: "Default",
                component: () => <DefaultExample {...commonProps} />,
                path: DEFAULT_EXAMPLE_PATH,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"borderRadius"} label={"Corner radius (px)"}>
                    <PageNumberField
                        value={getBorderRadius}
                        min={() => MIN_BORDER_RADIUS}
                        max={() => MAX_BORDER_RADIUS}
                        step={() => BORDER_RADIUS_STEP}
                        ariaLabel={"Corner radius"}
                        onInput={setBorderRadius}
                    />
                </PageProp>

                <PageProp key={"borderWidth"} label={"Border width (px)"}>
                    <PageNumberField
                        value={getBorderWidth}
                        min={() => MIN_BORDER_WIDTH}
                        max={() => MAX_BORDER_WIDTH}
                        step={() => BORDER_WIDTH_STEP}
                        ariaLabel={"Border width"}
                        onInput={setBorderWidth}
                    />
                </PageProp>

                <PageProp key={"strokeConfigKey"} label={"Border pattern"}>
                    <PageGroupedSelectField
                        value={getStrokeConfigKey}
                        groups={() => toGroupEntriesWithNoSample(GROUPPED_GRADIENTS)}
                        ariaLabel={"Border pattern"}
                        onChange={(config) => setStrokeConfigKey(() => config)}
                    />
                </PageProp>

                <PageProp key={"colors"} label={"Border Colors"}>
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

                <PageProp key={"blurWidth"} label={"Border blur (px)"}>
                    <PageNumberField
                        value={getBlurWidth}
                        min={() => MIN_BLUR_WIDTH}
                        max={() => MAX_BLUR_WIDTH}
                        step={() => BLUR_WIDTH_STEP}
                        ariaLabel={"Border blur"}
                        onInput={setBlurWidth}
                    />
                </PageProp>

                <PageProp key={"blurRadius"} label={"Backdrop blur (px)"}>
                    <PageNumberField
                        value={getBlurRadius}
                        min={() => MIN_BLUR_RADIUS}
                        max={() => MAX_BLUR_RADIUS}
                        step={() => BLUR_RADIUS_STEP}
                        ariaLabel={"Backdrop blur"}
                        onInput={setBlurRadius}
                    />
                </PageProp>

                <PageProp key={"noiseFrequency"} label={"Noise scale"}>
                    <PageNumberField
                        value={getNoiseFrequency}
                        min={() => MIN_GRAIN_FREQUENCY}
                        max={() => MAX_GRAIN_FREQUENCY}
                        step={() => GRAIN_FREQUENCY_STEP}
                        ariaLabel={"Noise scale"}
                        onInput={setNoiseFrequency}
                    />
                </PageProp>

                <PageProp key={"noiseOctaves"} label={"Noise octaves"}>
                    <PageNumberField
                        value={getNoiseOctaves}
                        min={() => MIN_GRAIN_OCTAVES}
                        max={() => MAX_GRAIN_OCTAVES}
                        step={() => GRAIN_OCTAVES_STEP}
                        ariaLabel={"Noise octaves"}
                        onInput={setNoiseOctaves}
                    />
                </PageProp>

                <PageProp key={"rippleScale"} label={"Ripple bend (px)"}>
                    <PageNumberField
                        value={getRippleScale}
                        min={() => MIN_RIPPLE_SCALE}
                        max={() => MAX_RIPPLE_SCALE}
                        step={() => RIPPLE_SCALE_STEP}
                        ariaLabel={"Ripple bend"}
                        onInput={setRippleScale}
                    />
                </PageProp>

                <PageProp key={"lightHeight"} label={"Light height"}>
                    <PageNumberField
                        value={getLightHeight}
                        min={() => MIN_LIGHT_HEIGHT}
                        max={() => MAX_LIGHT_HEIGHT}
                        step={() => LIGHT_HEIGHT_STEP}
                        ariaLabel={"Light height"}
                        onInput={setLightHeight}
                    />
                </PageProp>

                <PageProp key={"surfaceScale"} label={"Sheen relief"}>
                    <PageNumberField
                        value={getSurfaceScale}
                        min={() => MIN_SURFACE_SCALE}
                        max={() => MAX_SURFACE_SCALE}
                        step={() => SURFACE_SCALE_STEP}
                        ariaLabel={"Sheen relief"}
                        onInput={setSurfaceScale}
                    />
                </PageProp>

                <PageProp key={"specularConstant"} label={"Sheen brightness"}>
                    <PageNumberField
                        value={getSpecularConstant}
                        min={() => MIN_SPECULAR_CONSTANT}
                        max={() => MAX_SPECULAR_CONSTANT}
                        step={() => SPECULAR_CONSTANT_STEP}
                        ariaLabel={"Sheen brightness"}
                        onInput={setSpecularConstant}
                    />
                </PageProp>

                <PageProp key={"specularExponent"} label={"Shininess"}>
                    <PageNumberField
                        value={getSpecularExponent}
                        min={() => MIN_SPECULAR_EXPONENT}
                        max={() => MAX_SPECULAR_EXPONENT}
                        step={() => SPECULAR_EXPONENT_STEP}
                        ariaLabel={"Shininess"}
                        onInput={setSpecularExponent}
                    />
                </PageProp>

                <PageProp key={"tintOpacity"} label={"Tint opacity"}>
                    <PageNumberField
                        value={getTintOpacity}
                        min={() => MIN_TINT_OPACITY}
                        max={() => MAX_TINT_OPACITY}
                        step={() => TINT_OPACITY_STEP}
                        ariaLabel={"Tint opacity"}
                        onInput={setTintOpacity}
                    />
                </PageProp>

                <PageProp key={"tintColor"} label={"Tint colour"}>
                    <PageColorField value={getTintColor} ariaLabel={"Tint colour"} onInput={setTintColor} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
