<script setup lang="ts">
import { useModel } from "vue";

import { Icicle, TreemapUtils } from "@thewaver/ss-components-vue";
import type { IcicleNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/IciclePage/IciclePage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
import { PAGE_ICICLE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

import PageIcicleCell from "../../../StyledComponents/IcicleContent/IcicleContent.vue";
import type { IcicleExampleProps } from "../IciclePage.types";

const TOP_LEVEL = 1;

type Props = IcicleExampleProps;

const getFamily = (node: IcicleNode<string>) => {
    const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL];

    if (!topLevel) return undefined;

    return PAGE_ICICLE_FAMILIES[Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0) % PAGE_ICICLE_FAMILIES.length];
};

const getTitle = (node: IcicleNode<string>, weight: number) =>
    `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

const props = defineProps<Props>();

const focus = useModel(props, "focus");
</script>

<template>
    <div :class="styles.frame">
        <Icicle
            v-model:focus="focus"
            :root="LIBRARY"
            :column-count="columnCount"
            :zoom-duration-ms="zoomDurationMs"
            ariaLabel="The library's source, by lines of code"
        >
            <template #renderCell="{ node, state }">
                <PageIcicleCell
                    :state="state"
                    :family="getFamily(node)"
                    :name="node.value"
                    :weight="formatLines(state.weight)"
                    :title="getTitle(node, state.weight)"
                />
            </template>
        </Icicle>
    </div>
</template>
