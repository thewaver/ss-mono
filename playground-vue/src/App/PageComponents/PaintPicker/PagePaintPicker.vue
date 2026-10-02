<script setup lang="ts">
import { computed } from "vue";

import PageGroupedSelectField from "../Field/PageGroupedSelectField.vue";
import PageSelectField from "../Field/PageSelectField.vue";
import PageKnobs from "../Knobs/Knobs.vue";
import PageProp from "../Prop/Prop.vue";
import PagePropsPanel from "../PropsPanel/PagePropsPanel.vue";
import { PAINT_KINDS, PAINT_KIND_LABELS, SAMPLE_GROUPS, getPaintDefaults, getPaintKnobs } from "./PaintPicker.const";
import type { PagePaintPickerProps, PaintKind } from "./PaintPicker.types";

const props = defineProps<PagePaintPickerProps>();

const paint = computed(() => props.paintSlot.paint.value);
const sampleKind = computed(() => (paint.value.kind === "solid" ? undefined : paint.value.kind));
</script>

<template>
    <PagePropsPanel scope="sample">
        <PageProp :item-key="`${name}Kind`" :label="label" :hint="hint">
            <PageSelectField
                :value="paint.kind"
                :values="PAINT_KINDS"
                :compute-label="(kind: PaintKind) => PAINT_KIND_LABELS[kind]"
                :ariaLabel="label"
                @change="paintSlot.setKind"
            />
        </PageProp>

        <PageProp
            v-if="sampleKind"
            :key="sampleKind"
            :item-key="`${name}Key`"
            :label="PAINT_KIND_LABELS[sampleKind]"
            hint="Which sample paints it. Choosing one brings its own knobs with it."
        >
            <PageGroupedSelectField
                :value="paint.key"
                :groups="SAMPLE_GROUPS[sampleKind]"
                :ariaLabel="`${label} ${PAINT_KIND_LABELS[sampleKind].toLowerCase()}`"
                @change="paintSlot.setKey"
            />
        </PageProp>

        <PageKnobs
            :knobs="getPaintKnobs(paint.kind, paint.key)"
            :defaults="getPaintDefaults(paint.kind, paint.key)"
            :values="paint.configDefs"
            @input="paintSlot.setConfigDef"
        />
    </PagePropsPanel>
</template>
