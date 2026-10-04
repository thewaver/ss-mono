import type { VNodeChild } from "vue";

import type {
    FlipbookLabels,
    FlipbookPageState,
    FlipbookState,
    FlipbookStep,
    FlipbookStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

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
     * Draws one of the step controls: a real button, named by `computeStepLabel` and painted by `renderStep`, which
     * turns the book one spread and is disabled at the end it would turn past. It carries its step as its key.
     */
    renderStep: (step: FlipbookStep) => VNodeChild;
};

export type FlipbookContentProps<T> = {
    /** The pages, in reading order: the first is the front cover and, when there is an even number, the last is the back. */
    "pages": T[];
    /**
     * Which spread the book is open at, counting from zero: `0` is the front cover alone on the right, the last is the
     * back cover alone on the left. Writing it turns the pages there, one after another; a spread past either end is
     * held there. Left unbound, the book keeps its own, starting shut.
     */
    "index"?: number;
    /** Receives the book's own turns, which is what `v-model:index` binds. */
    "onUpdate:index"?: (index: number) => void;
};

export type FlipbookSlots<T> = {
    /**
     * Draws one page. It is handed half the book's box, on the side of the spine the page lies on, and turns with its
     * leaf, so whatever it draws goes over with it.
     */
    renderPage: (props: { page: T; state: FlipbookPageState }) => VNodeChild;
    /** Paints one of the step controls inside the button the book builds. */
    renderStep?: (props: { step: FlipbookStep; renderProps: InteractionFlags<FlipbookStepRenderProps> }) => VNodeChild;
    /**
     * Places the step controls, handed the means to draw them, so the page decides where they sit while the book still
     * builds each one. **They are the single-pointer alternative WCAG 2.5.7 asks for to dragging a page**, so a book
     * drawn without them takes no drags; the arrow keys turn it either way.
     */
    renderControls?: (controls: FlipbookControls) => VNodeChild;
};

export type FlipbookProps<T> = FlipbookState & FlipbookLabels & FlipbookContentProps<T>;
