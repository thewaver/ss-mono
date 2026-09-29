<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-vue";
import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DialExample from "./Examples/Dial.vue";
import EndsExample from "./Examples/Ends.vue";
import LinkComponentExample from "./Examples/LinkComponent.vue";
import LinksExample from "./Examples/Links.vue";
import StepsExample from "./Examples/Steps.vue";
import type { PaginatorExampleProps } from "./PaginatorPage.types";

const STARTING_PAGE = 1;
const COUNT_FIELD_WIDTH = 90;
const EXAMPLES_ROOT = "/src/App/Pages/PaginatorPage/Examples";

const pageCount = shallowRef(PaginatorKnobs.STARTING_PAGE_COUNT);
const siblingCount = shallowRef(PAGINATOR_DEFAULTS.siblingCount);
const boundaryCount = shallowRef(PAGINATOR_DEFAULTS.boundaryCount);
const isDisabled = shallowRef(PaginatorKnobs.STARTING_IS_DISABLED);

const stepPage = shallowRef(STARTING_PAGE);
const endPage = shallowRef(STARTING_PAGE);
const linkPage = shallowRef(STARTING_PAGE);
const customLinkPage = shallowRef(STARTING_PAGE);
const dialPage = shallowRef(STARTING_PAGE);

const commonProps = computed<Omit<PaginatorExampleProps, "page" | "onPageChange">>(() => ({
    pageCount: pageCount.value,
    siblingCount: siblingCount.value,
    boundaryCount: boundaryCount.value,
    isDisabled: isDisabled.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "steps",
        name: "Previous and next",
        readout: () =>
            `page ${stepPage.value} of ${pageCount.value} — the gaps name the pages they stand for, and a gap standing for one page is spelled as that page instead`,
        path: `${EXAMPLES_ROOT}/Steps.vue`,
    },
    {
        key: "ends",
        name: "Jumps to either end",
        readout: () =>
            `page ${endPage.value} of ${pageCount.value} — first and previous go quiet together on page one, and next and last on the final page`,
        path: `${EXAMPLES_ROOT}/Ends.vue`,
    },
    {
        key: "links",
        name: "Pages that are links",
        readout: () =>
            `page ${linkPage.value} of ${pageCount.value} — the consumer knows the address shape, so it computes the href from the page the library worked out`,
        path: `${EXAMPLES_ROOT}/Links.vue`,
    },
    {
        key: "linkComponent",
        name: "Links through a component",
        readout: () =>
            `page ${customLinkPage.value} of ${pageCount.value} — the same links rendered by a consumer's own link component`,
        path: `${EXAMPLES_ROOT}/LinkComponent.vue`,
    },
    {
        key: "dial",
        name: "The same row, round half a dial",
        readout: () =>
            `page ${dialPage.value} of ${pageCount.value} — one layout function, and the steps, pages and gaps become wedges in the order they already had`,
        path: `${EXAMPLES_ROOT}/Dial.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="pageCount" label="Page count" hint="How many pages there are to page through.">
            <PageNumberField
                :value="pageCount"
                :min="PaginatorKnobs.MIN_PAGE_COUNT"
                :max="PaginatorKnobs.MAX_PAGE_COUNT"
                :step="PaginatorKnobs.COUNT_STEP"
                :width="COUNT_FIELD_WIDTH"
                ariaLabel="Page count"
                @input="(value: number) => (pageCount = value)"
            />
        </PageProp>

        <PageProp
            item-key="siblingCount"
            label="Sibling count"
            hint="How many pages are shown on each side of the current one before the run is broken by an ellipsis."
        >
            <PageNumberField
                :value="siblingCount"
                :min="PaginatorKnobs.MIN_COUNT"
                :max="PaginatorKnobs.MAX_COUNT"
                :step="PaginatorKnobs.COUNT_STEP"
                :width="COUNT_FIELD_WIDTH"
                ariaLabel="Sibling count"
                @input="(value: number) => (siblingCount = value)"
            />
        </PageProp>

        <PageProp
            item-key="boundaryCount"
            label="Boundary count"
            hint="How many pages are always shown at each end, however far away the current page is."
        >
            <PageNumberField
                :value="boundaryCount"
                :min="PaginatorKnobs.MIN_COUNT"
                :max="PaginatorKnobs.MAX_COUNT"
                :step="PaginatorKnobs.COUNT_STEP"
                :width="COUNT_FIELD_WIDTH"
                ariaLabel="Boundary count"
                @input="(value: number) => (boundaryCount = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the paginator off, so none of its pages or arrows respond."
        >
            <PageCheckField :value="isDisabled" ariaLabel="Disabled" @change="(value: boolean) => (isDisabled = value)" />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" :min-column-width="400">
        <template #steps>
            <StepsExample v-bind="commonProps" :page="stepPage" @page-change="(page: number) => (stepPage = page)" />
        </template>

        <template #ends>
            <EndsExample v-bind="commonProps" :page="endPage" @page-change="(page: number) => (endPage = page)" />
        </template>

        <template #links>
            <LinksExample v-bind="commonProps" :page="linkPage" @page-change="(page: number) => (linkPage = page)" />
        </template>

        <template #linkComponent>
            <LinkComponentExample
                v-bind="commonProps"
                :page="customLinkPage"
                @page-change="(page: number) => (customLinkPage = page)"
            />
        </template>

        <template #dial>
            <DialExample v-bind="commonProps" :page="dialPage" @page-change="(page: number) => (dialPage = page)" />
        </template>
    </PageExamples>
</template>
