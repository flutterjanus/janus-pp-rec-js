import { Subject } from "rxjs";
import { spawn, SpawnOptionsWithoutStdio } from "child_process";

export const spawnObservable = (cmd, args, spawnOptions: SpawnOptionsWithoutStdio = { shell: true }) => {
    const observable = new Subject();
    const errorObservable = new Subject();
    const writeObservable = new Subject();

    const runCommand = spawn(cmd, args, spawnOptions);
    writeObservable.subscribe({
        next: (data) => {
            runCommand.stdin.write(data);
        },
    });
    runCommand.stdout.on("close", (code) => {
        observable.complete();
    });

    runCommand.stdout.on("data", (data) => {
        if (data) {
            observable.next(data.toString());
        }
    });
    runCommand.stderr.on("close", (code) => {
        errorObservable.complete();
    });

    runCommand.stderr.on("data", (data) => {
        if (data) {
            errorObservable.next(data.toString());
        }
    });
    return { errorObservable, events: observable.asObservable(), sender: writeObservable };
};
