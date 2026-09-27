import { ColorArea, access } from "@thewaver/ss-components-solid";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";

import { PageColorAreaContent } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import type { ColorAreaExampleProps } from "../ColorAreaPage.types";

const AREA_SIZE = 160;

type Props = ColorAreaExampleProps;

export const SurfaceExample = (props: Props) => {
    return (
        <ColorArea
            hsvSignal={props.hsvSignal}
            sizing={"fill"}
            isDisabled={() => access(props.isDisabled) ?? false}
            ariaLabel={"Saturation and brightness"}
            axisLabels={COLOR_AREA_AXIS_LABELS}
            renderContent={(getRenderProps) => (
                <PageColorAreaContent renderProps={getRenderProps} size={() => AREA_SIZE} />
            )}
        />
    );
};
