import _ from "lodash";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export function addBufferOutput(bufferOutputs, bufferString, maxBufferSize = 50) {
  const newBufferOutputs = [...bufferOutputs, bufferString];
  if (newBufferOutputs.length > maxBufferSize) {
    newBufferOutputs.shift(); // Remove the oldest element (from the beginning of the array)
  }
  return newBufferOutputs;
}

export const downMixAudioFiles = (outputFilePath, ...inputFilePaths) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    _.each(inputFilePaths, (path) => {
      command.addInput(path);
    });
    command
      .complexFilter([`amix=inputs=${_.size(inputFilePaths)}:duration=longest`])
      .output(outputFilePath)
      .on("error", (err) => {
        reject(err);
      })
      .on("end", function (err, stdout, stderr) {
        resolve(true);
      })
      .run();
  });
};
