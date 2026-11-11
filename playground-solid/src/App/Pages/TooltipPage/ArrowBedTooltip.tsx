import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedPoints } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { ShapeUtils } from "@thewaver/ss-utils";

import { PageTooltipSurface } from "../../StyledComponents/TooltipContent/TooltipSurface";
import type { ArrowBedTooltipProps } from "./TooltipPageSolid.types";

const SHARP_RADII = [0];

const ROUNDED_RADII = [BORDER_RADIUS_FULL];

type Props = ArrowBedTooltipProps;

export const ArrowBedTooltip = (props: Props) => (
    <PageTooltipSurface
        hasArrow={true}
        computeGeometry={(size, bodyStyle) =>
            ShapeUtils.attachArrow(
                {
                    points: computeArrowBedPoints(access(props.shape), size),
                    joinRadii: access(props.shape) === "rounded_box" ? ROUNDED_RADII : SHARP_RADII,
                    lameExponents: bodyStyle?.lameExponents,
                    strokeThicknesses: bodyStyle?.strokeThicknesses,
                },
                props.computeAim(size),
                TOOLTIP_ARROW_TEMPLATES[access(props.arrow)](access(props.arrowWidth), access(props.arrowLength)),
            )
        }
    >
        <div class={styles.arrowBedLabel}>{access(props.label)}</div>
    </PageTooltipSurface>
);
