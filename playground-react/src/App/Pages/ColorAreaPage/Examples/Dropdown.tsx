import { useEffect, useState } from "react";

import { Button, Popover, Range } from "@thewaver/ss-components-react";
import { Color } from "@thewaver/ss-utils";

import { PageColorChannels } from "../../../PageComponents/ColorChannels/ColorChannels";
import {
    PageColorFieldTrigger,
    PageColorPickerPopup,
    PageColorPickerRow,
    PageColorPreview,
    PageColorSwatch,
    PageHueSlider,
} from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import type { ColorAreaDropdownExampleProps } from "../ColorAreaPage.types";
import { SurfaceExample } from "./Surface";

const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

type Props = ColorAreaDropdownExampleProps;

export const DropdownExample = (props: Props) => {
    const [triggerRef, setTriggerRef] = useState<HTMLElement>();

    const [isOpen, setIsOpen] = props.isOpen;
    const [hsv, setHsv] = props.hsv;
    const [hue, setHue] = props.hue;

    const css = Color.RGBA.toCss(Color.HSVA.toRgba(hsv));

    const hexa = Color.HSVA.toHexa(hsv);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Node | null;

            if (!target) return;
            if (document.getElementById(props.popupId)?.contains(target)) return;
            if (triggerRef?.contains(target)) return;

            setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isOpen, props.popupId, triggerRef]);

    useEffect(() => {
        if (hue === hsv.h) return;

        setHue(hsv.h);
    }, [hsv.h]);

    useEffect(() => {
        if (hsv.h === hue) return;

        setHsv({ ...hsv, h: hue });
    }, [hue]);

    return (
        <>
            <Button
                ref={(element) => setTriggerRef(element ?? undefined)}
                renderContent={(flags) => (
                    <PageColorFieldTrigger flags={flags}>
                        <PageColorSwatch value={css} />
                        {hexa}
                    </PageColorFieldTrigger>
                )}
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            />

            <Popover
                id={props.popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": "Choose a color" }}
                isOpen={isOpen}
                anchorRef={triggerRef}
                hasAutoFocus={true}
                offset={{ x: 0, y: 5 }}
                onKeyDown={(e) => {
                    if (e.key !== "Escape") return;

                    setIsOpen(false);
                    triggerRef?.focus();
                }}
                renderContent={() => (
                    <PageColorPickerPopup>
                        <PageColorPreview value={css} />

                        <SurfaceExample hsv={props.hsv} />

                        <PageColorPickerRow>
                            <Range
                                value={props.hue}
                                sizing={"fill"}
                                max={HUE_MAX}
                                step={1}
                                id={"hueSlider"}
                                ariaLabel={"Hue"}
                                thumbSize={HUE_THUMB_SIZE}
                                renderContent={(renderProps) => <PageHueSlider renderProps={renderProps} />}
                            />
                        </PageColorPickerRow>

                        <PageColorChannels hsv={props.hsv} />
                    </PageColorPickerPopup>
                )}
            />
        </>
    );
};
