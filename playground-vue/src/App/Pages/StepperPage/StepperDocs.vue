<script setup lang="ts">
import { shallowRef } from "vue";

import { STEPPER_ORIENTATIONS } from "@thewaver/ss-components-vue";
import type { StepperOrientation } from "@thewaver/ss-components-vue";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ArcDocsExample from "./Docs/Arc.vue";
import BareDocsExample from "./Docs/Bare.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DetailedDocsExample from "./Docs/Detailed.vue";
import FailedDocsExample from "./Docs/Failed.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const FAILED_CONTENT =
    "A step's [prop]state[/prop] is yours to invent — here one step failed and one was skipped — and the stepper never looks at what a state means. No ARIA attribute can say that a step failed, so the words have to be in each step's name, which [prop]computeStepAriaLabel[/prop] writes; paint alone is not read out ([wcag id=\"1.3.1\"]WCAG 1.3.1[/wcag]). A step that cannot be pressed but has a tooltip, through [prop]computeTooltipDefs[/prop], stays reachable by the Tab key, so the reason can be read.";

const orientation = shallowRef<StepperOrientation>("horizontal");
const isFreeNavigation = shallowRef(false);
const isRightToLeftFree = shallowRef(false);
const isFailedFree = shallowRef(false);
const isDetailedFree = shallowRef(false);
const isBareFree = shallowRef(false);
const isArcFree = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :orientation="orientation" :is-free-navigation="isFreeNavigation" />

        <template #renderKnobs>
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Whether the steps run across the page or down it."
                controls="Sets StepperProps.orientation"
            >
                <PageSelectField
                    :value="orientation"
                    :values="STEPPER_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: StepperOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="isFreeNavigation"
                label="Free navigation"
                hint="Lets any step be pressed to jump to it, rather than only the steps already behind you."
                controls="Sets Step.isNavigable on every step sent to StepperProps.steps"
            >
                <PageCheckField
                    :value="isFreeNavigation"
                    ariaLabel="Free navigation"
                    @change="(value: boolean) => (isFreeNavigation = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, a strip running across starts from the right: the first step sits at the right-hand end and the connectors lead to the left."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample :is-free-navigation="isRightToLeftFree" />

        <template #renderKnobs>
            <PageProp
                item-key="rightToLeftIsFreeNavigation"
                label="Free navigation"
                hint="Lets any step be pressed to jump to it, rather than only the steps already behind you."
                controls="Sets Step.isNavigable on every step sent to StepperProps.steps"
            >
                <PageCheckField
                    :value="isRightToLeftFree"
                    ariaLabel="Free navigation"
                    @change="(value: boolean) => (isRightToLeftFree = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection title="A step that failed" :content="FAILED_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Failed.vue`">
        <FailedDocsExample :is-free-navigation="isFailedFree" />

        <template #renderKnobs>
            <PageProp
                item-key="failedIsFreeNavigation"
                label="Free navigation"
                hint="Lets any step be pressed to jump to it, rather than only the steps already behind you."
                controls="Sets Step.isNavigable on every step sent to StepperProps.steps"
            >
                <PageCheckField
                    :value="isFailedFree"
                    ariaLabel="Free navigation"
                    @change="(value: boolean) => (isFailedFree = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Steps that carry their own content"
        content="Give the stepper [prop]renderBody[/prop] and each step holds a body beside its connector, so the line runs on past the content rather than stopping at it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Detailed.vue`">
        <DetailedDocsExample :is-free-navigation="isDetailedFree" />

        <template #renderKnobs>
            <PageProp
                item-key="detailedIsFreeNavigation"
                label="Free navigation"
                hint="Lets any step be pressed to jump to it, rather than only the steps already behind you."
                controls="Sets Step.isNavigable on every step sent to StepperProps.steps"
            >
                <PageCheckField
                    :value="isDetailedFree"
                    ariaLabel="Free navigation"
                    @change="(value: boolean) => (isDetailedFree = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="No connector"
        content="The line between steps is optional: leave out [prop]renderConnector[/prop] and nothing is drawn between them, and they sit [prop]gap[/prop] pixels apart."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Bare.vue`">
        <BareDocsExample :is-free-navigation="isBareFree" />

        <template #renderKnobs>
            <PageProp
                item-key="bareIsFreeNavigation"
                label="Free navigation"
                hint="Lets any step be pressed to jump to it, rather than only the steps already behind you."
                controls="Sets Step.isNavigable on every step sent to StepperProps.steps"
            >
                <PageCheckField
                    :value="isBareFree"
                    ariaLabel="Free navigation"
                    @change="(value: boolean) => (isBareFree = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Bent along an arc"
        content="Give the stepper [prop]computeLayout[/prop] and each step goes where the layout puts it, here along an arc from PlacementLayoutUtils. The connector is handed where the two steps it joins sit, so the run between them follows the curve rather than cutting across it. A step's body has nowhere to go on a curve, so a stepper with a layout takes no [prop]renderBody[/prop]."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Arc.vue`">
        <ArcDocsExample :is-free-navigation="isArcFree" />

        <template #renderKnobs>
            <PageProp
                item-key="arcIsFreeNavigation"
                label="Free navigation"
                hint="Lets any step be pressed to jump to it, rather than only the steps already behind you."
                controls="Sets Step.isNavigable on every step sent to StepperProps.steps"
            >
                <PageCheckField
                    :value="isArcFree"
                    ariaLabel="Free navigation"
                    @change="(value: boolean) => (isArcFree = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
