import { Task } from '@composer/util';

export const renderWaveformTask = ({
  controller,
  sampleRate = 44100,
}) => {
  return new Task(async (task) => {
    if (
      controller.file &&
      controller.file.waveform &&
      controller.file.duration
    ) {
      return {
        duration: controller.file.duration,
        waveform: controller.file.waveform
      }
    }

    return await controller.withExportableRendering(({ renderer, duration }) => {
      const waveform = renderer.toWaveform();

      controller.file.setProperties({
        duration, waveform
      });

      return { waveform, duration };
    }, { sampleRate });
  });
}
