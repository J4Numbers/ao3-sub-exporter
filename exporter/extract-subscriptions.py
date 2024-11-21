import argparse
import json
import time

import AO3


def populate_work(work_to_populate, bookmark_flag, subscription_flag):
  time.sleep(1)
  work_to_populate.reload(load_chapters=False)
  return {
    "id": work_to_populate.id,
    "title": work_to_populate.title,
    "summary": work_to_populate.summary,
    "bookmarked": bookmark_flag,
    "subscribed": subscription_flag,
    "fandoms": work_to_populate.fandoms,
    "relationships": work_to_populate.relationships,
    "characters": work_to_populate.characters,
    "tags": work_to_populate.tags,
    "categories": work_to_populate.categories,
    "warnings": work_to_populate.warnings,
    "rating": work_to_populate.rating,
    "status": work_to_populate.status,
    "kudos": work_to_populate.kudos,
    "words": work_to_populate.words,
    "url": work_to_populate.url
  }

def dict_contains_match(list_of_items, item_to_search_for):
  return len(
      list(
          filter(
              lambda work: work["id"] == item_to_search_for.id,
              list_of_items))) > 0

def obj_contains_match(list_of_items, item_to_search_for):
  return len(
      list(
          filter(
              lambda work: work.id == item_to_search_for.id,
              list_of_items))) > 0

PARSER_DESC = """Extract the subscriptions associated with an Ao3 account and
the stories that they belong to."""

parser = argparse.ArgumentParser(description=PARSER_DESC)

parser.add_argument(
    "--username", "-u",
    help="The username to log into Ao3 with", required=True)
parser.add_argument(
    "--password", "-p",
    help="The password to log into Ao3 with", required=True)
parser.add_argument("--database", "--db",
    help="The input database file containing all we know already", required=False)
parser.add_argument(
    "--output", "-o",
    help="The path to the output JSON file", required=True)

args = parser.parse_args()

ao3_session = AO3.Session(args.username, args.password)
subscriptions = ao3_session.get_subscriptions()
bookmarks = ao3_session.get_bookmarks()

json_subs = {
  "works": [],
  "users": [],
  "series": []
}

if args.database:
  with open(args.database) as f:
    json_subs = json.load(f)

count = 0

for sub in subscriptions:
  count += 1
  print(f"Looking up: {sub} - {count}/{len(subscriptions)}")
  sub.set_session(ao3_session)
  try:
    if isinstance(sub, AO3.Work):
      if not dict_contains_match(json_subs["works"], sub):
        bookmark_flag = obj_contains_match(bookmarks, sub)

        sub.reload(load_chapters=False)
        json_subs["works"].append(
            populate_work(sub, bookmark_flag, True))
      else:
        print(f"Already stored {sub}")
    elif isinstance(sub, AO3.User):
      if not dict_contains_match(json_subs["users"], sub):
        sub.reload()
        json_subs["users"].append({
          "id": sub.id,
          "username": sub.username,
          "url": sub.url
        })
      else:
        print(f"Already stored {sub}")
    elif isinstance(sub, AO3.Series):
      if not dict_contains_match(json_subs["series"], sub):
        sub.reload()
        json_subs["series"].append({
          "id": sub.id,
          "name": sub.name,
          "description": sub.description,
          "url": sub.url
        })
      else:
        print(f"Already stored {sub}")
  except Exception as ex:
    print(f"Unable to find work details for {sub} :: {ex}")

count = 0
for bookmark in bookmarks:
  count += 1
  try:
    if not dict_contains_match(json_subs["works"], bookmark):
      print(f"Looking up bookmark {bookmark} - {count}/{len(bookmarks)}")
      json_subs["works"].append(
          populate_work(bookmark, True, False))
  except Exception as ex:
    print(f"Unable to find work details for {bookmark} :: {ex}")

with open(args.output, 'w') as f:
  json.dump(json_subs, f)
