async function s() {
  let e = await fetch("https://api.github.com/repos/actions/checkout/releases", {
    method: "GET",
    headers: {
      "user-agent": "okhttp/3.6.0"
    }
  });
  if (!e.ok)
    throw new Error(await e.text());
  let t = (await e.json()).filter((a) => !(a.prerelease || a.draft)).at(0);
  if (!t)
    throw new Error("Unable to get release");
  let [, r] = t.name.slice(1).match(
    // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
  ) || [];
  console.log(`
RELEASE_NOTES=<<EOF
${t.body}
EOF
RELEASE_VERSION_MAJOR=${r}
RELEASE_VERSION=${t.name}
`);
}
s().catch((e) => {
  console.error(e), process.exit(1);
});
