module.exports = {
  root: true,
  ignores: ["**/dist/**"],

  overrides: [
    {
      files: ["apps/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "axios",
                message: "axios는 @repo/api 패키지를 통해서만 사용하세요.",
              },
            ],
          },
        ],
      },
    },
  ],
};
