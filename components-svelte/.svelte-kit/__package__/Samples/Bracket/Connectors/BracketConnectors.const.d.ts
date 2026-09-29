import type { BracketConnectorFn } from "./BracketConnectorsSvelte.types.js";
export declare namespace BracketConnectors {
    const flat: BracketConnectorFn;
    const rounded: BracketConnectorFn;
    const curved: BracketConnectorFn;
    const ballAndArrow: BracketConnectorFn;
    const SAMPLE_CONNECTORS: {
        flat: BracketConnectorFn;
        rounded: BracketConnectorFn;
        curved: BracketConnectorFn;
        ballAndArrow: BracketConnectorFn;
    };
    type SampleKey = keyof typeof SAMPLE_CONNECTORS;
    const SAMPLE_KEYS: SampleKey[];
}
