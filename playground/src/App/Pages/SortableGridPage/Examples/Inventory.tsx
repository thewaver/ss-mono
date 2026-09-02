import type { Accessor, Signal } from "solid-js";
import { Show, createEffect, createSignal, onCleanup } from "solid-js";

import { Button, SortableGrid, access } from "@thewaver/ss-components";
import type {
    InteractionFlags,
    MaybeAccessor,
    SortableGridController,
    SortableGridGeometry,
    SortableGridItem,
    SortableGridItemFlags,
} from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageSortableGridCell,
    PageSortableGridItemContent,
    PageSortableGridLanding,
    PageSortableGridSurface,
} from "../../../StyledComponents/SortableGridContent/SortableGridContent";
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
import type { Gear } from "../SortableGridPage.types";

import * as styles from "../SortableGridPage.css";

type Props = {
    groupId: string;
    itemsSignal: Signal<SortableGridItem<Gear>[]>;
    ariaLabel: string;
    emptyText: string;
    columns?: number;
    rows?: number;
    paint?: SortableGridPaint;
    isDisabled?: MaybeAccessor<boolean>;
    isLocked?: MaybeAccessor<boolean>;
    isTurnable?: MaybeAccessor<boolean>;
    hasTurnButtons?: boolean;
    computeCanAccept?: (value: Gear, fromLabel: string) => boolean;
};

const RESTING_FLAGS: InteractionFlags<SortableGridItemFlags> = { isCarried: false };

const TURN_KEY = "r";

export const InventoryExample = (props: Props) => {
    const [getController, setController] = createSignal<SortableGridController>();

    const turn = (step: number) => {
        if (step > 0) getController()?.turnCw();
        else getController()?.turnCcw();
    };

    const renderGear = (
        getItem: Accessor<SortableGridItem<Gear>>,
        getFlags: () => InteractionFlags<SortableGridItemFlags>,
        getGeometry: Accessor<SortableGridGeometry>,
    ) => (
        <PageSortableGridItemContent
            flags={getFlags}
            geometry={getGeometry}
            glyph={() => getItem().value.glyph}
            name={() => getItem().value.name}
            paint={() => props.paint ?? "outline"}
            hue={() => computeGearHue(getItem().value)}
        />
    );

    /**
     * The library owns no turn gesture at all, so a consumer that wants one binds it. A carry claims Tab
     * while it is in flight, so no button on the page can be reached from the keyboard mid-carry — a key of
     * one's own is therefore what keeps turning operable without a pointer, and the buttons are the pointer
     * route rather than the accessible one.
     */
    createEffect(() => {
        if (!(access(props.isTurnable) ?? false)) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!getController()?.getIsCarrying() || e.key.toLowerCase() !== TURN_KEY) return;

            e.preventDefault();
            turn(e.shiftKey ? -1 : 1);
        };

        const handleWheel = (e: WheelEvent) => {
            if (!getController()?.getIsCarrying()) return;

            e.preventDefault();
            turn(e.deltaY > 0 ? 1 : -1);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: false });

        onCleanup(() => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        });
    });

    return (
        <div class={styles.sortableGridStack}>
            <Show when={props.hasTurnButtons}>
                <div class={styles.sortableGridTurnControls}>
                    <Button
                        ariaLabel={"Turn anticlockwise"}
                        isDisabled={() => !getController()?.getIsCarrying()}
                        onClick={() => turn(-1)}
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>{"↺"}</PageButtonContent>}
                    />

                    <Button
                        ariaLabel={"Turn clockwise"}
                        isDisabled={() => !getController()?.getIsCarrying()}
                        onClick={() => turn(1)}
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>{"↻"}</PageButtonContent>}
                    />
                </div>
            </Show>

            <SortableGrid
                groupId={props.groupId}
                ariaLabel={props.ariaLabel}
                columns={() => props.columns ?? PACK_COLUMNS}
                rows={() => props.rows ?? PACK_ROWS}
                cellSize={CELL_SIZE}
                gap={GRID_GAP}
                isDisabled={() => access(props.isDisabled) ?? false}
                isLocked={() => access(props.isLocked) ?? false}
                isTurnable={() => access(props.isTurnable) ?? false}
                itemsSignal={props.itemsSignal}
                computeItemKey={computeGearKey}
                computeItemLabel={computeGearLabel}
                computeCanAccept={props.computeCanAccept}
                renderItem={renderGear}
                renderCarried={(getItem, getGeometry) => renderGear(getItem, () => RESTING_FLAGS, getGeometry)}
                renderCell={(getSpot) => <PageSortableGridCell spot={getSpot} />}
                renderLanding={(getIsAllowed, getGeometry) => (
                    <PageSortableGridLanding isAllowed={getIsAllowed} geometry={getGeometry} />
                )}
                renderDecoration={(getFlags) => (
                    <PageSortableGridSurface flags={getFlags} emptyText={props.emptyText} />
                )}
                onMount={setController}
            />
        </div>
    );
};
