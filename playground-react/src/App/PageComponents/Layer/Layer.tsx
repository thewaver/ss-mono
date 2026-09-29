import type { PropsWithChildren } from "react";

import { PageLayerScope } from "../../StyledComponents/Layer/Layer";
import { LayerContextProvider } from "./Layer.context";
import type { PageLayerProps } from "./Layer.types";

export const PageLayer = (props: PropsWithChildren<PageLayerProps>) => {
    return (
        <LayerContextProvider value={{ level: props.level }}>
            <PageLayerScope>{props.children}</PageLayerScope>
        </LayerContextProvider>
    );
};
