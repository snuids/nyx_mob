# Nyx Mobile App — **deprecated**

> **Status: deprecated, no longer maintained.**
>
> The repository is archived and read-only since **5 November 2026**. It is kept for the record.
>
> - last functional release: **v1.0.2, 31 March 2020**
> - last commit: the Quasar 0.17 → 1.14 upgrade of **16 November 2020**
> - image `snuids/nyx_mobile:v1.0.2` (amd64, March 2020) — no rebuild since, and nothing in this
>   repository builds it automatically
>
> **It is not deployed on the current NYX instance.** `energy.marmar.ovh` runs no `nyx_mobile`
> container, has no `/mobile/` route, and answers **404** on that path. The component is described in
> the [nyx](https://github.com/snuids/nyx) deployment repository only because the reference stack
> still carries the service definition.
>
> The open dependency alerts on this repository are acknowledged and will not be fixed: Quasar 1 is
> end-of-life, and clearing them means a migration to Quasar 2, not a series of lockfile bumps. The
> Dockerfile below builds `node:7.7`.
>
> If offline form capture is needed again, start from a supported framework. Do not build on this code.

## What this repository was

The offline-capable form client of the platform: Quasar 1.14 / Vue 2, served under `/mobile/`, writing
submissions back to the REST API and receiving live updates over the WebSocket server.

## Setup
* clone the project
* cd nyx_mob
* npm install

## Dev
* quasar dev

## Build
* quasar build

## Deployment
Add publicPath:'/mobile/', in quasar.conf.js

## Version
* v1.0.2 31 Mar 2020  Added the send message option of the form
