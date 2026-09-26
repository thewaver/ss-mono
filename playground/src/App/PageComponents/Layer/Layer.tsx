import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { PageLayerScope } from "../../StyledComponents/Layer/Layer";
import { LayerContextProvider } from "./Layer.context";
import type { PageLayerProps } from "./Layer.types";

export const PageLayer = (props: ParentProps<PageLayerProps>) => {
    return (
        <LayerContextProvider value={{ level: () => access(props.level) }}>
            <PageLayerScope>{props.children}</PageLayerScope>
        </LayerContextProvider>
    );
};
