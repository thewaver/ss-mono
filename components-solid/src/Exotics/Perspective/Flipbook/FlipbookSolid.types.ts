import type { Accessor, JSX } from "solid-js";

import type {
    BaseFlipbookValues,
    FlipbookLabels,
    FlipbookPageState,
    FlipbookState,
    FlipbookStep,
} from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type FlipbookControls = {
    /** Which spread the book is open at, counting from zero. */
    getIndex: Accessor<number>;
    /** How many spreads the book opens at, the two covers' included. */
    getSpreadCount: Accessor<number>;
    /**
     * Whether a turn would do anything, so a button standing for it can be disabled.
     *
     * @param step Which way the turn would go.
     * @returns `false` when the book is disabled or already open at that end.
     */
    getCanTurn: (step: FlipbookStep) => boolean;
    /**
     * Opens the book one spread further or one back, as an arrow key would.
     *
     * @param step Which way to turn.
     * @returns `false` when the book is disabled or already open at that end.
     */
    turn: (step: FlipbookStep) => boolean;
};

export type FlipbookProps<T> = AccessorProps<FlipbookState & FlipbookLabels> &
    AccessorValues<BaseFlipbookValues<T>> & {
        /**
         * Which spread the book is open at, counting from zero: `0` is the front cover alone on the right, the last is
         * the back cover alone on the left. Writing it turns the pages there, one after another; a spread past either
         * end is held there. Left out, the book keeps its own, starting shut.
         */
        index?: SignalSource<number>;
        /**
         * Hands the consumer the controls once the book is up, for turning it from outside.
         *
         * **Anything that turns a page without a drag has to be built on these.** The book draws its pages and nothing
         * else, so the buttons belong to whoever is drawing the page and may sit anywhere on it. That matters beyond
         * layout: dragging a page is a dragging movement, so
         * {@link https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html WCAG 2.5.7} asks for a
         * single-pointer route that is not a drag, and the arrow keys do not satisfy it. `turn` is that route, and
         * wiring it up is the consumer's to do.
         */
        onMount?: (controls: FlipbookControls) => void;
        /**
         * Draws one page. It is handed half the book's box, on the side of the spine the page lies on, and turns with its
         * leaf, so whatever it draws goes over with it.
         */
        renderPage: (getPage: Accessor<T>, getState: Accessor<FlipbookPageState>) => JSX.Element;
    };
