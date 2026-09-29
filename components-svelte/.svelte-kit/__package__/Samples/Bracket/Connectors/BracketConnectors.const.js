import { BracketConnectorPaths } from "@thewaver/ss-components";
import { markup } from "../../../Utils/markupUtils.js";
import BracketConnectorElement from "./BracketConnectorElement.svelte";
const ARROW_LENGTH = 9;
const ARROW_HALF_WIDTH = 5;
const BALL_RADIUS = 4;
const HALF = 0.5;
const getArrowPoints = (tip, spine, defs) => {
    const isHorizontal = defs.orientation === "horizontal";
    const along = isHorizontal ? Math.sign(tip.x - spine.x) : Math.sign(tip.y - spine.y);
    const back = {
        x: isHorizontal ? tip.x - along * ARROW_LENGTH : tip.x,
        y: isHorizontal ? tip.y : tip.y - along * ARROW_LENGTH,
    };
    const wing = isHorizontal
        ? [
            { x: back.x, y: back.y - ARROW_HALF_WIDTH },
            { x: back.x, y: back.y + ARROW_HALF_WIDTH },
        ]
        : [
            { x: back.x - ARROW_HALF_WIDTH, y: back.y },
            { x: back.x + ARROW_HALF_WIDTH, y: back.y },
        ];
    return [tip, ...wing].map((point) => `${point.x},${point.y}`).join(" ");
};
const strokeOnly = (build) => (paint) => markup(BracketConnectorElement, { paint, d: build(paint.defs, paint.radius) });
export var BracketConnectors;
(function (BracketConnectors) {
    BracketConnectors.flat = strokeOnly(BracketConnectorPaths.elbow);
    BracketConnectors.rounded = strokeOnly(BracketConnectorPaths.roundedElbow);
    BracketConnectors.curved = strokeOnly(BracketConnectorPaths.curve);
    BracketConnectors.ballAndArrow = (paint) => {
        const spine = BracketConnectorPaths.getSpine(paint.defs);
        const isHorizontal = paint.defs.orientation === "horizontal";
        const elbowTip = {
            x: isHorizontal ? spine : paint.defs.from.x,
            y: isHorizontal ? paint.defs.from.y : spine,
        };
        return markup(BracketConnectorElement, {
            paint,
            d: BracketConnectorPaths.roundedElbow(paint.defs, paint.radius),
            tips: {
                ballRadius: BALL_RADIUS + paint.width * HALF,
                arrowPoints: getArrowPoints(paint.defs.from, elbowTip, paint.defs),
            },
        });
    };
    BracketConnectors.SAMPLE_CONNECTORS = { flat: BracketConnectors.flat, rounded: BracketConnectors.rounded, curved: BracketConnectors.curved, ballAndArrow: BracketConnectors.ballAndArrow };
    BracketConnectors.SAMPLE_KEYS = Object.keys(BracketConnectors.SAMPLE_CONNECTORS);
})(BracketConnectors || (BracketConnectors = {}));
