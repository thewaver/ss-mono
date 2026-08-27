import type { JSX } from "solid-js";

import type { AccessorProps } from "../../Utils/typeUtils";

export type RevealProps = AccessorProps<{
    radius?: number;
    roundness?: number;
    softness?: number;
    isDisabled?: boolean;
    renderContent: () => JSX.Element;
    renderCover: (getIsRevealing: () => boolean) => JSX.Element;
}>;
