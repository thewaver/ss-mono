import type { ModalNameProps } from "../Modal/Modal.types";

export type DrawerEdge = "left" | "right" | "top" | "bottom";

export type BaseDrawerValues = ModalNameProps & {
    /**
     * Which edge of the screen the drawer slides in from. `"left"` and `"right"` are the screen's own sides, whichever
     * way the text around the drawer runs.
     */
    edge: DrawerEdge;
};

export type BaseDrawerProps = BaseDrawerValues;
