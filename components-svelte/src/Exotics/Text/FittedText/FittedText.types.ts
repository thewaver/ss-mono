import type { FittedTextController } from "@thewaver/ss-components";

export type { FittedTextController };

export type FittedTextProps = {
    /**
     * The lines, top to bottom, already split where the consumer wants them broken; nothing is wrapped. Each is
     * scaled to the full width of the box, then all of them shrink together until the stack fits the height, so a
     * short line comes out larger than a long one. The font is the one the component inherits.
     */
    lines: string[];
    /** Each line's height as a multiple of its own font size, which is the room the stack is fitted with. */
    lineHeightRatio?: number;
    /** Hands the consumer a controller once the text is up, for sizing it again after a change it cannot see. */
    onMount?: (controller: FittedTextController) => void;
};
