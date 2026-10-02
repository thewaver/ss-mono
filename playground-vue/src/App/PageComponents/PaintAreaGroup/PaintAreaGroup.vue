<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";

import { PaintAreaProvider } from "@thewaver/ss-components-vue";
import { type Point2d, Size2d } from "@thewaver/ss-utils";

import type { PagePaintAreaGroupCell, PagePaintAreaGroupProps } from "./PaintAreaGroup.types";

const NO_SIZE = { width: 0, height: 0 };
const UNSCALED = 1;

defineProps<PagePaintAreaGroupProps>();

defineSlots<{ cell(cell: PagePaintAreaGroupCell): unknown }>();

const groupRef = shallowRef<HTMLElement>();
const groupSize = shallowRef<Size2d>(NO_SIZE);
const offsets = shallowRef<Point2d[]>([]);
const cells: HTMLElement[] = [];

let observer: ResizeObserver | undefined;

const getPaintArea = (index: number) => {
    const offset = offsets.value[index];

    return offset && { x: -offset.x, y: -offset.y, ...groupSize.value };
};

const setCell = (index: number, cell: unknown) => {
    if (cell instanceof HTMLElement) cells[index] = cell;
};

onMounted(() => {
    const group = groupRef.value;

    if (!group) return;

    const measure = () => {
        const groupRect = group.getBoundingClientRect();
        const scale = groupRect.width ? group.offsetWidth / groupRect.width : UNSCALED;
        const size = { width: group.offsetWidth, height: group.offsetHeight };

        if (!Size2d.isSame(groupSize.value, size)) groupSize.value = size;

        offsets.value = cells.map((cell) => {
            const cellRect = cell.getBoundingClientRect();

            return { x: (cellRect.left - groupRect.left) * scale, y: (cellRect.top - groupRect.top) * scale };
        });
    };

    observer = new ResizeObserver(measure);
    observer.observe(group);
    cells.forEach((cell) => observer?.observe(cell));
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
    <div ref="groupRef" :class="groupClass">
        <div v-for="index in cellCount" :key="index" :ref="(cell) => setCell(index - 1, cell)">
            <PaintAreaProvider :get-paint-area="() => getPaintArea(index - 1)">
                <slot name="cell" :index="index - 1" :groupElement="groupRef" :groupSize="groupSize" />
            </PaintAreaProvider>
        </div>
    </div>
</template>
