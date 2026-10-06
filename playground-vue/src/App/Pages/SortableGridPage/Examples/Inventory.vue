<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

import { Button, SortableGrid } from "@thewaver/ss-components-vue";
import type {
    InteractionFlags,
    SortableGridController,
    SortableGridItem,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components-vue";
import { SORTABLE_GRID_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageSortableGridCell from "../../../StyledComponents/SortableGridContent/PageSortableGridCell.vue";
import PageSortableGridItemContent from "../../../StyledComponents/SortableGridContent/PageSortableGridItemContent.vue";
import PageSortableGridLanding from "../../../StyledComponents/SortableGridContent/PageSortableGridLanding.vue";
import PageSortableGridSurface from "../../../StyledComponents/SortableGridContent/PageSortableGridSurface.vue";
import type { SortableGridPaint } from "../../../StyledComponents/SortableGridContent/SortableGridContent.types";
import {
    CELL_SIZE,
    GRID_GAP,
    PACK_COLUMNS,
    PACK_ROWS,
    computeGearHue,
    computeGearKey,
    computeGearLabel,
} from "../SortableGridPage.const";

type Props = {
    "groupId": string;
    "items": SortableGridItem<Gear>[];
    "onUpdate:items"?: (items: SortableGridItem<Gear>[]) => void;
    "ariaLabel": string;
    "emptyText": string;
    "columns"?: number;
    "rows"?: number;
    "paint"?: SortableGridPaint;
    "isDisabled"?: boolean;
    "isLocked"?: boolean;
    "isTurnable"?: boolean;
    "hasTurnButtons"?: boolean;
    "hasTidyButton"?: boolean;
    "isCompacting"?: boolean;
    "computeCanAccept"?: (value: Gear, fromLabel: string) => boolean;
    "computeIsSpotBlocked"?: (spot: SortableGridSpot) => boolean;
};

const RESTING_FLAGS: InteractionFlags<SortableGridItemFlags> = { isCarried: false };

const TURN_KEY = "r";

const props = defineProps<Props>();

const items = useModel(props, "items");

const controller = shallowRef<SortableGridController>();

const isCarrying = computed(() => controller.value?.getIsCarrying() ?? false);

const isTurnable = computed(() => props.isTurnable ?? false);

const turn = (step: number) => {
    if (step > 0) controller.value?.turnCw();
    else controller.value?.turnCcw();
};

const handleMount = (mounted: SortableGridController) => {
    controller.value = mounted;

    if (props.isCompacting) mounted.compact();
};

watch(
    [isTurnable, controller],
    ([turnable, current], _previous, onCleanup) => {
        if (!turnable) return;

        const turnBy = (step: number) => {
            if (step > 0) current?.turnCw();
            else current?.turnCcw();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!current?.getIsCarrying() || e.key.toLowerCase() !== TURN_KEY) return;

            e.preventDefault();
            turnBy(e.shiftKey ? -1 : 1);
        };

        const handleWheel = (e: WheelEvent) => {
            if (!current?.getIsCarrying()) return;

            e.preventDefault();
            turnBy(e.deltaY > 0 ? 1 : -1);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: false });

        onCleanup(() => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        });
    },
    { immediate: true },
);
</script>

<template>
    <div :class="styles.sortableGridStack">
        <div v-if="hasTurnButtons" :class="styles.sortableGridTurnControls">
            <Button ariaLabel="Turn counterclockwise" :is-disabled="!isCarrying" @click="turn(-1)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.turnLeft" />
                </template>
            </Button>

            <Button ariaLabel="Turn clockwise" :is-disabled="!isCarrying" @click="turn(1)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.turnRight" />
                </template>
            </Button>
        </div>

        <div v-if="hasTidyButton" :class="styles.sortableGridTurnControls">
            <Button
                ariaLabel="Tidy up"
                @click="
                    () => {
                        controller?.compact();
                    }
                "
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags">{{ "Tidy up" }}</PageControlButtonContent>
                </template>
            </Button>
        </div>

        <SortableGrid
            v-model:items="items"
            :group-id="groupId"
            :ariaLabel="ariaLabel"
            :announcements="SORTABLE_GRID_ANNOUNCEMENTS"
            :columns="columns ?? PACK_COLUMNS"
            :rows="rows ?? PACK_ROWS"
            :cell-size="CELL_SIZE"
            :gap="GRID_GAP"
            :is-disabled="isDisabled ?? false"
            :is-locked="isLocked ?? false"
            :is-turnable="isTurnable"
            :compute-item-key="computeGearKey"
            :compute-item-label="computeGearLabel"
            :compute-can-accept="computeCanAccept"
            :compute-is-spot-blocked="computeIsSpotBlocked"
            @transfer="
                () => {
                    if (isCompacting) controller?.compact();
                }
            "
            @mount="handleMount"
        >
            <template #renderItem="{ item, flags, geometry }">
                <PageSortableGridItemContent
                    :flags="flags"
                    :geometry="geometry"
                    :glyph="item.value.glyph"
                    :name="item.value.name"
                    :paint="paint ?? 'contour'"
                    :hue="computeGearHue(item.value)"
                />
            </template>

            <template #renderCarried="{ item, geometry }">
                <PageSortableGridItemContent
                    :flags="RESTING_FLAGS"
                    :geometry="geometry"
                    :glyph="item.value.glyph"
                    :name="item.value.name"
                    :paint="paint ?? 'contour'"
                    :hue="computeGearHue(item.value)"
                />
            </template>

            <template #renderCell="{ spot, flags }">
                <PageSortableGridCell :spot="spot" :is-blocked="flags.isBlocked" />
            </template>

            <template #renderLanding="{ isAllowed, geometry }">
                <PageSortableGridLanding :is-allowed="isAllowed" :geometry="geometry" />
            </template>

            <template #renderDecoration="flags">
                <PageSortableGridSurface :flags="flags" :empty-text="emptyText" />
            </template>
        </SortableGrid>
    </div>
</template>
