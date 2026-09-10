import type { BracketLayout, BracketNode, BracketPlacement, BracketRootSide, BracketStep } from "./Bracket.types";

/** The final's own id. Every other id is built by appending a child's position to its parent's. */
const ROOT_ID = "0";
/** The root's layer. Layers count outwards from the final towards the first round. */
const FIRST_LAYER = 0;
/** Zero, as a count or an index. */
const NOTHING = 0;
/** One layer, one step or one item. */
const SINGLE = 1;
/** Halfway, for centring a match between its two feeders. */
const HALF = 0.5;

/**
 * Places the matches of a knockout bracket, and moves a cursor around it.
 *
 * Positions come out as two numbers per match rather than as pixels: which layer it is in, counting
 * from the final outwards, and where it sits across that layer. The component turns those into
 * pixels, which is what lets the same layout be drawn left to right, right to left, or as two halves
 * facing inwards.
 *
 * A match's place across the bracket is the midpoint of the matches that feed it, so the tree lines
 * up whatever shape it is — including an uneven bracket where one side has more rounds than the
 * other.
 */
export namespace BracketUtils {
    /**
     * Places every match in a bracket.
     *
     * @param root The final, with its feeders as children, and so on down to the first round.
     * @returns The placements sorted by layer and then across it, along with how many layers deep the
     * bracket runs and how many first-round matches it has. Each placement carries the ids of its parent
     * and its children, so the connecting lines can be drawn without walking the tree again.
     */
    export const computeLayout = <T>(root: BracketNode<T>): BracketLayout => {
        const placements: BracketPlacement[] = [];

        let leafCount = NOTHING;
        let layerCount = NOTHING;

        const walk = (node: BracketNode<T>, id: string, parentId: string | undefined, layer: number): number => {
            const children = node.children ?? [];
            const childIds = children.map((_unused, index) => `${id}.${index}`);

            layerCount = Math.max(layerCount, layer + SINGLE);

            const crosses = children.map((child, index) => walk(child, childIds[index], id, layer + SINGLE));
            const cross = crosses.length ? (crosses[NOTHING] + crosses[crosses.length - SINGLE]) * HALF : leafCount++;

            placements.push({ id, parentId, childIds, layer, cross, isDisabled: node.isDisabled ?? false });

            return cross;
        };

        walk(root, ROOT_ID, undefined, FIRST_LAYER);

        return { placements: placements.sort(compareByPlace), layerCount, leafCount };
    };

    /**
     * Which edge of a layer a connecting line should leave from or arrive at.
     *
     * A line between two matches has to leave the edge facing its destination, and which edge that is
     * depends on both the side the final sits on and whether the line runs inwards or outwards. Working
     * it out once here keeps that out of the drawing code.
     *
     * @param layerStart The layer's own position.
     * @param layerExtent The layer's thickness.
     * @param rootSide Which end of the bracket the final sits at.
     * @param isTowardRoot Whether the line runs towards the final.
     * @returns The position of the edge to use.
     */
    export const getFacingEdge = (
        layerStart: number,
        layerExtent: number,
        rootSide: BracketRootSide,
        isTowardRoot: boolean,
    ) => layerStart + ((rootSide === "start") !== isTowardRoot ? layerExtent : NOTHING);

    /** Orders placements by layer, then across the layer. This is drawing order and also keyboard order. */
    export const compareByPlace = (first: BracketPlacement, second: BracketPlacement) =>
        first.layer - second.layer || first.cross - second.cross;

    /**
     * The placement with a given id.
     *
     * @param placements The bracket's placements.
     * @param id The id to look for. Missing gives `undefined`, so the parent id of the final can be
     * passed straight in.
     */
    export const findPlacement = (placements: BracketPlacement[], id: string | undefined) =>
        placements.find((placement) => placement.id === id);

    /**
     * The matches in one layer, in order across it.
     *
     * @param placements The bracket's placements.
     * @param layer Which layer, counting from the final.
     */
    export const getLayerPlacements = (placements: BracketPlacement[], layer: number) =>
        placements.filter((placement) => placement.layer === layer).sort(compareByPlace);

    /**
     * Which match a keyboard step moves to.
     *
     * Moving towards the leaves lands on the middle feeder rather than the first, so repeatedly stepping
     * in and back out returns to where it started rather than drifting to one side.
     *
     * @param step `"toRoot"`, `"toLeaves"`, `"next"`, `"previous"`, `"first"` or `"last"`. The last four
     * move within the current layer.
     * @param fromId Where the cursor is now.
     * @param placements The bracket's placements.
     * @returns The match to move to, or `undefined` when there is none that way — the final has no
     * parent, a first-round match has no feeders, and the layer's ends do not wrap.
     */
    export const computeStepId = (step: BracketStep, fromId: string, placements: BracketPlacement[]) => {
        const from = findPlacement(placements, fromId);

        if (!from) return undefined;

        if (step === "toRoot") return from.parentId;

        if (step === "toLeaves") {
            if (!from.childIds.length) return undefined;

            return from.childIds[Math.floor((from.childIds.length - SINGLE) * HALF)];
        }

        const layer = getLayerPlacements(placements, from.layer);
        const at = layer.findIndex((placement) => placement.id === fromId);

        if (step === "first") return layer[NOTHING]?.id;
        if (step === "last") return layer[layer.length - SINGLE]?.id;

        const next = step === "next" ? at + SINGLE : at - SINGLE;

        return layer[next]?.id;
    };
}
