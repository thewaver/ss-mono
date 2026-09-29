import { ElementMosaic, access } from "@thewaver/ss-components-solid";
import { PICKED_GROWTH } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import { PageMosaicTile } from "../../../../StyledComponents/MosaicContent/MosaicContent";
import type { WalkedExampleProps } from "../ElementMosaicPage.types";

type Props = WalkedExampleProps;

export const WalkedExample = (props: Props) => {
    const getGrowth = (name: string) => (access(props.pickedNames).includes(name) ? PICKED_GROWTH : 1);

    return (
        <ElementMosaic
            items={props.items}
            gap={props.gap}
            sizeAnchor={props.sizeAnchor}
            transitionDurationMs={props.transitionDurationMs}
            ariaLabel={"Tiles"}
            onActivate={props.onActivate}
            renderItem={(getItem, getState) => (
                <PageMosaicTile
                    state={getState}
                    width={() => getItem().width * getGrowth(getItem().name)}
                    height={() => getItem().height * getGrowth(getItem().name)}
                >
                    {getItem().name}
                </PageMosaicTile>
            )}
        />
    );
};
