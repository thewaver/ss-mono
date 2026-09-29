<script setup lang="ts">
import { shallowRef } from "vue";

import type { FileInputRejection } from "@thewaver/ss-components-vue";
import {
    DROP_ZONE_REASON_TEXT,
    MAX_ATTACHMENT_BYTES,
} from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import DropZoneExample from "./Examples/DropZone.vue";
import ErroredExample from "./Examples/Errored.vue";
import ImagesExample from "./Examples/Images.vue";
import LabeledExample from "./Examples/Labeled.vue";
import MultipleExample from "./Examples/Multiple.vue";
import ReachableExample from "./Examples/Reachable.vue";
import RejectingSetterExample from "./Examples/RejectingSetter.vue";

const EXAMPLES_ROOT = "/src/App/Pages/FileInputPage/Examples";

const describe = (files: File[]) => (files.length ? files.map((file) => file.name).join(", ") : "none");

const describeRejections = (rejections: FileInputRejection[]) =>
    rejections.length
        ? rejections.map((rejection) => `${rejection.file.name}: ${DROP_ZONE_REASON_TEXT[rejection.reason]}`).join(", ")
        : "none";

const defaultFiles = shallowRef<File[]>([]);
const multipleFiles = shallowRef<File[]>([]);
const imagesFiles = shallowRef<File[]>([]);
const rejectingFiles = shallowRef<File[]>([]);
const disabledFiles = shallowRef<File[]>([]);
const reachableFiles = shallowRef<File[]>([]);
const erroredFiles = shallowRef<File[]>([]);
const labeledFiles = shallowRef<File[]>([]);
const dropZoneFiles = shallowRef<File[]>([]);

const rejection = shallowRef("");
const dropZoneRejections = shallowRef<FileInputRejection[]>([]);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `files: ${describe(defaultFiles.value)}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "multiple",
        name: "Multiple",
        readout: () => `files: ${describe(multipleFiles.value)}`,
        path: `${EXAMPLES_ROOT}/Multiple.vue`,
    },
    {
        key: "images",
        name: "Accepting images only",
        readout: () => `files: ${describe(imagesFiles.value)} — accept is a filter, never a guarantee`,
        path: `${EXAMPLES_ROOT}/Images.vue`,
    },
    {
        key: "rejectingSetter",
        name: "Rejecting setter",
        readout: () =>
            `files: ${describe(rejectingFiles.value)}${rejection.value ? ` — ${rejection.value}` : ` — anything over ${MAX_ATTACHMENT_BYTES} bytes is refused`}`,
        path: `${EXAMPLES_ROOT}/RejectingSetter.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `files: ${describe(disabledFiles.value)}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `files: ${describe(reachableFiles.value)}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `files: ${describe(erroredFiles.value)} — required, nothing picked yet`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
    {
        key: "label",
        name: "In a Label",
        readout: () => `files: ${describe(labeledFiles.value)} — the caption opens the dialog`,
        path: `${EXAMPLES_ROOT}/Labeled.vue`,
    },
    {
        key: "dropZone",
        name: "Drop area with limits",
        readout: () =>
            `files: ${describe(dropZoneFiles.value)} — refused: ${describeRejections(dropZoneRejections.value)}`,
        path: `${EXAMPLES_ROOT}/DropZone.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:files="defaultFiles" />
        </template>

        <template #multiple>
            <MultipleExample v-model:files="multipleFiles" />
        </template>

        <template #images>
            <ImagesExample v-model:files="imagesFiles" />
        </template>

        <template #rejectingSetter>
            <RejectingSetterExample
                v-model:files="rejectingFiles"
                :rejection="rejection"
                @rejection-change="(next: string) => (rejection = next)"
            />
        </template>

        <template #disabled>
            <DisabledExample v-model:files="disabledFiles" />
        </template>

        <template #reachable>
            <ReachableExample v-model:files="reachableFiles" />
        </template>

        <template #errored>
            <ErroredExample v-model:files="erroredFiles" />
        </template>

        <template #label>
            <LabeledExample v-model:files="labeledFiles" />
        </template>

        <template #dropZone>
            <DropZoneExample
                v-model:files="dropZoneFiles"
                @rejections-change="(next: FileInputRejection[]) => (dropZoneRejections = next)"
            />
        </template>
    </PageExamples>
</template>
