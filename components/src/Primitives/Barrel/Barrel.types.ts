export type BarrelAxis = "row" | "column";

export type BarrelFace = "front" | "back";

export type BarrelFaceDefs = {
    /** Names this face for assistive technology. */
    ariaLabel: string;
    /** Whether this face is kept out of the accessibility tree, which the faces turned away from the viewer are. */
    isHidden: boolean;
};
