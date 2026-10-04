import type { Snippet } from "svelte";

import type {
    FlipbookLabels,
    FlipbookPageState,
    FlipbookState,
    FlipbookStep,
    FlipbookStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type FlipbookControlProps = InteractionControlProps<FlipbookStepRenderProps> & {
    /** Runs when the control is pressed. */
    onActivate: () => void;
};

export type FlipbookControls = {
    /** Which spread the book is open at. */
    index: number;
    /** How many spreads the book opens at, the two covers' included. */
    spreadCount: number;
    /**
     * Draws one of the step controls, with `{@render controls.renderStep("next")}`: a real button, named by
     * `computeStepLabel` and painted by `renderStep`, which turns the book one spread and is disabled at the end it
     * would turn past.
     */
    renderStep: Snippet<[step: FlipbookStep]>;
};

export type FlipbookProps<T> = FlipbookState &
    FlipbookLabels & {
        /** The pages, in reading order: the first is the front cover and, when there is an even number, the last is the back. */
        pages: T[];
        /**
         * Which spread the book is open at, counting from zero: `0` is the front cover alone on the right, the last is
         * the back cover alone on the left. Writing it turns the pages there, one after another; a spread past either
         * end is held there. Bind it with `bind:index` to drive or follow it; left unbound, the book keeps its own,
         * starting shut.
         */
        index?: number;
        /**
         * Draws one page. It is handed half the book's box, on the side of the spine the page lies on, and turns with
         * its leaf, so whatever it draws goes over with it.
         */
        renderPage: Snippet<[page: T, state: FlipbookPageState]>;
        /** Paints one of the step controls inside the button the book builds. */
        renderStep?: Snippet<[step: FlipbookStep, renderProps: InteractionFlags<FlipbookStepRenderProps>]>;
        /**
         * Places the step controls, handed the means to draw them, so the page decides where they sit while the book
         * still builds each one. **They are the single-pointer alternative WCAG 2.5.7 asks for to dragging a page**, so
         * a book drawn without them takes no drags; the arrow keys turn it either way.
         */
        renderControls?: Snippet<[controls: FlipbookControls]>;
    };
