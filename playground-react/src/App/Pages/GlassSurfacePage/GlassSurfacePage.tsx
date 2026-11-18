import { useState } from "react";

import type { SVGDefsColors } from "@thewaver/ss-components-react";
import { DEFAULT_GLASS_DEFS, SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-react";
import { GlassSurfaceKnobs } from "@thewaver/ss-playground/App/Knobs/GlassSurfaces.const";
import { TrackedGradientKnobs } from "@thewaver/ss-playground/App/Knobs/TrackedGradients.const";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import {
    DEFAULT_EXAMPLE_PATH,
    EXAMPLE_NAMES,
    STROKE_GROUPS,
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
import type { GlassSurfaceExampleProps } from "./GlassSurfacePageReact.types";

export const GlassSurfacePage = () => {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_FULL);
    const [borderWidth, setBorderWidth] = useState(GlassSurfaceKnobs.STARTING_BORDER_WIDTH);
    const [strokeConfigKey, setStrokeConfigKey] = useState<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
        GlassSurfaceKnobs.STARTING_STROKE_CONFIG_KEY,
    );
    const [strokeConfigDefsByKey, setStrokeConfigDefsByKey] = useState<
        Record<string, Record<string, number | boolean>>
    >({});

    const strokeKnobs =
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientKnobs.KNOBS_BY_FAMILY[strokeConfigKey] as Record<string, Knob>);
    const strokeDefaults =
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[strokeConfigKey] as Record<string, unknown>);
    const strokeConfigDefs = strokeConfigDefsByKey[strokeConfigKey] ?? {};
    const [blurWidth, setBlurWidth] = useState(GlassSurfaceKnobs.STARTING_BLUR_WIDTH);
    const [blurRadius, setBlurRadius] = useState(DEFAULT_GLASS_DEFS.backdrop.blurRadius);
    const [rippleScale, setRippleScale] = useState(DEFAULT_GLASS_DEFS.ripple.scale);
    const [noiseFrequency, setNoiseFrequency] = useState(DEFAULT_GLASS_DEFS.noise.frequency);
    const [noiseOctaves, setNoiseOctaves] = useState(DEFAULT_GLASS_DEFS.noise.octaves);
    const [lightHeight, setLightHeight] = useState(DEFAULT_GLASS_DEFS.sheen.lightHeight);
    const [surfaceScale, setSurfaceScale] = useState(DEFAULT_GLASS_DEFS.sheen.surfaceScale);
    const [specularConstant, setSpecularConstant] = useState(DEFAULT_GLASS_DEFS.sheen.specularConstant);
    const [specularExponent, setSpecularExponent] = useState(DEFAULT_GLASS_DEFS.sheen.specularExponent);
    const [tintColor, setTintColor] = useState(DEFAULT_GLASS_DEFS.tint.color);
    const [tintOpacity, setTintOpacity] = useState(DEFAULT_GLASS_DEFS.tint.opacity);
    const [colors, setColors] = useState<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS_MONO });

    const commonProps: GlassSurfaceExampleProps = {
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
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            component: () => <DefaultExample {...commonProps} />,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp itemKey={"strokeConfigKey"} {...GlassSurfaceKnobs.STROKE_CONFIG_KEY_TEXT}>
                        <PageGroupedSelectField
                            value={strokeConfigKey}
                            groups={STROKE_GROUPS}
                            ariaLabel={"Border pattern"}
                            onChange={setStrokeConfigKey}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={strokeKnobs}
                        defaults={strokeDefaults}
                        values={strokeConfigDefs}
                        onInput={(key, value) =>
                            setStrokeConfigDefsByKey((previous) => ({
                                ...previous,
                                [strokeConfigKey]: { ...previous[strokeConfigKey], [key]: value },
                            }))
                        }
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
                            onInput={setBorderRadius}
                        />
                    </PageProp>

                    <PageProp itemKey={"borderWidth"} {...GlassSurfaceKnobs.BORDER_WIDTH_TEXT}>
                        <PageNumberField
                            value={borderWidth}
                            min={GlassSurfaceKnobs.MIN_BORDER_WIDTH}
                            max={GlassSurfaceKnobs.MAX_BORDER_WIDTH}
                            step={GlassSurfaceKnobs.BORDER_WIDTH_STEP}
                            ariaLabel={"Border width"}
                            onInput={setBorderWidth}
                        />
                    </PageProp>

                    <PageProp itemKey={"colors"} {...GlassSurfaceKnobs.COLORS_TEXT}>
                        <div className={styles.colorList}>
                            {(Object.keys(colors) as (keyof SVGDefsColors)[]).map((key) => (
                                <PageColorField
                                    key={key}
                                    value={colors[key]}
                                    ariaLabel={key}
                                    onInput={(value) => setColors((previous) => ({ ...previous, [key]: value }))}
                                />
                            ))}
                        </div>
                    </PageProp>

                    <PageProp itemKey={"blurWidth"} {...GlassSurfaceKnobs.BLUR_WIDTH_TEXT}>
                        <PageNumberField
                            value={blurWidth}
                            min={GlassSurfaceKnobs.MIN_BLUR_WIDTH}
                            max={GlassSurfaceKnobs.MAX_BLUR_WIDTH}
                            step={GlassSurfaceKnobs.BLUR_WIDTH_STEP}
                            ariaLabel={"Border blur"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    <PageProp itemKey={"blurRadius"} {...GlassSurfaceKnobs.BLUR_RADIUS_TEXT}>
                        <PageNumberField
                            value={blurRadius}
                            min={GlassSurfaceKnobs.MIN_BLUR_RADIUS}
                            max={GlassSurfaceKnobs.MAX_BLUR_RADIUS}
                            step={GlassSurfaceKnobs.BLUR_RADIUS_STEP}
                            ariaLabel={"Backdrop blur"}
                            onInput={setBlurRadius}
                        />
                    </PageProp>

                    <PageProp itemKey={"noiseFrequency"} {...GlassSurfaceKnobs.NOISE_FREQUENCY_TEXT}>
                        <PageNumberField
                            value={noiseFrequency}
                            min={GlassSurfaceKnobs.MIN_GRAIN_FREQUENCY}
                            max={GlassSurfaceKnobs.MAX_GRAIN_FREQUENCY}
                            step={GlassSurfaceKnobs.GRAIN_FREQUENCY_STEP}
                            ariaLabel={"Noise scale"}
                            onInput={setNoiseFrequency}
                        />
                    </PageProp>

                    <PageProp itemKey={"noiseOctaves"} {...GlassSurfaceKnobs.NOISE_OCTAVES_TEXT}>
                        <PageNumberField
                            value={noiseOctaves}
                            min={GlassSurfaceKnobs.MIN_GRAIN_OCTAVES}
                            max={GlassSurfaceKnobs.MAX_GRAIN_OCTAVES}
                            step={GlassSurfaceKnobs.GRAIN_OCTAVES_STEP}
                            ariaLabel={"Noise octaves"}
                            onInput={setNoiseOctaves}
                        />
                    </PageProp>

                    <PageProp itemKey={"rippleScale"} {...GlassSurfaceKnobs.RIPPLE_SCALE_TEXT}>
                        <PageNumberField
                            value={rippleScale}
                            min={GlassSurfaceKnobs.MIN_RIPPLE_SCALE}
                            max={GlassSurfaceKnobs.MAX_RIPPLE_SCALE}
                            step={GlassSurfaceKnobs.RIPPLE_SCALE_STEP}
                            ariaLabel={"Ripple bend"}
                            onInput={setRippleScale}
                        />
                    </PageProp>

                    <PageProp itemKey={"lightHeight"} {...GlassSurfaceKnobs.LIGHT_HEIGHT_TEXT}>
                        <PageNumberField
                            value={lightHeight}
                            min={GlassSurfaceKnobs.MIN_LIGHT_HEIGHT}
                            max={GlassSurfaceKnobs.MAX_LIGHT_HEIGHT}
                            step={GlassSurfaceKnobs.LIGHT_HEIGHT_STEP}
                            ariaLabel={"Light height"}
                            onInput={setLightHeight}
                        />
                    </PageProp>

                    <PageProp itemKey={"surfaceScale"} {...GlassSurfaceKnobs.SURFACE_SCALE_TEXT}>
                        <PageNumberField
                            value={surfaceScale}
                            min={GlassSurfaceKnobs.MIN_SURFACE_SCALE}
                            max={GlassSurfaceKnobs.MAX_SURFACE_SCALE}
                            step={GlassSurfaceKnobs.SURFACE_SCALE_STEP}
                            ariaLabel={"Sheen relief"}
                            onInput={setSurfaceScale}
                        />
                    </PageProp>

                    <PageProp itemKey={"specularConstant"} {...GlassSurfaceKnobs.SPECULAR_CONSTANT_TEXT}>
                        <PageNumberField
                            value={specularConstant}
                            min={GlassSurfaceKnobs.MIN_SPECULAR_CONSTANT}
                            max={GlassSurfaceKnobs.MAX_SPECULAR_CONSTANT}
                            step={GlassSurfaceKnobs.SPECULAR_CONSTANT_STEP}
                            ariaLabel={"Sheen brightness"}
                            onInput={setSpecularConstant}
                        />
                    </PageProp>

                    <PageProp itemKey={"specularExponent"} {...GlassSurfaceKnobs.SPECULAR_EXPONENT_TEXT}>
                        <PageNumberField
                            value={specularExponent}
                            min={GlassSurfaceKnobs.MIN_SPECULAR_EXPONENT}
                            max={GlassSurfaceKnobs.MAX_SPECULAR_EXPONENT}
                            step={GlassSurfaceKnobs.SPECULAR_EXPONENT_STEP}
                            ariaLabel={"Shininess"}
                            onInput={setSpecularExponent}
                        />
                    </PageProp>

                    <PageProp itemKey={"tintOpacity"} {...GlassSurfaceKnobs.TINT_OPACITY_TEXT}>
                        <PageNumberField
                            value={tintOpacity}
                            min={GlassSurfaceKnobs.MIN_TINT_OPACITY}
                            max={GlassSurfaceKnobs.MAX_TINT_OPACITY}
                            step={GlassSurfaceKnobs.TINT_OPACITY_STEP}
                            ariaLabel={"Tint opacity"}
                            onInput={setTintOpacity}
                        />
                    </PageProp>

                    <PageProp itemKey={"tintColor"} {...GlassSurfaceKnobs.TINT_COLOR_TEXT}>
                        <PageColorField value={tintColor} ariaLabel={"Tint color"} onInput={setTintColor} />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
