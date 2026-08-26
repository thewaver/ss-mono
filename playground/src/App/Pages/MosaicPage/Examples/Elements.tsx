import { ElementMosaic } from "@thewaver/ss-components";

import { PageMosaicTile } from "../../../StyledComponents/MosaicContent/MosaicContent";
import type { ElementsExampleProps } from "../MosaicPage.types";

type Props = ElementsExampleProps;

export const ElementsExample = (props: Props) => {
    return (
        <ElementMosaic
            items={props.items}
            gap={props.gap}
            sizeAnchor={props.sizeAnchor}
            renderItem={(getItem, getState) => (
                <PageMosaicTile state={getState} width={() => getItem().width} height={() => getItem().height}>
                    {getItem().name}
                </PageMosaicTile>
            )}
        />
    );
};
