import type { BaseDrawerProps } from "@thewaver/ss-components";

import type { ModalProps } from "../Modal/Modal.types";

export type DrawerProps = Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> & BaseDrawerProps;
