<script setup lang="ts">
import { computed, useModel } from "vue";

import { Button, Treemap, TreemapUtils } from "@thewaver/ss-components-vue";
import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.css";

import PageTreemapBar from "../../../StyledComponents/TreemapContent/PageTreemapBar.vue";
import PageTreemapTile from "../../../StyledComponents/TreemapContent/PageTreemapTile.vue";
import type { TreemapExampleProps } from "../TreemapPage.types";

const PARENT_FROM_END = 2;
const ROOT_ONLY = 1;

type Props = TreemapExampleProps;

const props = defineProps<Props>();

const branch = useModel(props, "branch");

const weights = TreemapUtils.computeWeights(LIBRARY);

const path = computed(() => TreemapUtils.findPath(LIBRARY, branch.value) ?? [LIBRARY]);

const goUp = () => {
    const parent = path.value[path.value.length - PARENT_FROM_END];

    if (parent) branch.value = parent;
};
</script>

<template>
    <div :class="styles.frame">
        <Button id="treemapUp" sizing="fill" :is-disabled="path.length <= ROOT_ONLY" @click="goUp">
            <template #renderContent="flags">
                <PageTreemapBar
                    :flags="flags"
                    :path="path.map((node) => node.value).join('/')"
                    :weight="formatLines(weights.get(branch) ?? 0)"
                />
            </template>
        </Button>

        <div :class="styles.chart">
            <Treemap
                v-model:branch="branch"
                :root="LIBRARY"
                :zoom-duration-ms="zoomDurationMs"
                ariaLabel="The library's source, by lines of code"
            >
                <template #renderTile="{ node, state }">
                    <PageTreemapTile :name="node.value" :weight="formatLines(state.weight)" :is-branch="state.isBranch" />
                </template>
            </Treemap>
        </div>
    </div>
</template>
