import type { BracketNode, BracketOrientation } from "@thewaver/ss-components";

import { Bracket } from "../../src";
import { BracketConnectors } from "../../src/Samples/Bracket/Connectors/BracketConnectors.const";

const CONNECTOR_RADIUS = 14;
const CONNECTOR_WIDTH = 2;
const ROUTE_CONNECTOR_WIDTH = 3;
const CONNECTOR_COLORS = { from: "rgb(120, 120, 120)", to: "rgb(180, 180, 180)" };
const ROUTE_COLORS = { from: "rgb(200, 40, 40)", to: "rgb(240, 120, 40)" };
const HOST_STYLE = { padding: "12px" };

const seed = (value: string): BracketNode<string> => ({ value });

const branch = (value: string, ...children: BracketNode<string>[]): BracketNode<string> => ({ value, children });

const DRAW = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

export const Boards = ({ orientation = "horizontal" }: { orientation?: BracketOrientation }) => (
    <>
        {BracketConnectors.SAMPLE_KEYS.map((key) => (
            <div key={key} data-connector={key} style={HOST_STYLE}>
                <Bracket<string>
                    root={DRAW}
                    orientation={orientation}
                    nodeSize={{ width: 96, height: 34 }}
                    ariaLabel={`Knockout draw joined by the ${key} connector`}
                    renderNode={(node) => <div className="node">{node.value}</div>}
                    renderConnector={(defs) =>
                        BracketConnectors.SAMPLE_CONNECTORS[key]({
                            defs,
                            radius: CONNECTOR_RADIUS,
                            width: defs.isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
                            fromColor: defs.isOnFocusedRoute ? ROUTE_COLORS.from : CONNECTOR_COLORS.from,
                            toColor: defs.isOnFocusedRoute ? ROUTE_COLORS.to : CONNECTOR_COLORS.to,
                        })
                    }
                />
            </div>
        ))}
    </>
);
