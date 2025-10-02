const babel = require('@babel/core');
const register = require('@babel/register');

function transformImportMetaEnv() {
  return {
    name: 'transform-import-meta-env-to-process-env',
    visitor: {
      MemberExpression(path) {
        const obj = path.get('object');
        const prop = path.get('property');

        const isImportMeta =
          obj.isMemberExpression() &&
          obj.get('object').isMetaProperty() &&
          obj.get('object').node.meta.name === 'import' &&
          obj.get('object').node.property.name === 'meta' &&
          obj.get('property').isIdentifier({ name: 'env' });

        if (!isImportMeta) return;

        if (path.parentPath.isMemberExpression()) {
          const nextProp = path.parentPath.get('property');
          const computed = path.parentPath.node.computed;

          const t = require('@babel/types');
          const processDotEnv = t.memberExpression(
            t.identifier('process'),
            t.identifier('env')
          );

          const replacement = t.memberExpression(
            processDotEnv,
            computed ? nextProp.node : t.identifier(nextProp.node.name || nextProp.node.value),
            computed
          );

          path.parentPath.replaceWith(replacement);
        } else {
          const t = require('@babel/types');
          path.replaceWith(
            t.memberExpression(t.identifier('process'), t.identifier('env'))
          );
        }
      },
    },
  };
}

register({
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
  ignore: [/node_modules/],
  babelrc: false,
  configFile: false,
  plugins: [transformImportMetaEnv],
  presets: [
    [require.resolve('@babel/preset-typescript')],
    [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
  ],
});