import { useLayoutEffect, useRef, useState } from "react";

import { PaintAreaContextProvider } from "@thewaver/ss-components-react";
import { type Point2d, Size2d } from "@thewaver/ss-utils";

import type { PagePaintAreaGroupProps } from "./PaintAreaGroup.types";

const NO_SIZE = { width: 0, height: 0 };
const UNSCALED = 1;

export const PagePaintAreaGroup = (props: PagePaintAreaGroupProps) => {
    const cellsRef = useRef<HTMLElement[]>([]);

    const [groupElement, setGroupElement] = useState<HTMLElement | null>(null);
    const [groupSize, setGroupSize] = useState<Size2d>(NO_SIZE);
    const [offsets, setOffsets] = useState<Point2d[]>([]);

    useLayoutEffect(() => {
        if (!groupElement) return;

        const measure = () => {
            const groupRect = groupElement.getBoundingClientRect();
            const scale = groupRect.width ? groupElement.offsetWidth / groupRect.width : UNSCALED;
            const size = { width: groupElement.offsetWidth, height: groupElement.offsetHeight };

            setGroupSize((previous) => (Size2d.isSame(previous, size) ? previous : size));
            setOffsets(
                cellsRef.current.map((cell) => {
                    const cellRect = cell.getBoundingClientRect();

                    return { x: (cellRect.left - groupRect.left) * scale, y: (cellRect.top - groupRect.top) * scale };
                }),
            );
        };

        const observer = new ResizeObserver(measure);

        observer.observe(groupElement);
        cellsRef.current.forEach((cell) => observer.observe(cell));

        return () => observer.disconnect();
    }, [groupElement]);

    return (
        <div ref={setGroupElement} className={props.className}>
            {Array.from({ length: props.cellCount }, (_unused, index) => {
                const offset = offsets[index];

                return (
                    <div
                        key={index}
                        ref={(cell) => {
                            if (cell) cellsRef.current[index] = cell;
                        }}
                    >
                        <PaintAreaContextProvider
                            value={{ paintArea: offset && { x: -offset.x, y: -offset.y, ...groupSize } }}
                        >
                            {props.renderCell({ index, groupElement: groupElement ?? undefined, groupSize })}
                        </PaintAreaContextProvider>
                    </div>
                );
            })}
        </div>
    );
};
