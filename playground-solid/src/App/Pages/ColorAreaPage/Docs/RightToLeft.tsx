import { createSignal } from "solid-js";

import { ColorArea } from "@thewaver/ss-components-solid";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import { PageColorAreaContent } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";

const AREA_SIZE = 160;

export const RightToLeftDocsExample = () => {
    const hsvSignal = createSignal<Color.HSVA>(STARTING_HSV);

    return (
        <>
            <div dir={"rtl"} style={{ width: "100%" }}>
                <ColorArea
                    hsv={hsvSignal}
                    sizing={"fill"}
                    ariaLabel={"Saturation and brightness in a right-to-left box"}
                    axisLabels={COLOR_AREA_AXIS_LABELS}
                    renderContent={(getRenderProps) => (
                        <PageColorAreaContent renderProps={getRenderProps} size={AREA_SIZE} />
                    )}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Saturation ${Math.round(hsvSignal[0]().s)}%, brightness ${Math.round(hsvSignal[0]().v)}%`}
            </div>
        </>
    );
};
