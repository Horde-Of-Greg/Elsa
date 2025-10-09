# Elsa Discord Bot

# Get the bot running

## 1. Clone the repo
```bash
git clone git@github.com:Horde-Of-Greg/Elsa-Discord-Tag-Bot.git
```
## 2. Set up a PG DB the bot can use
Use docker, figure it out. I'll explain more, mabye.
## 3. Copy the config templates to their respective files

### Bash:

```bash
find . -name '*.template' -exec sh -c 'cp "$0" "${0%.template}"' {} \;
```

### Powershell:

Figure it out lol

## 4. Set up the configs
Edit the values in the `.env` (required) and the configs (optional)
## 5. Run the bot
Run `npm start` (or `npm run dev` if you're in a dev env)
