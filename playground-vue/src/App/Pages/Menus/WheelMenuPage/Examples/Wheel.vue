<script setup lang="ts">
import { h, useId } from "vue";

import { PlacementUtils, WheelMenu } from "@thewaver/ss-components-vue";
import type { PlacementRect, WheelMenuCloserDefs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import PageLayer from "../../../../PageComponents/Layer/Layer.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import type { WheelMenuExampleProps } from "../WheelMenuPage.types";
import WedgeDefs from "./WedgeDefs.vue";

const HALF = 0.5;
const SUBMENU_MARK = "›";
const CLOSER_MARK = "✕";

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

const WHEEL_HOLE_RADIUS = 64;
const WHEEL_BAND_WIDTH = 84;
const WHEEL_LEVEL_GAP = 8;

const CLOSER_DEFS: WheelMenuCloserDefs = {
    ariaLabel: "Close the wheel",
    renderContent: (flags) =>
        h(
            "div",
            { "class": [styles.closer, flags.isHighlighted && styles.closerHighlighted], "aria-hidden": "true" },
            CLOSER_MARK,
        ),
};

const props = defineProps<WheelMenuExampleProps>();

const gradientId = useId();
</script>

<template>
    <div :class="styles.stage">
        <WedgeDefs :gradient-id="gradientId" />

        <WheelMenu
            layout-size="368px"
            :items="items"
            ariaLabel="Edit actions"
            :spread-degrees="spreadDegrees"
            :opens-on-hold="opensOnHold"
            :layout-defs="layoutDefs"
            :hole-radius="holeRadius ?? WHEEL_HOLE_RADIUS"
            :band-width="bandWidth ?? WHEEL_BAND_WIDTH"
            :level-gap="WHEEL_LEVEL_GAP"
            :placement="{ x: 'center', y: 'center' }"
            :closer-defs="CLOSER_DEFS"
            @activate="props.onActivate"
        >
            <template #renderContent="flags">
                <PageMenuTriggerContent :flags="flags">{{ caption }}</PageMenuTriggerContent>
            </template>

            <template #renderItem="{ item, flags, placement }">
                <template v-if="placement?.sector">
                    <svg :class="styles.canvas" :viewBox="toViewBox(placement)" aria-hidden="true">
                        <path
                            :class="[styles.wedge, flags.isDisabled && styles.wedgeDisabled]"
                            :style="{ fill: flags.isHighlighted ? `url(#${gradientId})` : undefined }"
                            :d="PlacementUtils.getSectorPath(placement.sector)"
                        />
                    </svg>

                    <div :class="[styles.label, flags.isHighlighted && styles.labelHighlighted]">
                        <span>{{ item.value.name }}</span>

                        <span v-if="item.value.shortcut" :class="styles.shortcut">{{ item.value.shortcut }}</span>

                        <span v-if="flags.hasSubmenu" aria-hidden="true">{{ SUBMENU_MARK }}</span>
                    </div>
                </template>
            </template>

            <template #renderPopup="{ renderItems, visibilityTarget, transitionDurationMs }">
                <div
                    :class="[styles.layer, visibilityTarget === 1 && styles.layerVisible]"
                    :style="{ transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms` }"
                >
                    <PageLayer :level="2"><component :is="renderItems" /></PageLayer>
                </div>
            </template>
        </WheelMenu>
    </div>
</template>
