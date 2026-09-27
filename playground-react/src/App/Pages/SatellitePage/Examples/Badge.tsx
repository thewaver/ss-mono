import { Satellite } from "@thewaver/ss-components-react";
import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components-react";
import type { Point2d } from "@thewaver/ss-utils";

import { PageSatellitePill, PageSatelliteSubject } from "../../../StyledComponents/SatelliteContent/SatelliteContent";
import type { SatelliteBadgeCorner, SatelliteBadgeExampleProps } from "../SatellitePage.types";

const PLACEMENTS: Record<SatelliteBadgeCorner, AnchorPlacement> = {
    "top-left": { x: "left-in", y: "top-in" },
    "top-right": { x: "right-in", y: "top-in" },
    "bottom-left": { x: "left-in", y: "bottom-in" },
    "bottom-right": { x: "right-in", y: "bottom-in" },
};

const OUTWARD: Record<SatelliteBadgeCorner, Point2d> = {
    "top-left": { x: -1, y: -1 },
    "top-right": { x: 1, y: -1 },
    "bottom-left": { x: -1, y: 1 },
    "bottom-right": { x: 1, y: 1 },
};

type Props = SatelliteBadgeExampleProps;

export const BadgeExample = (props: Props) => {
    const offset = {
        x: OUTWARD[props.corner].x * props.overhang,
        y: OUTWARD[props.corner].y * props.overhang,
    };

    const satellites: SatelliteDefs[] = [
        {
            placement: PLACEMENTS[props.corner],
            offset,
            renderSatellite: () => <PageSatellitePill>{props.count}</PageSatellitePill>,
        },
    ];

    return (
        <Satellite satellites={satellites}>
            <PageSatelliteSubject width={props.subjectWidth} height={props.subjectHeight}>
                Inbox
            </PageSatelliteSubject>
        </Satellite>
    );
};
