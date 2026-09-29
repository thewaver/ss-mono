<script setup lang="ts">
import { computed, useModel } from "vue";

import { Button, Sunburst, TreemapUtils } from "@thewaver/ss-components-vue";
import type { SunburstNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SunburstPage/SunburstPage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
import { PAGE_SUNBURST_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

import PageSunburstArc from "../../../StyledComponents/SunburstContent/PageSunburstArc.vue";
import PageSunburstHub from "../../../StyledComponents/SunburstContent/PageSunburstHub.vue";
import type { SunburstExampleProps } from "../SunburstPage.types";

const PARENT_FROM_END = 2;
const ROOT_ONLY = 1;
const TOP_LEVEL = 1;
const HALF_PERCENT = 50;

type Props = SunburstExampleProps;

const getFamily = (node: SunburstNode<string>) => {
    const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL] ?? node;
    const index = Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0);

    return PAGE_SUNBURST_FAMILIES[index % PAGE_SUNBURST_FAMILIES.length];
};

const getTitle = (node: SunburstNode<string>, weight: number) =>
    `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

const props = defineProps<Props>();

const branch = useModel(props, "branch");

const weights = TreemapUtils.computeWeights(LIBRARY);

const path = computed(() => TreemapUtils.findPath(LIBRARY, branch.value) ?? [LIBRARY]);

const hubInset = computed(() => `${(props.ringCount / (props.ringCount + ROOT_ONLY)) * HALF_PERCENT}%`);

const goUp = () => {
    const parent = path.value[path.value.length - PARENT_FROM_END];

    if (parent) branch.value = parent;
};
</script>

<template>
    <div :class="styles.frame">
        <Sunburst
            :root="LIBRARY"
            v-model:branch="branch"
            :ring-count="ringCount"
            :zoom-duration-ms="zoomDurationMs"
            ariaLabel="The library's source, by lines of code"
        >
            <template #renderArc="{ node, state }">
                <PageSunburstArc
                    :state="state"
                    :family="getFamily(node)"
                    :name="node.value"
                    :title="getTitle(node, state.weight)"
                />
            </template>
        </Sunburst>

        <div :class="styles.hub" :style="{ inset: hubInset }">
            <Button id="sunburstUp" sizing="fill" :is-disabled="path.length <= ROOT_ONLY" @click="goUp">
                <template #renderContent="flags">
                    <PageSunburstHub
                        :flags="flags"
                        :name="branch.value"
                        :weight="formatLines(weights.get(branch) ?? 0)"
                    />
                </template>
            </Button>
        </div>
    </div>
</template>
