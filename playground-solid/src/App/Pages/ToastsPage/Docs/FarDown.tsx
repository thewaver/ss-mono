import { createSignal } from "solid-js";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FAR_DOWN_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";

const DURATION_MS = 4000;

type ShowAnswer = {
    id: string | undefined;
};

type SaveButtonProps = {
    id: string;
    caption: string;
    onAnswer: (answer: ShowAnswer) => void;
};

const SaveButton = (props: SaveButtonProps) => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <Button
            id={props.id}
            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>{props.caption}</PageButtonContent>}
            onClick={() => {
                props.onAnswer({
                    id: toasts.show({
                        value: { kind: "success", message: FAR_DOWN_MESSAGE },
                        announcement: FAR_DOWN_MESSAGE,
                        durationMs: DURATION_MS,
                    }),
                });
            }}
        />
    );
};

const ProfileForm = (props: Pick<SaveButtonProps, "onAnswer">) => (
    <SaveButton id={"farDownInside"} caption={"Save inside"} onAnswer={props.onAnswer} />
);

const SettingsPanel = (props: Pick<SaveButtonProps, "onAnswer">) => <ProfileForm onAnswer={props.onAnswer} />;

export const FarDownDocsExample = () => {
    const [getAnswer, setAnswer] = createSignal<ShowAnswer>();

    return (
        <div class={styles.example}>
            <div class={styles.raiseRow}>
                <Toasts<ToastDefs>
                    ariaLabel={"Profile notifications"}
                    alignment={"middle_center"}
                    renderToast={(getToast, getVisibilityTarget, getTransitionDurationMs, getState, dismiss) => (
                        <PageToastContent
                            toast={getToast}
                            state={getState}
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                            onDismiss={dismiss}
                        />
                    )}
                >
                    <SettingsPanel onAnswer={setAnswer} />
                </Toasts>

                <SaveButton id={"farDownOutside"} caption={"Save outside"} onAnswer={setAnswer} />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`show answered: ${getAnswer() === undefined ? "nothing yet" : (getAnswer()?.id ?? "undefined")}`}
            </div>
        </div>
    );
};
