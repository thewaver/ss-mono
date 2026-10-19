<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { useRoute } from "vue-router";

import { FLYOUT_MENU_DEFAULTS, type FlyoutMenuEntryRecord } from "@thewaver/ss-components-vue";
import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    NOTHING_FOLLOWED,
    SHOP_ENTRIES,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import NarrowExample from "./Examples/Narrow.vue";
import ShopExample from "./Examples/Shop.vue";

const hoverShowDelayMs = shallowRef(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
const transitionDurationMs = shallowRef(FLYOUT_MENU_DEFAULTS.transitionDurationMs);

const route = useRoute();

const getFollowed = () => (route.hash ? `followed ${route.hash}` : NOTHING_FOLLOWED);

const entries = computed((): FlyoutMenuEntryRecord<string>[] =>
    SHOP_ENTRIES.map((entry) => ({
        ...entry,
        isCurrent: entry.href === route.hash,
        links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === route.hash })),
    })),
);

const examples: ExampleDefs[] = [
    {
        key: "shop",
        name: EXAMPLE_NAMES.shop,
        span: 2,
        readout: () =>
            `${getFollowed()} — every entry is a link to its own page; hovering one with a panel opens it, the arrow beside it opens and closes it from the keyboard or a touch, and tabbing along the bar opens nothing`,
        path: `${EXAMPLES_ROOT}/Shop.vue`,
    },
    {
        key: "narrow",
        name: EXAMPLE_NAMES.narrow,
        readout: () =>
            `${getFollowed()} — the entries that do not fit collapse into "More", where each keeps its link and its arrow, and the arrow opens its links in place`,
        path: `${EXAMPLES_ROOT}/Narrow.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="hoverShowDelayMs"
            controls="Sets FlyoutMenuProps.hoverShowDelayMs"
            label="Hover delay (ms)"
            hint="How long the pointer has to rest on an entry before its panel opens."
        >
            <PageNumberField
                :value="hoverShowDelayMs"
                :min="FlyoutMenuKnobs.MIN_DELAY_MS"
                :max="FlyoutMenuKnobs.MAX_DELAY_MS"
                :step="FlyoutMenuKnobs.DELAY_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Hover delay in milliseconds"
                @input="(value: number) => (hoverShowDelayMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            controls="Sets FlyoutMenuProps.transitionDurationMs"
            label="Transition duration (ms)"
            hint="How long the panel takes to fade, and to glide from one entry to the next."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="FlyoutMenuKnobs.MIN_TRANSITION_MS"
                :max="FlyoutMenuKnobs.MAX_TRANSITION_MS"
                :step="FlyoutMenuKnobs.TRANSITION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Transition duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #shop>
            <ShopExample
                :entries="entries"
                :hover-show-delay-ms="hoverShowDelayMs"
                :transition-duration-ms="transitionDurationMs"
            />
        </template>

        <template #narrow>
            <NarrowExample
                :entries="entries"
                :hover-show-delay-ms="hoverShowDelayMs"
                :transition-duration-ms="transitionDurationMs"
            />
        </template>
    </PageExamples>
</template>
