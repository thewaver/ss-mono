import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseSatelliteBadgeExampleValues,
    BaseSatelliteDefaultExampleValues,
    BaseSatelliteExampleValues,
} from "@thewaver/ss-playground/App/Pages/SatellitePage/SatellitePage.types";

export type { SatelliteBadgeCorner } from "@thewaver/ss-playground/App/Pages/SatellitePage/SatelliteBadgeCorner.types";

export type SatelliteExampleProps = AccessorValues<BaseSatelliteExampleValues>;

export type SatelliteDefaultExampleProps = SatelliteExampleProps & AccessorValues<BaseSatelliteDefaultExampleValues>;

export type SatelliteBadgeExampleProps = SatelliteExampleProps & AccessorValues<BaseSatelliteBadgeExampleValues>;
