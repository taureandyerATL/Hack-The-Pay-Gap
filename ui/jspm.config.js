SystemJS.config({
  devConfig: {
    'map': {
      'babel-plugin-transform-decorators-legacy': 'npm:babel-plugin-transform-decorators-legacy@1.3.4',
      'babel-plugin-transform-class-properties': 'npm:babel-plugin-transform-class-properties@6.10.2',
      'babel-plugin-transform-flow-strip-types': 'npm:babel-plugin-transform-flow-strip-types@6.8.0',
      'babel-plugin-transform-es2015-typeof-symbol': 'npm:babel-plugin-transform-es2015-typeof-symbol@6.8.0',
      'babel-plugin-angular2-annotations': 'npm:babel-plugin-angular2-annotations@5.1.0',
      'path': 'github:jspm/nodelibs-path@0.2.0-alpha',
      'buffer': 'github:jspm/nodelibs-buffer@0.2.0-alpha',
      'util': 'github:jspm/nodelibs-util@0.2.0-alpha',
      'stream': 'github:jspm/nodelibs-stream@0.2.0-alpha',
      'events': 'github:jspm/nodelibs-events@0.2.0-alpha',
      'fs': 'github:jspm/nodelibs-fs@0.2.0-alpha'
    },
    'packages': {
      'npm:babel-plugin-transform-decorators-legacy@1.3.4': {
        'map': {
          'babel-plugin-syntax-decorators': 'npm:babel-plugin-syntax-decorators@6.8.0',
          'babel-template': 'npm:babel-template@6.9.0',
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-plugin-transform-class-properties@6.10.2': {
        'map': {
          'babel-plugin-syntax-class-properties': 'npm:babel-plugin-syntax-class-properties@6.8.0',
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-plugin-transform-flow-strip-types@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2',
          'babel-plugin-syntax-flow': 'npm:babel-plugin-syntax-flow@6.8.0'
        }
      },
      'npm:babel-plugin-transform-es2015-typeof-symbol@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-plugin-syntax-decorators@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-template@6.9.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2',
          'babel-traverse': 'npm:babel-traverse@6.10.4',
          'babylon': 'npm:babylon@6.8.2',
          'babel-types': 'npm:babel-types@6.11.1',
          'lodash': 'npm:lodash@4.13.1'
        }
      },
      'npm:babel-plugin-angular2-annotations@5.1.0': {
        'map': {
          'babel-generator': 'npm:babel-generator@6.11.0'
        }
      },
      'npm:babel-plugin-syntax-class-properties@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-generator@6.11.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2',
          'babel-types': 'npm:babel-types@6.11.1',
          'detect-indent': 'npm:detect-indent@3.0.1',
          'babel-messages': 'npm:babel-messages@6.8.0',
          'lodash': 'npm:lodash@4.13.1',
          'source-map': 'npm:source-map@0.5.6'
        }
      },
      'npm:babel-plugin-syntax-flow@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-traverse@6.10.4': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2',
          'babylon': 'npm:babylon@6.8.2',
          'babel-types': 'npm:babel-types@6.11.1',
          'babel-messages': 'npm:babel-messages@6.8.0',
          'lodash': 'npm:lodash@4.13.1',
          'globals': 'npm:globals@8.18.0',
          'invariant': 'npm:invariant@2.2.1',
          'babel-code-frame': 'npm:babel-code-frame@6.11.0',
          'debug': 'npm:debug@2.2.0'
        }
      },
      'npm:babel-runtime@6.9.2': {
        'map': {
          'regenerator-runtime': 'npm:regenerator-runtime@0.9.5',
          'core-js': 'npm:core-js@2.4.0'
        }
      },
      'npm:babylon@6.8.2': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-types@6.11.1': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2',
          'babel-traverse': 'npm:babel-traverse@6.10.4',
          'lodash': 'npm:lodash@4.13.1',
          'to-fast-properties': 'npm:to-fast-properties@1.0.2',
          'esutils': 'npm:esutils@2.0.2'
        }
      },
      'npm:babel-messages@6.8.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2'
        }
      },
      'npm:babel-code-frame@6.11.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.9.2',
          'esutils': 'npm:esutils@2.0.2',
          'js-tokens': 'npm:js-tokens@2.0.0',
          'chalk': 'npm:chalk@1.1.3'
        }
      },
      'npm:detect-indent@3.0.1': {
        'map': {
          'get-stdin': 'npm:get-stdin@4.0.1',
          'minimist': 'npm:minimist@1.2.0',
          'repeating': 'npm:repeating@1.1.3'
        }
      },
      'npm:invariant@2.2.1': {
        'map': {
          'loose-envify': 'npm:loose-envify@1.2.0'
        }
      },
      'npm:loose-envify@1.2.0': {
        'map': {
          'js-tokens': 'npm:js-tokens@1.0.3'
        }
      },
      'npm:debug@2.2.0': {
        'map': {
          'ms': 'npm:ms@0.7.1'
        }
      },
      'npm:repeating@1.1.3': {
        'map': {
          'is-finite': 'npm:is-finite@1.0.1'
        }
      },
      'npm:chalk@1.1.3': {
        'map': {
          'supports-color': 'npm:supports-color@2.0.0',
          'has-ansi': 'npm:has-ansi@2.0.0',
          'escape-string-regexp': 'npm:escape-string-regexp@1.0.5',
          'ansi-styles': 'npm:ansi-styles@2.2.1',
          'strip-ansi': 'npm:strip-ansi@3.0.1'
        }
      },
      'npm:is-finite@1.0.1': {
        'map': {
          'number-is-nan': 'npm:number-is-nan@1.0.0'
        }
      },
      'npm:has-ansi@2.0.0': {
        'map': {
          'ansi-regex': 'npm:ansi-regex@2.0.0'
        }
      },
      'npm:strip-ansi@3.0.1': {
        'map': {
          'ansi-regex': 'npm:ansi-regex@2.0.0'
        }
      },
      'github:jspm/nodelibs-buffer@0.2.0-alpha': {
        'map': {
          'buffer-browserify': 'npm:buffer@4.7.0'
        }
      },
      'npm:buffer@4.7.0': {
        'map': {
          'ieee754': 'npm:ieee754@1.1.6',
          'isarray': 'npm:isarray@1.0.0',
          'base64-js': 'npm:base64-js@1.1.2'
        }
      },
      'github:jspm/nodelibs-stream@0.2.0-alpha': {
        'map': {
          'stream-browserify': 'npm:stream-browserify@2.0.1'
        }
      },
      'npm:stream-browserify@2.0.1': {
        'map': {
          'inherits': 'npm:inherits@2.0.1',
          'readable-stream': 'npm:readable-stream@2.1.4'
        }
      },
      'npm:readable-stream@2.1.4': {
        'map': {
          'inherits': 'npm:inherits@2.0.1',
          'isarray': 'npm:isarray@1.0.0',
          'buffer-shims': 'npm:buffer-shims@1.0.0',
          'process-nextick-args': 'npm:process-nextick-args@1.0.7',
          'core-util-is': 'npm:core-util-is@1.0.2',
          'util-deprecate': 'npm:util-deprecate@1.0.2',
          'string_decoder': 'npm:string_decoder@0.10.31'
        }
      }
    }
  },
  packages: {
    'src': {
      'defaultExtension': 'ts'
    },
    'typings': {
      'defaultExtension': 'ts'
    }
  },
  transpiler: 'typescript',
  typescriptOptions: {
    'sourceMap': true,
    'emitDecoratorMetadata': true,
    'experimentalDecorators': true,
    'removeComments': false,
    'noImplicitAny': false
  }
});

SystemJS.config({
  packageConfigPaths: [
    'npm:@*/*.json',
    'npm:*.json',
    'github:*/*.json'
  ],
  map: {
    '@angular/common': 'npm:@angular/common@2.0.0-rc.1',
    '@angular/compiler': 'npm:@angular/compiler@2.0.0-rc.1',
    '@angular/core': 'npm:@angular/core@2.0.0-rc.1',
    '@angular/http': 'npm:@angular/http@2.0.0-rc.1',
    '@angular/platform-browser': 'npm:@angular/platform-browser@2.0.0-rc.1',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@2.0.0-rc.1',
    'assert': 'github:jspm/nodelibs-assert@0.2.0-alpha',
    'es6-promise': 'npm:es6-promise@3.2.1',
    'es6-shim': 'npm:es6-shim@0.35.1',
    'os': 'github:jspm/nodelibs-os@0.2.0-alpha',
    'process': 'github:jspm/nodelibs-process@0.2.0-alpha',
    'reflect-metadata': 'npm:reflect-metadata@0.1.2',
    'rxjs': 'npm:rxjs@5.0.0-beta.6',
    'typescript': 'npm:typescript@1.8.10',
    'ui-router-ng2': 'npm:ui-router-ng2@1.0.0-alpha.5',
    'zone.js': 'npm:zone.js@0.6.12'
  },
  packages: {
    'github:jspm/nodelibs-os@0.2.0-alpha': {
      'map': {
        'os-browserify': 'npm:os-browserify@0.2.1'
      }
    }
  }
});
