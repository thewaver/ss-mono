<script setup lang="ts">
import { shallowRef } from "vue";

import { FanMenu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { NOTHING_RUN } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import FanMenuFloater from "../FanMenuFloater.vue";
import FanMenuItem from "../FanMenuItem.vue";
import { ACTIONS, FAN_LAYOUT_DEFS, FAN_LAYOUT_SIZE } from "../FanMenuPageVue.const";
import type { FanAction } from "../FanMenuPageVue.types";
import FanMenuPopup from "../FanMenuPopup.vue";

const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <div :class="styles.stage">
        <FanMenu
            :layout-size="FAN_LAYOUT_SIZE"
            :layout-defs="FAN_LAYOUT_DEFS"
            :items="ACTIONS"
            ariaLabel="Edit actions"
            :placement="{ x: 'center', y: 'center' }"
            @activate="(action: FanAction) => (lastRun = action.name)"
        >
            <template #renderContent="flags">
                <PageMenuTriggerContent :flags="flags">Fan</PageMenuTriggerContent>
            </template>

            <template #renderItem="{ item, flags }">
                <FanMenuItem :item="item" :flags="flags" />
            </template>

            <template #renderHighlightFloater="{ visibilityTarget, transitionDurationMs }">
                <FanMenuFloater :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
            </template>

            <template #renderPopup="{ renderItems, visibilityTarget, transitionDurationMs }">
                <FanMenuPopup
                    :render-items="renderItems"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>
        </FanMenu>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
