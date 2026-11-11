import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { LayerUtils } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.utils";

import { PageLayerScope } from "../../StyledComponents/Layer/Layer";
import { LayerContextProvider, useLayerContext } from "./Layer.context";
import type { PageLayerProps } from "./Layer.types";

export const PageLayer = (props: ParentProps<PageLayerProps>) => {
    const parent = useLayerContext();

    const getLevel = () => access(props.level) ?? LayerUtils.computeNextLevel(parent?.level());

    return (
        <LayerContextProvider value={{ level: getLevel }}>
            <PageLayerScope>{props.children}</PageLayerScope>
        </LayerContextProvider>
    );
};
