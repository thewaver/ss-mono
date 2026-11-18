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

export const DOCS_ROOT = "/src/App/Pages/ColorInputPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the field turns round with it: the swatch sits on the right, while the painter keeps the value itself left to right, so rgb(51 102 255) is not scrambled. The picker opens under the field lined up with its right edge and runs right to left too, but neither the square nor the hue strip inside it mirrors, since they are pictures of color rather than text: saturation still grows to the right, the hue strip still starts from red at the left, and the right arrow moves either one to the right.",
    },
    correctingPick: {
        title: "Correcting a pick",
        content:
            "Every change also runs [prop]onInput[/prop], and whatever it writes to the value is what the field holds. Here every color is pulled to the nearest of four in a palette, so dragging across the square jumps from one to the next.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still opens nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the picker.",
    },
};

export const BRAND_COLOR_RIGHT_LEFT_LABEL = "Brand color in a right-to-left box";

export const DISABLED_BUT_REACHABLE_COLOR_LABEL = "Disabled but reachable color";
