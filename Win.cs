using System;
using System.Runtime.InteropServices;
using System.Diagnostics;

using Windows;

namespace Hi
{
    public static class Win
    {
        public static bool SetProperties(int pid, byte alpha, Windows.HWND z, Windows.SW show, Windows.SWP swp, int x, int y, int cx, int cy)
        {
            Process mainproc = Process.GetProcessById(pid);
            foreach (Process proc in Process.GetProcessesByName(mainproc.ProcessName))
            {
                if (proc.StartInfo.FileName != mainproc.StartInfo.FileName) { continue; }

                IntPtr hMainWnd = proc.MainWindowHandle;
                if (hMainWnd == IntPtr.Zero) { continue; }

                uint tid = User32.GetWindowThreadProcessId(hMainWnd, out pid);
                bool result = User32.EnumThreadWindows(tid, delegate(IntPtr hWnd, IntPtr lParam) {
                    if (!User32.IsWindowVisible(hWnd)) { return true; }
                    WS windowLong = User32.GetWindowLong(hWnd, GWL.EXSTYLE);
                    User32.SetWindowLong(hWnd, GWL.EXSTYLE, windowLong | WS.EX_LAYERED);

                    return User32.ShowWindow(hWnd, show) && User32.SetLayeredWindowAttributes(hWnd, 0, alpha, LWA.ALPHA) && User32.SetWindowPos(hWnd, z, x, y, cx, cy, swp);
                }, IntPtr.Zero);

                if (!result) { return false; }
            }
            return true;
        }
    }
}

namespace Windows
{
    internal static class User32
    {
        public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        [DllImport("user32.dll")]
        public static extern bool EnumThreadWindows(uint dwThreadId, EnumWindowsProc lpEnumFunc, IntPtr lParam);

        [DllImport("user32.dll")]
        public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);

        [DllImport("user32.dll")]
        public static extern bool IsWindowVisible(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern WS GetWindowLong(IntPtr hWnd, GWL nIndex);

        [DllImport("user32.dll")]
        public static extern int SetWindowLong(IntPtr hWnd, GWL nIndex, WS dwNewLong);

        [DllImport("user32.dll")]
        public static extern bool SetLayeredWindowAttributes(IntPtr hWnd, uint crKey, byte bAlpha, LWA dwFlags);

        [DllImport("user32.dll")]
        public static extern bool SetWindowPos(IntPtr hWnd, HWND hWndInsertAfter, int X, int Y, int cx, int cy, SWP uFlags);

        [DllImport("user32.dll")]
        public static extern bool  ShowWindow(IntPtr hWnd, SW nCmdShow);
    }


    public enum SW: int
    {
        HIDE = 0,
        MINIMIZE = 2,
        MAXIMIZE = 3,
        ACTIVATE = 5,
    }

    public enum HWND: int
    {
        BOTTOM = 1,
        NOTOPMOST = -2,
        TOP = 0,
        TOPMOST = -1,
    }

    public enum SWP: uint
    {
        NOMOVE = 0x0002,
        NOSIZE = 0x0001,
        ZORDER = NOSIZE | NOMOVE,
        NOZORDER = 0x0004,
        SHOWWINDOW = 0x0040,
    }

    public enum GWL: int
    {
        EXSTYLE = -20,
        HINSTANCE = -6,
        HWNDPARENT = -8,
        ID = -12,
        STYLE = -16,
        USERDATA = -21,
        WNDPROC = -4,
    }

    [Flags]
    public enum WS: int
    {
        EX_LAYERED = 0x80000,
    }

    public enum LWA: int
    {
        COLORKEY = 1,
        ALPHA = 2,
    }
}
