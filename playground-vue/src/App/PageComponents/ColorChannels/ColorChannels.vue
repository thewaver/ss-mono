<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

import { Radio, RadioGroup, TextInput } from "@thewaver/ss-components-vue";
import {
    ALPHA_MAX,
    ALPHA_STEP,
    CHANNEL_FIELD_WIDTH,
    CHANNEL_MAX,
    HEX_FIELD_WIDTH,
    HSL_CHANNELS,
    HUE_MAX,
    PERCENT,
    RGB_CHANNELS,
    SPACES,
} from "@thewaver/ss-playground/App/PageComponents/ColorChannels/ColorChannels.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { Color } from "@thewaver/ss-utils";

import PageColorChannel from "../../StyledComponents/ColorAreaContent/PageColorChannel.vue";
import PageColorChannelGrid from "../../StyledComponents/ColorAreaContent/PageColorChannelGrid.vue";
import PageColorPickerRow from "../../StyledComponents/ColorAreaContent/PageColorPickerRow.vue";
import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageNumberField from "../Field/PageNumberField.vue";
import type { PageColorChannelsProps } from "./ColorChannels.types";

const props = defineProps<PageColorChannelsProps>();

const hsv = useModel(props, "hsv");

const space = shallowRef<Color.ValueSpace>("rgba");
const hex = shallowRef("");

const rgba = computed(() => Color.HSVA.toRgba(hsv.value));

const hsla = computed(() => Color.HSVA.toHsla(hsv.value));

const hexa = computed(() => Color.RGBA.toHexa(rgba.value));

const alpha = computed(() => Color.HSVA.getClampedAlpha(hsv.value));

const setRgbaChannel = (channel: (typeof RGB_CHANNELS)[number], value: number) => {
    hsv.value = Color.RGBA.toHsva({ ...rgba.value, [channel]: value });
};

const setHslaChannel = (channel: "h" | (typeof HSL_CHANNELS)[number], value: number) => {
    const hsl = { ...hsla.value, [channel]: value };

    hsv.value = Color.HSLA.toHsva({ ...hsl, a: alpha.value });
};

const setAlpha = (value: number) => {
    hsv.value = { ...hsv.value, a: value };
};

const refreshHexField = () => {
    hex.value = hexa.value;
};

watch(hex, (value) => {
    if (!Color.Hexa.isHexa(value)) return;

    hsv.value = Color.Hexa.toHsva(value);
});

watch(space, (value) => {
    if (value !== "hexa") return;

    refreshHexField();
});
</script>

<template>
    <PageColorPickerRow>
        <RadioGroup v-model:value="space" orientation="horizontal" :gap="5" ariaLabel="Color space">
            <Radio v-for="option in SPACES" :key="option" :value="option" :ariaLabel="option.toUpperCase()">
                <template #renderContent="flags">
                    <PageRadioContent :flags="flags">{{ option.toUpperCase() }}</PageRadioContent>
                </template>
            </Radio>
        </RadioGroup>
    </PageColorPickerRow>

    <PageColorChannelGrid v-if="space === 'rgba'">
        <PageColorChannel v-for="channel in RGB_CHANNELS" :key="channel" :label="channel">
            <PageNumberField
                :value="Math.round(rgba[channel])"
                :min="0"
                :max="CHANNEL_MAX"
                :width="CHANNEL_FIELD_WIDTH"
                :id="`channel${channel.toUpperCase()}`"
                :ariaLabel="`Red green blue channel ${channel}`"
                @input="(value: number) => setRgbaChannel(channel, value)"
            />
        </PageColorChannel>

        <PageColorChannel label="a">
            <PageNumberField
                :value="alpha"
                id="channelA"
                :min="0"
                :max="ALPHA_MAX"
                :step="ALPHA_STEP"
                :width="CHANNEL_FIELD_WIDTH"
                ariaLabel="Alpha"
                @input="setAlpha"
            />
        </PageColorChannel>
    </PageColorChannelGrid>

    <PageColorChannelGrid v-if="space === 'hsla'">
        <PageColorChannel label="h">
            <PageNumberField
                :value="Math.round(hsla.h)"
                :min="0"
                :max="HUE_MAX"
                :width="CHANNEL_FIELD_WIDTH"
                id="channelH"
                ariaLabel="Hue channel"
                @input="(value: number) => setHslaChannel('h', value)"
            />
        </PageColorChannel>

        <PageColorChannel v-for="channel in HSL_CHANNELS" :key="channel" :label="channel">
            <PageNumberField
                :value="Math.round(hsla[channel])"
                :min="0"
                :max="PERCENT"
                :width="CHANNEL_FIELD_WIDTH"
                :id="`channel${channel.toUpperCase()}`"
                :ariaLabel="`Hue saturation lightness channel ${channel}`"
                @input="(value: number) => setHslaChannel(channel, value)"
            />
        </PageColorChannel>

        <PageColorChannel label="a">
            <PageNumberField
                :value="alpha"
                id="channelA"
                :min="0"
                :max="ALPHA_MAX"
                :step="ALPHA_STEP"
                :width="CHANNEL_FIELD_WIDTH"
                ariaLabel="Alpha"
                @input="setAlpha"
            />
        </PageColorChannel>
    </PageColorChannelGrid>

    <div v-if="space === 'hexa'" @focusout="refreshHexField">
        <PageColorChannel label="hexa">
            <TextInput
                id="channelHexa"
                v-model:value="hex"
                ariaLabel="Hex with alpha"
                :padding="FIELD_PADDING"
                :gap="FIELD_GAP"
                :compute-text-style="computePageTextFieldTextStyle"
            >
                <template #renderContent="flags">
                    <PageTextFieldContent :flags="flags" :width="HEX_FIELD_WIDTH" />
                </template>
            </TextInput>
        </PageColorChannel>
    </div>
</template>
