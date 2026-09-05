// Glifo de la librería Material Symbols (Rounded); decorativo, sin accesibilidad propia
function Icon({ name }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

export default Icon;
