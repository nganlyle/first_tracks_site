"""
Fetches the Airbnb iCal export for this listing and writes a small
data/busy-dates.json file that the site's calendar widget reads.

Reads the feed URL from the AIRBNB_ICAL_URL environment variable so the
real URL never has to be committed to the repo.
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone

ICAL_URL = os.environ.get("AIRBNB_ICAL_URL")
OUTPUT_PATH = os.path.join("data", "busy-dates.json")


def fetch_ical(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def parse_events(ics_text):
    """Pull DTSTART/DTEND date pairs out of each VEVENT block.

    Airbnb's export uses all-day, date-only values (VALUE=DATE:20260115),
    so this looks for 8-digit date stamps rather than full datetimes.
    """
    # Un-fold RFC5545 continuation lines (a leading space/tab means
    # "this line is a continuation of the previous one").
    ics_text = re.sub(r"\r\n[ \t]", "", ics_text)
    ics_text = re.sub(r"\n[ \t]", "", ics_text)

    events = []
    for block in re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", ics_text, re.S):
        start_match = re.search(r"DTSTART[^:\n]*:(\d{8})", block)
        end_match = re.search(r"DTEND[^:\n]*:(\d{8})", block)
        if start_match and end_match:
            start, end = start_match.group(1), end_match.group(1)
            events.append({
                "start": f"{start[0:4]}-{start[4:6]}-{start[6:8]}",
                "end": f"{end[0:4]}-{end[4:6]}-{end[6:8]}",
            })
    return events


def main():
    if not ICAL_URL:
        print("AIRBNB_ICAL_URL is not set. Add it as a repo secret — "
              "writing an empty calendar for now.")
        events = []
    else:
        try:
            ics_text = fetch_ical(ICAL_URL)
            events = parse_events(ics_text)
        except Exception as exc:  # noqa: BLE001 — want to log and fail the run
            print(f"Failed to fetch or parse the iCal feed: {exc}", file=sys.stderr)
            sys.exit(1)

    os.makedirs("data", exist_ok=True)
    payload = {
        "generated": True,
        "updated": datetime.now(timezone.utc).isoformat(),
        "busy": events,
    }
    with open(OUTPUT_PATH, "w") as f:
        json.dump(payload, f, indent=2)

    print(f"Wrote {len(events)} busy date range(s) to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
