import type { Store, SwipeDirection } from "@thewaver/ss-utils";

import type { SpineSide } from "../../../Primitives/Spine/Spine.types";

export type FlipbookStep = "previous" | "next";

export type FlipbookSide = "left" | "right";

export type FlipbookLeafFace = SpineSide;

export type FlipbookSpreadPages = {
    /** The page lying on the left, read already, or `undefined` on the first spread, where the front cover is alone. */
    left: number | undefined;
    /** The page lying on the right, not read yet, or `undefined` on the last spread, where the back cover is alone. */
    right: number | undefined;
};

export type FlipbookPageState = {
    /** Which page this is, counting from zero. */
    index: number;
    /** How many pages there are. */
    count: number;
    /**
     * Which side of the spine the page lies on when it is flat: the front of every leaf on the right, its back on the
     * left. A page keeps its side while it turns, so a painter can shade the edge nearer the spine.
     */
    side: FlipbookSide;
    /** Whether the page is one of the two the book is open at. */
    isShowing: boolean;
};

export type FlipbookStepRenderProps = {
    /** Which way this control turns the book. */
    step: FlipbookStep;
    /** Which spread this control would open the book at. At either end it is the spread already open. */
    targetIndex: number;
};

export type FlipbookBookDefs = {
    /** How many pages there are. */
    getPageCount: () => number;
    /** Which spread the book is open at. */
    getIndex: () => number;
    /** Opens the book at a spread. */
    setIndex: (index: number) => void;
    /** Whether the book refuses every turn. */
    getIsDisabled: () => boolean;
    /** How long one turn takes. `0` turns at once. */
    getTransitionDurationMs: () => number;
};

export type FlipbookBook = {
    /**
     * Where the book is drawn, in spreads: whole while it rests, fractional while a page turns, so `2.5` is the leaf
     * between the third and fourth spreads standing upright. Writes that change nothing notify nobody.
     */
    position: Store<number>;
    /**
     * Opens the book one spread further or one back, as a step control or an arrow key would.
     *
     * @returns `false` when the book is disabled or already open at that end.
     */
    turn: (step: FlipbookStep) => boolean;
    /**
     * Turns the pages from where the book is drawn to a spread over one transition, the pages in between going over
     * one after another. Called whenever the spread changes, from anywhere.
     */
    glideTo: (index: number) => void;
    /** Follows a drag in progress, as a signed share of the book's width: leftwards turns forward. */
    push: (progressRatio: number) => void;
    /**
     * Ends a drag: a drag that went past the commit point opens the spread it was turning towards, and one that fell
     * short lets the page fall back.
     *
     * @param direction The way the drag committed, from the swipe tracker, or `undefined` when it fell short.
     */
    release: (direction: SwipeDirection | undefined) => void;
    /** Stops any turn under way and draws the book at the spread it is open at, so it is usable again after a remount. */
    stop: () => void;
};

export type FlipbookState = {
    /** How long one page takes to turn. `0` turns it at once, which is the answer to a reduced-motion preference. */
    transitionDurationMs?: number;
    /**
     * How far a page has to be dragged before it turns over rather than falling back when it is let go, as a share of
     * the book's whole width. Dragging the full width turns a page all the way over.
     */
    commitRatio?: number;
    /** The space between the book and the controls the consumer draws beside it. */
    gap?: number;
    /** Turns the book off, so neither its controls, its keys nor a drag turn a page. */
    isDisabled?: boolean;
    /** Names the book for assistive technology. The book is a region, and a region must be named. */
    ariaLabel: string;
};

export type FlipbookLabels = {
    /**
     * Names one page for assistive technology, and is told how many there are so it can say page three of twelve. The
     * index counts from zero. Each of the two pages showing is named on its own, so a reader always knows which of
     * them they are on.
     */
    computePageLabel: (index: number, count: number) => string;
    /**
     * What is announced when the book opens at a different spread, told the pages now showing — one at either cover,
     * two in between, in reading order and counting from zero — and how many there are, so it can say pages three and
     * four of twelve. Nothing is announced as the book first appears.
     */
    computeSpreadAnnouncement: (pages: number[], count: number) => string;
    /** Names one of the step controls. */
    computeStepLabel: (step: FlipbookStep) => string;
    /** What the book is called when it is announced, so a reader hears book rather than region. Defaults to "book". */
    roleDescription?: string;
    /** What one page is called when it is announced, so a reader hears page rather than group. Defaults to "page". */
    pageRoleDescription?: string;
};
