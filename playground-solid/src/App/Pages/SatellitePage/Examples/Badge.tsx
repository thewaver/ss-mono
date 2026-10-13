import { createMemo } from "solid-js";

import { Satellite, access } from "@thewaver/ss-components-solid";
import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components-solid";
import type { Point2d } from "@thewaver/ss-utils";

import { PageSatellitePill, PageSatelliteSubject } from "../../../StyledComponents/SatelliteContent/SatelliteContent";
import type { SatelliteBadgeCorner, SatelliteBadgeExampleProps } from "../SatellitePageSolid.types";

const PLACEMENTS: Record<SatelliteBadgeCorner, AnchorPlacement> = {
    top_left: { x: "left_in", y: "top_in" },
    top_right: { x: "right_in", y: "top_in" },
    bottom_left: { x: "left_in", y: "bottom_in" },
    bottom_right: { x: "right_in", y: "bottom_in" },
};

const OUTWARD: Record<SatelliteBadgeCorner, Point2d> = {
    top_left: { x: -1, y: -1 },
    top_right: { x: 1, y: -1 },
    bottom_left: { x: -1, y: 1 },
    bottom_right: { x: 1, y: 1 },
};

type Props = SatelliteBadgeExampleProps;

export const BadgeExample = (props: Props) => {
    const getOffset = createMemo(() => ({
        x: OUTWARD[access(props.corner)].x * access(props.overhang),
        y: OUTWARD[access(props.corner)].y * access(props.overhang),
    }));

    const satellites: SatelliteDefs[] = [
        {
            placement: () => PLACEMENTS[access(props.corner)],
            offset: getOffset,
            renderSatellite: () => <PageSatellitePill>{access(props.count)}</PageSatellitePill>,
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
