declare module 'reactstrap-confirm' {
  type Props = {
    message?: React.ReactNode;
    title?: React.ReactNode;
    confirmTex?: React.ReactNode;
    cancelText?: React.ReactNode;
    confirmColor?: 'string';
    cancelColor?: string;
    className?: string;
    size?: string | null;
    buttonsComponent?: React.ComponentType | null;
    bodyComponent?: React.ComponentType | null;
    modalProps?: React.ComponentProps<import('reactstrap').Modal>;
  };

  const confirm: (props?: Props) => Promise<boolean>;

  export default confirm;
}
