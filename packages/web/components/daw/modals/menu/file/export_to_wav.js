import { ConfirmModal } from '@composer/web-components';
import { useController } from '../../../providers/controller';
import { renderWavFileTask } from '../../../tasks/render_wav_file';

export function ExportToWavModal() {
  const controller = useController();

  return (
    <ConfirmModal
      task={renderWavFileTask({ controller })}
      title="Export to WAV"
      text="After rendering, your download will begin automatically.  This may take a moment."
      confirmLabel={`Render "${controller.file.name}.wav"`}
      onClose={() => {
        controller.emit('modal:close');
      }}
    />
  )
}