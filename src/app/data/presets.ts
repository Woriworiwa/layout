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
          "padding": "6px"
        }
      },
    }
  },
  {
    "presetId": "flex-rows",
    "presetName": "Flex direction rows",
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
          "padding": "6px"
        }
      },
      "children": [
        {
          "content": "__    1   ____",
          "itemType": "TEXT"
        },
        {
          "content": "_____    2    ______",
          "itemType": "TEXT"
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
    "presetName": "Flex direction columns",
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
          "padding": "6px"
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
          "gap": 2
        },
        "boxSizing": {
          "padding": "6px"
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
              "padding": "2px"
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
              "gap": 2
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
              "padding": "2px",
            }
          },
          "key": "buMSVyjs",
        }
      ]
    }
  }
];
