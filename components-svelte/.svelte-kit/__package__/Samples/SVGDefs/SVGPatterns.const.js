import { SVGPatternLayouts } from "@thewaver/ss-components";
import { SVGPatternDefsSvelteUtils } from "../../Generators/SVGDefs/SVGPatterns/SVGPatternDefsSvelte.utils.js";
export var SVGPatterns;
(function (SVGPatterns) {
    SVGPatterns.computeLayoutPattern = (kind, id, requestedCellCount, cellSize, renderCell) => {
        const layout = SVGPatternLayouts.ALL[kind];
        const cellCount = layout.computeCellCount(requestedCellCount);
        return SVGPatternDefsSvelteUtils.computePattern(id, cellCount, layout.computePatternSize(cellCount, cellSize), (index) => layout.computeCellPos(index, cellSize), (cellId, index, count) => renderCell(cellId, index, count, layout.computeIsSplit(index, count)));
    };
    SVGPatterns.computeGridPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("grid", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeDiagonalPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("diagonal", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeHalfShiftPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("halfShift", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeHalfDropPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("halfDrop", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeTrianglePattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("triangle", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeTriangleSidewaysPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("triangleSideways", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeHexPointyTopPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("hexPointyTop", id, cellCount, cellSize, renderCell);
    SVGPatterns.computeHexFlatTopPattern = (id, cellCount, cellSize, renderCell) => SVGPatterns.computeLayoutPattern("hexFlatTop", id, cellCount, cellSize, renderCell);
})(SVGPatterns || (SVGPatterns = {}));
