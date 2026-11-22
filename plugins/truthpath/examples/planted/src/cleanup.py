import os


def remove_temp(path):
    try:
        os.remove(path)
    except FileNotFoundError:
        pass
