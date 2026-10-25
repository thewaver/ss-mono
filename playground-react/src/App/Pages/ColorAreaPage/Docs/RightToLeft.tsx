import { useState } from "react";

import { ColorArea } from "@thewaver/ss-components-react";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import type { Color } from "@thewaver/ss-utils";

import { PageColorAreaContent } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";

const AREA_SIZE = 160;

export const RightToLeftDocsExample = () => {
    const hsvState = useState<Color.HSVA>(STARTING_HSV);
    const [hsv] = hsvState;

    return (
        <>
            <div dir={"rtl"} style={{ width: "100%" }}>
                <ColorArea
                    hsv={hsvState}
                    sizing={"fill"}
                    ariaLabel={"Saturation and brightness in a right-to-left box"}
                    axisLabels={COLOR_AREA_AXIS_LABELS}
                    renderContent={(renderProps) => <PageColorAreaContent renderProps={renderProps} size={AREA_SIZE} />}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
            </div>
        </>
    );
};
