import { Satellite } from "@thewaver/ss-components-react";
import type { SatelliteDefs } from "@thewaver/ss-components-react";

import { PageSatelliteBadge, PageSatelliteSubject } from "../../../StyledComponents/SatelliteContent/SatelliteContent";
import type { SatelliteExampleProps } from "../SatellitePage.types";

const CORNER_SIZE = 48;
const SIDE_SIZE = 72;
const TUCKED_SIZE = 88;
const CORNER_OVERHANG = 20;
const TUCKED_DEPTH = 32;

const SATELLITES: SatelliteDefs[] = [
    {
        placement: { x: "right-in", y: "top-in" },
        offset: { x: CORNER_OVERHANG, y: -CORNER_OVERHANG },
        renderSatellite: () => <PageSatelliteBadge size={CORNER_SIZE}>3</PageSatelliteBadge>,
    },
    {
        placement: { x: "left-out", y: "center" },
        renderSatellite: () => (
            <PageSatelliteBadge size={SIDE_SIZE} isMuted={true}>
                A
            </PageSatelliteBadge>
        ),
    },
    {
        placement: { x: "center", y: "bottom-out" },
        offset: { x: 0, y: -TUCKED_DEPTH },
        isBehindSubject: true,
        renderSatellite: () => <PageSatelliteBadge size={TUCKED_SIZE} isMuted={true} />,
    },
];

type Props = SatelliteExampleProps;

export const SeveralExample = (props: Props) => {
    return (
        <Satellite satellites={SATELLITES}>
            <PageSatelliteSubject width={props.subjectWidth} height={props.subjectHeight}>
                Subject
            </PageSatelliteSubject>
        </Satellite>
    );
};
