import type { Point2d } from "@thewaver/ss-utils";

import type {
    BracketBox,
    BracketConnectorDefs,
    BracketGeometry,
    BracketGeometryOpts,
    BracketLayout,
    BracketNode,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
    BracketStep,
} from "./Bracket.types";

/** The final's own id. Every other id is built by appending a child's position to its parent's. */
const ROOT_ID = "0";
/** The root's layer. Layers count outwards from the final towards the first round. */
const FIRST_LAYER = 0;
/** Zero, as a count or an index. */
const NOTHING = 0;
/** One layer, one step or one item. */
const SINGLE = 1;
/** Halfway, for centering a match between its two feeders. */
const HALF = 0.5;
/** What separates a child's position from its parent's id. */
const ID_SEPARATOR = ".";

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

    /**
     * Whether a node lies on the route from another node to the root.
     *
     * Ids are paths through the tree, so a node is on the route exactly when its id is the other node's id
     * or a leading part of it ending at a separator — `0.1` is on the route from `0.1.0`, and `0.1` is not
     * on the route from `0.10`.
     *
     * @param id The node being asked about.
     * @param fromId Where the route starts. `undefined`, for nothing focused, gives no route at all.
     * @returns `true` for the starting node itself and every node between it and the root, the root
     * included.
     */
    export const getIsOnRoute = (id: string, fromId: string | undefined) =>
        fromId !== undefined && (fromId === id || fromId.startsWith(`${id}.`));

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
     * @param placements The matches the walk may land on. A caller that skips disabled matches passes
     * only the enabled ones, and every step — across a layer or between layers — is resolved against
     * that list, so a step never answers with a match the caller cannot focus.
     * @returns The match to move to, or `undefined` when there is none that way — the final has no
     * parent, a first-round match has no feeders, and the layer's ends do not wrap.
     */
    export const computeStepId = (step: BracketStep, fromId: string, placements: BracketPlacement[]) => {
        const from = findPlacement(placements, fromId);

        if (!from) return undefined;

        if (step === "toRoot") return findPlacement(placements, from.parentId)?.id;

        if (step === "toLeaves") {
            const children = from.childIds.filter((id) => findPlacement(placements, id) !== undefined);

            if (!children.length) return undefined;

            return children[Math.floor((children.length - SINGLE) * HALF)];
        }

        const layer = getLayerPlacements(placements, from.layer);
        const at = layer.findIndex((placement) => placement.id === fromId);

        if (step === "first") return layer[NOTHING]?.id;
        if (step === "last") return layer[layer.length - SINGLE]?.id;

        const next = step === "next" ? at + SINGLE : at - SINGLE;

        return layer[next]?.id;
    };

    /**
     * The node a placement id points at.
     *
     * @param root The final, as {@link computeLayout} was given it.
     * @param id An id from that layout: the root's own, then each child's position appended after a separator.
     * @returns The node. An id the layout did not produce is not guarded against.
     */
    export const findNode = <T>(root: BracketNode<T>, id: string): BracketNode<T> =>
        id
            .split(ID_SEPARATOR)
            .slice(SINGLE)
            .map(Number)
            .reduce<BracketNode<T>>((node, index) => node.children![index], root);

    /**
     * Turns a layout's layers and places into lengths on the board.
     *
     * @param layout What {@link computeLayout} answered.
     * @param opts The node size, the two gaps, which way the board runs, which end holds the final, and how thick the
     * strip of layer headers is — `0` when there are none.
     * @returns Everything {@link computeInset}, {@link computeHeaderBox} and {@link computeConnectors} need, and the
     * board's own size: as long as the layers with their gaps between, and as wide as the first round's matches with
     * theirs, plus the header strip.
     */
    export const computeGeometry = (layout: BracketLayout, opts: BracketGeometryOpts): BracketGeometry => {
        const isHorizontal = opts.orientation === "horizontal";
        const layerExtent = isHorizontal ? opts.nodeSize.width : opts.nodeSize.height;
        const crossExtent = isHorizontal ? opts.nodeSize.height : opts.nodeSize.width;
        const layerPitch = layerExtent + opts.layerGap;
        const crossPitch = crossExtent + opts.crossGap;
        const layerSpan = layout.layerCount * layerPitch - opts.layerGap;
        const crossSpan = opts.headerExtent + layout.leafCount * crossPitch - opts.crossGap;

        return {
            ...opts,
            isHorizontal,
            layerExtent,
            crossExtent,
            layerPitch,
            crossPitch,
            layerSpan,
            boardSize: isHorizontal ? { width: layerSpan, height: crossSpan } : { width: crossSpan, height: layerSpan },
        };
    };

    /**
     * Where a layer begins along the board.
     *
     * @param geometry What {@link computeGeometry} answered.
     * @param layer The layer, counting from the final.
     * @returns The distance from the board's leading edge, counted from the end the final is not at when it sits at
     * the end.
     */
    export const getLayerStart = (geometry: BracketGeometry, layer: number) => {
        const fromStart = layer * geometry.layerPitch;

        return geometry.rootSide === "start" ? fromStart : geometry.layerSpan - fromStart - geometry.layerExtent;
    };

    /**
     * Where a match's box begins across the board, past the header strip.
     *
     * @param geometry What {@link computeGeometry} answered.
     * @param placement The match.
     */
    export const getCrossStart = (geometry: BracketGeometry, placement: BracketPlacement) =>
        geometry.headerExtent + placement.cross * geometry.crossPitch;

    /**
     * Where a match's box sits on the board.
     *
     * @param geometry What {@link computeGeometry} answered.
     * @param placement The match.
     * @returns Its top left corner, in pixels from the board's.
     */
    export const computeInset = (geometry: BracketGeometry, placement: BracketPlacement) => {
        const along = getLayerStart(geometry, placement.layer);
        const across = getCrossStart(geometry, placement);

        return geometry.isHorizontal ? { left: along, top: across } : { left: across, top: along };
    };

    /**
     * Where a layer's header sits on the board.
     *
     * @param geometry What {@link computeGeometry} answered.
     * @param layer The layer, counting from the final.
     * @returns A box in the header strip, as long as one node along the board and as thick as the strip, in line with
     * the layer's matches.
     */
    export const computeHeaderBox = (geometry: BracketGeometry, layer: number): BracketBox => {
        const along = getLayerStart(geometry, layer);

        return geometry.isHorizontal
            ? { left: along, top: NOTHING, width: geometry.layerExtent, height: geometry.headerExtent }
            : { left: NOTHING, top: along, width: geometry.headerExtent, height: geometry.layerExtent };
    };

    /**
     * Every line between a match and the one it feeds.
     *
     * @param layout What {@link computeLayout} answered.
     * @param geometry What {@link computeGeometry} answered for it.
     * @param boardId Unique to this board in the document, so the connector ids it prefixes are too.
     * @param focusedId The match that holds focus, or `undefined` for none.
     * @returns One connector per match that feeds another, running from the middle of the parent's edge facing its
     * children to the middle of the child's edge facing the root, so no line passes under a box. Each says whether
     * its child is on the route from the focused match to the final.
     */
    export const computeConnectors = (
        layout: BracketLayout,
        geometry: BracketGeometry,
        boardId: string,
        focusedId: string | undefined,
    ): BracketConnectorDefs[] => {
        const toPoint = (along: number, across: number): Point2d =>
            geometry.isHorizontal ? { x: along, y: across } : { x: across, y: along };

        const getAnchor = (placement: BracketPlacement, isTowardRoot: boolean) =>
            toPoint(
                getFacingEdge(
                    getLayerStart(geometry, placement.layer),
                    geometry.layerExtent,
                    geometry.rootSide,
                    isTowardRoot,
                ),
                getCrossStart(geometry, placement) + geometry.crossExtent * HALF,
            );

        return layout.placements
            .filter((placement) => placement.childIds.length > NOTHING)
            .flatMap((placement) => {
                const from = getAnchor(placement, false);

                return placement.childIds.flatMap((childId) => {
                    const child = findPlacement(layout.placements, childId);

                    if (!child) return [];

                    return [
                        {
                            id: `${boardId}-${placement.id}-${childId}`,
                            parentId: placement.id,
                            childId,
                            orientation: geometry.orientation,
                            from,
                            to: getAnchor(child, true),
                            isOnFocusedRoute: getIsOnRoute(childId, focusedId),
                        },
                    ];
                });
            });
    };

    /**
     * Which step a key takes on a board.
     *
     * @param key The key pressed, as `KeyboardEvent.key` names it.
     * @param orientation Which way the board runs.
     * @param rootSide Which end holds the final.
     * @returns For {@link computeStepId}: the arrow along the board pointing at the final goes towards it and the other
     * away, the two across the board move within a layer, and Home and End go to the layer's ends. `undefined` for
     * any other key.
     */
    export const getKeyStep = (
        key: string,
        orientation: BracketOrientation,
        rootSide: BracketRootSide,
    ): BracketStep | undefined => {
        const isHorizontal = orientation === "horizontal";
        const alongLayers = isHorizontal ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
        const towardRoot = rootSide === "start" ? alongLayers[NOTHING] : alongLayers[SINGLE];

        if (key === towardRoot) return "toRoot";
        if (alongLayers.includes(key)) return "toLeaves";
        if (key === "Home") return "first";
        if (key === "End") return "last";

        const acrossLayer = isHorizontal ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];

        if (key === acrossLayer[NOTHING]) return "previous";
        if (key === acrossLayer[SINGLE]) return "next";

        return undefined;
    };

    /**
     * Which match holds the board's one tab stop.
     *
     * @param stops The matches that can be picked, in keyboard order.
     * @param lastFocusedId The match that last held focus, or `undefined` for none yet.
     * @returns That match while it can still be picked, and the first one that can otherwise. `undefined` when none
     * can.
     */
    export const resolveRovingId = (stops: BracketPlacement[], lastFocusedId: string | undefined) =>
        lastFocusedId !== undefined && stops.some((placement) => placement.id === lastFocusedId)
            ? lastFocusedId
            : stops[NOTHING]?.id;
}
