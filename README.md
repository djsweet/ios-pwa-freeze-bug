PWAs on iOS Freeze While Multitasking
=====================================

If you use Service Workers on PWAs on iOS, your app _will_ freeze when multitasking.

The Issue
---------

The underlying issue appears to be a race condition in the PWA container. Whenever
you switch off your PWA into some other app, your page JavaScript context and Service
Worker JavaScript context have a very brief grace period to execute before iOS pauses
your app. Normally, these contexts will be restored when your app becomes visible,
but if you use Service Workers, sometimes the contexts _don't_ get restored.

I have not been able to reproduce this without the presence of a Service Worker.

Reproducing
-----------

This repository contains just enough to reproduce the issue, albeit unreliably.
You need to host these files on a server supporting HTTPS so that the Service Worker
can be registered in the first place, then:

1. Navigate to `./jsclock.html`
2. Add the app to your home screen
3. Close the tab in Mobile Safari
4. Open the app from the home screen
5. Swipe between this app and others a few times. Eventually, the clock will freeze.

Getting More Information
------------------------

This is a very noisy app in terms of console logging. You should establish a Remote Debugging
session for both the page context and the Service Worker:

FIXME: picture

You should see the Service Worker logging once a second. If you switch apps or go back to the
Home Screen, you will see something like this:

FIXME: picture

You will reliably see the log message `Document visibility changed - true`, which means that 
the freezing does not occur while suspending the app. It occurs when attempting to resume the app.

The Service Worker will begin logging at an interval of 16ms when the visibilty status of the
app becomes hidden. That will look something like this:

FIXME: picture

However, I could not determine any correlations between timing and this bug, at least from the
standpoint of a JavaScript execution context.

This issue is easiest to trigger after the first start of the app. In this reproduction, it's
very difficult to reproduce more than once while the app is running.

Items of Interest, Not Reproduced Here
--------------------------------------

This issue was discovered by multiple users of [Glide](https://www.glideapps.com), which
allows anyone to create amazing Progressive Web Apps without code. While debugging this
issue in the context of Glide, we noticed some of the following:

1. You can pause JavaScript execution in the page itself and still freeze the Service Worker
   by multitasking, so this problem has nothing to do with the JavaScript we are executing.
2. Scrolling does not work on `overflow: scroll` divs when this happens, but normal overflow
   scrolling seems to work.
