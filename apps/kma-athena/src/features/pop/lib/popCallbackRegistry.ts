type PopupCallback = (() => void | Promise<void>) | undefined;

type PopupCallbackSet = {
  onConfirm?: PopupCallback;
  onCancel?: PopupCallback;
  onClose?: PopupCallback;
};

const popupCallbackRegistry = new Map<string, PopupCallbackSet>();

export function registerPopupCallbacks(id: string, callbacks: PopupCallbackSet) {
  popupCallbackRegistry.set(id, callbacks);
}

export function getPopupCallbacks(id?: string | null) {
  if (!id) {
    return undefined;
  }
  return popupCallbackRegistry.get(id);
}

export function clearPopupCallbacks(id?: string | null) {
  if (!id) {
    return;
  }
  popupCallbackRegistry.delete(id);
}
