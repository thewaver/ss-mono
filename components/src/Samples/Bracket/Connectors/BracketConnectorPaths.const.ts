import type { Point2d } from "@thewaver/ss-utils";

import type { BracketConnectorDefs } from "../../../Exotics/Bracket/Bracket.types";
import type { BracketConnectorPathFn } from "./BracketConnectors.types";

const HALF = 0.5;
const NOTHING = 0;

const getAlong = (point: Point2d, defs: BracketConnectorDefs) =>
    defs.orientation === "horizontal" ? point.x : point.y;

const getAcross = (point: Point2d, defs: BracketConnectorDefs) =>
    defs.orientation === "horizontal" ? point.y : point.x;

const at = (along: number, across: number, defs: BracketConnectorDefs) =>
    defs.orientation === "horizontal" ? `${along} ${across}` : `${across} ${along}`;

export namespace BracketConnectorPaths {
    export const getSpine = (defs: BracketConnectorDefs) =>
        (getAlong(defs.from, defs) + getAlong(defs.to, defs)) * HALF;

    export const elbow: BracketConnectorPathFn = (defs) => {
        const spine = getSpine(defs);
        const fromAcross = getAcross(defs.from, defs);
        const toAcross = getAcross(defs.to, defs);

        return [
            `M ${at(getAlong(defs.from, defs), fromAcross, defs)}`,
            `L ${at(spine, fromAcross, defs)}`,
            `L ${at(spine, toAcross, defs)}`,
            `L ${at(getAlong(defs.to, defs), toAcross, defs)}`,
        ].join(" ");
    };

    export const roundedElbow: BracketConnectorPathFn = (defs, radius) => {
        const spine = getSpine(defs);
        const fromAlong = getAlong(defs.from, defs);
        const toAlong = getAlong(defs.to, defs);
        const fromAcross = getAcross(defs.from, defs);
        const toAcross = getAcross(defs.to, defs);
        const drop = toAcross - fromAcross;

        if (Math.abs(drop) < NOTHING + 1) return elbow(defs, radius);

        const bend = Math.min(radius, Math.abs(spine - fromAlong), Math.abs(toAlong - spine), Math.abs(drop) * HALF);
        const alongStep = Math.sign(spine - fromAlong) * bend;
        const acrossStep = Math.sign(drop) * bend;

        return [
            `M ${at(fromAlong, fromAcross, defs)}`,
            `L ${at(spine - alongStep, fromAcross, defs)}`,
            `Q ${at(spine, fromAcross, defs)} ${at(spine, fromAcross + acrossStep, defs)}`,
            `L ${at(spine, toAcross - acrossStep, defs)}`,
            `Q ${at(spine, toAcross, defs)} ${at(spine + alongStep, toAcross, defs)}`,
            `L ${at(toAlong, toAcross, defs)}`,
        ].join(" ");
    };

    export const curve: BracketConnectorPathFn = (defs) => {
        const spine = getSpine(defs);
        const fromAcross = getAcross(defs.from, defs);
        const toAcross = getAcross(defs.to, defs);

        return [
            `M ${at(getAlong(defs.from, defs), fromAcross, defs)}`,
            `C ${at(spine, fromAcross, defs)} ${at(spine, toAcross, defs)} ${at(getAlong(defs.to, defs), toAcross, defs)}`,
        ].join(" ");
    };

    export const ALL: Record<string, BracketConnectorPathFn> = { elbow, roundedElbow, curve };
}
