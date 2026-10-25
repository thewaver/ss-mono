import { useEffect, useId, useState } from "react";

import { Button, ColorArea, Popover, Range } from "@thewaver/ss-components-react";
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
    const popupId = useId();

    const hsvState = useState<Color.HSVA>(STARTING_PICKER_HSV);
    const hueState = useState(STARTING_PICKER_HSV.h);

    const [hsv, setHsv] = hsvState;
    const [hue, setHue] = hueState;

    const [triggerRef, setTriggerRef] = useState<HTMLElement>();
    const [isOpen, setIsOpen] = useState(false);

    const css = Color.RGBA.toCss(Color.HSVA.toRgba(hsv));

    useEffect(() => {
        if (hue === hsv.h) return;

        setHue(hsv.h);
    }, [hsv.h]);

    useEffect(() => {
        if (hsv.h === hue) return;

        setHsv((prev) => ({ ...prev, h: hue }));
    }, [hue]);

    return (
        <>
            <Button
                ref={(element) => setTriggerRef(element ?? undefined)}
                ariaHasPopup={"dialog"}
                ariaExpanded={isOpen}
                renderContent={(flags) => (
                    <PageColorFieldTrigger flags={flags}>
                        <PageColorSwatch value={css} />
                        {Color.HSVA.toHexa(hsv)}
                    </PageColorFieldTrigger>
                )}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": "Choose a color" }}
                isOpen={isOpen}
                anchorRef={triggerRef}
                hasAutoFocus={true}
                offset={{ x: 0, y: 5 }}
                onDismiss={(reason) => {
                    setIsOpen(false);

                    if (reason === "escape") triggerRef?.focus();
                }}
                renderContent={() => (
                    <PageColorPickerPopup>
                        <PageColorPreview value={css} />

                        <ColorArea
                            hsv={hsvState}
                            sizing={"fill"}
                            ariaLabel={"Saturation and brightness"}
                            axisLabels={COLOR_AREA_AXIS_LABELS}
                            renderContent={(renderProps) => (
                                <PageColorAreaContent renderProps={renderProps} size={AREA_SIZE} />
                            )}
                        />

                        <PageColorPickerRow>
                            <Range
                                value={hueState}
                                sizing={"fill"}
                                max={HUE_MAX}
                                step={1}
                                id={"hueSlider"}
                                ariaLabel={"Hue"}
                                thumbSize={HUE_THUMB_SIZE}
                                renderContent={(renderProps) => <PageHueSlider renderProps={renderProps} />}
                            />
                        </PageColorPickerRow>

                        <PageColorChannels hsv={hsvState} />
                    </PageColorPickerPopup>
                )}
            />
        </>
    );
};
