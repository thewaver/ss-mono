<script setup lang="ts">
import { shallowRef } from "vue";

import { PlacementLayoutDefaults } from "@thewaver/ss-components-vue";
import { WheelMenuKnobs } from "@thewaver/ss-playground/App/Knobs/WheelMenus.const";
import {
    BAND_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
    HOLE_RADIUS,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";

import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BandsDocsExample from "./Docs/Bands.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import FlickDocsExample from "./Docs/Flick.vue";
import WeightedDocsExample from "./Docs/Weighted.vue";

const spreadDegrees = shallowRef(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
const holeRadius = shallowRef(HOLE_RADIUS);
const bandWidth = shallowRef(BAND_WIDTH);
const wedgeGapDegrees = shallowRef(PlacementLayoutDefaults.BAND_DEFAULTS.wedgeGapDegrees);
const bandsSpreadDegrees = shallowRef(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
const opensOnHold = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :spread-degrees="spreadDegrees"
            :hole-radius="holeRadius"
            :band-width="bandWidth"
            :wedge-gap-degrees="wedgeGapDegrees"
        />

        <template #renderKnobs>
            <PageProp item-key="spreadDegrees" v-bind="WheelMenuKnobs.SPREAD_DEGREES_TEXT">
                <PageNumberField
                    :value="spreadDegrees"
                    :min="WheelMenuKnobs.MIN_SPREAD_DEGREES"
                    :max="WheelMenuKnobs.MAX_SPREAD_DEGREES"
                    :step="WheelMenuKnobs.SPREAD_STEP_DEGREES"
                    :width="FIELD_WIDTH"
                    ariaLabel="Spread in degrees"
                    @input="(value: number) => (spreadDegrees = value)"
                />
            </PageProp>

            <PageProp item-key="holeRadius" v-bind="WheelMenuKnobs.HOLE_RADIUS_TEXT">
                <PageNumberField
                    :value="holeRadius"
                    :min="WheelMenuKnobs.MIN_HOLE_RADIUS"
                    :max="WheelMenuKnobs.MAX_HOLE_RADIUS"
                    :step="WheelMenuKnobs.HOLE_RADIUS_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hole radius in pixels"
                    @input="(value: number) => (holeRadius = value)"
                />
            </PageProp>

            <PageProp item-key="bandWidth" v-bind="WheelMenuKnobs.BAND_WIDTH_TEXT">
                <PageNumberField
                    :value="bandWidth"
                    :min="WheelMenuKnobs.MIN_BAND_WIDTH"
                    :max="WheelMenuKnobs.MAX_BAND_WIDTH"
                    :step="WheelMenuKnobs.BAND_WIDTH_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Band width in pixels"
                    @input="(value: number) => (bandWidth = value)"
                />
            </PageProp>

            <PageProp item-key="wedgeGapDegrees" v-bind="WheelMenuKnobs.WEDGE_GAP_DEGREES_TEXT">
                <PageNumberField
                    :value="wedgeGapDegrees"
                    :min="WheelMenuKnobs.MIN_WEDGE_GAP_DEGREES"
                    :max="WheelMenuKnobs.MAX_WEDGE_GAP_DEGREES"
                    :step="WheelMenuKnobs.WEDGE_GAP_STEP_DEGREES"
                    :width="FIELD_WIDTH"
                    ariaLabel="Wedge gap in degrees"
                    @input="(value: number) => (wedgeGapDegrees = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.submenusBands" />

    <PageDocsExample :path="`${DOCS_ROOT}/Bands.vue`">
        <BandsDocsExample :spread-degrees="bandsSpreadDegrees" />

        <template #renderKnobs>
            <PageProp item-key="bandsSpreadDegrees" v-bind="WheelMenuKnobs.BANDS_SPREAD_DEGREES_TEXT">
                <PageNumberField
                    :value="bandsSpreadDegrees"
                    :min="WheelMenuKnobs.MIN_SPREAD_DEGREES"
                    :max="WheelMenuKnobs.MAX_SPREAD_DEGREES"
                    :step="WheelMenuKnobs.SPREAD_STEP_DEGREES"
                    :width="FIELD_WIDTH"
                    ariaLabel="Spread in degrees"
                    @input="(value: number) => (bandsSpreadDegrees = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.wedgeAskingForRoom" />

    <PageDocsExample :path="`${DOCS_ROOT}/Weighted.vue`">
        <WeightedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.holdFlick" />

    <PageDocsExample :path="`${DOCS_ROOT}/Flick.vue`">
        <FlickDocsExample :opens-on-hold="opensOnHold" />

        <template #renderKnobs>
            <PageProp item-key="opensOnHold" v-bind="WheelMenuKnobs.OPENS_ON_HOLD_TEXT">
                <PageCheckField
                    :value="opensOnHold"
                    ariaLabel="Opens on hold"
                    @change="(value: boolean) => (opensOnHold = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
