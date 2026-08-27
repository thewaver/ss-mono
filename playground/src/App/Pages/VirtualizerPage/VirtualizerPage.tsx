import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { LongListExample } from "./Examples/LongList";
import { PinnedExample } from "./Examples/Pinned";
import { UnevenExample } from "./Examples/Uneven";

const EXAMPLES_ROOT = "/src/App/Pages/VirtualizerPage/Examples";
const MIN_ROW_COUNT = 100;
const MAX_ROW_COUNT = 1000000;
const ROW_COUNT_STEP = 100;
const STARTING_ROW_COUNT = 100000;
const STARTING_PINNED_ROW = 50000;
const PINNED_ROW_STEP = 1;
const FIRST_ROW = 0;
const FIELD_WIDTH = 130;

export const VirtualizerPage = () => {
    const [getRowCount, setRowCount] = createSignal(STARTING_ROW_COUNT);
    const [getPinnedRow, setPinnedRow] = createSignal(STARTING_PINNED_ROW);

    const [getMountedCount, setMountedCount] = createSignal(0);
    const [getTotalSize, setTotalSize] = createSignal(0);
    const [getMountedRows, setMountedRows] = createSignal<number[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "longList",
            name: "Long list",
            readout: () => `${getMountedCount()} rows exist, out of ${getRowCount().toLocaleString()}`,
            component: () => <LongListExample rowCount={getRowCount} onMountedCountChange={setMountedCount} />,
            path: `${EXAMPLES_ROOT}/LongList.tsx`,
        },
        {
            key: "uneven",
            name: "Uneven rows",
            readout: () =>
                `every row is measured after it mounts — the run so far adds up to ${Math.round(getTotalSize()).toLocaleString()}px`,
            component: () => <UnevenExample rowCount={getRowCount} onTotalSizeChange={setTotalSize} />,
            path: `${EXAMPLES_ROOT}/Uneven.tsx`,
        },
        {
            key: "pinned",
            name: "Pinned row",
            readout: () =>
                getMountedRows().includes(getPinnedRow())
                    ? `#${getPinnedRow()} is mounted — it is pinned, so it stays even when scrolled away`
                    : `#${getPinnedRow()} is not mounted`,
            component: () => (
                <PinnedExample rowCount={getRowCount} pinnedRow={getPinnedRow} onMountedRowsChange={setMountedRows} />
            ),
            path: `${EXAMPLES_ROOT}/Pinned.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"rowCount"} label={"Rows"}>
                    <PageNumberField
                        value={getRowCount}
                        min={() => MIN_ROW_COUNT}
                        max={() => MAX_ROW_COUNT}
                        step={() => ROW_COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Rows"}
                        onInput={setRowCount}
                    />
                </PageProp>

                <PageProp key={"pinnedRow"} label={"Pinned row"}>
                    <PageNumberField
                        value={getPinnedRow}
                        min={() => FIRST_ROW}
                        max={() => getRowCount() - 1}
                        step={() => PINNED_ROW_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Pinned row"}
                        onInput={setPinnedRow}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
