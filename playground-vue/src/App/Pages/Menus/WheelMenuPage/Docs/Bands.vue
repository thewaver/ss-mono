<script setup lang="ts">
import { shallowRef, useId } from "vue";

import { WheelMenu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BAND_WIDTH,
    HOLE_RADIUS,
    LAYOUT_SIZE,
    LEVEL_GAP,
    NOTHING_RUN,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import WheelGradientDefs from "../WheelGradientDefs.vue";
import WheelMenuItem from "../WheelMenuItem.vue";
import { CLOSER_DEFS, NESTED_ACTIONS } from "../WheelMenuPageVue.const";
import type { WheelAction, WheelMenuBandsDocsExampleProps } from "../WheelMenuPageVue.types";
import WheelMenuPopup from "../WheelMenuPopup.vue";

type Props = WheelMenuBandsDocsExampleProps;

defineProps<Props>();

const gradientId = useId();

const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <div :class="styles.stage">
        <WheelGradientDefs :gradient-id="gradientId" />

        <WheelMenu
            :layout-size="LAYOUT_SIZE"
            :items="NESTED_ACTIONS"
            ariaLabel="Edit actions"
            :spread-degrees="spreadDegrees"
            :hole-radius="HOLE_RADIUS"
            :band-width="BAND_WIDTH"
            :level-gap="LEVEL_GAP"
            :placement="{ x: 'center', y: 'center' }"
            :closer-defs="CLOSER_DEFS"
            @activate="(action: WheelAction) => (lastRun = action.name)"
        >
            <template #renderContent="flags">
                <PageMenuTriggerContent :flags="flags">Wheel</PageMenuTriggerContent>
            </template>

            <template #renderItem="{ item, flags, placement }">
                <WheelMenuItem :gradient-id="gradientId" :item="item" :flags="flags" :placement="placement" />
            </template>

            <template #renderPopup="{ renderItems, visibilityTarget, transitionDurationMs }">
                <WheelMenuPopup
                    :render-items="renderItems"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>
        </WheelMenu>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
