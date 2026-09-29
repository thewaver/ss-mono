import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { Button, SortableGrid } from "@thewaver/ss-components-react";
import type {
    InteractionFlags,
    SortableGridController,
    SortableGridGeometry,
    SortableGridItem,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components-react";
import { SORTABLE_GRID_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.css";
import type { Gear } from "@thewaver/ss-playground/App/Pages/SortableGridPage/SortableGridPage.types";

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

type Props = {
    groupId: string;
    items: readonly [SortableGridItem<Gear>[], (items: SortableGridItem<Gear>[]) => void];
    ariaLabel: string;
    emptyText: string;
    columns?: number;
    rows?: number;
    paint?: SortableGridPaint;
    isDisabled?: boolean;
    isLocked?: boolean;
    isTurnable?: boolean;
    hasTurnButtons?: boolean;
    hasTidyButton?: boolean;
    isCompacting?: boolean;
    computeCanAccept?: (value: Gear, fromLabel: string) => boolean;
    computeIsSpotBlocked?: (spot: SortableGridSpot) => boolean;
};

const RESTING_FLAGS: InteractionFlags<SortableGridItemFlags> = { isCarried: false };

const TURN_KEY = "r";

const NO_SUBSCRIPTION = () => {};

export const InventoryExample = (props: Props) => {
    const [controller, setController] = useState<SortableGridController>();

    const subscribe = useCallback(
        (listener: () => void) => controller?.subscribe(listener) ?? NO_SUBSCRIPTION,
        [controller],
    );

    const isCarrying = useSyncExternalStore(subscribe, () => controller?.getIsCarrying() ?? false);

    const isTurnable = props.isTurnable ?? false;

    const turn = (step: number) => {
        if (step > 0) controller?.turnCw();
        else controller?.turnCcw();
    };

    const handleMount = (mounted: SortableGridController) => {
        setController(mounted);

        if (props.isCompacting) mounted.compact();
    };

    const renderGear = (
        item: SortableGridItem<Gear>,
        flags: InteractionFlags<SortableGridItemFlags>,
        geometry: SortableGridGeometry,
    ) => (
        <PageSortableGridItemContent
            flags={flags}
            geometry={geometry}
            glyph={item.value.glyph}
            name={item.value.name}
            paint={props.paint ?? "outline"}
            hue={computeGearHue(item.value)}
        />
    );

    useEffect(() => {
        if (!isTurnable) return;

        const turnBy = (step: number) => {
            if (step > 0) controller?.turnCw();
            else controller?.turnCcw();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!controller?.getIsCarrying() || e.key.toLowerCase() !== TURN_KEY) return;

            e.preventDefault();
            turnBy(e.shiftKey ? -1 : 1);
        };

        const handleWheel = (e: WheelEvent) => {
            if (!controller?.getIsCarrying()) return;

            e.preventDefault();
            turnBy(e.deltaY > 0 ? 1 : -1);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [isTurnable, controller]);

    return (
        <div className={styles.sortableGridStack}>
            {props.hasTurnButtons && (
                <div className={styles.sortableGridTurnControls}>
                    <Button
                        ariaLabel={"Turn counterclockwise"}
                        isDisabled={!isCarrying}
                        onClick={() => turn(-1)}
                        renderContent={(flags) => <PageButtonContent flags={flags}>{"↺"}</PageButtonContent>}
                    />

                    <Button
                        ariaLabel={"Turn clockwise"}
                        isDisabled={!isCarrying}
                        onClick={() => turn(1)}
                        renderContent={(flags) => <PageButtonContent flags={flags}>{"↻"}</PageButtonContent>}
                    />
                </div>
            )}

            {props.hasTidyButton && (
                <div className={styles.sortableGridTurnControls}>
                    <Button
                        ariaLabel={"Tidy up"}
                        onClick={() => {
                            controller?.compact();
                        }}
                        renderContent={(flags) => <PageButtonContent flags={flags}>{"Tidy up"}</PageButtonContent>}
                    />
                </div>
            )}

            <SortableGrid
                groupId={props.groupId}
                ariaLabel={props.ariaLabel}
                announcements={SORTABLE_GRID_ANNOUNCEMENTS}
                columns={props.columns ?? PACK_COLUMNS}
                rows={props.rows ?? PACK_ROWS}
                cellSize={CELL_SIZE}
                gap={GRID_GAP}
                isDisabled={props.isDisabled ?? false}
                isLocked={props.isLocked ?? false}
                isTurnable={isTurnable}
                items={props.items}
                computeItemKey={computeGearKey}
                computeItemLabel={computeGearLabel}
                computeCanAccept={props.computeCanAccept}
                computeIsSpotBlocked={props.computeIsSpotBlocked}
                renderItem={renderGear}
                renderCarried={(item, geometry) => renderGear(item, RESTING_FLAGS, geometry)}
                renderCell={(spot, flags) => <PageSortableGridCell spot={spot} isBlocked={flags.isBlocked} />}
                renderLanding={(isAllowed, geometry) => (
                    <PageSortableGridLanding isAllowed={isAllowed} geometry={geometry} />
                )}
                renderDecoration={(flags) => <PageSortableGridSurface flags={flags} emptyText={props.emptyText} />}
                onTransfer={() => {
                    if (props.isCompacting) controller?.compact();
                }}
                onMount={handleMount}
            />
        </div>
    );
};
