<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-vue";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import {
    TOOLTIP_ARROWS,
    TOOLTIP_ARROW_LABELS,
    TOOLTIP_HOVER_DELAY_MS,
    TOOLTIP_REVEALS,
    TOOLTIP_REVEAL_LABELS,
    type TooltipArrow,
    type TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import { useArrowBed } from "./ArrowBed.utils";
import ArrowBedKnobs from "./ArrowBedKnobs.vue";
import ArrowsDocsExample from "./Docs/Arrows.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CirclingDocsExample from "./Docs/Circling.vue";
import RichDocsExample from "./Docs/Rich.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import WordDocsExample from "./Docs/Word.vue";

const computeRevealLabel = (next: TooltipReveal) => TOOLTIP_REVEAL_LABELS[next];
const computeArrowLabel = (next: TooltipArrow) => TOOLTIP_ARROW_LABELS[next];

const reveal = shallowRef<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
const arrow = shallowRef<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
const arrowWidth = shallowRef(TooltipKnobs.STARTING_ARROW_WIDTH);
const arrowLength = shallowRef(TooltipKnobs.STARTING_ARROW_LENGTH);
const hPlacement = shallowRef<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
const vPlacement = shallowRef<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
const offsetX = shallowRef(TooltipKnobs.STARTING_OFFSET_X);
const offsetY = shallowRef(TooltipKnobs.STARTING_OFFSET_Y);
const transitionDurationMs = shallowRef(TOOLTIP_DEFAULTS.transitionDurationMs);
const focusShowDelayMs = shallowRef(TOOLTIP_DEFAULTS.focusShowDelayMs);
const hoverShowDelayMs = shallowRef(TOOLTIP_HOVER_DELAY_MS);

const circling = useArrowBed();
const arrowBed = useArrowBed();

const placement = computed(() => ({ x: hPlacement.value, y: vPlacement.value }));

const offset = computed(() => ({ x: offsetX.value, y: offsetY.value }));
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :placement="placement"
            :offset="offset"
            :transition-duration-ms="transitionDurationMs"
            :focus-show-delay-ms="focusShowDelayMs"
            :hover-show-delay-ms="hoverShowDelayMs"
            :reveal="reveal"
            :arrow="arrow"
            :arrow-width="arrowWidth"
            :arrow-length="arrowLength"
        />

        <template #renderKnobs>
            <PageProp
                item-key="reveal"
                controls="Picks how the example content drawn by TooltipProps.renderContent appears"
                label="Reveal"
                hint="How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes."
            >
                <PageSelectField
                    :value="reveal"
                    :values="TOOLTIP_REVEALS"
                    :compute-label="computeRevealLabel"
                    :width="FIELD_WIDTH"
                    ariaLabel="Reveal"
                    @change="(next: TooltipReveal) => (reveal = next)"
                />
            </PageProp>

            <PageProp
                item-key="arrow"
                controls="Picks the arrow on the example content drawn by TooltipProps.renderContent"
                label="Arrow"
                hint="An arrow grown out of the tooltip's body to point at its anchor. It comes out of the side facing the anchor, or out of the nearest corner when the tooltip sits off a corner, and there is none while the tooltip overlaps its anchor. The offset is what makes room for it."
            >
                <PageSelectField
                    :value="arrow"
                    :values="TOOLTIP_ARROWS"
                    :compute-label="computeArrowLabel"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrow"
                    @change="(next: TooltipArrow) => (arrow = next)"
                />
            </PageProp>

            <PageProp
                v-if="arrow !== 'none'"
                item-key="arrowWidth"
                controls="Sets the arrow width on the example content drawn by TooltipProps.renderContent"
                label="Arrow width (px)"
                hint="How wide the arrow is across its base. The lightning bolt spans this much from where its base starts to its tip."
            >
                <PageNumberField
                    :value="arrowWidth"
                    :min="TooltipKnobs.MIN_ARROW_SIZE"
                    :max="TooltipKnobs.MAX_ARROW_SIZE"
                    :step="TooltipKnobs.ARROW_SIZE_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrow width"
                    @input="(value: number) => (arrowWidth = value)"
                />
            </PageProp>

            <PageProp
                v-if="arrow !== 'none'"
                item-key="arrowLength"
                controls="Sets the arrow length on the example content drawn by TooltipProps.renderContent"
                label="Arrow length (px)"
                hint="How far the arrow's tip stands off the tooltip. Longer than the offset, and the tip reaches over the anchor."
            >
                <PageNumberField
                    :value="arrowLength"
                    :min="TooltipKnobs.MIN_ARROW_SIZE"
                    :max="TooltipKnobs.MAX_ARROW_SIZE"
                    :step="TooltipKnobs.ARROW_SIZE_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrow length"
                    @input="(value: number) => (arrowLength = value)"
                />
            </PageProp>

            <PageProp
                item-key="hPlacement"
                controls="Sets TooltipProps.placement.x"
                label="Placement across"
                hint="Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."
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
                controls="Sets TooltipProps.placement.y"
                label="Placement down"
                hint="Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether."
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
                controls="Sets TooltipProps.offset.x"
                label="Offset across (px)"
                hint="How far the tooltip is nudged sideways from where the placement put it."
            >
                <PageNumberField
                    :value="offsetX"
                    :min="TooltipKnobs.MIN_OFFSET"
                    :max="TooltipKnobs.MAX_OFFSET"
                    :step="TooltipKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset across"
                    @input="(value: number) => (offsetX = value)"
                />
            </PageProp>

            <PageProp
                item-key="offsetY"
                controls="Sets TooltipProps.offset.y"
                label="Offset down (px)"
                hint="How far the tooltip is nudged up or down from where the placement put it."
            >
                <PageNumberField
                    :value="offsetY"
                    :min="TooltipKnobs.MIN_OFFSET"
                    :max="TooltipKnobs.MAX_OFFSET"
                    :step="TooltipKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset down"
                    @input="(value: number) => (offsetY = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                controls="Sets TooltipProps.transitionDurationMs"
                label="Reveal (ms)"
                hint="How long the tooltip takes to appear and to go."
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="TooltipKnobs.MIN_DURATION"
                    :max="TooltipKnobs.MAX_DURATION"
                    :step="TooltipKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Reveal in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="focusShowDelayMs"
                controls="Sets TooltipProps.focusShowDelayMs"
                label="Focus delay (ms)"
                hint="How long a keyboard focus has to rest on the anchor before the tooltip appears."
            >
                <PageNumberField
                    :value="focusShowDelayMs"
                    :min="TooltipKnobs.MIN_DURATION"
                    :max="TooltipKnobs.MAX_DURATION"
                    :step="TooltipKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Focus delay in milliseconds"
                    @input="(value: number) => (focusShowDelayMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="hoverShowDelayMs"
                controls="Sets TooltipProps.hoverShowDelayMs"
                label="Hover delay (ms)"
                hint="How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows."
            >
                <PageNumberField
                    :value="hoverShowDelayMs"
                    :min="TooltipKnobs.MIN_DURATION"
                    :max="TooltipKnobs.MAX_DURATION"
                    :step="TooltipKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hover delay in milliseconds"
                    @input="(value: number) => (hoverShowDelayMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="On a word in running text"
        content="The tooltip is handed the element it describes through [prop]anchorRef[/prop] rather than wrapping it, so anything with a ref can carry one, here a word in the middle of a sentence."
    />

    <PageDocsAlert severity="alert">
        A word is not a tab stop, so this one is given tabindex="0". Without it the keyboard never reaches the word, and
        its tooltip shows to a pointer alone (<a :href="WCAG_URLS['2.1.1']">WCAG 2.1.1</a>).
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Word.vue`">
        <WordDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="More than a line"
        content="What the tooltip shows is whatever [prop]renderContent[/prop] draws, here a title over a paragraph, and it sits where its [prop]placement[/prop] puts it however tall that makes it. It is still read out as the anchor's description, in one run, so nothing in it can be pressed; a link or a button belongs in a HoverCard."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Rich.vue`">
        <RichDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the tooltip takes the box's direction although it is drawn outside it, so its lines read from the right. Its [prop]placement[/prop] is used as it stands: one asked to sit on the left still sits on the left."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="An arrow going round"
        content="An arrow is the drawing's too: [prop]renderContent[/prop] is handed where one should point, and ShapeUtils.attachArrow grows it out of any contour. Move the slider to aim it all the way round: it leaves straight out of the edge it faces, and turns through the diagonal as it rounds a corner."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Circling.vue`">
        <CirclingDocsExample
            :arrow="circling.arrow.value"
            :arrow-width="circling.arrowWidth.value"
            :arrow-length="circling.arrowLength.value"
            :shape="circling.shape.value"
        />

        <template #renderKnobs>
            <ArrowBedKnobs key-prefix="circling" :controls="circling" />
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Every arrow at once"
        content="Eight tooltips round one anchor, one on each side and at each corner, every arrow aimed by the rule a live tooltip's is aimed by, AnchorUtils.computeArrowAim. The corners are where a wide arrow goes wrong: past twice its length, its sides lean 45° or more."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Arrows.vue`">
        <ArrowsDocsExample
            :arrow="arrowBed.arrow.value"
            :arrow-width="arrowBed.arrowWidth.value"
            :arrow-length="arrowBed.arrowLength.value"
            :shape="arrowBed.shape.value"
        />

        <template #renderKnobs>
            <ArrowBedKnobs key-prefix="arrowBed" :controls="arrowBed" />
        </template>
    </PageDocsExample>
</template>
