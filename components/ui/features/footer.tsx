/**
 * A simple footer component displaying information for the application.
 *
 * @component
 * @returns {JSX.Element} - Renders a footer element with copyright and disclaimer text.
 *
 * @remarks
 * - The footer text is centered and styled with a muted gray color and small font size.
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  return (
    <footer className="p-4 text-center text-gray-400 text-xs">
      <p>ScrumMate es un proyecto de código abierto.</p>
      <p>ScrumMate puede cometer errores. Compruebe información importante o sensible.</p>
    </footer>
  );
}
