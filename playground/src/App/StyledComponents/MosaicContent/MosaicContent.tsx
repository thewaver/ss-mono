import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageMosaicLinkProps, PageMosaicTileProps } from "./MosaicContent.types";

import * as styles from "./MosaicContent.css";

export const PageMosaicTile = (props: ParentProps<PageMosaicTileProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.mosaicTile, getLayerClass()].join(" ")}
            style={{ width: `${access(props.width)}px`, height: `${access(props.height)}px` }}
        >
            <div class={styles.mosaicTileName}>{props.children}</div>

            <div class={styles.mosaicTileReading}>
                {`reads ${access(props.state).readingIndex + 1} of ${access(props.state).itemCount}`}
            </div>
        </div>
    );
};

export const PageMosaicLink = (props: ParentProps<PageMosaicLinkProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <a class={[styles.mosaicLink, getLayerClass()].join(" ")} href={access(props.href)}>
            {props.children}

            <span class={styles.mosaicCaption}>{access(props.caption)}</span>
        </a>
    );
};
