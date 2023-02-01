import os

def enable():
    command = "netsh wlan disconnect interface={}".format("Wi-Fi")
    os.system(command)

enable()