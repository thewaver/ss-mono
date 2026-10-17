<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, CornerHighlight } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CornerHighlightExampleProps } from "../CornerHighlightPageVue.types";

type Props = CornerHighlightExampleProps;

defineProps<Props>();

const count = shallowRef(0);

const press = () => {
    count.value = count.value + 1;
};
</script>

<template>
    <div :class="styles.panel">
        <CornerHighlight
            :color="color"
            :corner-length="cornerLength"
            :stroke-thickness="strokeThickness"
            :transition-duration-ms="transitionDurationMs"
            :visible-corners="visibleCorners"
        >
            <div :class="styles.panelBody">
                <div>
                    The brackets sit on a layer of their own above this text, and that layer takes no pointer and is
                    hidden from a screen reader.
                </div>

                <Button @click="press">
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">{{ `Pressed ${count}` }}</PageButtonContent>
                    </template>
                </Button>
            </div>
        </CornerHighlight>
    </div>
</template>
