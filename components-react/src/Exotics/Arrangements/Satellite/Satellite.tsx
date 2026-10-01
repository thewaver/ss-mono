import { useRef, useState } from "react";

import { SATELLITE_DEFAULTS, SatelliteStyles, SatelliteUtils } from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import type { SatelliteDefs, SatelliteProps } from "./Satellite.types";

const BEHIND_Z_INDEX = 0;
const SUBJECT_Z_INDEX = 1;
const FRONT_Z_INDEX = 2;
const NOTHING = 0;
const UNMEASURED = { width: 0, height: 0 };
const UNPLACED = { x: 0, y: 0 };
const NO_SATELLITES: SatelliteDefs[] = [];

export const Satellite = (props: SatelliteProps) => {
    const subjectRef = useRef<HTMLDivElement>(null);

    const [satelliteRefs, setSatelliteRefs] = useState<Array<HTMLElement | undefined>>([]);

    const satellites = props.satellites ?? NO_SATELLITES;
    const hasSatellites = satellites.length > NOTHING;

    const subjectSize = ElementObserverReactUtils.useBorderBoxSize(subjectRef, !hasSatellites);

    const satelliteSizes = ElementObserverReactUtils.useBorderBoxSizes(
        satellites.map((_unused, index) => satelliteRefs[index]),
        !hasSatellites,
    );

    const refSettersRef = useRef(new Map<number, (element: HTMLElement | null) => void>());

    const getRefSetter = (index: number) => {
        const known = refSettersRef.current.get(index);

        if (known) return known;

        const setter = (element: HTMLElement | null) =>
            setSatelliteRefs((previous) => {
                if (previous[index] === (element ?? undefined)) return previous;

                const next = [...previous];

                next[index] = element ?? undefined;

                return next;
            });

        refSettersRef.current.set(index, setter);

        return setter;
    };

    if (!hasSatellites) return <>{props.children}</>;

    const layout = SatelliteUtils.computeLayout(
        subjectSize,
        satellites.map((satellite, index) => ({
            size: satelliteSizes[index] ?? UNMEASURED,
            placement: satellite.placement ?? SATELLITE_DEFAULTS.placement,
            offset: satellite.offset ?? SATELLITE_DEFAULTS.offset,
        })),
    );

    return (
        <div className={SatelliteStyles.satelliteRoot} style={layout.padding}>
            <div ref={subjectRef} className={SatelliteStyles.satelliteSubject} style={{ zIndex: SUBJECT_Z_INDEX }}>
                {props.children}
            </div>

            {satellites.map((satellite, index) => {
                const offset = layout.satelliteOffsets[index] ?? UNPLACED;

                return (
                    <div
                        key={index}
                        ref={getRefSetter(index)}
                        className={SatelliteStyles.satelliteBody}
                        style={{
                            left: `${offset.x}px`,
                            top: `${offset.y}px`,
                            zIndex:
                                (satellite.isBehindSubject ?? SATELLITE_DEFAULTS.isBehindSubject)
                                    ? BEHIND_Z_INDEX
                                    : FRONT_Z_INDEX,
                        }}
                    >
                        {satellite.renderSatellite()}
                    </div>
                );
            })}
        </div>
    );
};
