import type { BracketLayout, BracketNode, BracketPlacement, BracketRootSide, BracketStep } from "./Bracket.types";

const ROOT_ID = "0";
const FIRST_LAYER = 0;
const NOTHING = 0;
const SINGLE = 1;
const HALF = 0.5;

export namespace BracketUtils {
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

    export const getFacingEdge = (
        layerStart: number,
        layerExtent: number,
        rootSide: BracketRootSide,
        isTowardRoot: boolean,
    ) => layerStart + ((rootSide === "start") !== isTowardRoot ? layerExtent : NOTHING);

    export const compareByPlace = (first: BracketPlacement, second: BracketPlacement) =>
        first.layer - second.layer || first.cross - second.cross;

    export const findPlacement = (placements: BracketPlacement[], id: string | undefined) =>
        placements.find((placement) => placement.id === id);

    export const getLayerPlacements = (placements: BracketPlacement[], layer: number) =>
        placements.filter((placement) => placement.layer === layer).sort(compareByPlace);

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
