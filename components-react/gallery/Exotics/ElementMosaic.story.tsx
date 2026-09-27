import { useState } from "react";

import type { MosaicItemState, MosaicSizeAnchor } from "@thewaver/ss-components";

import { ElementMosaic } from "../../src";

const EXTENT = 380;
const PICKED_GROWTH = 1.5;
const GLIDE_MS = 200;

const TILES = [
    { name: "Aurora", width: 150, height: 90 },
    { name: "Basalt", width: 90, height: 140 },
    { name: "Cinder", width: 120, height: 60 },
    { name: "Drift", width: 70, height: 70 },
    { name: "Ember", width: 190, height: 50 },
    { name: "Fathom", width: 100, height: 110 },
    { name: "Glimmer", width: 60, height: 160 },
    { name: "Hollow", width: 140, height: 80 },
    { name: "Iris", width: 80, height: 100 },
    { name: "Jetty", width: 110, height: 130 },
    { name: "Kelp", width: 160, height: 70 },
    { name: "Loam", width: 50, height: 90 },
];

type Tile = (typeof TILES)[number];

const TilePainter = ({ tile, state, growth = 1 }: { tile: Tile; state: MosaicItemState; growth?: number }) => (
    <div style={{ width: tile.width * growth, height: tile.height * growth, background: "#ddd", overflow: "hidden" }}>
        <div data-name>{tile.name}</div>
        <div>{`reads ${state.readingIndex + 1} of ${state.itemCount}`}</div>
    </div>
);

export const Default = ({ sizeAnchor }: { sizeAnchor?: MosaicSizeAnchor }) => {
    const [gap, setGap] = useState(8);
    const [itemCount, setItemCount] = useState(TILES.length);

    return (
        <>
            <input
                aria-label="Gap"
                data-testid="gap"
                type="number"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
            />
            <input
                aria-label="Item count"
                data-testid="itemCount"
                type="number"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
            />
            <div data-frame style={{ width: EXTENT, height: EXTENT }}>
                <ElementMosaic
                    items={TILES.slice(0, itemCount)}
                    gap={gap}
                    sizeAnchor={sizeAnchor}
                    renderItem={(tile, state) => <TilePainter tile={tile} state={state} />}
                />
            </div>
        </>
    );
};

export const Walked = () => {
    const [pickedNames, setPickedNames] = useState<string[]>([]);
    const [activations, setActivations] = useState<number[]>([]);

    return (
        <>
            <div data-frame style={{ width: EXTENT }}>
                <ElementMosaic
                    items={TILES}
                    gap={8}
                    transitionDurationMs={GLIDE_MS}
                    ariaLabel="Tiles"
                    onActivate={(index) => {
                        const name = TILES[index].name;

                        setActivations((prev) => [...prev, index]);
                        setPickedNames((prev) =>
                            prev.includes(name) ? prev.filter((picked) => picked !== name) : [...prev, name],
                        );
                    }}
                    renderItem={(tile, state) => (
                        <TilePainter
                            tile={tile}
                            state={state}
                            growth={pickedNames.includes(tile.name) ? PICKED_GROWTH : 1}
                        />
                    )}
                />
            </div>
            <output data-readout="activations">{activations.join(",")}</output>
        </>
    );
};
