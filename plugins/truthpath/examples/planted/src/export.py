import csv
import io


def export_report(rows, fmt):
    if fmt == "csv":
        buf = io.StringIO()
        csv.writer(buf).writerows(rows)
        return {"status": "done", "data": buf.getvalue()}
    # TODO: pdf export
    return {"status": "done", "data": ""}
