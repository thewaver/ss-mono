import { useRef, useState } from "react";

import type { ColorAreaRenderProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";
import { Color } from "@thewaver/ss-utils";

import { Button, ColorArea, Popover, Range } from "../../src";

const AREA_SIZE = 160;
const HUE_MAX = 360;
const HUE_THUMB_SIZE = 18;
const PERCENT = 100;
const AXIS_LABELS = { saturation: "Saturation", brightness: "Brightness" };
const POPUP_ID = "colorAreaPicker";

const Square = ({ flags }: { flags: InteractionFlags<ColorAreaRenderProps> }) => (
    <div
        className={flags.isDragging ? "isDragging" : undefined}
        style={{
            position: "relative",
            height: AREA_SIZE,
            background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${flags.hsv.h}deg 100% 50%))`,
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    >
        <div
            style={{
                position: "absolute",
                left: `${flags.hsv.s}%`,
                top: `${PERCENT - flags.hsv.v}%`,
                width: 10,
                height: 10,
                marginLeft: -5,
                marginTop: -5,
                borderRadius: "50%",
                border: "2px solid white",
                outline: flags.focusVisibleAxis ? "2px solid blue" : undefined,
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
                top: 0,
                left: `calc(${flags.ratios[0]} * (100% - ${HUE_THUMB_SIZE}px))`,
                width: HUE_THUMB_SIZE,
                height: HUE_THUMB_SIZE,
                background: `hsl(${flags.values[0] % HUE_MAX} 100% 50%)`,
            }}
        />
    </div>
);

const Surface = ({
    hsvState,
    isDisabled = false,
}: {
    hsvState: readonly [Color.HSVA, (hsv: Color.HSVA) => void];
    isDisabled?: boolean;
}) => (
    <div style={{ width: AREA_SIZE }}>
        <ColorArea
            hsvState={hsvState}
            sizing={"fill"}
            isDisabled={isDisabled}
            ariaLabel={"Saturation and brightness"}
            axisLabels={AXIS_LABELS}
            renderContent={(flags) => <Square flags={flags} />}
        />
    </div>
);

const Dropdown = () => {
    const [hsv, setHsv] = useState<Color.HSVA>({ h: 90, s: 50, v: 80, a: 1 });
    const [isOpen, setIsOpen] = useState(false);
    const [trigger, setTrigger] = useState<HTMLElement>();
    const triggerRef = useRef<HTMLElement | null>(null);

    return (
        <div data-testid="dropdown">
            <Button
                ref={(element) => {
                    triggerRef.current = element;
                    setTrigger(element ?? undefined);
                }}
                renderContent={() => <span>{Color.HSVA.toHexa(hsv)}</span>}
                onClick={() => setIsOpen((was) => !was)}
            />

            <Popover
                id={POPUP_ID}
                role={"dialog"}
                ariaAttributes={{ "aria-label": "Choose a color" }}
                isOpen={isOpen}
                anchorRef={trigger}
                hasAutoFocus={true}
                offset={{ x: 0, y: 5 }}
                onDismiss={(reason) => {
                    setIsOpen(false);

                    if (reason === "escape") triggerRef.current?.focus();
                }}
                renderContent={() => (
                    <div style={{ width: AREA_SIZE, padding: 10, background: "white" }}>
                        <Surface hsvState={[hsv, setHsv]} />

                        <Range
                            valueState={[hsv.h, (hue) => setHsv((previous) => ({ ...previous, h: hue }))]}
                            sizing={"fill"}
                            max={HUE_MAX}
                            step={1}
                            id={"hueSlider"}
                            ariaLabel={"Hue"}
                            thumbSize={HUE_THUMB_SIZE}
                            renderContent={(flags) => <HueTrack flags={flags} />}
                        />
                    </div>
                )}
            />

            <output data-readout="value">{`${Color.HSVA.toHexa(hsv)} — open: ${isOpen}`}</output>
        </div>
    );
};

export const Page = () => {
    const bareState = useState<Color.HSVA>({ h: 210, s: 70, v: 90, a: 1 });
    const disabledState = useState<Color.HSVA>({ h: 0, s: 60, v: 60, a: 1 });
    const [bare] = bareState;

    return (
        <>
            <div data-testid="bare">
                <Surface hsvState={bareState} />
                <output data-readout="value">
                    {`hsv: ${Math.round(bare.h)}° ${Math.round(bare.s)}% ${Math.round(bare.v)}% — hex: ${Color.HSV.toHex(bare)}`}
                </output>
            </div>

            <Dropdown />

            <div data-testid="disabled">
                <Surface hsvState={disabledState} isDisabled />
            </div>
        </>
    );
};
