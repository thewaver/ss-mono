<script setup lang="ts">
import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.css";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { ShapeConst } from "@thewaver/ss-utils";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageFormationItemProps } from "./FormationContent.types";

const EDGE_THICKNESSES = [2];
const STROKE_GEOM = [{ thicknesses: EDGE_THICKNESSES }];
const FILL_OPACITY = 0.75;

defineProps<PageFormationItemProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.formationItem, layerClass]">
        <Shape
            :compute-points="(size) => ShapeConst.getDefaultShapePoints(shapeKind, size)"
            :compute-fill-defs="() => [{ color: layerVars.main, opacity: FILL_OPACITY }]"
            :compute-stroke-defs="() => [{ color: themeVars.color.primary.main }]"
            :stroke-geom="STROKE_GEOM"
        >
            <template #renderChildren>
                <div :class="styles.formationItemContent">
                    <div :class="styles.formationItemRank">{{ state.index + 1 }}</div>

                    <slot />
                </div>
            </template>
        </Shape>
    </div>
</template>
