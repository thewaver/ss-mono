import type { CSSProperties } from "react";

import type { SortableGridGeometry } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SortableGridContent/SortableGridContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    SortableGridCellProps,
    SortableGridItemContentProps,
    SortableGridLandingProps,
    SortableGridSurfaceProps,
} from "./SortableGridContent.types";

const NAMED_WIDTH = 2;

const getBox = (geometry: SortableGridGeometry) => ({
    width: Math.max(...geometry.outline.map((point) => point.x)),
    height: Math.max(...geometry.outline.map((point) => point.y)),
});

const getPoints = (geometry: SortableGridGeometry) =>
    geometry.outline.map((point) => `${point.x},${point.y}`).join(" ");

const getViewBox = (geometry: SortableGridGeometry) => {
    const box = getBox(geometry);

    return `0 0 ${box.width} ${box.height}`;
};

export const PageSortableGridItemContent = (props: SortableGridItemContentProps) => {
    const layerClass = useLayerClass();

    const geometry = props.geometry;

    const glyphRect = geometry.block;

    const isNamed = glyphRect.width >= geometry.cells[0].width * NAMED_WIDTH;

    return (
        <div
            className={[
                styles.sortableGridItemContent,
                layerClass,
                props.flags.isCarried && styles.isCarried,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {(props.paint ?? "outline") === "outline" ? (
                <svg className={styles.sortableGridItemShape} viewBox={getViewBox(geometry)} aria-hidden="true">
                    <polygon className={styles.sortableGridItemOutline} points={getPoints(geometry)} />
                </svg>
            ) : (
                geometry.cells.map((cell, index) => (
                    <div
                        key={index}
                        className={styles.sortableGridItemTile}
                        style={{
                            ...(assignInlineVars({ [styles.tileHue]: `${props.hue ?? 0}` }) as CSSProperties),
                            left: `${cell.left}px`,
                            top: `${cell.top}px`,
                            width: `${cell.width}px`,
                            height: `${cell.height}px`,
                        }}
                        aria-hidden="true"
                    />
                ))
            )}

            <div
                className={styles.sortableGridItemGlyph}
                style={{
                    left: `${glyphRect.left}px`,
                    top: `${glyphRect.top}px`,
                    width: `${glyphRect.width}px`,
                    height: `${glyphRect.height}px`,
                }}
                aria-hidden="true"
            >
                <div>{props.glyph}</div>

                {isNamed && <div className={styles.sortableGridItemName}>{props.name}</div>}
            </div>
        </div>
    );
};

export const PageSortableGridCell = (props: SortableGridCellProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.sortableGridCell,
                layerClass,
                (props.spot.col + props.spot.row) % 2 === 1 && styles.isOdd,
                (props.isBlocked ?? false) && styles.isBlocked,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    );
};

export const PageSortableGridLanding = (props: SortableGridLandingProps) => {
    const layerClass = useLayerClass();

    return (
        <svg
            className={[styles.sortableGridLanding, layerClass, props.isAllowed && styles.isAllowed]
                .filter(Boolean)
                .join(" ")}
            viewBox={getViewBox(props.geometry)}
            aria-hidden="true"
        >
            <polygon className={styles.sortableGridLandingOutline} points={getPoints(props.geometry)} />
        </svg>
    );
};

export const PageSortableGridSurface = (props: SortableGridSurfaceProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.sortableGridSurface,
                layerClass,
                props.flags.isReceiving && styles.isReceiving,
                props.flags.isCarrying && styles.isCarrying,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.flags.isEmpty && <div className={styles.sortableGridEmpty}>{props.emptyText}</div>}
        </div>
    );
};
