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
parser.add_argument("--database", "--db",
    help="The input database file containing all we know already", required=False)
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

if args.database:
  with open(args.database) as f:
    json_subs = json.load(f)

for sub in subscriptions:
  print(f"Looking up: {sub}")
  sub.set_session(ao3_session)
  try:
    if isinstance(sub, AO3.Work):
      if len(list(filter(lambda work: work["id"] == sub.id, json_subs["works"]))) == 0:
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
      else:
        print(f"Already stored {sub}")
    elif isinstance(sub, AO3.User):
      if len(list(filter(lambda usr: usr["id"] == sub.id, json_subs["users"]))) == 0:
        sub.reload()
        json_subs["users"].append({
          "id": sub.id,
          "username": sub.username,
          "url": sub.url
        })
      else:
        print(f"Already stored {sub}")
    elif isinstance(sub, AO3.Series):
      if len(list(filter(lambda series: series["id"] == sub.id, json_subs["series"]))) == 0:
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

with open(args.output, 'w') as f:
  json.dump(json_subs, f)
