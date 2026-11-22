import os

from .fakes import FakeWarehouse


def get_client():
    if os.environ.get("WAREHOUSE_URL"):
        from .real import WarehouseClient
        return WarehouseClient(os.environ["WAREHOUSE_URL"])
    return FakeWarehouse()
