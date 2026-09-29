<script setup lang="ts">
import { shallowRef, useId } from "vue";

import { Button, SVGDefsSamples, Shape, TrackedGradientDefaults } from "@thewaver/ss-components-vue";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { TrackedGradientKnobs } from "../../../../Knobs/TrackedGradients.const";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";

const props = defineProps<TrackedGradientExampleProps>();

const id = useId();

const isShown = shallowRef(false);

const show = () => {
    isShown.value = true;
};

const hide = () => {
    isShown.value = false;
};

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);

const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
    const key = props.configKey;

    if (key === NO_SAMPLE_KEY) return [];

    const defaults = TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>;
    const values = props.configDefs;
    const scaledValues = Object.fromEntries(
        TrackedGradientKnobs.OVERLAY_SCALED_KEYS.filter((name) => name in defaults).map((name) => [
            name,
            ((values[name] ?? defaults[name]) as number) * TrackedGradientKnobs.OVERLAY_SCALE_FACTOR,
        ]),
    );

    return SVGDefsSamples.Gradient.Tracked.toConfig({
        family: key,
        defs: { ...values, ...scaledValues },
    } as SVGDefsSamples.Gradient.Tracked.Entry)
        .computeSVGDefs(`overlay-${id}`, undefined, element, {
            getSize: () => size,
            colors: props.colors,
            blurWidth: props.blurWidth,
        })
        .filter((def) => def.gradientOrPattern);
};
</script>

<template>
    <Button @click="show">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Track the pointer across the screen</PageButtonContent>
        </template>
    </Button>

    <Teleport v-if="isShown" to="body">
        <div>
            <div :class="styles.screenOverlay">
                <Shape :compute-points="computePoints" :compute-fill-defs="computeDefs">
                    <template #renderChildren>
                        <div :class="styles.screenOverlayBox" />
                    </template>
                </Shape>
            </div>

            <div :class="styles.screenOverlayClose">
                <Button @click="hide">
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">Close pointer-tracking overlay</PageButtonContent>
                    </template>
                </Button>
            </div>
        </div>
    </Teleport>
</template>
