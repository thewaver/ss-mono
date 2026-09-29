<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { Breadcrumb } from "@thewaver/ss-components-vue";
import { Button } from "@thewaver/ss-components-vue";
import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";
import { TRAIL } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { BreadcrumbsExampleProps } from "./BreadcrumbsPage.types";
import BareExample from "./Examples/Bare.vue";
import LinkComponentExample from "./Examples/LinkComponent.vue";
import LinkedExample from "./Examples/Linked.vue";
import TrailExample from "./Examples/Trail.vue";

const DEPTH_FIELD_WIDTH = 90;
const EXAMPLES_ROOT = "/src/App/Pages/BreadcrumbsPage/Examples";

const depth = shallowRef(BreadcrumbKnobs.STARTING_DEPTH);
const isDisabled = shallowRef(BreadcrumbKnobs.STARTING_IS_DISABLED);

const pressed = shallowRef<CrumbValue | undefined>(undefined);
const linkPressed = shallowRef<CrumbValue | undefined>(undefined);

const crumbs = computed<Breadcrumb<CrumbValue>[]>(() =>
    TRAIL.slice(0, depth.value).map((entry) => ({ value: entry.value, isDisabled: isDisabled.value })),
);

const linkCrumbs = computed<Breadcrumb<CrumbValue>[]>(() =>
    TRAIL.slice(0, depth.value).map((entry) => ({
        value: entry.value,
        href: `#breadcrumb-${entry.value}`,
        isDisabled: isDisabled.value,
    })),
);

const navigate = (value: CrumbValue) => {
    depth.value = TRAIL.findIndex((entry) => entry.value === value) + 1;
};

const reset = () => {
    depth.value = BreadcrumbKnobs.STARTING_DEPTH;
    pressed.value = undefined;
    linkPressed.value = undefined;
};

const commonProps = computed<BreadcrumbsExampleProps>(() => ({ crumbs: crumbs.value }));

const selectDefault = (value: CrumbValue) => {
    pressed.value = value;
    navigate(value);
};

const selectLinked = (value: CrumbValue) => {
    linkPressed.value = value;
    navigate(value);
};

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () =>
            `pressed: ${pressed.value ?? "nothing yet"} — pressing a crumb moves the page there, so the trail behind it is the whole trail; Reset puts it back`,
        path: `${EXAMPLES_ROOT}/Trail.vue`,
    },
    {
        key: "bare",
        name: "No separator",
        readout: () => "a trail with nothing between the crumbs, since the separator slot is optional",
        path: `${EXAMPLES_ROOT}/Bare.vue`,
    },
    {
        key: "linked",
        name: "Crumbs that are links",
        readout: () => `pressed: ${linkPressed.value ?? "nothing yet"} — an href makes a crumb an anchor`,
        path: `${EXAMPLES_ROOT}/Linked.vue`,
    },
    {
        key: "linkComponent",
        name: "Links through a component",
        readout: () => "the same links rendered by a consumer's own link component",
        path: `${EXAMPLES_ROOT}/LinkComponent.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="depth"
            label="Depth"
            hint="How many crumbs the trail holds. Past what fits, the middle ones collapse behind a menu."
        >
            <PageNumberField
                :value="depth"
                :min="BreadcrumbKnobs.MIN_DEPTH"
                :max="BreadcrumbKnobs.MAX_DEPTH"
                :step="BreadcrumbKnobs.DEPTH_STEP"
                :width="DEPTH_FIELD_WIDTH"
                ariaLabel="Depth"
                @input="(value: number) => (depth = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns every crumb off. A disabled crumb stays readable and keeps its tooltip."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp
            item-key="trail"
            label="Trail"
            hint="Puts the trail back to the crumb it started on, undoing wherever the examples have navigated to."
        >
            <Button @click="reset">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Reset</PageButtonContent>
                </template>
            </Button>
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <TrailExample v-bind="commonProps" @select="selectDefault" />
        </template>

        <template #bare>
            <BareExample v-bind="commonProps" />
        </template>

        <template #linked>
            <LinkedExample :crumbs="linkCrumbs" @select="selectLinked" />
        </template>

        <template #linkComponent>
            <LinkComponentExample :crumbs="linkCrumbs" />
        </template>
    </PageExamples>
</template>
