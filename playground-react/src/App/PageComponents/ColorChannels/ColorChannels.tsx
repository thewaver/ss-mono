import { useEffect, useState } from "react";

import { Radio, RadioGroup, TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { Color } from "@thewaver/ss-utils";

import {
    PageColorChannel,
    PageColorChannelGrid,
    PageColorPickerRow,
} from "../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageRadioContent } from "../../StyledComponents/RadioContent/RadioContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageNumberField } from "../Field/Field";
import type { PageColorChannelsProps } from "./ColorChannels.types";

const SPACES: Color.ValueSpace[] = ["rgba", "hsla", "hexa"];
const RGB_CHANNELS = ["r", "g", "b"] as const;
const HSL_CHANNELS = ["s", "l"] as const;
const CHANNEL_FIELD_WIDTH = 76;
const HEX_FIELD_WIDTH = 150;
const CHANNEL_MAX = 255;
const HUE_MAX = 360;
const PERCENT = 100;
const ALPHA_STEP = 0.01;
const ALPHA_MAX = 1;

export const PageColorChannels = (props: PageColorChannelsProps) => {
    const spaceState = useState<Color.ValueSpace>("rgba");
    const [space] = spaceState;
    const [hex, setHex] = useState("");

    const [hsv, setHsv] = props.hsv;

    const rgba = Color.HSVA.toRgba(hsv);

    const hsla = Color.HSVA.toHsla(hsv);

    const hexa = Color.RGBA.toHexa(rgba);

    const alpha = Color.HSVA.getClampedAlpha(hsv);

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
        setHex(hexa);
    };

    useEffect(() => {
        if (!Color.Hexa.isHexa(hex)) return;

        setHsv(Color.Hexa.toHsva(hex));
    }, [hex]);

    useEffect(() => {
        if (space !== "hexa") return;

        refreshHexField();
    }, [space]);

    return (
        <>
            <PageColorPickerRow>
                <RadioGroup value={spaceState} orientation={"horizontal"} gap={5} ariaLabel={"Color space"}>
                    {SPACES.map((option) => (
                        <Radio
                            key={option}
                            value={option}
                            ariaLabel={option.toUpperCase()}
                            renderContent={(flags) => (
                                <PageRadioContent flags={flags}>{option.toUpperCase()}</PageRadioContent>
                            )}
                        />
                    ))}
                </RadioGroup>
            </PageColorPickerRow>

            {space === "rgba" && (
                <PageColorChannelGrid>
                    {RGB_CHANNELS.map((channel) => (
                        <PageColorChannel key={channel} label={channel}>
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
                    ))}

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
            )}

            {space === "hsla" && (
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

                    {HSL_CHANNELS.map((channel) => (
                        <PageColorChannel key={channel} label={channel}>
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
                    ))}

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
            )}

            {space === "hexa" && (
                <div onBlur={refreshHexField}>
                    <PageColorChannel label="hexa">
                        <TextInput
                            value={[hex, setHex]}
                            id={"channelHexa"}
                            ariaLabel={"Hex with alpha"}
                            padding={FIELD_PADDING}
                            gap={FIELD_GAP}
                            computeTextStyle={computePageTextFieldTextStyle}
                            renderContent={(flags) => <PageTextFieldContent flags={flags} width={HEX_FIELD_WIDTH} />}
                        />
                    </PageColorChannel>
                </div>
            )}
        </>
    );
};
