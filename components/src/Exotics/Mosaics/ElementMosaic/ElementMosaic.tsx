import { type Accessor, createMemo, createSignal, onCleanup } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../../Abstracts/ElementObserver/ElementObserver.utils";
import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ElementMosaicProps } from "../../../Primitives/Mosaic/Mosaic.types";
import { MosaicUtils } from "../../../Primitives/Mosaic/Mosaic.utils";
import { access } from "../../../Utils/propUtils";

import * as styles from "./ElementMosaic.css";

const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

export const ElementMosaic = <T,>(props: ElementMosaicProps<T>) => {
    const [getItemElements, setItemElements] = createSignal(new Map<HTMLElement, Accessor<number>>());

    const getItemRefs = createMemo(() => {
        const refs: Array<HTMLElement | undefined> = [];

        for (const [element, getIndex] of getItemElements()) refs[getIndex()] = element;

        return refs;
    });

    const getMeasuredSizes = ElementObserverUtils.createBorderBoxSizeListObserver(getItemRefs);

    const getSizes = createMemo(() => access(props.items).map((_, index) => getMeasuredSizes()[index] ?? EMPTY_SIZE));

    const addItemElement = (element: HTMLElement, getIndex: Accessor<number>) => {
        setItemElements((elements) => new Map(elements).set(element, getIndex));

        onCleanup(() => {
            setItemElements((elements) => {
                const next = new Map(elements);

                next.delete(element);

                return next;
            });
        });
    };

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            transitionDurationMs={props.transitionDurationMs}
            sizes={getSizes}
            keys={props.items}
            isItemSized={false}
            computePlacements={MosaicUtils.packFixed}
            ariaLabel={props.ariaLabel}
            onActivate={props.onActivate}
            renderItem={(getIndex, getState) => (
                <div ref={(element) => addItemElement(element, getIndex)} class={styles.elementMosaicItem}>
                    {props.renderItem(() => access(props.items)[getIndex()], getState)}
                </div>
            )}
        />
    );
};
