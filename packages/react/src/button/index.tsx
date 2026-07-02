import type { ButtonHTMLAttributes, Ref } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { button } from "@stisla/style";

/* Variant + tune props are INFERRED from the shared button config in @stisla/style, so the
 * contract is authored once (ARCHITECTURE §5B). Native <button> attributes merge on top. */
type ButtonComposerProps = NonNullable<Parameters<typeof button>[0]>;

export type ButtonProps = ButtonComposerProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonComposerProps> & {
    /* React 19: ref is a regular prop, no forwardRef. */
    ref?: Ref<HTMLButtonElement>;
    /* Loading state → aria-busy (the style hook), not a class. */
    loading?: boolean;
  };

/* Thin wrapper over Base UI's Button (@base-ui/react). Base UI gives us the `render` prop
 * (polymorphism — render as <a> etc.), `nativeButton`, `focusableWhenDisabled`, and the
 * data-disabled hook; the composer supplies className (variants) + style (tune vars).
 *
 * Component CSS (@stisla/style/button.css) is loaded by the consumer stylesheet today; once
 * the @stisla/style build is wired this file will co-locate `import "@stisla/style/button.css"`
 * so the CSS tree-shakes with the JS import graph (ARCHITECTURE §6). */
export function Button({
  ref,
  tone,
  shape,
  size,
  iconOnly,
  pill,
  block,
  wrap,
  loading,
  tune,
  className,
  style,
  type,
  ...rest
}: ButtonProps) {
  const composed = button({
    tone,
    shape,
    size,
    iconOnly,
    pill,
    block,
    wrap,
    tune,
    className,
  });

  return (
    <BaseButton
      ref={ref}
      type={type ?? "button"}
      className={composed.className}
      style={{ ...composed.style, ...style }}
      aria-busy={loading || undefined}
      {...rest}
    />
  );
}
