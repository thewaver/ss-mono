import { ColorArea } from "@thewaver/ss-components-react";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { PageColorAreaContent } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import type { ColorAreaExampleProps } from "../ColorAreaPage.types";

const AREA_SIZE = 160;

type Props = ColorAreaExampleProps;

export const SurfaceExample = (props: Props) => {
    return (
        <ColorArea
            hsvState={props.hsvState}
            sizing={"fill"}
            isDisabled={props.isDisabled ?? false}
            ariaLabel={"Saturation and brightness"}
            axisLabels={COLOR_AREA_AXIS_LABELS}
            renderContent={(renderProps) => <PageColorAreaContent renderProps={renderProps} size={AREA_SIZE} />}
        />
    );
};
