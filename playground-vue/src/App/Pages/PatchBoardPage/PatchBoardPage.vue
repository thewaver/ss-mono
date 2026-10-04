<script setup lang="ts">
import { shallowRef } from "vue";

import type { PatchBoardLink } from "@thewaver/ss-components-vue";
import { PATCH_BOARD_DEFAULTS } from "@thewaver/ss-components-vue";
import { PatchBoardKnobs } from "@thewaver/ss-playground/App/Knobs/PatchBoards.const";
import {
    BOARD_WIDTH,
    CHAIN_LINKS,
    CHAIN_NODES,
    MAX_ZOOM,
    MIN_ZOOM,
    MIXER_LINKS,
    MIXER_NODES,
    PAN_LINKS,
    PAN_NODES,
    RACK_LINKS,
    RACK_NODES,
    STARTING_ZOOM,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import { MathUtils } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BeamsExample from "./Examples/Beams.vue";
import ChainExample from "./Examples/Chain.vue";
import MixerExample from "./Examples/Mixer.vue";
import PanExample from "./Examples/Pan.vue";
import RackExample from "./Examples/Rack.vue";
import ZoomExample from "./Examples/Zoom.vue";

const EXAMPLES_ROOT = "/src/App/Pages/PatchBoardPage/Examples";

const WIDE_SPAN = 2;
const PERCENT = 100;
const NOTHING_DONE = "nothing yet";

const getLinkWords = (link: PatchBoardLink) =>
    `${link.from.nodeKey} ${link.from.socketId} to ${link.to.nodeKey} ${link.to.socketId}`;

const socketSize = shallowRef(PATCH_BOARD_DEFAULTS.socketSize);
const isLocked = shallowRef(PatchBoardKnobs.STARTING_IS_LOCKED);
const isDisabled = shallowRef(PatchBoardKnobs.STARTING_IS_DISABLED);
const chainAction = shallowRef(NOTHING_DONE);
const mixerAction = shallowRef(NOTHING_DONE);
const rackAction = shallowRef(NOTHING_DONE);
const panAction = shallowRef(NOTHING_DONE);
const zoomAction = shallowRef(NOTHING_DONE);
const beamsAction = shallowRef(NOTHING_DONE);
const zoom = shallowRef(STARTING_ZOOM);

const chainNodes = shallowRef(CHAIN_NODES);
const chainLinks = shallowRef(CHAIN_LINKS);
const mixerNodes = shallowRef(MIXER_NODES);
const mixerLinks = shallowRef(MIXER_LINKS);
const rackNodes = shallowRef(RACK_NODES);
const rackLinks = shallowRef(RACK_LINKS);
const panNodes = shallowRef(PAN_NODES);
const panLinks = shallowRef(PAN_LINKS);
const zoomNodes = shallowRef(CHAIN_NODES);
const zoomLinks = shallowRef(CHAIN_LINKS);
const beamsNodes = shallowRef(CHAIN_NODES);
const beamsLinks = shallowRef(CHAIN_LINKS);

const examples: ExampleDefs[] = [
    {
        key: "chain",
        name: "Signal chain",
        span: WIDE_SPAN,
        readout: () =>
            `${chainLinks.value.length} cables, last: ${chainAction.value} — the gate's second input is disabled, so a cable aimed at it is refused`,
        path: `${EXAMPLES_ROOT}/Chain.vue`,
    },
    {
        key: "mixer",
        name: "Mixing desk",
        span: WIDE_SPAN,
        readout: () =>
            `${mixerLinks.value.length} cables, last: ${mixerAction.value} — a standing board, sockets on the top and bottom edges; only the desk may feed the amp, so a source aimed straight at it is refused`,
        path: `${EXAMPLES_ROOT}/Mixer.vue`,
    },
    {
        key: "rack",
        name: "Effects rack",
        span: WIDE_SPAN,
        readout: () =>
            `${rackLinks.value.length} cables, last: ${rackAction.value} — a node lands on the grid as it is dragged, and an arrow key takes it to the next grid point; a cable that would feed a signal back to where it came from, such as the reverb into the delay's feedback, is refused`,
        path: `${EXAMPLES_ROOT}/Rack.vue`,
    },
    {
        key: "pan",
        name: "Panned board",
        span: WIDE_SPAN,
        readout: () =>
            `${panLinks.value.length} cables, last: ${panAction.value} — the board is wider and taller than its window, so scroll to pan; a node carried with the arrow keys brings the window with it`,
        path: `${EXAMPLES_ROOT}/Pan.vue`,
    },
    {
        key: "zoom",
        name: "Zoomed board",
        span: WIDE_SPAN,
        readout: () =>
            `${zoomLinks.value.length} cables at ${Math.round(zoom.value * PERCENT)}%, last: ${zoomAction.value} — the board is scaled with a CSS transform, and a drag still lands under the pointer`,
        path: `${EXAMPLES_ROOT}/Zoom.vue`,
    },
    {
        key: "beams",
        name: "The signal running along its cables",
        span: WIDE_SPAN,
        readout: () =>
            `${beamsLinks.value.length} cables, last: ${beamsAction.value} — a pulse runs along every plugged cable from the output to the input it feeds, taking the same time on a long cable as on a short one; Pause stops it`,
        path: `${EXAMPLES_ROOT}/Beams.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="socketSize"
            label="Socket size"
            hint="How large each socket is drawn, as a fraction of the board's width, so a wider board has larger sockets."
        >
            <PageNumberField
                :value="socketSize"
                :min="PatchBoardKnobs.MIN_SOCKET_SIZE"
                :max="PatchBoardKnobs.MAX_SOCKET_SIZE"
                :step="PatchBoardKnobs.SOCKET_SIZE_STEP"
                ariaLabel="Socket size as a fraction of the board's width"
                @input="(value: number) => (socketSize = value)"
            />
        </PageProp>

        <PageProp
            item-key="isLocked"
            label="Wiring locked"
            hint="Freezes the wiring as it stands: the cables still show, but none can be dragged, made or pulled out."
        >
            <PageCheckField
                :value="isLocked"
                ariaLabel="Wiring locked"
                @change="(value: boolean) => (isLocked = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the whole board off, so nothing on it responds to the pointer or the keyboard."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #chain>
            <PageMeasureBox :width="BOARD_WIDTH">
                <ChainExample
                    v-model:nodes="chainNodes"
                    v-model:links="chainLinks"
                    :socket-size="socketSize"
                    :is-locked="isLocked"
                    :is-disabled="isDisabled"
                    @link="(link: PatchBoardLink) => (chainAction = `connected ${getLinkWords(link)}`)"
                    @unlink="(link: PatchBoardLink) => (chainAction = `unplugged ${getLinkWords(link)}`)"
                    @move="(nodeKey: string) => (chainAction = `moved ${nodeKey}`)"
                />
            </PageMeasureBox>
        </template>

        <template #mixer>
            <PageMeasureBox :width="BOARD_WIDTH">
                <MixerExample
                    v-model:nodes="mixerNodes"
                    v-model:links="mixerLinks"
                    :socket-size="socketSize"
                    :is-locked="isLocked"
                    :is-disabled="isDisabled"
                    @link="(link: PatchBoardLink) => (mixerAction = `connected ${getLinkWords(link)}`)"
                    @unlink="(link: PatchBoardLink) => (mixerAction = `unplugged ${getLinkWords(link)}`)"
                    @move="(nodeKey: string) => (mixerAction = `moved ${nodeKey}`)"
                />
            </PageMeasureBox>
        </template>

        <template #rack>
            <PageMeasureBox>
                <RackExample
                    v-model:nodes="rackNodes"
                    v-model:links="rackLinks"
                    :socket-size="socketSize"
                    :is-locked="isLocked"
                    :is-disabled="isDisabled"
                    @link="(link: PatchBoardLink) => (rackAction = `connected ${getLinkWords(link)}`)"
                    @unlink="(link: PatchBoardLink) => (rackAction = `unplugged ${getLinkWords(link)}`)"
                    @move="(nodeKey: string) => (rackAction = `moved ${nodeKey}`)"
                />
            </PageMeasureBox>
        </template>

        <template #pan>
            <PageMeasureBox>
                <PanExample
                    v-model:nodes="panNodes"
                    v-model:links="panLinks"
                    :socket-size="socketSize"
                    :is-locked="isLocked"
                    :is-disabled="isDisabled"
                    @link="(link: PatchBoardLink) => (panAction = `connected ${getLinkWords(link)}`)"
                    @unlink="(link: PatchBoardLink) => (panAction = `unplugged ${getLinkWords(link)}`)"
                    @move="(nodeKey: string) => (panAction = `moved ${nodeKey}`)"
                />
            </PageMeasureBox>
        </template>

        <template #zoom>
            <ZoomExample
                v-model:nodes="zoomNodes"
                v-model:links="zoomLinks"
                :socket-size="socketSize"
                :is-locked="isLocked"
                :is-disabled="isDisabled"
                :zoom="zoom"
                @zoom-change="(next: number) => (zoom = MathUtils.clamp(next, MIN_ZOOM, MAX_ZOOM))"
                @link="(link: PatchBoardLink) => (zoomAction = `connected ${getLinkWords(link)}`)"
                @unlink="(link: PatchBoardLink) => (zoomAction = `unplugged ${getLinkWords(link)}`)"
                @move="(nodeKey: string) => (zoomAction = `moved ${nodeKey}`)"
            />
        </template>

        <template #beams>
            <PageMeasureBox :width="BOARD_WIDTH">
                <BeamsExample
                    v-model:nodes="beamsNodes"
                    v-model:links="beamsLinks"
                    :socket-size="socketSize"
                    :is-locked="isLocked"
                    :is-disabled="isDisabled"
                    @link="(link: PatchBoardLink) => (beamsAction = `connected ${getLinkWords(link)}`)"
                    @unlink="(link: PatchBoardLink) => (beamsAction = `unplugged ${getLinkWords(link)}`)"
                    @move="(nodeKey: string) => (beamsAction = `moved ${nodeKey}`)"
                />
            </PageMeasureBox>
        </template>
    </PageExamples>
</template>
