---
title: "Basic commands"
date: 2025-07-02
categories: []
tags: [Git, PowerShell, Jekyll, Nao]
layout: single
author_profile: true
toc: true
toc_sticky: true
---

A small collection of commands, tools, etc., i frequently have to do.

# Git

## Config

### email address
 Configure globally the noreply email address for the [github](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address). You can find the private address on [this](https://github.com/settings/emails) page. 
```
git config --global user.email "aloksethi@users.noreply.github.com"
```
- add the key for ssh access to github [instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

### difftool

The .gitconfig file in the home directory corresponds to the '--global' option in `git config`. All the current options can be listed via `git config --global -l`
```
vim ~/.gitconfig 

# Add the following to your .gitconfig file.
[diff]
    tool = meld
[difftool]
    prompt = false
[difftool "meld"]
    cmd = meld "$LOCAL" "$REMOTE"

```
### Saving password
* When on linux/WSL 
`git config --local credential.helper 'cache --timeout=3600000'`

## Making a remote repo on the server

* Made a bare copy of the local repo. ` git clone --bare mlab_code git_repo.git`. `mlab_code` is the name of my local folder in which I did `git init`.
* Copied the `git_repo.git` to the remote server via scp. `scp -r git_repo.git USER_NAME@SERVER_NAME:/research/rftrx/library/`.
* Went to the remote server where the empty repo was copied and initialize it again using the shared option. `git init --bare --shared`.
* At the local machine, added the remote repository as a remote ` git remote add cwc_server ssh://USER_NAME@SERVER_NAME:/research/rftrx/library/git_repo.git`.
* Now can push to the remote `git push cwc_server master`. Syntax of git push is `git push <remote> <local_branch>:<remote_branch>`.In order to set the defaults for ths push command, execute the `git push -u cwc_server master`.



## Showing list of branches
```
git branch -a #shows both remote and local branches
```
## Creating a branch and push it
```
git checkout -b <branch name>
git push --set-upstream origin <branch name>
```
## Staging
use the `-p` option to add individual hunks instead of complete file. you can further use `split/s` to break a given hunk into smaller chunks.

## Useful links<br> 
* [Git on a server](https://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server#_getting_git_on_a_server)
* [Supported git protocols](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols)
* [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
* [Undoing/Fixing/Removing commits from Git](http://sethrobertson.github.io/GitFixUm/fixup.html)
* [Undoing/Fixing/Removing commits from Git](https://dangitgit.com/)

# Powershell
## 'tail -f' replacement
```shell
Get-Content .\app.log -Wait
```
## 'netstat -nua'
```shell  
 Get-NetUDPEndpoint | Select-String "6666"
```

# Jekyll
Install ruby via rbenv instead of snap. Following are the steps

```bash
sudo apt install -y build-essential libssl-dev libreadline-dev zlib1g-dev libyaml-dev
# Install rbenv and ruby-build plugin
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src

# Add rbenv to PATH
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc

# Install ruby-build plugin
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

# Install Ruby
rbenv install 3.4.4 # can check the available version via rbenv install -l
# activate this Ruby version as the new default
rbenv global 3.4.4
#Install Bundler and Jekyll
gem install bundler jekyll
```
In the project directory

```bash
bundle install
bundle exec jekyll serve --livereload --incremental
```
Another way of running the same thing is via `bundle exec jekyll serve -lI`.

# Packages 
Finding which package provides a particular command/file `dpkg -S command` for example, if you want to know which package provides 'tail' then `dpkg -S tail`

# Pico 

## Pico probe connections
Copied from the Appendix A:debugprobe of the getting-started-with pico guide
```
Pico A GND -> Pico B GND
Pico A GP2 -> Pico B SWCLK
Pico A GP3 -> Pico B SWDIO
Pico A GP4/UART1 TX -> Pico B GP1/UART0 RX
Pico A GP5/UART1 RX -> Pico B GP0/UART0 TX
```
## GDB debugging
Create a .gdbinit file with the following text. 
```
target extended-remote localhost:3333
monitor reset init
continue
```
In a terminal, run openocd
```shell
sudo openocd -f interface/cmsis-dap.cfg -f target/rp2040.cfg -c "adapter speed 5000"
```
Start the debugging session via `gdb-multiarch build/elec-price-mon.elf`.
# nao QT
basically how to make the robot_settings run on the linux box
```
export QT_DEBUG_PLUGINS=1
export QT_QPA_PLATFORM=xcb
```
this will give indication which library is missing
```
Cannot load library /home/asethi/Desktop/robot-settings-2.8.6.23-linux64/plugins/platforms/libqxcb.so: (/home/asethi/Desktop/robot-settings-2.8.6.23-linux64/bin/../lib/libz.so.1: version `ZLIB_1.2.9' not found (required by /lib/x86_64-linux-gnu/libpng16.so.16))
QLibraryPrivate::loadPlugin failed on "/home/asethi/Desktop/robot-settings-2.8.6.23-linux64/plugins/platforms/libqxcb.so" : "Cannot load library /home/asethi/Desktop/robot-settings-2.8.6.23-linux64/plugins/platforms/libqxcb.so: (/home/asethi/Desktop/robot-settings-2.8.6.23-linux64/bin/../lib/libz.so.1: version `ZLIB_1.2.9' not found (required by /lib/x86_64-linux-gnu/libpng16.so.16))"
```

then copied the system libz.so to the local lib folder
```
cd robot-settings/
cd lib/
cp /lib/x86_64-linux-gnu/libz.so.1.2.11 .

rm libz.so libz.so.1  #remove old symbolik links
ln -s libz.so.1.2.11 libz.so
ln -s libz.so.1.2.11 libz.so.1
```
