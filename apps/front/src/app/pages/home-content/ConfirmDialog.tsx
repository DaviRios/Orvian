interface ConfirmDialogProps {
  label: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  onError?: (msg: string) => void;
}

export function ConfirmDialog({
  label,
  onConfirm,
  onCancel,
  onError,
}: ConfirmDialogProps) {
  async function handleConfirm() {
    try {
      await onConfirm();
    } catch {
      onError?.('Erro ao excluir item.');
    }
    onCancel();
  }

  return (
    <div
      className={
        'fixed [inset:0] [background:rgba(0,_0,_0,_0.4)] flex items-center justify-center [z-index:1000]'
      }
      onClick={onCancel}
    >
      <div
        className={
          '[background:#302638] [border-radius:18px] [padding:28px_32px] [max-width:420px] [width:calc(100%_-_48px)] [box-shadow:0_12px_40px_rgba(0,_0,_0,_0.18)]'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className={
            '[font-size:17px] font-bold [color:#F7F2FA] [margin:0_0_10px]'
          }
        >
          Confirmar exclusão
        </p>
        <p
          className={
            '[font-size:14px] [color:#D2C9D7] [line-height:1.6] [margin:0_0_24px]'
          }
        >
          Tem certeza que deseja excluir <strong>"{label}"</strong>? Esta ação
          não pode ser desfeita.
        </p>
        <div className={'flex justify-end [gap:10px]'}>
          <button
            className={
              '[border:1px_solid_#68577E] [background:#25232C] [color:#9981AE] [border-radius:10px] [padding:10px_22px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s] hover:[background:#302638]'
            }
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={
              '[background:#ef4444] [color:#ffffff] border-0 [border-radius:10px] [padding:10px_22px] [font-size:14px] font-semibold cursor-pointer [font-family:inherit] [transition:background_0.15s] hover:[background:#dc2626]'
            }
            onClick={handleConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
