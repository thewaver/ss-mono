import { For, createEffect, createSignal } from "solid-js";

import { Virtualizer } from "@thewaver/ss-components";

import type { VirtualizerUnevenExampleProps } from "../VirtualizerPage.types";

import * as styles from "../VirtualizerPage.css";

const ESTIMATED_HEIGHT_PX = 40;
const MIN_LINES = 1;
const MAX_LINES = 4;
const LINE = "measured after it mounts, not guessed";

const getLineCount = (index: number) => MIN_LINES + (index % MAX_LINES);

type Props = VirtualizerUnevenExampleProps;

export const UnevenExample = (props: Props) => {
    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const rowWindow = Virtualizer.createRowWindow(getSizerRef, props.rowCount, {
        getIsEnabled: () => true,
        computeEstimatedSize: () => ESTIMATED_HEIGHT_PX,
    });

    createEffect(() => {
        props.onTotalSizeChange(rowWindow.getTotalSize());
    });

    return (
        <div class={styles.scroller}>
            <div ref={setSizerRef} class={styles.sizer} style={{ height: `${rowWindow.getTotalSize()}px` }}>
                <For each={rowWindow.getRows()}>
                    {(row) => (
                        <div
                            class={styles.sizerRow}
                            style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
                            ref={(element) => rowWindow.measureRow(element, row.index)}
                        >
                            <div class={styles.row} style={{ "flex-direction": "column", "align-items": "start" }}>
                                <span class={styles.rowIndex}>{`#${row.index}`}</span>

                                <For each={Array.from({ length: getLineCount(row.index) }, (_unused, i) => i)}>
                                    {() => <span>{LINE}</span>}
                                </For>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
