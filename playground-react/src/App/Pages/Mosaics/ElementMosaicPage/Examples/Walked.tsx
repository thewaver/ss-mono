import { ElementMosaic } from "@thewaver/ss-components-react";
import { PICKED_GROWTH } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import { PageMosaicTile } from "../../../../StyledComponents/MosaicContent/MosaicContent";
import type { WalkedExampleProps } from "../ElementMosaicPage.types";

type Props = WalkedExampleProps;

export const WalkedExample = (props: Props) => {
    const getGrowth = (name: string) => (props.pickedNames.includes(name) ? PICKED_GROWTH : 1);

    return (
        <ElementMosaic
            items={props.items}
            gap={props.gap}
            sizeAnchor={props.sizeAnchor}
            transitionDurationMs={props.transitionDurationMs}
            ariaLabel={"Tiles"}
            onActivate={props.onActivate}
            renderItem={(item, state) => (
                <PageMosaicTile
                    state={state}
                    width={item.width * getGrowth(item.name)}
                    height={item.height * getGrowth(item.name)}
                >
                    {item.name}
                </PageMosaicTile>
            )}
        />
    );
};
