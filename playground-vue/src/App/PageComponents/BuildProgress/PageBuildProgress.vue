<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from "vue";

import { Button, Progress, Sidebar } from "@thewaver/ss-components-vue";
import {
    BUILD_PROGRESS_DISMISS_LABEL,
    BUILD_PROGRESS_HEIGHT,
    BUILD_PROGRESS_LABEL,
} from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.css";
import type { BuildProgress } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.types";
import {
    computeBuildProgressCount,
    computeBuildProgressText,
    getIsBuilding,
    observeBuildProgress,
} from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";

import PageSelectClear from "../../StyledComponents/SelectClear/SelectClear.vue";
import PageLayer from "../Layer/Layer.vue";

const PERCENT = 100;

const progress = shallowRef<BuildProgress>();
const dismissedGeneration = shallowRef<number>();

onBeforeUnmount(observeBuildProgress((next) => (progress.value = next)));

const isShown = computed(
    () => getIsBuilding(progress.value) && progress.value?.generation !== dismissedGeneration.value,
);

const dismiss = () => {
    dismissedGeneration.value = progress.value?.generation;
};
</script>

<template>
    <Sidebar edge="top" :collapsed-size="0" :expanded-size="BUILD_PROGRESS_HEIGHT" :expanded="isShown">
        <template #renderContent="{ phase }">
            <PageLayer :level="1">
                <div :class="styles.buildProgressClip">
                    <div :class="[styles.buildProgressStrip, phase === 'collapsed' && styles.isHidden]">
                        <Progress
                            :ariaLabel="BUILD_PROGRESS_LABEL"
                            :ariaValueText="computeBuildProgressCount(progress)"
                            :value="progress?.total === undefined ? undefined : progress.built"
                            :max="progress?.total"
                            sizing="fill"
                        >
                            <template #renderContent="state">
                                <div :class="styles.buildProgressBar">
                                    <div
                                        :class="styles.buildProgressFill"
                                        :style="{ width: `${(state.ratio ?? 0) * PERCENT}%` }"
                                    />

                                    <span :class="styles.buildProgressText" aria-hidden="true">
                                        {{ computeBuildProgressText(progress) }}
                                    </span>
                                </div>
                            </template>
                        </Progress>

                        <div :class="styles.buildProgressDismiss">
                            <Button :ariaLabel="BUILD_PROGRESS_DISMISS_LABEL" @click="dismiss">
                                <template #renderContent="flags">
                                    <PageSelectClear :flags="flags" />
                                </template>
                            </Button>
                        </div>
                    </div>
                </div>
            </PageLayer>
        </template>
    </Sidebar>
</template>
