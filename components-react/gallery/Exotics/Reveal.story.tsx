import { Reveal } from "../../src";

const STEP_SIZE = 20;

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => (
    <>
        <button type="button" data-testid="before">
            Before
        </button>
        <div style={{ width: 400, height: 200, margin: 40 }} data-step={STEP_SIZE}>
            <Reveal
                ariaLabel="Hidden picture"
                radius={40}
                stepSize={STEP_SIZE}
                isDisabled={isDisabled}
                renderContent={() => <div style={{ width: 400, height: 200, background: "#fc0" }}>Underneath</div>}
                renderCover={(isRevealing, maskStyle) => (
                    <div
                        data-testid="cover"
                        data-revealing={String(isRevealing)}
                        style={{ width: "100%", height: "100%", background: "#222", ...maskStyle }}
                    />
                )}
            />
        </div>
        <button type="button" data-testid="after">
            After
        </button>
    </>
);
