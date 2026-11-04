<script setup lang="ts">
import { Radio } from "@thewaver/ss-components-vue";
import { computeSkinRowId } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";

import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.vue";
import SkinSamples from "./SkinSamples.vue";
import type { SkinRowProps } from "./SkinsPage.types";

defineProps<SkinRowProps>();
</script>

<template>
    <Radio :value="skin" :ariaLabel="label" sizing="fill">
        <template #renderContent="flags">
            <div :id="computeSkinRowId(skin)" :class="styles.skinRow">
                <div :class="styles.skinSampleBoundary">
                    <div :class="PLAYGROUND_SKINS[skin]">
                        <div :class="styles.skinSamples">
                            <PageRadioContent :flags="flags">{{ label }}</PageRadioContent>

                            <div :class="styles.skinColumns" inert aria-hidden="true">
                                <SkinSamples :skin="skin" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Radio>
</template>
