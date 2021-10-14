import { saveAs } from 'file-saver';
import { Task } from '@composer/util';

export const renderWavFileTask = ({ controller }) => {
  return new Task(async (task) => {
    return controller.withExportableRendering(async ({ renderer, duration }) => {
      const fileName = `${controller.file.name}.wav`;
      const options = {
        renderer,
        duration,
        onProgress: task.progress.bind(task)
      };

      saveAs(await renderer.toWav(options), fileName);
    });
  });
}
