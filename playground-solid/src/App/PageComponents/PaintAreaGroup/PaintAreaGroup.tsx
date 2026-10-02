import { Index, createSignal, onCleanup, onMount } from "solid-js";

import { PaintAreaContextProvider } from "@thewaver/ss-components-solid";
import { type Point2d, Size2d } from "@thewaver/ss-utils";

import type { PagePaintAreaGroupProps } from "./PaintAreaGroup.types";

const NO_SIZE = { width: 0, height: 0 };
const UNSCALED = 1;

export const PagePaintAreaGroup = (props: PagePaintAreaGroupProps) => {
    const cells: HTMLElement[] = [];

    const [getGroupRef, setGroupRef] = createSignal<HTMLElement>();
    const [getGroupSize, setGroupSize] = createSignal<Size2d>(NO_SIZE, { equals: Size2d.isSame });
    const [getOffsets, setOffsets] = createSignal<Point2d[]>([]);

    const getPaintArea = (index: number) => {
        const offset = getOffsets()[index];

        return offset && { x: -offset.x, y: -offset.y, ...getGroupSize() };
    };

    onMount(() => {
        const group = getGroupRef();

        if (!group) return;

        const measure = () => {
            const groupRect = group.getBoundingClientRect();
            const scale = groupRect.width ? group.offsetWidth / groupRect.width : UNSCALED;

            setGroupSize({ width: group.offsetWidth, height: group.offsetHeight });
            setOffsets(
                cells.map((cell) => {
                    const cellRect = cell.getBoundingClientRect();

                    return { x: (cellRect.left - groupRect.left) * scale, y: (cellRect.top - groupRect.top) * scale };
                }),
            );
        };

        const observer = new ResizeObserver(measure);

        observer.observe(group);
        cells.forEach((cell) => observer.observe(cell));

        onCleanup(() => observer.disconnect());
    });

    return (
        <div ref={setGroupRef} class={props.class}>
            <Index each={Array.from({ length: props.cellCount })}>
                {(_unused, index) => (
                    <div
                        ref={(cell) => {
                            cells[index] = cell;
                        }}
                    >
                        <PaintAreaContextProvider value={{ getPaintArea: () => getPaintArea(index) }}>
                            {props.renderCell({ index, getGroupRef, getGroupSize })}
                        </PaintAreaContextProvider>
                    </div>
                )}
            </Index>
        </div>
    );
};
