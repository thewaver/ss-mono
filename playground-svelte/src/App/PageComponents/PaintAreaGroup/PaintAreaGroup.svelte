<script lang="ts">
    import { PaintAreaProvider } from "@thewaver/ss-components-svelte";
    import { type Point2d, Size2d } from "@thewaver/ss-utils";

    import type { PagePaintAreaGroupProps } from "./PaintAreaGroup.types";

    const NO_SIZE = { width: 0, height: 0 };
    const UNSCALED = 1;

    let props: PagePaintAreaGroupProps = $props();

    let group = $state<HTMLElement>();
    let groupSize = $state.raw<Size2d>(NO_SIZE);
    let offsets = $state.raw<Point2d[]>([]);

    const cells: HTMLElement[] = [];

    const getPaintArea = (index: number) => {
        const offset = offsets[index];

        return offset && { x: -offset.x, y: -offset.y, ...groupSize };
    };

    $effect(() => {
        const element = group;

        if (!element) return;

        const measure = () => {
            const groupRect = element.getBoundingClientRect();
            const scale = groupRect.width ? element.offsetWidth / groupRect.width : UNSCALED;
            const size = { width: element.offsetWidth, height: element.offsetHeight };

            if (!Size2d.isSame(groupSize, size)) groupSize = size;

            offsets = cells.map((cell) => {
                const cellRect = cell.getBoundingClientRect();

                return { x: (cellRect.left - groupRect.left) * scale, y: (cellRect.top - groupRect.top) * scale };
            });
        };

        const observer = new ResizeObserver(measure);

        observer.observe(element);
        cells.forEach((cell) => observer.observe(cell));

        return () => observer.disconnect();
    });
</script>

<div bind:this={group} class={props.groupClass}>
    {#each { length: props.cellCount } as _unused, index (index)}
        <div bind:this={cells[index]}>
            <PaintAreaProvider getPaintArea={() => getPaintArea(index)}>
                {@render props.cell({ index, groupElement: group, groupSize })}
            </PaintAreaProvider>
        </div>
    {/each}
</div>
