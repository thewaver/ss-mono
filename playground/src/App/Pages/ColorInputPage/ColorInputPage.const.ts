export const PALETTE = ["#ff0055", "#00d1b2", "#ffb400", "#7a5cff"];

export const NO_BRAND_COLOR = "#000000";

const channels = (hex: string) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));

export const toNearestPaletteColor = (value: string) => {
    const target = channels(value);

    return PALETTE.reduce((closest, candidate) => {
        const distance = (hex: string) =>
            channels(hex).reduce((sum, channel, index) => sum + (channel - target[index]) ** 2, 0);

        return distance(candidate) < distance(closest) ? candidate : closest;
    }, PALETTE[0]);
};

export const EXAMPLE_NAMES = {
    default: "Default",
    compact: "Compact",
    snapping: "Snapping setter",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
    label: "In a Label",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ColorInputPage/Examples";
