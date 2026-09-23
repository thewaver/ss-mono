import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { SatelliteDefs } from "./Satellite.types";

export const SATELLITE_DEFAULTS = {
    satellites: [] as SatelliteDefs[],
    placement: { x: "center", y: "center" } as AnchorPlacement,
    offset: { x: 0, y: 0 },
    isBehindSubject: false,
};
