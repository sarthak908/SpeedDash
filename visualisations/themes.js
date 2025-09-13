// themes.js
// Returns a factory function (root) => themeInstance, or null to use default Animated only.

// export function getThemeFactory(name) {
//   if (!name || name.toLowerCase() === "animated") return null;

//   switch (name.toLowerCase()) {
//     case "dark":
//       return (root) => am5themes_Dark.new(root);
//     case "material":
//       return (root) => am5themes_Material.new(root);
//     case "kelly":
//       return (root) => am5themes_Kelly.new(root);
//     case "moonrise":
//       return (root) => am5themes_Moonrise.new(root);
//     case "spirited":
//       return (root) => am5themes_Spirited.new(root);
//     case "frozen":
//       return (root) => am5themes_Frozen.new(root);
//     case "dataviz":
//       return (root) => am5themes_Dataviz.new(root);
//     case "micro":
//       return (root) => am5themes_Micro.new(root);
//     case "blue":
//       return (root) => am5themes_Blue.new(root);
//     default:
//       return null;
//   }
// }
// themes.js
// Returns a factory function (root) => themeInstance, or null to use default Animated only.

export function getThemeFactory(name) {
  const key = String(name || "animated").toLowerCase();

  if (key === "animated") return null;

  switch (key) {
    case "dark":
      return (root) => am5themes_Dark.new(root);
    case "material":
      return (root) => am5themes_Material.new(root);
    case "kelly":
      return (root) => am5themes_Kelly.new(root);
    case "moonrise":
      return (root) => am5themes_Moonrise.new(root);
    case "spirited":
      return (root) => am5themes_Spirited.new(root);
    case "frozen":
      return (root) => am5themes_Frozen.new(root);
    case "dataviz":
      return (root) => am5themes_Dataviz.new(root);
    case "micro":
      return (root) => am5themes_Micro.new(root);
    case "blue":
      return (root) => am5themes_Blue.new(root);
    default:
      return null;
  }
}
