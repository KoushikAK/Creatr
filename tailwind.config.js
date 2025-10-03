module.exports = {
  theme: {
    extend: {
      keyframes: {
        "gradient-left-right": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "gradient-top-bottom": {
          "0%, 100%": { "background-position": "50% 0%" },
          "50%": { "background-position": "50% 100%" },
        },
        "gradient-diagonal": {
          "0%, 100%": { "background-position": "0% 0%" },
          "50%": { "background-position": "100% 100%" },
        },
      },
      animation: {
        "gradient-left-right": "gradient-left-right 18s ease infinite",
        "gradient-top-bottom": "gradient-top-bottom 22s ease infinite",
        "gradient-diagonal": "gradient-diagonal 28s ease infinite",
      },
    },
  },
};
