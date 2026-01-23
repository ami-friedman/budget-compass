import tsParser from '@typescript-eslint/parser';

const uiSelectorPrefixRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce bc- prefix for selectors in UI components under src/app/ui.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();
    const normalizedFilename = filename.replace(/\\/g, '/');
    const isUiComponent = normalizedFilename.includes('/src/app/ui/') && normalizedFilename.endsWith('.ts');

    if (!isUiComponent) {
      return {};
    }

    return {
      Decorator(node) {
        const expression = node.expression;
        if (!expression || expression.type !== 'CallExpression') {
          return;
        }

        const callee = expression.callee;
        if (!callee || callee.type !== 'Identifier' || callee.name !== 'Component') {
          return;
        }

        const args = expression.arguments;
        if (!args || args.length === 0) {
          return;
        }

        const componentConfig = args[0];
        if (!componentConfig || componentConfig.type !== 'ObjectExpression') {
          return;
        }

        const selectorProperty = componentConfig.properties.find((property) => {
          if (property.type !== 'Property') {
            return false;
          }
          const key = property.key;
          if (key.type === 'Identifier') {
            return key.name === 'selector';
          }
          if (key.type === 'Literal' || key.type === 'StringLiteral') {
            return key.value === 'selector';
          }
          return false;
        });

        if (!selectorProperty || selectorProperty.type !== 'Property') {
          return;
        }

        const selectorValue = selectorProperty.value;
        if (!selectorValue || (selectorValue.type !== 'Literal' && selectorValue.type !== 'StringLiteral')) {
          return;
        }

        const selector = String(selectorValue.value || '');
        if (!selector.startsWith('bc-')) {
          context.report({
            node: selectorProperty,
            message: 'UI component selectors in src/app/ui must be prefixed with "bc-".',
          });
        }
      },
    };
  },
};

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      'bc-ui': {
        rules: {
          'ui-selector-prefix': uiSelectorPrefixRule,
        },
      },
    },
    rules: {
      'bc-ui/ui-selector-prefix': 'error',
    },
  },
];
