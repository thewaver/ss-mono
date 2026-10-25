import { useState } from "react";

import { ColorArea } from "@thewaver/ss-components-react";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import { PageColorAreaContent } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import type { ColorAreaBasicDocsExampleProps } from "../ColorAreaPageReact.types";

const AREA_SIZE = 160;

type Props = ColorAreaBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const hsvState = useState<Color.HSVA>(STARTING_HSV);
    const [hsv] = hsvState;

    return (
        <>
            <ColorArea
                hsv={hsvState}
                sizing={"fill"}
                isDisabled={props.isDisabled}
                ariaLabel={"Saturation and brightness"}
                axisLabels={COLOR_AREA_AXIS_LABELS}
                renderContent={(renderProps) => <PageColorAreaContent renderProps={renderProps} size={AREA_SIZE} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Hue ${Math.round(hsv.h)}°, saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%, or ${Color.HSV.toHex(hsv)}`}
            </div>
        </>
    );
};
