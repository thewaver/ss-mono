import { Satellite } from "@thewaver/ss-components-react";

import { PageSatelliteBadge, PageSatelliteSubject } from "../../../StyledComponents/SatelliteContent/SatelliteContent";
import type { SatelliteDefaultExampleProps } from "../SatellitePage.types";

type Props = SatelliteDefaultExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Satellite
            satellites={
                props.hasSatellite
                    ? [
                          {
                              placement: props.placement,
                              offset: props.offset,
                              isBehindSubject: props.isBehindSubject,
                              renderSatellite: () => (
                                  <PageSatelliteBadge size={props.badgeSize}>{props.badgeSize}</PageSatelliteBadge>
                              ),
                          },
                      ]
                    : []
            }
        >
            <PageSatelliteSubject width={props.subjectWidth} height={props.subjectHeight}>
                Subject
            </PageSatelliteSubject>
        </Satellite>
    );
};
