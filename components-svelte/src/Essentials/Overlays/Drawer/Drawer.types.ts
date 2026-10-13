import type { BaseDrawerProps } from "@thewaver/ss-components";

import type { ModalProps } from "../Modal/Modal.types.js";

export type DrawerProps = Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> & BaseDrawerProps;
