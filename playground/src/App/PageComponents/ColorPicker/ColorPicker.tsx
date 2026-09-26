import type { JSX, Signal } from "solid-js";

import { Color } from "@thewaver/ss-utils";

import {
    PageColorAreaContent,
    PageColorPickerPopup,
    PageColorPreview,
    PageHueSlider,
} from "../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorChannels } from "../ColorChannels/ColorChannels";

const AREA_SIZE = 160;

export const pageColorPickerSlots = {
    renderArea: (getRenderProps: Parameters<typeof PageColorAreaContent>[0]["renderProps"]) => (
        <PageColorAreaContent renderProps={getRenderProps} size={() => AREA_SIZE} />
    ),
    renderHue: (getRenderProps: Parameters<typeof PageHueSlider>[0]["renderProps"]) => (
        <PageHueSlider renderProps={getRenderProps} />
    ),
    renderPopup: (renderSurface: () => JSX.Element, hsvSignal: Signal<Color.HSVA>) => (
        <PageColorPickerPopup>
            <PageColorPreview value={() => Color.RGBA.toCss(Color.HSVA.toRgba(hsvSignal[0]()))} />

            {renderSurface()}

            <PageColorChannels hsvSignal={hsvSignal} />
        </PageColorPickerPopup>
    ),
};
