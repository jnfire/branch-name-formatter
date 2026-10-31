# Releasing

*Read this in [Spanish](RELEASING-es.md).*

Versions follow [Semantic Versioning](https://semver.org/): a patch for fixes, a minor for new features, a major when something changes in a way users notice (for example the format of the data saved in the browser or of an export).

1. Put the changes of the release in `CHANGELOG.md` under a new `## [x.y.z] - date` heading.
2. Set the same version in `package.json` (`npm version x.y.z --no-git-tag-version` also updates the lockfile).
3. Merge it to `main` through a pull request. The deploy runs by itself once lint, formatting, tests and the build pass.
4. Tag the merged commit and push the tag:

   ```sh
   git checkout main && git pull
   git tag -a vx.y.z -m "vx.y.z"
   git push origin vx.y.z
   ```

5. The **Release** workflow checks that the tag matches `package.json`, takes the notes from `CHANGELOG.md` and creates the GitHub release. The link of the version in the app footer points at that release.

If the workflow fails because the changelog has no section for the version, fix `CHANGELOG.md`, delete the tag (`git push origin --delete vx.y.z`) and tag again.
