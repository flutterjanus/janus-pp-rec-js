import {JanusPPRecJs} from 'janus-pp-rec-js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const mjrFilePath = join(
    __dirname,
    'recordings/0a2c4fae3b5e38d6b0fdad6ea014b293-peer-audio.mjr'
)
const wavFilePath = join(
    __dirname,
    'recordings/0a2c4fae3b5e38d6b0fdad6ea014b293-peer-audio.wav'
)
JanusPPRecJs.createWavFromMjr(mjrFilePath, wavFilePath)
