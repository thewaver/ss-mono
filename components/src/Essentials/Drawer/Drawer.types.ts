import type { AccessorProps } from "../../Utils/typeUtils";
import type { ModalNameProps, ModalProps } from "../Modal/Modal.types";

export type DrawerEdge = "left" | "right" | "top" | "bottom";

export type DrawerProps = ModalNameProps &
    Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> &
    AccessorProps<{
        /** Which edge of the screen the drawer slides in from. */
        edge: DrawerEdge;
    }>;
