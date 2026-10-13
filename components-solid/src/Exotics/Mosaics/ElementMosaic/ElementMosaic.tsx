import { type Accessor, createMemo, createSignal, onCleanup } from "solid-js";

import { MosaicUtils, ElementMosaicStyles as styles } from "@thewaver/ss-components";
import { ElementMosaicConst } from "@thewaver/ss-components/internal";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ElementMosaicProps } from "../../../Primitives/Mosaic/MosaicSolid.types";
import { access } from "../../../Utils/propUtils";

export const ElementMosaic = <T,>(props: ElementMosaicProps<T>) => {
    const [getItemElements, setItemElements] = createSignal(new Map<HTMLElement, Accessor<number>>());

    const getItemRefs = createMemo(() => {
        const refs: Array<HTMLElement | undefined> = [];

        for (const [element, getIndex] of getItemElements()) refs[getIndex()] = element;

        return refs;
    });

    const getMeasuredSizes = ElementObserverSolidUtils.createBorderBoxSizeListObserver(getItemRefs);

    const getSizes = createMemo(() =>
        access(props.items).map((_, index) => getMeasuredSizes()[index] ?? ElementMosaicConst.EMPTY_SIZE),
    );

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
