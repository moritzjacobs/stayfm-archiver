# stayfm-archiver
Batch download m4a and metadata from the stayfm mixclound archive

## Usage
Edit `.env`, then `npm run start`.

## Crontab

`0 * * * * node /home/<user>/stayfm-archiver/index.js >> /home/<user>/crontab.log 2>&1`