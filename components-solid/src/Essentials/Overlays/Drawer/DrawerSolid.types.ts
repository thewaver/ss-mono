import type { BaseDrawerValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";
import type { ModalProps } from "../Modal/ModalSolid.types";

export type DrawerProps = Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> &
    AccessorValues<BaseDrawerValues>;
