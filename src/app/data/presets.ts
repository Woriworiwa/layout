export const textPresets = [
  {
    "presetId": "short-text",
    "presetName": "short text",
    "presetDefinition": {
      "itemType": "TEXT",
      "label": "lorem"
    }
  }
];

export const flexPresets = [
  {
    "presetId": "empty-flex",
    "presetName": "empty Flex",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "flex": {
          "gap": 10
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
        "flex": {
          "gap": 10
        }
      },
      "children": [
        {
          "label": "__    1   ____",
          "itemType": "TEXT"
        },
        {
          "label": "_____    2    ______",
          "itemType": "TEXT"
        },
        {
          "label": "__________    3    __________",
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
        "flex": {
          "flexDirection": "column",
          "gap": 10
        }
      },
      "children": [
        {
          "label": "1",
          "itemType": "TEXT"
        },
        {
          "label": "2",
          "itemType": "TEXT"
        },
        {
          "label": "3",
          "itemType": "TEXT"
        }
      ]
    }
  }
];
