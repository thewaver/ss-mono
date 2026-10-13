export const COLUMN_ROWS = Array.from({ length: 16 }, (_, index) => `Row ${index + 1}`);

export const STRIP_CHIPS = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

export const GRID_TILES = Array.from({ length: 64 }, (_, index) => index + 1);

export const EXAMPLE_NAMES = {
    column: "Top and bottom",
    strip: "Left and right",
    grid: "All four sides",
    card: "Something that does not scroll",
};

export const EXAMPLES_ROOT = "/src/App/Pages/EdgeFaderPage/Examples";
