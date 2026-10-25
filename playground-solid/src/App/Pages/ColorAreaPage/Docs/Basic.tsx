import { createSignal } from "solid-js";

import { ColorArea } from "@thewaver/ss-components-solid";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import { PageColorAreaContent } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import type { ColorAreaBasicDocsExampleProps } from "../ColorAreaPageSolid.types";

const AREA_SIZE = 160;

type Props = ColorAreaBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const hsvSignal = createSignal<Color.HSVA>(STARTING_HSV);

    return (
        <>
            <ColorArea
                hsv={hsvSignal}
                sizing={"fill"}
                isDisabled={props.isDisabled}
                ariaLabel={"Saturation and brightness"}
                axisLabels={COLOR_AREA_AXIS_LABELS}
                renderContent={(getRenderProps) => (
                    <PageColorAreaContent renderProps={getRenderProps} size={AREA_SIZE} />
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Hue ${Math.round(hsvSignal[0]().h)}°, saturation ${Math.round(hsvSignal[0]().s)}%, brightness ${Math.round(hsvSignal[0]().v)}%, or ${Color.HSV.toHex(hsvSignal[0]())}`}
            </div>
        </>
    );
};
