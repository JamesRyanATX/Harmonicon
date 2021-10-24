import { ConfirmModal } from '@composer/daw-components';
import { useController } from '../../../providers/controller';
import { renderMp3FileTask } from '../../../tasks/render_mp3_file';

export function ExportToMp3Modal() {
  const controller = useController();

  return (
    <ConfirmModal
      task={renderMp3FileTask({ controller })}
      title="Export to MP3"
      text="After rendering, your download will begin automatically.  This may take a moment."
      confirmLabel={`Render "${controller.file.name}.mp3"`}
      onClose={() => {
        controller.emit('modal:close');
      }}
      showProgress
    />
  )
}