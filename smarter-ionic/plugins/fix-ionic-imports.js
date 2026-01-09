export function fixIonicImports() {
  return {
    name: 'fix-ionic-imports',
    enforce: 'pre', // Run before other plugins
    load(id) {
      // Handle the virtual module we created
      if (id.startsWith('\0virtual-ionic-global:')) {
        // Return proper exports that Ionic expects
        return `
          // Define the functions that Ionic expects
          export const getIonMode = () => undefined;
          export const isPlatform = (plt) => {
            if (typeof plt === 'string') {
              return plt === 'hybrid' || plt === 'ios' || plt === 'android';
            }
            return false;
          };
          export const getPlatforms = () => [];
          export const initialize = () => {};

          // Export as 'b', 'a', 'g', and 'i' to match the imports in Ionic core
          export { getIonMode as b };       // Used as 'b' in imports
          export { isPlatform as a };       // Used as 'a' in imports
          export { getPlatforms as g };     // Used as 'g' in imports
          export { initialize as i };       // Used as 'i' in imports
          export default {};
        `;
      }
      return null; // Let other files be loaded normally
    },
    resolveId(source, importer) {
      // If something is trying to import ionic-global.js or ionic-globalThis.js from node_modules, redirect it
      if (source.includes('ionic-global.js') || source.includes('ionic-globalThis.js')) {
        // Check if the importer is from within node_modules/@ionic/core
        if (importer && importer.includes('@ionic/core')) {
          // Return a virtual module ID that we'll handle in the load hook
          return `\0virtual-ionic-global:${source}`;
        }
      }
      return null;
    }
  };
}