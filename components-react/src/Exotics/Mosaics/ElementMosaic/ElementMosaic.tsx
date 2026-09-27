import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { ElementMosaicStyles, MosaicUtils } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ElementMosaicProps } from "./ElementMosaic.types";

const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

export const ElementMosaic = <T,>(props: ElementMosaicProps<T>) => {
    const elementsByIndex = useRef(new Map<number, HTMLElement>());

    const [itemElements, setItemElements] = useState<Array<HTMLElement | undefined>>([]);

    const itemCount = props.items.length;

    useLayoutEffect(() => {
        const next = Array.from({ length: itemCount }, (_, index) => elementsByIndex.current.get(index));

        setItemElements((prev) => (MosaicUtils.getIsSameList(prev, next) ? prev : next));
    });

    const measuredSizes = ElementObserverReactUtils.useBorderBoxSizes(itemElements);

    const sizes = useMemo(
        () => Array.from({ length: itemCount }, (_, index) => measuredSizes[index] ?? EMPTY_SIZE),
        [itemCount, measuredSizes],
    );

    const setItemElement = (index: number, element: HTMLDivElement | null) => {
        if (element) {
            elementsByIndex.current.set(index, element);

            return;
        }

        elementsByIndex.current.delete(index);
    };

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            transitionDurationMs={props.transitionDurationMs}
            sizes={sizes}
            keys={props.items}
            isItemSized={false}
            computePlacements={MosaicUtils.packFixed}
            ariaLabel={props.ariaLabel}
            onActivate={props.onActivate}
            renderItem={(index, state) => (
                <div
                    ref={(element) => setItemElement(index, element)}
                    className={ElementMosaicStyles.elementMosaicItem}
                >
                    {props.renderItem(props.items[index], state)}
                </div>
            )}
        />
    );
};
