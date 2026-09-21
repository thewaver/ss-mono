import { createMemo, createSignal } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../../Abstracts/ElementObserver/ElementObserver.utils";
import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ElementMosaicProps } from "../../../Primitives/Mosaic/Mosaic.types";
import { MosaicUtils } from "../../../Primitives/Mosaic/Mosaic.utils";
import { access } from "../../../Utils/propUtils";

import * as styles from "./ElementMosaic.css";

const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

export const ElementMosaic = <T,>(props: ElementMosaicProps<T>) => {
    const [getItemRefs, setItemRefs] = createSignal<Array<HTMLElement | undefined>>([]);

    const getMeasuredSizes = ElementObserverUtils.createBorderBoxSizeListObserver(getItemRefs);

    const getSizes = createMemo(() => access(props.items).map((_, index) => getMeasuredSizes()[index] ?? EMPTY_SIZE));

    const setItemRefAt = (index: number, element: HTMLElement) =>
        setItemRefs((refs) => {
            const next = [...refs];

            next[index] = element;

            return next;
        });

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            sizes={getSizes}
            isItemSized={false}
            computePlacements={MosaicUtils.packFixed}
            renderItem={(index, getState) => (
                <div ref={(element) => setItemRefAt(index, element)} class={styles.elementMosaicItem}>
                    {props.renderItem(() => access(props.items)[index], getState)}
                </div>
            )}
        />
    );
};
