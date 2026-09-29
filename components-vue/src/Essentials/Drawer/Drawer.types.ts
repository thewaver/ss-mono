import type { DrawerEdge } from "@thewaver/ss-components";

import type { ModalNameProps, ModalProps, ModalSlots } from "../Modal/Modal.types";

export type DrawerProps = ModalNameProps &
    Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> & {
        /** Which edge of the screen the drawer slides in from. */
        edge: DrawerEdge;
    };

export type DrawerSlots = ModalSlots;
