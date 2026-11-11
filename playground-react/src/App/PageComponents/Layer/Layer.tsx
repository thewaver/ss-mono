import type { PropsWithChildren } from "react";

import { LayerUtils } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.utils";

import { PageLayerScope } from "../../StyledComponents/Layer/Layer";
import { LayerContextProvider, useLayerContext } from "./Layer.context";
import type { PageLayerProps } from "./Layer.types";

export const PageLayer = (props: PropsWithChildren<PageLayerProps>) => {
    const parent = useLayerContext();

    const level = props.level ?? LayerUtils.computeNextLevel(parent?.level);

    return (
        <LayerContextProvider value={{ level }}>
            <PageLayerScope>{props.children}</PageLayerScope>
        </LayerContextProvider>
    );
};
