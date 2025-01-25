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
              "alignItems": "start"
            },
            "boxSizing": {
              "padding": "16px"
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "hHNDNlVG",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "KuLFrfCn",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "GwckpCsH",
              "children": []
            }
          ],
          "key": "CUPguPaI",
          "label": "start"
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
              "alignItems": "end"
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "pPucTprP",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "Ogmvtylb",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "LRWlvVVV",
              "children": []
            }
          ],
          "key": "UfnmmoHX",
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
              "flexDirection": "row",
              "gap": "10",
              "alignItems": "stretch"
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "VPufEqxl",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "NNlgYEtd",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "bFWDuims",
              "children": []
            }
          ],
          "key": "NQDbvJmd",
          "label": "stretch"
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
              "content": "",
              "itemType": "TEXT",
              "key": "gtfBHByb",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "cdhPJlzZ",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "YlgwcSfc",
              "children": []
            }
          ],
          "key": "AjeUyILQ",
          "label": "center"
        }
      ],
      "key": "TcMxAZvE",
      "css": {
        "display": {
          "display": "flex"
        },
        "boxSizing": {
          "height": "100px",
          "padding": "16px"
        },
        "flexContainer": {
          "gap": 10,
          "justifyContent": "center"
        }
      },
      "label": "align-items"
    }
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
          "gap": "10"
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
              "justifyContent": "start"
            },
            "boxSizing": {
              "padding": "16px"
            },
            "flexItem": {
              "flexGrow": 1
            }
          },
          "key": "RpitIDkg",
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "uuYgbBcP",
              "children": [],
              "label": "s"
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "qShloWjl",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "DhoAAixA",
              "children": []
            }
          ],
          "label": "start"
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
              "justifyContent": "end"
            },
            "boxSizing": {
              "padding": "16px"
            },
            "flexItem": {
              "flexGrow": 1
            }
          },
          "key": "bbjgFMgH",
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "QlaCRNod",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "tWtJSRTK",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "ksFIzJLC",
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
              "justifyContent": "center"
            },
            "flexItem": {
              "flexGrow": 1
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "myzorIDv",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "HkPqKape",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "ymRedXtF",
              "children": []
            }
          ],
          "key": "AVaSIjvF",
          "label": "center"
        }
      ],
      "key": "iVfyzObW",
      "label": "justify-content"
    }
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
              "padding": "16px"
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "LwZmtBts",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "ZkDPgzGk",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "eLYcbMZD",
              "children": []
            }
          ],
          "key": "acKpEiBg",
          "label": "start"
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
              "padding": "16px"
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "ATnsMCmv",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "owVFUgHB",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "lbzRxhpn",
              "children": []
            }
          ],
          "key": "tsmgmhjN",
          "label": "end"
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
              "padding": "16px"
            }
          },
          "children": [
            {
              "content": "",
              "itemType": "TEXT",
              "key": "CkUhRzEp",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "nKZMhksA",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "ipgDzMpk",
              "children": []
            }
          ],
          "key": "FoiogCiL",
          "label": "center"
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
              "content": "",
              "itemType": "TEXT",
              "key": "MApNvVpZ",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "NgtxiKSa",
              "children": []
            },
            {
              "content": "",
              "itemType": "TEXT",
              "key": "cvVZxyTC",
              "children": []
            }
          ],
          "key": "RVyIZJGA",
          "label": "stretch"
        }
      ],
      "key": "NkyhLbIa",
      "css": {
        "display": {
          "display": "flex"
        },
        "boxSizing": {
          "height": "100px",
          "padding": "16px"
        },
        "flexContainer": {
          "gap": 10,
          "justifyContent": "center"
        }
      },
      "label": "align-content"
    }
  }
];
