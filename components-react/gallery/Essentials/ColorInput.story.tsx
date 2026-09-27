import { useState } from "react";

import type {
    ColorAreaRenderProps,
    ColorInputRenderProps,
    InteractionFlags,
    RangeRenderProps,
} from "@thewaver/ss-components";
import { Color } from "@thewaver/ss-utils";

import { ColorInput, type ColorInputProps } from "../../src";

const AREA_SIZE = 160;
const HUE_THUMB_SIZE = 16;
const PERCENT = 100;
const PALETTE = ["#ff0055", "#00d1b2", "#ffb400", "#7a5cff"];

const LABELS = {
    pickerLabel: "Choose a color",
    areaLabel: "Saturation and brightness",
    areaAxisLabels: { saturation: "Saturation", brightness: "Brightness" },
    hueLabel: "Hue",
};

const channels = (hex: string) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));

const toNearestPaletteColor = (value: string) => {
    const target = channels(value);
    const distance = (hex: string) =>
        channels(hex).reduce((sum, channel, index) => sum + (channel - target[index]) ** 2, 0);

    return PALETTE.reduce((closest, candidate) => (distance(candidate) < distance(closest) ? candidate : closest));
};

const Square = ({ flags }: { flags: InteractionFlags<ColorAreaRenderProps> }) => (
    <div
        style={{
            position: "relative",
            height: AREA_SIZE,
            background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${flags.hsv.h}deg 100% 50%))`,
        }}
    >
        <div
            style={{
                position: "absolute",
                left: `${flags.hsv.s}%`,
                top: `${PERCENT - flags.hsv.v}%`,
                width: 10,
                height: 10,
                border: "2px solid white",
            }}
        />
    </div>
);

const HueTrack = ({ flags }: { flags: InteractionFlags<RangeRenderProps> }) => (
    <div
        style={{
            position: "relative",
            height: HUE_THUMB_SIZE,
            background: "linear-gradient(to right, red, blue, red)",
        }}
    >
        <div
            style={{
                position: "absolute",
                left: `calc(${flags.ratios[0]} * (100% - ${HUE_THUMB_SIZE}px))`,
                width: HUE_THUMB_SIZE,
                height: HUE_THUMB_SIZE,
                background: "white",
            }}
        />
    </div>
);

const Field = ({ flags }: { flags: InteractionFlags<ColorInputRenderProps> }) => (
    <span style={{ display: "flex", gap: 8, alignItems: "center", opacity: flags.isDisabled ? 0.5 : 1 }}>
        <span style={{ width: 20, height: 20, background: flags.isUnreadable ? "transparent" : flags.value }} />
        {flags.value}
    </span>
);

const SLOTS: Pick<ColorInputProps, "renderArea" | "renderHue" | "renderPopup"> = {
    renderArea: (flags) => <Square flags={flags} />,
    renderHue: (flags) => <HueTrack flags={flags} />,
    renderPopup: (renderSurface, hsvState) => (
        <div style={{ width: AREA_SIZE, padding: 10, background: "white" }}>
            <div data-preview style={{ height: 10, background: Color.RGBA.toCss(Color.HSVA.toRgba(hsvState[0])) }} />
            {renderSurface()}
        </div>
    ),
};

const Example = ({
    testId,
    initial,
    ariaLabel,
    isDisabled = false,
    isSnapping = false,
}: {
    testId: string;
    initial: string;
    ariaLabel: string;
    isDisabled?: boolean;
    isSnapping?: boolean;
}) => {
    const valueState = useState(initial);

    return (
        <div data-testid={testId}>
            <ColorInput
                {...SLOTS}
                {...LABELS}
                valueState={valueState}
                ariaLabel={ariaLabel}
                isDisabled={isDisabled}
                renderContent={(flags) => <Field flags={flags} />}
                onInput={isSnapping ? (value) => valueState[1](toNearestPaletteColor(value)) : undefined}
            />
            <output data-readout="value">{`value: ${valueState[0]}`}</output>
        </div>
    );
};

export const Page = () => (
    <>
        <Example testId="default" initial="#3366ff" ariaLabel="Brand color" />
        <Example testId="snapping" initial={PALETTE[0]} ariaLabel="Palette color" isSnapping />
        <Example testId="disabled" initial="#888888" ariaLabel="Disabled color" isDisabled />
    </>
);
