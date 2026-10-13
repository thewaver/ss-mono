import type { ReactNode } from "react";

import { AREA_SIZE } from "@thewaver/ss-playground/App/PageComponents/ColorPicker/ColorPicker.const";
import { Color } from "@thewaver/ss-utils";

import {
    PageColorAreaContent,
    PageColorPickerPopup,
    PageColorPreview,
    PageHueSlider,
} from "../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorChannels } from "../ColorChannels/ColorChannels";

export const pageColorPickerSlots = {
    renderArea: (renderProps: Parameters<typeof PageColorAreaContent>[0]["renderProps"]) => (
        <PageColorAreaContent renderProps={renderProps} size={AREA_SIZE} />
    ),
    renderHue: (renderProps: Parameters<typeof PageHueSlider>[0]["renderProps"]) => (
        <PageHueSlider renderProps={renderProps} />
    ),
    renderPopup: (renderSurface: () => ReactNode, hsvState: readonly [Color.HSVA, (hsv: Color.HSVA) => void]) => (
        <PageColorPickerPopup>
            <PageColorPreview value={Color.RGBA.toCss(Color.HSVA.toRgba(hsvState[0]))} />

            {renderSurface()}

            <PageColorChannels hsv={hsvState} />
        </PageColorPickerPopup>
    ),
};
