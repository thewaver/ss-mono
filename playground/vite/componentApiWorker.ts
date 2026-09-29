import { parentPort, workerData } from "node:worker_threads";

import { type ApiGroup, type ApiReader, type ComponentApiOptions, createApiSession } from "./componentApiBuild.ts";

export type ApiWorkerData = {
    entryFile: string;
    coreEntry: string;
    utilsEntry: string;
    options: ComponentApiOptions;
};

export type ApiWorkerRequest =
    { kind: "build"; generation: number; changedFiles: string[] } | { kind: "prioritize"; unit: string };

export type ApiWorkerReport =
    | { kind: "units"; generation: number; units: string[] }
    | { kind: "unit"; generation: number; unit: string; groups: ApiGroup[] }
    | { kind: "done"; generation: number };

type Run = {
    generation: number;
    reader: ApiReader;
    queue: string[];
};

const { entryFile, coreEntry, utilsEntry, options } = workerData as ApiWorkerData;

const session = createApiSession(entryFile, coreEntry, utilsEntry, options);

const report = (message: ApiWorkerReport) => parentPort!.postMessage(message);

let pending: { generation: number; changedFiles: string[] } | undefined;
let run: Run | undefined;
let isScheduled = false;

const step = () => {
    isScheduled = false;

    if (pending) {
        const { generation, changedFiles } = pending;
        const reader = session.open(changedFiles);

        pending = undefined;
        run = { generation, reader, queue: [...reader.units] };
        report({ kind: "units", generation, units: reader.units });
        schedule();

        return;
    }

    if (!run) return;

    const unit = run.queue.shift();

    if (unit === undefined) {
        report({ kind: "done", generation: run.generation });
        run = undefined;

        return;
    }

    report({ kind: "unit", generation: run.generation, unit, groups: run.reader.read(unit) });
    schedule();
};

const schedule = () => {
    if (isScheduled) return;

    isScheduled = true;
    setImmediate(step);
};

parentPort!.on("message", (request: ApiWorkerRequest) => {
    if (request.kind === "build") {
        pending = {
            generation: request.generation,
            changedFiles: [...(pending?.changedFiles ?? []), ...request.changedFiles],
        };
        schedule();

        return;
    }

    const index = run?.queue.indexOf(request.unit) ?? -1;

    if (index <= 0) return;

    run!.queue.splice(index, 1);
    run!.queue.unshift(request.unit);
});
