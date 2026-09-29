<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SATELLITE_DEFAULTS } from "@thewaver/ss-components-vue";
import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";

import { SatelliteKnobs } from "../../Knobs/Satellites.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BadgeExample from "./Examples/Badge.vue";
import DefaultExample from "./Examples/Default.vue";
import SeveralExample from "./Examples/Several.vue";
import type { SatelliteBadgeCorner } from "./SatellitePage.types";

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/SatellitePage/Examples";

const hPlacement = shallowRef<AnchorHPlacement>(SatelliteKnobs.STARTING_H_PLACEMENT);
const vPlacement = shallowRef<AnchorVPlacement>(SatelliteKnobs.STARTING_V_PLACEMENT);
const offsetX = shallowRef(SATELLITE_DEFAULTS.offset.x);
const offsetY = shallowRef(SATELLITE_DEFAULTS.offset.y);
const subjectWidth = shallowRef(SatelliteKnobs.STARTING_SUBJECT_WIDTH);
const subjectHeight = shallowRef(SatelliteKnobs.STARTING_SUBJECT_HEIGHT);
const badgeSize = shallowRef(SatelliteKnobs.STARTING_BADGE_SIZE);
const hasSatellite = shallowRef(SatelliteKnobs.STARTING_HAS_SATELLITE);
const isBehindSubject = shallowRef(SATELLITE_DEFAULTS.isBehindSubject);
const corner = shallowRef<SatelliteBadgeCorner>(SatelliteKnobs.STARTING_CORNER);
const count = shallowRef(SatelliteKnobs.STARTING_COUNT);
const overhang = shallowRef(SatelliteKnobs.STARTING_OVERHANG);

const placement = computed(() => ({ x: hPlacement.value, y: vPlacement.value }));

const offset = computed(() => ({ x: offsetX.value, y: offsetY.value }));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => "one satellite, moved through every placement; the dashed box is what the pair takes up",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "several",
        name: "Several satellites",
        readout: () =>
            "a corner badge, one hanging off the left and one tucked behind the bottom edge — each side of the box grows by the furthest any of them reaches",
        path: `${EXAMPLES_ROOT}/Several.vue`,
    },
    {
        key: "badge",
        name: "Badge",
        readout: () =>
            "a count pinned inside a corner and pushed out past it by the same amount on both axes, so a longer number grows the badge inward and the overhang never changes",
        path: `${EXAMPLES_ROOT}/Badge.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="subjectWidth"
            label="Subject width (px)"
            hint="How wide the thing the satellite is pinned to is."
        >
            <PageNumberField
                :value="subjectWidth"
                :min="SatelliteKnobs.MIN_SUBJECT_SIZE"
                :max="SatelliteKnobs.MAX_SUBJECT_SIZE"
                :step="SatelliteKnobs.SUBJECT_SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Subject width"
                @input="(value: number) => (subjectWidth = value)"
            />
        </PageProp>

        <PageProp
            item-key="subjectHeight"
            label="Subject height (px)"
            hint="How tall the thing the satellite is pinned to is."
        >
            <PageNumberField
                :value="subjectHeight"
                :min="SatelliteKnobs.MIN_SUBJECT_SIZE"
                :max="SatelliteKnobs.MAX_SUBJECT_SIZE"
                :step="SatelliteKnobs.SUBJECT_SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Subject height"
                @input="(value: number) => (subjectHeight = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <PageMeasureBox>
                <DefaultExample
                    :subject-width="subjectWidth"
                    :subject-height="subjectHeight"
                    :placement="placement"
                    :offset="offset"
                    :is-behind-subject="isBehindSubject"
                    :badge-size="badgeSize"
                    :has-satellite="hasSatellite"
                />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp
                    item-key="hPlacement"
                    label="Placement across"
                    hint="Where the satellite sits across its subject: inside an edge, centered, or outside it altogether."
                >
                    <PageSelectField
                        :value="hPlacement"
                        :values="ANCHOR_H_PLACEMENTS"
                        :width="FIELD_WIDTH"
                        ariaLabel="Placement across"
                        @change="(next: AnchorHPlacement) => (hPlacement = next)"
                    />
                </PageProp>

                <PageProp
                    item-key="vPlacement"
                    label="Placement down"
                    hint="Where the satellite sits above or below its subject: inside an edge, centered, or outside it altogether."
                >
                    <PageSelectField
                        :value="vPlacement"
                        :values="ANCHOR_V_PLACEMENTS"
                        :width="FIELD_WIDTH"
                        ariaLabel="Placement down"
                        @change="(next: AnchorVPlacement) => (vPlacement = next)"
                    />
                </PageProp>

                <PageProp
                    item-key="offsetX"
                    label="Offset across (px)"
                    hint="How far the satellite is nudged sideways from where the placement put it."
                >
                    <PageNumberField
                        :value="offsetX"
                        :min="SatelliteKnobs.MIN_OFFSET"
                        :max="SatelliteKnobs.MAX_OFFSET"
                        :step="SatelliteKnobs.OFFSET_STEP"
                        :width="FIELD_WIDTH"
                        ariaLabel="Offset across"
                        @input="(value: number) => (offsetX = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="offsetY"
                    label="Offset down (px)"
                    hint="How far the satellite is nudged up or down from where the placement put it."
                >
                    <PageNumberField
                        :value="offsetY"
                        :min="SatelliteKnobs.MIN_OFFSET"
                        :max="SatelliteKnobs.MAX_OFFSET"
                        :step="SatelliteKnobs.OFFSET_STEP"
                        :width="FIELD_WIDTH"
                        ariaLabel="Offset down"
                        @input="(value: number) => (offsetY = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="hasSatellite"
                    label="Render a satellite"
                    hint="Whether a satellite is rendered at all, so the subject can be seen with and without one."
                >
                    <PageCheckField
                        :value="hasSatellite"
                        ariaLabel="Render a satellite"
                        @change="(value: boolean) => (hasSatellite = value)"
                    />
                </PageProp>

                <PageProp item-key="badgeSize" label="Satellite size (px)" hint="How large the satellite itself is.">
                    <PageNumberField
                        :value="badgeSize"
                        :min="SatelliteKnobs.MIN_BADGE_SIZE"
                        :max="SatelliteKnobs.MAX_BADGE_SIZE"
                        :step="SatelliteKnobs.BADGE_SIZE_STEP"
                        :width="FIELD_WIDTH"
                        ariaLabel="Satellite size"
                        @input="(value: number) => (badgeSize = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="isBehindSubject"
                    label="Behind the subject"
                    hint="Puts the satellite under the subject rather than over it, so the subject hides whatever overlaps."
                >
                    <PageCheckField
                        :value="isBehindSubject"
                        ariaLabel="Behind the subject"
                        @change="(value: boolean) => (isBehindSubject = value)"
                    />
                </PageProp>
            </PageExampleKnobs>
        </template>

        <template #several>
            <PageMeasureBox>
                <SeveralExample :subject-width="subjectWidth" :subject-height="subjectHeight" />
            </PageMeasureBox>
        </template>

        <template #badge>
            <PageMeasureBox>
                <BadgeExample
                    :subject-width="subjectWidth"
                    :subject-height="subjectHeight"
                    :corner="corner"
                    :count="count"
                    :overhang="overhang"
                />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp
                    item-key="badgeCorner"
                    label="Corner"
                    hint="Which corner the badge is pinned to; the overhang turns outward with it."
                >
                    <PageSelectField
                        :value="corner"
                        :values="SatelliteKnobs.BADGE_CORNERS"
                        :width="FIELD_WIDTH"
                        ariaLabel="Corner"
                        @change="(next: SatelliteBadgeCorner) => (corner = next)"
                    />
                </PageProp>

                <PageProp
                    item-key="badgeCount"
                    label="Count"
                    hint="The number on the badge. More digits make it wider, and it grows toward the middle."
                >
                    <PageNumberField
                        :value="count"
                        :min="SatelliteKnobs.MIN_COUNT"
                        :max="SatelliteKnobs.MAX_COUNT"
                        :step="SatelliteKnobs.COUNT_STEP"
                        :width="FIELD_WIDTH"
                        ariaLabel="Count"
                        @input="(value: number) => (count = value)"
                    />
                </PageProp>

                <PageProp
                    item-key="badgeOverhang"
                    label="Overhang (px)"
                    hint="How far the badge pokes out past each of the two edges it is pinned to."
                >
                    <PageNumberField
                        :value="overhang"
                        :min="SatelliteKnobs.MIN_OVERHANG"
                        :max="SatelliteKnobs.MAX_OVERHANG"
                        :step="SatelliteKnobs.OVERHANG_STEP"
                        :width="FIELD_WIDTH"
                        ariaLabel="Overhang"
                        @input="(value: number) => (overhang = value)"
                    />
                </PageProp>
            </PageExampleKnobs>
        </template>
    </PageExamples>
</template>
