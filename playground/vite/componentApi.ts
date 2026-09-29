import path from "node:path";
import { Worker } from "node:worker_threads";
import type { Plugin, ViteDevServer } from "vite";

import {
    BUILD_PROGRESS_EVENT,
    BUILD_START_EVENT,
} from "../src/App/PageComponents/BuildProgress/BuildProgress.const.ts";
import type { BuildProgress } from "../src/App/PageComponents/BuildProgress/BuildProgress.types.ts";
import { type ComponentApiOptions, buildApiMap } from "./componentApiBuild.ts";
import type { ApiWorkerData, ApiWorkerReport, ApiWorkerRequest } from "./componentApiWorker.ts";

export type { ComponentApiOptions } from "./componentApiBuild.ts";

const VIRTUAL_ID = "virtual:component-api";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const UNIT_PREFIX = `${VIRTUAL_ID}/`;
const RESOLVED_UNIT_PREFIX = `\0${UNIT_PREFIX}`;
const WORKER_URL = new URL("./componentApiWorker.ts", import.meta.url);
const WORKER_FLAGS = ["--experimental-strip-types", "--disable-warning=ExperimentalWarning"];
const CHANGE_SETTLE_MS = 100;
const EMPTY_GROUPS = "[]";

const toPosix = (value: string) => value.split(path.sep).join("/");

const toListCode = (units: string[]) =>
    `export default {\n${units.map((unit) => `    ${JSON.stringify(unit)}: () => import(${JSON.stringify(`${UNIT_PREFIX}${unit}`)}),`).join("\n")}\n};`;

const toUnitCode = (groups: string) => `export default ${groups};`;

const toModule = (code: string) => ({ code, map: { mappings: "" } });

const createDevBuild = (server: ViteDevServer, workerData: ApiWorkerData) => {
    let worker: Worker | undefined;
    let generation = 0;
    let units: string[] | undefined;
    let progress: BuildProgress = { generation, built: 0, total: undefined };
    let changedFiles: string[] = [];
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const built = new Map<string, string>();
    const fresh = new Set<string>();
    const served = new Set<string>();
    const unitWaiters = new Map<string, (() => void)[]>();
    let listWaiters: (() => void)[] = [];

    const post = (request: ApiWorkerRequest) => worker?.postMessage(request);

    const announce = (next: BuildProgress) => {
        progress = next;
        server.ws.send(BUILD_PROGRESS_EVENT, progress);
    };

    const findModule = (id: string) => server.moduleGraph.getModuleById(id);

    const settleUnit = (unit: string) => {
        for (const resolve of unitWaiters.get(unit) ?? []) resolve();

        unitWaiters.delete(unit);
    };

    const handleReport = (message: ApiWorkerReport) => {
        if (message.generation !== generation) return;

        if (message.kind === "units") {
            const previous = units;

            units = message.units;

            for (const resolve of listWaiters) resolve();

            listWaiters = [];

            for (const unit of unitWaiters.keys()) {
                if (units.includes(unit)) post({ kind: "prioritize", unit });
                else {
                    built.delete(unit);
                    settleUnit(unit);
                }
            }

            const list = findModule(RESOLVED_ID);

            if (list && previous && previous.join() !== units.join()) server.reloadModule(list);

            announce({ generation, built: 0, total: units.length });

            return;
        }

        if (message.kind === "unit") {
            const code = JSON.stringify(message.groups);
            const previous = built.get(message.unit);

            built.set(message.unit, code);
            fresh.add(message.unit);
            settleUnit(message.unit);

            const module = findModule(`${RESOLVED_UNIT_PREFIX}${message.unit}`);

            if (module && previous !== undefined && previous !== code && !served.has(message.unit))
                server.reloadModule(module);

            announce({ generation, built: fresh.size, total: units?.length });

            return;
        }

        announce({ generation, built: fresh.size, total: units?.length ?? fresh.size });
    };

    const fail = (error: Error) => {
        server.config.logger.error(`[component-api] ${error.stack ?? error.message}`);
        worker = undefined;
        units ??= [];

        for (const resolve of listWaiters) resolve();

        listWaiters = [];

        for (const unit of [...unitWaiters.keys()]) settleUnit(unit);

        announce({ generation, built: 0, total: 0 });
    };

    const rebuild = (files: string[]) => {
        generation += 1;
        units = undefined;
        fresh.clear();
        served.clear();

        for (const unit of built.keys()) {
            const module = findModule(`${RESOLVED_UNIT_PREFIX}${unit}`);

            if (module) server.moduleGraph.invalidateModule(module);
        }

        post({ kind: "build", generation, changedFiles: files });
        announce({ generation, built: 0, total: undefined });
    };

    const start = () => {
        if (worker) return;

        worker = new Worker(WORKER_URL, { workerData, execArgv: [...process.execArgv, ...WORKER_FLAGS] });
        worker.unref();
        worker.on("message", handleReport);
        worker.on("error", fail);
        rebuild([]);
    };

    const noteChange = (file: string) => {
        if (!worker) return;

        changedFiles.push(file);
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
            const files = changedFiles;

            changedFiles = [];
            rebuild(files);
        }, CHANGE_SETTLE_MS);
    };

    const loadList = async () => {
        start();

        if (!units) await new Promise<void>((resolve) => listWaiters.push(resolve));

        return toListCode(units ?? []);
    };

    const loadUnit = async (unit: string) => {
        start();

        if (!fresh.has(unit)) {
            const isFresh = new Promise<void>((resolve) =>
                unitWaiters.set(unit, [...(unitWaiters.get(unit) ?? []), resolve]),
            );

            post({ kind: "prioritize", unit });
            await isFresh;
        }

        served.add(unit);

        return toUnitCode(built.get(unit) ?? EMPTY_GROUPS);
    };

    const stop = () => {
        clearTimeout(settleTimer);
        worker?.terminate();
        worker = undefined;
    };

    return { start, noteChange, loadList, loadUnit, stop, getProgress: () => progress };
};

export const componentApi = (
    componentsRoot: string,
    coreRoot: string,
    utilsEntry: string,
    options: ComponentApiOptions = {},
): Plugin => {
    const entryFile = path.join(componentsRoot, "index.ts");
    const coreEntry = path.join(coreRoot, "index.ts");
    const roots = [componentsRoot, coreRoot];

    let devBuild: ReturnType<typeof createDevBuild> | undefined;
    let apiMap: Record<string, unknown> | undefined;

    const getApiMap = () => (apiMap ??= buildApiMap(entryFile, coreEntry, utilsEntry, options));

    return {
        name: "component-api",
        resolveId(source) {
            if (source === VIRTUAL_ID) return RESOLVED_ID;

            return source.startsWith(UNIT_PREFIX) ? `\0${source}` : undefined;
        },
        async load(id) {
            if (id === RESOLVED_ID)
                return toModule(devBuild ? await devBuild.loadList() : toListCode(Object.keys(getApiMap())));

            if (!id.startsWith(RESOLVED_UNIT_PREFIX)) return undefined;

            const unit = id.slice(RESOLVED_UNIT_PREFIX.length);

            return toModule(
                devBuild
                    ? await devBuild.loadUnit(unit)
                    : toUnitCode(JSON.stringify(getApiMap()[unit] ?? [])),
            );
        },
        configureServer(server) {
            const build = createDevBuild(server, { entryFile, coreEntry, utilsEntry, options });

            devBuild = build;

            for (const root of roots) server.watcher.add(root);

            server.watcher.on("all", (_event, file) => {
                if (roots.some((root) => toPosix(file).startsWith(toPosix(root)))) build.noteChange(file);
            });

            server.ws.on(BUILD_START_EVENT, (_data, client) => {
                build.start();
                client.send(BUILD_PROGRESS_EVENT, build.getProgress());
            });

            server.httpServer?.once("close", build.stop);
        },
    };
};
