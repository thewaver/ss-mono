<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import { TimelineKnobs } from "@thewaver/ss-playground/App/Knobs/Timelines.const";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    DAY,
    REEL,
    TRIM_CLIPS,
    formatClock,
    formatStopwatch,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import MeetingsExample from "./Examples/Meetings.vue";
import TracksExample from "./Examples/Tracks.vue";
import TrimExample from "./Examples/Trim.vue";
import type { TimelineExampleProps } from "./TimelinePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TimelinePage/Examples";

const isPannable = shallowRef(TimelineKnobs.STARTING_IS_PANNABLE);
const isZoomable = shallowRef(TimelineKnobs.STARTING_IS_ZOOMABLE);
const isDisabled = shallowRef(TimelineKnobs.STARTING_IS_DISABLED);
const picked = shallowRef("nothing yet");

const dayView = shallowRef(DAY);
const reelView = shallowRef(REEL);
const trimReelView = shallowRef(REEL);
const trimClips = shallowRef(TRIM_CLIPS);
const trimmed = shallowRef<Clip>();

const reset = () => {
    dayView.value = DAY;
    reelView.value = REEL;
    trimReelView.value = REEL;
    trimClips.value = TRIM_CLIPS;
    trimmed.value = undefined;
    picked.value = "nothing yet";
};

const trimReadout = computed(() =>
    trimmed.value === undefined
        ? "nothing trimmed yet"
        : `${trimmed.value.name} now runs ${formatStopwatch(trimmed.value.from)} to ${formatStopwatch(trimmed.value.to)}`,
);

const commonProps = computed<Omit<TimelineExampleProps, "view" | "onUpdate:view">>(() => ({
    isPannable: isPannable.value,
    isZoomable: isZoomable.value,
    isDisabled: isDisabled.value,
    onPick: (name) => {
        picked.value = name;
    },
}));

const examples: ExampleDefs[] = [
    {
        key: "meetings",
        name: "A day of meetings",
        readout: () =>
            `showing ${formatClock(dayView.value.start)} to ${formatClock(dayView.value.end)} — the lanes are the component's own answer to what overlaps, and it takes the gestures itself: the wheel zooms where the pointer is, a drag moves the window, and a press that never travels still picks the meeting under it. The red line is a marker at the time on this computer's clock, and it is only drawn while that time is inside the day shown`,
        path: `${EXAMPLES_ROOT}/Meetings.vue`,
    },
    {
        key: "tracks",
        name: "Three tracks",
        readout: () =>
            `showing ${formatStopwatch(reelView.value.start)} to ${formatStopwatch(reelView.value.end)} — here the page says which lane each clip belongs to, and the buttons are the route for anyone who cannot drag or pinch. The orange line is a marker the page moves while it plays`,
        path: `${EXAMPLES_ROOT}/Tracks.vue`,
    },
    {
        key: "trim",
        name: "Trimming clips",
        readout: () =>
            `${trimReadout.value} — drag either end of a clip, or press an end and then press where it should go; from the keyboard, Enter takes hold of a clip's end, Home and End switch ends, the arrows move it a second at a time, Enter drops it and Escape puts it back`,
        path: `${EXAMPLES_ROOT}/Trim.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isPannable"
            label="Drag to move"
            hint="Lets the timeline be dragged sideways to move through it."
        >
            <PageCheckField
                :value="isPannable"
                ariaLabel="Drag to move"
                @change="(value: boolean) => (isPannable = value)"
            />
        </PageProp>

        <PageProp
            item-key="isZoomable"
            label="Wheel and pinch to zoom"
            hint="Lets the wheel and a pinch change how much of the timeline is in view."
        >
            <PageCheckField
                :value="isZoomable"
                ariaLabel="Wheel and pinch to zoom"
                @change="(value: boolean) => (isZoomable = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the timeline off, so it neither pans, zooms nor picks."
        >
            <PageCheckField :value="isDisabled" ariaLabel="Disabled" @change="(value: boolean) => (isDisabled = value)" />
        </PageProp>

        <PageProp
            item-key="picked"
            :label="`Picked: ${picked}`"
            hint="Puts the examples back to the item they started on, and clears whatever has been picked since."
        >
            <Button @click="async () => reset()">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Reset</PageButtonContent>
                </template>
            </Button>
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" :min-column-width="520">
        <template #meetings>
            <MeetingsExample v-bind="commonProps" v-model:view="dayView" />
        </template>

        <template #tracks>
            <TracksExample v-bind="commonProps" v-model:view="reelView" />
        </template>

        <template #trim>
            <TrimExample
                v-bind="commonProps"
                v-model:view="trimReelView"
                v-model:clips="trimClips"
                @trim="(clip: Clip) => (trimmed = clip)"
            />
        </template>
    </PageExamples>
</template>
