import { For, createEffect, createSignal } from "solid-js";

import { Virtualizer } from "@thewaver/ss-components";

import type { VirtualizerPinnedExampleProps } from "../VirtualizerPage.types";

import * as styles from "../VirtualizerPage.css";

const ROW_HEIGHT_PX = 28;
const TOP_ROW = 0;

type Props = VirtualizerPinnedExampleProps;

export const PinnedExample = (props: Props) => {
    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const rowWindow = Virtualizer.createRowWindow(getSizerRef, props.rowCount, {
        getIsEnabled: () => true,
        computeEstimatedSize: () => ROW_HEIGHT_PX,
        getPinnedRows: () => [props.pinnedRow()],
    });

    createEffect(() => {
        props.onMountedRowsChange(rowWindow.getRows().map((row) => row.index));
    });

    return (
        <div class={styles.pinnedRoot}>
            <div class={styles.controls}>
                <button type="button" class={styles.button} onClick={() => rowWindow.scrollToRow(props.pinnedRow())}>
                    {`Jump to #${props.pinnedRow()}`}
                </button>

                <button type="button" class={styles.button} onClick={() => rowWindow.scrollToRow(TOP_ROW)}>
                    Back to the top
                </button>
            </div>

            <div class={styles.scroller}>
                <div ref={setSizerRef} class={styles.sizer} style={{ height: `${rowWindow.getTotalSize()}px` }}>
                    <For each={rowWindow.getRows()}>
                        {(row) => (
                            <div
                                class={styles.sizerRow}
                                style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
                            >
                                <div
                                    class={`${styles.row} ${row.index === props.pinnedRow() ? styles.rowPinned : ""}`}
                                    style={{ height: `${ROW_HEIGHT_PX}px` }}
                                >
                                    <span class={styles.rowIndex}>{`#${row.index}`}</span>
                                    <span>
                                        {row.index === props.pinnedRow() ? "pinned — stays mounted" : "ordinary row"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );
};
