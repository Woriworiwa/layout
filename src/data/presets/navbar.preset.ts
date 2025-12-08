export const navbarPreset =
  {
    "presetId": "navbar",
    "presetName": "Navigation bar",
    "presetDefinition": {
      "itemType": "FLEX",
      "css": {
        "display": {
          "display": "flex"
        },
        "flexContainer": {
          "flexDirection": "row",
          "justifyContent": "space-between",
          "alignItems": "center",
          "gap": "16"
        },
        "boxSizing": {
          "padding": "12px 20px"
        }
      },
      "children": [
        {
          "content": "Logo",
          "itemType": "TEXT",
          "css": {
            "typography": {
              "fontSize": "20px",
              "fontWeight": "bold"
            }
          }
        },
        {
          "itemType": "FLEX",
          "css": {
            "display": {
              "display": "flex"
            },
            "flexContainer": {
              "gap": "20"
            }
          },
          "children": [
            {
              "content": "Home",
              "itemType": "TEXT"
            },
            {
              "content": "About",
              "itemType": "TEXT"
            },
            {
              "content": "Contact",
              "itemType": "TEXT"
            }
          ]
        }
      ]
    }
  }
