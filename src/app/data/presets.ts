export const textPresets = [
  {
    "presetId": "short-text",
    "presetName": "short text",
    "presetDefinition": {
      "itemType": "TEXT",
      "content": "lorem"
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
        "flexContainer": {
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
        "flexContainer": {
          "gap": 10
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
  }
];
