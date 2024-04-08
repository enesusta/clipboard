const rspack = require("@rspack/core");
const path = require("path");
const minifyPlugin = require("@rspack/plugin-minify");

/** @type {import('@rspack/cli').Configuration} */

module.exports = (env, argv) => {
  let isDev = process.env.NODE_ENV === "development";
  isDev = false;
  return {
    context: __dirname,
    devtool: !isDev ? "source-map" : "eval",
    experiments: {
      rspackFuture: {
        disableTransformByDefault: true,
      },
    },
    mode: isDev ? "development" : "production",
    entry: {
      main: path.resolve(__dirname, "index.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: "index.js",
    },
    builtins: {
      minifyOptions: {
        comments: false,
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new minifyPlugin({
          minifier: "terser",
        }),
      ],
    },

    module: {
      rules: [
        {
          test: /.(j|t)s$/,
          exclude: [/[\/]node_modules[\/]/],
          loader: "builtin:swc-loader",
          options: {
            sourceMap: true,
            jsc: {
              parser: { syntax: "typescript" },
              externalHelpers: true,
              transform: {
                react: {
                  runtime: "automatic",
                  development: isDev,
                  refresh: isDev,
                  throwIfNamespace: true,
                  useBuiltins: false,
                },
              },
            },
            env: { targets: "Chrome >= 48" },
          },
        },

        {
          test: /.(j|t)sx$/,
          loader: "builtin:swc-loader",
          exclude: [/[\/]node_modules[\/]/],
          options: {
            sourceMap: true,
            jsc: {
              parser: { syntax: "typescript", tsx: true },
              transform: {
                react: {
                  runtime: "automatic",
                  development: isDev,
                  refresh: isDev,
                },
              },
              externalHelpers: true,
            },
            env: { targets: "Chrome >= 48" },
          },
        },
      ],
    },
    externals: {
      react: "react",
      "react-dom": "react-dom",
    },
  };
};
