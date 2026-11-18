module.exports = {
  hooks: {
    beforePacking(manifest) {
      if (!['@aiyazone/design-system', '@aiyazone/tokens'].includes(manifest.name)) {
        return manifest;
      }
      const devDependencies = { ...manifest.devDependencies };
      delete devDependencies['@aiyazone/eslint-config'];
      delete devDependencies['@aiyazone/tsconfig'];
      return { ...manifest, devDependencies };
    },
  },
};
