<script lang="ts">
    import { untrack } from "svelte";

    import { Radio, RadioGroup, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import { Color } from "@thewaver/ss-utils";

    import PageColorChannel from "../../StyledComponents/ColorAreaContent/PageColorChannel.svelte";
    import PageColorChannelGrid from "../../StyledComponents/ColorAreaContent/PageColorChannelGrid.svelte";
    import PageColorPickerRow from "../../StyledComponents/ColorAreaContent/PageColorPickerRow.svelte";
    import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageNumberField from "../Field/PageNumberField.svelte";
    import type { PageColorChannelsProps } from "./ColorChannels.types";
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

    let props: PageColorChannelsProps = $props();

    let space = $state<Color.ValueSpace>("rgba");
    let hex = $state("");

    const hsv = $derived(props.hsv[0]());

    const rgba = $derived(Color.HSVA.toRgba(hsv));

    const hsla = $derived(Color.HSVA.toHsla(hsv));

    const hexa = $derived(Color.RGBA.toHexa(rgba));

    const alpha = $derived(Color.HSVA.getClampedAlpha(hsv));

    const setHsv = (next: Color.HSVA) => props.hsv[1](next);

    const setRgbaChannel = (channel: (typeof RGB_CHANNELS)[number], value: number) => {
        setHsv(Color.RGBA.toHsva({ ...rgba, [channel]: value }));
    };

    const setHslaChannel = (channel: "h" | (typeof HSL_CHANNELS)[number], value: number) => {
        const hsl = { ...hsla, [channel]: value };

        setHsv(Color.HSLA.toHsva({ ...hsl, a: alpha }));
    };

    const setAlpha = (value: number) => {
        setHsv({ ...hsv, a: value });
    };

    const refreshHexField = () => {
        hex = hexa;
    };

    $effect(() => {
        const typed = hex;

        untrack(() => {
            if (!Color.Hexa.isHexa(typed)) return;

            setHsv(Color.Hexa.toHsva(typed));
        });
    });

    $effect(() => {
        if (space !== "hexa") return;

        untrack(refreshHexField);
    });
</script>

<PageColorPickerRow>
    <RadioGroup bind:value={space} orientation={"horizontal"} gap={5} ariaLabel={"Color space"}>
        {#each SPACES as option (option)}
            <Radio value={option} ariaLabel={option.toUpperCase()}>
                {#snippet renderContent(flags)}
                    <PageRadioContent {flags}>{option.toUpperCase()}</PageRadioContent>
                {/snippet}
            </Radio>
        {/each}
    </RadioGroup>
</PageColorPickerRow>

{#if space === "rgba"}
    <PageColorChannelGrid>
        {#each RGB_CHANNELS as channel (channel)}
            <PageColorChannel label={channel}>
                <PageNumberField
                    value={Math.round(rgba[channel])}
                    min={0}
                    max={CHANNEL_MAX}
                    width={CHANNEL_FIELD_WIDTH}
                    id={`channel${channel.toUpperCase()}`}
                    ariaLabel={`Red green blue channel ${channel}`}
                    onInput={(value) => setRgbaChannel(channel, value)}
                />
            </PageColorChannel>
        {/each}

        <PageColorChannel label="a">
            <PageNumberField
                value={alpha}
                id={"channelA"}
                min={0}
                max={ALPHA_MAX}
                step={ALPHA_STEP}
                width={CHANNEL_FIELD_WIDTH}
                ariaLabel={"Alpha"}
                onInput={setAlpha}
            />
        </PageColorChannel>
    </PageColorChannelGrid>
{/if}

{#if space === "hsla"}
    <PageColorChannelGrid>
        <PageColorChannel label="h">
            <PageNumberField
                value={Math.round(hsla.h)}
                min={0}
                max={HUE_MAX}
                width={CHANNEL_FIELD_WIDTH}
                id={"channelH"}
                ariaLabel={"Hue channel"}
                onInput={(value) => setHslaChannel("h", value)}
            />
        </PageColorChannel>

        {#each HSL_CHANNELS as channel (channel)}
            <PageColorChannel label={channel}>
                <PageNumberField
                    value={Math.round(hsla[channel])}
                    min={0}
                    max={PERCENT}
                    width={CHANNEL_FIELD_WIDTH}
                    id={`channel${channel.toUpperCase()}`}
                    ariaLabel={`Hue saturation lightness channel ${channel}`}
                    onInput={(value) => setHslaChannel(channel, value)}
                />
            </PageColorChannel>
        {/each}

        <PageColorChannel label="a">
            <PageNumberField
                value={alpha}
                id={"channelA"}
                min={0}
                max={ALPHA_MAX}
                step={ALPHA_STEP}
                width={CHANNEL_FIELD_WIDTH}
                ariaLabel={"Alpha"}
                onInput={setAlpha}
            />
        </PageColorChannel>
    </PageColorChannelGrid>
{/if}

{#if space === "hexa"}
    <div onfocusout={refreshHexField}>
        <PageColorChannel label="hexa">
            <TextInput
                bind:value={hex}
                id={"channelHexa"}
                ariaLabel={"Hex with alpha"}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
            >
                {#snippet renderContent(flags)}
                    <PageTextFieldContent {flags} width={HEX_FIELD_WIDTH} />
                {/snippet}
            </TextInput>
        </PageColorChannel>
    </div>
{/if}
