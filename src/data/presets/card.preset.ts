export const cardPreset =
  {
    "presetId": "card",
    "presetName": "Card",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "flexContainer": {
          "flexDirection": "column",
          "gap": "12"
        },
        "boxSizing": {
          "padding": "20px",
          "width": "250px"
        },
        "border": {
          "borderRadius": "8px"
        }
      },
      "children": [
        {
          "content": "Card Title",
          "itemType": "TEXT",
          "css": {
            "typography": {
              "fontSize": "18px",
              "fontWeight": "600"
            }
          }
        },
        {
          "content": "Card description goes here. This is a sample card layout with title and content.",
          "itemType": "TEXT",
          "css": {
            "typography": {
              "fontSize": "14px"
            }
          }
        },
        {
          "content": "Action",
          "itemType": "TEXT",
          "css": {
            "boxSizing": {
              "padding": "8px 16px"
            },
            "border": {
              "borderRadius": "4px"
            }
          }
        }
      ]
    }
  };
