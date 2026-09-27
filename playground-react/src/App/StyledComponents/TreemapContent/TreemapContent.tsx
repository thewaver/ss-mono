import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TreemapContent/TreemapContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTreemapBarProps, PageTreemapTileProps } from "./TreemapContent.types";

const WORD_START = /(?=[A-Z][^A-Z])/g;

export const PageTreemapTile = (props: PageTreemapTileProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.treemapTile, layerClass, props.isBranch && styles.treemapTileBranch]
                .filter(Boolean)
                .join(" ")}
        >
            {props.name.split(WORD_START).map((word, index) => (
                <span key={index}>{word}</span>
            ))}

            <span className={styles.treemapTileWeight}>{props.weight}</span>
        </div>
    );
};

export const PageTreemapBar = (props: PageTreemapBarProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.treemapBar,
                layerClass,
                props.flags.isHovered && styles.treemapBarHovered,
                props.flags.isDisabled && styles.treemapBarAtRoot,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.treemapBarPath}>{props.path}</span>

            <span className={styles.treemapTileWeight}>{props.weight}</span>
        </div>
    );
};
