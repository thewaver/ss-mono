import { AnchorUtils } from "@thewaver/ss-components";
import type { AnchorPlacement } from "@thewaver/ss-components";
import { MathUtils, type Point2d, type ShapeArrowAim, ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { ARROW_BED_CHAMFER_RATIO, ARROW_BED_GAP, type ArrowBedShape, CIRCLING_CORE_RATIO } from "./TooltipPage.const";

const ORIGIN: Point2d = { x: 0, y: 0 };

const toAnchorOffset = (placement: string, extent: number) => {
    if (placement.endsWith("_out")) {
        return placement === "left_out" || placement === "top_out" ? extent + ARROW_BED_GAP : -(extent + ARROW_BED_GAP);
    }

    return 0;
};

export const computeArrowBedAim = (placement: AnchorPlacement, size: Size2d) =>
    AnchorUtils.computeArrowAim(
        placement,
        {
            x: toAnchorOffset(placement.x, size.width),
            y: toAnchorOffset(placement.y, size.height),
            width: size.width,
            height: size.height,
        },
        ORIGIN,
        size,
    );

export const computeArrowBedPoints = (shape: ArrowBedShape, size: Size2d): Point2d[] => {
    if (shape !== "octagon") return ShapeConst.getDefaultShapePoints("square", size);

    const chamfer = Math.min(size.width, size.height) * ARROW_BED_CHAMFER_RATIO;

    return [
        { x: chamfer, y: 0 },
        { x: size.width - chamfer, y: 0 },
        { x: size.width, y: chamfer },
        { x: size.width, y: size.height - chamfer },
        { x: size.width - chamfer, y: size.height },
        { x: chamfer, y: size.height },
        { x: 0, y: size.height - chamfer },
        { x: 0, y: chamfer },
    ];
};

export const computeCirclingAim = (degrees: number, size: Size2d): ShapeArrowAim => {
    const radians = (degrees * Math.PI) / 180;
    const direction = { x: Math.cos(radians), y: Math.sin(radians) };
    const half = { x: size.width * 0.5, y: size.height * 0.5 };
    const reach = Math.min(
        Math.abs(direction.x) > 0 ? half.x / Math.abs(direction.x) : Infinity,
        Math.abs(direction.y) > 0 ? half.y / Math.abs(direction.y) : Infinity,
    );
    const point = { x: half.x + direction.x * reach, y: half.y + direction.y * reach };
    const inset = Math.min(size.width, size.height) * CIRCLING_CORE_RATIO;
    const core = {
        x: MathUtils.clamp(point.x, inset, size.width - inset),
        y: MathUtils.clamp(point.y, inset, size.height - inset),
    };

    return { point, angle: (Math.atan2(point.y - core.y, point.x - core.x) * 180) / Math.PI };
};
