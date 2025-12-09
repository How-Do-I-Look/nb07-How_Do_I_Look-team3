import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
export default defineConfig([
  //ESLint가 검사할 파일 패턴
  {
    files: ["**/*.{js,mjs,cjs}"],
    // javascript 패턴 검사
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    extends: ["js/recommended", prettierConfig],
    languageOptions: { globals: globals.node },
    rules: {
      // console.log 허용
      "no-console": "off",
      //사용하지 않는 변수 오류 처리
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      //var 사용 금지
      "no-var": "error",
      //async 함수에서 await 필수 처리
      "require-await": "error",
      // == != 금지 ===, !== 사용 권장
      eqeqeq: "error",
    },
  },
]);
