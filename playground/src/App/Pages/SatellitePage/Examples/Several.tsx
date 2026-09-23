import { Satellite } from "@thewaver/ss-components";
import type { SatelliteDefs } from "@thewaver/ss-components";

import { PageSatelliteBadge, PageSatelliteSubject } from "../../../StyledComponents/SatelliteContent/SatelliteContent";
import type { SatelliteExampleProps } from "../SatellitePage.types";

const CORNER_SIZE = 28;
const SIDE_SIZE = 36;
const TUCKED_SIZE = 44;
const CORNER_OVERHANG = 10;
const TUCKED_DEPTH = 16;

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
