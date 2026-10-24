<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { Collapsible } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.css";

import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageCodeBox from "../CodeBox/CodeBox.vue";
import PageLayer from "../Layer/Layer.vue";
import PagePropsPanel from "../PropsPanel/PagePropsPanel.vue";
import { SourceViewUtils } from "../SourceView/SourceView.utils";
import type { SourceFile } from "../SourceView/SourceViewVue.types";
import type { PageDocsExampleProps, PageDocsExampleSlots } from "./DocsExampleVue.types";

const props = defineProps<PageDocsExampleProps>();

defineSlots<PageDocsExampleSlots>();

const file = shallowRef<SourceFile>();

watch(
    () => props.path,
    (path, _previous, onCleanup) => {
        let isCurrent = true;

        onCleanup(() => {
            isCurrent = false;
        });

        file.value = undefined;
        SourceViewUtils.loadFile(path).then((loaded) => {
            if (isCurrent) file.value = loaded;
        });
    },
    { immediate: true },
);
</script>

<template>
    <div :class="styles.docsExample" data-docs-example="">
        <PageLayer :level="1">
            <div :class="styles.docsExampleSection">
                <div :class="styles.docsExampleDemo" data-demo=""><slot /></div>

                <template v-if="$slots.renderKnobs">
                    <div :class="styles.docsExampleDivider" role="separator" aria-orientation="vertical" />

                    <div :class="styles.docsExampleKnobs">
                        <PagePropsPanel scope="local" :has-reset="false">
                            <slot name="renderKnobs" />
                        </PagePropsPanel>
                    </div>
                </template>
            </div>

            <Collapsible v-if="file" sizing="fill" is-panel-built-on-expand>
                <template #renderTrigger="flags">
                    <PageAccordionHeader :flags="flags">{{
                        flags.isExpanded ? "Hide code" : "Show code"
                    }}</PageAccordionHeader>
                </template>

                <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                    <PageAccordionPanel
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                    >
                        <PageCodeBox :source="file.source" />
                    </PageAccordionPanel>
                </template>
            </Collapsible>
        </PageLayer>
    </div>
</template>
