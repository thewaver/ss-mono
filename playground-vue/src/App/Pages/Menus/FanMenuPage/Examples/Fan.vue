<script setup lang="ts">
import { FanMenu } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import PageLayer from "../../../../PageComponents/Layer/Layer.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import type { FanMenuExampleProps } from "../FanMenuPage.types";

const BACK_MARK = "‹";
const SUBMENU_MARK = "›";

const props = defineProps<FanMenuExampleProps>();
</script>

<template>
    <div :class="styles.stage">
        <FanMenu
            layout-size="192px"
            :layout-defs="{ curveHeightRatio: 1, itemWidthRatio: 0.5, itemHeightRatio: 0.2381 }"
            :items="items"
            ariaLabel="Edit actions"
            :placement="{ x: 'center', y: 'center' }"
            @activate="props.onActivate"
        >
            <template #renderContent="flags">
                <PageMenuTriggerContent :flags="flags">{{ caption }}</PageMenuTriggerContent>
            </template>

            <template #renderItem="{ item, flags }">
                <div
                    :class="[
                        styles.item,
                        flags.isBack && styles.itemBack,
                        flags.isHighlighted && styles.itemHighlighted,
                        flags.isDisabled && styles.itemDisabled,
                    ]"
                >
                    <span v-if="flags.isBack" aria-hidden="true">{{ BACK_MARK }}</span>

                    <span>{{ item.value.name }}</span>

                    <span v-if="!flags.isBack && item.value.shortcut" :class="styles.shortcut">{{
                        item.value.shortcut
                    }}</span>

                    <span v-if="flags.hasSubmenu" aria-hidden="true">{{ SUBMENU_MARK }}</span>
                </div>
            </template>

            <template #renderHighlightFloater="{ visibilityTarget, transitionDurationMs }">
                <div
                    :class="[styles.itemFloater, visibilityTarget === 1 && styles.itemFloaterVisible]"
                    :style="{ transitionDuration: `${transitionDurationMs}ms` }"
                    data-floater="highlight"
                />
            </template>

            <template #renderPopup="{ renderItems, visibilityTarget, transitionDurationMs }">
                <div
                    :class="[styles.layer, visibilityTarget === 1 && styles.layerVisible]"
                    :style="{ transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms` }"
                >
                    <PageLayer :level="2"><component :is="renderItems" /></PageLayer>
                </div>
            </template>
        </FanMenu>
    </div>
</template>
