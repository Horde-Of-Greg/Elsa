# Elsa Discord Bot

# Get the bot running

1. Clone the repo
2. Set up a PG DB the bot can use
3. Copy the config templates to their respective files

### Bash:

```bash
find . -name '*.template' -exec sh -c 'cp "$0" "${0%.template}"' {} \;
```

### Powershell:

Figure it out lol
4. Edit the values in the `.env` (required) and the configs (optional)
5. Run `npm start` (or `npm run dev` if you're in a dev env)
