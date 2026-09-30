import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/MosaicContent/MosaicContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageMosaicLinkProps, PageMosaicTileProps } from "./MosaicContent.types";

export const PageMosaicTile = (props: PropsWithChildren<PageMosaicTileProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.mosaicTile,
                styles.mosaicTileFamily[
                    styles.PAGE_MOSAIC_FAMILIES[props.state.index % styles.PAGE_MOSAIC_FAMILIES.length]
                ],
                layerClass,
            ].join(" ")}
            style={{ width: `${props.width}px`, height: `${props.height}px` }}
        >
            <div className={styles.mosaicTileName}>{props.children}</div>

            <div className={styles.mosaicTileReading}>
                {`reads ${props.state.readingIndex + 1} of ${props.state.itemCount}`}
            </div>
        </div>
    );
};

export const PageMosaicLink = (props: PropsWithChildren<PageMosaicLinkProps>) => {
    const layerClass = useLayerClass();

    return (
        <a className={[styles.mosaicLink, layerClass].join(" ")} href={props.href}>
            {props.children}

            <span className={styles.mosaicCaption}>{props.caption}</span>
        </a>
    );
};
