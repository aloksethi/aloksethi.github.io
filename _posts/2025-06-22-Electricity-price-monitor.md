---
title: "Electricity price monitoring"
date: 2025-06-22
categories: [Projects]
tags: [ePaper, Pi, Pico, Python, C]
layout: single
author_profile: true
toc: true
toc_sticky: true
mathjax: true 
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

### Setup
Have the basic environment setup with FreeRTOS and LWIP running.
```bash
git clone https://your/repo.git
cd your/repo
git submodule update --init --recursive
```

### miniz
using miniz Release 3.0.2 for decompressing, download from [github](https://github.com/richgel999/miniz/releases). The big problem with `tinfl_decompress_mem_to_heap` or `tinfl_decompress_mem_to_mem` is the amount of stack required, I had to increase the stack of UDP_Task to 8K. Due to this using the `tinfl_decompress`, with the context defined as a static variable.

## Power saving
### tickless mode
Tried tickless mode, didn;t work [forum post](https://forums.raspberrypi.com/viewtopic.php?t=389870). `vPortSuppressTicksAndSleep` never gets called as `prvGetExpectedIdleTime` always returned zero and according to config there has to be a time of  `2` ticks minimum (`configEXPECTED_IDLE_TIME_BEFORE_SLEEP`). checked via 
```C
#include <task.h>

void print_task_details() {
    TaskStatus_t *pxTaskStatusArray;
    UBaseType_t uxArraySize = uxTaskGetNumberOfTasks();
    
    pxTaskStatusArray = pvPortMalloc(uxArraySize * sizeof(TaskStatus_t));
    
    if (pxTaskStatusArray) {
        uxArraySize = uxTaskGetSystemState(
            pxTaskStatusArray,
            uxArraySize,
            NULL
        );
        
        for (UBaseType_t i = 0; i < uxArraySize; i++) {
            printf(
                "Task: %s, Priority: %u, State: %u\n",
                pxTaskStatusArray[i].pcTaskName,
                pxTaskStatusArray[i].uxCurrentPriority,
                pxTaskStatusArray[i].eCurrentState
            );
        }
        
        vPortFree(pxTaskStatusArray);
    }
}
```
that there are four tasks present even after killing the cyw43_ task
```
IDLE0	        0	Running (Ready)	    Default FreeRTOS idle task.
IDLE1	        0	Running (Ready)	    Secondary idle task (if SMP is used).
Tmr Svc	        4	Blocked (State=2)	FreeRTOS Timer Service task.
tcpip_thread	1	Blocked (State=2)	LWIP's TCP/IP stack thread.
```
`IDLE0` and `IDLE1` are freertos tasks only.

### Sleep mode
Currently using sleep mode from the pico-extra repo with some degree of success. Current power consumption numbers are around 60mA to 1.2mA. normally it hovers around 45mA.
```C
void sleep_fxn(void)
{
//  while(true) {
        printf("Switching to XOSC\n");
        uart_default_tx_wait_blocking();

        // Set the crystal oscillator as the dormant clock source, UART will be reconfigured from here
        // This is necessary before sending the pico into dormancy
        sleep_run_from_xosc();

        printf("Going dormant until GPIO %d goes edge high\n", WAKE_GPIO);
        uart_default_tx_wait_blocking();

        // Go to sleep until we see a high edge on GPIO 10
        sleep_goto_dormant_until_edge_high(WAKE_GPIO);

        // Re-enabling clock sources and generators.
        sleep_power_up();
        printf("Now awake for 10s\n");
//        sleep_ms(1000 * 10);
//    }
}
```
in the cyw43_task, i am calling `cyw43_arch_deinit` once i have decompressed a buffer. all the tasks still stay alive, don't know how timers will behave with this. To wake up, need an external interrupt. Currently using the Key 0 present in the waveshare e-paper shim. Had to add a pull-up vrom 3.3V out to pin4/gpio2. currently have a 200 $$\Omega$$  pull-up but should have a bit weaker one.