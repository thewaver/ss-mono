// The one Node global the libraries read: a bundler replaces `process.env.NODE_ENV` with the build's mode, so a
// production build drops what only development needs. Written to merge with Node's own types where those are loaded.
declare namespace NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        NODE_ENV?: string;
    }

    interface Process {
        env: ProcessEnv;
    }
}

declare var process: NodeJS.Process;
