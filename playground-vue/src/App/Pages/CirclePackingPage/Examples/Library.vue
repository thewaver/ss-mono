<script setup lang="ts">
import { useModel } from "vue";

import { CirclePacking, TreemapUtils } from "@thewaver/ss-components-vue";
import type { CirclePackingNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

import PageCirclePackingCircle from "../../../StyledComponents/CirclePackingContent/PageCirclePackingCircle.vue";
import PageCirclePackingFrame from "../../../StyledComponents/CirclePackingContent/PageCirclePackingFrame.vue";
import PageCirclePackingLabel from "../../../StyledComponents/CirclePackingContent/PageCirclePackingLabel.vue";
import type { CirclePackingExampleProps } from "../CirclePackingPage.types";

type Props = CirclePackingExampleProps;

const getTitle = (node: CirclePackingNode<string>, weight: number) =>
    `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

const props = defineProps<Props>();

const branch = useModel(props, "branch");
</script>

<template>
    <div :class="styles.frame">
        <PageCirclePackingFrame>
            <CirclePacking
                v-model:branch="branch"
                :root="LIBRARY"
                :padding="padding"
                :zoom-duration-ms="zoomDurationMs"
                ariaLabel="The library's source, by lines of code"
            >
                <template #renderCircle="{ node, state }">
                    <PageCirclePackingCircle :state="state" :title="getTitle(node, state.weight)" />
                </template>

                <template #renderLabel="{ node, state }">
                    <PageCirclePackingLabel :state="state" :name="node.value" />
                </template>
            </CirclePacking>
        </PageCirclePackingFrame>
    </div>
</template>
