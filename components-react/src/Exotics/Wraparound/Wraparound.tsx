import { useEffect, useRef, useState } from "react";

import { WRAPAROUND_DEFAULTS, WraparoundStyles, type WraparoundTile, WraparoundUtils } from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { useElement, useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { WraparoundProps } from "./Wraparound.types";

const KEY_SEPARATOR = ",";

const toKey = (tile: WraparoundTile) => `${tile.column}${KEY_SEPARATOR}${tile.row}`;

const fromKey = (key: string): WraparoundTile => {
    const [column, row] = key.split(KEY_SEPARATOR).map(Number);

    return { column, row };
};

export const Wraparound = (props: WraparoundProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const originalRef = useRef<HTMLDivElement | null>(null);

    const viewportSize = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const tileSize = ElementObserverReactUtils.useBorderBoxSize(originalRef);

    const isDisabled = props.isDisabled ?? false;
    const maxCopies = props.maxCopies ?? WRAPAROUND_DEFAULTS.maxCopies;

    const latest = useLatest({ props, isDisabled, viewportSize, tileSize });

    const [plane] = useState(() =>
        WraparoundUtils.createPlane({
            getTileSize: () => latest.current.tileSize,
            getViewportSize: () => latest.current.viewportSize,
            getOriginal: () => originalRef.current ?? undefined,
            getIsDisabled: () => latest.current.isDisabled,
            getMomentumMs: () => latest.current.props.momentumMs ?? WRAPAROUND_DEFAULTS.momentumMs,
            getGlideDurationMs: () => latest.current.props.glideDurationMs ?? WRAPAROUND_DEFAULTS.glideDurationMs,
            getKeyStepPx: () => latest.current.props.keyStepPx ?? WRAPAROUND_DEFAULTS.keyStepPx,
        }),
    );

    useEffect(() => plane.destroy, [plane]);

    const root = useElement(rootRef);

    useEffect(() => (root ? plane.observe(root) : undefined), [plane, root]);

    const { offset, original, isDragging } = useStore(plane);

    const copyKeys = WraparoundUtils.computeTiles(offset, tileSize, viewportSize, maxCopies).map(toKey);
    const originalKey = toKey(original);

    const toTileTransform = (tile: WraparoundTile) =>
        `translate(${tile.column * tileSize.width}px, ${tile.row * tileSize.height}px)`;

    return (
        <div
            ref={rootRef}
            className={[WraparoundStyles.wraparoundRoot, isDragging && WraparoundStyles.isDragging]
                .filter(Boolean)
                .join(" ")}
            role="region"
            aria-label={props.ariaLabel}
            tabIndex={isDisabled ? undefined : 0}
        >
            <div
                className={WraparoundStyles.wraparoundPlane}
                style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            >
                <div
                    ref={originalRef}
                    className={WraparoundStyles.wraparoundTile}
                    style={{ transform: toTileTransform(original) }}
                >
                    {props.renderContent()}
                </div>

                {copyKeys.map((key) => (
                    <div
                        key={key}
                        className={WraparoundStyles.wraparoundTile}
                        style={{
                            transform: toTileTransform(fromKey(key)),
                            visibility: key === originalKey ? "hidden" : undefined,
                        }}
                        aria-hidden="true"
                        inert
                    >
                        {props.renderContent()}
                    </div>
                ))}
            </div>
        </div>
    );
};
