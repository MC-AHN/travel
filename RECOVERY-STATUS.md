# Baseline Reconstruction Status

The original Git metadata was deleted, so commit `211c117` and its exact Git objects could not be restored. This folder is a best-effort reconstruction from source snapshots recorded in the Copilot session; it is not the original commit and cannot have the same commit hash.

Most JSX, data, HTML, and README content was recovered from captures made before the later Safar-specific edits. The package component's missing helper section was completed using a later capture of the same carousel logic.

Known differences:

- `src/styles.css` was reconstructed by removing later Safar-specific layout additions and reversing the documented palette conversion. Several old accent colors were mapped to shared new colors, so those individual shades cannot be reversed exactly.
- `package-lock.json` is based on the current lockfile with the original project name restored; the original lockfile itself was not captured.
- The project build was verified, but a pixel-identical comparison with commit `211c117` is impossible.

The untouched working project and its separate safety snapshot remain available outside this folder.
