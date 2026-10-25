import { createEffect, createSignal, createUniqueId, untrack } from "solid-js";

import { Button, ColorArea, Popover, Range } from "@thewaver/ss-components-solid";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { STARTING_PICKER_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import { PageColorChannels } from "../../../PageComponents/ColorChannels/ColorChannels";
import {
    PageColorAreaContent,
    PageColorFieldTrigger,
    PageColorPickerPopup,
    PageColorPickerRow,
    PageColorPreview,
    PageColorSwatch,
    PageHueSlider,
} from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";

const AREA_SIZE = 160;
const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

export const PickerDocsExample = () => {
    const popupId = createUniqueId();

    const hsvSignal = createSignal<Color.HSVA>(STARTING_PICKER_HSV);
    const hueSignal = createSignal(STARTING_PICKER_HSV.h);

    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = createSignal(false);

    const getCss = () => Color.RGBA.toCss(Color.HSVA.toRgba(hsvSignal[0]()));

    createEffect(() => {
        const hue = hsvSignal[0]().h;

        if (untrack(hueSignal[0]) === hue) return;

        hueSignal[1](hue);
    });

    createEffect(() => {
        const hue = hueSignal[0]();

        if (untrack(() => hsvSignal[0]().h) === hue) return;

        hsvSignal[1]((prev) => ({ ...prev, h: hue }));
    });

    return (
        <>
            <Button
                ref={setTriggerRef}
                ariaHasPopup={"dialog"}
                ariaExpanded={getIsOpen}
                renderContent={(getFlags) => (
                    <PageColorFieldTrigger flags={getFlags}>
                        <PageColorSwatch value={getCss} />
                        {Color.HSVA.toHexa(hsvSignal[0]())}
                    </PageColorFieldTrigger>
                )}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={() => ({ "aria-label": "Choose a color" })}
                isOpen={getIsOpen}
                anchorRef={getTriggerRef}
                hasAutoFocus={true}
                offset={() => ({ x: 0, y: 5 })}
                onDismiss={(reason) => {
                    setIsOpen(false);

                    if (reason === "escape") getTriggerRef()?.focus();
                }}
                renderContent={() => (
                    <PageColorPickerPopup>
                        <PageColorPreview value={getCss} />

                        <ColorArea
                            hsv={hsvSignal}
                            sizing={"fill"}
                            ariaLabel={"Saturation and brightness"}
                            axisLabels={COLOR_AREA_AXIS_LABELS}
                            renderContent={(getRenderProps) => (
                                <PageColorAreaContent renderProps={getRenderProps} size={AREA_SIZE} />
                            )}
                        />

                        <PageColorPickerRow>
                            <Range
                                value={hueSignal}
                                sizing={"fill"}
                                max={HUE_MAX}
                                step={1}
                                id={"hueSlider"}
                                ariaLabel={"Hue"}
                                thumbSize={HUE_THUMB_SIZE}
                                renderContent={(getRenderProps) => <PageHueSlider renderProps={getRenderProps} />}
                            />
                        </PageColorPickerRow>

                        <PageColorChannels hsv={hsvSignal} />
                    </PageColorPickerPopup>
                )}
            />
        </>
    );
};
