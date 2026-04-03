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
git branch -va #show also last commit info for both local and remote
git branch --merged  #branches merged into current branch
git branch --no-merged #branches not merged into current branch

git branch --contains <commit id>  # to see which branch contains a commit
```
### More branches and merges
```
git branch [options] --merged <commit>
git branch [options] --no-merged <commit>
```
If no `<commit>` then `<commit> = HEAD`. So if you want to see branhces not merged into say Rel19 branch then
`git branch -r --no-merged origin/Rel-19`



## log command to see branches
```
git log --oneline --decorate --graph --all #show branches in graph view
```
## Creating a branch and push it
```
git checkout -b <branch name>  #old way
git switch -c <branch name> #new way
git push --set-upstream origin <branch name>
git push -u origin <branch name> #short hand for setting upstream. This helps in making further push n pull without specifying branch name
```
## Staging
use the `-p` option to add individual hunks instead of complete file. you can further use `split/s` to break a given hunk into smaller chunks.

## fetch
```
git fetch origin --prune
```
`--prune` Deletes stale remote-tracking branches, Keeps the repo as an image of server
## rebasing
```
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git switch DC_FR1_FR2_UL_config_correction
Updating files: 100% (6764/6764), done.
Switched to branch 'DC_FR1_FR2_UL_config_correction'
Your branch is up to date with 'origin/DC_FR1_FR2_UL_config_correction'.
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git rebase origin/Rel-19
Auto-merging NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json
CONFLICT (content): Merge conflict in NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json
Auto-merging NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257G.json
CONFLICT (content): Merge conflict in NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257G.json
Auto-merging NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257H.json
CONFLICT (content): Merge conflict in NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257H.json
Auto-merging NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257I.json
CONFLICT (content): Merge conflict in NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257I.json
error: could not apply 3c932ada... Fixes for FR1 and FR2 DC combinations where higher order combinations were added as part of UL configuration. Fixes are done and shared by Daniel Popp (Apple).
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: run "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
Could not apply 3c932ada... Fixes for FR1 and FR2 DC combinations where higher order combinations were added as part of UL configuration. Fixes are done and shared by Daniel Popp (Apple).
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git add NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257G.json NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257H.json NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257I.json
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git rebase --continue
[detached HEAD debaf4b4] Fixes for FR1 and FR2 DC combinations where higher order combinations were added as part of UL configuration. Fixes are done and shared by Daniel Popp (Apple). manually fixed following forur files while rebasing    NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json \         NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257G.json \         NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257H.json \         NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257I.json
 2656 files changed, 11225 insertions(+), 44156 deletions(-)
Successfully rebased and updated refs/heads/DC_FR1_FR2_UL_config_correction.
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git status
On branch DC_FR1_FR2_UL_config_correction
Your branch and 'origin/DC_FR1_FR2_UL_config_correction' have diverged,
and have 7 and 1 different commits each, respectively.
  (use "git pull" if you want to integrate the remote branch with yours)

nothing to commit, working tree clean
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git log --oneline --graph
* debaf4b4 (HEAD -> DC_FR1_FR2_UL_config_correction) Fixes for FR1 and FR2 DC combinations where higher order combinations were added as part of UL configuration. Fixes are done and shared by Daniel Popp (Apple). manually fixed following forur files while rebasing        NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json \         NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257G.json \         NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257H.json \         NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257I.json
*   f634c20b (origin/Rel-19, origin/HEAD) Merge branch 'DC_two_band_FR1__ul_config_fix' into 'Rel-19'
|\
| * 961d6f30 (origin/DC_two_band_FR1__ul_config_fix, DC_two_band_FR1__ul_config_fix) fixed UL configs in the two band DC combos in the json files.
* |   0ec20046 Merge branch 'After_RAN#111' into 'Rel-19'
|\ \
| |/
|/|
| * 84f1f0e4 (origin/After_RAN#111) Editorial: Removing empty UL config lists ("ulConfigList": [],) since that is not allowed according to the schema file.
| * 31f787a8 Corrections after review
| * 84587404 CR1465_R4-2603037
| * 29e686f5 CR1463_R4-2600141
|/
* a4d7f087 (tag: v19.4.0, origin/nokia-add-specification-and-schemaVersion, Rel-19) Removed unecessary .gitkeep
*   060c6561 Merge branch 'ericsson-initial-import-from-19.4.0-docx' into 'Rel-19'
|\
| * 9d3ddf56 Replaced invalid line breaks by comma
| * 714595c2 imported bands and BCs from 19.4.0
|/
* 2dc9e04d (origin/main) Initial repository layout
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ git push --force-with-lease origin DC_FR1_FR2_UL_config_correction
Enumerating objects: 3534, done.
Counting objects: 100% (3534/3534), done.
Delta compression using up to 14 threads
Compressing objects: 100% (553/553), done.
Writing objects: 100% (2659/2659), 219.64 KiB | 13.73 MiB/s, done.
Total 2659 (delta 2484), reused 2277 (delta 2106), pack-reused 0
remote: Resolving deltas: 100% (2484/2484), completed with 315 local objects.
remote:
remote: View merge request for DC_FR1_FR2_UL_config_correction:
remote:   https://forge.3gpp.org/rep/ran4/specifications/38.101/ts-38.101-3/-/merge_requests/4
remote:
To ssh://forge.3gpp.org:29419/ran4/specifications/38.101/ts-38.101-3.git
 + 3c932ada...debaf4b4 DC_FR1_FR2_UL_config_correction -> DC_FR1_FR2_UL_config_correction (forced update)
asethi@C-PF5WWAM2:~/win_desk/bc_Database/ts-38.101-3$ 
```
## diff and show
```
 git diff --name-only --diff-filter=U
 git show :1:NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json
 git show :2:NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json
 git show :3:NR_Inter-band_DC_FR1_and_FR2/DC_n3A-n28A-n77A-n257A.json
```
For each conflicted path, Git can keep these versions:
Stage 1 (**:1:**) = the common ancestor (“base”) version
Stage 2 (**:2:**) = ours
Stage 3 (**:3:**) = theirs
This is true during merges, cherry-picks, and rebases (rebases internally replay commits like cherry-picks, so the same mechanism applies).
During a rebase, 
“ours” (:2:) = the version from the branch you are rebasing onto (e.g., origin/Rel-19, i.e., current HEAD at the rebase point)
“theirs” (:3:) = the version from the commit being replayed (feature branch commit that Git is trying to apply)

So in case of rebasing DC_FR1_FR2_UL_config_correction_part2 onto origin/Rel-19:
:2: ==> Rel-19’s version
:3: ==> DC_FR1_FR2_UL_config_correction_part2
```
git rev-list --left-right --count origin/Rel-19...HEAD
```
**A..B** (two dots) vs **A...B** (three dots)

git rev-list  prints commit IDs reachable from some revision(s). With --count, it prints how many commits match the selection.
Two dots A..B means:
commits reachable from B that are NOT reachable from A
(i.e., “what B has that A doesn’t”)

Three dots A...B means:
commits that are reachable from either A or B, but not both
(i.e., the symmetric difference)
In other words: “What differs between the two histories.”

with `--left-right` in A...B, git can label which side each commit belongs to:
commits unique to A are “left”
commits unique to B are “right”

an output like:
`6 2` means
6 = commits that are in origin/Rel-19 but not in current branch (HEAD)→ i.e., 6 commits behind Rel‑19
2 = commits that are in HEAD but not in origin/Rel-19 → i.e., current branch is 2 commits ahead

git log --oneline HEAD..origin/Rel-19  #what is misisng
git log --oneline origin/Rel-19..HEAD  #what is there

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

# Journalctl
* To view all logs `journalctl`. The newest logs appear at the bottom by default.
* To view the current entry as first `journalctl -r`. 
* Follow logs in real-time `journalctl -f` 
* View logs from a specific service `journalctl -u elec-price-monitor`
* View logs from a specific time
```
journalctl --since "YYYY-MM-DD" 
journalctl --since "15 minutes ago" 
```
copied extract from the man page: 
```
-S, --since=, -U, --until=
           Start showing entries on or newer than the specified date, or
           on or older than the specified date, respectively. Date
           specifications should be of the format "2012-10-30 18:17:16".
           If the time part is omitted, "00:00:00" is assumed. If only
           the seconds component is omitted, ":00" is assumed. If the
           date component is omitted, the current day is assumed.
           Alternatively the strings "yesterday", "today", "tomorrow" are
           understood, which refer to 00:00:00 of the day before the
           current day, the current day, or the day after the current
           day, respectively.  "now" refers to the current time. Finally,
           relative times may be specified, prefixed with "-" or "+",
           referring to times before or after the current time,
           respectively. For complete time and date specification, see
           systemd.time(7). Note that --output=short-full prints
           timestamps that follow precisely this format.
```
* View logs from the current boot `journalctl -b`
* List past boots `journalctl --list-boots`.
* Messages from a particular boot `journalctl -b xxxxxxx`, use the id spitted by the `list-boots` option or use a number `-0` for last, `1` for the first boot found in the journal in chronological order, `2` the second, `-1` for the boot before last, and so on.  
* View only kernel messages `journalctl -k` 

# systemctl
* Shows the runtime status of a service `systemctl status elec-price-monitor`
* Start a service `systemctl start elec-price-monitor`
* Stop a service `systemctl stop elec-price-monitor`
* Restart a service `systemctl restart elec-price-monitor`
* Enable a service and start automatically at boot `systemctl enable elec-price-monitor`
* List all services `systemctl list-units --type=service --all`
* List all runnint services `systemctl list-units --type=service --state=running`
* Also check the answer on [stackexchance](https://unix.stackexchange.com/questions/517872/systemctl-list-all-possible-including-disabled-services)
