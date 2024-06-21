import _ from 'lodash'
import { addBufferOutput, spawnObservable } from './core'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url));

export class JanusPPRecJs {
    static async createWavFromMjr(mjrPath: string, wavPath: string) {
        const { events: converter, errorObservable } = spawnObservable(`janus-pp-rec`, [mjrPath, wavPath], {
            shell: true,
            cwd: join(__dirname, "../bin/linux")
        });
        return new Promise((resolve, reject) => {
            let outputBuffer = [];
            let errorBuffer = [];
            errorObservable.subscribe({
                next(data) {
                    errorBuffer = addBufferOutput(errorBuffer, data, 100);
                },
                complete() {
                    console.log(errorBuffer);
                    reject({ error: _.join(errorBuffer, " ") });
                },
            });
            converter.subscribe({
                next(data) {
                    outputBuffer = addBufferOutput(outputBuffer, data, 100);
                },
                complete() {
                    const outputs = _.join(outputBuffer, " ");
                    console.log(outputs);
                    if (outputs.includes("No destination file") || outputs.includes("ERR")) {
                        reject({ error: "bad mjr file" });
                    }
                    resolve(true);
                },
            });
        });
    };

}