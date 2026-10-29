<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, ParticleDissolve } from "@thewaver/ss-components-vue";
import {
    ASH_ANIMATION,
    ASH_SRC,
    NO_EDGE_THICKNESSES,
    SVG_LABEL,
    SVG_SIZE,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ParticleDissolveSvgExampleProps } from "../ParticleDissolvePageVue.types";

type Props = ParticleDissolveSvgExampleProps;

const props = defineProps<Props>();

const isDissolved = shallowRef(false);

const dissolve = () => {
    isDissolved.value = true;
};

const rebuild = () => {
    isDissolved.value = false;
};

const path = computed(
    () =>
        ShapeUtils.getPaths(ShapeConst.getDefaultShapePoints(props.shapeKind, SVG_SIZE), NO_EDGE_THICKNESSES).outerPath,
);
</script>

<template>
    <div id="particleDissolveSvgStage" :class="styles.stack">
        <ParticleDissolve
            :is-dissolved="isDissolved"
            :angle-degrees="angleDegrees"
            :duration-ms="durationMs"
            :particle-lifetime-ms="particleLifetimeMs"
            :feather-share="featherShare"
            :spawn-chance="spawnChance"
            :cell-size="cellSize"
            :src="ASH_SRC"
            :compute-particle-animation="ASH_ANIMATION"
        >
            <svg
                :class="styles.svgShape"
                :width="SVG_SIZE.width"
                :height="SVG_SIZE.height"
                role="img"
                aria-label="The shape that dissolves"
            >
                <path :class="styles.svgShapePath" :d="path" />
                <text :class="styles.svgShapeText" x="50%" y="50%">{{ SVG_LABEL }}</text>
            </svg>
        </ParticleDissolve>

        <div :class="styles.buttonRow">
            <Button id="particleDissolveSvgBurn" @click="dissolve">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Dissolve</PageButtonContent>
                </template>
            </Button>
            <Button id="particleDissolveSvgRebuild" @click="rebuild">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Rebuild</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
