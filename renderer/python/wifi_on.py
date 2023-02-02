import os

def enable():
    name_of_router = "IMERIR"
    os.system(f'''cmd /c "netsh wlan connect name={name_of_router}"''')

enable()