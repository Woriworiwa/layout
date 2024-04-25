export const textPresets = [
  {
    "presetId": "short-text",
    "presetName": "short text",
    "presetDefinition": {
      "frameType": "TEXT",
      "name": "lorem"
    }
  }
];

export const flexPresets = [
  {
    "presetId": "empty-flex",
    "presetName": "empty Flex",
    "presetDefinition": {
      "frameType": "FLEX",
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
      "frameType": "FLEX",
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
          "name": "__    1   ____",
          "frameType": "TEXT"
        },
        {
          "name": "_____    2    ______",
          "frameType": "TEXT"
        },
        {
          "name": "__________    3    __________",
          "frameType": "TEXT"
        }
      ]
    }
  },
  {
    "presetId": "flex-columns",
    "presetName": "Flex direction columns",
    "presetDefinition": {
      "frameType": "FLEX",
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
          "name": "1",
          "frameType": "TEXT"
        },
        {
          "name": "2",
          "frameType": "TEXT"
        },
        {
          "name": "3",
          "frameType": "TEXT"
        }
      ]
    }
  }
];
