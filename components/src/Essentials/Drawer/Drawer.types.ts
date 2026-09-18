import type { AccessorProps } from "../../Utils/typeUtils";
import type { ModalProps } from "../Modal/Modal.types";

export type DrawerEdge = "left" | "right" | "top" | "bottom";

export type DrawerProps = Omit<ModalProps, "role" | "alignment"> &
    AccessorProps<{
        /** Which edge of the screen the drawer slides in from. */
        edge: DrawerEdge;
    }>;
