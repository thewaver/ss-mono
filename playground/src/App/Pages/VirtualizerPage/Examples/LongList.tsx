import { For, createEffect, createSignal } from "solid-js";

import { Virtualizer } from "@thewaver/ss-components";

import type { VirtualizerCountExampleProps } from "../VirtualizerPage.types";

import * as styles from "../VirtualizerPage.css";

const ROW_HEIGHT_PX = 28;

type Props = VirtualizerCountExampleProps;

export const LongListExample = (props: Props) => {
    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const rowWindow = Virtualizer.createRowWindow(getSizerRef, props.rowCount, {
        getIsEnabled: () => true,
        computeEstimatedSize: () => ROW_HEIGHT_PX,
    });

    createEffect(() => {
        props.onMountedCountChange(rowWindow.getRows().length);
    });

    return (
        <div class={styles.scroller}>
            <div ref={setSizerRef} class={styles.sizer} style={{ height: `${rowWindow.getTotalSize()}px` }}>
                <For each={rowWindow.getRows()}>
                    {(row) => (
                        <div
                            class={styles.sizerRow}
                            style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
                        >
                            <div class={styles.row} style={{ height: `${ROW_HEIGHT_PX}px` }}>
                                <span class={styles.rowIndex}>{`#${row.index}`}</span>
                                <span>{`row ${row.index} of ${props.rowCount()}`}</span>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
