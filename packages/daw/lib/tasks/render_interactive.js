import { Task } from '@composer/util';
import { parse } from '@composer/compose';

export const renderInteractiveTask = ({
  controller = null,
  code = ''
}) => {
  return new Task(async function(task) {

    // Start buffer if not started
    await controller.audio.startAudioBuffer();

    // Save the current transport position and selectively restore it
    const currentPosition = controller.transport.position;
    const restorePosition = !controller.renderedFile || controller.renderedFile === controller.file;

    // Render session
    const composer = await parse({ code });
    const session = composer.model;
    const renderer = await session.render({
      interactive: true,
      onProgress: task.onProgress
    });

    // Restore the transport cursor
    if (restorePosition) {
      controller.transport.setPosition(currentPosition);
    }

    return { session, composer, renderer };
  });
}
