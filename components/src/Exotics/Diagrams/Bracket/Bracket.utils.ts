import type { Point2d } from "@thewaver/ss-utils";

import type { PanZoomView } from "../../../Abstracts/PanZoom/PanZoom.types";
import { PanZoomUtils } from "../../../Abstracts/PanZoom/PanZoom.utils";
import type {
    BracketBox,
    BracketConnectorDefs,
    BracketExtent,
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
/** How much wider than a framed family a view may be and still count as framing it, against rounding. */
const FRAME_SLACK = 1.001;
/** What separates a child's position from its parent's id. */
const ID_SEPARATOR = ".";
/** What `lastIndexOf` answers when the root's id has no separator in it. */
const NOT_FOUND = -1;

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
     * @param step `"to_root"`, `"to_leaves"`, `"next"`, `"previous"`, `"first"` or `"last"`. The last four
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

        if (step === "to_root") return findPlacement(placements, from.parentId)?.id;

        if (step === "to_leaves") {
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
     * @param layout What {@link computeLayout} answered, or any count of layers and rows to size the board for —
     * the family view passes {@link computeFamilyExtent}'s, so the board holds its largest family.
     * @param opts The node size, the two gaps, which way the board runs, which end holds the final, and how thick the
     * strip of layer headers is — `0` when there are none.
     * @returns Everything {@link computeInset}, {@link computeHeaderBox} and {@link computeConnectors} need, and the
     * board's own size: as long as the layers with their gaps between, and as wide as the first round's matches with
     * theirs, plus the header strip.
     */
    export const computeGeometry = (layout: BracketExtent, opts: BracketGeometryOpts): BracketGeometry => {
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
     * its child is on the route from the focused match to the final, and those on the route come last, so a renderer
     * that paints them in order draws the route over any line it crosses rather than under it.
     */
    export const computeConnectors = (
        layout: BracketLayout,
        geometry: BracketGeometry,
        boardId: string,
        focusedId: string | undefined,
    ): BracketConnectorDefs[] => {
        const toPoint = (along: number, across: number): Point2d =>
            geometry.isHorizontal ? { x: along, y: across } : { x: across, y: along };

        const getAnchor = (placement: BracketPlacement, isTowardRoot: boolean) => {
            const inset = computeInset(geometry, placement);
            const along = geometry.isHorizontal ? inset.left : inset.top;
            const across = geometry.isHorizontal ? inset.top : inset.left;

            return toPoint(
                getFacingEdge(along, geometry.layerExtent, geometry.rootSide, isTowardRoot),
                across + geometry.crossExtent * HALF,
            );
        };

        const connectors = layout.placements
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

        return [
            ...connectors.filter((connector) => !connector.isOnFocusedRoute),
            ...connectors.filter((connector) => connector.isOnFocusedRoute),
        ];
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

        if (key === towardRoot) return "to_root";
        if (alongLayers.includes(key)) return "to_leaves";
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

    /**
     * The id of the node one step nearer the root.
     *
     * Ids are paths through the tree, so this is the id with its last position taken off, and nothing has to be
     * looked up.
     *
     * @param id A placement's id.
     * @returns The parent's id, or `undefined` for the root, which has none.
     */
    export const getParentId = (id: string) => {
        const at = id.lastIndexOf(ID_SEPARATOR);

        return at === NOT_FOUND ? undefined : id.slice(NOTHING, at);
    };

    /**
     * Which family the family view shows while a node holds focus, named by the node that family's middle row feeds.
     *
     * The family is three rows: the node the focused one feeds, the focused node with every sibling it has, and every
     * node that feeds any of those siblings. So the node it is named by is the focused node's parent. This is the one
     * place that rule lives; the rest of the family view reads it from here.
     *
     * @param focusedId The node that holds focus, or `undefined` for none.
     * @returns The focused node's parent. `undefined` when nothing is focused or the root is, and both show the
     * root's own family: the root and the nodes that feed it, with no row above, because nothing is.
     */
    export const getFamilyAnchorId = (focusedId: string | undefined) =>
        focusedId === undefined ? undefined : getParentId(focusedId);

    /**
     * The id a node of the consumer's own tree was given by {@link computeLayout}.
     *
     * A family is handed in and out as a node rather than an id, the way the consumer built the tree, so the board
     * has to find which place that node holds. It is found by identity, not by value, because two nodes can carry
     * the same value.
     *
     * @param root The final, as {@link computeLayout} was given it.
     * @param layout What {@link computeLayout} answered for that root.
     * @param node The node to look for, or `undefined`.
     * @returns Its id, or `undefined` when it is `undefined` or not in the tree.
     */
    export const findNodeId = <T>(root: BracketNode<T>, layout: BracketLayout, node: BracketNode<T> | undefined) =>
        node === undefined
            ? undefined
            : layout.placements.find((placement) => findNode(root, placement.id) === node)?.id;

    /**
     * The family one step away from another, for a consumer moving the family view from outside the board.
     *
     * A family is named by the node its middle row feeds, so only a node with children can name one, and the steps
     * walk those nodes alone: `"to_root"` names the family one stage nearer the final, `"to_leaves"` one stage further
     * out, landing on the middle child as the keyboard does, and `"previous"` and `"next"` the neighbor across the
     * same stage, crossing from one branch into the next. The root's own family, `undefined`, sits one stage nearer
     * the final than the one the root names, so `"to_leaves"` from it names the root and `"to_root"` from the root
     * comes back to it.
     *
     * @param root The final, with its feeders as children.
     * @param family The node naming the family on show, or `undefined` for the root's own.
     * @param step Which way to move. `"first"` and `"last"` work across a stage as the keyboard's do.
     * @returns The node naming the family that way, or `family` itself when there is none, so a step that cannot
     * move changes nothing and a caller can compare the two to tell.
     */
    export const computeFamilyStep = <T>(
        root: BracketNode<T>,
        family: BracketNode<T> | undefined,
        step: BracketStep,
    ): BracketNode<T> | undefined => {
        const layout = computeLayout(root);
        const anchors = layout.placements.filter((placement) => placement.childIds.length > NOTHING);
        const fromId = findNodeId(root, layout, family);

        if (fromId === undefined) return step === "to_leaves" && anchors.length > NOTHING ? root : family;
        if (step === "to_root" && fromId === ROOT_ID) return undefined;

        const nextId = computeStepId(step, fromId, anchors);

        return nextId === undefined ? family : findNode(root, nextId);
    };

    /**
     * Whether a node belongs to the family the family view is showing.
     *
     * @param id The node being asked about.
     * @param anchorId What {@link getFamilyAnchorId} answered.
     * @returns `true` for the anchor itself, for its children, and for their children — and, with no anchor, for the
     * root and its children. A row that does not exist simply has no members, so a family whose middle row are all
     * leaves is two rows, and so is the root's.
     */
    export const getIsInFamily = (id: string, anchorId: string | undefined) => {
        const parentId = getParentId(id);

        return (
            id === anchorId || parentId === anchorId || (parentId !== undefined && getParentId(parentId) === anchorId)
        );
    };

    /**
     * The current round: the layer holding the family's middle row.
     *
     * @param layout What {@link computeLayout} answered.
     * @param anchorId What {@link getFamilyAnchorId} answered.
     * @returns The layer below the anchor's, or the root's own layer with no anchor, because the root's family has
     * no row above it and the root is its middle.
     */
    export const getFamilyLayer = (layout: BracketLayout, anchorId: string | undefined) => {
        const anchor = findPlacement(layout.placements, anchorId);

        return anchor ? anchor.layer + 1 : FIRST_LAYER;
    };

    /**
     * Places one family on its own, as though it were the whole tree.
     *
     * @param layout What {@link computeLayout} answered for the whole tree.
     * @param anchorId What {@link getFamilyAnchorId} answered.
     * @returns The family's members only, with the top row at layer `0` and each node centered between the outermost
     * of the members that feed it, exactly as {@link computeLayout} would place a tree that ended at the family's
     * last row. Ids, parent ids and child ids are the whole tree's, so a member can still be matched to its node.
     */
    export const computeFamilyLayout = (layout: BracketLayout, anchorId: string | undefined): BracketLayout => {
        const byId = new Map(layout.placements.map((placement) => [placement.id, placement]));
        const top = byId.get(anchorId ?? ROOT_ID);
        const placements: BracketPlacement[] = [];

        let leafCount = NOTHING;
        let layerCount = NOTHING;

        const walk = (placement: BracketPlacement, layer: number): number => {
            layerCount = Math.max(layerCount, layer + SINGLE);

            const members = placement.childIds.flatMap((childId) => {
                const child = byId.get(childId);

                return child && getIsInFamily(childId, anchorId) ? [child] : [];
            });
            const crosses = members.map((child) => walk(child, layer + SINGLE));
            const cross = crosses.length ? (crosses[NOTHING] + crosses[crosses.length - SINGLE]) * HALF : leafCount++;

            placements.push({ ...placement, layer, cross });

            return cross;
        };

        if (top) walk(top, FIRST_LAYER);

        return { placements: placements.sort(compareByPlace), layerCount, leafCount };
    };

    /**
     * Every family the tree has, each named as {@link getFamilyAnchorId} names it.
     *
     * @param layout What {@link computeLayout} answered.
     * @returns `undefined` for the root's own family, then the id of every match that has matches feeding it, in
     * the layout's order.
     */
    export const getFamilyAnchorIds = (layout: BracketLayout): (string | undefined)[] => [
        undefined,
        ...layout.placements
            .filter((placement) => placement.childIds.length > NOTHING)
            .map((placement) => placement.id),
    ];

    /**
     * How many layers and rows a board needs to hold every family the tree has, laid out on its own.
     *
     * Sizing a window for the largest family rather than the one showing keeps it the same size while focus moves,
     * so nothing on the page around it shifts.
     *
     * @param layout What {@link computeLayout} answered.
     * @returns The most layers and the most rows of any family, to hand to {@link computeGeometry}.
     */
    export const computeFamilyExtent = (layout: BracketLayout): BracketExtent =>
        getFamilyAnchorIds(layout).reduce<BracketExtent>(
            (extent, anchorId) => {
                const family = computeFamilyLayout(layout, anchorId);

                return {
                    layerCount: Math.max(extent.layerCount, family.layerCount),
                    leafCount: Math.max(extent.leafCount, family.leafCount),
                };
            },
            { layerCount: NOTHING, leafCount: NOTHING },
        );

    /**
     * The view that shows the whole board.
     *
     * @param geometry What {@link computeGeometry} answered for the whole tree.
     * @returns The board, corner to corner, in pixels, to hand to the board's `view`.
     */
    export const computeWholeView = (geometry: BracketGeometry): PanZoomView => ({
        x: { start: NOTHING, end: geometry.boardSize.width },
        y: { start: NOTHING, end: geometry.boardSize.height },
    });

    /**
     * The view that frames one family, centered on its middle round.
     *
     * Along the rounds, the view is centered on the family's middle row and reaches as far each way as the family's
     * furthest row, so a family with no row on one side — the root's own, whose middle row is the final itself — is
     * framed with the final in the middle and room to spare where a row would be. Across, it is the box around the
     * family's members and, along the edge the layer headers run on, room for the strip, since the board pins its
     * headers to the window's edge and a header would otherwise sit over the family's first match. The board fits
     * whatever it is handed to its window's shape, so this is the least that has to show rather than exactly what
     * will.
     *
     * @param layout What {@link computeLayout} answered for the whole tree.
     * @param geometry What {@link computeGeometry} answered for the whole tree, with the options the board is given.
     * @param anchorId What {@link getFamilyAnchorId} answered, or {@link findNodeId} for the board's `family`.
     * @param margin The room left around the family, in pixels. None when left out.
     * @returns The area, in board pixels, to hand to the board's `view`. A tree with no nodes answers the whole board.
     */
    export const computeFamilyView = (
        layout: BracketLayout,
        geometry: BracketGeometry,
        anchorId: string | undefined,
        margin = NOTHING,
    ): PanZoomView => {
        const members = layout.placements.filter((placement) => getIsInFamily(placement.id, anchorId));

        if (members.length === NOTHING) return computeWholeView(geometry);

        const alongs = members.map((placement) => getLayerStart(geometry, placement.layer));
        const acrosses = members.map((placement) => getCrossStart(geometry, placement));
        const middle = getLayerStart(geometry, getFamilyLayer(layout, anchorId)) + geometry.layerExtent * HALF;
        const reach =
            Math.max(middle - Math.min(...alongs), Math.max(...alongs) + geometry.layerExtent - middle) + margin;
        const along = { start: middle - reach, end: middle + reach };
        const across = {
            start: Math.min(...acrosses) - margin - geometry.headerExtent,
            end: Math.max(...acrosses) + geometry.crossExtent + margin,
        };

        return geometry.isHorizontal ? { x: along, y: across } : { x: across, y: along };
    };

    /**
     * Which family a view is showing, if any.
     *
     * The family whose own view, from {@link computeFamilyView}, has its middle nearest the middle of this one. So the
     * family follows whatever the window is centered on, at any zoom — a window over the final shows the final's
     * family however far in it is zoomed, and one over a pair of entrants shows that pair's — and a view framed on a
     * family reads back as that family. A view wider than every family's own view, fitted to the window's shape, is
     * framing no family at all.
     *
     * @param layout What {@link computeLayout} answered for the whole tree.
     * @param geometry What {@link computeGeometry} answered for the whole tree, with the options the board is given.
     * @param view The view, in board pixels. It is fitted to the window's shape first, as the board would fit it.
     * @param aspect The window's height divided by its width.
     * @param margin The room each family is framed with, as {@link computeFamilyView} takes it.
     * @returns The family in view, named as {@link getFamilyAnchorId} names it, or `undefined` when the view is wider
     * than any family.
     */
    export const computeFamilyInView = (
        layout: BracketLayout,
        geometry: BracketGeometry,
        view: PanZoomView,
        aspect: number,
        margin = NOTHING,
    ): { anchorId: string | undefined } | undefined => {
        const shown = PanZoomUtils.fitView(view, aspect);
        const families = getFamilyAnchorIds(layout).map((anchorId) => ({
            anchorId,
            view: PanZoomUtils.fitView(computeFamilyView(layout, geometry, anchorId, margin), aspect),
        }));
        const widest = Math.max(...families.map((family) => PanZoomUtils.getExtent(family.view.x)));

        if (PanZoomUtils.getExtent(shown.x) > widest * FRAME_SLACK) return undefined;

        const getMiddle = (area: PanZoomView) => ({
            x: (area.x.start + area.x.end) * HALF,
            y: (area.y.start + area.y.end) * HALF,
        });
        const middle = getMiddle(shown);

        const getDistance = (area: PanZoomView) => {
            const center = getMiddle(area);

            return Math.hypot(center.x - middle.x, center.y - middle.y);
        };

        const nearest = families.reduce((found, family) =>
            getDistance(family.view) < getDistance(found.view) ? family : found,
        );

        return { anchorId: nearest.anchorId };
    };
}
