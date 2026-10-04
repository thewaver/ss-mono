import { For, createEffect, createMemo, createSignal, onCleanup, untrack } from "solid-js";

import {
    WRAPAROUND_DEFAULTS,
    type WraparoundTile,
    WraparoundUtils,
    WraparoundStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { WraparoundProps } from "./WraparoundSolid.types";

const KEY_SEPARATOR = ",";

const toKey = (tile: WraparoundTile) => `${tile.column}${KEY_SEPARATOR}${tile.row}`;

const fromKey = (key: string): WraparoundTile => {
    const [column, row] = key.split(KEY_SEPARATOR).map(Number);

    return { column, row };
};

export const Wraparound = (props: WraparoundProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getOriginalRef, setOriginalRef] = createSignal<HTMLElement>();

    const getViewportSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);
    const getTileSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getOriginalRef);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getMaxCopies = createMemo(() => access(props.maxCopies) ?? WRAPAROUND_DEFAULTS.maxCopies);

    const plane = WraparoundUtils.createPlane({
        getTileSize: () => untrack(getTileSize),
        getViewportSize: () => untrack(getViewportSize),
        getOriginal: () => untrack(getOriginalRef),
        getIsDisabled: () => untrack(getIsDisabled),
        getMomentumMs: () => untrack(() => access(props.momentumMs) ?? WRAPAROUND_DEFAULTS.momentumMs),
        getGlideDurationMs: () => untrack(() => access(props.glideDurationMs) ?? WRAPAROUND_DEFAULTS.glideDurationMs),
        getKeyStepPx: () => untrack(() => access(props.keyStepPx) ?? WRAPAROUND_DEFAULTS.keyStepPx),
    });

    onCleanup(plane.destroy);

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        onCleanup(plane.observe(root));
    });

    const getOffset = accessStore(plane, (state) => state.offset);

    const getOriginalTile = accessStore(plane, (state) => state.original);

    const getIsDragging = accessStore(plane, (state) => state.isDragging);

    const getCopyKeys = createMemo(
        () => WraparoundUtils.computeTiles(getOffset(), getTileSize(), getViewportSize(), getMaxCopies()).map(toKey),
        [],
        { equals: (a, b) => a.length === b.length && a.every((key, index) => key === b[index]) },
    );

    const toTileTransform = (tile: WraparoundTile) => {
        const size = getTileSize();

        return `translate(${tile.column * size.width}px, ${tile.row * size.height}px)`;
    };

    return (
        <div
            ref={setRootRef}
            class={styles.wraparoundRoot}
            classList={{ [styles.isDragging]: getIsDragging() }}
            role="region"
            aria-label={access(props.ariaLabel)}
            tabindex={getIsDisabled() ? undefined : 0}
        >
            <div
                class={styles.wraparoundPlane}
                style={{ transform: `translate(${getOffset().x}px, ${getOffset().y}px)` }}
            >
                <div
                    ref={setOriginalRef}
                    class={styles.wraparoundTile}
                    style={{ transform: toTileTransform(getOriginalTile()) }}
                >
                    {props.renderContent()}
                </div>

                <For each={getCopyKeys()}>
                    {(key) => (
                        <div
                            class={styles.wraparoundTile}
                            style={{
                                transform: toTileTransform(fromKey(key)),
                                visibility: key === toKey(getOriginalTile()) ? "hidden" : undefined,
                            }}
                            aria-hidden="true"
                            inert
                        >
                            {props.renderContent()}
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
