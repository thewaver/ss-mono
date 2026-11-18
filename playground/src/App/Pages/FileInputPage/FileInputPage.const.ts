import type { FileInputRejectReason } from "@thewaver/ss-components";

const BYTES_PER_KILOBYTE = 1024;
const DROP_ZONE_MAX_KILOBYTES = 200;

export const MAX_ATTACHMENT_BYTES = 1024;

export const DROP_ZONE_ACCEPT = "image/*";
export const DROP_ZONE_MAX_FILES = 3;
export const DROP_ZONE_MAX_SIZE_BYTES = DROP_ZONE_MAX_KILOBYTES * BYTES_PER_KILOBYTE;

export const DROP_ZONE_REASON_TEXT: Record<FileInputRejectReason, string> = {
    count: `over the limit of ${DROP_ZONE_MAX_FILES} files`,
    size: `larger than ${DROP_ZONE_MAX_KILOBYTES} KB`,
    type: "not an image",
};

export const EXAMPLE_NAMES = {
    default: "Default",
    multiple: "Multiple",
    images: "Accepting images only",
    rejectingSetter: "Rejecting setter",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
    label: "In a Label",
    dropZone: "Drop area with limits",
};

export const EXAMPLES_ROOT = "/src/App/Pages/FileInputPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/FileInputPage/Docs";

export const DOCS_SECTIONS = {
    severalFiles: {
        title: "Several files",
        content:
            "Set [prop]isMultiple[/prop] and the dialog lets several files be picked at once. The value is a list either way; without it, the list holds one file or none.",
    },
    someFileKindsOnly: {
        title: "Only some kinds of file",
        content:
            "The dialog offers only the kinds of file [prop]accept[/prop] names, here images. The control checks every file again as it arrives, since the dialog can be switched to show everything, so a file of another kind is refused rather than kept.",
    },
    refusingPick: {
        title: "Refusing a pick",
        content:
            "Every pick also runs [prop]onChange[/prop], and the control shows whatever its files then hold, so a pick can be refused by writing an empty list back. That is the place for a rule only you know, which no limit on the control can express. Here the files are bound for a system that cannot take a space in a name, so such a file is refused, the control shows its error, and the readout says why. Limits on type, size and count need no code: the control applies them itself, as the next section shows.",
    },
    droppingFilesWithinLimits: {
        title: "Dropping files, within limits",
        content:
            "Files can also be dropped anywhere on the control, and arrive exactly as a pick does. Each arrival is checked against [prop]accept[/prop], then [prop]maxSizeBytes[/prop], then [prop]maxFiles[/prop]: the files that pass are kept, and the ones refused go to [prop]onReject[/prop] together, each with the limit it failed. The painter is told [prop]isDragOver[/prop] while files are held over the control, so it can show where they will land.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a control [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the control's description. A disabled control shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still opens nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the control takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the dialog.",
    },
};

export const DROP_IMAGES_HERE_PRESS_TEXT = "Drop images here, or press to choose";

export const FILE_WHOSE_NAME_HAS_TEXT = "A file whose name has a space in it is refused";

export const DISABLED_BUT_REACHABLE_ATTACHMENT_LABEL = "Disabled but reachable attachment";
