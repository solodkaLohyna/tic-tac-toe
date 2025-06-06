export type Modal = {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}