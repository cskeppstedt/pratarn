# Pratarn

Just a stupid discord bot, nothing to see here.

## Deployment

I forget how this works between deploys, so this is mostly a reminder for me.
The bot runs on a Raspberry Pi, and deploys are managed by
[piku](https://github.com/piku/piku). This works by having a git remote set
up pointing to the Raspberry Pi, with an application suffix. You also
need to register your dev machine's public key as a trusted piku deployer.

1. Make sure you have a ssh keypair on your dev machine.
2. SSH to the pi, e.g. `$ ssh pi@192.168.11.50`
3. Change user to piku `$ sudo su - piku`
4. Store the public key of your dev machine in a file, for instance `tmp.pub`
5. Authorize the key for piku operations: `$ python3 piku.py setup:ssh tmp.pub`
6. In your github repo, add piku as a remote: `$ git remote add piku piku@192.168.11.50:pratarn`

Then, push the main branch to that remote to deploy the application:

```sh
$ git push piku main
```

The build- and run tasks are defined in the [Procfile](./Procfile).
