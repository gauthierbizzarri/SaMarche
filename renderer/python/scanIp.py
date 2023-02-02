import os
import subprocess
import time
import nmap
import win32api, win32con, win32event, win32process
from win32com.shell.shell import ShellExecuteEx
from win32com.shell import shellcon
import socket


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # envoi d'un paquet à google pour obtenir l'adresse ip
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except:
        ip = ''
    finally:
        s.close()

    return ip

def get_mask():
    ip = get_ip()
    mask = ip[:ip.rfind('.')+1] + '0/24'
    return mask





import sys, os, traceback, types

def isUserAdmin():

    if os.name == 'nt':
        import ctypes
        # WARNING: requires Windows XP SP2 or higher!
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            traceback.print_exc()
            print("Admin check failed, assuming not an admin.")
            return False
    elif os.name == 'posix':
        # Check for root on Posix
        return os.getuid() == 0
    else:
        raise RuntimeError("Unsupported operating system for this module: %s" % (os.name,))

def runAsAdmin(cmdLine=None, wait=True):

    if os.name != 'nt':
        raise RuntimeError("This function is only implemented on Windows.")



    python_exe = sys.executable

    if cmdLine is None:
        cmdLine = [python_exe] + sys.argv
    elif type(cmdLine) not in (types.TupleType,types.ListType):
        raise ValueError("cmdLine is not a sequence.")
    cmd = '"%s"' % (cmdLine[0],)
    # XXX TODO: isn't there a function or something we can call to massage command line params?
    params = " ".join(['"%s"' % (x,) for x in cmdLine[1:]])
    cmdDir = ''
    showCmd = win32con.SW_SHOWNORMAL
    #showCmd = win32con.SW_HIDE
    lpVerb = 'runas'  # causes UAC elevation prompt.

    # print "Running", cmd, params

    # ShellExecute() doesn't seem to allow us to fetch the PID or handle
    # of the process, so we can't get anything useful from it. Therefore
    # the more complex ShellExecuteEx() must be used.

    # procHandle = win32api.ShellExecute(0, lpVerb, cmd, params, cmdDir, showCmd)

    procInfo = ShellExecuteEx(nShow=showCmd,
                              fMask=shellcon.SEE_MASK_NOCLOSEPROCESS,
                              lpVerb=lpVerb,
                              lpFile=cmd,
                              lpParameters=params)


    if wait:
        procHandle = procInfo['hProcess']
        obj = win32event.WaitForSingleObject(procHandle, win32event.INFINITE)
        rc = win32process.GetExitCodeProcess(procHandle)
        print("Process handle %s returned code %s" % (procHandle, rc))
        print("Scanning...")
        print(get_mask())
        results = nmap.nmap_os_detection(get_mask())
        # result = nmap.scan_top_ports(get_mask())
        print("Scanning done.")
        print(results)
    else:
        rc = None

    return rc

def test():
    rc = 0
    if not isUserAdmin():
        rc = runAsAdmin()
    else:
        nmap = nmap3.Nmap()
        print("Scanning...")
        print(get_mask())
        results = nmap.nmap_os_detection(get_mask())
        # result = nmap.scan_top_ports(get_mask())
        print("Scanning done.")
        print(results)
        rc = 0
    return rc


if __name__ == "__main__":
    test()

