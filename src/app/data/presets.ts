export const textPresets = [
  {
    "presetId": "text",
    "presetName": "Text",
    "presetDefinition": {
      "itemType": "TEXT",
      "content": "lorem"
    }
  }
];

export const flexPresets = [
  {
    "presetId": "empty-flex",
    "presetName": "Empty Flex",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "boxSizing": {
          "padding": "18px"
        }
      },
    }
  },
  {
    "presetId": "flex-rows",
    "presetName": "Flex rows",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "flexContainer": {
          "gap": 10
        },
        "boxSizing": {
          "padding": "18px"
        }
      },
      "children": [
        {
          "content": "__    1   ____",
          "itemType": "TEXT"
        },
        {
          "content": "_____    2    ______",
          "itemType": "TEXT",
          "css": {
            "boxSizing": {
              "padding": "14px"
            }
          }
        },
        {
          "content": "__________    3    __________",
          "itemType": "TEXT"
        }
      ]
    }
  },
  {
    "presetId": "flex-columns",
    "presetName": "Flex columns",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "flexContainer": {
          "flexDirection": "column",
          "gap": 10
        },
        "boxSizing": {
          "padding": "14px"
        }
      },
      "children": [
        {
          "content": "1",
          "itemType": "TEXT"
        },
        {
          "content": "2",
          "itemType": "TEXT"
        },
        {
          "content": "3",
          "itemType": "TEXT"
        }
      ]
    }
  },
  {
    "presetId": "holy-grail",
    "presetName": "Holy grail layout",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "flexContainer": {
          "flexDirection": "column",
          "gap": "8",
        },
        "boxSizing": {
          "padding": "10px"
        }
      },
      "key": "MfcOBkWs",
      "children": [
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "boxSizing": {
              "padding": "6px"
            }
          },
          "key": "qqFDrdxw"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": 8
            },
            "boxSizing": {
              "padding": "5px",
              "height": "100px"
            }
          },
          "key": "aBvkOlIv",
          "children": [
            {
              "itemType": "FLEX",
              "css": {
                "display": {
                  "display": "flex"
                },
                "flexContainer": {
                  "gap": 2
                },
                "boxSizing": {
                  "padding": "2px"
                },
                "flexItem": {
                  "flexGrow": 1,
                }
              },
              "key": "MeRucrVe"
            },
            {
              "itemType": "FLEX",
              "css": {
                "display": {
                  "display": "flex"
                },
                "flexContainer": {
                  "flexWrap": "nowrap",
                  "gap": "2",
                },
                "boxSizing": {
                  "padding": "2px"
                },
                "flexItem": {
                  "flexGrow": 2
                }
              },
              "key": "gqAngmoD"
            },
            {
              "itemType": "FLEX",
              "css": {
                "display": {
                  "display": "flex"
                },
                "flexContainer": {
                  "gap": 2
                },
                "boxSizing": {
                  "padding": "2px"
                },
                "flexItem": {
                  "flexGrow": 1
                }
              },
              "key": "WjBxoHUn"
            }
          ]
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "gap": 2
            },
            "boxSizing": {
              "padding": "6px",
            }
          },
          "key": "buMSVyjs",
        }
      ]
    }
  },
  {
    "presetId": 'align-items',
    "presetName": 'Align items',
    "presetDefinition": {
      "itemType": "FLEX",
      "children": [
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "gap": "10",
              "alignItems": "start",
            },
            "boxSizing": {
              "padding": "16px"
            }
          },
          "children": [
            {
              "content": "align-items: start",
              "itemType": "TEXT",
              "key": "BWrsCYXE",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "PfFTyeET",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "SKpxgBBJ",
              "children": []
            }
          ],
          "key": "xlvfDhLl"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "boxSizing": {
              "padding": "16px"
            },
            "flexContainer": {
              "gap": "10",
              "alignItems": "end",
            }
          },
          "children": [
            {
              "content": "align-items: end",
              "itemType": "TEXT",
              "key": "mCckeDTo",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "TLwnAJTv",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "ndgkJVZW",
              "children": []
            }
          ],
          "key": "cyUUeumu"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "boxSizing": {
              "padding": "16px"
            },
            "flexContainer": {
              "flexDirection": "row",
              "gap": "10",
              "alignItems": "stretch",
            }
          },
          "children": [
            {
              "content": "align-items: stretch",
              "itemType": "TEXT",
              "key": "ekjOmzUC",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "rrUAagFa",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "tCewMqjf",
              "children": []
            }
          ],
          "key": "WqfWCpXd"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "boxSizing": {
              "padding": "16px"
            },
            "flexContainer": {
              "gap": "10",
              "alignItems": "center"
            }
          },
          "children": [
            {
              "content": "align-items: center\n",
              "itemType": "TEXT",
              "key": "IQiQseSB",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "gkJUHvle",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "oktFWAYR",
              "children": []
            }
          ],
          "key": "jQeSgEqj"
        }
      ],
      "key": "dqJIuKDD",
      "css": {
        "display": {
          "display": "flex"
        },
        "boxSizing": {
          "height": "112px",
          "padding": "16px"
        },
        "flexContainer": {
          "gap": 10,
          "justifyContent": "center"
        }
      },
      "label": "justify-content"
    },
  },
  {
    "presetId": "justify-content",
    "presetName": "Justify content",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "boxSizing": {
          "padding": "16px"
        },
        "display": {
          "display": "flex"
        },
        "flexContainer": {
          "flexDirection": "row",
          "flexWrap": "nowrap",
          "gap": "10",
        }
      },
      "children": [
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": "10",
              "alignContent": "center"
            },
            "boxSizing": {
              "padding": "16px",
            },
            "flexItem": {
              "flexGrow": 1,
            }
          },
          "key": "SQjdYCnV",
          "children": [
            {
              "itemType": "TEXT",
              "content": "justify-content: start",
              "key": "HqUCjCHX",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "PkWCXqEx",
              "children": [],
              "label": "____________________ 1 ____________________asdf"
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "LJSHWxRt",
              "children": []
            }
          ],
          "label": "middle"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": "10",
              "justifyContent": "end",
            },
            "boxSizing": {
              "padding": "16px",
            },
            "flexItem": {
              "flexGrow": 1,
            }
          },
          "key": "fBMVCkjF",
          "children": [
            {
              "itemType": "TEXT",
              "content": "justify-content: end",
              "key": "yhDnPTgQ",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "WixfLyja",
              "children": [],
              "label": "____________________ 1 ____________________asdf"
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "vfwFJxJS",
              "children": []
            }
          ],
          "label": "end"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "boxSizing": {
              "padding": "16px"
            },
            "flexContainer": {
              "gap": "10",
              "justifyContent": "center",
            },
            "flexItem": {
              "flexGrow": 1
            }
          },
          "children": [
            {
              "content": "justify-content: center",
              "itemType": "TEXT",
              "key": "bHTgsRlG",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "UGKJPXot",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "IcxmZHsx",
              "children": []
            }
          ],
          "key": "KZCjoGQg"
        }
      ],
      "key": "TU5cxsc7",
      "label": "align-content"
    },
  },
  {
    "presetId": "align-content",
    "presetName": "Align content",
    "presetDefinition": {
      "itemType": "FLEX",
      "children": [
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": "10",
              "alignContent": "start"
            },
            "boxSizing": {
              "padding": "16px",
            }
          },
          "children": [
            {
              "content": "align-content: start",
              "itemType": "TEXT",
              "key": "qhfYzOeY",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "hpECNdqY",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "kPadpfGd",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "wVvbnIGa",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "jEwsWOYp",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "iPrUVBPZ",
              "children": []
            }
          ],
          "key": "hsCWLsql"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": "10",
              "alignContent": "end"
            },
            "boxSizing": {
              "padding": "16px",
            }
          },
          "children": [
            {
              "content": "align-content: end",
              "itemType": "TEXT",
              "key": "sBtUenky",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "YWBUfgfq",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "EklpGJBm",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "atfHKemL",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "GCvOAXlw",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "rPDOJOKt",
              "children": []
            }
          ],
          "key": "GXuYwptv"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": "10",
              "alignContent": "center"
            },
            "boxSizing": {
              "padding": "16px",
            }
          },
          "children": [
            {
              "content": "align-content: center",
              "itemType": "TEXT",
              "key": "ayWPJHHu",
              "children": []
            },
            {
              "content": "   ",
              "itemType": "TEXT",
              "key": "giphriWG",
              "children": []
            },
            {
              "content": "      ",
              "itemType": "TEXT",
              "key": "KqvKliKx",
              "children": []
            },
            {
              "content": "      ",
              "itemType": "TEXT",
              "key": "hwtKrgow",
              "children": []
            },
            {
              "content": "              ",
              "itemType": "TEXT",
              "key": "ItyKnyon",
              "children": []
            }
          ],
          "key": "oERFUVof"
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "flexDirection": "row",
              "flexWrap": "wrap",
              "gap": "10",
              "alignContent": "stretch"
            },
            "boxSizing": {
              "padding": "16px"
            }
          },
          "children": [
            {
              "content": "align-content: stretch",
              "itemType": "TEXT",
              "key": "zsoAhJku",
              "children": []
            },
            {
              "content": "   ",
              "itemType": "TEXT",
              "key": "TsdedDuv",
              "children": []
            },
            {
              "content": "      ",
              "itemType": "TEXT",
              "key": "BZoFUZye",
              "children": []
            },
            {
              "content": "      ",
              "itemType": "TEXT",
              "key": "kMPafMcr",
              "children": []
            },
            {
              "content": "              ",
              "itemType": "TEXT",
              "key": "UZkyAkrY",
              "children": []
            }
          ],
          "key": "EtDapdmV"
        }
      ],
      "key": "ylyrtZPv",
      "css": {
        "display": {
          "display": "flex"
        },
        "boxSizing": {
          "height": "150px",
          "padding": "16px"
        },
        "flexContainer": {
          "gap": 10,
          "justifyContent": "center"
        }
      },
      "label": "justify-content"
    },
  }
];
