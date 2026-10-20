<script setup lang="ts">
import { Shape } from "@thewaver/ss-components-vue";
import {
    FILL_OPACITY,
    STROKE_GEOM,
} from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.css";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageFormationItemProps } from "./FormationContentVue.types";

const props = defineProps<PageFormationItemProps>();

const layerClass = useLayerClass();

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, size);
const computeFillDefs = () => [{ color: layerVars.main, opacity: FILL_OPACITY }];
const computeStrokeDefs = () => [{ color: themeVars.color.primary.main }];
</script>

<template>
    <div :class="[styles.formationItem, layerClass]">
        <Shape
            :compute-points="computePoints"
            :compute-fill-defs="computeFillDefs"
            :compute-stroke-defs="computeStrokeDefs"
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
