export type VirtualizerCountExampleProps = {
    rowCount: () => number;
    onMountedCountChange: (count: number) => void;
};

export type VirtualizerUnevenExampleProps = {
    rowCount: () => number;
    onTotalSizeChange: (totalSize: number) => void;
};

export type VirtualizerPinnedExampleProps = {
    rowCount: () => number;
    pinnedRow: () => number;
    onMountedRowsChange: (indices: number[]) => void;
};
