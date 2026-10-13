import type { BaseDrawerProps } from "@thewaver/ss-components";

import type { ModalProps, ModalSlots } from "../Modal/Modal.types";

export type DrawerProps = Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> & BaseDrawerProps;

export type DrawerSlots = ModalSlots;
