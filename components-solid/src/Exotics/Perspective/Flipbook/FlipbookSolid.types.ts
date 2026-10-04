import type { Accessor, JSX } from "solid-js";

import type {
    FlipbookLabels,
    FlipbookPageState,
    FlipbookState,
    FlipbookStep,
    FlipbookStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type FlipbookControlProps = AccessorProps<
    InteractionControlProps<FlipbookStepRenderProps> & {
        /** Runs when the control is pressed. */
        onActivate: () => void;
    }
>;

export type FlipbookControls = {
    /** Which spread the book is open at. */
    getIndex: Accessor<number>;
    /** How many spreads the book opens at, the two covers' included. */
    getSpreadCount: Accessor<number>;
    /**
     * Draws one of the step controls: a real button, named by `computeStepLabel` and painted by `renderStep`, which
     * turns the book one spread and is disabled at the end it would turn past.
     */
    renderStep: (step: FlipbookStep) => JSX.Element;
};

export type FlipbookProps<T> = AccessorProps<
    FlipbookState &
        FlipbookLabels & {
            /**
             * Which spread the book is open at, counting from zero: `0` is the front cover alone on the right, the last
             * is the back cover alone on the left. Writing it turns the pages there, one after another; a spread past
             * either end is held there. Left out, the book keeps its own, starting shut.
             */
            index?: SignalSource<number>;
            /** Paints one of the step controls inside the button the book builds. */
            renderStep?: (
                getStep: Accessor<FlipbookStep>,
                getRenderProps: () => InteractionFlags<FlipbookStepRenderProps>,
            ) => JSX.Element;
            /**
             * Places the step controls, handed the means to draw them, so the page decides where they sit while the book
             * still builds each one. **They are the single-pointer alternative WCAG 2.5.7 asks for to dragging a page**,
             * so a book drawn without them takes no drags; the arrow keys turn it either way.
             */
            renderControls?: (controls: FlipbookControls) => JSX.Element;
        }
> & {
    /** The pages, in reading order: the first is the front cover and, when there is an even number, the last is the back. */
    pages: MaybeAccessor<T[]>;
    /**
     * Draws one page. It is handed half the book's box, on the side of the spine the page lies on, and turns with its
     * leaf, so whatever it draws goes over with it.
     */
    renderPage: (getPage: Accessor<T>, getState: Accessor<FlipbookPageState>) => JSX.Element;
};
