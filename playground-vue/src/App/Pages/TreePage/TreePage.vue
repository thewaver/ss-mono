<script setup lang="ts">
import { shallowRef } from "vue";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import FilesExample from "./Examples/Files.vue";
import LazyExample from "./Examples/Lazy.vue";
import LinkComponentExample from "./Examples/LinkComponent.vue";
import LinksExample from "./Examples/Links.vue";
import OutsideExample from "./Examples/Outside.vue";
import RadialExample from "./Examples/Radial.vue";
import RecordValuesExample from "./Examples/RecordValues.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import VirtualizedExample from "./Examples/Virtualized.vue";
import LeaningExampleWrapper from "./LeaningExampleWrapper.vue";
import type { Asset } from "./TreePage.types";
import {
    FILES_WITH_DISABLED,
    FILES_WITH_REACHABLE,
    RANK_ROOTS,
    STRESS_BRANCH_COUNT,
    STRESS_LEAF_COUNT,
    createStressFiles,
} from "./TreePageVue.const";

const defaultValue = shallowRef<string | undefined>();
const defaultExpanded = shallowRef<string[]>(["src"]);

const collapsedValue = shallowRef<string | undefined>();
const collapsedExpanded = shallowRef<string[]>([]);

const rightToLeftValue = shallowRef<string | undefined>();
const rightToLeftExpanded = shallowRef<string[]>([]);

const disabledValue = shallowRef<string | undefined>();
const disabledExpanded = shallowRef<string[]>(["src", "Lib"]);

const reachableValue = shallowRef<string | undefined>();
const reachableExpanded = shallowRef<string[]>(["src"]);

const outsideValue = shallowRef<string | undefined>();
const outsideExpanded = shallowRef<string[]>(["src", "Lib"]);

const linkValue = shallowRef<string | undefined>();
const linkExpanded = shallowRef<string[]>(["Guides"]);

const customLinkValue = shallowRef<string | undefined>();
const customLinkExpanded = shallowRef<string[]>(["Guides"]);

const lazyValue = shallowRef<string | undefined>();
const lazyExpanded = shallowRef<string[]>([]);

const stressValue = shallowRef<string | undefined>();
const stressExpanded = shallowRef<string[]>(["package-1", "package-2", "package-3"]);
const stressFiles = createStressFiles();

const leaningValue = shallowRef<string | undefined>();
const leaningExpanded = shallowRef<string[]>(["src"]);

const radialValue = shallowRef<string | undefined>();
const radialExpanded = shallowRef<string[]>(RANK_ROOTS);

const recordValue = shallowRef<Asset | undefined>();
const recordExpanded = shallowRef<Asset[]>([]);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () =>
            `value: ${defaultValue.value ?? "undefined"} | expanded: ${JSON.stringify(defaultExpanded.value)} — right opens a branch, left closes it or climbs to the parent`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "collapsed",
        name: EXAMPLE_NAMES.collapsed,
        readout: () =>
            `value: ${collapsedValue.value ?? "undefined"} | expanded: ${JSON.stringify(collapsedExpanded.value)} — asterisk opens every branch at the level focus is on`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "rightToLeft",
        name: EXAMPLE_NAMES.rightToLeft,
        readout: () =>
            `value: ${rightToLeftValue.value ?? "undefined"} | expanded: ${JSON.stringify(rightToLeftExpanded.value)} — the box around the tree sets dir="rtl", so left opens a branch and right closes it or climbs to the parent`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "unheld",
        name: EXAMPLE_NAMES.unheld,
        readout: () =>
            "no signals passed — the tree keeps the selection and the open branches itself; a picked node is still marked selected and is still the tree's one tab stop",
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
        readout: () =>
            `value: ${disabledValue.value ?? "undefined"} — arrows skip index.ts and Lib, while what is inside Lib stays reachable`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "reachable",
        name: EXAMPLE_NAMES.reachable,
        readout: () =>
            `value: ${reachableValue.value ?? "undefined"} — arrows stop on node_modules, hover explains why, and nothing opens it`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "outside",
        name: EXAMPLE_NAMES.outside,
        readout: () =>
            `expanded: ${JSON.stringify(outsideExpanded.value)} — press the button, then focus a row inside Lib before the delay elapses; focus must land on Lib rather than on the page body`,
        path: `${EXAMPLES_ROOT}/Outside.vue`,
    },
    {
        key: "links",
        name: EXAMPLE_NAMES.links,
        readout: () =>
            `value: ${linkValue.value ?? "undefined"} — every leaf carries an href, so each one is an anchor and the branches stay plain`,
        path: `${EXAMPLES_ROOT}/Links.vue`,
    },
    {
        key: "linkComponent",
        name: EXAMPLE_NAMES.linkComponent,
        readout: () =>
            `value: ${customLinkValue.value ?? "undefined"} — the same nodes rendered by a consumer's own link component`,
        path: `${EXAMPLES_ROOT}/LinkComponent.vue`,
    },
    {
        key: "lazy",
        name: EXAMPLE_NAMES.lazy,
        readout: () =>
            `expanded: ${JSON.stringify(lazyExpanded.value)} — packages and docs say they have children before they have them`,
        path: `${EXAMPLES_ROOT}/Lazy.vue`,
    },
    {
        key: "virtualized",
        name: EXAMPLE_NAMES.virtualized,
        readout: () =>
            `${(STRESS_BRANCH_COUNT * (STRESS_LEAF_COUNT + 1)).toLocaleString("en-GB")} rows when everything is open — expanded: ${stressExpanded.value.length} branches, value: ${stressValue.value ?? "undefined"}`,
        path: `${EXAMPLES_ROOT}/Virtualized.vue`,
    },
    {
        key: "recordValues",
        name: EXAMPLE_NAMES.recordValues,
        readout: () =>
            `value: ${recordValue.value?.name ?? "undefined"} | expanded: ${recordExpanded.value.length} branch(es) — the value is the record itself, not a name`,
        path: `${EXAMPLES_ROOT}/RecordValues.vue`,
    },
    {
        key: "leaning",
        name: EXAMPLE_NAMES.leaning,
        readout: () =>
            `selected: ${leaningValue.value ?? "nothing"} — a column layout with a proximity effect: each node shifts and brightens by how near the pointer is, and the painter keeps the selected one lit, since an effect is not told which node is current`,
        path: `${EXAMPLES_ROOT}/Leaning.vue`,
    },
    {
        key: "radial",
        span: 2,
        name: EXAMPLE_NAMES.radial,
        readout: () =>
            `value: ${radialValue.value ?? "undefined"} — the layout is told which node each node hangs from, so children share the slice their parent was given, and every rank sits a ring further out whoever it hangs from`,
        path: `${EXAMPLES_ROOT}/Radial.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <FilesExample v-model:value="defaultValue" v-model:expanded="defaultExpanded" />
        </template>

        <template #collapsed>
            <FilesExample v-model:value="collapsedValue" v-model:expanded="collapsedExpanded" />
        </template>

        <template #rightToLeft>
            <RightToLeftExample v-model:value="rightToLeftValue" v-model:expanded="rightToLeftExpanded" />
        </template>

        <template #unheld>
            <FilesExample />
        </template>

        <template #disabled>
            <FilesExample
                v-model:value="disabledValue"
                v-model:expanded="disabledExpanded"
                :nodes="FILES_WITH_DISABLED"
            />
        </template>

        <template #reachable>
            <FilesExample
                v-model:value="reachableValue"
                v-model:expanded="reachableExpanded"
                :nodes="FILES_WITH_REACHABLE"
            />
        </template>

        <template #outside>
            <OutsideExample v-model:value="outsideValue" v-model:expanded="outsideExpanded" />
        </template>

        <template #links>
            <LinksExample v-model:value="linkValue" v-model:expanded="linkExpanded" />
        </template>

        <template #linkComponent>
            <LinkComponentExample v-model:value="customLinkValue" v-model:expanded="customLinkExpanded" />
        </template>

        <template #lazy>
            <LazyExample v-model:value="lazyValue" v-model:expanded="lazyExpanded" />
        </template>

        <template #virtualized>
            <VirtualizedExample v-model:value="stressValue" v-model:expanded="stressExpanded" :nodes="stressFiles" />
        </template>

        <template #leaning>
            <LeaningExampleWrapper v-model:value="leaningValue" v-model:expanded="leaningExpanded" />
        </template>

        <template #radial>
            <RadialExample v-model:value="radialValue" v-model:expanded="radialExpanded" />
        </template>

        <template #recordValues>
            <RecordValuesExample v-model:value="recordValue" v-model:expanded="recordExpanded" />
        </template>
    </PageExamples>
</template>
