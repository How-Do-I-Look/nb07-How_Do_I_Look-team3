import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
export default [
  //ESLint가 검사할 파일 패턴
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [
      "src/test/**/*.js",
      "dist/*",
      "prisma/*",
      "public/*",
      "generated/*",
      "node_modules/*",
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "prettier/prettier": "error",
      // console.log 허용
      "no-console": "off",
      //사용하지 않는 변수 오류 처리
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      //var 사용 금지
      "no-var": "error", //다시하면되요 이것도 커밋ㅎ
      //async 함수에서 await 필수 처리
      "require-await": "error",
      // == != 금지 ===, !== 사용 권장
      eqeqeq: "error",
    },
  },
];
