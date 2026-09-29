import type { DrawerEdge } from "@thewaver/ss-components";
import type { ModalNameProps, ModalProps } from "../Modal/Modal.types.js";
export type DrawerProps = ModalNameProps & Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> & {
    /** Which edge of the screen the drawer slides in from. */
    edge: DrawerEdge;
};
