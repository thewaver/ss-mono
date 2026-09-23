import { createMemo } from "solid-js";

import { Satellite, access } from "@thewaver/ss-components";
import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components";
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
