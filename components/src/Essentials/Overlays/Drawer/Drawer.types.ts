import type { ModalNameProps } from "../Modal/Modal.types";

export type DrawerEdge = "left" | "right" | "top" | "bottom";

export type BaseDrawerValues = ModalNameProps & {
    /** Which edge of the screen the drawer slides in from. */
    edge: DrawerEdge;
};

export type BaseDrawerProps = BaseDrawerValues;
