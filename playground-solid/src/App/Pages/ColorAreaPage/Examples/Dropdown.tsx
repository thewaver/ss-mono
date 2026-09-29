import { createEffect, createSignal, onCleanup, untrack } from "solid-js";

import { Button, Popover, Range, access } from "@thewaver/ss-components-solid";
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
    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();

    const [getIsOpen, setIsOpen] = props.isOpen;

    const getCss = () => Color.RGBA.toCss(Color.HSVA.toRgba(props.hsv[0]()));

    const getHexa = () => Color.HSVA.toHexa(props.hsv[0]());

    createEffect(() => {
        if (!getIsOpen()) return;

        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Node | null;

            if (!target) return;
            if (document.getElementById(access(props.popupId))?.contains(target)) return;
            if (getTriggerRef()?.contains(target)) return;

            setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);

        onCleanup(() => {
            document.removeEventListener("pointerdown", handlePointerDown);
        });
    });

    createEffect(() => {
        const hue = props.hsv[0]().h;

        if (untrack(props.hue[0]) === hue) return;

        props.hue[1](hue);
    });

    createEffect(() => {
        const hue = props.hue[0]();

        if (untrack(() => props.hsv[0]().h) === hue) return;

        props.hsv[1]((prev) => ({ ...prev, h: hue }));
    });

    return (
        <>
            <Button
                ref={setTriggerRef}
                renderContent={(getFlags) => (
                    <PageColorFieldTrigger flags={getFlags}>
                        <PageColorSwatch value={getCss} />
                        {getHexa()}
                    </PageColorFieldTrigger>
                )}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
            />

            <Popover
                id={props.popupId}
                role={"dialog"}
                ariaAttributes={() => ({ "aria-label": "Choose a color" })}
                isOpen={getIsOpen}
                anchorRef={getTriggerRef}
                hasAutoFocus={true}
                offset={() => ({ x: 0, y: 5 })}
                onKeyDown={(e) => {
                    if (e.key !== "Escape") return;

                    setIsOpen(false);
                    getTriggerRef()?.focus();
                }}
                renderContent={() => (
                    <PageColorPickerPopup>
                        <PageColorPreview value={getCss} />

                        <SurfaceExample hsv={props.hsv} />

                        <PageColorPickerRow>
                            <Range
                                value={props.hue}
                                sizing={"fill"}
                                max={() => HUE_MAX}
                                step={1}
                                id={"hueSlider"}
                                ariaLabel={"Hue"}
                                thumbSize={() => HUE_THUMB_SIZE}
                                renderContent={(getRenderProps) => <PageHueSlider renderProps={getRenderProps} />}
                            />
                        </PageColorPickerRow>

                        <PageColorChannels hsv={props.hsv} />
                    </PageColorPickerPopup>
                )}
            />
        </>
    );
};
