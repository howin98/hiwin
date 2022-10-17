import * as vscode from "vscode";

enum SWP {
  NOMOVE = 0x0002,
  NOSIZE = 0x0001,
  ZORDER = NOSIZE | NOMOVE,
  NOZORDER = 0x0004,
  SHOWWINDOW = 0x0040,
}

enum HWND {
  BOTTOM = 1,
  NOTOPMOST = -2,
  TOP = 0,
  TOPMOST = -1,
}

enum SW {
  HIDE = 0,
  MINIMIZE = 2,
  MAXIMIZE = 3,
  ACTIVATE = 5,
}

class HiWinProperties {
  "hinWin.properties.opacity": number;
  "hinWin.properties.z-order": string;
  "hinWin.properties.show": string;
  "hinWin.properties.pos-and-size": Array<number> | undefined;

  static convertOpacity(opacity: number = 255): number {
    return opacity;
  }

  static convertZOrder(zOrder: string = "no top most"): HWND {
    switch (zOrder) {
      case "bottom":
        return HWND.BOTTOM;
      case "top":
        return HWND.TOP;
      case "top most":
        return HWND.TOPMOST;
      case "no top most":
      default:
        return HWND.NOTOPMOST;
    }
  }

  static convertShow(show: string = "activate"): SW {
    switch (show) {
      case "hide":
        return SW.HIDE;
      case "minimize":
        return SW.MINIMIZE;
      case "maximize":
        return SW.MAXIMIZE;
      case "activate":
      default:
        return SW.ACTIVATE;
    }
  }

  static convertPosAndSize(pos_and_size: Array<number> | undefined): {
    swp: SWP;
    x: number;
    y: number;
    cx: number;
    cy: number;
  } {
    if (pos_and_size && pos_and_size.length == 4) {
      return {
        swp: SWP.SHOWWINDOW,
        x: pos_and_size[0],
        y: pos_and_size[1],
        cx: pos_and_size[2],
        cy: pos_and_size[3],
      };
    }
    return { swp: SWP.ZORDER, x: 0, y: 0, cx: 0, cy: 0 };
  }
}

class WinManagement {
  private static instance: WinManagement;

  private config: HiWinProperties | undefined;
  private constructor() {}

  public static getInstance() {
    if (!WinManagement.instance) {
      WinManagement.instance = new WinManagement();
    }
    return WinManagement.instance;
  }

  private updateConfig() {
    this.config = vscode.workspace
      .getConfiguration("hiWin")
      .get<HiWinProperties>("properties");
  }
  private getOpacity(): number {
    return HiWinProperties.convertOpacity(
      this.config?.["hinWin.properties.opacity"]
    );
  }

  private getZorder(): HWND {
    return HiWinProperties.convertZOrder(
      this.config?.["hinWin.properties.z-order"]
    );
  }

  private getShow(): SW {
    return HiWinProperties.convertShow(this.config?.["hinWin.properties.show"]);
  }

  private getPosAndSize(): {
    swp: SWP;
    x: number;
    y: number;
    cx: number;
    cy: number;
  } {
    return HiWinProperties.convertPosAndSize(
      this.config?.["hinWin.properties.pos-and-size"]
    );
  }

  public async apply(context: vscode.ExtensionContext, path: string) {
    this.updateConfig();
    if (this.config) {
      let { swp, x, y, cx, cy } = this.getPosAndSize();

      const shell = require("node-powershell");
      const ps = new shell({
        executionPolicy: "RemoteSigned",
        noProfile: true,
      });

      context.subscriptions.push(ps);

      ps.addCommand("[Console]::OutputEncoding = [Text.Encoding]::UTF8");
      ps.addCommand(`Add-Type -Path '${path}'`);
      ps.addCommand(
        `[Hi.Win]::SetProperties(${
          process.pid
        }, ${this.getOpacity()}, ${this.getZorder()}, ${this.getShow()}, ${swp}, ${x}, ${y}, ${cx}, ${cy})`
      );

      await ps.invoke();
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  const path: string = context.asAbsolutePath("./Win.cs");
  // Initialize Vs Code window
  if (vscode.workspace.getConfiguration("hiWin").get<boolean>("auto-load")) {
    WinManagement.getInstance().apply(context, path);
  } else {
    WinManagement.getInstance();
  }

  // Register command
  let disposable = vscode.commands.registerCommand(
    "hiWin.updateWin",
    async () => {
      await WinManagement.getInstance().apply(context, path);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
