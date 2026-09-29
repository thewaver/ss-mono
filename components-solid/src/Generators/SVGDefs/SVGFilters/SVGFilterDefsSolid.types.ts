import type {
    SVGBaseLightingFilterDefs,
    SVGDiffuseLightingFilterDefs,
    SVGDistantLightDefs,
    SVGLightSurfaceDefs,
    SVGPointLightDefs,
    SVGSpecularLightingFilterDefs,
} from "@thewaver/ss-components";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type SVGPointLightSolidDefs = Pick<SVGPointLightDefs, "kind"> & AccessorProps<Omit<SVGPointLightDefs, "kind">>;

export type SVGDistantLightSolidDefs = Pick<SVGDistantLightDefs, "kind"> &
    AccessorProps<Omit<SVGDistantLightDefs, "kind">>;

export type SVGLightSourceSolidDefs = SVGPointLightSolidDefs | SVGDistantLightSolidDefs;

export type SVGLightSurfaceSolidDefs = AccessorProps<SVGLightSurfaceDefs>;

type SVGBaseLightingFilterSolidDefs = {
    light: SVGLightSourceSolidDefs;
    surface: SVGLightSurfaceSolidDefs;
} & AccessorProps<Omit<SVGBaseLightingFilterDefs, "light" | "surface">>;

export type SVGSpecularLightingFilterSolidDefs = SVGBaseLightingFilterSolidDefs &
    AccessorProps<Omit<SVGSpecularLightingFilterDefs, keyof SVGBaseLightingFilterDefs>>;

export type SVGDiffuseLightingFilterSolidDefs = SVGBaseLightingFilterSolidDefs &
    AccessorProps<Omit<SVGDiffuseLightingFilterDefs, keyof SVGBaseLightingFilterDefs>>;
