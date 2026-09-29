<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { SVGDefsColors } from "@thewaver/ss-components-vue";
import { DEFAULT_GLASS_DEFS, SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-vue";
import { GlassSurfaceKnobs } from "@thewaver/ss-playground/App/Knobs/GlassSurfaces.const";
import {
    NO_SAMPLE_KEY,
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";

import { TrackedGradientKnobs } from "../../Knobs/TrackedGradients.const";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import PageKnobs from "../../PageComponents/Knobs/Knobs.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.vue";
import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import type { GlassSurfaceExampleProps } from "./GlassSurfacePage.types";

const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_ENTRIES);

const STROKE_GROUPS = toGroupEntriesWithNoSample(GROUPPED_GRADIENTS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/GlassSurfacePage/Examples/Default.vue";

const borderRadius = shallowRef(BORDER_RADIUS_FULL);
const borderWidth = shallowRef(GlassSurfaceKnobs.STARTING_BORDER_WIDTH);
const strokeConfigKey = shallowRef<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
    GlassSurfaceKnobs.STARTING_STROKE_CONFIG_KEY,
);
const strokeConfigDefsByKey = shallowRef<Record<string, Record<string, number | boolean>>>({});

const strokeKnobs = computed(() =>
    strokeConfigKey.value === NO_SAMPLE_KEY
        ? {}
        : (TrackedGradientKnobs.KNOBS_BY_FAMILY[strokeConfigKey.value] as Record<string, Knob>),
);
const strokeDefaults = computed(() =>
    strokeConfigKey.value === NO_SAMPLE_KEY
        ? {}
        : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[strokeConfigKey.value] as Record<string, unknown>),
);
const strokeConfigDefs = computed(() => strokeConfigDefsByKey.value[strokeConfigKey.value] ?? {});
const blurWidth = shallowRef(GlassSurfaceKnobs.STARTING_BLUR_WIDTH);
const blurRadius = shallowRef(DEFAULT_GLASS_DEFS.backdrop.blurRadius);
const rippleScale = shallowRef(DEFAULT_GLASS_DEFS.ripple.scale);
const noiseFrequency = shallowRef(DEFAULT_GLASS_DEFS.noise.frequency);
const noiseOctaves = shallowRef(DEFAULT_GLASS_DEFS.noise.octaves);
const lightHeight = shallowRef(DEFAULT_GLASS_DEFS.sheen.lightHeight);
const surfaceScale = shallowRef(DEFAULT_GLASS_DEFS.sheen.surfaceScale);
const specularConstant = shallowRef(DEFAULT_GLASS_DEFS.sheen.specularConstant);
const specularExponent = shallowRef(DEFAULT_GLASS_DEFS.sheen.specularExponent);
const tintColor = shallowRef(DEFAULT_GLASS_DEFS.tint.color);
const tintOpacity = shallowRef(DEFAULT_GLASS_DEFS.tint.opacity);
const colors = shallowRef<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS_MONO });

const colorKeys = computed(() => Object.keys(colors.value) as (keyof SVGDefsColors)[]);

const commonProps = computed<GlassSurfaceExampleProps>(() => ({
    borderRadius: borderRadius.value,
    borderWidth: borderWidth.value,
    strokeConfigKey: strokeConfigKey.value,
    strokeConfigDefs: strokeConfigDefs.value,
    colors: colors.value,
    blurWidth: blurWidth.value,
    blurRadius: blurRadius.value,
    rippleScale: rippleScale.value,
    noiseFrequency: noiseFrequency.value,
    noiseOctaves: noiseOctaves.value,
    lightHeight: lightHeight.value,
    surfaceScale: surfaceScale.value,
    specularConstant: specularConstant.value,
    specularExponent: specularExponent.value,
    tintColor: tintColor.value,
    tintOpacity: tintOpacity.value,
}));

const setStrokeConfigDef = (key: string, value: number | boolean) => {
    strokeConfigDefsByKey.value = {
        ...strokeConfigDefsByKey.value,
        [strokeConfigKey.value]: { ...strokeConfigDefsByKey.value[strokeConfigKey.value], [key]: value },
    };
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        path: DEFAULT_EXAMPLE_PATH,
    },
];
</script>

<template>
    <PagePropsGroups>
        <PagePropsPanel scope="sample">
            <PageProp
                item-key="strokeConfigKey"
                label="Border pattern"
                hint="Which pointer-following gradient lights the panel's edge. Choosing one brings its own knobs with it."
            >
                <PageGroupedSelectField
                    :value="strokeConfigKey"
                    :groups="STROKE_GROUPS"
                    ariaLabel="Border pattern"
                    @change="
                        (value: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>) => (strokeConfigKey = value)
                    "
                />
            </PageProp>

            <PageKnobs
                :knobs="strokeKnobs"
                :defaults="strokeDefaults"
                :values="strokeConfigDefs"
                @input="setStrokeConfigDef"
            />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope="global">
            <PageProp
                item-key="borderRadius"
                label="Corner radius (px)"
                hint="How far the panel's corners are rounded."
            >
                <PageNumberField
                    :value="borderRadius"
                    :min="GlassSurfaceKnobs.MIN_BORDER_RADIUS"
                    :max="GlassSurfaceKnobs.MAX_BORDER_RADIUS"
                    :step="GlassSurfaceKnobs.BORDER_RADIUS_STEP"
                    ariaLabel="Corner radius"
                    @input="(value: number) => (borderRadius = value)"
                />
            </PageProp>

            <PageProp
                item-key="borderWidth"
                label="Border width (px)"
                hint="How thick the lit edge around the panel is."
            >
                <PageNumberField
                    :value="borderWidth"
                    :min="GlassSurfaceKnobs.MIN_BORDER_WIDTH"
                    :max="GlassSurfaceKnobs.MAX_BORDER_WIDTH"
                    :step="GlassSurfaceKnobs.BORDER_WIDTH_STEP"
                    ariaLabel="Border width"
                    @input="(value: number) => (borderWidth = value)"
                />
            </PageProp>

            <PageProp item-key="colors" label="Border Colors" hint="The colors the edge light is painted from.">
                <div :class="styles.colorList">
                    <PageColorField
                        v-for="key in colorKeys"
                        :key="key"
                        :value="colors[key]"
                        :ariaLabel="key"
                        @input="(value: string) => (colors = { ...colors, [key]: value })"
                    />
                </div>
            </PageProp>

            <PageProp
                item-key="blurWidth"
                label="Border blur (px)"
                hint="How far the edge light bleeds outward, which is what makes it glow rather than sit flat."
            >
                <PageNumberField
                    :value="blurWidth"
                    :min="GlassSurfaceKnobs.MIN_BLUR_WIDTH"
                    :max="GlassSurfaceKnobs.MAX_BLUR_WIDTH"
                    :step="GlassSurfaceKnobs.BLUR_WIDTH_STEP"
                    ariaLabel="Border blur"
                    @input="(value: number) => (blurWidth = value)"
                />
            </PageProp>

            <PageProp
                item-key="blurRadius"
                label="Backdrop blur (px)"
                hint="How far whatever is behind the panel is blurred as it shows through."
            >
                <PageNumberField
                    :value="blurRadius"
                    :min="GlassSurfaceKnobs.MIN_BLUR_RADIUS"
                    :max="GlassSurfaceKnobs.MAX_BLUR_RADIUS"
                    :step="GlassSurfaceKnobs.BLUR_RADIUS_STEP"
                    ariaLabel="Backdrop blur"
                    @input="(value: number) => (blurRadius = value)"
                />
            </PageProp>

            <PageProp
                item-key="noiseFrequency"
                label="Noise scale"
                hint="How fine the grain dusted over the glass is. Higher numbers make a tighter grain."
            >
                <PageNumberField
                    :value="noiseFrequency"
                    :min="GlassSurfaceKnobs.MIN_GRAIN_FREQUENCY"
                    :max="GlassSurfaceKnobs.MAX_GRAIN_FREQUENCY"
                    :step="GlassSurfaceKnobs.GRAIN_FREQUENCY_STEP"
                    ariaLabel="Noise scale"
                    @input="(value: number) => (noiseFrequency = value)"
                />
            </PageProp>

            <PageProp
                item-key="noiseOctaves"
                label="Noise octaves"
                hint="How many layers of grain are piled up. More layers add fine detail and cost more to draw."
            >
                <PageNumberField
                    :value="noiseOctaves"
                    :min="GlassSurfaceKnobs.MIN_GRAIN_OCTAVES"
                    :max="GlassSurfaceKnobs.MAX_GRAIN_OCTAVES"
                    :step="GlassSurfaceKnobs.GRAIN_OCTAVES_STEP"
                    ariaLabel="Noise octaves"
                    @input="(value: number) => (noiseOctaves = value)"
                />
            </PageProp>

            <PageProp
                item-key="rippleScale"
                label="Ripple bend (px)"
                hint="How far the glass bends what is behind it, as though it were not quite flat. 0 leaves it looking like a window."
            >
                <PageNumberField
                    :value="rippleScale"
                    :min="GlassSurfaceKnobs.MIN_RIPPLE_SCALE"
                    :max="GlassSurfaceKnobs.MAX_RIPPLE_SCALE"
                    :step="GlassSurfaceKnobs.RIPPLE_SCALE_STEP"
                    ariaLabel="Ripple bend"
                    @input="(value: number) => (rippleScale = value)"
                />
            </PageProp>

            <PageProp
                item-key="lightHeight"
                label="Light height"
                hint="How far above the panel the light lighting the sheen is placed. Lower puts it closer and makes the highlight tighter."
            >
                <PageNumberField
                    :value="lightHeight"
                    :min="GlassSurfaceKnobs.MIN_LIGHT_HEIGHT"
                    :max="GlassSurfaceKnobs.MAX_LIGHT_HEIGHT"
                    :step="GlassSurfaceKnobs.LIGHT_HEIGHT_STEP"
                    ariaLabel="Light height"
                    @input="(value: number) => (lightHeight = value)"
                />
            </PageProp>

            <PageProp
                item-key="surfaceScale"
                label="Sheen relief"
                hint="How deep the relief the sheen is shaded against is. 0 leaves the surface flat and kills the highlight."
            >
                <PageNumberField
                    :value="surfaceScale"
                    :min="GlassSurfaceKnobs.MIN_SURFACE_SCALE"
                    :max="GlassSurfaceKnobs.MAX_SURFACE_SCALE"
                    :step="GlassSurfaceKnobs.SURFACE_SCALE_STEP"
                    ariaLabel="Sheen relief"
                    @input="(value: number) => (surfaceScale = value)"
                />
            </PageProp>

            <PageProp
                item-key="specularConstant"
                label="Sheen brightness"
                hint="How strong the sheen highlight is overall."
            >
                <PageNumberField
                    :value="specularConstant"
                    :min="GlassSurfaceKnobs.MIN_SPECULAR_CONSTANT"
                    :max="GlassSurfaceKnobs.MAX_SPECULAR_CONSTANT"
                    :step="GlassSurfaceKnobs.SPECULAR_CONSTANT_STEP"
                    ariaLabel="Sheen brightness"
                    @input="(value: number) => (specularConstant = value)"
                />
            </PageProp>

            <PageProp
                item-key="specularExponent"
                label="Shininess"
                hint="How tightly the sheen highlight is focused: low is a broad soft gleam, high is a small hard glint."
            >
                <PageNumberField
                    :value="specularExponent"
                    :min="GlassSurfaceKnobs.MIN_SPECULAR_EXPONENT"
                    :max="GlassSurfaceKnobs.MAX_SPECULAR_EXPONENT"
                    :step="GlassSurfaceKnobs.SPECULAR_EXPONENT_STEP"
                    ariaLabel="Shininess"
                    @input="(value: number) => (specularExponent = value)"
                />
            </PageProp>

            <PageProp
                item-key="tintOpacity"
                label="Tint opacity"
                hint="How strongly the panel is colored. 0 leaves it clear."
            >
                <PageNumberField
                    :value="tintOpacity"
                    :min="GlassSurfaceKnobs.MIN_TINT_OPACITY"
                    :max="GlassSurfaceKnobs.MAX_TINT_OPACITY"
                    :step="GlassSurfaceKnobs.TINT_OPACITY_STEP"
                    ariaLabel="Tint opacity"
                    @input="(value: number) => (tintOpacity = value)"
                />
            </PageProp>

            <PageProp item-key="tintColor" label="Tint color" hint="The color the panel itself is tinted with.">
                <PageColorField
                    :value="tintColor"
                    ariaLabel="Tint color"
                    @input="(value: string) => (tintColor = value)"
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
