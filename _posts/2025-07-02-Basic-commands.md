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

# Git
A small collection of information regarding git

## Making a remote repo on the server

* Made a bare copy of the local repo. ` git clone --bare mlab_code git_repo.git`. `mlab_code` is the name of my local folder in which I did `git init`.
* Copied the `git_repo.git` to the remote server via scp. `scp -r git_repo.git USER_NAME@SERVER_NAME:/research/rftrx/library/`.
* Went to the remote server where the empty repo was copied and initialize it again using the shared option. `git init --bare --shared`.
* At the local machine, added the remote repository as a remote ` git remote add cwc_server ssh://USER_NAME@SERVER_NAME:/research/rftrx/library/git_repo.git`.
* Now can push to the remote `git push cwc_server master`. Syntax of git push is `git push <remote> <local_branch>:<remote_branch>`.In order to set the defaults for ths push command, execute the `git push -u cwc_server master`.

## Saving password
* When on linux/WSL </br>
`git config --local credential.helper 'cache --timeout=3600000'`

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
```
bundle exec jekyll serve --livereload
```

# Packages 
Finding which package provides a particular command/file `dpkg -S command` for example, if you want to know which package provides 'tail' then `dpkg -S tail`

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
