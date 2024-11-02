import argparse
import json
import AO3

PARSER_DESC = """Extract the subscriptions associated with an Ao3 account and
the stories that they belong to."""

parser = argparse.ArgumentParser(description=PARSER_DESC)

parser.add_argument(
    "--username", "-u",
    help="The username to log into Ao3 with", required=True)
parser.add_argument(
    "--password", "-p",
    help="The password to log into Ao3 with", required=True)
parser.add_argument(
    "--output", "-o",
    help="The path to the output JSON file", required=True)

args = parser.parse_args()

ao3_session = AO3.Session(args.username, args.password)
subscriptions = ao3_session.get_subscriptions()
json_subs = {
  "works": [],
  "users": [],
  "series": []
}

for sub in subscriptions:
  print(f"Looking up: {sub}")
  sub.set_session(ao3_session)
  try:
    if isinstance(sub, AO3.Work):
        sub.reload(load_chapters=False)
        json_subs["works"].append({
          "id": sub.id,
          "title": sub.title,
          "summary": sub.summary,
          "fandoms": sub.fandoms,
          "relationships": sub.relationships,
          "characters": sub.characters,
          "tags": sub.tags,
          "categories": sub.categories,
          "warnings": sub.warnings,
          "rating": sub.rating,
          "status": sub.status,
          "kudos": sub.kudos,
          "words": sub.words,
          "url": sub.url
        })
    elif isinstance(sub, AO3.User):
      sub.reload()
      json_subs["users"].append({
        "username": sub.username,
        "url": sub.url
      })
    elif isinstance(sub, AO3.Series):
      sub.reload()
      json_subs["series"].append({
        "name": sub.name,
        "description": sub.description,
        "url": sub.url
      })
  except Exception:
    print(f"Unable to find work details for {sub}")

with open(args.output, 'w') as f:
  json.dump(json_subs, f)
