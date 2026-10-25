import { useState } from "react";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FAR_DOWN_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";

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
            renderContent={(flags) => <PageButtonContent flags={flags}>{props.caption}</PageButtonContent>}
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
    const [answer, setAnswer] = useState<ShowAnswer>();

    return (
        <div className={styles.example}>
            <div className={styles.raiseRow}>
                <Toasts<ToastDefs>
                    ariaLabel={"Profile notifications"}
                    alignment={"middle_center"}
                    renderToast={(toast, visibilityTarget, transitionDurationMs, state, dismiss) => (
                        <PageToastContent
                            toast={toast}
                            state={state}
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                            onDismiss={dismiss}
                        />
                    )}
                >
                    <SettingsPanel onAnswer={setAnswer} />
                </Toasts>

                <SaveButton id={"farDownOutside"} caption={"Save outside"} onAnswer={setAnswer} />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`show answered: ${answer === undefined ? "nothing yet" : (answer.id ?? "undefined")}`}
            </div>
        </div>
    );
};
