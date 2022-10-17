# hiwin README

hiwin is a vscode extension to manage vscode window on ms-windows platform, it offers the control of opacity, size, position, z-mode, max/minimize about window.

auto set windows properties when the vscode window is open.
    "hiWin.auto-load": true

``` json
{
    "hinWin.properties.opacity": {
        "type": "integer",
        "minimum": 180,
        "maximum": 255
    },
    "hinWin.properties.z-order": {
        "type": "string",
        "enum": [
        "bottom",
        "no top most",
        "top",
        "top most"
        ],
        "enumDescriptions": [
        "Place vscode window at bottom",
        "Place vscode window above non-topmost windows",
        "Place vscode window above all",
        "Set vscode window as top most layer"
        ]
    },
    "hinWin.properties.show": {
        "type": "string",
        "enum": [
        "hide",
        "maximize",
        "minimize",
        "activate"
        ],
        "enumDescriptions": [
        "Hide the vscode window",
        "Maximize the vscode window",
        "Minimize the vscode window",
        "Activate the vscode window"
        ]
    },
    "hinWin.properties.pos-and-size": {
        "type": [
        "array",
        "null"
        ],
        "properties": {
        "type": "integer"
        },
        "minItems": 4,
        "maxItems": 4,
        "default": null
    }
}
```

for example
``` json
{
    "hiWin.properties": {
        "hinWin.properties.opacity": 220,
        "hinWin.properties.z-order": "top most",
        "hinWin.properties.show": "activate",
        "hinWin.properties.pos-and-size": [
            0,
            0,
            750,
            500
        ]
    }

}
```

using command `hiWin: Update Window properties` to update window
