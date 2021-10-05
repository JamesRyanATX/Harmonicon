import { ConfirmModal } from '@composer/web-components';
import { useController } from '../../../providers/controller';

export function ExportToMp3Modal() {
  const controller = useController();

  return (
    <ConfirmModal
      task={controller.createExportToMp3Task()}
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