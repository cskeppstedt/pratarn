# Pratarn

Just a stupid discord bot, nothing to see here.

## Deployment

I forget how this works between deploys, so this is mostly a reminder for me.
The bot runs on a Raspberry Pi, and deploys are managed by
[piku](https://github.com/piku/piku). This works by having a git remote set
up pointing to the Raspberry Pi, with an application suffix. For instance:

```sh
$ git remote add piku piku@192.168.1.123:pratarn
```

Then, push the main branch to that remote:

```sh
$ git push piku main
```

The build- and run tasks are defined in the [Procfile](./Procfile).
