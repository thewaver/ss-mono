import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type BarrelAxis = "row" | "column";

export type BarrelFace = "front" | "back";

export type BarrelFaceDefs = {
    ariaLabel: string;
    isHidden: boolean;
};

export type BarrelProps<T> = AccessorProps<{
    angle: number;
    axis?: BarrelAxis;
    faceSize?: Size2d;
    hasBacks?: boolean;
    transitionDurationMs?: number;
    faceRoleDescription: string;
    computeFaceDefs: (index: number, face: BarrelFace) => BarrelFaceDefs;
}> & {
    faces: MaybeAccessor<T[]>;
    renderFace: (getFace: Accessor<T>, index: number, face: BarrelFace) => JSX.Element;
};
