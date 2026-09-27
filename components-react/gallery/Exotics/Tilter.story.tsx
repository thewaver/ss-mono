import { Tilter } from "../../src";

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => (
    <div data-testid="frame" style={{ width: 200, height: 100, margin: 200 }}>
        <Tilter
            maxTiltDegrees={20}
            isDisabled={isDisabled}
            renderSheen={(state) => (
                <div
                    data-testid="sheen"
                    data-resting={String(state.isResting)}
                    data-strength={state.strength.toFixed(2)}
                    data-position={state.sheenPosition.toFixed(1)}
                />
            )}
        >
            <div data-testid="surface" style={{ width: 200, height: 100, background: "#88c" }} />
        </Tilter>
    </div>
);

export const Bare = () => (
    <div data-testid="frame" style={{ width: 200, height: 100, margin: 200 }}>
        <Tilter>
            <div data-testid="surface" style={{ width: 200, height: 100 }} />
        </Tilter>
    </div>
);
