import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

/**
 *
 * @param {string} command
 * @param  {...Array<string>} args
 *
 * @returns {Promise<string>}
 */
const run = async (command, ...args) => {
  const cwd = resolve();
  return new Promise((resolve) => {
    const cmd = spawn(command, args, {
      stdio: ["inherit", "pipe", "pipe"], // Inherit stdin, pipe stdout, pipe stderr
      shell: true,
      cwd,
    });

    let output = "";

    cmd.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
      output += data.toString();
    });

    cmd.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    cmd.on("close", () => {
      resolve(output);
    });
  });
};

const main = async () => {
  const { values } = parseArgs({ options: { otp: { type: "string" } } });

  await run("pnpm changeset version");
  await run("git add .");
  await run('git commit -m "chore: update version"');
  await run("git push");
  await run("pnpm build");
  if (values.otp) await run(`pnpm changeset publish --otp=${values.otp}`);
  else await run("pnpm changeset publish");
  await run("git push --follow-tags");
  const tag = (await run("git describe --abbrev=0")).replace("\n", "");
  await run(
    `gh release create ${tag} --title ${tag} --notes "Please refer to [CHANGELOG.md](https://github.com/gbouteiller/zod-convex/blob/main/package/CHANGELOG.md) for details."`
  );
};

main();
