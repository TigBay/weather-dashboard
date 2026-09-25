import { Notify, Dialog } from 'quasar';

export function useNotifications() {
    function warn(message: string): void {
        Notify.create({
            type: 'warning',
            message,
            position: 'top',
        });
    }

    function fatal(message: string): void {
        Dialog.create({
            title: 'Error',
            message,
            color: 'negative',
            ok: {color: 'negative', label: 'OK'}
        });
    }

    return {warn, fatal}
}
