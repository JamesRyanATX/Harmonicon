import { ConfirmModal } from '@composer/web-components';
import { useController } from '../../../providers/controller';

export function ExportToWavModal() {
  const controller = useController();

  return (
    <ConfirmModal
      task={controller.createExportToWavTask()}
      title="Export to WAV"
      text="After rendering, your download will begin automatically.  This may take a moment."
      confirmLabel={`Render "${controller.file.name}.wav"`}
      onClose={() => {
        controller.emit('modal:close');
      }}
    />
  )
}