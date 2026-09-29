import { ElementMosaic } from "@thewaver/ss-components-react";

import { PageMosaicTile } from "../../../../StyledComponents/MosaicContent/MosaicContent";
import type { ElementsExampleProps } from "../ElementMosaicPage.types";

type Props = ElementsExampleProps;

export const ElementsExample = (props: Props) => {
    return (
        <ElementMosaic
            items={props.items}
            gap={props.gap}
            sizeAnchor={props.sizeAnchor}
            transitionDurationMs={props.transitionDurationMs}
            renderItem={(item, state) => (
                <PageMosaicTile state={state} width={item.width} height={item.height}>
                    {item.name}
                </PageMosaicTile>
            )}
        />
    );
};
