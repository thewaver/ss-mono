<script setup lang="ts">
import { shallowRef } from "vue";

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
import {
    FILES_WITH_DISABLED,
    FILES_WITH_REACHABLE,
    RANK_ROOTS,
    STRESS_BRANCH_COUNT,
    STRESS_LEAF_COUNT,
    createStressFiles,
} from "./TreePage.const";
import type { Asset } from "./TreePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TreePage/Examples";

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

const radialValue = shallowRef<string | undefined>();
const radialExpanded = shallowRef<string[]>(RANK_ROOTS);

const recordValue = shallowRef<Asset | undefined>();
const recordExpanded = shallowRef<Asset[]>([]);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () =>
            `value: ${defaultValue.value ?? "undefined"} | expanded: ${JSON.stringify(defaultExpanded.value)} — right opens a branch, left closes it or climbs to the parent`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "collapsed",
        name: "Everything collapsed",
        readout: () =>
            `value: ${collapsedValue.value ?? "undefined"} | expanded: ${JSON.stringify(collapsedExpanded.value)} — asterisk opens every branch at the level focus is on`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "rightToLeft",
        name: "In a right-to-left box",
        readout: () =>
            `value: ${rightToLeftValue.value ?? "undefined"} | expanded: ${JSON.stringify(rightToLeftExpanded.value)} — the box around the tree sets dir="rtl", so left opens a branch and right closes it or climbs to the parent`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "unheld",
        name: "Nobody holding the state",
        readout: () =>
            "no signals passed — the tree keeps the selection and the open branches itself; a picked node is still marked selected and is still the tree's one tab stop",
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "disabled",
        name: "Disabled nodes",
        readout: () =>
            `value: ${disabledValue.value ?? "undefined"} — arrows skip index.ts and Lib, while what is inside Lib stays reachable`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "reachable",
        name: "Disabled nodes + reachable",
        readout: () =>
            `value: ${reachableValue.value ?? "undefined"} — arrows stop on node_modules, hover explains why, and nothing opens it`,
        path: `${EXAMPLES_ROOT}/Files.vue`,
    },
    {
        key: "outside",
        name: "Collapsed from outside",
        readout: () =>
            `expanded: ${JSON.stringify(outsideExpanded.value)} — press the button, then focus a row inside Lib before the delay elapses; focus must land on Lib rather than on the page body`,
        path: `${EXAMPLES_ROOT}/Outside.vue`,
    },
    {
        key: "links",
        name: "Nodes that are links",
        readout: () =>
            `value: ${linkValue.value ?? "undefined"} — every leaf carries an href, so each one is an anchor and the branches stay plain`,
        path: `${EXAMPLES_ROOT}/Links.vue`,
    },
    {
        key: "linkComponent",
        name: "Links through a component",
        readout: () =>
            `value: ${customLinkValue.value ?? "undefined"} — the same nodes rendered by a consumer's own link component`,
        path: `${EXAMPLES_ROOT}/LinkComponent.vue`,
    },
    {
        key: "lazy",
        name: "Branches that arrive later",
        readout: () =>
            `expanded: ${JSON.stringify(lazyExpanded.value)} — packages and docs say they have children before they have them`,
        path: `${EXAMPLES_ROOT}/Lazy.vue`,
    },
    {
        key: "virtualized",
        name: "Virtualized",
        readout: () =>
            `${(STRESS_BRANCH_COUNT * (STRESS_LEAF_COUNT + 1)).toLocaleString("en-GB")} rows when everything is open — expanded: ${stressExpanded.value.length} branches, value: ${stressValue.value ?? "undefined"}`,
        path: `${EXAMPLES_ROOT}/Virtualized.vue`,
    },
    {
        key: "radial",
        span: 2,
        name: "A tree drawn outward",
        readout: () =>
            `value: ${radialValue.value ?? "undefined"} — the layout is told which node each node hangs from, so children share the slice their parent was given, and every rank sits a ring further out whoever it hangs from`,
        path: `${EXAMPLES_ROOT}/Radial.vue`,
    },
    {
        key: "recordValues",
        name: "Record values",
        readout: () =>
            `value: ${recordValue.value?.name ?? "undefined"} | expanded: ${recordExpanded.value.length} branch(es) — the value is the record itself, not a name`,
        path: `${EXAMPLES_ROOT}/RecordValues.vue`,
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

        <template #radial>
            <RadialExample v-model:value="radialValue" v-model:expanded="radialExpanded" />
        </template>

        <template #recordValues>
            <RecordValuesExample v-model:value="recordValue" v-model:expanded="recordExpanded" />
        </template>
    </PageExamples>
</template>
