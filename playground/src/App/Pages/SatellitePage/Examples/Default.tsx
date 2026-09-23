import { Satellite, access } from "@thewaver/ss-components";

import { PageSatelliteBadge, PageSatelliteSubject } from "../../../StyledComponents/SatelliteContent/SatelliteContent";
import type { SatelliteDefaultExampleProps } from "../SatellitePage.types";

type Props = SatelliteDefaultExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <Satellite
            satellites={() =>
                access(props.hasSatellite)
                    ? [
                          {
                              placement: props.placement,
                              offset: props.offset,
                              isBehindSubject: props.isBehindSubject,
                              renderSatellite: () => (
                                  <PageSatelliteBadge size={props.badgeSize}>
                                      {access(props.badgeSize)}
                                  </PageSatelliteBadge>
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
