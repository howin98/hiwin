# hiwin README

hiwin is a vscode extension to manage vscode window on ms-windows platform, it offers the control of opacity, size, position, z-mode, max/minimize about window.

``` json
{
    "hiWin.properties": {
        "hinWin.properties.opacity": 220,
        "hinWin.properties.z-order": "top most",
        "hinWin.properties.show": "activate",
        "hinWin.properties.pos-and-size": [
            0, // window position x
            0, // window position y
            750, // window length
            500  // window height
        ]
    }

}
```

using command `hiWin: Update Window properties` to update window
