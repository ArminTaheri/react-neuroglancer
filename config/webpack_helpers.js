/**
 * @license
 * Copyright 2016 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const path = require("path");
const originalWebpackHelpers = require("neuroglancer/config/webpack_helpers");
const resolveReal = require("neuroglancer/config/resolve_real");

function makeModifiedPythonClientOptions(options) {
  const srcDir = resolveReal(__dirname, "../src");
  options = Object.assign({}, options);
  options.extraDataSources = [
    ...(options.extraDataSources || []),
    { source: "lib-neuroglancer/datasource/python", register: null }
  ];
  options.frontendModules = options.frontendModules || [
    resolveReal(srcDir, "main_python.ts")
  ];
  options.registerCredentials = false;
  return options;
}

function modifyViewerOptions(options) {
  options = options || {};
  options.resolveLoaderRoots = [
    ...(options.resolveLoaderRoots || []),

    // Allow loader modules to be resolved from node_modules directory of this
    // project in addition to the node_modules directory of neuroglancer.
    resolveReal(__dirname, "../node_modules")
  ];

  // This references the tsconfig.json file of this project, rather than of
  // neuroglancer.
  options.tsconfigPath = resolveReal(__dirname, "../tsconfig.json");

  // Build remote-python-source-enabled client
  options = makeModifiedPythonClientOptions(options);
  return options;
}

exports.getViewerConfigFromEnv = function(options, env) {
  return originalWebpackHelpers.getViewerConfigFromEnv(
    modifyViewerOptions(options),
    env
  );
};
