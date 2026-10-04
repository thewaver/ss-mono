import { EasingUtils, MathUtils, type Point2d } from "@thewaver/ss-utils";

import type {
    BracketArrangement,
    BracketBox,
    BracketConnectorDefs,
    BracketExtent,
    BracketFrame,
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
/** What `lastIndexOf` answers when the root's id has no separator in it. */
const NOT_FOUND = -1;
/** Fully drawn, as an opacity and as a glide's progress. */
const SHOWN = 1;

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
     * @param frames Where each match is drawn right now, when that is not where the layout puts it — the family
     * view's {@link computeShownArrangement}, mid-glide or settled. Left out, every match is where
     * {@link computeInset} puts it.
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
        frames?: Record<string, BracketFrame>,
    ): BracketConnectorDefs[] => {
        const toPoint = (along: number, across: number): Point2d =>
            geometry.isHorizontal ? { x: along, y: across } : { x: across, y: along };

        const getAnchor = (placement: BracketPlacement, isTowardRoot: boolean) => {
            const inset = frames?.[placement.id] ?? computeInset(geometry, placement);
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
     * The family member a node outside the family is folded onto.
     *
     * A node folds onto the nearest member on its way to the root, so whatever hangs below the family's last row
     * gathers on the node it feeds. A node with no member on its way to the root — the anchor's own parent, or a
     * cousin's branch — gathers on the anchor, the top of the family.
     *
     * @param id The node to fold.
     * @param anchorId What {@link getFamilyAnchorId} answered.
     * @returns The node's own id when it is a member, which is where it stays.
     */
    export const getFoldId = (id: string, anchorId: string | undefined) => {
        for (let current: string | undefined = id; current !== undefined; current = getParentId(current)) {
            if (getIsInFamily(current, anchorId)) return current;
        }

        return anchorId ?? ROOT_ID;
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
     * How many layers and rows the family view's board needs to hold every family the tree has.
     *
     * Sizing the board for the largest family rather than the one showing keeps it the same size while focus moves,
     * so nothing on the page around it shifts.
     *
     * @param layout What {@link computeLayout} answered.
     * @returns The most layers and the most rows of any family, to hand to {@link computeGeometry}.
     */
    export const computeFamilyExtent = (layout: BracketLayout): BracketExtent => {
        const anchors = [
            undefined,
            ...layout.placements
                .filter((placement) => placement.childIds.length > NOTHING)
                .map((placement) => placement.id),
        ];

        return anchors.reduce<BracketExtent>(
            (extent, anchorId) => {
                const family = computeFamilyLayout(layout, anchorId);

                return {
                    layerCount: Math.max(extent.layerCount, family.layerCount),
                    leafCount: Math.max(extent.leafCount, family.leafCount),
                };
            },
            { layerCount: NOTHING, leafCount: NOTHING },
        );
    };

    /**
     * Where every node and every layer header sits while one family shows.
     *
     * @param layout What {@link computeLayout} answered for the whole tree.
     * @param geometry What {@link computeGeometry} answered for {@link computeFamilyExtent}'s extent.
     * @param extent What {@link computeFamilyExtent} answered.
     * @param anchorId What {@link getFamilyAnchorId} answered.
     * @returns A frame per node id and one per layer of the whole tree. Members are drawn where
     * {@link computeFamilyLayout} puts them, centered across the board when the family is narrower than it, and every
     * other node sits on the member {@link getFoldId} names with nothing drawn. A header shows when its layer is one
     * of the family's rows and sits over it; any other header sits over the nearest row, with nothing drawn.
     */
    export const computeFamilyArrangement = (
        layout: BracketLayout,
        geometry: BracketGeometry,
        extent: BracketExtent,
        anchorId: string | undefined,
    ): BracketArrangement => {
        const family = computeFamilyLayout(layout, anchorId);
        const baseLayer = findPlacement(layout.placements, anchorId ?? ROOT_ID)?.layer ?? FIRST_LAYER;
        const shift = (extent.leafCount - family.leafCount) * HALF;
        const insets = new Map(
            family.placements.map((placement) => [
                placement.id,
                computeInset(geometry, { ...placement, cross: placement.cross + shift }),
            ]),
        );
        const lastSlot = Math.max(FIRST_LAYER, extent.layerCount - SINGLE);

        const nodes = Object.fromEntries(
            layout.placements.map((placement): [string, BracketFrame] => {
                const inset = insets.get(placement.id);

                if (inset) return [placement.id, { ...inset, opacity: SHOWN, isFolded: false }];

                const fold = insets.get(getFoldId(placement.id, anchorId)) ?? { left: NOTHING, top: NOTHING };

                return [placement.id, { ...fold, opacity: NOTHING, isFolded: true }];
            }),
        );

        const headers = Array.from({ length: layout.layerCount }, (_unused, layer): BracketFrame => {
            const slot = layer - baseLayer;
            const isShown = slot >= FIRST_LAYER && slot < family.layerCount;
            const box = computeHeaderBox(geometry, MathUtils.clamp(slot, FIRST_LAYER, lastSlot));

            return { left: box.left, top: box.top, opacity: isShown ? SHOWN : NOTHING, isFolded: !isShown };
        });

        return { nodes, headers };
    };

    /**
     * Where everything is drawn partway through a glide from one arrangement to another.
     *
     * @param from Where the glide began — what was on screen at that moment, even if that was itself partway through
     * another glide. `undefined` before the first glide.
     * @param to What {@link computeFamilyArrangement} answered for the family now showing.
     * @param progress How far through the glide's time, `0` to `1`.
     * @returns Every frame moved and faded along the way between its two ends, slow at the start and the finish and
     * fastest in the middle. Whether a frame is folded takes its new value as the glide starts, whatever its opacity
     * is doing, so focus and a screen reader never wait for the picture. A frame `from` does not have appears where
     * it is going. `to` itself once the glide has finished.
     */
    export const computeShownArrangement = (
        from: BracketArrangement | undefined,
        to: BracketArrangement,
        progress: number,
    ): BracketArrangement => {
        if (from === undefined || progress >= SHOWN) return to;

        const ratio = EasingUtils.easeInOutCubic(progress);

        const blend = (start: BracketFrame | undefined, end: BracketFrame): BracketFrame =>
            start === undefined
                ? end
                : {
                      left: MathUtils.lerp(start.left, end.left, ratio),
                      top: MathUtils.lerp(start.top, end.top, ratio),
                      opacity: MathUtils.lerp(start.opacity, end.opacity, ratio),
                      isFolded: end.isFolded,
                  };

        return {
            nodes: Object.fromEntries(
                Object.entries(to.nodes).map(([id, frame]) => [id, blend(from.nodes[id], frame)]),
            ),
            headers: to.headers.map((frame, layer) => blend(from.headers[layer], frame)),
        };
    };

    /**
     * Whether a node or a header is taken out of the picture altogether, rather than merely faded.
     *
     * A frame unfolding starts its glide fully faded, and the moment the glide starts is the moment the keyboard
     * moves focus onto it, so hiding everything faded would leave focus with nowhere to land. Only a frame that
     * is folded and has finished fading out is hidden.
     *
     * @param frame Where it is drawn right now, or `undefined` outside the family view.
     * @returns `true` only for a folded frame drawn at no opacity at all.
     */
    export const getIsFrameHidden = (frame: BracketFrame | undefined) =>
        frame !== undefined && frame.isFolded && frame.opacity <= NOTHING;

    /**
     * How much of a connector to draw while the family view folds and unfolds.
     *
     * @param frames Where each node is drawn right now.
     * @param connector The connector.
     * @returns The fainter of its two ends' opacities, so a line is only fully drawn between two members, and is
     * gone whenever either end is folded away. A node with no frame counts as fully drawn.
     */
    export const computeConnectorOpacity = (frames: Record<string, BracketFrame>, connector: BracketConnectorDefs) =>
        Math.min(frames[connector.parentId]?.opacity ?? SHOWN, frames[connector.childId]?.opacity ?? SHOWN);
}
