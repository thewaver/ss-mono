import { useState } from "react";

import type { MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { ImageMosaic } from "../../src";

const EXTENT = 380;
const GAP = 6;
const HUE_STEP = 37;
const HUE_ORIGIN = 190;

const SHAPES: Size2d[] = [
    { width: 1600, height: 900 },
    { width: 900, height: 1600 },
    { width: 1200, height: 1200 },
    { width: 1500, height: 1000 },
    { width: 1000, height: 1500 },
    { width: 2000, height: 800 },
    { width: 800, height: 1000 },
    { width: 1400, height: 1050 },
    { width: 1050, height: 1400 },
    { width: 1800, height: 750 },
    { width: 960, height: 960 },
    { width: 1100, height: 1650 },
];

const TARGET_SHAPES: Record<string, Size2d> = {
    square: { width: 1, height: 1 },
    landscape: { width: 16, height: 9 },
    portrait: { width: 9, height: 16 },
    panorama: { width: 3, height: 1 },
};

const toSvg = (shape: Size2d, hue: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${shape.width}" height="${shape.height}"><rect width="${shape.width}" height="${shape.height}" fill="hsl(${hue} 55% 48%)"/></svg>`;

const SOURCES: MosaicImageSource[] = SHAPES.map((shape, index) => ({
    src: `data:image/svg+xml,${encodeURIComponent(toSvg(shape, HUE_ORIGIN + index * HUE_STEP))}`,
    alt: `Sample ${index + 1}, ${shape.width} by ${shape.height}`,
}));

export const Default = ({
    sizeAnchor,
    isDecorated = false,
    isWalked = false,
}: {
    sizeAnchor?: MosaicSizeAnchor;
    isDecorated?: boolean;
    isWalked?: boolean;
}) => {
    const [shapeKey, setShapeKey] = useState("square");
    const [activations, setActivations] = useState<number[]>([]);

    const walkProps = isWalked
        ? { ariaLabel: "Pictures", onActivate: (index: number) => setActivations((prev) => [...prev, index]) }
        : {};

    return (
        <>
            <label>
                Target shape
                <select value={shapeKey} onChange={(e) => setShapeKey(e.target.value)}>
                    {Object.keys(TARGET_SHAPES).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
            </label>
            <output data-testid="gap">{GAP}</output>
            <div data-frame style={{ width: EXTENT, height: EXTENT }}>
                <ImageMosaic
                    {...walkProps}
                    sources={SOURCES}
                    gap={GAP}
                    sizeAnchor={sizeAnchor}
                    targetAspectRatio={TARGET_SHAPES[shapeKey]}
                    renderItem={
                        isDecorated
                            ? (renderImage, state) => (
                                  <a href="#mosaic" style={{ position: "relative" }}>
                                      {renderImage()}
                                      <span style={{ position: "absolute", left: 4, bottom: 4 }}>
                                          {`${state.readingIndex + 1} of ${state.itemCount}`}
                                      </span>
                                  </a>
                              )
                            : undefined
                    }
                />
            </div>
            <output data-readout="activations">{activations.join(",")}</output>
        </>
    );
};
