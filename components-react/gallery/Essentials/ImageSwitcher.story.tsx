import { useState } from "react";

import knightDate from "../../../playground-core/src/App/knight_date.webp";
import knightProfile from "../../../playground-core/src/App/knight_profile.webp";
import { ImageSwitcher } from "../../src";

const SOURCES: Record<string, string | undefined> = {
    profile: knightProfile,
    date: knightDate,
    missingFile: "/missing_image.webp",
    none: undefined,
};

export const Default = ({ transitionDurationMs }: { transitionDurationMs?: number }) => {
    const [sourceName, setSourceName] = useState("profile");
    const [loads, setLoads] = useState<string[]>([]);

    return (
        <>
            <label>
                Source
                <select value={sourceName} onChange={(e) => setSourceName(e.target.value)}>
                    {Object.keys(SOURCES).map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </label>
            <div data-testid="frame" style={{ width: 200, height: 200 }}>
                <ImageSwitcher
                    src={SOURCES[sourceName]}
                    alt="A knight"
                    transitionDurationMs={transitionDurationMs}
                    onLoad={function () {
                        const src = (this as HTMLImageElement).src;

                        setLoads((prev) => [...prev, src.split("/").pop() ?? ""]);
                    }}
                />
            </div>
            <output data-readout="loads">{`loads: ${loads.length}; last: ${loads.at(-1) ?? "none"}`}</output>
        </>
    );
};
