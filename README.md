# Music School

A set of tools to assist with learning a musical instrument (including human voice).

For usage and feature list refer to the [introduction page](https://vchernetskyi993.github.io/music-school/).

## Motivation

There are dozens of applications that provide visual learning of notes, intervals, and similar concepts, but I haven’t found one that lets you build _mental maps directly on the instrument itself_. To address this, the **Music School** application is designed to capture sound from any instrument and validate it against the expected one. This way, you can chart pathways that connect theoretical knowledge directly to your fingertips.

## Roadmap

- [x] Github Pages
    - [x] Direct access to subpath
- [x] Github Actions
- [ ] Visualize Notes
    - [x] frequency
    - [x] letter + number
- [ ] Study Notes
    - [x] note (letter+octave) -> instrument sound
        - [x] sharps & flats
        - [x] set note range
    - [ ] note (staff) -> instrument sound
    - [x] note (digital sound) -> instrument sound
- [ ] Study Intervals
- [ ] Study Chords

## Development

### Build and Deploy

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build
- `deploy` - deploy to production

### Code Quality

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier` – checks files with Prettier
- `vitest` - runs tests
- `verify` - runs all available checks
    - It is recommended to run `verify` before each commit
- `prettier:write` – formats all files with Prettier

