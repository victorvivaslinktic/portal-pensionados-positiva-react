"use client";

import React from "react";

type IconProps = {
  /** id del <symbol> en el sprite */
  name: string;
  /** accesible (si no es decorativo) */
  title?: string;
  /** true si es meramente visual */
  decorative?: boolean;
  /** ej: "w-6 h-6 text-blue-600" */
  className?: string;
  /** override en px o cualquier unidad */
  size?: number | string;
  /** por defecto "/icons/sprite.svg" */
  spritePath?: string;
};

export const Icon: React.FC<IconProps> = ({
  name,
  title,
  decorative = !title, // si no hay title, lo marcamos decorativo
  className = "",
  size,
  spritePath = "",
}) => {
  const ariaProps = decorative
    ? { "aria-hidden": true, focusable: false as const }
    : { role: "img", "aria-label": title ?? name };

  const style =
    size !== undefined
      ? {
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }
      : undefined;

  return (
    <svg className={className} style={style} {...ariaProps}>
      {/* Para React moderno basta href. Si necesitas compat: xlinkHref */}
      <use href={`${spritePath}#${name}`} />
    </svg>
  );
};
