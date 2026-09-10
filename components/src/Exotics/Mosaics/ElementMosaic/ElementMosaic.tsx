import { createEffect, createMemo, createSignal } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../../Abstracts/ElementObserver/ElementObserver.utils";
import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ElementMosaicProps } from "../../../Primitives/Mosaic/Mosaic.types";
import { MosaicUtils } from "../../../Primitives/Mosaic/Mosaic.utils";
import { access } from "../../../Utils/propUtils";

import * as styles from "./ElementMosaic.css";

const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

export const ElementMosaic = <T,>(props: ElementMosaicProps<T>) => {
    const [getMeasuredSizes, setMeasuredSizes] = createSignal<Size2d[]>([]);

    const getSizes = createMemo(() => access(props.items).map((_, index) => getMeasuredSizes()[index] ?? EMPTY_SIZE));

    const setSizeAt = (index: number, size: Size2d) =>
        setMeasuredSizes((sizes) => {
            const next = [...sizes];

            next[index] = size;

            return next;
        });

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            sizes={getSizes}
            isItemSized={false}
            computePlacements={MosaicUtils.packFixed}
            renderItem={(index, getState) => {
                const [getItemRef, setItemRef] = createSignal<HTMLElement>();

                const getItemSize = ElementObserverUtils.createBorderBoxSizeObserver(getItemRef);

                createEffect(() => {
                    setSizeAt(index, getItemSize());
                });

                return (
                    <div ref={setItemRef} class={styles.elementMosaicItem}>
                        {props.renderItem(() => access(props.items)[index], getState)}
                    </div>
                );
            }}
        />
    );
};
