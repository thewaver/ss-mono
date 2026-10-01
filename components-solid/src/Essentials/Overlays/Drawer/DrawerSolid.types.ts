import type { DrawerEdge } from "@thewaver/ss-components";

import type { AccessorProps } from "../../../Utils/typeUtils";
import type { ModalNameProps, ModalProps } from "../Modal/ModalSolid.types";

export type DrawerProps = ModalNameProps &
    Omit<ModalProps, "role" | "alignment" | "ariaLabel" | "ariaLabelledBy"> &
    AccessorProps<{
        /** Which edge of the screen the drawer slides in from. */
        edge: DrawerEdge;
    }>;
