declare module 'react-map-interaction' {
  type Translation = {
    x: number;
    y: number;
  };

  export type MapInteractionProps = {
    children?: ({
      scale,
      translation,
    }: {
      scale: number;
      translation: Translation;
    }) => import('react').ReactNode;

    value?: {
      scale: number;
      translation: Translation;
    };

    defaultValue?: {
      scale: number;
      translation: Translation;
    };

    disableZoom?: boolean;

    disablePan?: boolean;

    translationBounds?: {
      xMin?: number;
      xMax?: number;
      yMin?: number;
      yMax?: number;
    };

    onChange?: ({
      scale,
      translation,
    }: {
      scale: number;
      translation: Translation;
    }) => void;

    minScale?: number;
    maxScale?: number;

    showControls?: boolean;

    plusBtnContents?: import('react').ReactNode;
    minusBtnContents?: import('react').ReactNode;

    controlsClass?: string;

    btnClass?: string;

    plusBtnClass?: string;
    minusBtnClass?: string;
  };
  export const MapInteraction: import('react').FC<MapInteractionProps>;

  export type MapInteractionCSSProps = import('react').PropsWithChildren<
    Omit<MapInteractionProps, 'children'>
  >;
  export const MapInteractionCSS: import('react').FC<MapInteractionCSSProps>;

  export default MapInteraction;
}
