# AO3 Exporter

This project is for exporting and displaying information from the Archive of our Own subscription
page without having to trawl through individual links to find which story you are looking for.

Ao3 currently has a subscription page which lists the links to the different works, series, and
users that a user is subscribed to. This project pulls all of that information out and then enriches
the information for display on a webpage.

As such, there are two parts to this project.

## Ao3 data extraction

To run this, first run the following to set up a virtualenv and the environment for running the
commands:

```bash
python -m venv venv
. ./venv/bin/activate
pip install -r requirements.txt
```

Once the environment has been set up, run the following:

```bash
python exporter/extract-subscriptions.py --username <your ao3 username> --password <your ao3 password> --output web/data/subs.json
```

If this run is partially successful due to rate limiting restrictions, the following can be run to
continue on from where the first job left off:

```bash
python exporter/extract-subscriptions.py --username <your ao3 username> --password <your ao3 password> --output web/data/subs.json --database web/data/subs.json
```

## Web filter view

Once the report has been extracted in the steps above, the single-page website can be used to
traverse its contents. The website can be found in the `web` subdirectory. Run the following to set
it up as required:

> The project uses nvm to manage the verison of node that is being requested. At the moment, it is
> set to the rolling LTS version.

```bash
cd web
npm i
npm run start
```

By default, the app starts on http://localhost:8092
