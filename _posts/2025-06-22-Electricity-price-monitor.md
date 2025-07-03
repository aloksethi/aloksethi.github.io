---
title: "Electricity price monitoring"
date: 2025-06-22
categories: [Projects]
tags: [ePaper, Pi, Pico, Python, C]
layout: single
author_profile: true
toc: true
toc_sticky: true
---

## Motivation

The current electricity contract is partially based on spot price. Due to this, some times the decision to when to start a high electricity consuming appliance is based on the current and future electricity price. This means, everytime consulting the app on phone to check electricity price. Thus, wanted to make a small display which can display the electricity price so that I don't have to fetch my phone everytime I wanted to turn on the dishwasher or washing machine.

## Design

The overall design is very simple, grab the electricity pricing from [entsoe.eu](https://transparency.entsoe.eu/dashboard/show), parse it, create a gui out of it, make an image and send the image data to the uC which will then display it on the epaper display. Why the whole project is not in C and running on the uC? Very simple answer, I wanted to get my hands dirty with Python. Also, not very comfy setting a uC facing the web, knowing that no way I am going to do any regular maintenance of the uC code.

There are two parts of the system

- written in Python and running on server (Rpi),
- written in C and running on uC (Pico W)

## Python code

The module starts from `main_loop.py`. There are three threads running

- `elec_fetch_loop`: This one is responsible for fetching the electricity data via a REST api, parse the xml data and pass it on the program.
- `renderer_loop`: Visualize the electricity data and some other things (battery status coming from Pico, weather in future), generate a bitmap for red and black colors, compress them and pass it on.
- `device_loop`: This one talks with the Pico, transfers the bitmaps and does other communication with Pico over UDP.

The version of the module 0.1.0 is now avaialble now at [github](https://github.com/aloksethi/elec_price_monitor).

### elec_fetch_loop

Following are the inputs to the API

```python
 params = {
        "securityToken": api_token,
        "in_Domain": "10YFI-1--------U", # Data for Finland
        "out_Domain": "10YFI-1--------U",
        "periodStart": start_dt.strftime("%Y%m%d%H%M"),
        "periodEnd": end_dt.strftime("%Y%m%d%H%M"),
        "documentType": "A44", # price data
    }
```

To get the security token, one has to make an online account and then request the api access via email(instructions [here](https://transparencyplatform.zendesk.com/hc/en-us/articles/12845911031188-How-to-get-security-token)). The REST api returns the data in a variable sized block (A03 – VARIABLE SIZED BLOCK in entso-e documentation). It basically means that no data is provided for a position when there is no change in data/price.
The REST api guide is available [here](https://transparencyplatform.zendesk.com/hc/en-us/articles/15692855254548-Sitemap-for-Restful-API-Integration).

Currently the data is coming for every 60 minutes but I beleive it will change sometime in the future to every 15 mins. In the response xml, it is denoted by `<resolution>PT60M</resolution>`.

## Pico W

Haven't started writing anything here.